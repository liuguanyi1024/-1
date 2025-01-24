const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerHeight;
canvas.height = window.innerWidth;

const stickmanWidth = 50;
const stickmanHeight = 100;
const groundHeight = 50;

const player = {
    x: 100,
    y: canvas.height - stickmanHeight - groundHeight,
    width: stickmanWidth,
    height: stickmanHeight,
    color: 'blue',
    speed: 5,
    health: 100,
    isPunching: false
};

const enemy = {
    x: canvas.width - 200,
    y: canvas.height - stickmanHeight - groundHeight,
    width: stickmanWidth,
    height: stickmanHeight,
    color: 'red',
    speed: 3,
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

function update() {
    // Player movement
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;
    if (keys['ArrowUp']) player.isPunching = true;

    // Enemy AI movement
    if (enemy.x > player.x) enemy.x -= enemy.speed;
    if (enemy.x < player.x) enemy.x += enemy.speed;
    enemy.isPunching = Math.random() < 0.01;

    // Collision detection
    if (detectCollision(player, enemy)) {
        if (player.isPunching) enemy.health -= 1;
        if (enemy.isPunching) player.health -= 1;
    }

    player.isPunching = false;
    enemy.isPunching = false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawStickman(player);
    drawStickman(enemy);

    // Display health
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Player Health: ${player.health}`, 20, 30);
    ctx.fillText(`Enemy Health: ${enemy.health}`, canvas.width - 200, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
