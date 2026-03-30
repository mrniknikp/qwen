#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Простое приложение для переписки на PyQt5.
Работает на Windows и Linux.
"""

import sys
from datetime import datetime
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QTextEdit, QLineEdit, QPushButton, QLabel, QScrollArea,
    QFrame, QSplitter
)
from PyQt5.QtCore import Qt, QSize
from PyQt5.QtGui import QFont, QColor, QPalette


class MessageBubble(QFrame):
    """Виджет сообщения в виде пузырька"""
    
    def __init__(self, text, is_sender=True, parent=None):
        super().__init__(parent)
        self.is_sender = is_sender
        
        # Настройка стиля
        self.setFrameShape(QFrame.StyledPanel)
        self.setFrameShadow(QFrame.Raised)
        
        # Основной макет
        layout = QVBoxLayout(self)
        layout.setContentsMargins(10, 5, 10, 5)
        
        # Текст сообщения
        self.label = QLabel(text)
        self.label.setWordWrap(True)
        self.label.setTextInteractionFlags(Qt.TextSelectableByMouse)
        layout.addWidget(self.label)
        
        # Время
        time_str = datetime.now().strftime("%H:%M")
        self.time_label = QLabel(time_str)
        self.time_label.setStyleSheet("font-size: 10px; color: gray;")
        if is_sender:
            self.time_label.setAlignment(Qt.AlignRight)
        else:
            self.time_label.setAlignment(Qt.AlignLeft)
        layout.addWidget(self.time_label)
        
        # Стили для отправителя и получателя
        if is_sender:
            self.setStyleSheet("""
                QFrame {
                    background-color: #DCF8C6;
                    border-radius: 10px;
                    margin-left: 50px;
                }
            """)
            self.label.setAlignment(Qt.AlignLeft)
        else:
            self.setStyleSheet("""
                QFrame {
                    background-color: #FFFFFF;
                    border-radius: 10px;
                    margin-right: 50px;
                }
            """)
            self.label.setAlignment(Qt.AlignLeft)


class ChatWindow(QMainWindow):
    """Основное окно чата"""
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("UserApp - Чат")
        self.setMinimumSize(600, 500)
        self.resize(800, 600)
        
        # Центральный виджет
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Основной макет
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(10, 10, 10, 10)
        main_layout.setSpacing(10)
        
        # Заголовок
        header = QLabel("💬 UserApp Чат")
        header.setFont(QFont("Arial", 16, QFont.Bold))
        header.setAlignment(Qt.AlignCenter)
        header.setStyleSheet("padding: 10px; color: #333;")
        main_layout.addWidget(header)
        
        # Область сообщений
        self.messages_container = QWidget()
        self.messages_layout = QVBoxLayout(self.messages_container)
        self.messages_layout.setSpacing(10)
        self.messages_layout.addStretch()
        
        # Scroll area для сообщений
        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setWidget(self.messages_container)
        self.scroll_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.scroll_area.setStyleSheet("""
            QScrollArea {
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f5f5f5;
            }
        """)
        main_layout.addWidget(self.scroll_area, 1)
        
        # Область ввода
        input_layout = QHBoxLayout()
        input_layout.setSpacing(10)
        
        # Поле ввода
        self.message_input = QLineEdit()
        self.message_input.setPlaceholderText("Введите сообщение...")
        self.message_input.setFont(QFont("Arial", 12))
        self.message_input.setStyleSheet("""
            QLineEdit {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 20px;
                background-color: white;
            }
            QLineEdit:focus {
                border: 1px solid #4CAF50;
            }
        """)
        self.message_input.returnPressed.connect(self.send_message)
        input_layout.addWidget(self.message_input, 1)
        
        # Кнопка отправки
        self.send_button = QPushButton("➤")
        self.send_button.setFixedSize(50, 50)
        self.send_button.setFont(QFont("Arial", 14, QFont.Bold))
        self.send_button.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 25px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
            QPushButton:pressed {
                background-color: #3d8b40;
            }
        """)
        self.send_button.clicked.connect(self.send_message)
        input_layout.addWidget(self.send_button)
        
        main_layout.addLayout(input_layout)
        
        # Добавить приветственные сообщения
        self.add_message("Привет! Добро пожаловать в UserApp Чат!", is_sender=False)
        self.add_message("Вы можете писать сообщения здесь.", is_sender=False)
    
    def add_message(self, text, is_sender=True):
        """Добавить сообщение в чат"""
        bubble = MessageBubble(text, is_sender)
        bubble.setMaximumWidth(400)
        
        # Вставляем перед stretch
        count = self.messages_layout.count()
        if count > 0:
            self.messages_layout.insertWidget(count - 1, bubble)
        else:
            self.messages_layout.addWidget(bubble)
        
        # Прокрутка вниз
        self.scroll_to_bottom()
    
    def scroll_to_bottom(self):
        """Прокрутить область сообщений вниз"""
        scrollbar = self.scroll_area.verticalScrollBar()
        scrollbar.setValue(scrollbar.maximum())
    
    def send_message(self):
        """Отправить сообщение"""
        text = self.message_input.text().strip()
        if text:
            self.add_message(text, is_sender=True)
            self.message_input.clear()
            
            # Автоответ для демонстрации
            self.auto_reply()
    
    def auto_reply(self):
        """Автоматический ответ для демонстрации"""
        replies = [
            "Интересно! Расскажите подробнее.",
            "Понял вас!",
            "Хорошо, спасибо за сообщение.",
            "Да, согласен!",
            "Отличная идея!",
            "Я всего лишь демо-приложение, но я слушаю! 😊"
        ]
        
        # Имитация задержки ответа
        import random
        reply = random.choice(replies)
        
        # Используем QTimer для имитации задержки
        from PyQt5.QtCore import QTimer
        QTimer.singleShot(1000, lambda: self.add_message(reply, is_sender=False))


def main():
    """Точка входа приложения"""
    app = QApplication(sys.argv)
    
    # Установка стиля приложения
    app.setStyle("Fusion")
    
    # Создание и показ окна
    window = ChatWindow()
    window.show()
    
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
