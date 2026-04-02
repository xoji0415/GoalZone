// ===== NAVIGATION =====
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const links = {'home':0,'quiz':1,'games':2,'leaderboard':3};
  document.querySelectorAll('.nav-link')[links[id]]?.classList.add('active');
  window.scrollTo(0,0);
  if (id === 'leaderboard') loadLeaderboard();
  if (id === 'games') { initPenalty(); initMemory(); initGuessGame(); }
}

function toggleNav() {
  document.getElementById('nav-overlay').classList.toggle('hidden');
  document.getElementById('mobile-menu').classList.toggle('hidden');
}

// ===== FACT =====
async function loadFact() {
  try {
    const res = await fetch('/api/fact');
    const data = await res.json();
    document.getElementById('daily-fact').textContent = data.fact;
  } catch { document.getElementById('daily-fact').textContent = "⚽ Futbol — dunyoning eng mashhur sporti!"; }
}

// ===== QUIZ =====
let quizQuestions = [], currentQ = 0, score = 0, totalQ = 10, timerInterval, playerName = '';

function selectCount(btn, count) {
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  totalQ = count;
}

async function startQuiz() {
  playerName = document.getElementById('player-name').value.trim() || 'Futbolchi';
  try {
    const res = await fetch(`/api/questions?count=${totalQ}`);
    quizQuestions = await res.json();
  } catch { alert("Savollar yuklanmadi. Qayta urinib ko'ring."); return; }
  currentQ = 0; score = 0;
  document.getElementById('quiz-start').classList.add('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-game').classList.remove('hidden');
  document.getElementById('q-total').textContent = quizQuestions.length;
  showQuestion();
}

function showQuestion() {
  if (currentQ >= quizQuestions.length) { endQuiz(); return; }
  const q = quizQuestions[currentQ];
  document.getElementById('q-current').textContent = currentQ + 1;
  document.getElementById('live-score').textContent = score;
  document.getElementById('question-text').textContent = q.question;
  document.getElementById('fact-box').classList.add('hidden');
  
  const pct = (currentQ / quizQuestions.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i, q);
    grid.appendChild(btn);
  });
  startTimer();
}

let timeLeft = 20;
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 20;
  document.getElementById('timer-fill').style.width = '100%';
  document.getElementById('timer-fill').style.background = '#f5c518';
  timerInterval = setInterval(() => {
    timeLeft--;
    const pct = (timeLeft / 20) * 100;
    document.getElementById('timer-fill').style.width = pct + '%';
    if (timeLeft <= 5) document.getElementById('timer-fill').style.background = '#ef4444';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      selectAnswer(-1, quizQuestions[currentQ]);
    }
  }, 1000);
}

function selectAnswer(chosen, q) {
  clearInterval(timerInterval);
  document.getElementById('timer-fill').style.width = '0%';
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => b.disabled = true);

  if (chosen === q.answer) {
    score++;
    btns[chosen].classList.add('correct');
    document.getElementById('live-score').textContent = score;
  } else {
    if (chosen >= 0) btns[chosen].classList.add('wrong');
    btns[q.answer].classList.add('correct');
  }

  document.getElementById('fact-text').textContent = q.fact;
  document.getElementById('fact-box').classList.remove('hidden');
  currentQ++;
}

function nextQuestion() { showQuestion(); }

async function endQuiz() {
  document.getElementById('quiz-game').classList.add('hidden');
  document.getElementById('quiz-result').classList.remove('hidden');
  
  const pct = score / quizQuestions.length;
  let emoji, title;
  if (pct === 1) { emoji = '🏆'; title = 'Mukammal! Afsonaviy!'; }
  else if (pct >= 0.8) { emoji = '⭐'; title = 'Zo\'r! Futbol bilimdonisiz!'; }
  else if (pct >= 0.6) { emoji = '👏'; title = 'Yaxshi! Davom eting!'; }
  else if (pct >= 0.4) { emoji = '💪'; title = 'Unchalik emas... Ko\'proq o\'qing!'; }
  else { emoji = '😅'; title = 'Futbol ko\'proq ko\'ring!'; }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-score-num').textContent = score;
  document.getElementById('result-total').textContent = quizQuestions.length;

  const stars = Math.round(pct * 5);
  document.getElementById('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(5 - stars);

  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: playerName, score: `${score}/${quizQuestions.length}` })
    });
  } catch {}
}

function restartQuiz() {
  document.getElementById('quiz-game').classList.add('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-start').classList.remove('hidden');
}

