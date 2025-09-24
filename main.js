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
    checkBGImage();
};

// Функция покупки улучшения клика
function buyUpgrade(addAmount, price, buttonElement) {
    if (score >= price) {
        score -= price;
        addPerClick += addAmount;
        
        const newPrice = Math.floor(price * 1.17);
        buttonElement.querySelector('.upgrade-price').textContent = newPrice + ' капель';
        buttonElement.onclick = function() { buyUpgrade(addAmount, newPrice, this); };
        
        updateDisplay();
    }
}

// Функция покупки авто-кликера
function buyAutoClicker(addAmount, price, buttonElement) {
    if (score >= price) {
        score -= price;
        autoClickers += addAmount;
        
        const newPrice = Math.floor(price * 1.17);
        buttonElement.querySelector('.upgrade-price').textContent = newPrice + ' капель';
        buttonElement.onclick = function() { buyAutoClicker(addAmount, newPrice, this); };
        
        updateDisplay();
    }
}

// Авто-кликеры
setInterval(function() {
    if (autoClickers > 0) {
        score += autoClickers;
        updateDisplay();
        checkBGImage();
    }
}, 1000);

// Функция открытия/закрытия магазина
function toggleShop() {
    shop.classList.toggle('active');
}

// Смена картинки по количеству капель
function checkBGImage() {
    if (score > 1000) {
        button.style.backgroundImage = 'url(https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg)';
    }
    if (score > 10000) {
        button.style.backgroundImage = 'url(https://pvsz2.ru/statics/plants-big/31.png)';
    }
    if (score > 1000000) {
        button.style.backgroundImage = 'url(https://avatars.mds.yandex.net/i?id=69a2b4239be746c0863ff1d2bf2c2a75_l-8972142-images-thumbs&n=13)';
    }
    if (score > 100000000) {
        button.style.backgroundImage = 'url(https://i.pinimg.com/originals/8e/0f/57/8e0f5777b6643cdc67dcfce5db6c1d70.jpg)';
    }
    if (score > 1000000000) {
        button.style.backgroundImage = 'url(https://files.vgtimes.ru/download/posts/2020-04/thumbs/1587903142_gxxpmj5u6ke3vkxewf1y0g.jpg)';
    }
    if (score > 100000000000) {
        button.style.backgroundImage = 'url(https://img.razrisyika.ru/kart/14/1200/53948-gorohostrel-13.jpg)';
    }
    if (score > 1000000000000) {
        button.style.backgroundImage = 'url(https://png.klev.club/uploads/posts/2024-04/png-klev-club-f8lu-p-gorokhostrel-png-20.png)';
    }
}

// Обновление отображения
function updateDisplay() {
    scoreText.textContent = Math.floor(score);
    addText.textContent = addPerClick;
    autoClickText.textContent = autoClickers;
}

// Старт игры
updateDisplay();
