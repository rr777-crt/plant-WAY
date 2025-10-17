'use strict';

// Переменные игры
let score = 0;
let addPerClick = 0;
let addPerSecond = 0;
let level = 1;
let exp = 0;
let maxExp = 100;
let totalClicks = 0;
let casePrice = 1250;

// Новая валюта - Солнце
let sunScore = 0;
let sunPerClick = 0.01;

// Система перерождения
let divineSunScore = 0;
let rebirthCount = 0;
let godUpgrades = {
    shopDiscount: { bought: 0, max: 5, basePrice: 1, effect: 0.01 },
    itemDiscount: { bought: 0, max: 5, basePrice: 1, effect: 0.01 },
    dropPerClick: { bought: 0, max: 10, basePrice: 1, effect: 0.005 },
    autoClick: { bought: 0, max: 10, basePrice: 1, effect: 0.01 },
    expBoost: { bought: 0, max: 20, basePrice: 1, effect: 0.10 }
};

// Требования для перерождения
const rebirthRequirements = [
    { drops: 1000000000, suns: 0, skins: [] },
    { drops: 333333333333, suns: 100, skins: [] },
    { drops: 500000000000000, suns: 200, skins: ['pea1'] },
    { drops: 1000000000000000, suns: 400, skins: ['premium_pea1'] },
    { drops: 1000000000000000000, suns: 500, skins: [] }
];

