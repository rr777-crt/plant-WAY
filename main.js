'use strict';

// Переменные игры
let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let level = 1;
let exp = 0;
let maxExp = 100;
let totalClicks = 0;
let casePrice = 1250;

// Скины
let unlockedSkins = ['default'];
let currentSkin = 'default';
const skins = {
    'default': { 
        name: 'Стандартный', 
        url: 'https://pvsz2.ru/statics/plants-big/68.png',
        rarity: 'common',
        unlockedByDefault: true
    },
    'common1': { 
        name: 'Ретро', 
        url: 'https://i.pinimg.com/736x/c1/39/78/c139780ac0699dc7ea89b960a7c65db1.jpg',
        rarity: 'common'
    },
    'rare1': { 
        name: 'Зомби?', 
        url: 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-felv-p-gorokhostrel-png-29.png',
        rarity: 'rare'
    },
    'epic1': { 
        name: 'ИГРУШКА', 
        url: 'https://static.insales-cdn.com/r/wyLYTi_x4PA/rs:fit:1000:1000:1/plain/images/products/1/6518/738343286/S99b344709a2c437bad3d5228ff5c2989D-removebg-preview.png@png',
        rarity: 'epic'
    },
    'legendary1': { 
        name: 'УЛЬТРА ИНСТИНКТ ГОРОХ', 
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtVQyQTbYoKxhSByfHMhQF4zmNxkH6Vm0vPQ&s',
        rarity: 'legendary'
    },
};

// Скины за клики (ПУТЬ) - эти НЕ выпадают из кейсов
const clickSkins = {
    'path1': { 
        name: 'ПУТЬ: Ледяной', 
        url: 'https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg',
        rarity: 'path',
        requiredClicks: 1000
    },
    'path2': { 
        name: 'ПУТЬ: Огненый', 
        url: 'https://pvsz2.ru/statics/plants-big/31.png',
        rarity: 'path',
        requiredClicks: 10000
    },
    'path3': { 
        name: 'ПУТЬ: теневой', 
        url: 'https://avatars.mds.yandex.net/i?id=69a2b4239be746c0863ff1d2bf2c2a75_l-8972142-images-thumbs&n=13',
        rarity: 'path',
        requiredClicks: 1000000
    },
   'path3': { 
        name: 'ПУТЬ: грохомёт', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/b/bf/Gatling_Pea_Fixed.png/revision/latest/thumbnail/width/360/height/360?cb=20190519095836&path-prefix=ru',
        rarity: 'path',
        requiredClicks: 25000000
    },
   'path3': { 
        name: 'ПУТЬ: 2', 
        url: 'https://pvsz2.ru/statics/plants-big/90.png',
        rarity: 'path',
        requiredClicks: 500000000
    },
   'path3': { 
        name: 'ПУТЬ: тристрел', 
        url: 'https://pvsz2.ru/statics/plants-big/104.png',
        rarity: 'path',
        requiredClicks: 2500000000
    }
   
};

