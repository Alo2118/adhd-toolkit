import { feelings, diaryMoods } from './data/feelings.js';
import { triggerCategories } from './data/triggers.js';
import { contextStrategies, strategyExplanations } from './data/strategies.js';
import { responses } from './data/responses.js';
import { guidedActions, homeMotivations } from './data/content.js';
import { state, initState, persist } from './utils/state.js';
import { loadState, exportData, importData, clearAllData } from './utils/storage.js';
import { formatDate, vibrate } from './utils/helpers.js';
import { addGardenPoints, updateGardenBadge } from './components/garden.js';
import { renderActiveTasks, saveTask, updateTask, toggleTaskComplete, deleteTask, toggleRecurringSection, updateRecurringDaysVisibility, updateNextOccurrencePreview, getRecurringSettingsFromUI, setTaskStatusFilter } from './components/tasks.js';
import { requestNotificationPermission, updateNotificationStatusUI, updateNotificationDays, disableNotifications, checkAndScheduleNotifications } from './utils/notifications.js';
import { renderHistory, renderDiaryEntries, generatePDFReport, renderInsights, renderReportMeta, setHistoryPeriod, setHistoryFeelingFilter, selectReportPeriod, toggleCheckbox } from './components/history.js';
import { initTimerScreen, startTimer, stopTimer, completeTimerReward, startBreathing, initGrounding, updateGroundingStep, stopBreathing, resetTimer, saveDump, completeMicroStep, completeChecklist, saveGuidedAnswer, executeStrategyFromDetail, completeStrategyFromDetail } from './components/tools.js';

// Views
import { legalScreen } from './views/legal.js';
import { homeScreen } from './views/home.js';
import { feelingScreen, triggerScreen, responseScreen } from './views/flow.js';
import { toolsViews, guidedViews } from './views/tools.js';
import { diaryViews } from './views/diary.js';
import { tasksViews } from './views/tasks.js';
import { settingsScreen } from './views/settings.js';

// --- Router / View Logic ---

const routes = {
    legalScreen: legalScreen,
    homeScreen: homeScreen,
    feelingScreen: feelingScreen,
    triggerScreen: triggerScreen,
    responseScreen: responseScreen,

    // Tools
    timerScreen: toolsViews.timer,
    breatheScreen: toolsViews.breathe,
    dumpScreen: toolsViews.dump,
    groundScreen: toolsViews.ground,
    microStepScreen: toolsViews.microstep,
    checklistScreen: guidedViews.checklist,
    guidedQuestionScreen: guidedViews.question,
    guidedTipScreen: guidedViews.tip,
    strategyDetailScreen: guidedViews.strategyDetail,

    // Diary
    diaryScreen: diaryViews.list,
    diaryNewScreen: diaryViews.new,
    diaryDetailScreen: diaryViews.detail,
    insightsScreen: diaryViews.insights,
    reportScreen: diaryViews.report,
    historyScreen: diaryViews.history,

    // Tasks & Settings
    activeTasksScreen: tasksViews.list,
    settingsScreen: settingsScreen
};

// Modals are separate
const modals = {
    taskModal: tasksViews.modal
};

function showScreen(screenId) {
    const app = document.getElementById('app');
    if (!app) return;

    if (state.runtime.previousScreen !== screenId) {
        // Simple history tracking could go here
    }

    const template = routes[screenId];
    if (template) {
        app.innerHTML = template;
        window.scrollTo(0, 0);

        // Post-render logic
        handlePostRender(screenId);
    } else {
        console.error('Screen not found:', screenId);
    }
}

function handlePostRender(screenId) {
    // Re-attach dynamic content rendering
    if (screenId === 'homeScreen') {
        updateHomeGreeting();
        updateHomeStats();
        updateGardenBadge();
        updateHomeGardenProgress();
        setRandomHomeMotivation();
    }
    else if (screenId === 'legalScreen') loadLegalTerms();
    else if (screenId === 'feelingScreen') renderFeelings();
    else if (screenId === 'triggerScreen') renderTriggers();
    else if (screenId === 'responseScreen') generateStrategy(); // Re-run logic to populate
    else if (screenId === 'activeTasksScreen') renderActiveTasks();
    else if (screenId === 'historyScreen') renderHistory();
    else if (screenId === 'diaryScreen') renderDiaryEntries();
    else if (screenId === 'diaryNewScreen') {
        renderDiaryMoodOptions();
        loadDiaryDraftToUI();
        updateDiarySaveLabel();
    }
    else if (screenId === 'diaryDetailScreen') renderDiaryDetail();
    else if (screenId === 'insightsScreen') renderInsights();
    else if (screenId === 'reportScreen') renderReportMeta();
    else if (screenId === 'groundScreen') initGrounding(); // Auto-start
    else if (screenId === 'timerScreen') initTimerScreen(2);
    else if (screenId === 'settingsScreen') {
        syncThemeButtons();
        updateNotificationStatusUI();
        syncUserNameInput();
    }
}

