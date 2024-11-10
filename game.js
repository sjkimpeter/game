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
        displayMessage(`You attack the enemy for ${damage} damage!`);
        isPlayerTurn = false;
        checkGameOver();
        setTimeout(enemyTurn, 1000);
    }
}

function defend() {
    if (isPlayerTurn) {
        displayMessage("You prepare to defend the next attack!");
        playerDefense = true;
        isPlayerTurn = false;
        setTimeout(enemyTurn, 1000);
    }
}

function talk() {
    if (isPlayerTurn) {
        displayMessage("You try to talk to the enemy...");
        const response = Math.random();
        if (response < 0.3) {
            displayMessage("The enemy seems hesitant.");
            enemyHp -= 5; // 대화로 적에게 약간의 피해를 줌
        } else if (response < 0.6) {
            displayMessage("The enemy ignores you.");
        } else {
            displayMessage("The enemy appears confused.");
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
        displayMessage("You use a healing item and restore 20 HP.");
        updateStats();
        isPlayerTurn = false;
        setTimeout(enemyTurn, 1000);
    } else if (items <= 0) {
        displayMessage("No items left!");
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
                displayMessage(`The enemy attacks, but you defend and take only ${damage} damage!`);
            } else {
                displayMessage(`The enemy attacks you for ${damage} damage!`);
            }
            playerHp -= damage;
        } else {
            displayMessage("The enemy is preparing for the next attack...");
        }
        checkGameOver();
    }
    isPlayerTurn = true;
}

function checkGameOver() {
    updateStats();
    if (playerHp <= 0) {
        displayMessage("You have been defeated...");
        disableActions();
    } else if (enemyHp <= 0) {
        displayMessage("You defeated the enemy!");
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
        displayMessage(`You leveled up! Now at level ${playerLevel}.`);
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
