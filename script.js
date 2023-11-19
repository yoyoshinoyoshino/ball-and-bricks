const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const canvas1 = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');
const ctx1 = canvas.getContext('2d');
let score = 0;

const brickRowCount = 9;
const brickColumnCount = 15;
const delay = 5000; //delay to reset the game

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height/2 ,
  size: 15,
  speed: 3,
  dx: 2,
  dy: -2,
  visible: true
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height/2 ,
  w: 800,
  h: 10,
  speed:  15,
  dx: 0,
  dy: 0,
  visible: true
  };

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i=i+2) {
  bricks[i] = [];
  for (let j = 1; j < brickColumnCount; j=j+2) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? 'red' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? '#898989' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.beginPath();
  ctx.fillStyle = paddle.visible ? '#000' : 'transparent';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;
  paddle.y += paddle.dy;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
    }
  if (paddle.y + paddle.h > canvas.height) {
      paddle.y = canvas.height - paddle.h;
    }
  
  if (paddle.y < 0) {
      paddle.y = 0;
      }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y&&
    ball.y - ball.size < paddle.y + paddle.h

  ) {
    ball.dy *= -1;
  }

  // Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height||ball.y - ball.size < 0) {
    showAllBricks();
    score = 0;
  }
 
}

// Increase score
function increaseScore() {
  score++;

  if (score === 35) {

      ball.visible = false;
      paddle.visible = false;
      

      //After 0.5 sec restart the game
      setTimeout(function () {
          showAllBricks();
          score = 0;
          paddle.x = canvas.width / 2 - 40;
          paddle.y = canvas.height - 20;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;
          ball.visible = true;
          paddle.visible = true;
      },delay)
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

// Draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
  else if (e.key === 'Up' || e.key === 'ArrowUp') {
    paddle.dy = -paddle.speed;
  }
  else if (e.key === 'Down' || e.key === 'ArrowDown') {
    paddle.dy = paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'||
    e.key === 'Up'||
    e.key === 'Down'||
    e.key === 'ArrowUp'||
    e.key === 'ArrowDown'
  ) {
    paddle.dx = 0;
    paddle.dy = 0;
  }
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