function showToast(message) {
    // Toast must exist outside app container or be re-injected
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function goBack() {
    // Basic back logic based on known flows
    const current = document.querySelector('.screen-content') || document.querySelector('.home-screen') || document.querySelector('.flow-header');
    // This DOM check is weak with shadow DOM or new structure. 
    // Better to track state.previousScreen or just specific text.
    // Allow specific screens to handle their own back buttons via onclick in HTML
    showScreen('homeScreen'); // Fallback
}

// --- Flow Logic (SAME AS BEFORE) ---

function startFlow() {
    showScreen('feelingScreen');
}

function renderFeelings() {
    const grid = document.getElementById('feelingsGrid');
    if (!grid) return;
    grid.innerHTML = feelings.map(f => `
        <div class="option-card" onclick="selectFeeling('${f.id}')">
            <span class="emoji">${f.emoji}</span>
            <span class="label">${f.label}</span>
        </div>
    `).join('');
}

function selectFeeling(feelingId) {
    state.currentFeeling = feelingId;
    vibrate(20);
    showScreen('triggerScreen'); // Trigger render happens in post-render
}

function renderTriggers() {
    const list = document.getElementById('triggersList');
    if (!list) return;
    list.innerHTML = triggerCategories.map(cat => `
        <div class="trigger-category">
            <div class="trigger-category-title">${cat.category}</div>
            <div class="trigger-category-items">
                ${cat.triggers.map(t => `
                    <div class="trigger-card" onclick="selectTrigger('${t.id}')">
                        <span class="emoji">${t.emoji}</span>
                        <span class="label">${t.label}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function selectTrigger(triggerId) {
    if (isTaskRelatedTrigger(triggerId)) {
        showTaskPicker(triggerId);
        return;
    }
    state.currentTrigger = triggerId;
    vibrate(20);
    if (!state.runtime) state.runtime = {};
    state.runtime.addHistoryOnResponse = true;
    showScreen('responseScreen');
}

function generateStrategy() {
    const feeling = feelings.find(f => f.id === state.currentFeeling);
    const triggerId = state.currentTrigger;

    // Find response
    let responseKey = `${state.currentFeeling}_${triggerId}`;
    let response = responses[responseKey];
    if (!response) response = responses[state.currentFeeling];
    if (!response) response = { title: 'Tieni duro', text: 'Non ho trovato una strategia specifica, ma respira.', actions: ['breathe'] };

    // Update DOM
    const emojiEl = document.getElementById('responseEmoji');
    const titleEl = document.getElementById('responseFeelingText');
    const tldrEl = document.getElementById('understandingTldr');
    const textEl = document.getElementById('understandingText');

    if (emojiEl) emojiEl.textContent = feeling ? feeling.emoji : '🤔';
    if (titleEl) titleEl.textContent = feeling ? feeling.label.toLowerCase() : '...';

    if (tldrEl) tldrEl.textContent = response.title || response.tldr || '';
    if (textEl) textEl.innerHTML = response.text || response.understanding || '';

    // Guided Actions
    const actionsList = document.getElementById('guidedActionsList');
    const actionsToRender = response.actions || ['timer', 'breathe', 'microstep'];

    if (actionsList) {
        actionsList.innerHTML = actionsToRender.map(actionId => {
            const action = guidedActions.find(a => a.id === actionId);
            if (!action) return '';
            let onClick = '';
            if (action.id === 'timer') onClick = "startToolStrategy('timer', 'Timer 2 minuti')";
            else if (action.id === 'breathe') onClick = "startToolStrategy('breathe', 'Respira con me')";
            else if (action.id === 'ground') onClick = "startToolStrategy('ground', 'Torna al presente')";
            else if (action.id === 'dump') onClick = "startToolStrategy('dump', 'Svuota la mente')";
            else if (action.id === 'microstep') onClick = "startToolStrategy('microstep', 'Micro-step')";

            return `
                <button class="guided-action-card" onclick="${onClick}">
                    <span class="guided-action-icon">${action.icon}</span>
                    <div class="guided-action-info">
                        <span class="guided-action-name">${action.name}</span>
                        <span class="guided-action-desc">${action.desc}</span>
                    </div>
                    <span class="guided-action-arrow">→</span>
                </button>
            `;
        }).join('');
    }

    // Strategies
    const strategiesContainer = document.getElementById('strategiesList');
    if (strategiesContainer) {
        const allStrategies = [
            ...(contextStrategies.lavoro || []),
            ...(contextStrategies.studio || []),
            ...(contextStrategies.sociale || [])
        ];
        const rankedStrategies = getRankedStrategiesForFeeling(state.currentFeeling, allStrategies);
        strategiesContainer.innerHTML = rankedStrategies.slice(0, 3).map(strat => `
            <button class="strategy-card" data-strategy="${encodeURIComponent(strat.name)}"
                onclick="openStrategyDetail(this.dataset.strategy)">
                <div class="strategy-title">${strat.name}</div>
                <div class="strategy-desc">${strat.desc}</div>
            </button>
        `).join('');
    }

    addGardenPoints(10);
    if (state.runtime?.addHistoryOnResponse) {
        addToHistory(state.currentFeeling, state.currentTrigger, response.title || response.tldr);
        state.runtime.addHistoryOnResponse = false;
    }
}

function getRankedStrategiesForFeeling(feelingId, strategies) {
    if (!Array.isArray(strategies) || strategies.length === 0) return [];
    const effectiveness = state.patterns?.strategyEffectiveness || {};
    const byFeeling = effectiveness[feelingId] || {};

    const scored = strategies.map(strat => {
        const stats = byFeeling[strat.name] || { totalScore: 0, total: 0, success: 0 };
        let rate = 0;
        if (stats.total > 0 && Number.isFinite(stats.totalScore)) {
            rate = stats.totalScore / (stats.total * 5);
        } else if (stats.total > 0 && Number.isFinite(stats.success)) {
            rate = stats.success / stats.total;
        }
        return { ...strat, _rate: rate, _total: stats.total };
    });

    const hasData = scored.some(s => s._total > 0);
    if (!hasData) {
        return [...scored].sort(() => 0.5 - Math.random());
    }

    return [...scored].sort((a, b) => {
        if (b._rate !== a._rate) return b._rate - a._rate;
        if (b._total !== a._total) return b._total - a._total;
        return a.name.localeCompare(b.name);
    });
}

function updateStrategyEffectiveness(feelingId, strategyName, rating) {
    if (!feelingId || !strategyName) return;
    const safeRating = normalizeStrategyRating(rating);
    if (!safeRating) return;
    if (!state.patterns) state.patterns = { feelingCounts: {}, triggerCounts: {}, strategyEffectiveness: {} };
    if (!state.patterns.strategyEffectiveness) state.patterns.strategyEffectiveness = {};
    if (!state.patterns.strategyEffectiveness[feelingId]) state.patterns.strategyEffectiveness[feelingId] = {};

    const entry = state.patterns.strategyEffectiveness[feelingId][strategyName] || { totalScore: 0, total: 0 };
    entry.total += 1;
    entry.totalScore += safeRating;
    state.patterns.strategyEffectiveness[feelingId][strategyName] = entry;
}

function recordStrategyOutcome(rating) {
    if (state.runtime?.strategyRatingLocked) {
        showToast('Valutazione già inviata');
        return;
    }
    if (!state.runtime) state.runtime = {};
    const targetId = state.runtime.lastHistoryId;
    const targetStrategy = state.runtime.lastStrategyTitle;
    let entry = null;

    if (targetId) {
        entry = (state.history || []).find(h => h.id === targetId);
    }
    if (!entry && targetStrategy) {
        entry = (state.history || []).find(h =>
            h.strategy === targetStrategy &&
            h.feeling === state.currentFeeling &&
            h.trigger === state.currentTrigger
        );
    }

    const safeRating = normalizeStrategyRating(rating);
    if (entry && safeRating) {
        const strategyName = entry.strategyUsed || entry.strategy || state.runtime?.selectedStrategyName;
        entry.strategyRating = safeRating;
        entry.strategyFeedbackAt = new Date().toISOString();
        if (strategyName) {
            entry.strategyUsed = strategyName;
            updateStrategyEffectiveness(entry.feeling, strategyName, safeRating);
        }
        persist();
    }

    if (safeRating) {
        state.runtime.strategyRatingLocked = true;
        state.runtime.selectedStrategyRating = safeRating;
        updateStrategyRatingUI(safeRating, true);
        showToast(`Grazie del feedback! (${safeRating}/5)`);
        if (safeRating >= 4) addGardenPoints(2);
    }
}

function addToHistory(feelingId, triggerId, strategyTitle) {
    if (!Array.isArray(state.history)) state.history = [];
    if (!state.runtime) state.runtime = {};

    const historyKey = `${feelingId}|${triggerId}|${strategyTitle || ''}`;
    const now = Date.now();
    if (
        state.runtime.lastHistoryKey === historyKey &&
        typeof state.runtime.lastHistoryAt === 'number' &&
        now - state.runtime.lastHistoryAt < 3000
    ) {
        return;
    }

    const entry = {
        id: now,
        date: new Date().toISOString(),
        feeling: feelingId,
        trigger: triggerId,
        strategy: strategyTitle,
        taskId: state.runtime?.selectedTaskForTrigger?.id || null,
        taskName: state.runtime?.selectedTaskForTrigger?.name || null,
        strategyRating: null,
        strategyFeedbackAt: null
    };
    state.history.unshift(entry);
    if (state.history.length > 50) state.history.pop();
    persist();

    state.runtime.lastHistoryKey = historyKey;
    state.runtime.lastHistoryAt = now;
    state.runtime.lastHistoryId = entry.id;
    state.runtime.lastStrategyTitle = strategyTitle;
    state.runtime.selectedTaskForTrigger = null;
}

// --- Legal & Features (SAME) ---

function updateAcceptButton() {
    const c1 = document.getElementById('consentCheckbox1')?.checked;
    const c2 = document.getElementById('consentCheckbox2')?.checked;
    const c3 = document.getElementById('consentCheckbox3')?.checked;
    const c4 = document.getElementById('consentCheckbox4')?.checked;
    const btn = document.getElementById('acceptBtn');
    if (btn) btn.disabled = !(c1 && c2 && c3 && c4);
}

function acceptTerms() {
    localStorage.setItem('adhd-toolkit-consent', 'true');
    showScreen('homeScreen');
    showToast('Benvenuto! 🤗');
}

function declineTerms() {
    alert('Per utilizzare l\'app è necessario accettare i termini.');
}

function openGarden() {
    updateGardenBadge();
    showToast(`Livello ${state.garden.level} - Punti: ${state.garden.points}`);
}

function openDiary() {
    showScreen('diaryScreen');
}

function renderDiaryMoodOptions() {
    const grid = document.getElementById('diaryMoodGrid');
    if (!grid) return;
    const moods = diaryMoods || [];
    const selected = state.diaryDraft?.mood || null;
    grid.innerHTML = moods.map(m => `
        <button class="diary-mood-btn ${selected === m.id ? 'selected' : ''}"
            onclick="selectDiaryMood('${m.id}')">
            <span class="emoji">${m.emoji}</span>
            <span class="label">${m.label}</span>
        </button>
    `).join('');
}

function selectDiaryMood(moodId) {
    if (!state.diaryDraft) state.diaryDraft = { text: '', mood: null, intensity: 0, tags: [] };
    state.diaryDraft.mood = moodId;
    renderDiaryMoodOptions();
}

function addPrompt(text) {
    const input = document.getElementById('diaryTextInput');
    if (!input) return;
    const current = input.value || '';
    const spacer = current.length > 0 ? '\n\n' : '';
    input.value = `${current}${spacer}${text} `;
    input.focus();
}

function saveDiaryEntry() {
    const textEl = document.getElementById('diaryTextInput');
    const text = (textEl?.value || '').trim();
    const mood = state.diaryDraft?.mood || null;
    const editingId = state.runtime?.editDiaryId || null;

    if (!text && !mood) {
        showToast('Scrivi una nota o scegli un mood');
        return;
    }

    if (!Array.isArray(state.diary)) state.diary = [];

    if (editingId) {
        const entry = state.diary.find(item => item.id === editingId);
        if (entry) {
            entry.text = text;
            entry.mood = mood;
            entry.updatedAt = new Date().toISOString();
        }
    } else {
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            mood,
            text
        };
        state.diary.unshift(entry);
        if (state.diary.length > 200) state.diary.pop();
    }

    state.diaryDraft = { text: '', mood: null, intensity: 0, tags: [] };
    if (state.runtime) state.runtime.editDiaryId = null;
    persist();
    showToast(editingId ? 'Nota aggiornata' : 'Nota salvata');
    showScreen('diaryScreen');
}

function openDiaryEntry(id) {
    if (!state.runtime) state.runtime = {};
    state.runtime.selectedDiaryId = id;
    showScreen('diaryDetailScreen');
}

function renderDiaryDetail() {
    const id = state.runtime?.selectedDiaryId;
    const entry = (state.diary || []).find(item => item.id === id);
    const header = document.getElementById('diaryDetailHeader');
    const textEl = document.getElementById('diaryDetailText');
    if (!entry || !header || !textEl) return;

    const mood = (diaryMoods || []).find(m => m.id === entry.mood) || { emoji: '📝', label: '' };
    header.innerHTML = `
        <div class="diary-detail-emoji">${mood.emoji}</div>
        <div class="diary-detail-date">${formatDate(entry.date)}</div>
        ${mood.label ? `<div class="diary-detail-time">${mood.label}</div>` : ''}
    `;
    textEl.textContent = entry.text || '—';
}

function deleteDiaryEntry() {
    const id = state.runtime?.selectedDiaryId;
    if (!id) return;
    if (!confirm('Eliminare questa nota?')) return;
    state.diary = (state.diary || []).filter(item => item.id !== id);
    persist();
    showToast('Nota eliminata');
    showScreen('diaryScreen');
}

function deleteHistoryEntry(id) {
    if (!id) return;
    if (!confirm('Eliminare questo momento?')) return;
    state.history = (state.history || []).filter(item => item.id !== id);
    persist();
    showToast('Momento eliminato');
    renderHistory();
    updateHomeStats();
}

function openEditHistoryModal(id) {
    const entry = (state.history || []).find(item => item.id === id);
    if (!entry) return;

    const container = document.getElementById('modal-container');
    if (!container) return;
    if (!state.runtime) state.runtime = {};
    state.runtime.editHistoryId = id;

    const triggerOptions = triggerCategories.flatMap(cat => cat.triggers)
        .map(t => `<option value="${t.id}" ${t.id === entry.trigger ? 'selected' : ''}>${t.label}</option>`)
        .join('');

    const feelingOptions = feelings
        .map(f => `<option value="${f.id}" ${f.id === entry.feeling ? 'selected' : ''}>${f.label}</option>`)
        .join('');

    const strategyOptions = Object.values(contextStrategies || {})
        .flat()
        .map(s => s.name)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
        .map(name => `<option value="${name}" ${name === entry.strategyUsed ? 'selected' : ''}>${name}</option>`)
        .join('');

    const taskOptions = (state.activeTasks || [])
        .map(t => `<option value="${t.id}" ${t.id === entry.taskId ? 'selected' : ''}>${t.name}</option>`)
        .join('');

    container.innerHTML = `
        <div class="modal" onclick="closeHistoryModal()">
            <div class="modal-backdrop"></div>
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <div class="modal-title">Modifica momento</div>
                    <button class="modal-close" onclick="closeHistoryModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Emozione</label>
                        <select id="historyEditFeeling" class="form-input">${feelingOptions}</select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Trigger</label>
                        <select id="historyEditTrigger" class="form-input">${triggerOptions}</select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Strategia usata</label>
                        <select id="historyEditStrategy" class="form-input">
                            <option value="">Nessuna</option>
                            ${strategyOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Compito (opzionale)</label>
                        <select id="historyEditTask" class="form-input">
                            <option value="">Nessuno</option>
                            ${taskOptions}
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="secondary-btn" onclick="closeHistoryModal()">Annulla</button>
                    <button class="primary-btn" onclick="saveHistoryEdit()">Salva</button>
                </div>
            </div>
        </div>
    `;
}

function saveHistoryEdit() {
    const id = state.runtime?.editHistoryId;
    const entry = (state.history || []).find(item => item.id === id);
    if (!entry) return;

    const feeling = document.getElementById('historyEditFeeling')?.value;
    const trigger = document.getElementById('historyEditTrigger')?.value;
    const strategy = document.getElementById('historyEditStrategy')?.value || '';
    const taskIdValue = document.getElementById('historyEditTask')?.value || '';
    const taskId = taskIdValue ? Number(taskIdValue) : null;
    const task = (state.activeTasks || []).find(t => t.id === taskId);

    entry.feeling = feeling || entry.feeling;
    entry.trigger = trigger || entry.trigger;
    entry.strategyUsed = strategy.trim() || null;
    entry.taskId = task ? task.id : null;
    entry.taskName = task ? task.name : null;

    persist();
    closeHistoryModal();
    renderHistory();
    showToast('Momento aggiornato');
}

function closeHistoryModal() {
    if (state.runtime) state.runtime.editHistoryId = null;
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = '';
}

function editDiaryEntry() {
    const id = state.runtime?.selectedDiaryId;
    if (!id) return;
    const entry = (state.diary || []).find(item => item.id === id);
    if (!entry) return;
    if (!state.runtime) state.runtime = {};
    state.runtime.editDiaryId = id;
    state.diaryDraft = {
        text: entry.text || '',
        mood: entry.mood || null,
        intensity: 0,
        tags: []
    };
    showScreen('diaryNewScreen');
}

function loadDiaryDraftToUI() {
    const textEl = document.getElementById('diaryTextInput');
    if (textEl) textEl.value = state.diaryDraft?.text || '';
}

function updateDiarySaveLabel() {
    const btn = document.querySelector('.diary-save-btn');
    if (!btn) return;
    const editing = Boolean(state.runtime?.editDiaryId);
    btn.textContent = editing ? 'Aggiorna nota' : 'Salva nota';
}

// Task Modal Handling
window.showAddTaskModal = () => {
    const app = document.getElementById('app');
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modals.taskModal;
    // Extract the modal element
    const modal = modalDiv.firstElementChild; // .modal-backdrop is first? No, we need structure.
    // TasksViews.modal has backdrop and content as siblings in text? 
    // Wait, my template for modal had backdrop and content adjacent. 
    // Let's wrap it or inject properly.

    // Better: Inject the modal HTML into a specific modal container or just append to body
    const promptContainer = document.getElementById('modal-container');
    if (promptContainer) {
        promptContainer.innerHTML = `<div class="modal" id="taskModal" style="display:flex">${modals.taskModal}</div>`;
        if (state.runtime) state.runtime.editTaskId = null;
        document.getElementById('taskModalTitle').textContent = 'Nuovo compito';
    }
};

window.openEditTaskModal = (taskId) => {
    const task = (state.activeTasks || []).find(t => t.id === taskId);
    if (!task) return;
    window.showAddTaskModal();
    if (!state.runtime) state.runtime = {};
    state.runtime.editTaskId = taskId;

    document.getElementById('taskModalTitle').textContent = 'Modifica compito';
    document.getElementById('taskNameInput').value = task.name || '';
    document.getElementById('taskCategoryInput').value = task.category || '';
    document.getElementById('taskDeadlineInput').value = task.deadline ? task.deadline.slice(0, 10) : '';
    document.getElementById('taskNotesInput').value = task.notes || '';

    const recurringInput = document.getElementById('taskRecurringInput');
    const recurringSection = document.getElementById('recurringSection');
    if (recurringInput) recurringInput.checked = Boolean(task.recurring?.enabled);
    if (recurringSection) recurringSection.style.display = task.recurring?.enabled ? 'block' : 'none';

    const patternInput = document.getElementById('taskRecurringPatternInput');
    if (patternInput) patternInput.value = task.recurring?.pattern || 'daily';
    updateRecurringDaysVisibility();

    const days = task.recurring?.days || [];
    ['dayMon', 'dayTue', 'dayWed', 'dayThu', 'dayFri', 'daySat', 'daySun'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const value = Number(el.value);
        el.checked = days.includes(value);
    });
    updateNextOccurrencePreview();
};

window.closeTaskModal = () => {
    const c = document.getElementById('modal-container');
    if (c) c.innerHTML = '';
    if (state.runtime?.returnToTaskPicker) {
        state.runtime.returnToTaskPicker = false;
    }
};

window.handleSaveTask = () => {
    const name = document.getElementById('taskNameInput').value;
    const category = document.getElementById('taskCategoryInput').value;
    const deadline = document.getElementById('taskDeadlineInput').value;
    const notes = document.getElementById('taskNotesInput')?.value || '';
    if (!name) { showToast('❌ Inserisci un nome'); return; }
    const recurring = getRecurringSettingsFromUI();
    const editId = state.runtime?.editTaskId || null;
    const inTriggerFlow = Boolean(state.runtime?.returnToTaskPicker);
    const pendingTriggerId = state.runtime?.pendingTriggerId || null;
    if (editId) {
        updateTask(editId, { name, category, deadline, notes, recurring });
        window.closeTaskModal();
    } else {
        const created = saveTask({ name, category, deadline, notes, recurring });
        window.closeTaskModal();
        if (inTriggerFlow && created) {
            state.runtime.returnToTaskPicker = false;
            proceedAfterTaskCreate(created, pendingTriggerId);
        }
    }
};

window.exportData = () => {
    exportData(state);
    showToast('Backup scaricato');
};

window.importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        if (!confirm('Importando un backup sovrascriverai i dati attuali. Continuare?')) {
            return;
        }
        importData(file, (ok, data) => {
            if (!ok || !data) {
                showToast('Backup non valido');
                return;
            }
            initState();
            showToast('Backup importato');
            showScreen('homeScreen');
            checkAndScheduleNotifications(state.activeTasks);
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'TASKS_SYNC',
                    payload: {
                        tasks: state.activeTasks || [],
                        settings: state.notificationSettings || {}
                    }
                });
            }
        });
    };
    input.click();
};