// Текста для меняющихся слов
const changingTexts = [
    "Кликай быстрее!",
    "привет",
    "Вау! ты играешь в скучный кликер?",
    "абграбабара - Дейв",
    "Зомби отдыхают... лол",
    "СМОТРИ В ИНФО ЛИСТЕ НИЧЕГО НЕТ!!! подождитека...!",
    "Стань НАКЛИКНУТЫМ КЛИКОМ КЛИКАМИ КЛИКОСИКИАМ!",
    "попробуй также в Coockie Clicker!",
    "ты нищий?",
    "Кликай медленее!",
    "если честно эта игра то это сайт типо игры где ты кликаешь и зарабатывавешь капли воды хотя можешь пойти на кухню и попить воды",
    "витамин D",
    "...",
    "попытай удачи и иди в казик! ой то-есть открой кейс!",
    "витамин C ой.. фотосинтез... ой да пошло",
    "cool... so what the tung sahur - cringe",
    "долго сидишь",
    "если честно эта игра то это сайт типо игры где ты кликаешь и зарабатывавешь капли воды хотя можешь пойти в туалет. стоп я это уже говорил?",
    "меня зовут печенька?",
    "ВЫЙДИ!",
    "ВТОРАЯ ПОПЫТКА: ВЫЙДИ!!!!",
    "крутая система инвентаря?",
    "вау как дорого стоит +250 на клик!",
    "... - второй раз",
    "ОМГ В ИНФ ЛИСТ ДОБАВЯТ ЧТО - то В 1.0.2?!?!?!",
    "если честно эта игра то это сайт типо игры где ты кликаешь и зарабатывавешь капли воды хотя можешь пойти в см знаешь куда... и не шали",
   "солнцы это полезно?",
   "ВОБЩЕТО СОЛНЦЫ ЕТО НЕ КЛАСИВОЕ НАЗВАНИЕ",
   "О НОУ, СОЛНЦЕ ПАДАЕТ!",
   "где мой тако?",
  "СМОТРИ! ЭТО САМАЯ БЕСПОЛЕЗНАЯ ИНФОРМАЦИЯ!"
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
        unlockedSkins: unlockedSkins,
        currentSkin: currentSkin,
        casePrice: casePrice
    };
    localStorage.setItem('gorohostrelSave', JSON.stringify(gameData));
    console.log('Игра сохранена. Разблокировано скинов:', unlockedSkins.length);
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
            currentSkin = gameData.currentSkin || 'default';
            casePrice = gameData.casePrice || 1250;
            
            unlockedSkins = gameData.unlockedSkins || ['default'];
            
            console.log('Игра загружена. Разблокировано скинов:', unlockedSkins.length);
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
    updateCasePriceDisplay();
    checkUpgradesAvailability();
    loadSkins();
    startChangingText();
    
    // Применяем текущий скин
    const allSkins = {...skins, ...clickSkins};
    if (currentSkin && allSkins[currentSkin]) {
        buttonEl.style.backgroundImage = `url(${allSkins[currentSkin].url})`;
    }
    
    startAutosave();
    
    // Проверяем скины сразу после загрузки
    checkAllSkinUnlocks();
}

// Основной клик
buttonEl.onclick = function() {
    score += addPerClick;
    exp += 1;
    totalClicks += 1;
    updateDisplay();
    checkLevelUp();
    checkAllSkinUnlocks();
    checkUpgradesAvailability();
    saveGame();
};

// Проверка всех типов скинов
function checkAllSkinUnlocks() {
    let unlockedNew = false;
    const allSkins = {...skins, ...clickSkins};
    
    for (const skinId in allSkins) {
        // Пропускаем default скин, он уже разблокирован
        if (skinId === 'default') continue;
        
        if (!unlockedSkins.includes(skinId)) {
            const skin = allSkins[skinId];
            let shouldUnlock = false;
            
            // Проверяем скины за клики (только ПУТЬ скины)
            if (skin.rarity === 'path' && skin.requiredClicks && totalClicks >= skin.requiredClicks) {
                shouldUnlock = true;
                console.log(`Разблокирован скин ПУТЬ ${skin.name} за ${skin.requiredClicks} кликов!`);
            }
            
            if (shouldUnlock) {
                unlockedSkins.push(skinId);
                showNotification(`🎉 Разблокирован скин: ${skin.name}!`);
                unlockedNew = true;
            }
        }
    }
    
    if (unlockedNew) {
        loadSkins();
        saveGame();
    }
}

