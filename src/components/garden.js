import { state, persist } from '../utils/state.js';

const LEVELS = [0, 200, 500, 900, 1400, 2000, 2700];
const LEVEL_LABELS = [
    'Germoglio',
    'Piantina',
    'Pianta',
    'Albero',
    'Bosco',
    'Foresta',
    'Giardino'
];
const POINTS_MULTIPLIER = 0.25;

export function addGardenPoints(amount) {
    const scaled = Math.max(1, Math.round(amount * POINTS_MULTIPLIER));
    state.garden.points += scaled;
    persist();
    checkLevelUp();
    updateGardenBadge();

    // Visual feedback
    const badge = document.getElementById('garden-badge') || document.querySelector('.garden-badge');
    if (badge) {
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
}

export function checkLevelUp() {
    const points = state.garden.points;
    let newLevel = 1;

    for (let i = 0; i < LEVELS.length; i++) {
        if (points >= LEVELS[i]) newLevel = i + 1;
    }

    if (newLevel > state.garden.level) {
        state.garden.level = newLevel;
        persist();
        import('../main.js').then(m => m.showToast(`🎉 Level Up! Sei al livello ${newLevel}!`));
    }
}

export function updateGardenBadge() {
    const levelSpan = document.getElementById('garden-level-display') || document.getElementById('gardenLevelDisplay');
    const pointsSpan = document.getElementById('garden-points-display') || document.getElementById('gardenPointsDisplay');
    const emojiSpan = document.getElementById('garden-emoji-display') || document.getElementById('gardenEmojiDisplay');

    if (levelSpan) {
        if (levelSpan.dataset.garden === 'home') {
            const label = LEVEL_LABELS[Math.min(state.garden.level - 1, LEVEL_LABELS.length - 1)];
            levelSpan.textContent = `Lv ${state.garden.level} • ${label}`;
        } else {
            levelSpan.textContent = `Lvl ${state.garden.level}`;
        }
    }

    if (pointsSpan) {
        if (pointsSpan.dataset.garden === 'home') {
            const nextTarget = LEVELS[state.garden.level] ?? null;
            if (nextTarget) {
                pointsSpan.textContent = `${state.garden.points} / ${nextTarget} punti al prossimo livello`;
            } else {
                pointsSpan.textContent = 'Livello massimo';
            }
        } else {
            pointsSpan.textContent = `${state.garden.points}`;
        }
    }

    const plants = ['🌱', '🌿', '🪴', '🌳', '🌲', '🌴', '🏞️'];
    if (emojiSpan) emojiSpan.textContent = plants[Math.min(state.garden.level - 1, plants.length - 1)];

    const progressFill = document.getElementById('gardenProgressFill');
    if (progressFill) {
        const levelIndex = Math.max(0, state.garden.level - 1);
        const currentBase = LEVELS[levelIndex] || 0;
        const nextTarget = LEVELS[levelIndex + 1] || currentBase;
        const range = Math.max(1, nextTarget - currentBase);
        const progress = Math.min(1, Math.max(0, (state.garden.points - currentBase) / range));
        progressFill.style.width = `${Math.round(progress * 100)}%`;
    }
}
