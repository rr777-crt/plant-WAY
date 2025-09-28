'use strict';

// Переменные игры
let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let level = 1;
let exp = 0;
let maxExp = 100;
let totalClicks = 0;

// Цены улучшений (ДОБАВЬТЕ ЭТО!)
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
        name: 'Ретро', 
        url: 'https://static.wikia.nocookie.net/pvz-fusion/images/5/5c/PeaShooter.png/revision/latest?cb=20250119161122&path-prefix=ru',
        rarity: 'common'
    },
    'rare1': { 
        name: 'Зомби?', 
        url: 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-felv-p-gorokhostrel-png-29.png',
        rarity: 'rare'
    },
    'epic1': { 
        name: 'пустотный грохострел', 
        url: 'https://static.wikia.nocookie.net/plants-vs-zonbies-wiki/images/5/52/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B8%D0%B5_%D0%93%D0%BE%D1%80%D0%BE%D1%85%D0%BE%D1%81%D1%82%D1%80%D0%B5%D0%BB%D1%8B.png/revision/latest?cb=20190304153301&path-prefix=ru',
        rarity: 'epic'
    },
    'legendary1': { 
        name: 'УЛЬТРА ИНСТИНКТ ГОРОХ', 
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

// Текста для меняющихся слов
const changingTexts = [
    "Кликай быстрее!",
    "Вау! ты играешь в скучный кликер?",
    "абграбабара - Дейв",
    "Зомби отдыхают... лол",
    "СМОТРИ В ИНФО ЛИСТЕ НИЧЕГО НЕТ!!!",
    "Стань НАКЛИКНУТЫМ КЛИКОМ КЛИКАМИ КЛИКОСИКИАМ!",
    "попробуй также в Coockie Clicker!",
    "ты нищий?",
    "Кликай медленее!",
    "если честно эта игра то это сайт типо игры где ты кликаешь и зарабатывавешь капли воды хотя можешь пойти на кухню и попить воды",
    "витамин D"
];

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
const changingTextEl = document.getElementById('changing-text');

// Функция меняющегося текста
function startChangingText() {
    let currentIndex = 0;
    
    changingTextEl.textContent = changingTexts[currentIndex];
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % changingTexts.length;
        changingTextEl.textContent = changingTexts[currentIndex];
    }, 10000);
}

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
        unlockedSkins: unlockedSkins,
        currentSkin: currentSkin
    };
    localStorage.setItem('gorohostrelSave', JSON.stringify(gameData));
}

// Загрузка игры
function loadGame() {
    const saved = localStorage.getItem('gorohostrelSave');
    if (saved) {
        try {
            const gameData = JSON.parse(saved);
            
            score = gameData.score || 0;
            addPerClick = gameData.addPerClick || 1;
            addPerSecond = gameData.addPerSecond || 0;
            level = gameData.level || 1;
            exp = gameData.exp || 0;
            maxExp = gameData.maxExp || 100;
            totalClicks = gameData.totalClicks || 0;
            upgradePrices = gameData.upgradePrices || upgradePrices;
            unlockedSkins = gameData.unlockedSkins || ['default'];
            currentSkin = gameData.currentSkin || 'default';
            
            return true;
        } catch (e) {
            console.error('Ошибка загрузки сохранения:', e);
            return false;
        }
    }
    return false;
}