// Система множителей цен
let priceMultipliers = {
    upgrades: {},
    autoClickers: {},
    sunExchanges: {},
    powers: {}
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
        name: 'захотел...', 
        url: 'https://img-webcalypt.ru/img/thumb/lg/images/meme-templates/ZdjVHzFr5DQEF2rSDWlfFssh8Cd1UjvW.jpg.jpg',
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
        requiredClicks: 100000
    },
    'path4': { 
        name: 'ПУТЬ: грохомёт', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/b/bf/Gatling_Pea_Fixed.png/revision/latest/thumbnail/width/360/height/360?cb=20190519095836&path-prefix=ru',
        rarity: 'path',
        requiredClicks: 1000000
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
        name: 'ПУТЬ: ЭЛЕКТРИЧЕСКИЙ грохострел', 
        url: 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-f52r-p-gorokhostrel-png-12.png',
        rarity: 'path',
        requiredClicks: 6200000000000
    },
    'path8': { 
        name: 'ПУТЬ: гороховая хватка', 
        url: 'https://pvsz2.ru/statics/plants-big/127.png',
        rarity: 'path',
        requiredClicks: 333000000000000
    },
   'path9': { 
       name: 'ПУТЬ: spooky', 
        url: 'https://preview.redd.it/injured-peashooter-v0-le1sg6cjj1wd1.gif?width=640&crop=smart&auto=webp&s=9e04d13269ca86d3adf016d51bdb3e43dd9b4945',
        rarity: 'path',
        requiredClicks: 5000
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
        name: 'тёмная материя грохострела', 
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

// ДОПОЛНИТЕЛЬНЫЕ СКИНЫ ДЛЯ ДОРОГОГО КЕЙСА
const premiumSkins = {
    'premium_common1': { 
        name: 'нет грохострела', 
        url: 'https://static.wikia.nocookie.net/pvz-fusion/images/1/1e/PeaNut.png/revision/latest?cb=20250119164836&path-prefix=ru',
        rarity: 'common'
    },
    'premium_rare1': { 
        name: 'грохострел', 
        url: 'https://pvsz2.ru/statics/plants-big/171.png',
        rarity: 'rare'
    },
    'premium_epic2': { 
        name: 'огненый 2.0', 
        url: 'https://i.pinimg.com/236x/6e/4f/da/6e4fda417ab8bc18862e3a643c0fc49c.jpg',
        rarity: 'epic'
    },
    'premium_legendary1': { 
        name: 'не правильно!', 
        url: 'https://static.wikia.nocookie.net/pvz-fusion/images/1/1f/SuperTallNut_0.png/revision/latest/thumbnail/width/360/height/450?cb=20250119184636&path-prefix=ru',
        rarity: 'legendary'
    },
    'premium_pea1': { 
        name: '360 НОУ СКОП', 
        url: 'https://static.wikia.nocookie.net/pvz-fusion/images/4/4d/SniperPea_0.png/revision/latest/scale-to-width/360?cb=20250119140443&path-prefix=ru',
        rarity: 'pea'
    }
};

// Система Сил
let amuletPrice = 1000000;
let unlockedPowers = [];
let equippedPower = null;
let powerEffects = {};
let powerIntervals = {};

const powers = {
    'sunflower': {
        name: 'Подсолнух',
        rarity: 'common',
        effect: 'sunPerClick',
        value: 0.01,
        image: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/3/31/Sunflower_HD.png/revision/latest?cb=20220211160002&path-prefix=ru'
    },
    'squash': {
        name: 'Кабачок',
        rarity: 'common',
        effect: 'dropPerSecond',
        value: 0.072,
        image: 'https://pvsz2.ru/statics/plants-big/93.png'
    },
    'walnut': {
        name: 'Орех',
        rarity: 'common',
        effect: 'dropPerClick',
        value: 0.03,
        image: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/5/50/HD_%D0%9E%D1%80%D0%B5%D1%85_%D0%B8%D0%B7_%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8.png/revision/latest?cb=20220211210323&path-prefix=ru'
    },
    'potato': {
        name: 'Картошка-мина',
        rarity: 'rare',
        effect: 'periodicDrops',
        value: 0.1,
        interval: 115000,
        image: 'https://pvsz2.ru/statics/plants-big/72.png'
    },
    'chomper': {
        name: 'Чомпер',
        rarity: 'rare',
        effect: 'shopDiscount',
        value: 0.09,
        image: 'https://pvsz2.ru/statics/plants-big/18.png'
    },
    'garlic': {
        name: 'Чеснок',
        rarity: 'epic',
        effect: 'combo',
        value: 0.055,
        autoBuyInterval: 300000,
        autoBuyAmount: 3,
        image: 'https://pvsz2.ru/statics/plants-big/16.png'
    },
    'triplesunflower': {
        name: 'Тройной Подсолнух',
        rarity: 'epic',
        effect: 'sunPerClick',
        value: 0.03,
        image: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/d/dc/Dirt_sun.png/revision/latest?cb=20200526085843&path-prefix=ru'
    },
    'cabbage': {
        name: 'Капуста',
        rarity: 'legendary',
        effect: 'itemDiscount',
        value: 0.05,
        image: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/3/3f/Cabbage-pult.png/revision/latest?cb=20201123070549&path-prefix=ru'
    },
    'darkrose': {
        name: 'Мрачная Роза',
        rarity: 'mythic',
        effect: 'comboAdvanced',
        value: 0.07,
        autoBuyInterval: 210000,
        image: 'https://pvsz2.ru/statics/plants-big/39.png'
    },
    'primitivesunflower': {
        name: 'Первобытный Подсолнух',
        rarity: 'pea',
        effect: 'ultimate',
        value: 0.04,
        sunInterval: 240000,
        image: 'https://pvsz2.ru/statics/plants-big/76.png'
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
    "1.0.5 - это круто",
    "привет",
    "это уже долго длится",
    "ЗНАЕШЬ! ТЫ НЕ ГЛУПЫЙ!!!! ТЫ...",
    "чё так мало капель?",
    "культ фотосинтеза",
    "ееее 1.1.0 скоро?",
    "О НОУ! грохострел ТЕПЕРЬ САМОЕ ДОРОГОЕ РАСТЕНИЕ!!!",
  
    "если в саду грохострела не будет то лор игры был бы бесполезен",
      "с вас 1000 капель за то что ты челдовек",
      "EZ",
      "бро пж сделай перерождене :(",
      "витамин грохострел",
      "послушай... ты реально долго сидишь сдесь",
      "я знаю всё о тебе!!!",
      "1 - сейчас 00:00 - 23:58 время",
      "2 - Ты сидишб или стоишь или кликаешь или лежишь или сидишележашотунг",
      "3 - ты играешь",
      "ЭТА ИГРА - САМАЯ ХУДШАЯ ПАРОДИЯ НА АНДЕРТЙЛ!!!!!!",
      "ты плохой?",
      "ты прав... ты ультранищий",
      "тызнаешьроналдо?",
      "кликни на белый кружок",
      "секретка",
      "67",
      "привет",
      "НЕТ ИДЕЙ ДЛЯ ЭТИХ СЛОВ!!",
      "туг тунг тунг сахур та та та сахур, у дин дин дин дун мадиндиндиндун, лирири ларира оркалеро оркала балерина капучина лилири лалира брр брр патапим тралалело тралала брр брр патапим трелалело тралала лилири лалира",
      "СПАСИБО! эта песня 10 из 10! - не так ли?",
     "ААААААААААААААААААААААА",
      "хочешь конфетку?",
     "ДААА ХОЧЕШЬ!!",
     "ААА БУГА БУГА",
     "НЕ СИДИ В ТУАЛЕТЕ!!! В 3 ЧАСА НОЧИ!!!!",
     "СТРАШНО?!",
     "ЩАС ИПУГАЮ!",
     "А4 стал адыкватным",
     "СТРАШНО БЫЛО?!",
     "тода иди в туалет >:("
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
const equippedPowerEl = document.getElementById('equipped-power');
const powersContainer = document.getElementById('powers-container');
const amuletPriceEl = document.getElementById('amulet-price');

// Функция меняющихся текстов
function startChangingText() {
    let currentIndex = 0;
    changingTextEl.textContent = changingTexts[currentIndex];
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % changingTexts.length;
        changingTextEl.textContent = changingTexts[currentIndex];
    }, 10000);
}

// Быстрая смена фразы по клику
function initChangingTextClick() {
    if (changingTextEl) {
        changingTextEl.style.cursor = 'pointer';
        changingTextEl.addEventListener('click', showNextText);
    }
}

let currentTextIndex = 0;
function showNextText() {
    currentTextIndex = (currentTextIndex + 1) % changingTexts.length;
    changingTextEl.textContent = changingTexts[currentTextIndex];
    
    // Анимация
    changingTextEl.style.transform = 'scale(1.1)';
    setTimeout(() => {
        changingTextEl.style.transform = 'scale(1)';
    }, 200);
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
        priceMultipliers: priceMultipliers,
        // Силы
        amuletPrice: amuletPrice,
        unlockedPowers: unlockedPowers,
        equippedPower: equippedPower,
        powerEffects: powerEffects,
        // Перерождение
        divineSunScore: divineSunScore,
        rebirthCount: rebirthCount,
        godUpgrades: godUpgrades
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
            
            // Сохраняем темные скины из старой системы
            const allDarkSkins = Object.keys(darkSkins);
            allDarkSkins.forEach(skinId => {
                if (gameData.unlockedSkins && gameData.unlockedSkins.includes(skinId) && !unlockedSkins.includes(skinId)) {
                    unlockedSkins.push(skinId);
                }
            });
            
            priceMultipliers = gameData.priceMultipliers || {
                upgrades: {},
                autoClickers: {},
                sunExchanges: {},
                powers: {}
            };
            
            // Силы
            amuletPrice = gameData.amuletPrice || 1000000;
            unlockedPowers = gameData.unlockedPowers || [];
            equippedPower = gameData.equippedPower || null;
            powerEffects = gameData.powerEffects || {};
            
            // Новые данные перерождения
            divineSunScore = gameData.divineSunScore || 0;
            rebirthCount = gameData.rebirthCount || 0;
            godUpgrades = gameData.godUpgrades || {
                shopDiscount: { bought: 0, max: 5, basePrice: 1, effect: 0.01 },
                itemDiscount: { bought: 0, max: 5, basePrice: 1, effect: 0.01 },
                dropPerClick: { bought: 0, max: 10, basePrice: 1, effect: 0.005 },
                autoClick: { bought: 0, max: 10, basePrice: 1, effect: 0.01 },
                expBoost: { bought: 0, max: 20, basePrice: 1, effect: 0.10 }
            };
            
            return true;
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            return false;
        }
    }
    return false;
}

