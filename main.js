'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const levelText = document.getElementById("level");
const button = document.getElementById("button");
const skinsContainer = document.getElementById("skins-container");

// Элементы цен
const clickPriceElem = document.getElementById("click-price");
const autoPriceElem = document.getElementById("auto-price");
const shopClickPriceElem = document.getElementById("shop-click-price");
const shopAutoPriceElem = document.getElementById("shop-auto-price");
const shopBigPriceElem = document.getElementById("shop-big-price");

let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let exp = 0;
let level = 1;
let maxExp = 100;

// Цены улучшений
let upgradePrices = {
    'click': 100,
    'auto': 50,
    'big': 1000
};

// Скины
const skins = [
    { id: 1, name: "Обычный", url: "https://pvsz2.ru/statics/plants-big/68.png", unlocked: true },
    { id: 2, name: "Золотой", url: "https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg", unlocked: false },
    { id: 3, name: "Эпический", url: "https://pvsz2.ru/statics/plants-big/31.png", unlocked: false },
    { id: 4, name: "Легендарный", url: "https://avatars.mds.yandex.net/i?id=69a2b4239be746c0863ff1d2bf2c2a75_l-8972142-images-thumbs&n=13", unlocked: false }
];

let currentSkin = skins[0];

// Опыт за клик
function addExp() {
    exp += 1;
    if (exp >= maxExp) {
        level++;
        exp = 0;
        maxExp = Math.floor(maxExp * 1.05);
        alert(`Уровень UP! Теперь уровень ${level}`);
        updateLevel();
    }
}

function updateLevel() {
    levelText.textContent = level;
}

function toggleUpgradeShop() {
    const shop = document.getElementById('upgrade-shop');
    const overlay = document.getElementById('overlay');
    shop.classList.toggle('active');
    overlay.classList.toggle('active');
}

function toggleInventory() {
    const inventory = document.getElementById('inventory');
    const overlay = document.getElementById('overlay');
    loadSkins();
    inventory.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeAllShops() {
    document.getElementById('upgrade-shop').classList.remove('active');
    document.getElementById('inventory').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function openTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function buyUpgrade(addValue, basePrice, requiredLevel) {
    if (level < requiredLevel) {
        alert(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    let priceKey = '';
    if (addValue === 1) priceKey = 'click';
    else if (addValue === 0.2) priceKey = 'auto';
    else if (addValue === 5) priceKey = 'big';
    
    const currentPrice = upgradePrices[priceKey];
    
    if (score >= currentPrice) {
        score -= currentPrice;
        
        if (addValue === 1 || addValue === 5) {
            addPerClick += addValue;
        } else {
            addPerSecond += addValue;
        }
        
        // +20% к цене
        upgradePrices[priceKey] = Math.floor(currentPrice * 1.2);
        
        // Обновляем цены везде
        updatePrices();
        updateDisplay();
    }
}

function updatePrices() {
    clickPriceElem.textContent = upgradePrices.click;
    autoPriceElem.textContent = upgradePrices.auto;
    shopClickPriceElem.textContent = upgradePrices.click;
    shopAutoPriceElem.textContent = upgradePrices.auto;
    shopBigPriceElem.textContent = upgradePrices.big;
}

function buyCase() {
    if (score >= 1250) {
        score -= 1250;
        
        const random = Math.random() * 100;
        let skinQuality;
        
        if (random < 1) skinQuality = 4;
        else if (random < 10) skinQuality = 3;
        else if (random < 40) skinQuality = 2;
        else skinQuality = 1;
        
        const availableSkins = skins.filter(skin => !skin.unlocked && skin.id === skinQuality);
        if (availableSkins.length > 0) {
            const skin = availableSkins[0];
            skin.unlocked = true;
            alert(`Вы получили скин: ${skin.name}!`);
        } else {
            alert("Все скины этого качества уже получены!");
        }
        
        updateDisplay();
    }
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
}

function updateDisplay() {
    scoreText.textContent = Math.floor(score);
    addText.textContent = addPerClick;
}

// Клик по основной кнопке
button.onclick = function() {
    score += addPerClick;
    addExp();
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
updateLevel();
updatePrices();