// Инициализация игры
function initGame() {
    const loaded = loadGame();
    
    updateDisplay();
    updateLevelDisplay();
    updatePricesDisplay();
    checkUpgradesAvailability();
    loadSkins();
    startChangingText();
    
    // Применяем текущий скин
    const allSkins = {...skins, ...clickSkins};
    if (currentSkin && allSkins[currentSkin]) {
        buttonEl.style.backgroundImage = `url(${allSkins[currentSkin].url})`;
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

// Исправленная функция покупки улучшения (МНОГОРАЗОВАЯ покупка)
function buyUpgrade(type, power, basePrice) {
    const requiredLevel = parseInt(event.target.getAttribute('data-level'));
    const currentPrice = upgradePrices[type];
    
    // Проверяем условия покупки
    if (score < currentPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    // Совершаем покупку
    score -= currentPrice;
    
    if (type.startsWith('click')) {
        addPerClick += power;
        addEl.textContent = addPerClick;
    } else if (type.startsWith('autoclick')) {
        addPerSecond += power;
    }
    
    // Увеличиваем цену на 17% для этого улучшения
    upgradePrices[type] = Math.round(currentPrice * 1.17);
    
    updateDisplay();
    updatePricesDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification("Улучшение куплено!");
}

// Функция покупки кейса
function buyCase() {
    if (score < 1250) {
        showNotification("Недостаточно капель для кейса!");
        return;
    }
    
    score -= 1250;
    
    const random = Math.random();
    let wonSkin = null;
    let rarity = '';
    
    if (random < 0.01) {
        rarity = 'legendary';
    } else if (random < 0.1) {
        rarity = 'epic';
    } else if (random < 0.4) {
        rarity = 'rare';
    } else {
        rarity = 'common';
    }
    
    const availableSkins = Object.keys(skins).filter(skinId => 
        skins[skinId].rarity === rarity && 
        skinId !== 'default' && 
        !unlockedSkins.includes(skinId)
    );
    
    if (availableSkins.length > 0) {
        wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
    }
    
    if (wonSkin) {
        unlockedSkins.push(wonSkin);
        showNotification(`🎉 Получен ${rarity} скин: ${skins[wonSkin].name}!`);
        loadSkins();
    } else {
        const compensation = 250;
        score += compensation;
        showNotification(`Все скины ${rarity} редкости уже есть! +${compensation} капель`);
    }
    
    updateDisplay();
    saveGame();
}

// Проверка разблокировки скинов за клики
function checkSkinUnlocks() {
    const allSkins = {...clickSkins};
    let unlockedNew = false;
    
    for (const skinId in allSkins) {
        if (!unlockedSkins.includes(skinId) && totalClicks >= allSkins[skinId].requiredClicks) {
            unlockedSkins.push(skinId);
            showNotification(`🎉 Разблокирован скин: ${allSkins[skinId].name}!`);
            unlockedNew = true;
        }
    }
    
    if (unlockedNew) {
        loadSkins();
        saveGame();
    }
}

// Загрузка скинов в инвентарь
function loadSkins() {
    skinsContainer.innerHTML = '';
    const allSkins = {...skins, ...clickSkins};
    
    unlockedSkins.forEach(skinId => {
        if (allSkins[skinId]) {
            const skin = allSkins[skinId];
            const skinItem = document.createElement('button');
            skinItem.className = `skin-item ${currentSkin === skinId ? 'active' : ''}`;
            skinItem.onclick = () => selectSkin(skinId);
            
            skinItem.innerHTML = `
                <img src="${skin.url}" alt="${skin.name}" onerror="this.src='https://pvsz2.ru/statics/plants-big/68.png'">
                <div>${skin.name}</div>
                <small>${skin.rarity}</small>
            `;
            
            skinsContainer.appendChild(skinItem);
        }
    });
}

// Выбор скина
function selectSkin(skinId) {
    const allSkins = {...skins, ...clickSkins};
    if (allSkins[skinId]) {
        currentSkin = skinId;
        buttonEl.style.backgroundImage = `url(${allSkins[skinId].url})`;
        loadSkins();
        saveGame();
    }
}

// Показать уведомление
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Проверка повышения уровня
function checkLevelUp() {
    if (exp >= maxExp) {
        level++;
        exp = 0;
        maxExp = Math.round(maxExp * 1.5);
        updateLevelDisplay();
        showNotification(`🎉 Уровень ${level} достигнут!`);
    }
}

// Обновление отображения
function updateDisplay() {
    scoreEl.textContent = Math.floor(score);
    addEl.textContent = addPerClick;
}

// Обновление уровня
function updateLevelDisplay() {
    levelEl.textContent = level;
    expEl.textContent = exp;
    maxExpEl.textContent = maxExp;
    const progressPercent = (exp / maxExp) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// Обновление цен
function updatePricesDisplay() {
    for (const type in upgradePrices) {
        const priceElement = document.getElementById(`${type}-price`);
        if (priceElement) {
            priceElement.textContent = upgradePrices[type];
        }
    }
}

// Проверка доступности улучшений
function checkUpgradesAvailability() {
    const upgradeButtons = document.querySelectorAll('.upgrade-item');
    upgradeButtons.forEach(button => {
        const price = parseInt(button.querySelector('span').textContent);
        const requiredLevel = parseInt(button.getAttribute('data-level'));
        
        if (score >= price && level >= requiredLevel) {
            button.disabled = false;
            button.style.background = 'lightblue';
        } else {
            button.disabled = true;
            button.style.background = '#7f8c8d';
        }
    });
}

// Управление панелями
function toggleShop() {
    document.getElementById('shop-panel').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    mainContent.classList.toggle('shop-open');
}

function closeShop() {
    document.getElementById('shop-panel').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    mainContent.classList.remove('shop-open');
}

function toggleInventory() {
    document.getElementById('inventory-panel').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
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
    // Скрыть все вкладки
    document.querySelectorAll('.shop-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убрать активный класс со всех кнопок вкладок
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Активировать кнопку выбранной вкладки
    event.target.classList.add('active');
}

// Автосохранение
function startAutosave() {
    setInterval(() => {
        saveGame();
    }, 10000);
}

// Авто-кликер
setInterval(() => {
    if (addPerSecond > 0) {
        score += addPerSecond;
        updateDisplay();
        saveGame();
    }
}, 1000);

window.addEventListener('beforeunload', () => {
    saveGame();
});

// Запуск игры
initGame();
