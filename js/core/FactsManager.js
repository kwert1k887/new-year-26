/**
 * @file FactsManager.js
 * @class FactsManager
 * @description Управление новогодними фактами
 */

export class FactsManager {
    /**
     * @constructor
     */
    constructor() {
        this.facts = [
            "Новый год в России стали отмечать 1 января только с 1700 года по указу Петра I. До этого новый год начинался 1 сентября.",
            "Советский фильм «Ирония судьбы, или С лёгким паром!» показывают в канун Нового года с 1976 года. Это самая длинная новогодняя традиция на российском телевидении.",
            "Оливье — самый популярный новогодний салат в России. Рецепт был создан в 1860-х годах французским поваром Люсьеном Оливье.",
            "В России Дед Мороз празднует день рождения 18 ноября — именно в этот день в его вотчине в Великом Устюге наступает настоящая зима.",
            "Традиция запускать фейерверки на Новый год появилась при Петре I.",
            "«Голубой огонёк» — одна из старейших новогодних телепередач в России. Первый выпуск вышел в 1962 году.",
            "В России есть уникальная традиция — записывать желание на бумажке, поджигать её, пепел бросать в бокал с шампанским и выпивать до боя курантов.",
            "Снегурочка — внучка Деда Мороза — это исключительно русский новогодний персонаж.",
            "Мандарины стали традиционным новогодним фруктом в СССР в 1960-х годах.",
            "В 1947 году 1 января в СССР было официально объявлено нерабочим днём.",
            "Самое холодное место, где отмечают Новый год в России — Оймякон в Якутии.",
            "Традиция обращения президента к народу перед боем курантов была начата Борисом Ельциным в 1991 году.",
            "Первый новогодний телеобращение Леонида Брежнева вышло в 1970 году.",
            "В советское время из-за дефицита ёлочные игрушки часто делали своими руками.",
            "Традиция загадывать желание под бой курантов появилась в СССР в 1960-х годах."
        ];
        
        this.usedIndices = new Set();
        this.resetThreshold = 5; // Сброс после 5 использованных фактов
    }
    
    /**
     * @method getRandomFact
     * @description Возвращает случайный неповторяющийся факт
     * @returns {string}
     */
    getRandomFact() {
        // Сброс, если все факты использованы
        if (this.usedIndices.size >= this.facts.length) {
            this.usedIndices.clear();
        }
        
        // Сброс после определенного порога
        if (this.usedIndices.size >= this.resetThreshold) {
            this.usedIndices.clear();
        }
        
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.facts.length);
        } while (this.usedIndices.has(randomIndex));
        
        this.usedIndices.add(randomIndex);
        return this.facts[randomIndex];
    }
    
    /**
     * @method getFactByIndex
     * @description Возвращает факт по индексу
     * @param {number} index - Индекс факта
     * @returns {string|null}
     */
    getFactByIndex(index) {
        if (index >= 0 && index < this.facts.length) {
            return this.facts[index];
        }
        return null;
    }
    
    /**
     * @method getAllFacts
     * @description Возвращает все факты
     * @returns {Array<string>}
     */
    getAllFacts() {
        return [...this.facts];
    }
    
    /**
     * @method addFact
     * @description Добавляет новый факт
     * @param {string} fact - Новый факт
     */
    addFact(fact) {
        if (fact && typeof fact === 'string') {
            this.facts.push(fact);
        }
    }
    
    /**
     * @method getFactsCount
     * @description Возвращает количество фактов
     * @returns {number}
     */
    getFactsCount() {
        return this.facts.length;
    }
    
    /**
     * @method resetUsage
     * @description Сбрасывает историю использованных фактов
     */
    resetUsage() {
        this.usedIndices.clear();
    }
    
    /**
     * @method getRandomCategory
     * @description Возвращает случайный факт по категории (пример реализации)
     * @returns {Object} - Факт с категорией
     */
    getRandomCategory() {
        const categories = {
            history: [0, 4, 9, 11, 12],
            traditions: [1, 6, 7, 8, 14],
            interesting: [2, 3, 5, 10, 13]
        };
        
        const randomCategory = Object.keys(categories)[
            Math.floor(Math.random() * Object.keys(categories).length)
        ];
        
        const factIndex = categories[randomCategory][
            Math.floor(Math.random() * categories[randomCategory].length)
        ];
        
        return {
            fact: this.facts[factIndex],
            category: randomCategory
        };
    }
}