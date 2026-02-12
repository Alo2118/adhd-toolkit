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
        <div class="anchor-step-card">
            <div class="anchor-step-badge">Trova e nomina ${step.num} cose</div>
            <div class="anchor-step-emoji">🌿</div>
            <div class="anchor-step-title">${step.desc}</div>
            <div class="ground-input-area">
                 ${Array(step.num).fill(0).map((_, i) => `
                    <input type="text" class="ground-input" placeholder="${step.placeholders[i] || '...'}" />
                 `).join('')}
            </div>
            <button class="next-btn" onclick="window.updateGroundingStep(${index + 1})">Fatto →</button>
        </div>
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

// Strategie che hanno senso con un timer (attesa, esecuzione cronometrata)
const TIMED_STRATEGIES = new Set([
    'Pomodoro modificato', 'Chunk down', 'Time-box sociale', 'Sprint competitivo',
    'Sfida impossibile', 'Power pose', 'Box breathing', 'Body doubling virtuale',
    'Pomodoro da 10', 'Sprint 10 min', 'Timer di decisione', 'Phone time-box',
    'Power nap 20min', 'Focus su uno', 'Corpo prima', 'Regola dei 2 minuti',
    'Doccia fredda mentale', 'Break sensoriale', 'Buffer 5 minuti', 'Pausa buffer',
    'Deadline artificiali', 'Boss Fight Mode', 'Recovery time', 'Time-box',
    'Timer 2 minuti', 'Respira con me'
]);

function isTimedStrategy(name) {
    if (!name) return true; // Fallback: se non conosciamo la strategia, mostra timer
    return TIMED_STRATEGIES.has(name);
}

