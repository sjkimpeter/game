const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 100,
    y: 100,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 3,
    hp: 100,
    level: 1,
    exp: 0,
};

let monsters = [];
let monsterSpawnInterval = 2000; // 몬스터 생성 주기 (밀리초)
let monsterMaxHP = 30;
let touchDirection = null;

function spawnMonster() {
    let monster = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 20,
        height: 20,
        color: 'red',
        hp: monsterMaxHP,
    };
    monsters.push(monster);
}

function movePlayer() {
    if (keys['ArrowUp'] || touchDirection === 'up') player.y -= player.speed;
    if (keys['ArrowDown'] || touchDirection === 'down') player.y += player.speed;
    if (keys['ArrowLeft'] || touchDirection === 'left') player.x -= player.speed;
    if (keys['ArrowRight'] || touchDirection === 'right') player.x += player.speed;

    // 화면 경계를 넘지 않도록
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function checkCollision() {
    monsters.forEach((monster, index) => {
        if (
            player.x < monster.x + monster.width &&
            player.x + player.width > monster.x &&
            player.y < monster.y + monster.height &&
            player.y + player.height > monster.y
        ) {
            monster.hp -= 10; // 몬스터 체력 감소
            if (monster.hp <= 0) {
                monsters.splice(index, 1); // 몬스터 제거
                player.exp += 10; // 경험치 획득
                checkLevelUp();
            }
        }
    });
}

function checkLevelUp() {
    if (player.exp >= player.level * 20) {
        player.level += 1;
        player.exp = 0;
        player.hp += 20; // 체력 증가
        player.speed += 0.5; // 속도 증가
        monsterMaxHP += 10; // 몬스터 체력 증가
        console.log(`Level Up! Level: ${player.level}`);
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawMonsters() {
    monsters.forEach((monster) => {
        ctx.fillStyle = monster.color;
        ctx.fillRect(monster.x, monster.y, monster.width, monster.height);
    });
}

function drawHUD() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`HP: ${player.hp}`, 10, 20);
    ctx.fillText(`Level: ${player.level}`, 10, 40);
    ctx.fillText(`EXP: ${player.exp}`, 10, 60);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    checkCollision();

    drawPlayer();
    drawMonsters();
    drawHUD();

    requestAnimationFrame(gameLoop);
}

let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// 주기적으로 몬스터 생성
setInterval(spawnMonster, monsterSpawnInterval);

// 터치 이벤트 추가
canvas.addEventListener('touchstart', (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    // 화면의 네 영역을 기준으로 방향을 설정
    if (touchX < canvas.width / 3) {
        touchDirection = 'left';
    } else if (touchX > canvas.width * 2 / 3) {
        touchDirection = 'right';
    } else if (touchY < canvas.height / 3) {
        touchDirection = 'up';
    } else if (touchY > canvas.height * 2 / 3) {
        touchDirection = 'down';
    }
});

canvas.addEventListener('touchend', () => {
    touchDirection = null; // 터치가 끝나면 방향 초기화
});

// 게임 루프 시작
gameLoop();
