'use strict';

// НАСТРОЙКИ ВРЕМЕНИ ИВЕНТА
const EVENT_SETTINGS = {
    firstEventDelay: 10 * 60 * 1000,    // 1 минута до первого ивента
    eventDuration: 5 * 60 * 1000,      // 5 минут длительность ивента
    eventCooldown: 10 * 60 * 1000       // 1 минута между ивентами
};

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

// Ивент переменные
let darkShards = 0;
let shardsPerClick = 0;
let unlockedStages = [1];
let eventActive = false;
let eventTimeLeft = 0;
let eventInterval;
let nextEventTime = EVENT_SETTINGS.firstEventDelay;
let eventCooldownTime = 0;
let eventCooldownInterval;

// Система множителей цен
let priceMultipliers = {
    upgrades: {},
    autoClickers: {},
    sunExchanges: {},
    eventUpgrades: {}
};

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
    'pea1': { 
        name: 'ВСЕЛЕННАЯ 3', 
        url: 'https://static.wikia.nocookie.net/plantsvs-zombies/images/c/c5/Peashooter_29.webp/revision/latest?cb=20250830052323&path-prefix=ru',
        rarity: 'pea'
    }
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
    },
   'path7': { 
        name: 'ПУТЬ: гороховая хватка', 
        url: 'https://pvsz2.ru/statics/plants-big/127.png',
        rarity: 'path',
        requiredClicks: 6200000000000
    }
};