// --- Init ---

window.addEventListener('DOMContentLoaded', async () => {
    initState();
    applyTheme(state.settings?.theme || 'system');

    // Create modal container if missing
    if (!document.getElementById('modal-container')) {
        const mc = document.createElement('div');
        mc.id = 'modal-container';
        document.body.appendChild(mc);
    }

    const consent = localStorage.getItem('adhd-toolkit-consent');
    if (consent === 'true') {
        showScreen('homeScreen');
    } else {
        showScreen('legalScreen');
    }

    if (state.notificationSettings?.enabled) {
        checkAndScheduleNotifications(state.activeTasks);
    }

    // Sync tasks for background notifications (best-effort)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'TASKS_SYNC',
            payload: {
                tasks: state.activeTasks || [],
                settings: state.notificationSettings || {}
            }
        });
    }
});

// --- Expose ---
window.showScreen = showScreen;
window.showToast = showToast;
window.goBack = goBack;
window.startFlow = startFlow;
window.selectFeeling = selectFeeling;
window.selectTrigger = selectTrigger;
window.openGarden = openGarden;
window.openDiary = openDiary;
window.addGardenPoints = addGardenPoints;
window.recordStrategyOutcome = recordStrategyOutcome;
window.openStrategyDetail = openStrategyDetail;
window.startToolStrategy = startToolStrategy;
window.showMoreMenu = showMoreMenu;
window.closeMoreMenu = closeMoreMenu;