// ===== PENALTY GAME =====
let shots = 0, goals = 0, penaltyDone = false;

function initPenalty() {
  shots = 0; goals = 0; penaltyDone = false;
  document.getElementById('shots-taken').textContent = 0;
  document.getElementById('goals-scored').textContent = 0;
  document.getElementById('penalty-msg').textContent = "Darvozaning bir burchagini tanlang!";
  document.getElementById('penalty-dots').innerHTML = '';
  document.getElementById('penalty-restart').classList.add('hidden');
  document.querySelectorAll('.gz').forEach(gz => {
    gz.classList.remove('goal-flash', 'save-flash');
    gz.style.pointerEvents = 'auto';
  });
}

function shoot(zone) {
  if (penaltyDone || shots >= 5) return;
  const saved = Math.random() < 0.35;
  const gz = document.querySelectorAll('.gz')[zone];

  shots++;
  document.getElementById('shots-taken').textContent = shots;

  const dot = document.createElement('div');
  dot.className = 'dot';

  if (!saved) {
    goals++;
    gz.classList.add('goal-flash');
    document.getElementById('goals-scored').textContent = goals;
    document.getElementById('penalty-msg').textContent = "⚽ GOL! Zo'r zarba!";
    dot.classList.add('goal');
  } else {
    gz.classList.add('save-flash');
    document.getElementById('penalty-msg').textContent = "🧤 Darvozabon ushlab qoldi!";
    dot.classList.add('miss');
  }
  document.getElementById('penalty-dots').appendChild(dot);

  setTimeout(() => {
    gz.classList.remove('goal-flash', 'save-flash');
    if (shots >= 5) {
      penaltyDone = true;
      document.querySelectorAll('.gz').forEach(g => g.style.pointerEvents = 'none');
      const msg = goals >= 4 ? `🏆 ${goals}/5 — Penalti ustasiz!` :
                  goals >= 3 ? `👏 ${goals}/5 — Yaxshi natija!` :
                  goals >= 2 ? `😅 ${goals}/5 — Ko'proq mashq qiling!` :
                               `😬 ${goals}/5 — Darvozabon yutdi!`;
      document.getElementById('penalty-msg').textContent = msg;
      document.getElementById('penalty-restart').classList.remove('hidden');
    } else {
      document.getElementById('penalty-msg').textContent = "Darvozaning bir burchagini tanlang!";
    }
  }, 800);
}

function startPenaltyGame() { showSection('games'); }

// ===== MEMORY GAME =====
const CLUBS = [
  {name:'Real Madrid', emoji:'⚪'}, {name:'Barcelona', emoji:'🔵'},
  {name:'Bayern', emoji:'🔴'}, {name:'Liverpool', emoji:'❤️'},
  {name:'Juventus', emoji:'⬛'}, {name:'PSG', emoji:'🟦'},
  {name:'Chelsea', emoji:'💙'}, {name:'ManCity', emoji:'🩵'},
];
let memCards = [], flipped = [], matchedPairs = 0, memMoves = 0, memLock = false;