// Скины тёмного солнца
const darkSkins = {
    'dark_common1': { 
        name: 'неизвестно', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/9/9b/%D0%A2%D1%91%D0%BC%D0%BD%D1%8B%D0%B9_%D0%B3%D0%BE%D1%80%D0%BE%D1%85%D0%BE%D1%81%D1%82%D1%80%D0%B5%D0%BB.png/revision/latest/thumbnail/width/360/height/360?cb=20200326034111&path-prefix=ru',
        rarity: 'common'
    },
    'dark_rare1': { 
        name: 'тёмная материя грохострела ( эм.. что?) ', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/e/e1/Goopeashooter.png/revision/latest?cb=20190928065425&path-prefix=ru',
        rarity: 'rare'
    },
    'dark_epic1': { 
        name: 'Тёмный грохострел с шляпкой', 
        url: 'https://static.wikia.nocookie.net/plantsvs-zombies/images/b/b0/Shadow_Peashooter_Costume_HD.png/revision/latest/scale-to-width-down/250?cb=20200612154633&path-prefix=ru',
        rarity: 'epic'
    },
    'dark_legendary1': { 
        name: 'нарисованый', 
        url: 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-espz-p-gorokhostrel-png-4.png',
        rarity: 'legendary'
    },
    'dark_mythic1': { 
        name: 'ледяное 2', 
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjBj7ss86nUrKP6IEpSnCMN6_E57EFNoAEiA&s',
        rarity: 'mythic'
    },
    'dark_ultimate': { 
        name: 'МАЙНКРАФТ', 
        url: 'https://skinsmc.org/skinrender/aHR0cHM6Ly9za2luc21jLnMzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tLzM2OGUxNDYzMzUzZDRhOGRiNzAwNGM1N2Q5Yzg4MjA1',
        rarity: 'dark'
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
     "следущая фраза не предсказывает будущее",
    "будешь богатым",
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
    "О НОУ, СОЛНЕЧНОЕ ЗАТМЕНИЕ!", 
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
    "ты богатый, ты хороший! держи в себя руках и не пальцем комната...",
  "что здесь ещё придумать?",
  "ТЫ ПОЛУИЛ ГОРОХНЫЙ?",
  "О НОУ! ТУАЛЕТ ПАДАЕТ",
  "ты видишь как ты играешь в эту игру, которую создовали ??? веков ,а точнее миллисикунд",
  "1.0.5 - это круто"
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
const eventNotification = document.getElementById('event-notification');
const mainContent = document.getElementById('main-content');
const changingTextEl = document.getElementById('changing-text');
const sunScoreEl = document.getElementById('sun-score');
const eventTimerEl = document.getElementById('event-timer');
const shardScoreEl = document.getElementById('shard-score');

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
        activeBoosts: activeBoosts,
        // Новые данные ивента
        darkShards: darkShards,
        shardsPerClick: shardsPerClick,
        unlockedStages: unlockedStages,
        eventActive: eventActive,
        eventTimeLeft: eventTimeLeft,
        nextEventTime: nextEventTime,
        eventCooldownTime: eventCooldownTime,
        // Система множителей цен
        priceMultipliers: priceMultipliers
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
            
            // Новые данные ивента
            darkShards = gameData.darkShards || 0;
            shardsPerClick = gameData.shardsPerClick || 0;
            unlockedStages = gameData.unlockedStages || [1];
            eventActive = gameData.eventActive || false;
            eventTimeLeft = gameData.eventTimeLeft || 0;
            nextEventTime = gameData.nextEventTime || EVENT_SETTINGS.firstEventDelay;
            eventCooldownTime = gameData.eventCooldownTime || 0;
            
            // Система множителей цен
            priceMultipliers = gameData.priceMultipliers || {
                upgrades: {},
                autoClickers: {},
                sunExchanges: {},
                eventUpgrades: {}
            };
            
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
    
    // Заработок осколков во время ивента - ИСПРАВЛЕНО
    if (eventActive) {
        let shardsEarned = 0;
        
        // Базовая награда за клик во время ивента
        shardsEarned += 1;
        
        // Добавляем бонусы от улучшений
        shardsEarned += shardsPerClick;
        
        darkShards += shardsEarned;
        updateEventDisplay();
        
        // Показываем визуальный эффект заработка осколков
        if (shardsEarned > 0) {
            showShardEarned(shardsEarned);
        }
    }
    
    updateDisplay();
    checkLevelUp();
    checkSkinUnlocks();
    checkUpgradesAvailability();
    saveGame();
};

// Визуальный эффект заработка осколков
function showShardEarned(amount) {
    const shardPopup = document.createElement('div');
    shardPopup.textContent = `+${amount} осколков`;
    shardPopup.style.position = 'absolute';
    shardPopup.style.color = '#8e44ad';
    shardPopup.style.fontWeight = 'bold';
    shardPopup.style.fontSize = '16px';
    shardPopup.style.pointerEvents = 'none';
    shardPopup.style.zIndex = '1000';
    shardPopup.style.textShadow = '1px 1px 2px black';
    
    // Позиционируем возле кнопки
    const rect = buttonEl.getBoundingClientRect();
    shardPopup.style.left = (rect.left + rect.width / 2) + 'px';
    shardPopup.style.top = (rect.top - 20) + 'px';
    
    document.body.appendChild(shardPopup);
    
    // Анимация всплывания
    let opacity = 1;
    let top = parseInt(shardPopup.style.top);
    const animation = setInterval(() => {
        opacity -= 0.02;
        top -= 1;
        shardPopup.style.opacity = opacity;
        shardPopup.style.top = top + 'px';
        
        if (opacity <= 0) {
            clearInterval(animation);
            document.body.removeChild(shardPopup);
        }
    }, 30);
}

// Покупка улучшения клика с инфляцией
function buyUpgrade(power, basePrice, requiredLevel = 1) {
    const upgradeKey = `upgrade_${power}_${basePrice}`;
    const currentMultiplier = priceMultipliers.upgrades[upgradeKey] || 1;
    const actualPrice = Math.round(basePrice * currentMultiplier);
    
    if (score < actualPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    score -= actualPrice;
    addPerClick += power;
    
    // Увеличиваем цену на 10%
    priceMultipliers.upgrades[upgradeKey] = currentMultiplier * 1.1;
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification(`Улучшение куплено! +${power} на клик`);
}

// Покупка авто-кликера с инфляцией
function buyAutoClicker(power, basePrice, requiredLevel = 1) {
    const autoClickerKey = `autoclicker_${power}_${basePrice}`;
    const currentMultiplier = priceMultipliers.autoClickers[autoClickerKey] || 1;
    const actualPrice = Math.round(basePrice * currentMultiplier);
    
    if (score < actualPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    score -= actualPrice;
    addPerSecond += power;
    
    // Увеличиваем цену на 10%
    priceMultipliers.autoClickers[autoClickerKey] = currentMultiplier * 1.1;
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification(`Авто-кликер куплен! +${power}/сек`);
}

// Обмен солнц с инфляцией
function buySunExchange(drops, sunCost) {
    const exchangeKey = `exchange_${drops}_${sunCost}`;
    const currentMultiplier = priceMultipliers.sunExchanges[exchangeKey] || 1;
    const actualSunCost = Math.round(sunCost * currentMultiplier);
    
    if (sunScore < actualSunCost) {
        showNotification("Недостаточно солнц!");
        return;
    }
    
    const requiredLevel = parseInt(event.target.closest('.upgrade-item').getAttribute('data-level'));
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    sunScore -= actualSunCost;
    score += drops;
    
    // Увеличиваем цену на 10%
    priceMultipliers.sunExchanges[exchangeKey] = currentMultiplier * 1.1;
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification(`Получено ${drops} капель!`);
}

// Покупка предмета (без инфляции)
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
        case 'sunBoost2':
            activeBoosts.sun = { active: true, multiplier: 3, endTime: Date.now() + (3 * 60 * 1000) };
            showNotification("×3 солнц на 3 минуты!");
            break;
         case '???':
            activeBoosts.sun = { active: true, multiplier: 10, endTime: Date.now() + (10 * 60 * 1000) };
          activeBoosts.drop = { active: true, multiplier: 5, endTime: Date.now() + (10 * 60 * 1000) };
          activeBoosts.sun = { active: true, multiplier: 6, endTime: Date.now() + (10 * 60 * 1000) };
            showNotification("×10 солнц на 10 минут! и в 10 раз больше капель на 5 мин + в 6 раз больше опыта на 10 мин!!!!");
            break;
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Покупка кейса (без инфляции)
function buyCase() {
    const basePrice = 1250;
    
    if (score < basePrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    score -= basePrice;
    
    const random = Math.random();
    let rarity = '';
    
    if (random < 0.00055) rarity = 'pea';
    else if (random < 0.00455) rarity = 'mythic';
    else if (random < 0.01455) rarity = 'legendary';
    else if (random < 0.10055) rarity = 'epic';
    else if (random < 0.40055) rarity = 'rare';
    else rarity = 'common';
    
    const availableSkins = Object.keys(skins).filter(skinId => 
        skins[skinId].rarity === rarity && 
        skinId !== 'default' && 
        !unlockedSkins.includes(skinId)
    );
    
    if (availableSkins.length > 0) {
        const wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        unlockedSkins.push(wonSkin);
        
        if (rarity === 'pea') {
            showNotification(`🎉🎉🎉 НЕВЕРОЯТНО! ${skins[wonSkin].name} (ГОРОХНЫЙ)!!! 🎉🎉🎉`);
        } else {
            showNotification(`🎉 ${skins[wonSkin].name} (${rarity})!`);
        }
        
        loadSkins();
    } else {
        const compensation = Math.round(basePrice * (rarity === 'pea' ? 10 : 0.5));
        score += compensation;
        showNotification(`Все скины ${rarity} есть! +${compensation} капель`);
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Функции для ивента
function startEvent() {
    eventActive = true;
    eventTimeLeft = EVENT_SETTINGS.eventDuration;
    showEventNotification("🌑 СОЛНЕЧНОЕ ЗАТМЕНИЕ! 🌑\nЗарабатывайте осколки тёмного солнца!");
    
    // Останавливаем таймер кулдауна
    if (eventCooldownInterval) {
        clearInterval(eventCooldownInterval);
        eventCooldownInterval = null;
    }
    
    eventInterval = setInterval(() => {
        eventTimeLeft -= 1000;
        updateEventTimer();
        
        if (eventTimeLeft <= 0) {
            endEvent();
        }
    }, 1000);
    
    updateEventButtons();
    saveGame();
}

function endEvent() {
    eventActive = false;
    clearInterval(eventInterval);
    eventCooldownTime = EVENT_SETTINGS.eventCooldown;
    showEventNotification("Затмение закончилось! Следующее через 1 минуту.");
    
    // Запускаем таймер кулдауна
    eventCooldownInterval = setInterval(() => {
        eventCooldownTime -= 1000;
        updateEventCooldownTimer();
        
        if (eventCooldownTime <= 0) {
            clearInterval(eventCooldownInterval);
            startEvent();
        }
    }, 1000);
    
    updateEventButtons();
    saveGame();
}

function updateEventTimer() {
    const minutes = Math.floor(eventTimeLeft / 60000);
    const seconds = Math.floor((eventTimeLeft % 60000) / 1000);
    eventTimerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateEventCooldownTimer() {
    const minutes = Math.floor(eventCooldownTime / 60000);
    const seconds = Math.floor((eventCooldownTime % 60000) / 1000);
    eventTimerEl.textContent = `До ивента: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateEventDisplay() {
    shardScoreEl.textContent = Math.floor(darkShards);
}

function showEventNotification(message) {
    eventNotification.textContent = message;
    eventNotification.classList.add('show');
    
    setTimeout(() => {
        eventNotification.classList.remove('show');
    }, 3000);
}

// Управление панелями ивента
function toggleEvent() {
    document.getElementById('event-panel').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    mainContent.classList.toggle('event-open');
    updateEventButtons();
}

function closeEvent() {
    document.getElementById('event-panel').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    mainContent.classList.remove('event-open');
}

function openEventTab(tabName) {
    document.querySelectorAll('.shop-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    updateEventButtons();
}

// Покупка доступа к этапам (без инфляции)
function buyStageAccess(stage, price) {
    if (darkShards < price) {
        showNotification("Недостаточно осколков!");
        return;
    }
    
    darkShards -= price;
    if (!unlockedStages.includes(stage)) {
        unlockedStages.push(stage);
    }
    updateEventDisplay();
    updateEventButtons();
    saveGame();
    showNotification(`Этап ${stage} разблокирован!`);
}

// Покупка улучшений ивента с инфляцией
function buyEventUpgrade(type, basePrice, requiredStage) {
    const eventKey = `event_${type}_${basePrice}`;
    const currentMultiplier = priceMultipliers.eventUpgrades[eventKey] || 1;
    const actualPrice = Math.round(basePrice * currentMultiplier);
    
    if (darkShards < actualPrice) {
        showNotification("Недостаточно осколков!");
        return;
    }
  
   if (requiredStage > 1 && !unlockedStages.includes(requiredStage)) {
        showNotification(`Сначала разблокируйте этап ${requiredStage}!`);
        return;
    }
  
    if (requiredStage === 2 && !unlockedStages.includes(2)) {
        showNotification("Сначала разблокируйте 2 этап ");
        return;
    }
    if (requiredStage === 4 && !unlockedStages.includes(4)) {
        showNotification("Сначала разблокируйте 4 этап ");
        return;
    }
    
   
    darkShards -= actualPrice;
    
    switch(type) {
        case 'shard1':
            shardsPerClick += 1;
            showNotification("+1 осколок на клик!");
            break;
        case 'shard2':
            shardsPerClick += 5;
            showNotification("+5 осколков на клик!");
            break;
        case 'shard3':
            shardsPerClick += 15;
            showNotification("+15 осколков на клик!");
            break;
        case 'drop1':
            addPerClick += 45;
            showNotification("+45 капель на клик!");
            break;
        case 'drop2':
            addPerClick += 250;
            showNotification("+250 капель на клик!");
            break;
        case 'drop3':
            addPerClick += 1000;
            showNotification("+1000 капель на клик!");
            break;
        case 'drop4':
            addPerClick += 3500;
            showNotification("+3500 капель на клик!");
            break;
        case 'sun1':
            sunPerClick += 0.002;
            showNotification("+0.002 солнца на клик!");
            break;
        case 'level':
            level += 3;
            exp = 0;
            maxExp = Math.round(maxExp * 1.04 * 1.04 * 1.04);
            updateLevelDisplay();
            showNotification("+3 уровня!");
            break;
        case 'megaDrop':
            score += 1000000000;
            showNotification("+1,000,000,000 капель!");
            break;
    }
    
    priceMultipliers.eventUpgrades[eventKey] = currentMultiplier * 1.1;
    
    updateEventDisplay();
    updateDisplay();
    updateEventButtons();
    saveGame();
}

// Покупка кейса ивента (без инфляции)
function buyEventCase() {
    const basePrice = 666;
    
    if (darkShards < basePrice) {
        showNotification("Недостаточно осколков!");
        return;
    }
    
    if (!unlockedStages.includes(3)) {
        showNotification("Сначала разблокируйте 3 этап!");
        return;
    }
    
    darkShards -= basePrice;
    
    const random = Math.random();
    let rarity = '';
    
    if (random < 0.001) rarity = 'dark';
    else if (random < 0.006) rarity = 'mythic';
    else if (random < 0.03) rarity = 'legendary';
    else if (random < 0.08) rarity = 'epic';
    else if (random < 0.3) rarity = 'rare';
    else rarity = 'common';
    
    const availableSkins = Object.keys(darkSkins).filter(skinId => 
        darkSkins[skinId].rarity === rarity && 
        !unlockedSkins.includes(skinId)
    );
    
    if (availableSkins.length > 0) {
        const wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        unlockedSkins.push(wonSkin);
        
        if (rarity === 'dark') {
            showNotification(`🎉🌑 НЕВЕРОЯТНО! ${darkSkins[wonSkin].name} (ТЁМНЫЙ)!!! 🌑🎉`);
        } else {
            showNotification(`🎉 ${darkSkins[wonSkin].name} (${rarity})!`);
        }
        
        loadSkins();
    } else {
        const compensation = Math.round(basePrice * (rarity === 'dark' ? 10 : 0.5));
        darkShards += compensation;
        showNotification(`Все ${rarity} скины есть! +${compensation} осколков`);
    }
    
    updateEventDisplay();
    updateEventButtons();
    saveGame();
}

// Обновление кнопок ивента
function updateEventButtons() {
    // Обновляем видимость кнопок этапов
    for (let stage = 2; stage <= 4; stage++) {
        const lockBtn = document.getElementById(`stage${stage}-lock`);
        const stageUnlocked = unlockedStages.includes(stage);
        
        if (lockBtn) {
            lockBtn.style.display = stageUnlocked ? 'none' : 'block';
        }
        
        // Показываем/скрываем улучшения в зависимости от разблокировки этапа
        document.querySelectorAll(`.upgrade-item[data-stage="${stage}"]`).forEach(btn => {
            if (!btn.classList.contains('stage-locked')) {
                btn.style.display = stageUnlocked ? 'block' : 'none';
            }
        });
    }
    
    // Обновляем доступность кнопок улучшений
    document.querySelectorAll('#event-panel .upgrade-item').forEach(btn => {
        const priceElement = btn.querySelector('span');
        if (priceElement) {
            const price = parseInt(priceElement.textContent) || 0;
            
            if (darkShards >= price) {
                btn.disabled = false;
                btn.style.background = eventActive ? '#9b59b6' : 'lightblue';
                btn.style.cursor = 'pointer';
            } else {
                btn.disabled = true;
                btn.style.background = '#7f8c8d';
                btn.style.cursor = 'not-allowed';
            }
        }
    });
    
    // Обновляем кнопку ивента
    const eventBtn = document.getElementById('event-btn');
    if (eventActive) {
        eventBtn.textContent = 'Ивент 🔥';
        eventBtn.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
    } else {
        eventBtn.textContent = 'Ивент';
        eventBtn.style.background = 'linear-gradient(45deg, #95a5a6, #7f8c8d)';
    }
    
    // Обновляем таймер
    if (!eventActive && eventCooldownTime > 0) {
        updateEventCooldownTimer();
    }
}

// Проверка доступности улучшений с учетом инфляции
function checkUpgradesAvailability() {
    const upgradeButtons = document.querySelectorAll('.upgrade-item');
    
    upgradeButtons.forEach(button => {
        const priceElement = button.querySelector('span');
        let basePrice = 0;
        
        if (priceElement) {
            basePrice = parseInt(priceElement.textContent) || 0;
        }
        
        let actualPrice = basePrice;
        const onclick = button.getAttribute('onclick');
        
        if (onclick) {
            if (onclick.includes('buyUpgrade')) {
                const match = onclick.match(/buyUpgrade\((\d+),\s*(\d+)/);
                if (match) {
                    const power = parseInt(match[1]);
                    const basePrice = parseInt(match[2]);
                    const upgradeKey = `upgrade_${power}_${basePrice}`;
                    const multiplier = priceMultipliers.upgrades[upgradeKey] || 1;
                    actualPrice = Math.round(basePrice * multiplier);
                }
            }
            else if (onclick.includes('buyAutoClicker')) {
                const match = onclick.match(/buyAutoClicker\(([\d.]+),\s*(\d+)/);
                if (match) {
                    const power = parseFloat(match[1]);
                    const basePrice = parseInt(match[2]);
                    const autoClickerKey = `autoclicker_${power}_${basePrice}`;
                    const multiplier = priceMultipliers.autoClickers[autoClickerKey] || 1;
                    actualPrice = Math.round(basePrice * multiplier);
                }
            }
            else if (onclick.includes('buySunExchange')) {
                const match = onclick.match(/buySunExchange\((\d+),\s*(\d+)/);
                if (match) {
                    const drops = parseInt(match[1]);
                    const sunCost = parseInt(match[2]);
                    const exchangeKey = `exchange_${drops}_${sunCost}`;
                    const multiplier = priceMultipliers.sunExchanges[exchangeKey] || 1;
                    actualPrice = Math.round(sunCost * multiplier);
                }
            }
            else if (onclick.includes('buyEventUpgrade')) {
                const match = onclick.match(/buyEventUpgrade\('([^']+)',\s*(\d+)/);
                if (match) {
                    const type = match[1];
                    const basePrice = parseInt(match[2]);
                    const eventKey = `event_${type}_${basePrice}`;
                    const multiplier = priceMultipliers.eventUpgrades[eventKey] || 1;
                    actualPrice = Math.round(basePrice * multiplier);
                }
            }
        }
        
        if (priceElement && actualPrice !== basePrice) {
            priceElement.textContent = actualPrice.toLocaleString();
        }
        
        const requiredLevel = parseInt(button.getAttribute('data-level')) || 1;
        
        let canAfford = false;
        if (onclick && onclick.includes('buySunExchange')) {
            canAfford = sunScore >= actualPrice;
        } else if (onclick && onclick.includes('buyEventUpgrade')) {
            canAfford = darkShards >= actualPrice;
        } else if (onclick && (onclick.includes('buyUpgrade') || onclick.includes('buyAutoClicker') || onclick.includes('buyCase'))) {
            canAfford = score >= actualPrice;
        } else if (onclick && onclick.includes('buyItem')) {
            canAfford = sunScore >= actualPrice;
        } else {
            canAfford = true;
        }
        
        if (canAfford && level >= requiredLevel) {
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

// Проверка разблокировки скинов
function checkSkinUnlocks() {
    const allSkins = {...skins, ...clickSkins, ...darkSkins};
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

// Загрузка скинов
function loadSkins() {
    skinsContainer.innerHTML = '';
    const allSkins = {...skins, ...clickSkins, ...darkSkins};
    
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
    const allSkins = {...skins, ...clickSkins, ...darkSkins};
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
    closeEvent();
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

// Инициализация игры
function initGame() {
    loadGame();
    updateDisplay();
    updateLevelDisplay();
    updateEventDisplay();
    loadSkins();
    startChangingText();
    checkSkinUnlocks();
    checkUpgradesAvailability();
    updateEventButtons();
    startBoostChecker();
    
    if (eventActive && eventTimeLeft > 0) {
        // Ивент активен
        eventInterval = setInterval(() => {
            eventTimeLeft -= 1000;
            updateEventTimer();
            
            if (eventTimeLeft <= 0) {
                endEvent();
            }
        }, 1000);
    } else if (!eventActive && eventCooldownTime > 0) {
        // Ивент на кулдауне
        eventCooldownInterval = setInterval(() => {
            eventCooldownTime -= 1000;
            updateEventCooldownTimer();
            
            if (eventCooldownTime <= 0) {
                clearInterval(eventCooldownInterval);
                startEvent();
            }
        }, 1000);
    } else if (!eventActive) {
        // Первый запуск - начинаем кулдаун
        eventCooldownTime = EVENT_SETTINGS.firstEventDelay;
        eventCooldownInterval = setInterval(() => {
            eventCooldownTime -= 1000;
            updateEventCooldownTimer();
            
            if (eventCooldownTime <= 0) {
                clearInterval(eventCooldownInterval);
                startEvent();
            }
        }, 1000);
    }
    
    const allSkins = {...skins, ...clickSkins, ...darkSkins};
    if (currentSkin && allSkins[currentSkin]) {
        buttonEl.style.backgroundImage = `url(${allSkins[currentSkin].url})`;
    }
}
function startTime (){
  Data.Time = 1000;
}

// Запуск игры
initGame();
