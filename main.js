'use strict';

// Переменные игры
let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let level = 1;
let exp = 0;
let maxExp = 100;
let totalClicks = 0;

// Цены улучшений
let clickPrice = 100;
let autoclickPrice = 50;

// Скины
let unlockedSkins = ['default'];
let currentSkin = 'default';
const skins = {
    'default': { 
        name: 'Стандартный', 
        url: 'https://pvsz2.ru/statics/plants-big/68.png',
        rarity: 'common'
    },
    'common1': { 
        name: 'Обычный скин 1', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/a/a2/Snow_Pea_%28HD_size%29.png/revision/latest?cb=20220305060759&path-prefix=ru',
        rarity: 'common',
        requiredClicks: 100
    },
    'rare1': { 
        name: 'Редкий скин 1', 
        url: 'https://pvsz2.ru/statics/plants-big/31.png',
        rarity: 'rare',
        requiredClicks: 500
    },
    'epic1': { 
        name: 'Эпический скин 1', 
        url: 'https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg',
        rarity: 'epic',
        requiredClicks: 1000
    }
};

// Элементы DOM
const scoreEl = document.getElementById('score');
const addEl = document.getElementById('add');
const buttonEl = document.getElementById('button');
const levelEl = document.getElementById('level');
const expEl = document.getElementById('exp');
const maxExpEl = document.getElementById('max-exp');
const progressBar = document.getElementById('level-progress');
const skinsContainer = document.getElementById('skins-container');
const notification = document.getElementById('notification');
const mainContent = document.getElementById('main-content');

// Сохранение игры
function saveGame() {
    const gameData = {
        score: score,
        addPerClick: addPerClick,
        addPerSecond: addPerSecond,
        level: level,
        exp: exp,
        maxExp: maxExp,
        totalClicks: totalClicks,
        clickPrice: clickPrice,
        autoclickPrice: autoclickPrice,
        unlockedSkins: unlockedSkins,
        currentSkin: currentSkin
    };
    localStorage.setItem('gorohostrelSave', JSON.stringify(gameData));
}

// Загрузка игры
function loadGame() {
    const saved = localStorage.getItem('gorohostrelSave');
    if (saved) {
        const gameData = JSON.parse(saved);
        
        score = gameData.score || 0;
        addPerClick = gameData.addPerClick || 1;
        addPerSecond = gameData.addPerSecond || 0;
        level = gameData.level || 1;
        exp = gameData.exp || 0;
        maxExp = gameData.maxExp || 100;
        totalClicks = gameData.totalClicks || 0;
        clickPrice = gameData.clickPrice || 100;
        autoclickPrice = gameData.autoclickPrice || 50;
        unlockedSkins = gameData.unlockedSkins || ['default'];
        currentSkin = gameData.currentSkin || 'default';
        
        return true;
    }
    return false;
}

// Автосохранение каждые 10 секунд
function startAutosave() {
    setInterval(() => {
        saveGame();
    }, 10000);
}

// Инициализация игры
function initGame() {
    const loaded = loadGame();
    
    updateDisplay();
    updateLevelDisplay();
    checkUpgradesAvailability();
    loadSkins();
    
    // Применяем текущий скин
    if (currentSkin && skins[currentSkin]) {
        buttonEl.style.backgroundImage = `url(${skins[currentSkin].url})`;
    }
    
    if (loaded) {
        console.log('Игра загружена');
    } else {
        console.log('Новая игра');
    }
    
    startAutosave();
}

// Основной клик
buttonEl.onclick = function() {
    score += addPerClick;
    exp += 1;
    totalClicks += 1;
    updateDisplay();
    checkLevelUp();
    checkSkinUnlocks();
    saveGame();
};