export function executeStrategyFromDetail() {
    const strategyName = state.runtime?.selectedStrategyName;
    const button = document.getElementById('strategyDetailExecute');
    if (strategyTimerInterval) clearInterval(strategyTimerInterval);

    // Check if strategy has a dedicated tool
    const mapping = strategyToolMap[strategyName];
    if (mapping) {
        if (!state.runtime) state.runtime = {};
        // Apply setup config based on tool type
        if (mapping.screen === 'bodyMoveScreen') state.runtime.bodyMoveType = mapping.setup || 'jumpingJacks';
        if (mapping.screen === 'sensoryScreen') state.runtime.sensoryType = mapping.setup || 'setup';
        showScreen(mapping.screen);
        return;
    }

    // Strategie senza timer: segna come "in corso" senza conto alla rovescia
    if (!isTimedStrategy(strategyName)) {
        const label = strategyName ? `Inizia: ${strategyName}` : 'Inizia';
        showToast(`${label} — fai con calma 💪`);
        if (button) {
            button.disabled = true;
            button.textContent = 'In corso…';
            setTimeout(() => {
                button.disabled = false;
                button.textContent = 'Fatto? Valuta ↓';
            }, 2000);
        }
        return;
    }

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
// ========================================
// Strategy → Tool Mapping
// ========================================

const bodyMoveExercises = {
    jumpingJacks: {
        emoji: '🏃', title: 'Jumping Jacks',
        subtitle: '30 secondi di movimento esplosivo!',
        instruction: 'Piedi uniti → salta con braccia e gambe aperte → ripeti veloce!',
        duration: 30
    },
    squat: {
        emoji: '💪', title: 'Scarica fisica',
        subtitle: 'Scarica l\'energia con il corpo',
        instruction: 'Fai 10 squat, corri sul posto, o stringi forte un cuscino. L\'energia ha bisogno di un\'uscita!',
        duration: 60
    },
    powerPose: {
        emoji: '🦸', title: 'Power Pose',
        subtitle: '2 minuti di postura di potere',
        instruction: 'In piedi, braccia aperte, petto fuori, mento alto. Respira profondo. Il corpo cambia la chimica del cervello.',
        duration: 120
    },
    victoryLap: {
        emoji: '🎉', title: 'Victory Lap!',
        subtitle: 'Celebra fisicamente!',
        instruction: 'Pugno in aria, ballo, grida "YES!" — il cervello registra: fare = bello!',
        duration: 30
    }
};

const sensorySetups = {
    setup: {
        emoji: '🏛️', title: 'Tempio Sensoriale',
        subtitle: 'Crea il tuo ambiente perfetto',
        items: [
            { id: 'light', emoji: '💡', label: 'Luce regolata (soffusa o calda)' },
            { id: 'scent', emoji: '🕯️', label: 'Profumo o candela accesa' },
            { id: 'temp', emoji: '🌡️', label: 'Temperatura confortevole' },
            { id: 'drink', emoji: '☕', label: 'Bevanda calda pronta' },
            { id: 'sound', emoji: '🎵', label: 'Musica di sottofondo o silenzio' },
            { id: 'space', emoji: '🧹', label: 'Spazio ordinato intorno a te' }
        ]
    },
    shock: {
        emoji: '⚡', title: 'Cambio Stato Rapido',
        subtitle: 'Scegli uno stimolo sensoriale forte',
        items: [
            { id: 'mint', emoji: '🌿', label: 'Odore forte (menta, eucalipto)' },
            { id: 'lemon', emoji: '🍋', label: 'Sapore intenso (limone, piccante)' },
            { id: 'cold', emoji: '💧', label: 'Acqua fredda su viso o polsi' },
            { id: 'coffee', emoji: '☕', label: 'Caffè o tè forte' },
            { id: 'sound', emoji: '🔊', label: 'Suono forte e improvviso' },
            { id: 'stretch', emoji: '🤸', label: 'Stretching intenso rapido' }
        ]
    },
    reduce: {
        emoji: '🔇', title: 'Riduzione Stimoli',
        subtitle: 'Riduci il sovraccarico sensoriale',
        items: [
            { id: 'headphones', emoji: '🎧', label: 'Cuffie con rumore bianco o silenzio' },
            { id: 'light', emoji: '🌙', label: 'Ridurre la luminosità' },
            { id: 'close', emoji: '🚪', label: 'Chiudere porte/finestre' },
            { id: 'phone', emoji: '📱', label: 'Telefono in non disturbare' },
            { id: 'tidy', emoji: '📦', label: 'Tavolo libero: solo l\'essenziale' },
            { id: 'pause', emoji: '⏸️', label: '5 minuti di buio e silenzio' }
        ]
    }
};

const anchor333Steps = [
    { num: 3, sense: 'VEDI', desc: '3 cose che vedi', emoji: '👀', placeholders: ['una finestra', 'un colore', 'un oggetto'] },
    { num: 3, sense: 'SENTI', desc: '3 suoni che senti', emoji: '👂', placeholders: ['il respiro', 'un rumore', 'un suono lontano'] },
    { num: 3, sense: 'MUOVI', desc: '3 parti del corpo da muovere', emoji: '🤸', placeholders: ['dita delle mani', 'spalle', 'piedi'] }
];

export const strategyToolMap = {
    // Countdown
    'Conta alla rovescia 5-4-3-2-1': { screen: 'countdownScreen' },
    // Body Movement
    'Corpo prima': { screen: 'bodyMoveScreen', setup: 'jumpingJacks' },
    'Scarica fisica': { screen: 'bodyMoveScreen', setup: 'squat' },
    'Power pose': { screen: 'bodyMoveScreen', setup: 'powerPose' },
    'Victory lap': { screen: 'bodyMoveScreen', setup: 'victoryLap' },
    // Facts vs Fears
    'Muro dei fatti': { screen: 'factCheckScreen' },
    // 3-3-3 Grounding
    'Ancora 3-3-3': { screen: 'anchor333Screen' },
    // SOS Message
    'Messaggio SOS': { screen: 'sosScreen' },
    // Sensory
    'Tempio sensoriale': { screen: 'sensoryScreen', setup: 'setup' },
    'Cambio stato rapido': { screen: 'sensoryScreen', setup: 'shock' },
    'Riduzione stimoli': { screen: 'sensoryScreen', setup: 'reduce' },
    // Map to existing tools
    'Box breathing': { screen: 'breatheScreen' },
    'Mappa del caos': { screen: 'dumpScreen' },
    'Brain dump totale': { screen: 'dumpScreen' },
};

export function getStrategyToolMapping(strategyName) {
    return strategyToolMap[strategyName] || null;
}

// ========================================
// Countdown 5-4-3-2-1
// ========================================

let countdownInterval;

export function initCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    const numberEl = document.getElementById('countdownNumber');
    const messageEl = document.getElementById('countdownMessage');
    const startBtn = document.getElementById('countdownStartBtn');
    if (numberEl) numberEl.textContent = '5';
    if (messageEl) messageEl.textContent = 'Premi Inizia quando sei pronto';
    if (startBtn) { startBtn.disabled = false; startBtn.textContent = 'Inizia'; }
}

