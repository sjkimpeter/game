let playerHp = 100;
let playerLevel = 1;
let playerExp = 0;
let playerDefense = false;
let enemyHp = 50;
let isPlayerTurn = true;
let items = 2;  // 초기 아이템 개수

const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");

// 캐릭터 이미지 로드
const playerImg = new Image();
playerImg.src = "images/player.png";
const enemyImg = new Image();
enemyImg.src = "images/enemy.png";

// 캐릭터 위치
const playerPosition = { x: 50, y: 100 };
const enemyPosition = { x: 300, y: 100 };

// 이미지 로드 여부 확인
let playerImgLoaded = false;
let enemyImgLoaded = false;

playerImg.onload = () => { playerImgLoaded = true; };
enemyImg.onload = () => { enemyImgLoaded = true; };

function updateStats() {
    document.getElementById("playerHp").textContent = playerHp;
    document.getElementById("playerLevel").textContent = playerLevel;
    document.getElementById("enemyHp").textContent = enemyHp;
}

function displayMessage(message) {
    document.getElementById("message").textContent = message;
}

function attack() {
    if (isPlayerTurn) {
        const damage = Math.floor(Math.random() * 10) + 5;
        enemyHp -= damage;
        displayMessage(`적에게 ${damage}의 피해를 입혔습니다!`);
        isPlayerTurn = false;
        checkGameOver();
        setTimeout(enemyTurn, 1000);
    }
}

function defend() {
    if (isPlayerTurn) {
        displayMessage("다음 공격을 방어할 준비를 합니다!");
        playerDefense = true;
        isPlayerTurn = false;
        setTimeout(enemyTurn, 1000);
    }
}

function talk() {
    if (isPlayerTurn) {
        displayMessage("적에게 말을 걸어봅니다...");
        const response = Math.random();
        if (response < 0.3) {
            displayMessage("적이 주저하는 것 같습니다.");
            enemyHp -= 5; // 대화로 적에게 약간의 피해를 줌
        } else if (response < 0.6) {
            displayMessage("적이 당신을 무시합니다.");
        } else {
            displayMessage("적이 혼란스러워 보입니다.");
        }
        isPlayerTurn = false;
        checkGameOver();
        setTimeout(enemyTurn, 1000);
    }
}

function useItem() {
    if (isPlayerTurn && items > 0) {
        playerHp = Math.min(playerHp + 20, 100);  // HP 최대치를 넘지 않도록
        items--;
        displayMessage("회복 아이템을 사용하여 체력이 20 회복되었습니다.");
        updateStats();
        isPlayerTurn = false;
        setTimeout(enemyTurn, 1000);
    } else if (items <= 0) {
        displayMessage("아이템이 없습니다!");
    }
}

function enemyTurn() {
    if (enemyHp > 0) {
        const action = Math.random();
        if (action < 0.7) {
            let damage = Math.floor(Math.random() * 10) + 5;
            if (playerDefense) {
                damage = Math.floor(damage / 2);  // 방어 시 피해 반감
                playerDefense = false;
                displayMessage(`적이 공격했지만, 방어하여 ${damage}의 피해만 입었습니다!`);
            } else {
                displayMessage(`적이 당신에게 ${damage}의 피해를 입혔습니다!`);
            }
            playerHp -= damage;
        } else {
            displayMessage("적이 다음 공격을 준비하는 것 같습니다...");
        }
        checkGameOver();
    }
    isPlayerTurn = true;
}

function checkGameOver() {
    updateStats();
    if (playerHp <= 0) {
        displayMessage("패배하였습니다...");
        disableActions();
    } else if (enemyHp <= 0) {
        displayMessage("적을 처치했습니다!");
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
        playerHp = Math.min(playerHp + 20, 100); // 레벨업 시 체력 회복
        enemyHp = 50 + playerLevel * 10;  // 새로운 적 체력 증가
        displayMessage(`레벨이 올랐습니다! 현재 레벨: ${playerLevel}`);
        updateStats();
        isPlayerTurn = true;
    }
}

function drawCharacters() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 플레이어 이미지 또는 기본 사각형
    if (playerImgLoaded) {
        ctx.drawImage(playerImg, playerPosition.x, playerPosition.y, 64, 64);
    } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(playerPosition.x, playerPosition.y, 64, 64);
    }

    // 적 이미지 또는 기본 사각형
    if (enemyImgLoaded) {
        ctx.drawImage(enemyImg, enemyPosition.x, enemyPosition.y, 64, 64);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemyPosition.x, enemyPosition.y, 64, 64);
    }
}

function gameLoop() {
    drawCharacters();
    requestAnimationFrame(gameLoop);
}

updateStats();
gameLoop();