// Функция покупки улучшения
function buyUpgrade(type, power, basePrice) {
    const button = event.target.closest('.upgrade-item');
    if (!button) return;
    
    const priceElement = button.querySelector('span');
    const currentPrice = parseInt(priceElement.textContent);
    const requiredLevel = parseInt(button.getAttribute('data-level'));
    
    if (score < currentPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    score -= currentPrice;
    
    if (type.startsWith('click')) {
        addPerClick += power;
        addEl.textContent = addPerClick;
    } else if (type.startsWith('autoclick')) {
        addPerSecond += power;
    }
    
    const newPrice = Math.round(currentPrice * 1.10);
    priceElement.textContent = newPrice;
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification("Улучшение куплено!");
}

// Функция покупки кейса - ТОЛЬКО скины из объекта skins (НЕ ПУТЬ)
function buyCase() {
    if (score < casePrice) {
        showNotification("Недостаточно капель для кейса!");
        return;
    }
    
    score -= casePrice;
    casePrice = Math.round(casePrice * 1.01);
    updateCasePriceDisplay();
    
    const random = Math.random();
    let wonSkin = null;
    let rarity = '';
    
    // Определяем редкость
    if (random < 0.01) {
        rarity = 'legendary';
    } else if (random < 0.1) {
        rarity = 'epic';
    } else if (random < 0.4) {
        rarity = 'rare';
    } else {
        rarity = 'common';
    }
    
    console.log(`Выпала редкость: ${rarity}`);
    
    // Ищем доступные скины этой редкости из объекта skins (НЕ ПУТЬ)
    const availableSkins = Object.keys(skins).filter(skinId => 
        skins[skinId].rarity === rarity && 
        skinId !== 'default' && 
        !unlockedSkins.includes(skinId)
    );
    
    console.log(`Доступные скины ${rarity} из кейса:`, availableSkins);
    
    if (availableSkins.length > 0) {
        wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        unlockedSkins.push(wonSkin);
        showNotification(`🎉 Получен ${rarity} скин: ${skins[wonSkin].name}!`);
        console.log(`Выигран скин из кейса: ${wonSkin}`);
        loadSkins();
    } else {
        // Если все скины этой редкости уже есть
        const compensation = Math.round(casePrice * 0.2);
        score += compensation;
        showNotification(`Все скины ${rarity} редкости уже есть! +${compensation} капель`);
        console.log(`Все скины ${rarity} редкости уже разблокированы`);
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Обновление отображения цены кейса
function updateCasePriceDisplay() {
    const caseButton = document.querySelector('#cases-tab .upgrade-item');
    if (caseButton) {
        const priceText = caseButton.querySelector('strong').nextSibling;
        if (priceText) {
            priceText.textContent = `Цена: ${casePrice} капель`;
        }
    }
}

// Загрузка скинов в инвентарь
function loadSkins() {
    skinsContainer.innerHTML = '';
    const allSkins = {...skins, ...clickSkins};
    
    const sortedSkins = [...unlockedSkins].sort((a, b) => {
        const rarityOrder = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4, 'path': 5 };
        return rarityOrder[allSkins[b].rarity] - rarityOrder[allSkins[a].rarity];
    });
    
    sortedSkins.forEach(skinId => {
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
    
    console.log('Загружено скинов в инвентарь:', unlockedSkins.length);
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
    while (exp >= maxExp) {
        level++;
        exp -= maxExp;
        maxExp = Math.round(maxExp * 1.04);
        showNotification(`🎉 Уровень ${level} достигнут!`);
    }
    updateLevelDisplay();
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

// Проверка доступности улучшений
function checkUpgradesAvailability() {
    const upgradeButtons = document.querySelectorAll('.upgrade-item');
    upgradeButtons.forEach(button => {
        const priceElement = button.querySelector('span');
        let price = 0;
        
        if (priceElement) {
            price = parseInt(priceElement.textContent) || 0;
        } else {
            if (button.querySelector('strong') && button.querySelector('strong').textContent === 'Обычный кейс') {
                price = casePrice;
            }
        }
        
        const requiredLevel = parseInt(button.getAttribute('data-level')) || 1;
        
        if (score >= price && level >= requiredLevel) {
            button.disabled = false;
            button.style.background = 'lightblue';
            button.style.cursor = 'pointer';
        } else {
            button.disabled = true;
            button.style.background = '#7f8c8d';
            button.style.cursor = 'not-allowed';
        }
    });
}

// Управление панелями
function toggleShop() {
    document.getElementById('shop-panel').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    mainContent.classList.toggle('shop-open');
    if (document.getElementById('shop-panel').classList.contains('active')) {
        checkUpgradesAvailability();
    }
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
    document.querySelectorAll('.shop-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    checkUpgradesAvailability();
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
        checkUpgradesAvailability();
        saveGame();
    }
}, 1000);

window.addEventListener('beforeunload', () => {
    saveGame();
});

// Запуск игры
initGame();