export function startCountdown() {
    let count = 5;
    const numberEl = document.getElementById('countdownNumber');
    const messageEl = document.getElementById('countdownMessage');
    const startBtn = document.getElementById('countdownStartBtn');

    if (startBtn) startBtn.disabled = true;
    if (messageEl) messageEl.textContent = '';
    vibrate(30);

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        count--;
        vibrate(count === 0 ? 100 : 30);

        if (count > 0) {
            if (numberEl) {
                numberEl.textContent = count;
                numberEl.style.animation = 'none';
                void numberEl.offsetWidth; // reflow
                numberEl.style.animation = 'countdown-pop 0.6s ease-out';
            }
        } else {
            clearInterval(countdownInterval);
            countdownInterval = null;
            if (numberEl) {
                numberEl.textContent = '🚀';
                numberEl.style.animation = 'countdown-pop 0.6s ease-out';
            }
            if (messageEl) {
                messageEl.textContent = 'VIA! PARTI ORA!';
                messageEl.classList.add('countdown-go');
            }
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.textContent = 'Ancora →';
            }
            addGardenPoints(5);
            showToast('VIA! Agisci ora! 🚀');
        }
    }, 1000);
}

export function stopCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
}

// ========================================
// Body Move - Attivazione fisica
// ========================================

let bodyMoveInterval;

export function initBodyMove() {
    if (bodyMoveInterval) clearInterval(bodyMoveInterval);
    const exerciseType = state.runtime?.bodyMoveType || 'jumpingJacks';
    const exercise = bodyMoveExercises[exerciseType] || bodyMoveExercises.jumpingJacks;

    const emojiEl = document.getElementById('bodyMoveEmoji');
    const titleEl = document.getElementById('bodyMoveTitle');
    const subtitleEl = document.getElementById('bodyMoveSubtitle');
    const instrEl = document.getElementById('bodyMoveInstruction');
    const timerEl = document.getElementById('bodyMoveTimer');
    const startBtn = document.getElementById('bodyMoveStartBtn');

    if (emojiEl) emojiEl.textContent = exercise.emoji;
    if (titleEl) titleEl.textContent = exercise.title;
    if (subtitleEl) subtitleEl.textContent = exercise.subtitle;
    if (instrEl) instrEl.textContent = exercise.instruction;
    if (startBtn) { startBtn.disabled = false; startBtn.textContent = 'Via! 💪'; }

    const m = Math.floor(exercise.duration / 60);
    const s = exercise.duration % 60;
    if (timerEl) timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
}

export function startBodyMove() {
    const exerciseType = state.runtime?.bodyMoveType || 'jumpingJacks';
    const exercise = bodyMoveExercises[exerciseType] || bodyMoveExercises.jumpingJacks;
    let seconds = exercise.duration;

    const timerEl = document.getElementById('bodyMoveTimer');
    const startBtn = document.getElementById('bodyMoveStartBtn');

    if (startBtn) startBtn.disabled = true;
    vibrate(30);

    if (bodyMoveInterval) clearInterval(bodyMoveInterval);

    bodyMoveInterval = setInterval(() => {
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        if (timerEl) timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;

        if (seconds <= 3 && seconds > 0) vibrate(20);

        if (seconds <= 0) {
            clearInterval(bodyMoveInterval);
            bodyMoveInterval = null;
            if (timerEl) timerEl.textContent = '🎉';
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.textContent = 'Ancora →';
            }
            vibrate(100);
            addGardenPoints(5);
            showToast('Ottimo lavoro! 💪');
        }
    }, 1000);
}

export function stopBodyMove() {
    if (bodyMoveInterval) clearInterval(bodyMoveInterval);
    bodyMoveInterval = null;
}

// ========================================
// Fact Check - Fatti vs Paure
// ========================================

export function saveFactCheck() {
    const facts = [
        document.getElementById('fact1')?.value?.trim(),
        document.getElementById('fact2')?.value?.trim(),
        document.getElementById('fact3')?.value?.trim()
    ].filter(Boolean);

    const fears = [
        document.getElementById('fear1')?.value?.trim(),
        document.getElementById('fear2')?.value?.trim(),
        document.getElementById('fear3')?.value?.trim()
    ].filter(Boolean);

    if (facts.length === 0 && fears.length === 0) {
        showToast('Scrivi almeno un fatto o una paura');
        return;
    }

    const resultEl = document.getElementById('factCheckResult');
    if (resultEl) {
        resultEl.innerHTML = `
            <div class="factcheck-summary">
                <p><strong>${facts.length} fatti</strong> vs <strong>${fears.length} paure</strong></p>
                <p class="factcheck-verdict">I fatti sono realtà. Le paure sono proiezioni amplificate dal cervello.<br><strong>I fatti vincono. Sempre.</strong> ✅</p>
            </div>
        `;
        resultEl.scrollIntoView({ behavior: 'smooth' });
    }

    addGardenPoints(10);
    showToast('I fatti vincono! ⚖️');
}

