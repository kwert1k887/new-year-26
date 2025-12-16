/**
 * @file Animations.js
 * @class Animations
 * @description Управление анимациями интерфейса с использованием GSAP
 */

export class Animations {
    /**
     * @constructor
     * @param {Object} options - Настройки анимаций
     */
    constructor(options = {}) {
        this.defaults = {
            animationDuration: 1.5,
            staggerDelay: 0.2,
            buttonAnimationDelay: 1.5,
            useReducedMotion: false,
            debugMode: false
        };
        
        this.settings = { ...this.defaults, ...options };
        this.timelines = {};
        this.animations = {};
        this.isInitialized = false;
        
        // Проверка на предпочтение reduced motion
        this.checkReducedMotion();
    }
    
    /**
     * @method initialize
     * @description Инициализирует все анимации
     */
    initialize() {
        if (this.isInitialized) return;
        
        this.animateHeader();
        this.animateCountdown();
        this.animateButton();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        
        this.isInitialized = true;
        
        if (this.settings.debugMode) {
            console.log('🎬 Анимации инициализированы');
        }
    }
    
    /**
     * @method checkReducedMotion
     * @description Проверяет предпочтение пользователя на reduced motion
     */
    checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.settings.useReducedMotion = true;
            this.settings.animationDuration *= 0.5; // Уменьшаем длительность
            
