'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");
const levelText = document.getElementById("level");
const expText = document.getElementById("exp");
const maxExpText = document.getElementById("max-exp");
const expProgress = document.getElementById("exp-progress");
const skinsContainer = document.getElementById("skins-container");

let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let exp = 0;
let level = 1;
let maxExp = 100;
let totalClicks = 0;

// Скины и их условия разблокировки
const skins = [
    { id: 1, name: "Обычный", url: "https://pvsz2.ru/statics/plants-big/68.png", unlocked: true, clicksRequired: 0 },
    { id: 2, name: "Золотой", url: "https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg", unlocked: false, clicksRequired: 100 },
    { id: 3, name: "Эпический", url: "https://pvsz2.ru/statics/plants-big/31.png", unlocked: false, clicksRequired: 500 },
    { id: 4, name: "Легендарный", url: "https://avatars.mds.yandex.net/i?id=69a2b4239be746c0863ff1d2bf2c2a75_l-8972142-images-thumbs&n=13", unlocked: false, clicksRequired: 1000 }
];

let currentSkin = skins[0];

// Цены улучшений
let upgradePrices = {};

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
    
    if (tabName === 'inventory-tab') {
        loadSkins();
    }
}

function openInventory() {
    toggleShop();
    setTimeout(() => openTab('inventory-tab'), 100);
}

function buyUpgrade(addValue, basePrice, requiredLevel) {
    if (level < requiredLevel) {
        alert(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    const key = `${addValue}_${basePrice}`;
    const currentPrice = upgradePrices[key] || basePrice;
    
    if (score >= currentPrice) {
        score -= currentPrice;
        
        if (addValue === 1 || addValue === 5) {
            addPerClick += addValue;
        } else {
            addPerSecond += addValue;
        }
        
        upgradePrices[key] = Math.floor(currentPrice * 1.2);
        updateButtonText(addValue, basePrice, upgradePrices[key], requiredLevel);
        updateDisplay();
    }
}

function buyCase() {
    if (score >= 1250) {
        score -= 1250;
        
        const random = Math.random() * 100;
        let skin;
        
        if (random < 1) {
            skin = getRandomSkin(4); // 1% - легендарный
        } else if (random < 10) {
            skin = getRandomSkin(3); // 9% - эпический
        } else if (random < 40) {
            skin = getRandomSkin(2); // 30% - редкий
        } else {
            skin = getRandomSkin(1); // 60% - обычный
        }
        
        unlockSkin(skin);
        updateDisplay();
        alert(`Вы получили скин: ${skin.name}!`);
    }
}

function getRandomSkin(quality) {
    const availableSkins = skins.filter(skin => !skin.unlocked && skin.id === quality);
    return availableSkins[Math.floor(Math.random() * availableSkins.length)] || skins[0];
}

function unlockSkin(skin) {
    skin.unlocked = true;
    showNotification(`Новый скин разблокирован: ${skin.name}!`);
}

function loadSkins() {
    skinsContainer.innerHTML = '';
    skins.forEach(skin => {
        if (skin.unlocked) {
            const skinElement = document.createElement('div');
            skinElement.className = `skin-item ${currentSkin.id === skin.id ? 'active' : ''}`;
            skinElement.innerHTML = `
                <img src="${skin.url}" alt="${skin.name}">
                <div>${skin.name}</div>
            `;
            skinElement.onclick = () => selectSkin(skin);
            skinsContainer.appendChild(skinElement);
        }
    });
}

function selectSkin(skin) {
    currentSkin = skin;
    button.style.backgroundImage = `url(${skin.url})`;
    loadSkins();
    showNotification(`Скин изменен: ${skin.name}`);
}

function addExp(amount) {
    exp += amount;
    if (exp >= maxExp) {
        level++;
        exp = exp - maxExp;
        maxExp = Math.floor(maxExp * 1.05);
        showNotification(`Поздравляем! Вы достигли уровня ${level}!`);
    }
    updateExpBar();
}

function updateExpBar() {
    expText.textContent = exp;
    maxExpText.textContent = maxExp;
    levelText.textContent = level;
    expProgress.style.width = `${(exp / maxExp) * 100}%`;
}

function updateButtonText(addValue, basePrice, newPrice, requiredLevel) {
    const buttons = document.querySelectorAll('button[onclick*="buyUpgrade"]');
    buttons.forEach(button => {
        if (button.getAttribute('onclick').includes(`buyUpgrade(${addValue}, ${basePrice}, ${requiredLevel})`)) {
            button.innerHTML = `<span>+${addValue} ${addValue === 1 || addValue === 5 ? 'на клик' : 'в секунду'}<br>${newPrice} капель<br>Требует уровень: ${requiredLevel}</span>`;
        }
    });
}

function updateDisplay() {
    scoreText.textContent = Math.floor(score);
    addText.textContent = addPerClick;
}

function showNotification(message) {
    // Можно добавить красивые уведомления
    console.log(message);
}

function checkSkinUnlocks() {
    skins.forEach(skin => {
        if (!skin.unlocked && totalClicks >= skin.clicksRequired) {
            unlockSkin(skin);
        }
    });
}

// Клик по основной кнопке
button.onclick = function() {
    score += addPerClick;
    totalClicks++;
    addExp(1);
    checkSkinUnlocks();
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
updateExpBar();
loadSkins();