window.renderActiveTasks = renderActiveTasks;
window.toggleTaskComplete = toggleTaskComplete;
window.deleteTask = deleteTask;
window.setTaskStatusFilter = setTaskStatusFilter;

window.toggleRecurringSection = toggleRecurringSection;
window.updateRecurringDaysVisibility = updateRecurringDaysVisibility;
window.updateNextOccurrencePreview = updateNextOccurrencePreview;

window.renderHistory = renderHistory;
window.renderDiaryEntries = renderDiaryEntries;
window.generatePDFReport = generatePDFReport;
window.renderInsights = renderInsights;
window.setHistoryPeriod = setHistoryPeriod;
window.setHistoryFeelingFilter = setHistoryFeelingFilter;
window.selectReportPeriod = selectReportPeriod;
window.toggleCheckbox = toggleCheckbox;

window.startTimer = startTimer;
window.initTimerScreen = initTimerScreen;
window.stopTimer = stopTimer;
window.completeTimerReward = completeTimerReward;
window.startBreathing = startBreathing;
window.initGrounding = initGrounding;
window.updateGroundingStep = updateGroundingStep;
window.stopBreathing = stopBreathing;
window.resetTimer = resetTimer;
window.saveDump = saveDump;
window.completeMicroStep = completeMicroStep;
window.completeChecklist = completeChecklist;
window.saveGuidedAnswer = saveGuidedAnswer;
window.executeStrategyFromDetail = executeStrategyFromDetail;
window.completeStrategyFromDetail = completeStrategyFromDetail;
window.saveDiaryEntry = saveDiaryEntry;
window.addPrompt = addPrompt;
window.openDiaryEntry = openDiaryEntry;
window.deleteDiaryEntry = deleteDiaryEntry;
window.editDiaryEntry = editDiaryEntry;
window.selectDiaryMood = selectDiaryMood;
window.deleteHistoryEntry = deleteHistoryEntry;
window.selectTaskForTrigger = selectTaskForTrigger;
window.skipTaskForTrigger = skipTaskForTrigger;
window.openTaskModalFromTrigger = openTaskModalFromTrigger;
window.openEditHistoryModal = openEditHistoryModal;
window.saveHistoryEdit = saveHistoryEdit;

