const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

let mode = "explore";  // "explore" or "battle"
let player = { x: 50, y: 200, width: 40, height: 40, hp: 100, level: 1, exp: 0 };
let enemy = { x: 300, y: 200, width: 40, height: 40, hp: 50, level: 1, name: "Slime", defeated: false };
let isPlayerTurn = true;
let playerPath = "neutral";  // "peaceful", "aggressive", "neutral"
let messages = [];
let currentStoryIndex = 0;

// 키 입력 상태
const keys = {};

// 이미지
const playerImg = new Image();
playerImg.src = "images/player.png";
const slimeImg = new Image();
slimeImg.src = "images/slime.png";

// 이벤트 리스너
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// 가상 조이스틱 버튼 이벤트 리스너
document.getElementById("upBtn").addEventListener("mousedown", () => (keys["ArrowUp"] = true));
document.getElementById("downBtn").addEventListener("mousedown", () => (keys["ArrowDown"] = true));
document.getElementById("leftBtn").addEventListener("mousedown", () => (keys["ArrowLeft"] = true));
document.getElementById("rightBtn").addEventListener("mousedown", () => (keys["ArrowRight"] = true));

document.getElementById("upBtn").addEventListener("mouseup", () => (keys["ArrowUp"] = false));
document.getElementById("downBtn").addEventListener("mouseup", () => (keys["ArrowDown"] = false));
document.getElementById("leftBtn").addEventListener("mouseup", () => (keys["ArrowLeft"] = false));
document.getElementById("rightBtn").addEventListener("mouseup", () => (keys["ArrowRight"] = false));

// 게임 루프
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mode === "explore") {
        updateExploreMode();
        drawExploreMode();
    } else if (mode === "battle") {
        drawBattleMode();
    }

    requestAnimationFrame(gameLoop);
}

// 탐험 모드 업데이트
function updateExploreMode() {
    if (keys["ArrowUp"]) player.y -= 2;
    if (keys["ArrowDown"]) player.y += 2;
    if (keys["ArrowLeft"]) player.x -= 2;
    if (keys["ArrowRight"]) player.x += 2;

    // 플레이어가 적과 충돌하면 전투 시작
    if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y &&
        !enemy.defeated
    ) {
        startBattle();
    }
}

// 탐험 모드 그리기
function drawExploreMode() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (!enemy.defeated) {
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

// 전투 시작
function startBattle() {
    mode = "battle";
    isPlayerTurn = true;
    document.getElementById("battleUI").style.display = "block";
    document.getElementById("message").textContent = `${enemy.name} appeared!`;
}

// 전투 모드 그리기
function drawBattleMode() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (playerImg.complete) {
        ctx.drawImage(playerImg, 50, 100, player.width, player.height);
    } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(50, 100, player.width, player.height);
    }

    if (enemy.img && enemy.img.complete) {
        ctx.drawImage(enemy.img, 300, 100, enemy.width, enemy.height);
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(300, 100, enemy.width, enemy.height);
    }
}

// 플레이어 공격
function playerAttack() {
    if (isPlayerTurn) {
        const damage = Math.floor(Math.random() * 10) + 5;
        enemy.hp -= damage;
        document.getElementById("message").textContent = `You dealt ${damage} damage to ${enemy.name}!`;
        isPlayerTurn = false;
        setTimeout(enemyAttack, 1000);
        checkBattleOutcome();
    }
}

// 적 공격
function enemyAttack() {
    if (!isPlayerTurn) {
        const damage = Math.floor(Math.random() * 10) + 5;
        player.hp -= damage;
        document.getElementById("message").textContent = `${enemy.name} dealt ${damage} damage to you!`;
        isPlayerTurn = true;
        checkBattleOutcome();
    }
}

// 전투 결과 확인
function checkBattleOutcome() {
    if (enemy.hp <= 0) {
        document.getElementById("message").textContent = `You defeated ${enemy.name}!`;
        player.exp += 10;
        enemy.defeated = true;
        setTimeout(() => {
            mode = "explore";
            document.getElementById("battleUI").style.display = "none";
        }, 1500);
    } else if (player.hp <= 0) {
        document.getElementById("message").textContent = "You have been defeated...";
        disableActions();
    }
}

// 전투 모드 버튼 기능
document.getElementById("attackBtn").onclick = playerAttack;
document.getElementById("defendBtn").onclick = () => {
    document.getElementById("message").textContent = "You defend against the next attack!";
    isPlayerTurn = false;
    setTimeout(enemyAttack, 1000);
};
document.getElementById("talkBtn").onclick = () => {
    document.getElementById("message").textContent = "You try to talk to the enemy...";
    isPlayerTurn = false;
    setTimeout(enemyAttack, 1000);
};
document.getElementById("runBtn").onclick = () => {
    document.getElementById("message").textContent = "You ran away!";
    mode = "explore";
    document.getElementById("battleUI").style.display = "none";
};

// 게임 시작
gameLoop();
