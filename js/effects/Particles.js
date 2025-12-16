/**
 * @file Particles.js
 * @class Particles
 * @description Управление частицами с использованием tsParticles
 */

export class Particles {
    /**
     * @constructor
     * @param {Object} options - Настройки частиц
     */
    constructor(options = {}) {
        this.defaults = {
            containerId: 'tsparticles',
            autoPlay: true,
            responsive: true,
            preset: 'snow',
            customConfig: null,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    }
                }
            },
            performance: {
                maxParticles: 100,
                limitFPS: 60
            }
        };
        
        this.settings = { ...this.defaults, ...options };
        this.container = null;
        this.particlesInstance = null;
        this.isLoaded = false;
        
        this.initialize();
    }
    
    /**
     * @method initialize
     * @description Инициализирует систему частиц
     */
    async initialize() {
        this.container = document.getElementById(this.settings.containerId);
        
        if (!this.container) {
            console.error('❌ Контейнер для частиц не найден');
            return;
        }
        
        // Проверяем доступность tsParticles
        if (typeof tsParticles === 'undefined') {
            console.error('❌ tsParticles не загружен');
            this.loadFallbackParticles();
            return;
        }
        
        try {
            await this.loadParticles();
            this.isLoaded = true;
            console.log('✨ Система частиц инициализирована');
        } catch (error) {
            console.error('❌ Ошибка загрузки частиц:', error);
            this.loadFallbackParticles();
        }
    }
    
    /**
     * @method loadParticles
     * @description Загружает частицы с выбранной конфигурацией
     * @returns {Promise}
     */
    async loadParticles() {
        const config = this.getParticlesConfig();
        
        this.particlesInstance = await tsParticles.load(
            this.settings.containerId,
            config
        );
        
        // Сохраняем ссылку на инстанс
        this.container.particlesInstance = this.particlesInstance;
    }
    
    /**
     * @method getParticlesConfig
     * @description Возвращает конфигурацию частиц
     * @returns {Object}
     */
    getParticlesConfig() {
        // Если передан кастомный конфиг, используем его
        if (this.settings.customConfig) {
            return this.settings.customConfig;
        }
        
        // Конфиг для новогодней темы
        return {
            background: {
                color: {
                    value: "transparent"
                }
            },
            fpsLimit: this.settings.performance.limitFPS,
            interactivity: {
                events: {
                    onHover: {
                        enable: this.settings.interactivity.events.onHover.enable,
                        mode: this.settings.interactivity.events.onHover.mode,
                        parallax: {
                            enable: true,
                            smooth: 10,
                            force: 60
                        }
                    },
                    onClick: {
                        enable: this.settings.interactivity.events.onClick.enable,
                        mode: this.settings.interactivity.events.onClick.mode
                    }
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        quantity: 4
                    },
                    bubble: {
                        distance: 200,
                        size: 20,
                        duration: 2,
                        opacity: 0.8
                    }
                }
            },
            particles: {
                color: {
                    value: ["#ffffff", "#ffdf80", "#b30000", "#00ff00", "#0099ff"]
                },
                move: {
                    direction: "bottom",
                    enable: true,
                    outModes: {
                        default: "out"
                    },
                    random: true,
                    speed: {
                        min: 0.5,
                        max: 2
                    },
                    straight: false
                },
                number: {
                    density: {
                        enable: true,
                        area: 800
                    },
                    value: 80
                },
                opacity: {
                    value: {
                        min: 0.3,
                        max: 0.8
                    },
                    animation: {
                        enable: true,
                        speed: 1,
                        sync: false
                    }
                },
                shape: {
                    type: ["circle", "square", "triangle", "star", "polygon"]
                },
                size: {
                    value: {
                        min: 1,
                        max: 5
                    },
                    animation: {
                        enable: true,
                        speed: 4,
                        minimumValue: 0.3,
                        sync: false
                    }
                },
                wobble: {
                    enable: true,
                    distance: 10,
                    speed: 10
                },
                shadow: {
                    enable: true,
                    color: "#000000",
                    blur: 5,
                    offset: {
                        x: 3,
                        y: 3
                    }
                },
                twinkle: {
                    particles: {
                        enable: true,
                        color: "#FFD700",
                        frequency: 0.05,
                        opacity: 1
                    }
                }
            },
            detectRetina: true,
            themes: [
                {
                    name: "light",
                    default: {
                        value: true,
                        mode: "light"
                    },
                    options: {
                        background: {
                            color: "transparent"
                        },
                        particles: {
                            color: {
                                value: ["#000000", "#333333"]
                            }
                        }
                    }
                },
                {
                    name: "dark",
                    default: {
                        value: true,
                        mode: "dark"
                    },
                    options: {
                        background: {
                            color: "transparent"
                        },
                        particles: {
                            color: {
                                value: ["#ffffff", "#ffdf80"]
                            }
                        }
                    }
                }
            ]
        };
    }
    
    /**
     * @method loadFallbackParticles
     * @description Загружает простые частицы как запасной вариант
     */
    loadFallbackParticles() {
        console.log('🔄 Загрузка запасных частиц...');
        
        // Простая реализация частиц на canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'fallback-particles';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(canvas);
        this.createSimpleParticles(canvas);
    }
    
    /**
     * @method createSimpleParticles
     * @description Создает простые частицы на canvas
     * @param {HTMLCanvasElement} canvas - Canvas элемент
     */
    createSimpleParticles(canvas) {
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        // Настройка размера canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Создание частиц
        class SimpleParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 + 0.5;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.y > canvas.height) {
                    this.y = 0;
                    this.x = Math.random() * canvas.width;
                }
                
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Инициализация частиц
        for (let i = 0; i < particleCount; i++) {
            particles.push(new SimpleParticle());
        }
        
        // Анимация
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * @method play
     * @description Запускает анимацию частиц
     */
    play() {
        if (this.particlesInstance && this.particlesInstance.play) {
            this.particlesInstance.play();
        }
    }
    
    /**
     * @method pause
     * @description Приостанавливает анимацию частиц
     */
    pause() {
        if (this.particlesInstance && this.particlesInstance.pause) {
            this.particlesInstance.pause();
        }
    }
    
    /**
     * @method refresh
     * @description Перезапускает частицы
     */
    async refresh() {
        if (this.particlesInstance && this.particlesInstance.refresh) {
            await this.particlesInstance.refresh();
        }
    }
    
    /**
     * @method changeTheme
     * @description Изменяет тему частиц
     * @param {string} themeName - Название темы
     */
    async changeTheme(themeName) {
        if (this.particlesInstance && this.particlesInstance.setTheme) {
            await this.particlesInstance.setTheme(themeName);
        }
    }
    
    /**
     * @method updateOptions
     * @description Обновляет настройки частиц
     * @param {Object} options - Новые настройки
     */
    async updateOptions(options) {
        if (this.particlesInstance) {
            // tsParticles API может отличаться, проверяем доступные методы
            if (typeof this.particlesInstance.options === 'function') {
                this.particlesInstance.options(options);
            }
        }
    }
    
    /**
     * @method destroy
     * @description Уничтожает систему частиц
     */
    destroy() {
        if (this.particlesInstance && this.particlesInstance.destroy) {
            this.particlesInstance.destroy();
        }
        
        // Удаляем fallback canvas если есть
        const fallbackCanvas = document.getElementById('fallback-particles');
        if (fallbackCanvas) {
            fallbackCanvas.remove();
        }
        
        this.particlesInstance = null;
        this.container = null;
    }
}