// ========================================
// Anchor 3-3-3 Grounding
// ========================================

export function initAnchor333() {
    updateAnchor333Step(0);
}

export function updateAnchor333Step(index) {
    if (index >= anchor333Steps.length) {
        showToast('Sei tornato al presente! ⚡');
        addGardenPoints(10);
        setTimeout(() => showScreen('responseScreen'), 1500);
        return;
    }
    const step = anchor333Steps[index];
    const container = document.getElementById('anchor333-container');
    if (!container) return;

    container.innerHTML = `
        <div class="anchor-step-card">
            <div class="anchor-step-badge">Passo ${index + 1} di 3</div>
            <div class="anchor-step-emoji">${step.emoji}</div>
            <div class="anchor-step-title">${step.desc}</div>
            <div class="ground-input-area">
                ${Array(step.num).fill(0).map((_, i) => `
                    <input type="text" class="ground-input" placeholder="${step.placeholders[i] || '...'}" />
                `).join('')}
            </div>
            <button class="next-btn" onclick="window.updateAnchor333Step(${index + 1})">${index < anchor333Steps.length - 1 ? 'Avanti →' : 'Completa ✓'}</button>
        </div>
    `;
}

// ========================================
// SOS Message
// ========================================

export function copySosMessage() {
    const textarea = document.getElementById('sosTextarea');
    if (!textarea) return;
    const text = textarea.value;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Messaggio copiato! 📋');
            addGardenPoints(5);
        }).catch(() => {
            textarea.select();
            document.execCommand('copy');
            showToast('Messaggio copiato! 📋');
            addGardenPoints(5);
        });
    } else {
        textarea.select();
        document.execCommand('copy');
        showToast('Messaggio copiato! 📋');
        addGardenPoints(5);
    }
}

export function shareSosMessage() {
    const textarea = document.getElementById('sosTextarea');
    if (!textarea) return;
    const text = textarea.value;
    if (navigator.share) {
        navigator.share({ text }).then(() => {
            addGardenPoints(10);
            showToast('Messaggio condiviso! 💌');
        }).catch(() => {});
    } else {
        copySosMessage();
    }
}

// ========================================
// Sensory Checklist
// ========================================

export function initSensory() {
    const type = state.runtime?.sensoryType || 'setup';
    const config = sensorySetups[type] || sensorySetups.setup;

    const emojiEl = document.getElementById('sensoryEmoji');
    const titleEl = document.getElementById('sensoryTitle');
    const subtitleEl = document.getElementById('sensorySubtitle');
    const listEl = document.getElementById('sensoryChecklist');

    if (emojiEl) emojiEl.textContent = config.emoji;
    if (titleEl) titleEl.textContent = config.title;
    if (subtitleEl) subtitleEl.textContent = config.subtitle;

    if (listEl) {
        listEl.innerHTML = config.items.map(item => `
            <label class="sensory-check-item" for="sensory-${item.id}">
                <input type="checkbox" id="sensory-${item.id}" class="sensory-checkbox" onchange="updateSensoryProgress()">
                <span class="sensory-check-emoji">${item.emoji}</span>
                <span class="sensory-check-label">${item.label}</span>
            </label>
        `).join('');
    }
}

export function updateSensoryProgress() {
    const checkboxes = document.querySelectorAll('.sensory-checkbox');
    const total = checkboxes.length;
    const checked = [...checkboxes].filter(c => c.checked).length;
    if (checked === total && total > 0) {
        vibrate(30);
        showToast('Tutti gli stimoli pronti! 🏛️');
    }
}

export function completeSensory() {
    const checkboxes = document.querySelectorAll('.sensory-checkbox');
    const checked = [...checkboxes].filter(c => c.checked).length;
    if (checked === 0) {
        showToast('Seleziona almeno un elemento');
        return;
    }
    addGardenPoints(5);
    showToast('Setup completato! ✓');
    showScreen('responseScreen');
}