window.updateAcceptButton = updateAcceptButton;
window.acceptTerms = acceptTerms;
window.declineTerms = declineTerms;
window.setTheme = setTheme;
window.disableNotifications = disableNotifications;
window.updateNotificationDays = updateNotificationDays;
window.saveUserName = saveUserName;

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
    } else if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.removeAttribute('data-theme');
    }
}

function setTheme(theme) {
    if (!state.settings) state.settings = { theme: 'system', notifications: true };
    state.settings.theme = theme;
    persist();
    applyTheme(theme);
    syncThemeButtons();
    showToast(`Tema: ${theme === 'system' ? 'Sistema' : theme === 'light' ? 'Chiaro' : 'Scuro'}`);
}

function syncThemeButtons() {
    const theme = state.settings?.theme || 'system';
    const systemBtn = document.getElementById('themeSystemBtn');
    const lightBtn = document.getElementById('themeLightBtn');
    const darkBtn = document.getElementById('themeDarkBtn');

    [systemBtn, lightBtn, darkBtn].forEach(btn => {
        if (!btn) return;
        btn.classList.remove('primary');
        btn.classList.add('secondary');
    });

    if (theme === 'light' && lightBtn) {
        lightBtn.classList.remove('secondary');
        lightBtn.classList.add('primary');
    } else if (theme === 'dark' && darkBtn) {
        darkBtn.classList.remove('secondary');
        darkBtn.classList.add('primary');
    } else if (systemBtn) {
        systemBtn.classList.remove('secondary');
        systemBtn.classList.add('primary');
    }
}

