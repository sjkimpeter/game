let playerHp = 100;
let playerLevel = 1;
let playerExp = 0;
let playerDefense = false;
let enemyHp = 50;
let enemyLevel = 1;
let enemyName = "Slime";
let isPlayerTurn = true;
let items = 2;
let currentStoryIndex = 0;
let playerPath = "neutral";  // 엔딩 분기(평화주의자, 전투주의자, 중립)

const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "images/player.png";
const enemyImg = new Image();
enemyImg.src = "images/slime.png";

const playerPosition = { x: 50, y: 100 };
const enemyPosition = { x: 300, y: 100 };

let playerImgLoaded = false;
let enemyImgLoaded = false;
playerImg.onload = () => { playerImgLoaded = true; };
enemyImg.onload = () => { enemyImgLoaded = true; };

const messages = {
    en: {
        attack: "You attack {enemy} for {damage} damage!",
        defend: "You prepare to defend the next attack!",
        talk: ["The enemy seems hesitant.", "The enemy ignores you.", "The enemy appears confused."],
        itemUsed: "You use a healing item and restore 20 HP.",
        noItems: "No items left!",
        enemyAttack: "{enemy} attacks you for {damage} damage!",
        enemyDefend: "{enemy} is watching you carefully...",
        playerDefend: "{enemy} attacks, but you defend and take only {damage} damage!",
        victory: "You defeated {enemy}!",
        defeat: "You have been defeated...",
        levelUp: "You leveled up! Now at level {level}.",
        run: "You successfully ran away!",
        storyStart: "You begin your journey from a small village...",
        storyEncounter: "An enemy appears on your path!",
        puzzle: "Solve this puzzle to weaken the enemy!",
        puzzleSuccess: "You solved the puzzle! The enemy takes damage!",
        puzzleFail: "You failed to solve the puzzle. The enemy attacks!"
    },
    ko: {
        attack: "{enemy}에게 {damage}의 피해를 입혔습니다!",
        defend: "다음 공격을 방어할 준비를 합니다!",
        talk: ["적이 주저하는 것 같습니다.", "적이 당신을 무시합니다.", "적이 혼란스러워 보입니다."],
        itemUsed: "회복 아이템을 사용하여 체력이 20 회복되었습니다.",
        noItems: "아이템이 없습니다!",
        enemyAttack: "{enemy}이(가) 당신에게 {damage}의 피해를 입혔습니다!",
        enemyDefend: "{enemy}이(가) 당신을 주의 깊게 지켜보고 있습니다...",
        playerDefend: "{enemy}이(가) 공격했지만, 방어하여 {damage}의 피해만 입었습니다!",
        victory: "{enemy}을(를) 처치했습니다!",
        defeat: "패배하였습니다...",
        levelUp: "레벨이 올랐습니다! 현재 레벨: {level}.",
        run: "성공적으로 도망쳤습니다!",
        storyStart: "작은 마을에서 모험이 시작됩니다...",
        storyEncounter: "길을 가던 중 적을 만났습니다!",
        puzzle: "퍼즐을 풀어 적을 약화시키세요!",
        puzzleSuccess: "퍼즐을 풀었습니다! 적이 피해를 입습니다!",
        puzzleFail: "퍼즐을 실패했습니다. 적이 공격합니다!"
    }
};

// 초기 언어 설정을 한국어("ko")로 설정
let currentLanguage = "ko";

// 스토리 진행
const storyEvents = [
    { type: "story", text: "storyStart" },
    { type: "encounter", enemy: { name: "Slime", level: 1, hp: 50, img: "images/slime.png" } },
    { type: "story", text: "storyEncounter" },
    { type: "encounter", enemy: { name: "Goblin", level: 2, hp: 70, img: "images/goblin.png" } },
    { type: "story", text: "storyEncounter" },
    { type: "encounter", enemy: { name: "Dragon", level: 5, hp: 150, img: "images/dragon.png" } }
];

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
    if (currentStoryIndex >= storyEvents.length) {
        displayEnding();
        return;
    }
    
    const event = storyEvents[currentStoryIndex];
    if (event.type === "story") {
        displayMessage(event.text);
        currentStoryIndex++;
    } else if (event.type === "encounter") {
        startEncounter(event.enemy);
        currentStoryIndex++;
    }
}

function displayEnding() {
    if (playerPath === "peaceful") {
        displayMessage("You have achieved the Peaceful Ending.");
    } else if (playerPath === "aggressive") {
        displayMessage("You have achieved the Aggressive Ending.");
    } else {
        displayMessage("You have achieved the Neutral Ending.");
    }
    disableActions();
}

function startEncounter(enemy) {
    enemyName = enemy.name;
    enemyLevel = enemy.level;
    enemyHp = enemy.hp;
    enemyImg.src = enemy.img;
    updateStats();
}

function solvePuzzle() {
    displayMessage("puzzle");
    const success = Math.random() > 0.5;
    if (success) {
        enemyHp -= 20;
        displayMessage("puzzleSuccess");
    } else {
        displayMessage("puzzleFail");
        enemyTurn();
    }
}

function attack() {
    if (isPlayerTurn) {
        const damage = Math.floor(Math.random() * 10) + 5;
        enemyHp -= damage;
        displayMessage("attack", { damage, enemy: enemyName });
        isPlayerTurn = false;
        checkGameOver();
        setTimeout(() => {
            if (enemyHp > 0) enemyTurn();
        }, 1000);
    }
}

function checkGameOver() {
    updateStats();
    if (playerHp <= 0) {
        displayMessage("defeat");
        disableActions();
    } else if (enemyHp <= 0) {
        displayMessage("victory", { enemy: enemyName });
        gainExp();
        setTimeout(displayStory, 2000); // 다음 스토리로 이동
    }
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

function disableActions() {
    document.querySelectorAll("#actions button").forEach(button => {
        button.disabled = true;
    });
}

function updateStats() {
    document.getElementById("playerHp").textContent = playerHp;
    document.getElementById("playerLevel").textContent = playerLevel;
    document.getElementById("enemyHp").textContent = enemyHp;
    document.getElementById("enemyLevel").textContent = enemyLevel;
    document.getElementById("enemyName").textContent = enemyName;
}

// 게임 시작
updateStats();
displayStory();
