'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");
const levelText = document.getElementById("level");
const expText = document.getElementById("exp");
const maxExpText = document.getElementById("max-exp");
const clickPriceText = document.getElementById("price-click");
const autoPriceText = document.getElementById("price-auto");

let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let exp = 0;
let level = 1;
let maxExp = 100;
let totalClicks = 0;

// Цены улучшений
let clickUpgradePrice = 100;
let autoUpgradePrice = 50;

// Скины и условия их разблокировки
const skins = [
    { url: "https://pvsz2.ru/statics/plants-big/68.png", clicksRequired: 0 }, // Стартовый
    { url: "https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg", clicksRequired: 1000 }, // За 1000 кликов
    { url: "https://pvsz2.ru/statics/plants-big/31.png", clicksRequired: 5000 } // За 5000 кликов
];
let currentSkinIndex = 0;

function getScore(n) {
    score += n;
    scoreText.innerText = Math.floor(score);
}

function addExperience() {
    exp += 1; // Даем 1 опыт за клик
    totalClicks += 1; // Считаем общее количество кликов

    // Проверяем, нужно ли повысить уровень
    if (exp >= maxExp) {
        level += 1;
        exp = 0;
        maxExp = Math.floor(maxExp * 1.05); // Увеличиваем требуемый опыт на 5%
        alert("Уровень UP! Теперь уровень " + level);
        updateLevelDisplay();
    }

    // Проверяем, разблокирован ли новый скин
    checkSkinUnlock();

    // Обновляем полоску опыта
    updateExpDisplay();
}

function updateLevelDisplay() {
    levelText.textContent = level;
    maxExpText.textContent = maxExp;
}

function updateExpDisplay() {
    expText.textContent = exp;
}

function checkSkinUnlock() {
    // Проверяем, достигли ли мы количества кликов для нового скина
    for (let i = 0; i < skins.length; i++) {
        if (totalClicks >= skins[i].clicksRequired && currentSkinIndex < i) {
            currentSkinIndex = i; // Разблокируем скин
            button.style.backgroundImage = `url(${skins[i].url})`; // Меняем картинку
            alert("Поздравляем! Вы получили новый скин за " + skins[i].clicksRequired + " кликов!");
        }
    }
}

function buyUpgrade(addValue, basePrice) {
    // Определяем, какое улучшение покупается, и проверяем цену
    let currentPrice;
    if (addValue === 1) {
        currentPrice = clickUpgradePrice;
    } else if (addValue === 0.2) {
        currentPrice = autoUpgradePrice;
    }

    if (score >= currentPrice) {
        getScore(-currentPrice);

        // Увеличиваем характеристику
        if (addValue === 1) {
            addPerClick += addValue;
            addText.innerText = addPerClick;
            // Повышаем цену для следующей покупки на 20%
            clickUpgradePrice = Math.floor(currentPrice * 1.2);
            clickPriceText.innerText = clickUpgradePrice;
        } else {
            addPerSecond += addValue;
            autoUpgradePrice = Math.floor(currentPrice * 1.2);
            autoPriceText.innerText = autoUpgradePrice;
        }
    }
}

function buyCase() {
    const casePrice = 1250;
    if (score >= casePrice) {
        getScore(-casePrice);

        // Простой пример логики кейса со шансами
        const random = Math.random() * 100;
        if (random < 1) {
            alert("Вам выпал ЛЕГЕНДАРНЫЙ скин! (Шанс 1%)");
        } else if (random < 10) {
            alert("Вам выпал ЭПИЧЕСКИЙ скин! (Шанс 9%)");
        } else if (random < 40) {
            alert("Вам выпал РЕДКИЙ скин! (Шанс 30%)");
        } else {
            alert("Вам выпал ОБЫЧНЫЙ скин. (Шанс 60%)");
        }
        // Здесь можно добавить логику добавления скина в инвентарь
    }
}

button.onclick = function() {
    getScore(addPerClick);
    addExperience(); // Добавляем опыт за клик
};

// Авто-кликер
setInterval(() => {
    if (addPerSecond > 0) {
        getScore(addPerSecond);
    }
}, 1000);

// Инициализация при загрузке
updateLevelDisplay();
updateExpDisplay();