function isTaskRelatedTrigger(triggerId) {
    return ['task_paralysis', 'too_many', 'boring_task', 'decision', 'deadline'].includes(triggerId);
}

function showTaskPicker(triggerId) {
    const container = document.getElementById('modal-container');
    if (!container) return;
    if (!state.runtime) state.runtime = {};
    state.runtime.pendingTriggerId = triggerId;

    const tasks = (state.activeTasks || []).filter(t => t.status === 'active');
    const listHtml = tasks.length === 0
        ? '<div style="padding:12px 0;color:var(--text-muted);font-size:0.9rem">Nessun compito attivo</div>'
        : tasks.map(t => `
            <button class="home-more-btn" onclick="selectTaskForTrigger(${t.id})">
                📌 ${t.name}
            </button>
        `).join('');

    container.innerHTML = `
        <div class="modal" onclick="skipTaskForTrigger()">
            <div class="modal-backdrop"></div>
            <div class="modal-content home-more-sheet" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <div class="modal-title">Scegli un compito</div>
                    <button class="modal-close" onclick="skipTaskForTrigger()">×</button>
                </div>
                <div class="modal-body">
                    ${listHtml}
                    <button class="home-more-btn" onclick="openTaskModalFromTrigger()">➕ Nuovo compito</button>
                    <button class="home-more-btn" onclick="skipTaskForTrigger()">Salta</button>
                </div>
            </div>
        </div>
    `;
}