// Оптимизированный обработчик клика
function setupButton() {
    let isPressed = false;
    let clickCount = 0;
    let lastClickTime = 0;
    
    function handleClick() {
        const now = Date.now();
        if (now - lastClickTime < 50) return; // Защита от спама
        
        lastClickTime = now;
        clickCount++;
        
        let dropMultiplier = activeBoosts.drop.active ? activeBoosts.drop.multiplier : 1;
        let expMultiplier = activeBoosts.exp.active ? activeBoosts.exp.multiplier : 1;
        let sunMultiplier = activeBoosts.sun.active ? activeBoosts.sun.multiplier : 1;
        
        // Бонус от улучшений Бога
        if (godUpgrades.dropPerClick.bought > 0) {
            dropMultiplier += godUpgrades.dropPerClick.effect * godUpgrades.dropPerClick.bought;
        }
        
        if (godUpgrades.expBoost.bought > 0) {
            expMultiplier += godUpgrades.expBoost.effect * godUpgrades.expBoost.bought;
        }
        
        // Базовые значения
        let dropBonus = addPerClick * dropMultiplier;
        let expBonus = 1 * expMultiplier;
        let sunBonus = sunPerClick * sunMultiplier;
        
        // Эффекты от Сил
        if (powerEffects.dropPerClick) {
            dropBonus += addPerClick * powerEffects.dropPerClick;
        }
        
        if (powerEffects.sunPerClick) {
            sunBonus += powerEffects.sunPerClick;
        }
        
        if (powerEffects.combo) {
            dropBonus += addPerClick * powerEffects.combo;
        }
        
        if (powerEffects.comboAdvanced) {
            dropBonus += addPerClick * powerEffects.comboAdvanced;
        }
        
        if (powerEffects.ultimate) {
            sunBonus += powerEffects.ultimate;
        }
        
        score += dropBonus;
        exp += expBonus;
        sunScore += sunBonus;
        totalClicks += 1;
        
        updateDisplay();
        checkLevelUp();
        checkSkinUnlocks();
        
        // Сохраняем каждые 10 кликов для производительности
        if (clickCount % 10 === 0) {
            saveGame();
        }
    }
    
    // Touch события
    buttonEl.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isPressed = true;
        this.style.transform = 'translateY(-7px) scale(0.95)';
        handleClick();
    }, { passive: false });
    
    buttonEl.addEventListener('touchend', function() {
        isPressed = false;
        this.style.transform = 'translateY(0) scale(1)';
    }, { passive: false });
    
    buttonEl.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Mouse события
    buttonEl.addEventListener('mousedown', function() {
        isPressed = true;
        this.style.transform = 'translateY(-7px) scale(0.95)';
        handleClick();
    });
    
    buttonEl.addEventListener('mouseup', function() {
        isPressed = false;
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    buttonEl.addEventListener('mouseleave', function() {
        if (isPressed) {
            isPressed = false;
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
    
    // Автокликер с оптимизацией
    let lastUpdate = 0;
    function gameLoop(timestamp) {
        if (timestamp - lastUpdate > 1000) {
            if (addPerSecond > 0) {
                let dropBonus = addPerSecond;
                
                // Бонус от улучшений Бога
                if (godUpgrades.autoClick.bought > 0) {
                    dropBonus += addPerSecond * godUpgrades.autoClick.effect * godUpgrades.autoClick.bought;
                }
                
                if (powerEffects.dropPerSecond) {
                    dropBonus += addPerSecond * powerEffects.dropPerSecond;
                }
                
                score += dropBonus;
                updateDisplay();
                
                // Сохраняем каждую минуту авто-кликов
                if (Date.now() % 60000 < 1000) {
                    saveGame();
                }
            }
            lastUpdate = timestamp;
        }
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}

// Покупка улучшения клика
function buyUpgrade(power, basePrice, requiredLevel = 1) {
    const upgradeKey = `upgrade_${power}_${basePrice}`;
    const currentMultiplier = priceMultipliers.upgrades[upgradeKey] || 1;
    let actualPrice = Math.round(basePrice * currentMultiplier);
    
    // Применяем скидку от силы и улучшений Бога
    if (powerEffects.shopDiscount) {
        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
    }
    if (godUpgrades.shopDiscount.bought > 0) {
        const godDiscount = godUpgrades.shopDiscount.effect * godUpgrades.shopDiscount.bought;
        actualPrice = Math.round(actualPrice * (1 - godDiscount));
    }
    
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
    
    // Увеличиваем цену на 10% и СОХРАНЯЕМ
    priceMultipliers.upgrades[upgradeKey] = currentMultiplier * 1.1;
    
    updateDisplay();
    checkUpgradesAvailability(); // ОБНОВЛЯЕМ ЦЕНЫ СРАЗУ ПОСЛЕ ПОКУПКИ
    saveGame();
    showNotification(`Улучшение куплено! +${power} на клик`);
}

// Аналогично в buyAutoClicker:
function buyAutoClicker(power, basePrice, requiredLevel = 1) {
    const autoClickerKey = `autoclicker_${power}_${basePrice}`;
    const currentMultiplier = priceMultipliers.autoClickers[autoClickerKey] || 1;
    let actualPrice = Math.round(basePrice * currentMultiplier);
    
    // Применяем скидку от силы и улучшений Бога
    if (powerEffects.shopDiscount) {
        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
    }
    if (godUpgrades.shopDiscount.bought > 0) {
        const godDiscount = godUpgrades.shopDiscount.effect * godUpgrades.shopDiscount.bought;
        actualPrice = Math.round(actualPrice * (1 - godDiscount));
    }
    
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
    
    // Увеличиваем цену на 10% и СОХРАНЯЕМ
    priceMultipliers.autoClickers[autoClickerKey] = currentMultiplier * 1.1;
    
    updateDisplay();
    checkUpgradesAvailability(); // ОБНОВЛЯЕМ ЦЕНЫ СРАЗУ ПОСЛЕ ПОКУПКИ
    saveGame();
    showNotification(`Авто-кликер куплен! +${power}/сек`);
}

// И в buySunExchange:
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
    
    // Увеличиваем цену на 10% и СОХРАНЯЕМ
    priceMultipliers.sunExchanges[exchangeKey] = currentMultiplier * 1.1;
    
    updateDisplay();
    checkUpgradesAvailability(); // ОБНОВЛЯЕМ ЦЕНЫ СРАЗУ ПОСЛЕ ПОКУПКИ
    saveGame();
    showNotification(`Получено ${drops} капель!`);
}

// Также добавь вызов checkUpgradesAvailability() при применении скидок:




// Покупка предмета
function buyItem(itemType) {
    const button = event.target.closest('.upgrade-item');
    let price = parseInt(button.querySelector('.price-display').textContent);
    const requiredLevel = parseInt(button.getAttribute('data-level'));
    
    // Применяем скидку от силы и улучшений Бога
    if (powerEffects.itemDiscount) {
        price = Math.round(price * (1 - powerEffects.itemDiscount));
    }
    if (godUpgrades.itemDiscount.bought > 0) {
        const godDiscount = godUpgrades.itemDiscount.effect * godUpgrades.itemDiscount.bought;
        price = Math.round(price * (1 - godDiscount));
    }
    
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
            activeBoosts.sun = { active: true, multiplier: 5, endTime: Date.now() + (5 * 60 * 1000) };
        activeBoosts.drop = { active: true, multiplier: 5, endTime: Date.now() + (5 * 60 * 1000) };
            showNotification("×5 на 5 минут!");
            break;
          case 'spooky':
            activeBoosts.drop = { active: true, multiplier: 2, endTime: Date.now() + boostDuration };
            showNotification("×2 на 2 мин капель!!");
       
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Покупка обычного кейса
function buyCase() {
    const basePrice = 1250;
    let actualPrice = basePrice;
    
    // Применяем скидку от силы и улучшений Бога
    if (powerEffects.shopDiscount) {
        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
    }
    if (godUpgrades.shopDiscount.bought > 0) {
        const godDiscount = godUpgrades.shopDiscount.effect * godUpgrades.shopDiscount.bought;
        actualPrice = Math.round(actualPrice * (1 - godDiscount));
    }
    
    if (score < actualPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    score -= actualPrice;
    
    const random = Math.random();
    let rarity = '';
    
    if (random < 0.00055) rarity = 'pea';
    else if (random < 0.00455) rarity = 'mythic';
    else if (random < 0.01455) rarity = 'legendary';
    else if (random < 0.10055) rarity = 'epic';
    else if (random < 0.40055) rarity = 'rare';
    else rarity = 'common';
    
    const allSkins = {...skins, ...darkSkins};
    const availableSkins = Object.keys(allSkins).filter(skinId => 
        allSkins[skinId].rarity === rarity && 
        skinId !== 'default' && 
        !unlockedSkins.includes(skinId)
    );
    
    if (availableSkins.length > 0) {
        const wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        unlockedSkins.push(wonSkin);
        
        if (rarity === 'pea') {
            showNotification(`🎉🎉🎉 НЕВЕРОЯТНО! ${allSkins[wonSkin].name} (ГОРОХНЫЙ)!!! 🎉🎉🎉`);
        } else {
            showNotification(`🎉 ${allSkins[wonSkin].name} (${rarity})!`);
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

// Покупка премиум кейса
function buyPowerCase() {
    const basePrice = 500000000;
    let actualPrice = basePrice;
    
    // Применяем скидку от силы и улучшений Бога
    if (powerEffects.shopDiscount) {
        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
    }
    if (godUpgrades.shopDiscount.bought > 0) {
        const godDiscount = godUpgrades.shopDiscount.effect * godUpgrades.shopDiscount.bought;
        actualPrice = Math.round(actualPrice * (1 - godDiscount));
    }
    
    if (score < actualPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    score -= actualPrice;
    
    const random = Math.random();
    let rarity = '';
    
    // Шансы для премиум кейса
    if (random < 0.00003) rarity = 'pea';
    else if (random < 0.01003) rarity = 'mythic';
    else if (random < 0.02503) rarity = 'legendary';
    else if (random < 0.10003) rarity = 'epic';
    else if (random < 0.30003) rarity = 'rare';
    else rarity = 'common';
    
    // Ищем доступные скины из премиум коллекции
    const allPremiumSkins = {...premiumSkins};
    const availableSkins = Object.keys(allPremiumSkins).filter(skinId => 
        allPremiumSkins[skinId].rarity === rarity && 
        !unlockedSkins.includes(skinId)
    );
    
    if (availableSkins.length > 0) {
        const wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        unlockedSkins.push(wonSkin);
        
        if (rarity === 'pea') {
            showNotification(`🎉🎉🎉 НЕВЕРОЯТНО! ${allPremiumSkins[wonSkin].name} (ГОРОХНЫЙ)!!! 🎉🎉🎉`);
        } else {
            showNotification(`🎉 Премиум скин: ${allPremiumSkins[wonSkin].name} (${rarity})!`);
        }
        
        loadSkins();
    } else {
        const compensation = Math.round(basePrice * 0.3);
        score += compensation;
        showNotification(`Все премиум скины ${rarity} есть! +${compensation} капель`);
    }
    
    updateDisplay();
    saveGame();
}

// Покупка амулета для СИЛ
function buyAmulet() {
    if (score < amuletPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    score -= amuletPrice;
    
    const random = Math.random();
    let rarity = '';
    
    if (random < 0.00005) rarity = 'pea';
    else if (random < 0.00255) rarity = 'mythic';
    else if (random < 0.00755) rarity = 'legendary';
    else if (random < 0.03255) rarity = 'epic';
    else if (random < 0.21255) rarity = 'rare';
    else rarity = 'common';
    
    const availablePowers = Object.keys(powers).filter(powerId => 
        powers[powerId].rarity === rarity && 
        !unlockedPowers.includes(powerId)
    );
    
    if (availablePowers.length > 0) {
        const wonPower = availablePowers[Math.floor(Math.random() * availablePowers.length)];
        unlockedPowers.push(wonPower);
        
        if (rarity === 'pea') {
            showNotification(`🎉🎉🎉 НЕВЕРОЯТНО! ${powers[wonPower].name} (ГОРОХНЫЙ)!!! 🎉🎉🎉`);
        } else {
            showNotification(`🎉 Получена сила: ${powers[wonPower].name} (${rarity})!`);
        }
        
        loadPowers();
    } else {
        const compensation = Math.round(amuletPrice * 0.5);
        score += compensation;
        showNotification(`Все силы ${rarity} есть! +${compensation} капель`);
    }
    
    // Увеличиваем цену на 25% (максимум 1 триллион)
    amuletPrice = Math.min(Math.round(amuletPrice * 1.25), 1000000000000);
    updateAmuletPrice();
    
    updateDisplay();
    saveGame();
}

// Обновление цены амулета
function updateAmuletPrice() {
    if (amuletPriceEl) {
        amuletPriceEl.textContent = amuletPrice.toLocaleString();
    }
}

// Загрузка Сил
function loadPowers() {
    if (!powersContainer) return;
    
    powersContainer.innerHTML = '';
    
    unlockedPowers.forEach(powerId => {
        if (powers[powerId]) {
            const power = powers[powerId];
            const powerItem = document.createElement('button');
            powerItem.className = `power-item ${equippedPower === powerId ? 'active' : ''}`;
            powerItem.onclick = () => togglePower(powerId);
            
            powerItem.innerHTML = `
                <img src="${power.image}" alt="${power.name}" onerror="this.style.display='none'">
                <div>${power.name}</div>
                <small>${power.rarity}</small>
            `;
            
            powersContainer.appendChild(powerItem);
        }
    });
}

// Переключение Силы
function togglePower(powerId) {
    if (equippedPower === powerId) {
        unequipPower();
    } else {
        if (equippedPower) {
            unequipPower();
        }
        equipPower(powerId);
    }
    
    loadPowers();
    saveGame();
}

// Экипировка Силы
function equipPower(powerId) {
    equippedPower = powerId;
    const power = powers[powerId];
    
    // Обновляем отображение экипированной силы
    if (equippedPowerEl) {
        equippedPowerEl.style.backgroundImage = `url(${power.image})`;
    }
    
    // Применяем эффекты силы
    applyPowerEffect(powerId);
    
    showNotification(`Сила "${power.name}" экипирована!`);
}

// Снятие Силы
function unequipPower() {
    if (equippedPower) {
        const power = powers[equippedPower];
        
        // Убираем эффекты силы
        removePowerEffect(equippedPower);
        
        // Обновляем отображение
        if (equippedPowerEl) {
            equippedPowerEl.style.backgroundImage = 'none';
        }
        
        showNotification(`Сила "${power.name}" снята!`);
        equippedPower = null;
    }
}

// Применение эффектов Силы
function applyPowerEffect(powerId) {
    const power = powers[powerId];
    
    switch(power.effect) {
        case 'sunPerClick':
            powerEffects.sunPerClick = power.value;
            break;
        case 'dropPerSecond':
            powerEffects.dropPerSecond = power.value;
            break;
        case 'dropPerClick':
            powerEffects.dropPerClick = power.value;
            break;
        case 'periodicDrops':
            startPeriodicDrops(power);
            break;
        case 'shopDiscount':
            powerEffects.shopDiscount = power.value;
            break;
        case 'itemDiscount':
            powerEffects.itemDiscount = power.value;
            break;
        case 'combo':
            powerEffects.combo = power.value;
            startAutoBuy(power);
            break;
        case 'comboAdvanced':
            powerEffects.comboAdvanced = power.value;
            startAdvancedAutoBuy(power);
            break;
        case 'ultimate':
            powerEffects.ultimate = power.value;
            startUltimateEffects(power);
            break;
    }
    
    updatePowerEffects();
}

// Удаление эффектов Силы
function removePowerEffect(powerId) {
    const power = powers[powerId];
    
    switch(power.effect) {
        case 'sunPerClick':
            delete powerEffects.sunPerClick;
            break;
        case 'dropPerSecond':
            delete powerEffects.dropPerSecond;
            break;
        case 'dropPerClick':
            delete powerEffects.dropPerClick;
            break;
        case 'periodicDrops':
            if (powerIntervals.periodicDrops) {
                clearInterval(powerIntervals.periodicDrops);
                delete powerIntervals.periodicDrops;
            }
            break;
        case 'shopDiscount':
            delete powerEffects.shopDiscount;
            break;
        case 'itemDiscount':
            delete powerEffects.itemDiscount;
            break;
        case 'combo':
            delete powerEffects.combo;
            if (powerIntervals.autoBuy) {
                clearInterval(powerIntervals.autoBuy);
                delete powerIntervals.autoBuy;
            }
            break;
        case 'comboAdvanced':
            delete powerEffects.comboAdvanced;
            if (powerIntervals.advancedAutoBuy) {
                clearInterval(powerIntervals.advancedAutoBuy);
                delete powerIntervals.advancedAutoBuy;
            }
            break;
        case 'ultimate':
            delete powerEffects.ultimate;
            if (powerIntervals.ultimate) {
                clearInterval(powerIntervals.ultimate);
                delete powerIntervals.ultimate;
            }
            break;
    }
    
    updatePowerEffects();
}

// Периодические бонусы от Сил
function startPeriodicDrops(power) {
    powerIntervals.periodicDrops = setInterval(() => {
        const bonus = Math.round(score * power.value);
        score += bonus;
        showNotification(`Картошка-мина дала +${bonus} капель!`);
        updateDisplay();
        saveGame();
    }, power.interval);
}

function startAutoBuy(power) {
    powerIntervals.autoBuy = setInterval(() => {
        addPerClick += power.autoBuyAmount;
        showNotification(`Чеснок автоматически купил +${power.autoBuyAmount} на клик!`);
        updateDisplay();
        saveGame();
    }, power.autoBuyInterval);
}

function startAdvancedAutoBuy(power) {
    powerIntervals.advancedAutoBuy = setInterval(() => {
        const amount = score < 1000000000000 ? 500000 : 1000000;
        addPerClick += amount;
        showNotification(`Мрачная роза купила +${amount} на клик!`);
        updateDisplay();
        saveGame();
    }, power.autoBuyInterval);
}

function startUltimateEffects(power) {
    powerIntervals.ultimate = setInterval(() => {
        const sunBonus = sunScore < 100 ? 10 : 50;
        sunScore += sunBonus;
        showNotification(`Первобытный подсолнух дал +${sunBonus} солнц!`);
        updateDisplay();
        saveGame();
    }, power.sunInterval);
}

// Обновление эффектов Сил
function updatePowerEffects() {
    updateDisplay();
    checkUpgradesAvailability();
}

// Проверка доступности улучшений
function checkUpgradesAvailability() {
    const upgradeButtons = document.querySelectorAll('.upgrade-item');
    
    upgradeButtons.forEach(button => {
        const priceElement = button.querySelector('.price-display') || button.querySelector('span');
        let basePrice = 0;
        
        if (priceElement) {
            // Получаем базовую цену из data-атрибута или из текста
            basePrice = parseInt(button.getAttribute('data-base-price')) || 
                       parseInt(priceElement.textContent.replace(/,/g, '')) || 0;
            
            // Сохраняем базовую цену в data-атрибут для будущего использования
            if (!button.getAttribute('data-base-price')) {
                button.setAttribute('data-base-price', basePrice);
            }
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
                    
                    // Применяем скидку
                    if (powerEffects.shopDiscount) {
                        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
                    }
                    if (godUpgrades.shopDiscount.bought > 0) {
                        const godDiscount = godUpgrades.shopDiscount.effect * godUpgrades.shopDiscount.bought;
                        actualPrice = Math.round(actualPrice * (1 - godDiscount));
                    }
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
                    
                    // Применяем скидку
                    if (powerEffects.shopDiscount) {
                        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
                    }
                    if (godUpgrades.shopDiscount.bought > 0) {
                        const godDiscount = godUpgrades.shopDiscount.effect * godUpgrades.shopDiscount.bought;
                        actualPrice = Math.round(actualPrice * (1 - godDiscount));
                    }
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
            else if (onclick.includes('buyItem')) {
                const priceElement = button.querySelector('.price-display');
                if (priceElement) {
                    let price = parseInt(button.getAttribute('data-base-price')) || 
                               parseInt(priceElement.textContent.replace(/,/g, '')) || 0;
                    
                    // Сохраняем базовую цену
                    if (!button.getAttribute('data-base-price')) {
                        button.setAttribute('data-base-price', price);
                    }
                    
                    // Применяем скидку
                    if (powerEffects.itemDiscount) {
                        price = Math.round(price * (1 - powerEffects.itemDiscount));
                    }
                    if (godUpgrades.itemDiscount.bought > 0) {
                        const godDiscount = godUpgrades.itemDiscount.effect * godUpgrades.itemDiscount.bought;
                        price = Math.round(price * (1 - godDiscount));
                    }
                    actualPrice = price;
                }
            }
            else if (onclick.includes('buyCase') || onclick.includes('buyPowerCase')) {
                const priceElement = button.querySelector('.price-display');
                if (priceElement) {
                    let price = parseInt(button.getAttribute('data-base-price')) || 
                               parseInt(priceElement.textContent.replace(/,/g, '')) || 0;
                    
                    // Сохраняем базовую цену
                    if (!button.getAttribute('data-base-price')) {
                        button.setAttribute('data-base-price', price);
                    }
                    
                    // Применяем скидку
                    if (powerEffects.shopDiscount) {
                        price = Math.round(price * (1 - powerEffects.shopDiscount));
                    }
                    if (godUpgrades.shopDiscount.bought > 0) {
                        const godDiscount = godUpgrades.shopDiscount.effect * godUpgrades.shopDiscount.bought;
                        price = Math.round(price * (1 - godDiscount));
                    }
                    actualPrice = price;
                }
            }
        }
        
        // Обновляем отображение цены - ВСЕГДА показываем актуальную цену
        if (priceElement) {
            priceElement.textContent = actualPrice.toLocaleString();
        }
        
        const requiredLevel = parseInt(button.getAttribute('data-level')) || 1;
        
        let canAfford = false;
        if (onclick && onclick.includes('buySunExchange')) {
            canAfford = sunScore >= actualPrice;
        } else if (onclick && (onclick.includes('buyUpgrade') || onclick.includes('buyAutoClicker') || onclick.includes('buyCase') || onclick.includes('buyPowerCase'))) {
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
            button.style.opacity = '1';
        } else {
            button.disabled = true;
            button.style.background = '#7f8c8d';
            button.style.cursor = 'not-allowed';
            button.style.opacity = '0.6';
        }
    });
}

// Проверка разблокировки скинов
function checkSkinUnlocks() {
    const allSkins = {...skins, ...clickSkins, ...darkSkins, ...premiumSkins};
    let unlockedNew = false;
    
    // Проверяем скины за клики (ПУТЬ)
    for (const skinId in clickSkins) {
        if (!unlockedSkins.includes(skinId)) {
            const skin = clickSkins[skinId];
            if (totalClicks >= skin.requiredClicks) {
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
    if (!skinsContainer) return;
    
    skinsContainer.innerHTML = '';
    const allSkins = {...skins, ...clickSkins, ...darkSkins, ...premiumSkins};
    
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
    const allSkins = {...skins, ...clickSkins, ...darkSkins, ...premiumSkins};
    if (allSkins[skinId]) {
        currentSkin = skinId;
        buttonEl.style.backgroundImage = `url(${allSkins[skinId].url})`;
        loadSkins();
        saveGame();
    }
}

// Показать уведомление
function showNotification(message) {
    if (!notification) return;
    
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
    if (scoreEl) scoreEl.textContent = Math.floor(score).toLocaleString();
    if (addEl) addEl.textContent = addPerClick.toLocaleString();
    if (sunScoreEl) sunScoreEl.textContent = sunScore.toFixed(2);
}

// Обновление уровня
function updateLevelDisplay() {
    if (levelEl) levelEl.textContent = level;
    if (expEl) expEl.textContent = Math.floor(exp);
    if (maxExpEl) maxExpEl.textContent = maxExp;
    const progressPercent = (exp / maxExp) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
}

// Система перерождения
function getCurrentRebirthRequirements() {
    if (rebirthCount < rebirthRequirements.length) {
        return rebirthRequirements[rebirthCount];
    } else {
        // После 5-го перерождения требования увеличиваются
        const lastReq = rebirthRequirements[rebirthRequirements.length - 1];
        const multiplier = Math.pow(5, rebirthCount - rebirthRequirements.length + 1);
        const sunMultiplier = Math.pow(1.5, rebirthCount - rebirthRequirements.length + 1);
        
        return {
            drops: lastReq.drops * multiplier,
            suns: Math.round(lastReq.suns * sunMultiplier),
            skins: []
        };
    }
}

// Проверка выполнения требований перерождения
function checkRebirthRequirements() {
    const requirements = getCurrentRebirthRequirements();
    const metRequirements = [];
    
    // Проверка капель
    metRequirements.push({
        type: 'drops',
        met: score >= requirements.drops,
        text: `Капли: ${formatNumber(requirements.drops)}`,
        current: formatNumber(score)
    });
    
    // Проверка солнц
    metRequirements.push({
        type: 'suns',
        met: sunScore >= requirements.suns,
        text: `Солнца: ${formatNumber(requirements.suns)}`,
        current: formatNumber(sunScore)
    });
    
    // Проверка скинов
    if (requirements.skins.length > 0) {
        const missingSkins = requirements.skins.filter(skin => !unlockedSkins.includes(skin));
        metRequirements.push({
            type: 'skins',
            met: missingSkins.length === 0,
            text: `Скины: ${missingSkins.length} осталось`,
            current: `${requirements.skins.length - missingSkins.length}/${requirements.skins.length}`
        });
    }
    
    return metRequirements;
}

// Форматирование больших чисел
function formatNumber(num) {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Qd';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

// Перерождение
function performRebirth() {
    const requirements = checkRebirthRequirements();
    const allMet = requirements.every(req => req.met);
    
    if (!allMet) {
        showNotification("Не выполнены все требования для перерождения!");
        return;
    }
    
    // Анимация перерождения
    const overlay = document.getElementById('rebirth-overlay');
    if (overlay) {
        overlay.classList.add('active');
        overlay.textContent = 'ПЕРЕРОЖДЕНИЕ...';
    }
    
    setTimeout(() => {
        // Сброс прогресса
        resetProgressForRebirth();
        
        // Награда за перерождение
        divineSunScore += 1;
        rebirthCount++;
        
        // Обновление интерфейса
        updateDivineSunDisplay();
        updateRebirthDisplay();
        
        // Убираем анимацию
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        showNotification(`Успешное перерождение! Получено 1 Божественное Солнце!`);
        closeRebirth();
        saveGame();
    }, 3000);
}

// Сброс прогресса при перерождении
function resetProgressForRebirth() {
    // Сохраняем только нужные данные
    const savedPowers = {
        unlockedPowers: [...unlockedPowers],
        equippedPower: equippedPower,
        powerEffects: {...powerEffects}
    };
    
    const savedDivineData = {
        divineSunScore: divineSunScore,
        rebirthCount: rebirthCount,
        godUpgrades: {...godUpgrades}
    };
    
    // Полный сброс
    score = 0;
    addPerClick = 1;
    addPerSecond = 0;
    level = 1;
    exp = 0;
    maxExp = 100;
    totalClicks = 0;
    sunScore = 0;
    
    // Сбрасываем инфляцию цен
    priceMultipliers = {
        upgrades: {},
        autoClickers: {},
        sunExchanges: {},
        powers: {}
    };
    
    // Сбрасываем бусты
    activeBoosts = {
        exp: { active: false, multiplier: 1, endTime: 0 },
        sun: { active: false, multiplier: 1, endTime: 0 },
        drop: { active: false, multiplier: 1, endTime: 0 }
    };
    
    // Сбрасываем скины (кроме темных)
    const darkSkinIds = Object.keys(darkSkins);
    unlockedSkins = ['default', ...unlockedSkins.filter(skin => darkSkinIds.includes(skin))];
    currentSkin = 'default';
    
    // Восстанавливаем силы
    unlockedPowers = savedPowers.unlockedPowers;
    equippedPower = savedPowers.equippedPower;
    powerEffects = savedPowers.powerEffects;
    
    // Восстанавливаем божественные данные
    divineSunScore = savedDivineData.divineSunScore;
    rebirthCount = savedDivineData.rebirthCount;
    godUpgrades = savedDivineData.godUpgrades;
    
    // Обновляем интерфейс
    updateDisplay();
    updateLevelDisplay();
    loadSkins();
    loadPowers();
    applyGodUpgrades();
}

// Покупка улучшений Бога
function buyGodUpgrade(upgradeType) {
    const upgrade = godUpgrades[upgradeType];
    const price = upgrade.basePrice + upgrade.bought;
    
    if (divineSunScore < price) {
        showNotification("Недостаточно Божественных Солнц!");
        return;
    }
    
    if (upgrade.bought >= upgrade.max) {
        showNotification("Достигнут максимум улучшений этого типа!");
        return;
    }
    
    divineSunScore -= price;
    upgrade.bought++;
    
    // Применяем эффект улучшения
    applyGodUpgrades();
    
    updateDivineSunDisplay();
    loadGodUpgrades();
    saveGame();
    
    showNotification(`Улучшение "${getGodUpgradeName(upgradeType)}" куплено!`);
}

// Применение улучшений Бога
function applyGodUpgrades() {
    updateDisplay();
    checkUpgradesAvailability(); // ОБНОВЛЯЕМ ЦЕНЫ ПРИ ИЗМЕНЕНИИ СКИДОК
}

// Получение имени улучшения
function getGodUpgradeName(type) {
    const names = {
        shopDiscount: "Скидка в магазине",
        itemDiscount: "Скидка на предметы",
        dropPerClick: "Бонус за клик",
        autoClick: "Усиление авто-клика",
        expBoost: "Ускорение опыта"
    };
    return names[type] || type;
}

// Загрузка улучшений Бога
function loadGodUpgrades() {
    const container = document.getElementById('god-upgrades-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const [type, upgrade] of Object.entries(godUpgrades)) {
        const price = upgrade.basePrice + upgrade.bought;
        const upgradeItem = document.createElement('button');
        upgradeItem.className = 'god-upgrade-item';
        upgradeItem.onclick = () => buyGodUpgrade(type);
        upgradeItem.disabled = divineSunScore < price || upgrade.bought >= upgrade.max;
        
        upgradeItem.innerHTML = `
            <div class="god-upgrade-name">${getGodUpgradeName(type)}</div>
            <div class="god-upgrade-description">${getGodUpgradeDescription(type, upgrade)}</div>
            <div class="god-upgrade-stats">
                <span>${upgrade.bought}/${upgrade.max}</span>
                <span>Цена: ${price} БС</span>
            </div>
        `;
        
        container.appendChild(upgradeItem);
    }
}

// Описание улучшений Бога
function getGodUpgradeDescription(type, upgrade) {
    const descriptions = {
        shopDiscount: `-${(upgrade.effect * 100).toFixed(1)}% к ценам улучшений`,
        itemDiscount: `-${(upgrade.effect * 100).toFixed(1)}% к ценам предметов`,
        dropPerClick: `+${(upgrade.effect * 100).toFixed(1)}% капель за клик`,
        autoClick: `+${(upgrade.effect * 100).toFixed(1)}% эффективности авто-клика`,
        expBoost: `+${(upgrade.effect * 100).toFixed(1)}% получаемого опыта`
    };
    return descriptions[type] || '';
}

// Обновление отображения божественных солнц
function updateDivineSunDisplay() {
    const divineSunEl = document.getElementById('divine-sun-score');
    const rebirthCountEl = document.getElementById('current-rebirth-count');
    
    if (divineSunEl) divineSunEl.textContent = divineSunScore;
    if (rebirthCountEl) rebirthCountEl.textContent = rebirthCount;
}

// Обновление требований перерождения
function updateRebirthDisplay() {
    const requirementsList = document.getElementById('rebirth-requirements-list');
    if (!requirementsList) return;
    
    requirementsList.innerHTML = '';
    const requirements = checkRebirthRequirements();
    
    requirements.forEach(req => {
        const reqElement = document.createElement('div');
        reqElement.className = `rebirth-requirement ${req.met ? 'met' : 'not-met'}`;
        reqElement.innerHTML = `
            <span>${req.text}</span>
            <span>${req.current}</span>
        `;
        requirementsList.appendChild(reqElement);
    });
    
    // Обновляем кнопку перерождения
    const rebirthBtn = document.getElementById('rebirth-btn');
    const allMet = requirements.every(req => req.met);
    if (rebirthBtn) {
        rebirthBtn.disabled = !allMet;
    }
}

// Управление панелью перерождения
function toggleRebirth() {
    const rebirthPanel = document.getElementById('rebirth-panel');
    const overlay = document.getElementById('overlay');
    
    if (rebirthPanel && overlay) {
        rebirthPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        mainContent.classList.toggle('rebirth-open');
        
        if (rebirthPanel.classList.contains('active')) {
            updateRebirthDisplay();
            loadGodUpgrades();
        }
    }
}

function closeRebirth() {
    const rebirthPanel = document.getElementById('rebirth-panel');
    const overlay = document.getElementById('overlay');
    
    if (rebirthPanel && overlay) {
        rebirthPanel.classList.remove('active');
        overlay.classList.remove('active');
        mainContent.classList.remove('rebirth-open');
    }
}

// Управление панелями
function toggleShop() {
    const shopPanel = document.getElementById('shop-panel');
    const overlay = document.getElementById('overlay');
    if (shopPanel && overlay) {
        shopPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        mainContent.classList.toggle('shop-open');
        checkUpgradesAvailability();
    }
}

function closeShop() {
    const shopPanel = document.getElementById('shop-panel');
    const overlay = document.getElementById('overlay');
    if (shopPanel && overlay) {
        shopPanel.classList.remove('active');
        overlay.classList.remove('active');
        mainContent.classList.remove('shop-open');
    }
}

function toggleInventory() {
    const inventoryPanel = document.getElementById('inventory-panel');
    const overlay = document.getElementById('overlay');
    if (inventoryPanel && overlay) {
        inventoryPanel.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function closeInventory() {
    const inventoryPanel = document.getElementById('inventory-panel');
    const overlay = document.getElementById('overlay');
    if (inventoryPanel && overlay) {
        inventoryPanel.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function togglePowers() {
    const powersPanel = document.getElementById('powers-panel');
    const overlay = document.getElementById('overlay');
    if (powersPanel && overlay) {
        powersPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        mainContent.classList.toggle('powers-open');
    }
}

function closePowers() {
    const powersPanel = document.getElementById('powers-panel');
    const overlay = document.getElementById('overlay');
    if (powersPanel && overlay) {
        powersPanel.classList.remove('active');
        overlay.classList.remove('active');
        mainContent.classList.remove('powers-open');
    }
}

function closeAllPanels() {
    closeShop();
    closeInventory();
    closePowers();
    closeRebirth();
}

function openShopTab(tabName) {
    document.querySelectorAll('.shop-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    event.target.classList.add('active');
    checkUpgradesAvailability();
}

function openPowersTab(tabName) {
    document.querySelectorAll('.powers-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.powers-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    event.target.classList.add('active');
    
    if (tabName === 'amulet') {
        updateAmuletPrice();
    }
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

// Автосохранение
setInterval(() => {
    saveGame();
}, 30000);

// Инициализация игры
function initGame() {
    loadGame();
    updateDisplay();
    updateLevelDisplay();
    updateAmuletPrice();
    updateDivineSunDisplay();
    loadSkins();
    loadPowers();
    setupButton();
    startChangingText();
    initChangingTextClick();
    checkSkinUnlocks();
    checkUpgradesAvailability();
    startBoostChecker();
    applyGodUpgrades();
    
    // Восстанавливаем экипированную силу
    if (equippedPower && powers[equippedPower]) {
        if (equippedPowerEl) {
            equippedPowerEl.style.backgroundImage = `url(${powers[equippedPower].image})`;
        }
        applyPowerEffect(equippedPower);
    }
    
    const allSkins = {...skins, ...clickSkins, ...darkSkins, ...premiumSkins};
    if (currentSkin && allSkins[currentSkin]) {
        buttonEl.style.backgroundImage = `url(${allSkins[currentSkin].url})`;
    }
}
const audio = new Audio('audio/music.mp3');
audio.loop = true; // бесконечное повторение

// Функция для запуска музыки
function playBackgroundMusic() {
    audio.play().catch(error => {
        console.log('Автоплей заблокирован:', error);
    });
}
// Запуск игры
initGame();
