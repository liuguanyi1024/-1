const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stickmanWidth = 50;
const stickmanHeight = 100;
const groundHeight = 50;

const player1 = {
    x: 100,
    y: canvas.height - stickmanHeight - groundHeight,
    width: stickmanWidth,
    height: stickmanHeight,
    color: 'blue',
    speed: 5,
    health: 100,
    isPunching: false
};

const player2 = {
    x: canvas.width - 200,
    y: canvas.height - stickmanHeight - groundHeight,
    width: stickmanWidth,
    height: stickmanHeight,
    color: 'red',
    speed: 5,
    health: 100,
    isPunching: false
};

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function drawStickman(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGround() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
}

function detectCollision(player1, player2) {
    return player1.x < player2.x + player2.width &&
           player1.x + player1.width > player2.x &&
           player1.y < player2.y + player2.height &&
           player1.y + player1.height > player2.y;
}

function updateHealthBars() {
    const player1HealthBar = document.getElementById('player1-health');
    const player2HealthBar = document.getElementById('player2-health');
    player1HealthBar.style.width = `${player1.health}%`;
    player2HealthBar.style.width = `${player2.health}%`;
}

function update() {
    // Player 1 movement
    if (keys['a']) player1.x -= player1.speed;
    if (keys['d']) player1.x += player1.speed;
    if (keys['w']) player1.isPunching = true;

    // Player 2 movement
    if (keys['ArrowLeft']) player2.x -= player2.speed;
    if (keys['ArrowRight']) player2.x += player2.speed;
    if (keys['ArrowUp']) player2.isPunching = true;

    // Collision detection
    if (detectCollision(player1, player2)) {
        if (player1.isPunching) player2.health -= 1;
        if (player2.isPunching) player1.health -= 1;
    }

    player1.isPunching = false;
    player2.isPunching = false;

    updateHealthBars();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawStickman(player1);
    drawStickman(player2);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