function selectTaskForTrigger(taskId) {
    const task = (state.activeTasks || []).find(t => t.id === taskId);
    if (!task) return;
    state.runtime.selectedTaskForTrigger = { id: task.id, name: task.name };
    const triggerId = state.runtime.pendingTriggerId;
    state.runtime.pendingTriggerId = null;
    closeModal();
    state.currentTrigger = triggerId;
    state.runtime.addHistoryOnResponse = true;
    showScreen('responseScreen');
}

function skipTaskForTrigger() {
    const triggerId = state.runtime?.pendingTriggerId;
    if (!triggerId) return closeModal();
    state.runtime.pendingTriggerId = null;
    closeModal();
    state.currentTrigger = triggerId;
    state.runtime.addHistoryOnResponse = true;
    showScreen('responseScreen');
}

function openTaskModalFromTrigger() {
    if (!state.runtime) state.runtime = {};
    state.runtime.returnToTaskPicker = true;
    window.showAddTaskModal();
}

function closeModal() {
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = '';
}

function proceedAfterTaskCreate(task, triggerId) {
    if (!triggerId || !task) {
        showToast('Compito aggiunto');
        showScreen('triggerScreen');
        return;
    }
    state.runtime.selectedTaskForTrigger = { id: task.id, name: task.name };
    state.runtime.pendingTriggerId = null;
    state.currentTrigger = triggerId;
    state.runtime.addHistoryOnResponse = true;
    showScreen('responseScreen');
}

function updateHomeProgress() {
    // Deprecated: replaced by updateHomeStats()
}

function updateHomeGreeting() {
    const greetingEl = document.getElementById('homeGreeting');
    const welcomeEl = document.getElementById('homeWelcome');
    if (!greetingEl || !welcomeEl) return;

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? 'BUONGIORNO' :
        hour < 18 ? 'BUON POMERIGGIO' :
        'BUONA SERA';

    greetingEl.textContent = greeting;
    const name = state.userName && state.userName !== 'Bentornato' ? state.userName : '';
    welcomeEl.textContent = name ? `Bentornato, ${name}` : 'Bentornato';
}

function syncUserNameInput() {
    const input = document.getElementById('userNameInput');
    if (!input) return;
    input.value = state.userName && state.userName !== 'Bentornato' ? state.userName : '';
}

function saveUserName() {
    const input = document.getElementById('userNameInput');
    if (!input) return;
    const name = (input.value || '').trim();
    state.userName = name || 'Bentornato';
    persist();
    updateHomeGreeting();
    showToast(name ? 'Nome salvato' : 'Nome rimosso');
}

function updateHomeStats() {
    const streakEl = document.getElementById('homeStreakValue');
    const momentsEl = document.getElementById('homeMomentsValue');
    if (streakEl) streakEl.textContent = `${state.garden?.streak ?? 0}`;
    if (momentsEl) momentsEl.textContent = `${(state.history || []).length}`;
}

function updateHomeGardenProgress() {
    const fill = document.getElementById('gardenProgressFill');
    if (!fill) return;
    const levels = [0, 100, 300, 600, 1000, 2000, 5000];
    const levelIndex = Math.max(0, (state.garden?.level || 1) - 1);
    const currentBase = levels[levelIndex] || 0;
    const nextTarget = levels[levelIndex + 1] || currentBase;
    const points = state.garden?.points || 0;
    const range = Math.max(1, nextTarget - currentBase);
    const progress = Math.min(1, Math.max(0, (points - currentBase) / range));
    fill.style.width = `${Math.round(progress * 100)}%`;
}