function initMemory() {
  matchedPairs = 0; memMoves = 0; flipped = []; memLock = false;
  document.getElementById('pairs-found').textContent = 0;
  document.getElementById('memory-moves').textContent = 0;
  document.getElementById('memory-win').classList.add('hidden');
  
  const pairs = [...CLUBS, ...CLUBS].sort(() => Math.random() - 0.5);
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  
  pairs.forEach((club, i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.club = club.name;
    card.dataset.idx = i;
    card.innerHTML = `<span class="mem-card-front">⚽</span><span class="mem-card-back">${club.emoji}<br><small style="font-size:0.5rem;font-weight:800">${club.name}</small></span>`;
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (memLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  flipped.push(card);
  if (flipped.length === 2) {
    memLock = true; memMoves++;
    document.getElementById('memory-moves').textContent = memMoves;
    if (flipped[0].dataset.club === flipped[1].dataset.club) {
      flipped.forEach(c => c.classList.add('matched'));
      flipped = []; memLock = false;
      matchedPairs++;
      document.getElementById('pairs-found').textContent = matchedPairs;
      if (matchedPairs === 8) {
        document.getElementById('win-moves').textContent = memMoves;
        document.getElementById('memory-win').classList.remove('hidden');
      }
    } else {
      setTimeout(() => {
        flipped.forEach(c => c.classList.remove('flipped'));
        flipped = []; memLock = false;
      }, 900);
    }
  }
}

function startMemoryGame() { showSection('games'); switchGame('memory', document.querySelectorAll('.game-tab')[1]); }

// ===== GUESS THE NUMBER GAME =====
const PLAYERS = [
  {name: 'Cristiano Ronaldo', number: 7, clues: ['Portugalliyalik', 'Manchester United afsonasi', 'CR7 laqabi bor']},
  {name: 'Lionel Messi', number: 10, clues: ['Argentinalik', 'Barcelona afsonasi', '8 marta Ballon d\'Or']},
  {name: 'Pelé', number: 10, clues: ['Braziliyalik', '3 marta jahon chempioni', '"Futbol qiroli"']},
  {name: 'Neymar Jr', number: 10, clues: ['Braziliyalik', 'PSG o\'yinchisi', 'Bungee kabi dribbling']},
  {name: 'Kylian Mbappé', number: 7, clues: ['Fransuzlik', 'Real Madrid yulduz', 'Tez yuguruvchi']},
  {name: 'Erling Haaland', number: 9, clues: ['Norvegiyalik', 'Manchester City bombardiri', 'Mashinadek yuguradi']},
  {name: 'Robert Lewandowski', number: 9, clues: ['Polyakalik', 'Barcelona hujumchisi', 'Goller qiroli']},
  {name: 'Mohamed Salah', number: 11, clues: ['Misrlik', 'Liverpool yulduzi', '"Misr falkonı"']},
];

let currentPlayer = null, guessAttempts = 0, clueIndex = 0;

function initGuessGame() {
  currentPlayer = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
  guessAttempts = 0; clueIndex = 0;
  document.getElementById('guess-input').value = '';
  document.getElementById('guess-feedback').textContent = '';
  document.getElementById('guess-attempts').textContent = '0';
  document.getElementById('guess-clue').textContent = `Ip: ${currentPlayer.clues[0]}`;
}

function checkGuess() {
  if (!currentPlayer) return;
  const val = parseInt(document.getElementById('guess-input').value);
  if (!val || val < 1 || val > 99) { 
    document.getElementById('guess-feedback').textContent = '⚠️ 1 dan 99 gacha raqam kiriting!';
    document.getElementById('guess-feedback').style.color = '#f5c518';
    return;
  }
  guessAttempts++;
  document.getElementById('guess-attempts').textContent = guessAttempts;
  document.getElementById('guess-input').value = '';

  if (val === currentPlayer.number) {
    document.getElementById('guess-feedback').textContent = `🎉 To'g'ri! ${currentPlayer.name} — #${currentPlayer.number}`;
    document.getElementById('guess-feedback').style.color = '#00e676';
    document.getElementById('guess-clue').textContent = `✅ ${currentPlayer.name} topildi! ${guessAttempts} urinishda!`;
  } else if (guessAttempts >= 5) {
    document.getElementById('guess-feedback').textContent = `😔 Yutqazdingiz. Bu ${currentPlayer.name} — #${currentPlayer.number}`;
    document.getElementById('guess-feedback').style.color = '#ef4444';
  } else {
    if (val < currentPlayer.number) document.getElementById('guess-feedback').textContent = '📈 Kattaroq raqam!';
    else document.getElementById('guess-feedback').textContent = '📉 Kichikroq raqam!';
    document.getElementById('guess-feedback').style.color = '#f5c518';
    clueIndex = Math.min(clueIndex + 1, currentPlayer.clues.length - 1);
    document.getElementById('guess-clue').textContent = `Ip: ${currentPlayer.clues[clueIndex]}`;
  }
}

// ===== GAME TABS =====
function switchGame(game, btn) {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById('game-' + game).classList.remove('hidden');
  document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  if (game === 'penalty') initPenalty();
  if (game === 'memory') initMemory();
  if (game === 'guess') initGuessGame();
}

// ===== LEADERBOARD =====
async function loadLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    const container = document.getElementById('lb-rows');
    if (!data.length) {
      container.innerHTML = '<div class="lb-empty">Hali rekord yo\'q. Birinchi bo\'l! 🚀</div>';
      return;
    }
    const medals = ['🥇','🥈','🥉'];
    container.innerHTML = data.map((d, i) => `
      <div class="lb-row">
        <span class="lb-rank">${medals[i] || (i+1)}</span>
        <span>${d.name}</span>
        <span class="lb-score">${d.score}</span>
      </div>
    `).join('');
  } catch {}
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadFact();
  initPenalty();
  initMemory();
  initGuessGame();
  
  document.getElementById('guess-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkGuess();
  });
});
