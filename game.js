const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 18;
const PLAYER_X = 24;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;

// Paddle and ball objects
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    vx: Math.random() > 0.5 ? 4 : -4,
    vy: (Math.random() - 0.5) * 6
};

// Mouse control for player paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
    // Background
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = '#f51';
    ctx.beginPath();
    ctx.arc(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Ball movement and collision logic
function update() {
    // Ball physics
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top/bottom wall collision
    if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
        ball.vy *= -1;
        ball.y = Math.max(0, Math.min(canvas.height - BALL_SIZE, ball.y));
    }

    // Paddle collision: Player
    if (
        ball.x <= PLAYER_X + PADDLE_WIDTH &&
        ball.x >= PLAYER_X &&
        ball.y + BALL_SIZE > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.vx = Math.abs(ball.vx);
        // Add a bit of randomness
        ball.vy += ((ball.y + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2)) * 0.25;
    }

    // Paddle collision: AI
    if (
        ball.x + BALL_SIZE >= AI_X &&
        ball.x + BALL_SIZE <= AI_X + PADDLE_WIDTH &&
        ball.y + BALL_SIZE > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.vx = -Math.abs(ball.vx);
        ball.vy += ((ball.y + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2)) * 0.25;
    }

    // Left/right wall (score)
    if (ball.x < 0 || ball.x > canvas.width) {
        // Reset ball to center
        ball.x = canvas.width / 2 - BALL_SIZE / 2;
        ball.y = canvas.height / 2 - BALL_SIZE / 2;
        ball.vx = (Math.random() > 0.5 ? 4 : -4);
        ball.vy = (Math.random() - 0.5) * 6;
    }

    // AI Paddle movement (simple tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ball.y + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += 5;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= 5;
    }
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Main game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();