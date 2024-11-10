let playerHp = 100;
let playerLevel = 1;
let playerExp = 0;
let playerDefense = false;
let enemyHp = 50;
let isPlayerTurn = true;
let items = 2;
let currentStoryIndex = 0;

const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "images/player.png";
const enemyImg = new Image();
enemyImg.src = "images/enemy.png";

const playerPosition = { x: 50, y: 100 };
const enemyPosition = { x: 300, y: 100 };

let playerImgLoaded = false;
let enemyImgLoaded = false;
playerImg.onload = () => { playerImgLoaded = true; };
enemyImg.onload = () => { enemyImgLoaded = true; };

const messages = {
    en: {
        attack: "You attack the enemy for {damage} damage!",
        defend: "You prepare to defend the next attack!",
        talk: ["The enemy seems hesitant.", "The enemy ignores you.", "The enemy appears confused."],
        itemUsed: "You use a healing item and restore 20 HP.",
        noItems: "No items left!",
        enemyAttack: "The enemy attacks you for {damage} damage!",
        enemyDefend: "The enemy is watching you carefully...",
        playerDefend: "The enemy attacks, but you defend and take only {damage} damage!",
        victory: "You defeated the enemy!",
        defeat: "You have been defeated...",
        levelUp: "You leveled up! Now at level {level}.",
        run: "You successfully ran away!",
        storyStart: "You begin your journey from a small village...",
        storyEncounter: "An enemy appears on your path!"
    },
    ko: {
        attack: "적에게 {damage}의 피해를 입혔습니다!",
        defend: "다음 공격을 방어할 준비를 합니다!",
        talk: ["적이 주저하는 것 같습니다.", "적이 당신을 무시합니다.", "적이 혼란스러워 보입니다."],
        itemUsed: "회복 아이템을 사용하여 체력이 20 회복되었습니다.",
        noItems: "아이템이 없습니다!",
        enemyAttack: "적이 당신에게 {damage}의 피해를 입혔습니다!",
        enemyDefend: "적이 다음 공격을 준비하는 것 같습니다...",
        playerDefend: "적이 공격했지만, 방어하여 {damage}의 피해만 입었습니다!",
        victory: "적을 처치했습니다!",
        defeat: "패배하였습니다...",
        levelUp: "레벨이 올랐습니다! 현재 레벨: {level}.",
        run: "성공적으로 도망쳤습니다!",
        storyStart: "작은 마을에서 모험이 시작됩니다...",
        storyEncounter: "길을 가던 중 적을 만났습니다!"
    }
};

// 초기 언어 설정을 한국어("ko")로 설정
let currentLanguage = "ko";

function setLanguage(lang) {
    currentLanguage = lang;
    updateStats();
    displayStory();
}

function displayMessage(message, params = {}) {
    let msg = messages[currentLanguage][message];
    if (Array.isArray(msg)) {
        msg = msg[Math.floor(Math.random() * msg.length)];
    }
    for (const key in params) {
        msg = msg.replace(`{${key}}`, params[key]);
    }
    document.getElementById("message").textContent = msg;
}

function displayStory() {
    const story = [
        messages[currentLanguage].storyStart,
        messages[currentLanguage].storyEncounter
    ];
    if (currentStoryIndex < story.length) {
        document.getElementById("story").textContent = story[currentStoryIndex];
        document.getElementById("story").style.display = "block";
        currentStoryIndex++;
    } else {
        document.getElementById("story").style.display = "none";
        startBattle();
    }
}

function startBattle() {
    enemyHp = 50 + playerLevel * 10;
    document.getElementById("battle").style.display = "flex";
    document.getElementById("actions").style.display = "block";
}

function attack() {
    if (isPlayerTurn) {
        const damage = Math.floor(Math.random() * 10) + 5;
        enemyHp -= damage;
        displayMessage("attack", { damage });
        isPlayerTurn = false;
        checkGameOver();
        setTimeout(enemyTurn, 1000);
    }
}

function defend() {
    if (isPlayerTurn) {
        displayMessage("defend");
        playerDefense = true;
        isPlayerTurn = false;
        setTimeout(enemyTurn, 1000);
    }
}

function talk() {
    if (isPlayerTurn) {
        displayMessage("talk");
        const response = Math.random();
        if (response < 0.3) {
            enemyHp -= 5;
        }
        isPlayerTurn = false;
        checkGameOver();
        setTimeout(enemyTurn, 1000);
    }
}

function run() {
    if (isPlayerTurn) {
        const chance = Math.random();
        if (chance > 0.5) {
            displayMessage("run");
            endBattle();
        } else {
            displayMessage("enemyDefend");
            setTimeout(enemyTurn, 1000);
        }
        isPlayerTurn = false;
    }
}

function endBattle() {
    currentStoryIndex++;
    displayStory();
}

function enemyTurn() {
    if (enemyHp > 0) {
        const damage = Math.floor(Math.random() * 10) + 5;
        if (playerDefense) {
            displayMessage("playerDefend", { damage: Math.floor(damage / 2) });
            playerDefense = false;
        } else {
            displayMessage("enemyAttack", { damage });
            playerHp -= damage;
        }
        checkGameOver();
    }
    isPlayerTurn = true;
}

function checkGameOver() {
    updateStats();
    if (playerHp <= 0) {
        displayMessage("defeat");
        disableActions();
    } else if (enemyHp <= 0) {
        displayMessage("victory");
        gainExp();
    }
}

function disableActions() {
    document.querySelectorAll("#actions button").forEach(button => {
        button.disabled = true;
    });
}

function gainExp() {
    playerExp += 10;
    if (playerExp >= playerLevel * 20) {
        playerLevel++;
        playerExp = 0;
        playerHp = Math.min(playerHp + 20, 100);
        displayMessage("levelUp", { level: playerLevel });
    }
}

function updateStats() {
    document.getElementById("playerHp").textContent = playerHp;
    document.getElementById("playerLevel").textContent = playerLevel;
    document.getElementById("enemyHp").textContent = enemyHp;
}

updateStats();
displayStory();
