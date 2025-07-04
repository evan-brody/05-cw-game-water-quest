// Game configuration and state variables
const WINNING_SCORE = 20;
const GAME_TIME = 30; // seconds

const winningMessages = [
  "Amazing! You brought clean water to a whole village!",
  "You did it! Every can counts for clean water.",
  "Incredible! You're a water hero!",
  "Victory! Thanks for supporting charity: water."
];

const losingMessages = [
  "Try again! Every can helps bring clean water.",
  "Almost there! Give it another go.",
  "Keep going! Clean water is worth it.",
  "Don't give up! Try collecting more cans."
];

let score = 0;
let timeLeft = GAME_TIME;
let timerInterval = null;
let gameActive = false;

const cansDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const achievements = document.getElementById('achievements');
const startBtn = document.getElementById('start-game');
const grid = document.querySelector('.game-grid');

// Create a responsive 3x3 grid
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// Spawn a can in a random cell
function spawnCan() {
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => cell.innerHTML = '');

  const randomIndex = Math.floor(Math.random() * cells.length);
  const canImg = document.createElement('img');
  canImg.src = 'img/water-can.png';
  canImg.alt = 'Jerry can';
  canImg.className = 'can';
  canImg.tabIndex = 0;

  // Visual feedback on click
  canImg.addEventListener('click', () => {
    if (!gameActive) return;
    score++;
    updateScore(true);
    spawnCan();
  });
  canImg.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && gameActive) {
      score++;
      updateScore(true);
      spawnCan();
    }
  });

  cells[randomIndex].appendChild(canImg);
}

// Update score and provide visual feedback
function updateScore(feedback) {
  cansDisplay.textContent = score;
  if (feedback) {
    cansDisplay.style.background = '#ffe066';
    cansDisplay.style.transition = 'background 0.2s';
    setTimeout(() => {
      cansDisplay.style.background = '';
    }, 200);
  }
}

// Update timer display
function updateTimer() {
  timerDisplay.textContent = timeLeft;
}

// Show end message
function showEndMessage() {
  achievements.style.display = 'block';
  if (score >= WINNING_SCORE) {
    achievements.textContent = winningMessages[Math.floor(Math.random() * winningMessages.length)];
    achievements.className = 'achievement win';
  } else {
    achievements.textContent = losingMessages[Math.floor(Math.random() * losingMessages.length)];
    achievements.className = 'achievement lose';
  }
}

// Start the game
function startGame() {
  if (gameActive) return;
  score = 0;
  timeLeft = GAME_TIME;
  updateScore(false);
  updateTimer();
  achievements.textContent = '';
  achievements.className = 'achievement';
  achievements.style.display = 'none';
  startBtn.disabled = true;
  gameActive = true;
  createGrid();
  spawnCan();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      endGame();
      grid.innerHTML = '';
    }
  }, 1000);
}

// End the game
function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  showEndMessage();
  startBtn.disabled = false;
}

// Responsive: recreate grid on resize
window.addEventListener('resize', () => {
  if (!gameActive) createGrid();
});

// DOMContentLoaded: setup grid and event listeners
document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  startBtn.addEventListener('click', startGame);
});
