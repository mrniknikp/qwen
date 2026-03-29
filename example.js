const DeepSeekParser = require('./deepseek-parser');

// Создаем экземпляр парсера
const parser = new DeepSeekParser();

console.log('=== Примеры использования парсера DeepSeek ===\n');

// Пример 1: Парсинг JSON ответа в формате OpenAI
console.log('1. Парсинг стандартного API ответа:');
const apiResponse = {
    id: "chatcmpl-123",
    object: "chat.completion",
    created: 1677652288,
    model: "deepseek-chat",
    choices: [{
        index: 0,
        message: {
            role: "assistant",
            content: "Привет! Я DeepSeek, чем могу помочь?"
        },
        finish_reason: "stop"
    }],
    usage: {
        prompt_tokens: 9,
        completion_tokens: 12,
        total_tokens: 21
    }
};

const parsed1 = parser.parseResponse(apiResponse);
console.log('Content:', parsed1.content);
console.log('Role:', parsed1.role);
console.log('Model:', parsed1.model);
console.log('Usage:', JSON.stringify(parsed1.usage));
console.log();

// Пример 2: Парсинг строкового JSON
console.log('2. Парсинг строкового JSON:');
const jsonString = JSON.stringify({
    choices: [{
        message: {
            content: "Ответ в виде строки JSON"
        }
    }]
});

const parsed2 = parser.parseResponse(jsonString);
console.log('Content:', parsed2.content);
console.log();

// Пример 3: Извлечение текста
console.log('3. Быстрое извлечение текста:');
const text = parser.extractText({
    choices: [{
        message: { content: "Только текст ответа" }
    }]
});
console.log('Text:', text);
console.log();

// Пример 4: Парсинг простого текста
console.log('4. Парсинг простого текста (не JSON):');
const plainText = "Это простой текстовый ответ";
const parsed4 = parser.parseResponse(plainText);
console.log('Content:', parsed4.content);
console.log('Type:', parsed4.type);
console.log();

// Пример 5: Парсинг SSE чанка
console.log('5. Парсинг потокового чанка (SSE):');
const sseChunk = 'data: {"choices":[{"message":{"content":"Потоковый ответ"}}]}';
const parsed5 = parser.parseStreamChunk(sseChunk);
console.log('Done:', parsed5.done);
console.log('Content:', parsed5.data?.content);
console.log();

// Пример 6: Чанк [DONE]
console.log('6. Чанк окончания потока:');
const doneChunk = 'data: [DONE]';
const parsed6 = parser.parseStreamChunk(doneChunk);
console.log('Done:', parsed6.done);
console.log();

// Пример 7: Парсинг скопированного из браузера
console.log('7. Парсинг текста из браузера:');
const browserCopy = `
Некоторый текст
{
    "choices": [
        {
            "message": {
                "content": "Извлеченный контент из браузера"
            }
        }
    ]
}
Еще текст
`;
const parsed7 = parser.parseBrowserCopy(browserCopy);
console.log('Content:', parsed7.content);
console.log('Type:', parsed7.type);
console.log();

// Пример 8: Работа с потоком (имитация)
console.log('8. Пример работы с потоком:');
async function streamExample() {
    // Имитация асинхронного итератора
    const mockStream = {
        async *[Symbol.asyncIterator]() {
            yield 'data: {"choices":[{"message":{"content":"Первый чанк"}}]}';
            yield 'data: {"choices":[{"message":{"content":" Второй чанк"}}]}';
            yield 'data: [DONE]';
        }
    };

    console.log('Потоковые данные:');
    for await (const chunk of parser.parseStream(mockStream)) {
        if (chunk.content) {
            console.log(' -', chunk.content);
        }
    }
}

streamExample().then(() => {
    console.log('\n=== Все примеры завершены ===');
});
