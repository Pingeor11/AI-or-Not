const SESSION_SIZE = 10;

let allQuestions = [];
let questions = [];
let order = [];
let idx = 0;
let score = 0;
let streak = 0;
let locked = false;

const elRound = document.getElementById("round");
const elTotal = document.getElementById("total");
const elScore = document.getElementById("score");
const elStreak = document.getElementById("streak");
const contentArea = document.getElementById("contentArea");
const feedback = document.getElementById("feedback");
const btnAI = document.getElementById("btnAI");
const btnNot = document.getElementById("btnNot");
const btnRestart = document.getElementById("btnRestart");

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateStats() {
  elRound.textContent = Math.min(idx + 1, questions.length);
  elTotal.textContent = questions.length;
  elScore.textContent = score;
  elStreak.textContent = streak;
}

function setFeedback(message, type = "") {
  feedback.classList.remove("good", "bad");
  if (type) feedback.classList.add(type);
  feedback.textContent = message;
}

function renderImage(path) {
  contentArea.innerHTML = "";
  const img = document.createElement("img");
  img.src = path;
  img.className = "prompt-image";
  contentArea.appendChild(img);
}

function fadeToNext(callback) {
  contentArea.classList.add("fade-out");
  setTimeout(() => {
    callback();
    contentArea.classList.remove("fade-out");
  }, 400);
}

function renderCurrent() {
  if (idx >= questions.length) {
    contentArea.innerHTML = `<h2>Session Complete! Score: ${score}/${questions.length}</h2>`;
    btnAI.disabled = true;
    btnNot.disabled = true;
    return;
  }

  locked = false;
  btnAI.disabled = false;
  btnNot.disabled = false;

  const q = questions[order[idx]];
  renderImage(q.content);
  setFeedback("Make your guess.");
  updateStats();
}

function startSession() {
  questions = shuffle(allQuestions).slice(0, SESSION_SIZE);
  order = shuffle([...Array(questions.length).keys()]);
  idx = 0;
  score = 0;
  streak = 0;
  renderCurrent();
}

function handleGuess(guess) {
  if (locked) return;
  locked = true;

  btnAI.disabled = true;
  btnNot.disabled = true;

  const q = questions[order[idx]];
  const correct = q.answer === guess;

  if (correct) {
    score++;
    streak++;
    setFeedback("Correct!", "good");
  } else {
    streak = 0;
    setFeedback("Wrong!", "bad");
  }

  updateStats();

  setTimeout(() => {
    fadeToNext(() => {
      idx++;
      renderCurrent();
    });
  }, 1100);
}

btnAI.onclick = () => handleGuess("ai");
btnNot.onclick = () => handleGuess("not");
btnRestart.onclick = () => startSession();

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    allQuestions = data;
    startSession();
  })
  .catch(err => {
    contentArea.innerHTML = "Error loading questions.json";
    console.error(err);
  });
