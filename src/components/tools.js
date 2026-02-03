import { showScreen, showToast } from '../main.js';
import { addGardenPoints } from './garden.js';
import { groundingSteps } from '../data/content.js';
import { state, persist } from '../utils/state.js';
import { vibrate } from '../utils/helpers.js';

let timerInterval;
let breathePhaseInterval;
let strategyTimerInterval;

export function initTimerScreen(minutes = 2) {
    if (timerInterval) clearInterval(timerInterval);
    const timerDisplay =
        document.getElementById('timer-display') ||
        document.querySelector('.timer-display');
    if (!timerDisplay) return;

    const doneText = document.querySelector('.timer-done-text');
    if (doneText) doneText.style.opacity = '0';
    const doneOverlay = document.getElementById('timerDone');
    if (doneOverlay) doneOverlay.classList.remove('show');

    const seconds = minutes * 60;
    const m = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerDisplay.textContent = `${m}:${sec.toString().padStart(2, '0')}`;
}

export function startTimer(minutes) {
    let seconds = minutes * 60;
    const timerDisplay =
        document.getElementById('timer-display') ||
        document.querySelector('.timer-display');
    if (!timerDisplay) return;

    if (timerInterval) clearInterval(timerInterval);

    function updateDisplay(s) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        timerDisplay.textContent = `${m}:${sec.toString().padStart(2, '0')}`;
    }

    updateDisplay(seconds);

    timerInterval = setInterval(() => {
        seconds--;
        updateDisplay(seconds);

        if (seconds <= 0) {
            clearInterval(timerInterval);
            addGardenPoints(5);
            showToast('Timer finito!');
            const doneText = document.querySelector('.timer-done-text');
            if (doneText) doneText.style.opacity = '1';
            const doneOverlay = document.getElementById('timerDone');
            if (doneOverlay) doneOverlay.classList.add('show');
        }
    }, 1000);
}

export function startBreathing() {
    const circle = document.querySelector('.breathe-circle');
    const text = document.getElementById('breatheInstruction');
    const counter = document.getElementById('breatheCounter');

    if (!circle || !text || !counter) return;

    text.textContent = "Inspira...";
    circle.className = 'breathe-circle breathing';

    let cycles = 5;
    let phase = 0; // 0 = inhale, 1 = exhale
    counter.textContent = `${cycles} cicli`;
    vibrate(20);

    if (breathePhaseInterval) clearInterval(breathePhaseInterval);

    breathePhaseInterval = setInterval(() => {
        if (cycles <= 0) {
            clearInterval(breathePhaseInterval);
            breathePhaseInterval = null;
            circle.className = 'breathe-circle';
            text.textContent = "Ben fatto!";
            addGardenPoints(5);
            return;
        }

        if (phase === 0) {
            text.textContent = "Espira...";
            vibrate(20);
            phase = 1;
        } else {
            cycles--;
            counter.textContent = `${cycles} cicli`;
            if (cycles <= 0) return;
            text.textContent = "Inspira...";
            vibrate(20);
            phase = 0;
        }
    }, 4000);
}

export function initGrounding() {
    showScreen('groundScreen');
    updateGroundingStep(0);
}

export function updateGroundingStep(index) {
    if (index >= groundingSteps.length) {
        showToast('Esercizio completato! 🌿');
        addGardenPoints(10);
        setTimeout(() => window.goBack(), 1500);
        return;
    }
    const step = groundingSteps[index];
    const container = document.getElementById('grounding-container');
    if (!container) return;

    container.innerHTML = `
        <div class="ground-header">
            <div class="ground-emoji">🌿</div>
            <div class="ground-title">${step.desc}</div>
            <div class="ground-subtitle">Trova e nomina ${step.num} cose</div>
        </div>
        <div class="ground-input-area">
             ${Array(step.num).fill(0).map((_, i) => `
                <input type="text" class="ground-input" placeholder="${step.placeholders[i] || '...'}" />
             `).join('')}
        </div>
        <button class="next-btn" onclick="window.updateGroundingStep(${index + 1})">Fatto</button>
    `;
}

