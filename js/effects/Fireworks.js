/**
 * @file Fireworks.js
 * @class Fireworks
 * @description Система новогодних фейерверков
 */

export class Fireworks {
    /**
     * @constructor
     * @param {Object} options - Настройки фейерверков
     */
    constructor(options = {}) {
        this.defaults = {
            canvasId: 'fireworks-canvas',
            particleCount: 120,
            minDelay: 80,
            maxDelay: 150,
            simultaneousFireworks: 8,
            fireworksPerBurst: 8,
            colors: [
                { hue: 0, saturation: 100 },    // Красный
                { hue: 15, saturation: 100 },   // Оранжево-красный
                { hue: 30, saturation: 100 },   // Оранжевый
                { hue: 45, saturation: 100 },   // Желто-оранжевый
                { hue: 60, saturation: 100 },   // Желтый
                { hue: 120, saturation: 100 },  // Зеленый
                { hue: 180, saturation: 100 },  // Голубой
                { hue: 200, saturation: 100 },  // Сине-голубой
                { hue: 240, saturation: 100 },  // Синий
                { hue: 270, saturation: 80 },   // Фиолетовый
                { hue: 300, saturation: 80 },   // Розовый
                { hue: 330, saturation: 80 },   // Красно-розовый
                { hue: 50, saturation: 100 },   // Золотой
                { hue: 220, saturation: 30 },   // Серебристый
                { hue: 40, saturation: 90 },    // Янтарный
                { hue: 150, saturation: 70 }    // Изумрудный
            ]
        };
        
        this.settings = { ...this.defaults, ...options };
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.fireworks = [];
        this.particles = [];
        this.animationId = null;
        
        this.initializeCanvas();
    }
    
    /**
     * @method initializeCanvas
     * @description Инициализирует canvas для фейерверков
     */
    initializeCanvas() {
        this.canvas = document.getElementById(this.settings.canvasId);
        
        if (!this.canvas) {
            console.error('❌ Canvas для фейерверков не найден');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Обработчик кликов для ручного запуска фейерверков
        document.addEventListener('click', (e) => this.handleClick(e));
    }
    
    /**
     * @method resizeCanvas
     * @description Изменяет размер canvas при изменении размера окна
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.backgroundColor = 'transparent';
    }
    
    /**
     * @method start
     * @description Запускает систему фейерверков
     */
    start() {
        if (this.isRunning || !this.ctx) return;
        
        this.isRunning = true;
        this.fireworks = [];
        this.particles = [];
        
        this.loop();
        console.log('🎆 Система фейерверков запущена');
    }
    
    /**
     * @method stop
     * @description Останавливает систему фейерверков
     */
    stop() {
        this.isRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        console.log('🎆 Система фейерверков остановлена');
    }
    
    /**
     * @method pause
     * @description Приостанавливает фейерверки
     */
    pause() {
        this.isRunning = false;
    }
    
    /**
     * @method resume
     * @description Возобновляет фейерверки
     */
    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop();
        }
    }
    
    /**
     * @method loop
     * @description Главный цикл анимации
     */
    loop() {
        if (!this.isRunning) return;
        
        // Очистка canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Обновление и отрисовка фейерверков
        this.updateFireworks();
        this.updateParticles();
        
        // Автоматический запуск фейерверков
        this.autoSpawn();
        
        // Следующий кадр
        this.animationId = requestAnimationFrame(() => this.loop());
    }
    
    /**
     * @method updateFireworks
     * @description Обновляет состояние фейерверков
     */
    updateFireworks() {
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            
            // Отрисовка
            firework.draw();
            
            // Обновление
            if (firework.update()) {
                // Создание частиц при взрыве
                this.createParticles(firework.x, firework.y, firework.color);
                this.fireworks.splice(i, 1);
            }
        }
    }
    
    /**
     * @method updateParticles
     * @description Обновляет состояние частиц
     */
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Отрисовка
            particle.draw();
            
            // Обновление
            if (particle.update()) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    /**
     * @method autoSpawn
     * @description Автоматически создает фейерверки
     */
    autoSpawn() {
        if (this.fireworks.length < this.settings.simultaneousFireworks) {
            const needed = Math.min(
                this.settings.simultaneousFireworks - this.fireworks.length,
                this.settings.fireworksPerBurst
            );
            
            if (needed > 0) {
                this.spawnBurst(needed);
            }
        }
    }
    
    /**
     * @method spawnFirework
     * @description Создает одиночный фейерверк
     * @param {number} x - X координата цели
     * @param {number} y - Y координата цели
     * @param {Object} color - Цвет фейерверка
     */
    spawnFirework(x, y, color = null) {
        const startX = this.randomRange(150, this.canvas.width - 150);
        const startY = this.canvas.height + 30;
        const targetX = x || this.randomRange(100, this.canvas.width - 100);
        const targetY = y || this.randomRange(150, this.canvas.height * 0.5);
        const fireworkColor = color || this.getRandomColor();
        
        this.fireworks.push(
            new FireworkParticle(startX, startY, targetX, targetY, this.ctx, fireworkColor)
        );
    }
    
    /**
     * @method spawnBurst
     * @description Создает серию фейерверков
     * @param {number} count - Количество фейерверков
     */
    spawnBurst(count = 5) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.spawnFirework();
            }, i * 150);
        }
    }
    
    /**
     * @method createParticles
     * @description Создает частицы при взрыве фейерверка
     * @param {number} x - X координата взрыва
     * @param {number} y - Y координата взрыва
     * @param {Object} color - Цвет частиц
     */
    createParticles(x, y, color) {
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push(
                new ExplosionParticle(x, y, this.ctx, color)
            );
        }
    }
    
    /**
     * @method handleClick
     * @description Обрабатывает клики для создания фейерверков
     * @param {MouseEvent} event - Событие клика
     */
    handleClick(event) {
        if (!this.isRunning || event.target.tagName === 'BUTTON') return;
        
        this.spawnFirework(event.clientX, event.clientY);
    }
    
    /**
     * @method getRandomColor
     * @description Возвращает случайный цвет из палитры
     * @returns {Object}
     */
    getRandomColor() {
        return this.settings.colors[
            Math.floor(Math.random() * this.settings.colors.length)
        ];
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
     * @method massiveCelebration
     * @description Запускает масштабное празднование
     */
    massiveCelebration() {
        this.spawnBurst(15);
        
        // Дополнительные эффекты
        setTimeout(() => this.spawnBurst(10), 1000);
        setTimeout(() => this.spawnBurst(8), 2000);
    }
    
    /**
     * @method destroy
     * @description Очищает ресурсы
     */
    destroy() {
        this.stop();
        window.removeEventListener('resize', () => this.resizeCanvas());
        document.removeEventListener('click', (e) => this.handleClick(e));
    }
}