// Покупка улучшения
function buyUpgrade(type, power, price) {
    if (score < price || level < 1) return;
    
    score -= price;
    
    if (type === 'click') {
        addPerClick += power;
        clickPrice = Math.round(clickPrice * 1.17);
        document.getElementById('click-price').textContent = clickPrice;
        addEl.textContent = addPerClick;
    } else if (type === 'autoclick') {
        addPerSecond += power;
        autoclickPrice = Math.round(autoclickPrice * 1.17);
        document.getElementById('autoclick-price').textContent = autoclickPrice;
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Покупка кейса
function buyCase() {
    if (score < 1250) return;
    score -= 1250;
    
    const random = Math.random();
    let wonSkin = null;
    
    if (random < 0.01) {
        wonSkin = getRandomSkinByRarity('epic');
    } else if (random < 0.1) {
        wonSkin = getRandomSkinByRarity('rare');
    } else {
        wonSkin = getRandomSkinByRarity('common');
    }
    
    if (wonSkin && !unlockedSkins.includes(wonSkin)) {
        unlockedSkins.push(wonSkin);
        showNotification();
        loadSkins();
    }
    
    updateDisplay();
    saveGame();
}

function getRandomSkinByRarity(rarity) {
    const availableSkins = Object.keys(skins).filter(skinId => 
        skins[skinId].rarity === rarity && skinId !== 'default' && !unlockedSkins.includes(skinId)
    );
    return availableSkins.length > 0 ? availableSkins[Math.floor(Math.random() * availableSkins.length)] : null;
}

// Проверка разблокировки скинов по кликам
function checkSkinUnlocks() {
    Object.keys(skins).forEach(skinId => {
        const skin = skins[skinId];
        if (skin.requiredClicks && totalClicks >= skin.requiredClicks && !unlockedSkins.includes(skinId)) {
            unlockedSkins.push(skinId);
            showNotification();
            loadSkins();
            saveGame();
        }
    });
}

// Загрузка скинов в инвентарь
function loadSkins() {
    skinsContainer.innerHTML = '';
    
    unlockedSkins.forEach(skinId => {
        const skin = skins[skinId];
        const skinElement = document.createElement('div');
        skinElement.className = `skin-item ${currentSkin === skinId ? 'active' : ''}`;
        skinElement.onclick = () => selectSkin(skinId);
        skinElement.innerHTML = `
            <img src="${skin.url}" alt="${skin.name}" onerror="this.src='https://pvsz2.ru/statics/plants-big/68.png'">
            <div>${skin.name}</div>
        `;
        skinsContainer.appendChild(skinElement);
    });
}

// Выбор скина
function selectSkin(skinId) {
    currentSkin = skinId;
    buttonEl.style.backgroundImage = `url(${skins[skinId].url})`;
    loadSkins();
    saveGame();
}

// Уведомление
function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Система уровней
function checkLevelUp() {
    if (exp >= maxExp) {
        level++;
        exp = 0;
        maxExp = Math.round(maxExp * 1.05);
        updateLevelDisplay();
        checkUpgradesAvailability();
        saveGame();
    }
}

function updateDisplay() {
    scoreEl.textContent = score;
    expEl.textContent = exp;
    const progressPercent = (exp / maxExp) * 100;
    progressBar.style.width = progressPercent + '%';
}

function updateLevelDisplay() {
    levelEl.textContent = level;
    maxExpEl.textContent = maxExp;
    updateDisplay();
}

// Проверка доступности улучшений
function checkUpgradesAvailability() {
    const upgrades = document.querySelectorAll('.upgrade-item');
    upgrades.forEach(upgrade => {
        const requiredLevel = parseInt(upgrade.getAttribute('data-level'));
        if (level < requiredLevel) {
            upgrade.disabled = true;
        } else {
            upgrade.disabled = false;
        }
    });
}

// Управление панелями
function toggleShop() {
    const shop = document.getElementById('shop-panel');
    const overlay = document.getElementById('overlay');
    shop.classList.toggle('active');
    overlay.classList.toggle('active');
    mainContent.classList.toggle('shop-open');
}

function closeShop() {
    document.getElementById('shop-panel').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    mainContent.classList.remove('shop-open');
}

function toggleInventory() {
    const inventory = document.getElementById('inventory-panel');
    const overlay = document.getElementById('overlay');
    inventory.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeInventory() {
    document.getElementById('inventory-panel').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function closeAllPanels() {
    closeShop();
    closeInventory();
}

function openShopTab(tabName) {
    document.querySelectorAll('.shop-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Авто-кликер
setInterval(() => {
    if (addPerSecond > 0) {
        score += addPerSecond;
        updateDisplay();
        saveGame();
    }
}, 1000);

// Сохранение при закрытии страницы
window.addEventListener('beforeunload', () => {
    saveGame();
});

// Запуск игры
initGame();
