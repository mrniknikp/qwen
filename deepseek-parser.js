/**
 * Парсер ответов DeepSeek (Дипсик) для Node.js и браузера
 * Поддерживает различные форматы ответов
 */

class DeepSeekParser {
    /**
     * Парсит ответ от DeepSeek API
     * @param {string|object} response - Ответ от API (строка или объект)
     * @returns {object} Распарсенные данные
     */
    parseResponse(response) {
        let data;

        // Если строка, пытаемся распарсить как JSON
        if (typeof response === 'string') {
            try {
                data = JSON.parse(response);
            } catch (e) {
                // Если не JSON, возвращаем как текст
                return {
                    content: response,
                    raw: response,
                    type: 'text'
                };
            }
        } else {
            data = response;
        }

        // Обрабатываем разные форматы ответов DeepSeek
        const result = {
            content: null,
            role: null,
            model: null,
            usage: null,
            finishReason: null,
            raw: data,
            type: 'api_response'
        };

        // Формат OpenAI-compatible API
        if (data.choices && Array.isArray(data.choices)) {
            const choice = data.choices[0];
            result.content = choice.message?.content || choice.text || null;
            result.role = choice.message?.role || null;
            result.finishReason = choice.finish_reason || null;
        }

        // Прямой формат с content
        if (data.content) {
            result.content = data.content;
        }

        // Метаданные
        result.model = data.model || null;
        result.usage = data.usage || null;
        result.id = data.id || null;
        result.created = data.created || null;

        return result;
    }

    /**
     * Извлекает текст из ответа
     * @param {string|object} response 
     * @returns {string}
     */
    extractText(response) {
        const parsed = this.parseResponse(response);
        return parsed.content || '';
    }

    /**
     * Парсит потоковый ответ (SSE - Server Sent Events)
     * @param {string} chunk - Чанк данных
     * @returns {object|null}
     */
    parseStreamChunk(chunk) {
        // Удаляем префикс "data: " если есть
        let data = chunk.trim();
        
        if (data.startsWith('data: ')) {
            data = data.slice(6);
        }

        // Проверяем на конец потока
        if (data === '[DONE]') {
            return { done: true };
        }

        try {
            const parsed = JSON.parse(data);
            return {
                done: false,
                data: this.parseResponse(parsed)
            };
        } catch (e) {
            return {
                done: false,
                error: 'Failed to parse chunk',
                raw: data
            };
        }
    }

    /**
     * Парсит копируемый текст из браузера (например, из консоли или страницы)
     * @param {string} text - Текст, скопированный из браузера
     * @returns {object}
     */
    parseBrowserCopy(text) {
        const result = {
            content: '',
            metadata: {},
            warnings: []
        };

        // Пытаемся найти JSON в тексте
        const jsonMatch = text.match(/\{[\s\S]*"choices"[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const jsonData = JSON.parse(jsonMatch[0]);
                return this.parseResponse(jsonData);
            } catch (e) {
                result.warnings.push('Found JSON but failed to parse');
            }
        }

        // Если это просто текст ответа
        result.content = text.trim();
        result.type = 'browser_text';
        
        return result;
    }

    /**
     * Асинхронный парсер для потоковых ответов
     * @param {ReadableStream|AsyncIterable} stream 
     * @returns {AsyncGenerator}
     */
    async *parseStream(stream) {
        const reader = stream.getReader ? stream.getReader() : null;
        
        if (reader) {
            // Browser ReadableStream
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const decoder = new TextDecoder();
                const chunk = decoder.decode(value);
                const parsed = this.parseStreamChunk(chunk);
                
                if (parsed.done) break;
                if (parsed.data) yield parsed.data;
            }
        } else if (stream[Symbol.asyncIterator]) {
            // Node.js AsyncIterable
            for await (const chunk of stream) {
                const parsed = this.parseStreamChunk(chunk.toString());
                if (parsed.done) break;
                if (parsed.data) yield parsed.data;
            }
        }
    }
}

// Экспорт для разных сред
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = DeepSeekParser;
} else {
    // Браузер
    window.DeepSeekParser = DeepSeekParser;
}
