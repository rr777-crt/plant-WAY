'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");

let score = 0;
let addPerClick = 1;
let addPerSecond = 0;

// Объект для хранения цен улучшений (обновляется автоматически)
let upgradePrices = {
    '1_100': 100,    // для +1 за 100
    '0.2_50': 50     // для +0.2 за 50
};

function toggleShop() {
    const sidebar = document.getElementById('shop-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function openTab(tabName) {
    const tabPanes = document.querySelectorAll('.tab-pane');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabPanes.forEach(pane => pane.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function buyUpgrade(addValue, basePrice) {
    const key = `${addValue}_${basePrice}`;
    const currentPrice = upgradePrices[key];
    
    if (score >= currentPrice) {
        score -= currentPrice;
        
        if (addValue === 1) {
            addPerClick += addValue;
        } else {
            addPerSecond += addValue;
        }
        
        // +20% к цене
        upgradePrices[key] = Math.floor(currentPrice * 1.2);
        
        // Обновляем текст на кнопке
        updateButtonText(addValue, basePrice, upgradePrices[key]);
        updateDisplay();
    }
}

function updateButtonText(addValue, basePrice, newPrice) {
    const buttons = document.querySelectorAll('button[onclick*="buyUpgrade"]');
    buttons.forEach(button => {
        if (button.getAttribute('onclick').includes(`buyUpgrade(${addValue}, ${basePrice})`)) {
            button.innerHTML = `<span>+${addValue} ${addValue === 1 ? 'на клик' : 'в секунду'}<br>${newPrice} капель</span>`;
        }
    });
}

function updateDisplay() {
    scoreText.textContent = Math.floor(score);
    addText.textContent = addPerClick;
}

button.onclick = function() {
    score += addPerClick;
    updateDisplay();
};

// Авто-кликер
setInterval(() => {
    if (addPerSecond > 0) {
        score += addPerSecond;
        updateDisplay();
    }
}, 1000);

// Инициализация
updateDisplay();
