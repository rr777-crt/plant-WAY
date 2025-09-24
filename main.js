'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");
const autoClickText = document.getElementById("autoClick");
const shop = document.getElementById("shop");

// Игровые переменные
let score = 0;
let addPerClick = 1;
let autoClickers = 0;

// Основной клик
button.onclick = function() {
    score += addPerClick;
    updateDisplay();
};

// Функция покупки улучшения клика (старая добрая система)
function buyUpgrade(addAmount, price, buttonElement) {
    if (score >= price) {
        score -= price;
        addPerClick += addAmount;
        
        // Увеличиваем цену на 17%
        const newPrice = Math.floor(price * 1.17);
        
        // Обновляем кнопку
        buttonElement.innerHTML = `<span>+${addAmount} на клик<br>${newPrice} капель</span>`;
        buttonElement.onclick = function() { buyUpgrade(addAmount, newPrice, this); };
        
        updateDisplay();
    }
}

// Функция покупки авто-кликера
function buyAutoClicker(addAmount, price, buttonElement) {
    if (score >= price) {
        score -= price;
        autoClickers += addAmount;
        
        // Увеличиваем цену на 17%
        const newPrice = Math.floor(price * 1.17);
        
        // Обновляем кнопку
        buttonElement.innerHTML = `<span>Авто-клик +${addAmount}/сек<br>${newPrice} капель</span>`;
        buttonElement.onclick = function() { buyAutoClicker(addAmount, newPrice, this); };
        
        updateDisplay();
    }
}

// Авто-кликеры
setInterval(function() {
    if (autoClickers > 0) {
        score += autoClickers;
        updateDisplay();
    }
}, 1000);

// Функция открытия/закрытия магазина (только визуал)
function toggleShop() {
    shop.classList.toggle('hidden');
}

// Обновление отображения
function updateDisplay() {
    scoreText.textContent = Math.floor(score);
    addText.textContent = addPerClick;
    autoClickText.textContent = autoClickers;
}

// Старт игры
updateDisplay();

