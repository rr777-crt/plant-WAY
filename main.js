'use strict';

// Переменные игры
let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let level = 1;
let exp = 0;
let maxExp = 100;
let totalClicks = 0;

// Цены улучшений (отдельные для каждого улучшения)
let upgradePrices = {
    click1: 100,
    click2: 1000,
    click3: 5000,
    click4: 15000,
    click5: 30000,
    autoclick1: 50,
    autoclick2: 250,
    autoclick3: 750,
    autoclick4: 2500
};

// Статус покупки улучшений
let boughtUpgrades = {
    click1: false,
    click2: false,
    click3: false,
    click4: false,
    click5: false,
    autoclick1: false,
    autoclick2: false,
    autoclick3: false,
    autoclick4: false
};

// Скины
let unlockedSkins = ['default'];
let currentSkin = 'default';
const skins = {
    'default': { 
        name: 'Стандартный', 
        url: 'https://pvsz2.ru/statics/plants-big/68.png',
        rarity: 'common'
    },
    // Обычные скины (60% шанс)
    'common1': { 
        name: 'Ретро', 
        url: 'https://static.wikia.nocookie.net/pvz-fusion/images/5/5c/PeaShooter.png/revision/latest?cb=20250119161122&path-prefix=ru',
        rarity: 'common'
    },
  
    
    // Редкие скины (30% шанс)
    'rare1': { 
        name: 'Зомби?', 
        url: 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-felv-p-gorokhostrel-png-29.png',
        rarity: 'rare'
    },
   
    
    // Эпические скины (9% шанс)
    'epic1': { 
        name: 'пустотный грохострел', 
        url: 'https://static.wikia.nocookie.net/plants-vs-zonbies-wiki/images/5/52/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B8%D0%B5_%D0%93%D0%BE%D1%80%D0%BE%D1%85%D0%BE%D1%81%D1%82%D1%80%D0%B5%D0%BB%D1%8B.png/revision/latest?cb=20190304153301&path-prefix=ru',
        rarity: 'epic'
    },
  
    // Легендарные скины (1% шанс)
    'legendary1': { 
        name: 'КОРОЛЬ ГОРОХ', 
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtVQyQTbYoKxhSByfHMhQF4zmNxkH6Vm0vPQ&s',
        rarity: 'legendary'
    },
   
};

