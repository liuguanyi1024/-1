const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 确保精灵图满足以下条件：
// 1. 所有动作帧水平排列
// 2. 每个帧尺寸严格为 100x100 像素
// 3. 帧顺序：walk(2帧), 空位, jump(1帧), crouch(1帧), punch(2帧), kick(2帧)
const spriteImage = new Image();
spriteImage.src = './stickman_sprite.png'; // 你的精灵图文件名

// 尺寸验证
const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const ACTIONS = {
  walk:   { start: 0, frames: 2 },  // 第0-1帧
  jump:   { start: 3, frames: 1 },  // 第3帧
  crouch: { start: 4, frames: 1 },  // 第4帧
  punch:  { start: 5, frames: 2 },  // 第5-6帧
  kick:   { start: 7, frames: 2 }   // 第7-8帧
};

// 调试用 - 显示精灵图实际尺寸
spriteImage.onload = function() {
  console.log(`精灵图尺寸: ${this.width}px x ${this.height}px`);
  if (this.width < 900) { // 至少需要9帧宽度（9x100=900）
    alert('精灵图宽度不足！最小需要900像素宽度');
  }
};

// 初始化画布
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  playerY = canvas.height - 200;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 游戏状态
let currentAction = "walk";
let currentFrame = 0;
let frameCount = 0;
let playerX = canvas.width/2 - 50; // 居中
let playerY = 0;
let velocityY = 0;
let isJumping = false;
const keys = {};

// 输入控制（保持原有键盘+触控逻辑）

// 核心绘制函数（修改适配精灵图）
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制背景
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#654321";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

  // 精灵图绘制（关键部分）
  if (spriteImage.complete) {
    const action = ACTIONS[currentAction];
    const sx = (action.start + currentFrame) * FRAME_WIDTH;
    
    // 调试边框（正式发布可移除）
    ctx.strokeStyle = 'rgba(255,0,0,0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, 0, FRAME_WIDTH, FRAME_HEIGHT); // 显示截取区域
    
    ctx.drawImage(
      spriteImage,
      sx, 0,                  // 源图像起始坐标
      FRAME_WIDTH, FRAME_HEIGHT, // 截取尺寸
      playerX, playerY,       // 画布位置
      FRAME_WIDTH, FRAME_HEIGHT
    );
  }
}

// 游戏循环
function update() {
  frameCount++;
  if (frameCount > 10) {
    currentFrame = (currentFrame + 1) % ACTIONS[currentAction].frames;
    frameCount = 0;
  }

  // 保持原有移动逻辑
  // ...
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 启动游戏
spriteImage.onload = () => {
  playerY = canvas.height - 200;
  gameLoop();
};
