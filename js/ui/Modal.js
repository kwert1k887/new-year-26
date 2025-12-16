/**
 * @file Modal.js
 * @class Modal
 * @description Управление модальным окном с новогодними фактами
 */

export class Modal {
    /**
     * @constructor
     * @param {Object} options - Настройки модального окна
     */
    constructor(options = {}) {
        this.defaults = {
            modalId: 'surpriseModal',
            titleId: 'modalTitle',
            contentId: 'surpriseText',
            closeClass: 'close',
            animationDuration: 0.5,
            animationEase: "back.out(1.7)",
            showCloseButton: true,
            showOverlayClose: true
        };
        
        this.settings = { ...this.defaults, ...options };
        this.modal = null;
        this.titleElement = null;
        this.contentElement = null;
        this.closeButton = null;
        this.isVisible = false;
        
        this.initialize();
    }
    
    /**
     * @method initialize
     * @description Инициализирует модальное окно
     */
    initialize() {
        this.modal = document.getElementById(this.settings.modalId);
        
        if (!this.modal) {
            console.error('❌ Модальное окно не найдено');
            return;
        }
        
        this.titleElement = document.getElementById(this.settings.titleId);
        this.contentElement = document.getElementById(this.settings.contentId);
        
        // Находим кнопку закрытия
        if (this.settings.showCloseButton) {
            this.closeButton = document.querySelector(`.${this.settings.closeClass}`);
            if (this.closeButton) {
                this.closeButton.addEventListener('click', () => this.hide());
            }
        }
        
        // Закрытие по клику на оверлей
        if (this.settings.showOverlayClose) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }
        
        // Закрытие по нажатию Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        
        console.log('📦 Модальное окно инициализировано');
    }
    
    /**
     * @method show
     * @description Показывает модальное окно с контентом
     * @param {string} content - Текст для отображения
     * @param {string} title - Заголовок окна (опционально)
     */
    show(content, title = null) {
        if (!this.modal || !this.contentElement) return;
        
        // Устанавливаем контент
        if (content) {
            this.contentElement.textContent = content;
        }
        
        // Устанавливаем заголовок если передан
        if (title && this.titleElement) {
            this.titleElement.textContent = title;
        }
        
        // Показываем модальное окно
        this.modal.style.display = 'block';
        
        // Анимация появления
        gsap.fromTo('.modal-content',
            {
                scale: 0.8,
                opacity: 0,
                y: 50
            },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: this.settings.animationDuration,
                ease: this.settings.animationEase,
                onStart: () => {
                    this.isVisible = true;
                    this.modal.setAttribute('aria-hidden', 'false');
                    
                    // Фокус на модальном окне для accessibility
                    this.modal.focus();
                    
                    // Блокировка скролла фона
                    document.body.style.overflow = 'hidden';
                }
            }
        );
    }
    
    /**
     * @method hide
     * @description Скрывает модальное окно
     * @param {Function} callback - Функция обратного вызова после скрытия
     */
    hide(callback = null) {
        if (!this.modal || !this.isVisible) return;
        
        // Анимация скрытия
        gsap.to('.modal-content', {
            scale: 0.8,
            opacity: 0,
            y: 50,
            duration: this.settings.animationDuration * 0.7,
            ease: "power2.in",
            onComplete: () => {
                this.modal.style.display = 'none';
                this.isVisible = false;
                this.modal.setAttribute('aria-hidden', 'true');
                
                // Разблокировка скролла
                document.body.style.overflow = '';
                
                // Возвращаем фокус на кнопку CTA
                const ctaButton = document.querySelector('.cta-button');
                if (ctaButton) {
                    ctaButton.focus();
                }
                
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    }
    
    /**
     * @method updateContent
     * @description Обновляет содержимое модального окна
     * @param {string} content - Новый текст
     * @param {boolean} animate - Анимировать ли обновление
     */
    updateContent(content, animate = true) {
        if (!this.contentElement) return;
        
        if (animate) {
            // Анимация обновления контента
            gsap.to(this.contentElement, {
                opacity: 0,
                y: -10,
                duration: 0.2,
                onComplete: () => {
                    this.contentElement.textContent = content;
                    gsap.to(this.contentElement, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3
                    });
                }
            });
        } else {
            this.contentElement.textContent = content;
        }
    }
    
    /**
     * @method setTitle
     * @description Устанавливает заголовок модального окна
     * @param {string} title - Новый заголовок
     */
    setTitle(title) {
        if (this.titleElement) {
            this.titleElement.textContent = title;
        }
    }
    
    /**
     * @method showLoading
     * @description Показывает состояние загрузки
     */
    showLoading() {
        this.updateContent('Загрузка информации...');
    }
    
    /**
     * @method showError
     * @description Показывает сообщение об ошибке
     * @param {string} message - Сообщение об ошибке
     */
    showError(message = 'Произошла ошибка. Попробуйте еще раз.') {
        this.updateContent(message);
        
        // Можно добавить специальные стили для ошибки
        if (this.contentElement) {
            this.contentElement.style.color = '#ff6b6b';
            setTimeout(() => {
                this.contentElement.style.color = '';
            }, 3000);
        }
    }
    
    /**
     * @method showSuccess
     * @description Показывает сообщение об успехе
     * @param {string} message - Сообщение
     */
    showSuccess(message) {
        this.updateContent(message);
        
        // Можно добавить специальные стили для успеха
        if (this.contentElement) {
            this.contentElement.style.color = '#51cf66';
            setTimeout(() => {
                this.contentElement.style.color = '';
            }, 3000);
        }
    }
    
    /**
     * @method isOpen
     * @description Проверяет, открыто ли модальное окно
     * @returns {boolean}
     */
    isOpen() {
        return this.isVisible;
    }
    
    /**
     * @method toggle
     * @description Переключает состояние модального окна
     * @param {string} content - Контент для показа (опционально)
     */
    toggle(content = null) {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(content);
        }
    }
    
    /**
     * @method destroy
     * @description Очищает ресурсы
     */
    destroy() {
        if (this.closeButton) {
            this.closeButton.removeEventListener('click', () => this.hide());
        }
        
        if (this.modal) {
            this.modal.removeEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }
        
        document.removeEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        
        this.modal = null;
        this.titleElement = null;
        this.contentElement = null;
        this.closeButton = null;
    }
}