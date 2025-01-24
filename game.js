const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game Variables
const spriteImage = new Image();
spriteImage.src = './images/stickman_sprite.png';

const frameWidth = 100; // Width of each frame in the sprite sheet
const frameHeight = 100; // Height of each frame
const actions = {
  walk: { start: 0, frames: 2 },       // Walking (forward/backward)
  jump: { start: 3, frames: 1 },       // Jumping
  crouch: { start: 4, frames: 1 },     // Crouching
  punch: { start: 5, frames: 2 },      // Punching
  kick: { start: 7, frames: 2 }        // Kicking
};

let currentAction = "walk";
let currentFrame = 0;
let frameCount = 0; // Control animation speed
let playerX = canvas.width / 2;
let playerY = canvas.height - 200;
let velocityY = 0;
let isJumping = false;

// Input Handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Draw Stickman
function drawStickman(action, x, y) {
  const { start, frames } = actions[action];
  const sx = (start + currentFrame) * frameWidth;
  ctx.drawImage(spriteImage, sx, 0, frameWidth, frameHeight, x, y, frameWidth, frameHeight);
}

// Update Game Logic
function update() {
  frameCount++;
  if (frameCount > 10) { // Change frame every 10 ticks
    currentFrame = (currentFrame + 1) % actions[currentAction].frames;
    frameCount = 0;
  }

  // Movement
  if (keys["ArrowRight"]) {
    playerX += 5;
    currentAction = "walk";
  } else if (keys["ArrowLeft"]) {
    playerX -= 5;
    currentAction = "walk";
  } else if (keys["ArrowUp"] && !isJumping) {
    velocityY = -15;
    isJumping = true;
    currentAction = "jump";
  } else if (keys["ArrowDown"]) {
    currentAction = "crouch";
  } else if (keys["z"]) {
    currentAction = "punch";
  } else if (keys["x"]) {
    currentAction = "kick";
  } else {
    currentAction = "walk";
  }

  // Jump physics
  if (isJumping) {
    velocityY += 1; // Gravity
    playerY += velocityY;
    if (playerY >= canvas.height - 200) {
      playerY = canvas.height - 200;
      isJumping = false;
      velocityY = 0;
    }
  }
}

// Render Game
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Background (optional)
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Ground
  ctx.fillStyle = "#654321";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

  // Draw Stickman
  drawStickman(currentAction, playerX, playerY);
}

// Game Loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start the Game
spriteImage.onload = () => {
  gameLoop();
};
