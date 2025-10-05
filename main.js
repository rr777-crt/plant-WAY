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

// Новая валюта - Солнце
let sunScore = 0;
let sunPerClick = 0.01;

// Бусты
let activeBoosts = {
    exp: { active: false, multiplier: 1, endTime: 0 },
    sun: { active: false, multiplier: 1, endTime: 0 },
    drop: { active: false, multiplier: 1, endTime: 0 }
};

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
    'mythic1': { 
        name: 'ГЕРОЙ ГОРОХ', 
        url: 'https://media.contentapi.ea.com/content/dam/eacom/en-us/migrated-images/2017/02/newsmedia-pvzh-2-feb-ftimg-greenshadow.png.adapt.crop191x100.628p.png',
        rarity: 'mythic'
    },
};

// Скины за клики (ПУТЬ)
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
    'path4': { 
        name: 'ПУТЬ: грохомёт', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/b/bf/Gatling_Pea_Fixed.png/revision/latest/thumbnail/width/360/height/360?cb=20190519095836&path-prefix=ru',
        rarity: 'path',
        requiredClicks: 1000000000
    },
    'path5': { 
        name: 'ПУТЬ: 2', 
        url: 'https://pvsz2.ru/statics/plants-big/90.png',
        rarity: 'path',
        requiredClicks: 15000000000
    },
    'path6': { 
        name: 'ПУТЬ: тристрел', 
        url: 'https://pvsz2.ru/statics/plants-big/104.png',
        rarity: 'path',
        requiredClicks: 500000000000
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
  "ВТОРАЯ ПОПЫТКА: ВЫЙДИ!!!!", "крутая система инвентаря?", 
  "вау как дорого стоит +250 на клик!",
    "... - второй раз", "ОМГ В ИНФ ЛИСТ ДОБАВЯТ ЧТО - то В 1.0.2?!?!?!",
  "если честно эта игра то это сайт типо игры где ты кликаешь и зарабатывавешь капли воды хотя можешь пойти в см знаешь куда... и не шали",
    "солнцы это полезно?",
  "ВОБЩЕТО СОЛНЦЫ ЕТО НЕ КЛАСИВОЕ НАЗВАНИЕ", 
  "О НОУ, СОЛНЦЕ ПАДАЕТ!", 
  "где мой тако?",
  "следущая фраза предсказывает будущее",
   "будешь нищим",
   "ЛОЛ!",
   "мен лень!!!!!!!!!!!!",
   "Также будь хорошим и не жди обновления ивент: солнечное затмение",
   "я говорю всегда правду",
   "я не плохой и не люблю людей которые долбят телефон",
   "стэндоф 2 ... прекрати",
   "А ТЫ ИГЛАЕС В ЛОБЛОКС?!?!?!",
   "слушай... советую еакопить много солнц",
   "...  3 раз... лол зачем?",
   "АКЦИЯ! +0% КО ВСЕМ ЦЕНАМ!!",
   "зайди в тг пж",
   "СКОЛЬКО СДЕСЬ УЖЕ ФРАЗ?!",
   "бес гламатный - какойто чел... хз... не правда",
   "ты богатый, ты хороший! держи в себя руках и не пальцем комната..."
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
const sunScoreEl = document.getElementById('sun-score');

// Функция меняющихся текстов
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
        casePrice: casePrice,
        sunScore: sunScore,
        sunPerClick: sunPerClick,
        activeBoosts: activeBoosts
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
            currentSkin = gameData.currentSkin || 'default';
            casePrice = gameData.casePrice || 1250;
            sunScore = gameData.sunScore || 0;
            sunPerClick = gameData.sunPerClick || 0.01;
            activeBoosts = gameData.activeBoosts || {
                exp: { active: false, multiplier: 1, endTime: 0 },
                sun: { active: false, multiplier: 1, endTime: 0 },
                drop: { active: false, multiplier: 1, endTime: 0 }
            };
            
            unlockedSkins = gameData.unlockedSkins || ['default'];
            
            return true;
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            return false;
        }
    }
    return false;
}

// Основной клик
buttonEl.onclick = function() {
    let dropMultiplier = activeBoosts.drop.active ? activeBoosts.drop.multiplier : 1;
    let expMultiplier = activeBoosts.exp.active ? activeBoosts.exp.multiplier : 1;
    let sunMultiplier = activeBoosts.sun.active ? activeBoosts.sun.multiplier : 1;
    
    score += addPerClick * dropMultiplier;
    exp += 1 * expMultiplier;
    sunScore += sunPerClick * sunMultiplier;
    totalClicks += 1;
    
    updateDisplay();
    checkLevelUp();
    checkSkinUnlocks();
    checkUpgradesAvailability();
    saveGame();
};