            if (this.settings.debugMode) {
                console.log('🔇 Включен режим reduced motion');
            }
        }
        
        // Отслеживаем изменения предпочтений
        prefersReducedMotion.addEventListener('change', (e) => {
            this.settings.useReducedMotion = e.matches;
        });
    }
    
    /**
     * @method animateHeader
     * @description Анимирует заголовок и подзаголовок
     */
    animateHeader() {
        const header = document.querySelector('h1');
        const subheader = document.querySelector('h2');
        
        if (!header || !subheader) return;
        
        // Анимация подзаголовка
        gsap.from(subheader, {
            opacity: 0,
            y: -30,
            duration: this.settings.animationDuration * 0.8,
            ease: "power3.out",
            delay: 0.3
        });
        
        // Анимация заголовка
        this.timelines.header = gsap.timeline({
            defaults: { ease: "power3.out" }
        });
        
        this.timelines.header
            .from(header, {
                opacity: 0,
                y: -40,
                duration: this.settings.animationDuration,
                scale: 1.2
            })
            .to(header, {
                scale: 1.05,
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            }, "-=0.5");
    }
    
    /**
     * @method animateCountdown
     * @description Анимирует элементы счетчика
     */
    animateCountdown() {
        const timeBoxes = document.querySelectorAll('.time-box');
        
        if (!timeBoxes.length) return;
        
        this.timelines.countdown = gsap.timeline({
            defaults: { ease: "back.out(1.7)" }
        });
        
        timeBoxes.forEach((box, index) => {
            this.timelines.countdown.from(box, {
                opacity: 0,
                scale: 0.5,
                y: 50,
                rotation: index % 2 === 0 ? -10 : 10,
                duration: this.settings.animationDuration * 0.7
            }, index * this.settings.staggerDelay);
        });
        
        // Пульсирующий эффект для секунд
        const secondsBox = document.querySelector('.time-box:last-child');
        if (secondsBox) {
            setInterval(() => {
                if (!document.hidden) {
                    gsap.to(secondsBox, {
                        scale: 1.05,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.out"
                    });
                }
            }, 1000);
        }
    }
    
    /**
     * @method animateButton
     * @description Анимирует появление кнопки CTA
     */
    animateButton() {
        const ctaButton = document.querySelector('.cta-button');
        
        if (!ctaButton) return;
        
        // Изначально скрываем
        gsap.set(ctaButton, {
            opacity: 0,
            scale: 0.8,
            y: 20
        });
        
        // Анимация появления с задержкой
        setTimeout(() => {
            this.timelines.button = gsap.timeline({
                defaults: { ease: "elastic.out(1, 0.8)" }
            });
            
            this.timelines.button
                .to(ctaButton, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: this.settings.animationDuration
                })
                .to(ctaButton, {
                    rotation: 2,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 3
                }, "+=0.5");
            
            // Добавляем класс для CSS-анимаций
            ctaButton.classList.add('animated');
            
        }, this.settings.buttonAnimationDelay * 1000);
    }
    
    /**
     * @method animateButtonClick
     * @description Анимирует клик по кнопке
     */
    animateButtonClick() {
        const ctaButton = document.querySelector('.cta-button');
        
        if (!ctaButton) return;
        
        // Создаем эффект нажатия
        gsap.to(ctaButton, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
            onStart: () => {
                // Добавляем временный класс для активного состояния
                ctaButton.classList.add('active');
            },
            onComplete: () => {
                ctaButton.classList.remove('active');
            }
        });
        
        // Эффект волны
        this.createRippleEffect(ctaButton);
    }
    
    /**
     * @method createRippleEffect
     * @description Создает эффект волны при клике
     * @param {HTMLElement} element - Элемент для эффекта
     */
    createRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        // Стили для волны
        Object.assign(ripple.style, {
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            width: '100px',
            height: '100px',
            marginTop: '-50px',
            marginLeft: '-50px',
            pointerEvents: 'none',
            zIndex: '1'
        });
        
        element.appendChild(ripple);
        
        // Анимация волны
        gsap.fromTo(ripple,
            {
                scale: 0,
                opacity: 1
            },
            {
                scale: 3,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    ripple.remove();
                }
            }
        );
    }
    
    /**
     * @method setupScrollAnimations
     * @description Настраивает анимации при скролле
     */
    setupScrollAnimations() {
        // Анимация авторской информации при скролле
        const authorInfo = document.querySelector('.mt-10');
        
        if (!authorInfo) return;
        
        gsap.from(authorInfo, {
            opacity: 0,
            y: 30,
            scrollTrigger: {
                trigger: authorInfo,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    }
    
    /**
     * @method setupHoverEffects
     * @description Настраивает hover-эффекты для интерактивных элементов
     */
    setupHoverEffects() {
        const ctaButton = document.querySelector('.cta-button');
        const timeBoxes = document.querySelectorAll('.time-box');
        
        // Hover эффект для кнопки
        if (ctaButton) {
            ctaButton.addEventListener('mouseenter', () => {
                gsap.to(ctaButton, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            ctaButton.addEventListener('mouseleave', () => {
                gsap.to(ctaButton, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }
        
        // Hover эффект для блоков времени
        timeBoxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                gsap.to(box, {
                    scale: 1.05,
                    y: -5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            box.addEventListener('mouseleave', () => {
                gsap.to(box, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
    
    /**
     * @method animateNumberChange
     * @description Анимирует изменение числа в счетчике
     * @param {HTMLElement} element - DOM-элемент с числом
     * @param {string} newValue - Новое значение
     */
    animateNumberChange(element, newValue) {
        if (!element) return;
        
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
     * @method celebrateNewYear
     * @description Запускает праздничные анимации при наступлении Нового Года
     */
    celebrateNewYear() {
        // Анимация заголовка
        const header = document.querySelector('h1');
        if (header) {
            gsap.to(header, {
                scale: 1.5,
                color: '#FFD700',
                duration: 1,
                yoyo: true,
                repeat: 3,
                ease: "power2.inOut"
            });
        }
        
        // Анимация всех блоков времени
        const timeBoxes = document.querySelectorAll('.time-box');
        timeBoxes.forEach((box, index) => {
            gsap.to(box, {
                rotation: 360,
                scale: 1.3,
                duration: 1,
                delay: index * 0.1,
                ease: "back.out(1.7)"
            });
        });
        
        // Конфетти-эффект
        this.createConfetti();
    }
    
    /**
     * @method createConfetti
     * @description Создает эффект конфетти
     */
    createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const confettiCount = 150;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Случайные параметры
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const startX = Math.random() * window.innerWidth;
            
            Object.assign(confetti.style, {
                position: 'fixed',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                top: '-20px',
                left: `${startX}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                pointerEvents: 'none',
                zIndex: '9999'
            });
            
            document.body.appendChild(confetti);
            
            // Анимация падения
            gsap.to(confetti, {
                y: window.innerHeight + 20,
                rotation: Math.random() * 360,
                x: Math.random() * 200 - 100,
                duration: Math.random() * 2 + 2,
                ease: "power2.in",
                onComplete: () => {
                    confetti.remove();
                }
            });
        }
    }
    
    /**
     * @method pauseAll
     * @description Приостанавливает все анимации
     */
    pauseAll() {
        Object.values(this.timelines).forEach(timeline => {
            if (timeline && timeline.pause) {
                timeline.pause();
            }
        });
    }
    
    /**
     * @method resumeAll
     * @description Возобновляет все анимации
     */
    resumeAll() {
        Object.values(this.timelines).forEach(timeline => {
            if (timeline && timeline.play) {
                timeline.play();
            }
        });
    }
    
    /**
     * @method destroy
     * @description Очищает ресурсы анимаций
     */
    destroy() {
        this.pauseAll();
        
        // Удаляем все слушатели событий
        const ctaButton = document.querySelector('.cta-button');
        const timeBoxes = document.querySelectorAll('.time-box');
        
        if (ctaButton) {
            ctaButton.onmouseenter = null;
            ctaButton.onmouseleave = null;
        }
        
        timeBoxes.forEach(box => {
            box.onmouseenter = null;
            box.onmouseleave = null;
        });
        
        this.timelines = {};
        this.animations = {};
        this.isInitialized = false;
    }
}