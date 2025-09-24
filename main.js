'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");
const autoClickText = document.getElementById("autoClick");

let score = 0;
let addPerClick = 1;
let autoClickers = 0;

button.onclick = function() {
    score += addPerClick;
    updateDisplay();
    checkBGImage();
};

function buyUpgrade(addAmount, price, buttonElement) {
    if (score >= price) {
        score -= price;
        addPerClick += addAmount;
        
        const newPrice = Math.floor(price * 1.17);
        buttonElement.innerHTML = `<span>+${addAmount} на клик<br>${newPrice} капель</span>`;
        buttonElement.onclick = function() { buyUpgrade(addAmount, newPrice, this); };
        
        updateDisplay();
    }
}

function buyAutoClicker(addAmount, price, buttonElement) {
    if (score >= price) {
        score -= price;
        autoClickers += addAmount;
        
        const newPrice = Math.floor(price * 1.17);
        buttonElement.innerHTML = `<span>Авто-клик +${addAmount}/сек<br>${newPrice} капель</span>`;
        buttonElement.onclick = function() { buyAutoClicker(addAmount, newPrice, this); };
        
        updateDisplay();
    }
}

setInterval(function() {
    if (autoClickers > 0) {
        score += autoClickers;
        updateDisplay();
        checkBGImage();
    }
}, 1000);

function toggleShop() {
    const shop = document.querySelector('.shop-panel');
    shop.style.display = shop.style.display === 'none' ? 'block' : 'none';
}

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
}

function updateDisplay() {
    scoreText.textContent = Math.floor(score);
    addText.textContent = addPerClick;
    autoClickText.textContent = autoClickers;
}

updateDisplay();
