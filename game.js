const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 初始化画布尺寸
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // 保持角色在地面位置
  playerY = canvas.height - 200;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 游戏变量
const spriteImage = new Image();
spriteImage.src = './images/stickman_sprite.png';

// 图片加载失败处理
spriteImage.onerror = function() {
  console.error('Sprite image failed to load!');
  // 简单替代图形
  ctx.fillStyle = 'red';
  ctx.fillRect(playerX, playerY, 50, 100);
};

const frameWidth = 100;
const frameHeight = 100;
const actions = {
  walk: { start: 0, frames: 2 },
  jump: { start: 3, frames: 1 },
  crouch: { start: 4, frames: 1 },
  punch: { start: 5, frames: 2 },
  kick: { start: 7, frames: 2 }
};

let currentAction = "walk";
let currentFrame = 0;
let frameCount = 0;
let playerX = canvas.width / 2;
let playerY = canvas.height - 200;
let velocityY = 0;
let isJumping = false;

// 输入处理（键盘+触控）
const keys = {};

// 键盘事件
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  e.preventDefault(); // 防止滚动
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
  e.preventDefault();
});

// 触控事件处理
let touchStartX = 0;
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touchX = e.touches[0].clientX;
  const diff = touchX - touchStartX;
  
  if (Math.abs(diff) > 10) {
    keys[diff > 0 ? "ArrowRight" : "ArrowLeft"] = true;
  }
});
canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  keys["ArrowRight"] = false;
  keys["ArrowLeft"] = false;
});

// 绘制函数
function drawStickman(action, x, y) {
  if (spriteImage.complete) {
    const { start, frames } = actions[action];
    const sx = (start + currentFrame) * frameWidth;
    ctx.drawImage(
      spriteImage,
      sx, 0, frameWidth, frameHeight,
      x, y, frameWidth, frameHeight
    );
  }
}

// 游戏逻辑更新
function update() {
  frameCount++;
  if (frameCount > 10) {
    currentFrame = (currentFrame + 1) % actions[currentAction].frames;
    frameCount = 0;
  }

  // 移动处理
  if (keys["ArrowRight"]) {
    playerX = Math.min(canvas.width - frameWidth, playerX + 5);
    currentAction = "walk";
  } else if (keys["ArrowLeft"]) {
    playerX = Math.max(0, playerX - 5);
    currentAction = "walk";
  }

  // 跳跃处理
  if (keys["ArrowUp"] && !isJumping) {
    velocityY = -15;
    isJumping = true;
    currentAction = "jump";
  }

  // 下蹲/攻击
  if (keys["ArrowDown"]) currentAction = "crouch";
  if (keys["z"]) currentAction = "punch";
  if (keys["x"]) currentAction = "kick";

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

// 渲染函数
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 背景
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 地面
  ctx.fillStyle = "#654321";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
  
  // 角色
  drawStickman(currentAction, playerX, playerY);
}

// 优化游戏循环
let lastTime = 0;
const frameDelay = 1000/12; // 约12fps
function gameLoop(timestamp) {
  if (timestamp - lastTime > frameDelay) {
    update();
    render();
    lastTime = timestamp;
  }
  requestAnimationFrame(gameLoop);
}

// 启动游戏
spriteImage.onload = () => {
  gameLoop(0);
};
