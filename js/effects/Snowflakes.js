/**
 * @file Snowflakes.js
 * @class Snowflakes
 * @description Система мерцающих снежинок
 */

export class Snowflakes {
    /**
     * @constructor
     * @param {Object} options - Настройки снежинок
     */
    constructor(options = {}) {
        this.defaults = {
            containerId: 'custom-snow',
            count: 220,
            minSize: 0.7,
            maxSize: 2.2,
            minOpacity: 0.5,
            maxOpacity: 1.0,
            animations: ['rotate', 'pulse', 'twinkle'],
            minDuration: 3,
            maxDuration: 7,
            maxDelay: 5
        };
        
        this.settings = { ...this.defaults, ...options };
        this.container = null;
        this.snowflakes = [];
        
        this.initialize();
    }
    
    /**
     * @method initialize
     * @description Инициализирует систему снежинок
     */
    initialize() {
        this.container = document.getElementById(this.settings.containerId);
        
        if (!this.container) {
            console.error('❌ Контейнер для снежинок не найден');
            return;
        }
        
        this.createSnowflakes();
        console.log('❄️ Система снежинок инициализирована');
    }
    
    /**
     * @method createSnowflakes
     * @description Создает снежинки
     */
    createSnowflakes() {
        for (let i = 0; i < this.settings.count; i++) {
            this.createSnowflake(i);
        }
    }
    
    /**
     * @method createSnowflake
     * @description Создает одну снежинку
     * @param {number} index - Индекс снежинки
     */
    createSnowflake(index) {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '❄';
        snowflake.classList.add('snowflake');
        
        // Случайные параметры
        const size = this.randomRange(this.settings.minSize, this.settings.maxSize);
        const opacity = this.randomRange(this.settings.minOpacity, this.settings.maxOpacity);
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const animation = this.getRandomAnimation();
        const duration = this.randomRange(this.settings.minDuration, this.settings.maxDuration);
        const delay = Math.random() * this.settings.maxDelay;
        
        // Применение стилей
        snowflake.style.cssText = `
            position: absolute;
            left: ${left}vw;
            top: ${top}vh;
            font-size: ${size}em;
            opacity: ${opacity};
            color: rgba(255, 255, 255, ${opacity});
            pointer-events: none;
            user-select: none;
            z-index: 1;
            animation: ${animation} ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
        `;
        
        this.container.appendChild(snowflake);
        this.snowflakes.push(snowflake);
    }
    
    /**
     * @method getRandomAnimation
     * @description Возвращает случайное имя анимации
     * @returns {string}
     */
    getRandomAnimation() {
        const animations = this.settings.animations;
        return animations[Math.floor(Math.random() * animations.length)];
    }
    
    /**
     * @method randomRange
     * @description Генерирует случайное число в диапазоне
     * @param {number} min - Минимальное значение
     * @param {number} max - Максимальное значение
     * @returns {number}
     */
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * @method update
     * @description Обновляет параметры снежинок (для динамических эффектов)
     */
    update() {
        // Можно добавить динамическое обновление параметров
        // Например, изменение прозрачности в зависимости от времени суток
    }
    
    /**
     * @method destroy
     * @description Удаляет все снежинки
     */
    destroy() {
        this.snowflakes.forEach(snowflake => {
            if (snowflake.parentNode === this.container) {
                this.container.removeChild(snowflake);
            }
        });
        
        this.snowflakes = [];
    }
    
    /**
     * @method recreate
     * @description Пересоздает снежинки
     * @param {number} newCount - Новое количество снежинок
     */
    recreate(newCount = null) {
        this.destroy();
        
        if (newCount !== null) {
            this.settings.count = newCount;
        }
        
        this.createSnowflakes();
    }
}