/**
 * @class FireworkParticle
 * @description Частица фейерверка (полет)
 */
class FireworkParticle {
    constructor(x1, y1, x2, y2, ctx, color) {
        this.x = x1;
        this.y = y1;
        this.startX = x1;
        this.startY = y1;
        this.targetX = x2;
        this.targetY = y2;
        this.ctx = ctx;
        this.color = color;
        
        this.initialize();
    }
    
    initialize() {
        this.coordinates = [];
        this.coordinateCount = 3;
        
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        
        this.angle = Math.atan2(this.targetY - this.startY, this.targetX - this.startX);
        this.speed = 2;
        this.acceleration = 1.02;
        this.brightness = Math.floor(Math.random() * 20) + 70;
        this.distance = this.calculateDistance();
        this.currentDistance = 0;
    }
    
    calculateDistance() {
        const dx = this.targetX - this.startX;
        const dy = this.targetY - this.startY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    update() {
        // Сохраняем координаты для трейла
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        
        // Ускорение
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        
        // Обновление позиции
        this.x += vx;
        this.y += vy;
        
        // Расчет пройденного расстояния
        const dx = this.x - this.startX;
        const dy = this.y - this.startY;
        this.currentDistance = Math.sqrt(dx * dx + dy * dy);
        
        // Проверка достижения цели
        return this.currentDistance >= this.distance;
    }
    
    draw() {
        if (this.coordinates.length < 2) return;
        
        const last = this.coordinates.length - 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.coordinates[last][0], this.coordinates[last][1]);
        this.ctx.lineTo(this.x, this.y);
        
        const gradient = this.ctx.createLinearGradient(
            this.coordinates[last][0], this.coordinates[last][1],
            this.x, this.y
        );
        
        gradient.addColorStop(0, `hsla(${this.color.hue}, ${this.color.saturation}%, ${this.brightness}%, 0.9)`);
        gradient.addColorStop(1, `hsla(${this.color.hue}, ${this.color.saturation}%, ${this.brightness}%, 0.1)`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2.5;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }
}

/**
 * @class ExplosionParticle
 * @description Частица взрыва фейерверка
 */
class ExplosionParticle {
    constructor(x, y, ctx, color) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.color = color;
        
        this.initialize();
    }
    
    initialize() {
        this.coordinates = [];
        this.coordinateCount = 5;
        
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 9 + 1;
        this.friction = 0.95;
        this.gravity = 0.6;
        this.brightness = Math.floor(Math.random() * 25) + 70;
        this.alpha = Math.random() * 0.1 + 0.9;
        this.decay = Math.random() * 0.015 + 0.01;
    }
    
    update() {
        // Сохраняем координаты для трейла
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        
        // Замедление
        this.speed *= this.friction;
        
        // Движение
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        
        // Затухание
        this.alpha -= this.decay;
        
        return this.alpha <= 0.01;
    }
    
    draw() {
        if (this.coordinates.length < 2 || this.alpha <= 0) return;
        
        const last = this.coordinates.length - 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.coordinates[last][0], this.coordinates[last][1]);
        this.ctx.lineTo(this.x, this.y);
        
        const gradient = this.ctx.createLinearGradient(
            this.coordinates[last][0], this.coordinates[last][1],
            this.x, this.y
        );
        
        gradient.addColorStop(0, `hsla(${this.color.hue}, ${this.color.saturation}%, ${this.brightness}%, ${this.alpha})`);
        gradient.addColorStop(1, `hsla(${this.color.hue}, ${this.color.saturation}%, ${this.brightness}%, ${this.alpha * 0.3})`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = this.alpha * 2.5;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        
        // Яркое ядро
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.alpha * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${this.color.hue}, ${this.color.saturation}%, ${this.brightness}%, ${this.alpha * 0.6})`;
        this.ctx.fill();
    }
}