function setRandomHomeMotivation() {
    const el = document.getElementById('homeMotivation');
    if (!el || !Array.isArray(homeMotivations) || homeMotivations.length === 0) return;
    const index = Math.floor(Math.random() * homeMotivations.length);
    el.textContent = homeMotivations[index];
}

function showMoreMenu() {
    const container = document.getElementById('modal-container');
    if (!container) return;
    container.innerHTML = `
        <div class="modal home-more-modal" onclick="closeMoreMenu()">
            <div class="modal-backdrop"></div>
            <div class="modal-content home-more-sheet" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <div class="modal-title">Altro</div>
                    <button class="modal-close" onclick="closeMoreMenu()">×</button>
                </div>
                <div class="modal-body">
                    <button class="home-more-btn" onclick="closeMoreMenu();showScreen('historyScreen')">📋 Storico</button>
                    <button class="home-more-btn" onclick="closeMoreMenu();showScreen('insightsScreen')">📊 Report</button>
                    <button class="home-more-btn" onclick="closeMoreMenu();showScreen('settingsScreen')">⚙️ Settings</button>
                </div>
            </div>
        </div>
    `;
}

function closeMoreMenu() {
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = '';
}

export { showScreen, showToast };

function openStrategyDetail(encodedName) {
    const name = decodeURIComponent(encodedName || '');
    if (!name) return;
    if (!state.runtime) state.runtime = {};

    const strategy = findStrategyByName(name);
    const desc = strategy?.desc || 'Strategia';
    const explanation = strategyExplanations[name]
        || 'Provala per pochi minuti e osserva cosa cambia.';

    showScreen('strategyDetailScreen');

    const titleEl = document.getElementById('strategyDetailTitle');
    const descEl = document.getElementById('strategyDetailDesc');
    const expEl = document.getElementById('strategyDetailExplanation');

    if (titleEl) titleEl.textContent = name;
    if (descEl) descEl.textContent = desc;
    if (expEl) expEl.textContent = explanation;

    state.runtime.selectedStrategyName = name;
    state.runtime.lastStrategyTitle = name;
    state.runtime.strategyRatingLocked = false;
    state.runtime.selectedStrategyRating = null;
    updateStrategyRatingUI(null, false);
}

function startToolStrategy(toolId, strategyName) {
    const screenMap = {
        timer: 'timerScreen',
        breathe: 'breatheScreen',
        dump: 'dumpScreen',
        ground: 'groundScreen',
        microstep: 'microStepScreen',
        checklist: 'checklistScreen',
        question: 'guidedQuestionScreen',
        tip: 'guidedTipScreen'
    };

    if (!state.runtime) state.runtime = {};
    state.runtime.selectedStrategyName = strategyName || null;
    state.runtime.lastStrategyTitle = strategyName || null;
    state.runtime.strategyRatingLocked = false;
    state.runtime.selectedStrategyRating = null;

    const screenId = screenMap[toolId];
    if (!screenId) return;
    showScreen(screenId);
    updateStrategyRatingUI(null, false);
}

function findStrategyByName(name) {
    const groups = Object.values(contextStrategies || {});
    for (const list of groups) {
        const found = (list || []).find(item => item.name === name);
        if (found) return found;
    }
    return null;
}

function normalizeStrategyRating(value) {
    const rating = Number(value);
    if (!Number.isFinite(rating)) return null;
    if (rating < 1 || rating > 5) return null;
    return Math.round(rating);
}

function updateStrategyRatingUI(selectedRating, locked) {
    const buttons = document.querySelectorAll('#strategyRatingSection .feedback-btn');
    if (!buttons || buttons.length === 0) return;

    buttons.forEach(button => {
        const rating = Number(button.dataset.rating);
        const isSelected = Number.isFinite(rating) && rating === selectedRating;
        button.classList.toggle('selected', isSelected);
        button.classList.toggle('disabled', Boolean(locked));
        button.disabled = Boolean(locked);
    });
}

async function loadLegalTerms() {
    const container = document.getElementById('legalTermsContent');
    if (!container) return;
    if (container.dataset.loaded === 'true') return;

    try {
        const response = await fetch('TERMINI.md', { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed to load');
        const text = await response.text();
        container.innerHTML = markdownToHtml(text);
        container.dataset.loaded = 'true';
    } catch (error) {
        container.textContent = 'Impossibile caricare i termini. Riprova.';
    }
}

function markdownToHtml(markdown) {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        const isListItem = /^-\s+/.test(trimmed);

        if (isListItem) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            const itemText = trimmed.replace(/^-\s+/, '');
            html += `<li>${inlineMarkdown(itemText)}</li>`;
            return;
        }

        if (inList) {
            html += '</ul>';
            inList = false;
        }

        if (trimmed === '') {
            html += '<br>';
            return;
        }

        if (/^###\s+/.test(trimmed)) {
            html += `<h3>${inlineMarkdown(trimmed.replace(/^###\s+/, ''))}</h3>`;
            return;
        }
        if (/^##\s+/.test(trimmed)) {
            html += `<h2>${inlineMarkdown(trimmed.replace(/^##\s+/, ''))}</h2>`;
            return;
        }
        if (/^#\s+/.test(trimmed)) {
            html += `<h1>${inlineMarkdown(trimmed.replace(/^#\s+/, ''))}</h1>`;
            return;
        }

        html += `<p>${inlineMarkdown(trimmed)}</p>`;
    });

    if (inList) {
        html += '</ul>';
    }

    return html;
}

function inlineMarkdown(text) {
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return escaped
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}
