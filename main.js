'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");
const sunsDiv = document.getElementById("suns");

let isLoadingReady = false;
console.log('v', '001');

const musicList = [
  'Grasswalk.mp3',
];
const MUSIC = {};
let loadCount = 5;

musicList.forEach((m, i) => {
   const music = new Audio();
   music.src = m;
   MUSIC[m] = music;
   music.oncanplaythrough = (e) => {
    e.target.oncanplaythrough = null;
    loadCount++;
    if (loadCount === musicList.length) isLoadingReady = true;
     console.log('isLoadingReady', isLoadingReady);
   }
});

let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let suns = 0;
let addSuns = 0.01;

// Новые переменные для улучшений
let upgradeLevel = 0;
let upgradeBasePrice = 100;
let currentUpgradePrice = upgradeBasePrice;

// Функция покупки улучшения
function buyUpgrade() {
    if (score >= currentUpgradePrice) {
        // Вычитаем цену
        getScore(-currentUpgradePrice);
        
        // Увеличиваем клики (суммируем)
        addPerClick += 1;
        addText.innerText = addPerClick;
        
        // Увеличиваем уровень улучшения
        upgradeLevel++;
        
        // Пересчитываем цену (+17%)
        currentUpgradePrice = Math.floor(upgradeBasePrice * Math.pow(1.17, upgradeLevel));
        
        // Обновляем кнопку
        updateUpgradeButton();
        
        console.log(`Улучшение куплено! Уровень: ${upgradeLevel}, Цена следующего: ${currentUpgradePrice}`);
    }
}

// Функция обновления кнопки улучшения
function updateUpgradeButton() {
    const upgradeButton = document.querySelector('button[onclick*="getClickAdd"]');
    if (upgradeButton) {
        upgradeButton.innerHTML = `<span>+1 на клик<br>${currentUpgradePrice} капель</span>`;
        upgradeButton.setAttribute('onclick', `buyUpgrade()`);
    }
}

// Обновляем функцию клика по основной кнопке
button.onclick = function() {
    getScore(addPerClick);
    checkBGImage();
    
    if (isLoadingReady && score >= 500) {
        isLoadingReady = false;
        MUSIC['Grasswalk.mp3'].play();
    }
};

function getScore(n) {
    score += n;
    scoreText.innerText = Math.floor(score);
}

function getSuns(n) {
    suns += n;
    sunsDiv.innerText = suns.toFixed(2);
}

// Старая функция (оставляем для совместимости, но теперь используем buyUpgrade)
function getClickAdd(n, price) {
    // Перенаправляем на новую функцию
    buyUpgrade();
}

function mining(scorePerSec, price) {
    if (score < price) return;
    getScore(-price);
    addPerSecond += scorePerSec;
}

function getScoreForSuns(score_n, suns_n) {
    if (suns < suns_n) return;
    getScore(score_n);
    getSuns(-suns_n);
}

function checkBGImage() {
    if (score > 1000) {
        button.style.backgroundImage = 'url(https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg)';
    }
    if (score > 10000) {
        button.style.backgroundImage = 'url(https://pvsz2.ru/statics/plants-big/31.png)';
    }
    if (score > 1000000) {
        button.style.backgroundImage = 'url(https://avatars.mds.yandex.net/i?id=69a2b4239be746c0863ff1d2bf2c2a75_l-8972142-images-thumbs&n=13)';
    }
    if (score > 100000000) {
        button.style.backgroundImage = 'url(https://i.pinimg.com/originals/8e/0f/57/8e0f5777b6643cdc67dcfce5db6c1d70.jpg)';
    }
    if (score > 1000000000) {
        button.style.backgroundImage = 'url(https://files.vgtimes.ru/download/posts/2020-04/thumbs/1587903142_gxxpmj5u6ke3vkxewf1y0g.jpg)';
    }
    if (score > 100000000000) {
        button.style.backgroundImage = 'url(https://img.razrisyika.ru/kart/14/1200/53948-gorohostrel-13.jpg)';
    }
    if (score > 1000000000000) {
        button.style.backgroundImage = 'url(https://png.klev.club/uploads/posts/2024-04/png-klev-club-f8lu-p-gorokhostrel-png-20.png)';
    }
}

// Инициализация при загрузке
window.onload = function() {
    updateUpgradeButton();
};
