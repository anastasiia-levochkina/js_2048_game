'use strict';

const game = new window.Game();

const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const gameFieldElement = document.querySelector('.game-field');
const loseMessageElement = document.querySelector('.message-lose');
const winMessageElement = document.querySelector('.message-win');
const startMessageElement = document.querySelector('.message-start');
const cells = [...document.querySelectorAll('.field-cell')];

const HIDDEN_CLASS = 'hidden';
const CELL_BASE_CLASS = 'field-cell';
const CELL_VALUE_CLASS_PREFIX = 'field-cell--';

function getCellIndex(row, col) {
  return row * 4 + col;
}

function hideAllMessages() {
  loseMessageElement.classList.add(HIDDEN_CLASS);
  winMessageElement.classList.add(HIDDEN_CLASS);
  startMessageElement.classList.add(HIDDEN_CLASS);
}

function updateMessages(gameStatus) {
  hideAllMessages();

  if (gameStatus === window.Game.STATUS_IDLE) {
    startMessageElement.classList.remove(HIDDEN_CLASS);
  }

  if (gameStatus === window.Game.STATUS_WIN) {
    winMessageElement.classList.remove(HIDDEN_CLASS);
  }

  if (gameStatus === window.Game.STATUS_LOSE) {
    loseMessageElement.classList.remove(HIDDEN_CLASS);
  }
}

function updateButton(gameStatus) {
  if (gameStatus === window.Game.STATUS_IDLE) {
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');

    return;
  }

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

function renderBoard(previousState = null) {
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = getCellIndex(row, col);
      const cell = cells[index];
      const value = state[row][col];

      cell.className = CELL_BASE_CLASS;
      cell.textContent = value ? String(value) : '';

      if (value) {
        cell.classList.add(`${CELL_VALUE_CLASS_PREFIX}${value}`);
      }

      if (previousState && previousState[row][col] === 0 && value !== 0) {
        cell.classList.add('tile-new');
      }
    }
  }
}

function render(previousState = null) {
  const gameStatus = game.getStatus();

  renderBoard(previousState);
  scoreElement.textContent = String(game.getScore());
  updateMessages(gameStatus);
  updateButton(gameStatus);
}

function handleMove(keyboardEvent) {
  if (game.getStatus() !== window.Game.STATUS_PLAYING) {
    return;
  }

  const handlersByKey = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };
  const move = handlersByKey[keyboardEvent.key];

  if (!move) {
    return;
  }

  keyboardEvent.preventDefault();

  const previousState = game.getState();
  const isMoved = move();

  if (!isMoved) {
    return;
  }

  render(previousState);
}

function handleStartButtonClick() {
  if (game.getStatus() === window.Game.STATUS_IDLE) {
    game.start();
  } else {
    game.restart();
    gameFieldElement.classList.remove('shake');
  }

  render();
}

startButton.addEventListener('click', handleStartButtonClick);
document.addEventListener('keydown', handleMove);

render();
