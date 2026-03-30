# UserApp - Простое приложение для переписки на PyQt5

Приложение работает как на **Windows**, так и на **Linux**.

## Установка

### 1. Установите зависимости

```bash
pip install -r requirements.txt
```

Или вручную:

```bash
pip install PyQt5
```

### 2. Запуск приложения

**На Windows:**
```bash
python chat_app.py
```

**На Linux:**
```bash
python3 chat_app.py
```

Если возникают проблемы с отображением на Linux, попробуйте:
```bash
QT_QPA_PLATFORM=xcb python3 chat_app.py
```

или

```bash
export QT_QPA_PLATFORM=xcb
python3 chat_app.py
```

## Возможности

- 💬 Отправка сообщений
- 📝 Автоматические ответы для демонстрации
- 🕐 Отображение времени отправки
- 🎨 Современный дизайн в стиле мессенджеров
- ⌨️ Отправка по нажатию Enter
- 📜 Автопрокрутка к новым сообщениям

## Структура проекта

```
/workspace/
├── chat_app.py          # Основной файл приложения
├── requirements.txt     # Зависимости Python
└── README.md           # Этот файл
```

## Как это работает

1. При запуске открывается окно чата с приветственными сообщениями
2. Введите текст в поле ввода внизу окна
3. Нажмите кнопку "➤" или клавишу Enter для отправки
4. Приложение автоматически ответит через 1 секунду (демонстрация)

## Системные требования

- Python 3.6+
- PyQt5
- Windows 7/8/10/11 или Linux с X11/Wayland

## Примечания

- На Linux могут потребоваться дополнительные библиотеки:
  ```bash
  sudo apt-get install libxcb-xinerama0 libxkbcommon-x11-0 libegl1-mesa
  ```

- Для работы в headless-режиме (без графического интерфейса) используйте:
  ```bash
  QT_QPA_PLATFORM=offscreen python chat_app.py
  ```
