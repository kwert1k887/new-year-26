/**
 * @file index.js
 * @description Точка входа новогоднего приложения
 * @main
 */

// Импорт классов
import { App } from './core/App.js';
import { Countdown } from './core/Countdown.js';
import { FactsManager } from './core/FactsManager.js';
import { Modal } from './ui/Modal.js';
import { Animations } from './ui/Animations.js';
import { Fireworks } from './effects/Fireworks.js';
import { Snowflakes } from './effects/Snowflakes.js';
import { Particles } from './effects/Particles.js';

/**
 * @function initializeApp
 * @description Инициализирует приложение после загрузки DOM
 */
async function initializeApp() {
    try {
        // Создание экземпляра приложения
        window.app = new App();
        
        // Инициализация
        await window.app.initialize();
        
        // Экспорт для отладки
        window.App = App;
        
    } catch (error) {
        console.error('❌ Не удалось инициализировать приложение:', error);
        
        // Запасной вариант - базовый функционал
        initializeFallback();
    }
}

/**
 * @function initializeFallback
 * @description Запасная инициализация при ошибках
 */
function initializeFallback() {
    console.log('🔄 Запуск запасной инициализации...');
    
    // Базовый счетчик
    const updateCountdown = () => {
        const now = new Date();
        const target = new Date(`January 1, ${now.getFullYear() + 1} 00:00:00`);
        const diff = target - now;
        
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Запуск приложения при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Экспорт для использования в модулях
export {
    App,
    Countdown,
    FactsManager,
    Modal,
    Animations,
    Fireworks,
    Snowflakes,
    Particles
};