// Скины за клики с редкостью ПУТЬ
const clickSkins = {
    'path1': { 
        name: 'ПУТЬ: Ледяной', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/a/a2/Snow_Pea_%28HD_size%29.png/revision/latest?cb=20220305060759&path-prefix=ru',
        rarity: 'path',
        requiredClicks: 1000
    },
    'path2': { 
        name: 'ПУТЬ: Огненый', 
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaLfKjCJeRybo_HA5pSyFISZFrCZJnKqSuiQ&s',
        rarity: 'path',
        requiredClicks: 10000
    },
    'path3': { 
        name: 'ПУТЬ: огонь', 
        url: 'https://pvsz2.ru/statics/plants-big/121.png',
        rarity: 'path',
        requiredClicks: 1000000
    },
    'path4': { 
        name: 'ПУТЬ: горохный', 
        url: 'https://static.wikia.nocookie.net/plantsvs-zombies/images/8/80/PvZ2_HD_Pea_Pod.png/revision/latest/smart/width/250/height/250?cb=20140817162420&path-prefix=ru',
        rarity: 'path',
        requiredClicks: 10000000
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
        upgradePrices: upgradePrices,
        boughtUpgrades: boughtUpgrades,
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
        upgradePrices = gameData.upgradePrices || upgradePrices;
        boughtUpgrades = gameData.boughtUpgrades || boughtUpgrades;
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
    updatePricesDisplay();
    checkUpgradesAvailability();
    loadSkins();
    
    // Применяем текущий скин
    const allSkins = {...skins, ...clickSkins};
    if (currentSkin && allSkins[currentSkin]) {
        buttonEl.style.backgroundImage = `url(${allSkins[currentSkin].url})`;
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
    const requiredLevel = parseInt(event.target.getAttribute('data-level'));
    const currentPrice = upgradePrices[type];
    
    if (score < currentPrice || level < requiredLevel || boughtUpgrades[type]) return;
    
    score -= currentPrice;
    
    if (type.startsWith('click')) {
        addPerClick += power;
        addEl.textContent = addPerClick;
    } else if (type.startsWith('autoclick')) {
        addPerSecond += power;
    }
    
    // Увеличиваем цену на 17% для этого улучшения
    upgradePrices[type] = Math.round(currentPrice * 1.17);
    boughtUpgrades[type] = true;
    
    updateDisplay();
    updatePricesDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Обновление отображения цен
function updatePricesDisplay() {
    for (const [upgradeType, price] of Object.entries(upgradePrices)) {
        const priceElement = document.getElementById(`${upgradeType}-price`);
        if (priceElement) {
            priceElement.textContent = price;
        }
    }
}

// Покупка кейса
function buyCase() {
    if (score < 1250) return;
    score -= 1250;
    
    const random = Math.random();
    let wonSkin = null;
    let rarity = '';
    
    // Определяем редкость по шансам
    if (random < 0.01) { // 1% - легендарный
        rarity = 'legendary';
    } else if (random < 0.1) { // 9% - эпический
        rarity = 'epic';
    } else if (random < 0.4) { // 30% - редкий
        rarity = 'rare';
    } else { // 60% - обычный
        rarity = 'common';
    }
    
    // Получаем случайный скин выпавшей редкости
    wonSkin = getRandomSkinByRarity(rarity);
    
    if (wonSkin && !unlockedSkins.includes(wonSkin)) {
        unlockedSkins.push(wonSkin);
        showNotification(`Получен ${rarity} скин: ${skins[wonSkin].name}!`);
        loadSkins();
    } else if (wonSkin) {
        showNotification(`Дубликат скина! Получена компенсация: 250 капель`);
        score += 250; // Компенсация за дубликат
    } else {
        showNotification('Все скины этой редкости уже получены! +250 капель');
        score += 250; // Компенсация если все скины редкости уже есть
    }
    
    updateDisplay();
    saveGame();
}

// Функция получения случайного скина по редкости
function getRandomSkinByRarity(rarity) {
    // Получаем все скины нужной редкости (только из кейсов)
    const availableSkins = Object.keys(skins).filter(skinId => 
        skins[skinId].rarity === rarity && 
        skinId !== 'default' && 
        !unlockedSkins.includes(skinId)
    );
    
    return availableSkins.length > 0 ? 
        availableSkins[Math.floor(Math.random() * availableSkins.length)] : 
        null;
}

// Проверка разблокировки скинов по кликам
function checkSkinUnlocks() {
    Object.keys(clickSkins).forEach(skinId => {
        const skin = clickSkins[skinId];
        if (skin.requiredClicks && totalClicks >= skin.requiredClicks && !unlockedSkins.includes(skinId)) {
            unlockedSkins.push(skinId);
            showNotification(`Разблокирован скин ПУТЬ за ${skin.requiredClicks} кликов: ${skin.name}!`);
            loadSkins();
            saveGame();
        }
    });
}

// Загрузка скинов в инвентарь
function loadSkins() {
    skinsContainer.innerHTML = '';
    
    // Объединяем все скины (из кейсов и за клики)
    const allSkins = {...skins, ...clickSkins};
    
    // Сортируем скины по редкости
    const sortedSkins = unlockedSkins.sort((a, b) => {
        const rarityOrder = {common: 1, rare: 2, epic: 3, legendary: 4, path: 5};
        return rarityOrder[allSkins[b].rarity] - rarityOrder[allSkins[a].rarity];
    });
    
    sortedSkins.forEach(skinId => {
        const skin = allSkins[skinId];
        const skinElement = document.createElement('div');
        skinElement.className = `skin-item ${currentSkin === skinId ? 'active' : ''}`;
        skinElement.onclick = () => selectSkin(skinId);
        
        // Добавляем индикатор редкости
        const rarityColor = {
            common: '#27ae60',
            rare: '#3498db', 
            epic: '#9b59b6',
            legendary: '#f39c12',
            path: '#e74c3c'
        };
        
        skinElement.style.border = `2px solid ${rarityColor[skin.rarity]}`;
        
        skinElement.innerHTML = `
            <img src="${skin.url}" alt="${skin.name}" onerror="this.src='https://pvsz2.ru/statics/plants-big/68.png'">
            <div>${skin.name}</div>
            <small style="color: ${rarityColor[skin.rarity]}">${skin.rarity.toUpperCase()}</small>
        `;
        skinsContainer.appendChild(skinElement);
    });
}

// Выбор скина
function selectSkin(skinId) {
    currentSkin = skinId;
    const allSkins = {...skins, ...clickSkins};
    buttonEl.style.backgroundImage = `url(${allSkins[skinId].url})`;
    loadSkins();
    saveGame();
}

// Уведомление
function showNotification(message) {
    notification.textContent = message;
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
        const upgradeType = upgrade.onclick.toString().match(/buyUpgrade\('([^']+)'/)[1];
        
        if (level < requiredLevel) {
            upgrade.disabled = true;
        } else if (boughtUpgrades[upgradeType]) {
            upgrade.disabled = true;
            upgrade.innerHTML += '<br><span style="color: green;">Куплено</span>';
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
