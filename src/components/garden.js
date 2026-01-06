// Garden gamification component
import { state } from '../utils/state.js';
import { saveState } from '../utils/storage.js';
import { showToast } from '../utils/helpers.js';

// Garden Level Functions
export function getGardenLevel(points) {
  if (points >= 500) return 5;
  if (points >= 201) return 4;
  if (points >= 101) return 3;
  if (points >= 51) return 2;
  if (points >= 21) return 1;
  return 0;
}

export function getGardenEmoji(level, withered) {
  const emojis = ['🌱', '🌿', '🪴', '🌳', '🌲', '🌸'];
  if (withered && level > 0) return '🍂';
  return emojis[level] || '🌱';
}

export function getGardenName(level) {
  const names = ['Germoglio', 'Piantina', 'Pianta giovane', 'Albero', 'Albero maestoso', 'Albero fiorito'];
  return names[level] || 'Germoglio';
}

// Garden Decay System
export function checkGardenDecay() {
  // Check if pause has expired
  if (state.garden.isPaused && state.garden.pauseUntil) {
    if (new Date() >= new Date(state.garden.pauseUntil)) {
      state.garden.isPaused = false;
      state.garden.pauseUntil = null;
      saveState();
    }
  }

  if (state.garden.isPaused) return false;
  if (!state.garden.lastActivityDate) return false;

  const now = new Date();
  const lastActivity = new Date(state.garden.lastActivityDate);
  const hoursSince = (now - lastActivity) / (1000 * 60 * 60);

  // After 72 hours (3 days), start losing levels
  if (hoursSince >= 72) {
    const daysPassed = Math.floor(hoursSince / 24);
    const levelsToLose = Math.min(2, Math.floor((daysPassed - 3) / 3) + 1);
    const currentLevel = getGardenLevel(state.garden.points);

    if (levelsToLose > 0 && currentLevel > 0) {
      const targetLevel = Math.max(0, currentLevel - levelsToLose);
      const levelPoints = [0, 21, 51, 101, 201, 500];
      state.garden.points = Math.max(levelPoints[targetLevel], 0);
      state.garden.level = targetLevel;
      saveState();
      return true; // Indicates decay happened
    }
  }

  return hoursSince >= 24; // Returns true if withered (>24h)
}

// Garden Points System
export function addGardenPoints(points, activityName) {
  checkGardenDecay();

  const wasWithered = state.garden.lastActivityDate &&
    (new Date() - new Date(state.garden.lastActivityDate)) / (1000 * 60 * 60) >= 24;

  const oldLevel = getGardenLevel(state.garden.points);
  state.garden.points += points;
  state.garden.lastActivityDate = new Date().toISOString();

  const newLevel = getGardenLevel(state.garden.points);
  state.garden.level = newLevel;

  saveState();
  updateGardenBadge();

  // Show appropriate toast
  let message = '';
  if (wasWithered) {
    message = '🌱 Pianta riannaffiata! +' + points + ' punti';
    showToast(message);
    setTimeout(() => showToast('💚 Bonus recupero: +50% punti per 24h!'), 1500);
  } else if (newLevel > oldLevel) {
    message = '🎉 LIVELLO ' + newLevel + '! ' + getGardenName(newLevel) + ' (+' + points + ' pt)';
    showToast(message);
  } else {
    message = '✨ +' + points + ' punti! ' + getGardenEmoji(newLevel, false) + ' ' + state.garden.points + ' pt';
    showToast(message);
  }
}

// Garden Pause System
export function pauseGarden(days) {
  state.garden.isPaused = true;
  const until = new Date();
  until.setDate(until.getDate() + days);
  state.garden.pauseUntil = until.toISOString();
  saveState();
  updateGardenBadge();
  showToast('🌙 Pianta in pausa per ' + days + ' giorni');
}

export function resumeGarden() {
  state.garden.isPaused = false;
  state.garden.pauseUntil = null;
  saveState();
  updateGardenBadge();
  showToast('🌱 Pausa terminata! Bentornato!');
}

// UI Update Functions
export function updateGardenBadge() {
  updateMainButton();
}

export function updateMainButton() {
  const emojiEl = document.getElementById('mainGardenEmoji');
  const levelEl = document.getElementById('mainGardenLevel');
  const pointsEl = document.getElementById('mainGardenPoints');
  const progressEl = document.getElementById('mainGardenProgressFill');
  const pauseBtn = document.getElementById('gardenPauseBtn');

  if (!emojiEl || !levelEl || !pointsEl || !pauseBtn) return;

  const isWithered = checkGardenDecay();
  const level = getGardenLevel(state.garden.points);
  const emoji = getGardenEmoji(level, isWithered && !state.garden.isPaused);
  const name = getGardenName(level);
  const points = state.garden.points;

  const levelPoints = [0, 21, 51, 101, 201, 500];
  const nextLevel = Math.min(level + 1, 5);
  const pointsToNext = levelPoints[nextLevel];
  const prevLevelPoints = levelPoints[level];
  const progressInLevel = points - prevLevelPoints;
  const pointsNeededForLevel = pointsToNext - prevLevelPoints;
  const progressPercent = level >= 5 ? 100 : Math.min(100, (progressInLevel / pointsNeededForLevel) * 100);

  emojiEl.textContent = emoji;
  levelEl.textContent = 'Lv ' + level + ' • ' + name;
  pointsEl.textContent = level >= 5
    ? points + ' punti • Livello massimo!'
    : points + ' / ' + pointsToNext + ' punti al prossimo livello';

  if (progressEl) progressEl.style.width = progressPercent + '%';

  // Update pause button
  if (state.garden.isPaused) {
    pauseBtn.textContent = '▶️';
    pauseBtn.onclick = (e) => {
      e.stopPropagation();
      resumeGarden();
    };
  } else {
    pauseBtn.textContent = '⏸️';
    pauseBtn.onclick = (e) => {
      e.stopPropagation();
      showGardenPauseModal();
    };
  }
}

export function showGardenPauseModal() {
  if (confirm('Vuoi mettere in pausa il giardino?\n\nLa tua pianta non appassirà per 7 giorni.\nUtile quando hai bisogno di una pausa dall\'app.')) {
    pauseGarden(7);
  }
}
