/**
 * @file Countdown.js
 * @class Countdown
 * @description Управление обратным отсчетом до Нового Года
 */

export class Countdown {
    /**
     * @constructor
     * @param {Object} options - Настройки счетчика
     */
    constructor(options = {}) {
        this.defaults = {
            targetDate: `January 1, ${new Date().getFullYear() + 1} 00:00:00`,
            updateInterval: 1000,
            elements: {
                days: 'days',
                hours: 'hours',
                minutes: 'minutes',
                seconds: 'seconds'
            }
        };
        
        this.settings = { ...this.defaults, ...options };
        this.intervalId = null;
        this.targetDate = new Date(this.settings.targetDate);
        
        this.cacheElements();
    }
    
    /**
     * @method cacheElements
     * @description Кэширует DOM-элементы
     */
    cacheElements() {
        this.elements = {};
        
        for (const [key, id] of Object.entries(this.settings.elements)) {
            this.elements[key] = document.getElementById(id);
        }
    }
    
    /**
     * @method start
     * @description Запускает счетчик
     */
    start() {
        if (this.intervalId) return;
        
        // Первое обновление
        this.update();
        
        // Запуск интервала
        this.intervalId = setInterval(() => {
            this.update();
        }, this.settings.updateInterval);
        
        console.log('⏱️ Счетчик запущен');
    }
    
    /**
     * @method stop
     * @description Останавливает счетчик
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('⏱️ Счетчик остановлен');
        }
    }
    
    /**
     * @method update
     * @description Обновляет значения счетчика
     */
    update() {
        const now = new Date();
        const diff = this.targetDate - now;
        
        // Проверка, не наступил ли Новый Год
        if (diff <= 0) {
            this.handleNewYear();
            return;
        }
        
        // Расчет временных единиц
        const time = this.calculateTimeUnits(diff);
        
        // Обновление DOM
        this.updateDisplay(time);
        
        // Специальные эффекты при приближении Нового Года
        this.checkSpecialMoments(time);
    }
    
    /**
     * @method calculateTimeUnits
     * @description Вычисляет дни, часы, минуты и секунды
     * @param {number} diff - Разница во времени в миллисекундах
     * @returns {Object}
     */
    calculateTimeUnits(diff) {
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        return {
            days: days,
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60
        };
    }
    
    /**
     * @method updateDisplay
     * @description Обновляет отображение счетчика
     * @param {Object} time - Объект с временными единицами
     */
    updateDisplay(time) {
        for (const [unit, value] of Object.entries(time)) {
            const element = this.elements[unit];
            if (element) {
                const formattedValue = String(value).padStart(2, '0');
                
                // Анимация изменения цифр
                if (element.textContent !== formattedValue) {
                    this.animateNumberChange(element, formattedValue);
                }
            }
        }
    }
    
    /**
     * @method animateNumberChange
     * @description Анимирует изменение цифр
     * @param {HTMLElement} element - DOM-элемент
     * @param {string} newValue - Новое значение
     */
    animateNumberChange(element, newValue) {
        gsap.to(element, {
            scale: 1.2,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
            onComplete: () => {
                element.textContent = newValue;
            }
        });
    }
    
    /**
     * @method checkSpecialMoments
     * @description Проверяет особые моменты (час до, 10 минут и т.д.)
     * @param {Object} time - Объект с временными единицами
     */
    checkSpecialMoments(time) {
        // Час до Нового Года
        if (time.days === 0 && time.hours === 1 && time.minutes === 0 && time.seconds === 0) {
            this.triggerSpecialEvent('hour_to_new_year');
        }
        
        // 10 минут до Нового Года
        if (time.days === 0 && time.hours === 0 && time.minutes === 10 && time.seconds === 0) {
            this.triggerSpecialEvent('ten_minutes_to_new_year');
        }
        
        // 1 минута до Нового Года
        if (time.days === 0 && time.hours === 0 && time.minutes === 1 && time.seconds === 0) {
            this.triggerSpecialEvent('one_minute_to_new_year');
        }
    }
    
    /**
     * @method triggerSpecialEvent
     * @description Запускает специальные события
     * @param {string} eventName - Название события
     */
    triggerSpecialEvent(eventName) {
        console.log(`🎯 Специальное событие: ${eventName}`);
        
        // Можно добавить дополнительные эффекты
        // Например, усилить фейерверки или изменить анимации
    }
    
    /**
     * @method handleNewYear
     * @description Обрабатывает наступление Нового Года
     */
    handleNewYear() {
        this.stop();
        
        // Показать поздравление
        this.showCongratulations();
        
        // Масштабные фейерверки
        if (window.app && window.app.getComponent('fireworks')) {
            window.app.getComponent('fireworks').massiveCelebration();
        }
        
        console.log('🎆 С НОВЫМ 2026 ГОДОМ! 🎆');
    }
    
    /**
     * @method showCongratulations
     * @description Показывает поздравление с Новым Годом
     */
    showCongratulations() {
        // Обновляем счетчик
        for (const element of Object.values(this.elements)) {
            if (element) {
                element.textContent = '00';
            }
        }
        
        // Можно добавить всплывающее поздравление
        setTimeout(() => {
            alert('🎉 С НОВЫМ 2026 ГОДОМ! 🎉');
        }, 1000);
    }
    
    /**
     * @method getRemainingTime
     * @description Возвращает оставшееся время
     * @returns {Object}
     */
    getRemainingTime() {
        const now = new Date();
        const diff = this.targetDate - now;
        return this.calculateTimeUnits(diff);
    }
    
    /**
     * @method destroy
     * @description Очищает ресурсы
     */
    destroy() {
        this.stop();
        this.elements = null;
    }
}