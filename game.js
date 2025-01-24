const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ========== 核心修复 ==========
// 1. 图片路径修正
const spriteImage = new Image();
spriteImage.src = './stickman_sprite.png'; // 直接指向根目录

// 2. 画布尺寸动态适配
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth, 1200); // 限制最大宽度
  canvas.height = window.innerHeight * 0.95; // 留出底部空间
  playerY = canvas.height - 200; // 角色初始Y位置
}

// 3. 错误处理强化
spriteImage.onerror = function() {
  console.error('贴图加载失败! 当前路径:', this.src);
  ctx.fillStyle = '#FF0000';
  ctx.font = '20px Arial';
  ctx.fillText('贴图加载失败!', 10, 30);
};

// ========== 游戏配置 ==========
const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const ACTIONS = {
  walk: { start: 0, frames: 2 },
  jump: { start: 3, frames: 1 },
  crouch: { start: 4, frames: 1 },
  punch: { start: 5, frames: 2 },
  kick: { start: 7, frames: 2 }
};

// ========== 游戏状态 ==========
let currentAction = "walk";
let currentFrame = 0;
let frameCount = 0;
let playerX = 0;
let playerY = 0;
let velocityY = 0;
let isJumping = false;
const keys = {};

// ========== 初始化 ==========
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ========== 输入处理 ==========
// 键盘控制
window.addEventListener("keydown", e => {
  keys[e.key] = true;
  e.preventDefault();
});
window.addEventListener("keyup", e => {
  keys[e.key] = false;
  e.preventDefault();
});

// 触控控制 (移动端核心)
let touchStartX = 0;
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const diff = e.touches[0].clientX - touchStartX;
  keys[diff > 0 ? "ArrowRight" : "ArrowLeft"] = true;
});
canvas.addEventListener('touchend', () => {
  keys.ArrowLeft = false;
  keys.ArrowRight = false;
});

// ========== 游戏逻辑 ==========
function update() {
  // 动画帧更新
  if (++frameCount > 8) {
    currentFrame = (currentFrame + 1) % ACTIONS[currentAction].frames;
    frameCount = 0;
  }

  // 移动处理
  if (keys.ArrowRight) {
    playerX = Math.min(canvas.width - FRAME_WIDTH, playerX + 5);
    currentAction = "walk";
  } else if (keys.ArrowLeft) {
    playerX = Math.max(0, playerX - 5);
    currentAction = "walk";
  }

  // 跳跃处理
  if (keys.ArrowUp && !isJumping) {
    velocityY = -15;
    isJumping = true;
    currentAction = "jump";
  }

  // 其他动作
  if (keys.ArrowDown) currentAction = "crouch";
  if (keys.z) currentAction = "punch";
  if (keys.x) currentAction = "kick";

  // 跳跃物理
  if (isJumping) {
    velocityY += 1;
    playerY += velocityY;
    if (playerY >= canvas.height - 200) {
      playerY = canvas.height - 200;
      isJumping = false;
      velocityY = 0;
      currentAction = "walk";
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制背景
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 绘制地面
  ctx.fillStyle = "#654321";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
  
  // 绘制角色
  if (spriteImage.complete) {
    const sx = (ACTIONS[currentAction].start + currentFrame) * FRAME_WIDTH;
    ctx.drawImage(
      spriteImage,
      sx, 0, FRAME_WIDTH, FRAME_HEIGHT,
      playerX, playerY, FRAME_WIDTH, FRAME_HEIGHT
    );
  }
}

// ========== 游戏循环 ==========
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// ========== 启动游戏 ==========
spriteImage.onload = () => {
  playerX = canvas.width / 2 - FRAME_WIDTH/2; // 初始居中
  gameLoop();
};
