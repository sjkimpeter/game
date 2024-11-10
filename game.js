const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let mode = "explore";  // "explore" or "battle"
let player = { x: 50, y: 300, width: 40, height: 40, hp: 100, level: 1, exp: 0 };
let enemies = [
    { x: 300, y: 200, width: 40, height: 40, hp: 50, level: 1, name: "Slime", defeated: false },
    { x: 600, y: 300, width: 40, height: 40, hp: 80, level: 2, name: "Goblin", defeated: false }
];
let obstacles = [
    { x: 200, y: 150, width: 60, height: 60, type: "tree" },
    { x: 400, y: 250, width: 60, height: 60, type: "rock" }
];
let currentEnemy = null;
let storyIndex = 0;
let messages = [];

// 키 입력 상태 및 가상 조이스틱
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
const joystickButtons = [
    { element: document.getElementById("upBtn"), key: "ArrowUp" },
    { element: document.getElementById("downBtn"), key: "ArrowDown" },
    { element: document.getElementById("leftBtn"), key: "ArrowLeft" },
    { element: document.getElementById("rightBtn"), key: "ArrowRight" }
];

joystickButtons.forEach(({ element, key }) => {
    element.addEventListener("mousedown", () => keys[key] = true);
    element.addEventListener("mouseup", () => keys[key] = false);
    element.addEventListener("touchstart", (e) => { e.preventDefault(); keys[key] = true; });
    element.addEventListener("touchend", (e) => { e.preventDefault(); keys[key] = false; });
});

window.addEventListener("keydown", (e) => { if (keys.hasOwnProperty(e.key)) keys[e.key] = true; });
window.addEventListener("keyup", (e) => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });

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
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // 장애물 충돌 처리
    obstacles.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
            if (keys["ArrowUp"]) player.y += 2;
            if (keys["ArrowDown"]) player.y -= 2;
            if (keys["ArrowLeft"]) player.x += 2;
            if (keys["ArrowRight"]) player.x -= 2;
        }
    });

    // 적과 충돌하면 전투 시작
    enemies.forEach(enemy => {
        if (!enemy.defeated && checkCollision(player, enemy)) {
            currentEnemy = enemy;
            startBattle();
        }
    });
}

// 탐험 모드 그리기
function drawExploreMode() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.type === "tree" ? "darkgreen" : "gray";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    enemies.forEach(enemy => {
        if (!enemy.defeated) {
            ctx.fillStyle = "red";
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

// 충돌 검사 함수
function checkCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
}

// 전투 시작
function startBattle() {
    mode = "battle";
    document.getElementById("battleUI").style.display = "block";
    document.getElementById("message").textContent = `${currentEnemy.name} appeared!`;
}

// 전투 모드 그리기
function drawBattleMode() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(50, 100, player.width, player.height);
    ctx.fillStyle = "red";
    ctx.fillRect(300, 100, currentEnemy.width, currentEnemy.height);
}

// 플레이어 공격
function playerAttack() {
    const damage = Math.floor(Math.random() * 10) + 5;
    currentEnemy.hp -= damage;
    document.getElementById("message").textContent = `You dealt ${damage} damage to ${currentEnemy.name}!`;
    if (currentEnemy.hp <= 0) {
        currentEnemy.defeated = true;
        mode = "explore";
        document.getElementById("battleUI").style.display = "none";
        document.getElementById("message").textContent = `${currentEnemy.name} defeated!`;
    }
}

// 전투 버튼 기능
document.getElementById("attackBtn").onclick = playerAttack;
document.getElementById("defendBtn").onclick = () => {
    document.getElementById("message").textContent = "You defended the attack!";
};
document.getElementById("talkBtn").onclick = () => {
    document.getElementById("message").textContent = "You tried talking to the enemy...";
};
document.getElementById("runBtn").onclick = () => {
    mode = "explore";
    document.getElementById("battleUI").style.display = "none";
    document.getElementById("message").textContent = "You ran away!";
};

// 게임 시작
gameLoop();