// Проверка разблокировки скинов
function checkSkinUnlocks() {
    const allSkins = {...skins, ...clickSkins};
    let unlockedNew = false;
    
    for (const skinId in allSkins) {
        if (skinId === 'default') continue;
        
        if (!unlockedSkins.includes(skinId)) {
            const skin = allSkins[skinId];
            
            if (skin.rarity === 'path' && skin.requiredClicks && totalClicks >= skin.requiredClicks) {
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

// Покупка улучшения (ПРОСТАЯ ВЕРСИЯ)
function buyUpgrade(type, power, basePrice) {
    const button = event.target.closest('.upgrade-item');
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

// Обмен солнц
function buySunExchange(drops, sunCost) {
    const button = event.target.closest('.upgrade-item');
    const requiredLevel = parseInt(button.getAttribute('data-level'));
    
    if (sunScore < sunCost) {
        showNotification("Недостаточно солнц!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    sunScore -= sunCost;
    score += drops;
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification(`Получено ${drops} капель!`);
}

// Покупка предмета
function buyItem(itemType) {
    const button = event.target.closest('.upgrade-item');
    const price = parseInt(button.querySelector('.price-display').textContent);
    const requiredLevel = parseInt(button.getAttribute('data-level'));
    
    if (sunScore < price) {
        showNotification("Недостаточно солнц!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    sunScore -= price;
    
    const boostDuration = 2 * 60 * 1000;
    
    switch(itemType) {
        case 'exp1':
            activeBoosts.exp = { active: true, multiplier: 2, endTime: Date.now() + boostDuration };
            showNotification("×2 опыта на 2 минуты!");
            break;
        case 'exp2':
            activeBoosts.exp = { active: true, multiplier: 5, endTime: Date.now() + boostDuration };
            showNotification("×5 опыта на 2 минуты!");
            break;
        case 'sunBoost':
            activeBoosts.sun = { active: true, multiplier: 2, endTime: Date.now() + boostDuration };
            showNotification("×2 солнц на 2 минуты!");
            break;
        case 'levelUp':
            level++;
            exp = 0;
            maxExp = Math.round(maxExp * 1.04);
            showNotification("Уровень повышен!");
            updateLevelDisplay();
            break;
        case 'dropBoost':
            activeBoosts.drop = { active: true, multiplier: 1.5, endTime: Date.now() + boostDuration };
            showNotification("×1.5 капель на 2 минуты!");
            break;
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Покупка кейса
function buyCase() {
    const button = document.querySelector('#cases-tab .upgrade-item');
    const price = parseInt(button.querySelector('.price-display').textContent);
    
    if (score < price) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    score -= price;
    
    const random = Math.random();
    let rarity = '';
  
  if (random < 0.004) rarity = 'mythic';      // 0.4% - мифический
else if (random < 0.014) rarity = 'legendary'; // 1% - легендарный (0.4% + 1% = 1.4%)
else if (random < 0.1) rarity = 'epic';      // 8.6% - эпический
else if (random < 0.4) rarity = 'rare';      // 30% - редкий
else rarity = 'common';                      // 60% - обычный                  // 48.6% - обычный
    
    const availableSkins = Object.keys(skins).filter(skinId => 
        skins[skinId].rarity === rarity && 
        skinId !== 'default' && 
        !unlockedSkins.includes(skinId)
    );
    
    if (availableSkins.length > 0) {
        const wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        unlockedSkins.push(wonSkin);
        showNotification(`🎉 ${skins[wonSkin].name} (${rarity})!`);
        loadSkins();
    } else {
        const compensation = Math.round(price * 0.5);
        score += compensation;
        showNotification(`Все скины ${rarity} есть! +${compensation} капель`);
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Проверка доступности улучшений
function checkUpgradesAvailability() {
    const upgradeButtons = document.querySelectorAll('.upgrade-item');
    
    upgradeButtons.forEach(button => {
        const priceElement = button.querySelector('span');
        let price = 0;
        
        if (priceElement) {
            price = parseInt(priceElement.textContent) || 0;
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

// Загрузка скинов
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

// Проверка уровня
function checkLevelUp() {
    while (exp >= maxExp) {
        level++;
        exp -= maxExp;
        maxExp = Math.round(maxExp * 1.04);
        showNotification(`🎉 Уровень ${level}!`);
    }
    updateLevelDisplay();
}

// Обновление отображения
function updateDisplay() {
    scoreEl.textContent = Math.floor(score);
    addEl.textContent = addPerClick;
    sunScoreEl.textContent = sunScore.toFixed(2);
}

// Обновление уровня
function updateLevelDisplay() {
    levelEl.textContent = level;
    expEl.textContent = Math.floor(exp);
    maxExpEl.textContent = maxExp;
    const progressPercent = (exp / maxExp) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// Управление панелями
function toggleShop() {
    document.getElementById('shop-panel').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    mainContent.classList.toggle('shop-open');
    checkUpgradesAvailability();
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

// Проверка бустов
function startBoostChecker() {
    setInterval(() => {
        const now = Date.now();
        let updated = false;
        
        for (const boostType in activeBoosts) {
            if (activeBoosts[boostType].active && now > activeBoosts[boostType].endTime) {
                activeBoosts[boostType].active = false;
                activeBoosts[boostType].multiplier = 1;
                updated = true;
            }
        }
        
        if (updated) saveGame();
    }, 1000);
}

// Авто-кликер
setInterval(() => {
    if (addPerSecond > 0) {
        score += addPerSecond;
        updateDisplay();
        saveGame();
    }
}, 1000);

// Автосохранение
setInterval(() => {
    saveGame();
}, 10000);

// Инициализация игры
function initGame() {
    loadGame();
    updateDisplay();
    updateLevelDisplay();
    loadSkins();
    startChangingText();
    checkSkinUnlocks();
    checkUpgradesAvailability();
    startBoostChecker();
    
    // Применяем текущий скин
    const allSkins = {...skins, ...clickSkins};
    if (currentSkin && allSkins[currentSkin]) {
        buttonEl.style.backgroundImage = `url(${allSkins[currentSkin].url})`;
    }
}

// Запуск игры
initGame();
