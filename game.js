const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player and enemy data
const player = { x: 100, y: canvas.height - 150, width: 50, height: 100, color: 'blue', hp: 100 };
const enemy = { x: canvas.width - 150, y: canvas.height - 150, width: 50, height: 100, color: 'red', hp: 100 };

// Movement and attack logic
function move(direction) {
  switch (direction) {
    case 'up': player.y -= 20; break;
    case 'down': player.y += 20; break;
    case 'left': player.x -= 20; break;
    case 'right': player.x += 20; break;
  }
  render();
}

function attack(type) {
  const hit = Math.abs(player.x - enemy.x) < 60 && Math.abs(player.y - enemy.y) < 60;
  if (hit) {
    enemy.hp -= type === 'punch' ? 10 : 15;
    if (enemy.hp <= 0) alert('You Win!');
  }
  render();
}

// Render the game
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

  // Display HP
  ctx.fillStyle = 'black';
  ctx.fillText(`Player HP: ${player.hp}`, 10, 20);
  ctx.fillText(`Enemy HP: ${enemy.hp}`, canvas.width - 150, 20);
}

// Initial render
render();