export function stopBreathing() {
    if (breathePhaseInterval) clearInterval(breathePhaseInterval);
    breathePhaseInterval = null;
    const circle = document.querySelector('.breathe-circle');
    if (circle) circle.className = 'breathe-circle';
    const text = document.getElementById('breatheInstruction');
    if (text) text.textContent = 'Pronto?';
    const counter = document.getElementById('breatheCounter');
    if (counter) counter.textContent = '5 cicli';
}

export function resetTimer() {
    const doneText = document.querySelector('.timer-done-text');
    if (doneText) doneText.style.opacity = '0';
    const doneOverlay = document.getElementById('timerDone');
    if (doneOverlay) doneOverlay.classList.remove('show');
    startTimer(2);
}

export function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    const doneText = document.querySelector('.timer-done-text');
    if (doneText) doneText.style.opacity = '0';
    const doneOverlay = document.getElementById('timerDone');
    if (doneOverlay) doneOverlay.classList.remove('show');
}

export function completeTimerReward() {
    if (timerInterval) clearInterval(timerInterval);
    addGardenPoints(5);
    showToast('Ben fatto! +5 punti');
    showScreen('responseScreen');
}

export function saveDump() {
    const text = document.getElementById('dumpTextarea').value;
    if (text.trim()) {
        showToast('Pensieri scaricati con successo! 🗑️');
        document.getElementById('dumpTextarea').value = '';
        addGardenPoints(5);
        showScreen('responseScreen');
    } else {
        showToast('Scrivi qualcosa prima di salvare');
    }
}

export function completeMicroStep() {
    showToast('Grande passo! 🎉');
    addGardenPoints(5);
    showScreen('responseScreen');
}

export function completeChecklist() {
    showToast('Checklist completata! ✅');
    addGardenPoints(5);
    showScreen('responseScreen');
}

export function saveGuidedAnswer() {
    const text = document.getElementById('questionAnswer').value;
    if (text.trim()) {
        showToast('Riflessione salvata. 💭');
        document.getElementById('questionAnswer').value = '';
        addGardenPoints(5);
        showScreen('responseScreen');
    } else {
        showToast('Scrivi qualcosa...');
    }
}

export function executeStrategyFromDetail() {
    const strategyName = state.runtime?.selectedStrategyName;
    const button = document.getElementById('strategyDetailExecute');
    if (strategyTimerInterval) clearInterval(strategyTimerInterval);

    let seconds = 120;
    const label = strategyName ? `In corso: ${strategyName}` : 'In corso';
    showToast(`${label} (2 minuti)`);

    if (button) {
        button.disabled = true;
        button.textContent = 'In corso… 2:00';
    }

    strategyTimerInterval = setInterval(() => {
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = (seconds % 60).toString().padStart(2, '0');
        if (button) button.textContent = `In corso… ${m}:${s}`;

        if (seconds <= 0) {
            clearInterval(strategyTimerInterval);
            strategyTimerInterval = null;
            if (button) {
                button.disabled = false;
                button.textContent = 'Riparti 2 min →';
            }
            showToast('Tempo finito! Valuta la strategia.');
        }
    }, 1000);
}

export function completeStrategyFromDetail() {
    const strategyName = state.runtime?.selectedStrategyName;
    const lastId = state.runtime?.lastHistoryId;
    if (strategyName && lastId) {
        const entry = (state.history || []).find(item => item.id === lastId);
        if (entry) {
            entry.strategyUsed = strategyName;
            entry.strategyCompleted = true;
            persist();
        }
        state.runtime.lastStrategyTitle = strategyName;
    }

    if (strategyTimerInterval) {
        clearInterval(strategyTimerInterval);
        strategyTimerInterval = null;
    }
    const button = document.getElementById('strategyDetailExecute');
    if (button) {
        button.disabled = false;
        button.textContent = 'Inizia →';
    }

    showToast('Strategia completata! ⭐');
    addGardenPoints(10);
    const ratingSection = document.getElementById('strategyRatingSection');
    if (ratingSection) {
        ratingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
