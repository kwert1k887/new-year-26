import { Countdown } from './Countdown.js';
import { FactsManager } from './FactsManager.js';
import { Modal } from '../ui/Modal.js';
import { Animations } from '../ui/Animations.js';
import { Fireworks } from '../effects/Fireworks.js';
import { Snowflakes } from '../effects/Snowflakes.js';
import { Particles } from '../effects/Particles.js';

/**
 * @file App.js
 * @class App
 * @description Главный класс новогоднего приложения
 * @author Kwert887
 * @version 1.0.0
 * @created 16.12.2025
 */

export class App {
    /**
     * @constructor
     * @description Инициализирует все компоненты приложения
     */
    constructor() {
        this.components = {};
        this.isInitialized = false;
        
        this.logWelcomeMessage();
    }
    
    /**
     * @method initialize
     * @description Инициализирует все компоненты приложения
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Инициализация компонентов
            this.components.countdown = new Countdown();
            this.components.factsManager = new FactsManager();
            this.components.modal = new Modal();
            this.components.animations = new Animations();
            
            // Инициализация визуальных эффектов
            await this.initializeEffects();
            
            // Настройка обработчиков событий
            this.setupEventListeners();
            
            // Запуск приложения
            this.start();
            
            this.isInitialized = true;
            console.log('🎉 Приложение успешно инициализировано!');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации приложения:', error);
        }
    }
    
    /**
     * @method initializeEffects
     * @description Инициализирует все визуальные эффекты
     * @returns {Promise<void>}
     */
    async initializeEffects() {
        // Инициализация в фоновом режиме для производительности
        setTimeout(() => {
            this.components.fireworks = new Fireworks();
            this.components.snowflakes = new Snowflakes();
            this.components.particles = new Particles();
        }, 500);
    }
    
    /**
     * @method setupEventListeners
     * @description Настраивает обработчики событий
     */
    setupEventListeners() {
        const ctaButton = document.querySelector('.cta-button');
        
        if (ctaButton) {
            ctaButton.addEventListener('click', () => this.handleCTAClick());
        }
        
        // Обработка изменения видимости страницы
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }
    
    /**
     * @method handleCTAClick
     * @description Обрабатывает клик по основной кнопке
     */
    handleCTAClick() {
        // Анимация кнопки
        if (this.components.animations) {
            this.components.animations.animateButtonClick();
        }
        
        // Получение случайного факта
        const fact = this.components.factsManager.getRandomFact();
        
        // Отображение модального окна
        setTimeout(() => {
            this.components.modal.show(fact);
            
            // Запуск фейерверков при показе факта
            if (this.components.fireworks) {
                this.components.fireworks.spawnBurst(5);
            }
        }, 200);
    }
    
    /**
     * @method handleVisibilityChange
     * @description Обрабатывает изменение видимости страницы
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Пауза анимаций при скрытии страницы
            if (this.components.fireworks) {
                this.components.fireworks.pause();
            }
        } else {
            // Возобновление анимаций при показе страницы
            if (this.components.fireworks) {
                this.components.fireworks.resume();
            }
        }
    }
    
    /**
     * @method start
     * @description Запускает основную логику приложения
     */
    start() {
        // Запуск счетчика
        this.components.countdown.start();
        
        // Запуск анимаций интерфейса
        this.components.animations.initialize();
        
        console.log('🚀 Приложение запущено!');
    }
    
    /**
     * @method logWelcomeMessage
     * @description Выводит приветственное сообщение в консоль
     */
    logWelcomeMessage() {
        console.log('%c🎄 Новогодний отсчет 2026 🎄', 
            'color: #b30000; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
        
        console.log('%c✨ Автор: Кирилл (kwert887)\n📦 Версия: 1.0.0\n📅 Дата: 16.12.2025 ✨', 
            'color: #ffdf80; font-size: 14px;');
        
        console.log('%c🌟 Пусть ваш код всегда будет чистым,\n   а Новый Год принесет новые идеи! 🌟', 
            'color: #00ff00; font-size: 12px; font-style: italic;');
    }
    
    /**
     * @method getComponent
     * @description Получает компонент по имени
     * @param {string} name - Имя компонента
     * @returns {Object|null}
     */
    getComponent(name) {
        return this.components[name] || null;
    }
}

// Экспорт класса
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}