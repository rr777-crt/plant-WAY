'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");
const sunsDiv = document.getElementById("suns");

let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let suns = 0;

let currentLevel = 1;
let currentExp = 0;
let requiredExp = 100;
let totalClicks = 0;

let unlockedSkins = ['default'];
let currentSkin = 'default';

const upgradePrices = {
    click: 100,
    autoclick: 50
};

button.onclick = function() {
    score += addPerClick;
    scoreText.innerText = score;
    
    currentExp += 1;
    totalClicks += 1;
    updateLevel();
};

function buyUpgrade(power, price) {
    if (score < price) return;
    
    score -= price;
    scoreText.innerText = score;
    
    if (power === 1) {
        addPerClick += power;
        addText.innerText = addPerClick;
        upgradePrices.click = Math.round(upgradePrices.click * 1.17);
    } else if (power === 0.2) {
        addPerSecond += power;
        upgradePrices.autoclick = Math.round(upgradePrices.autoclick * 1.17);
    }
}

function buyCase() {
    if (score < 1250) return;
    
    score -= 1250;
    scoreText.innerText = score;
}

function selectSkin(skin) {
    currentSkin = skin;
    button.style.backgroundImage = `url(https://pvsz2.ru/statics/plants-big/68.png)`;
}

function updateLevel() {
    if (currentExp >= requiredExp) {
        currentLevel++;
        currentExp = 0;
        requiredExp = Math.round(requiredExp * 1.05);
    }
    
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('detail-level').textContent = currentLevel;
    document.getElementById('detail-exp').textContent = currentExp;
    document.getElementById('detail-required').textContent = requiredExp;
    
    const progressPercent = (currentExp / requiredExp) * 100;
    document.getElementById('level-progress').style.width = progressPercent + '%';
}

function toggleSection(section) {
    document.querySelectorAll('.shop-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section + '-section').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeAllSections() {
    document.querySelectorAll('.shop-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById('overlay').classList.remove('active');
}

setInterval(function() {
    if (addPerSecond > 0) {
        score += addPerSecond;
        scoreText.innerText = score;
    }
}, 1000);
