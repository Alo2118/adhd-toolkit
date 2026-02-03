import { state, persist } from '../utils/state.js';
import { showToast } from '../main.js';
import { addGardenPoints } from './garden.js';
import { formatDate } from '../utils/helpers.js';
import { checkAndScheduleNotifications } from '../utils/notifications.js';

// --- Logic ---

export function renderActiveTasks() {
    const container = document.getElementById('activeTasksContent');
    if (!container) return; // Guard if running on screen without tasks

    // Filter logic
    let tasks = state.activeTasks || [];
    // ... filtering logic based on global filter variable or state
    // For simplicity, we assume 'all' or import filter state if needed.

    if (tasks.length === 0) {
        container.innerHTML = '<div class="task-empty-state"><div class="task-empty-state-emoji">✓</div><div class="task-empty-state-text">Nessun compito</div></div>';
        return;
    }

    container.innerHTML = tasks.map(task => {
        const isCompleted = task.status === 'completed';
        const deadlineLabel = task.deadline ? `📅 ${formatDate(task.deadline)}` : '';
        const nextOccLabel = task.recurring?.enabled && task.nextOccurrence
            ? `🔄 ${formatDate(task.nextOccurrence)}`
            : '';
        const metaLabel = [deadlineLabel, nextOccLabel].filter(Boolean).join(' · ');
        return `
            <div class="task-card ${isCompleted ? 'completed' : ''}">
                <div class="task-card-header">
                    <input type="checkbox" class="task-card-checkbox" ${isCompleted ? 'checked' : ''} onchange="window.toggleTaskComplete(${task.id})">
                    <div class="task-card-main">
                        <div class="task-card-name">${task.name}</div>
                        <div class="task-card-meta">
                            ${metaLabel ? `<span class="task-card-deadline">${metaLabel}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="task-card-actions">
                    <button class="task-card-action-btn" onclick="window.openEditTaskModal(${task.id})">✏️</button>
                    <button class="task-card-action-btn" onclick="window.deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    // Update count
    const countSpan = document.getElementById('activeTasksCount');
    if (countSpan) countSpan.textContent = `${tasks.filter(t => t.status === 'active').length} attività attive`;
    checkAndScheduleNotifications(state.activeTasks);
}

export function saveTask(taskData) {
    const recurringSettings = taskData.recurring || collectRecurringSettings();
    const newTask = {
        id: Date.now(),
        name: taskData.name,
        category: taskData.category || 'altro',
        status: 'active',
        createdAt: new Date().toISOString(),
        deadline: taskData.deadline || null,
        notes: taskData.notes || '',
        recurring: recurringSettings,
        nextOccurrence: recurringSettings?.enabled ? computeNextOccurrence(recurringSettings) : null,
        lastCompletedAt: null
    };

    if (!state.activeTasks) state.activeTasks = [];
    state.activeTasks.push(newTask);
    persist();
    renderActiveTasks();
    showToast('✓ Compito aggiunto');
    checkAndScheduleNotifications(state.activeTasks);
    syncTasksToServiceWorker();
    return newTask;
}

export function updateTask(taskId, taskData) {
    const task = state.activeTasks.find(t => t.id === taskId);
    if (!task) return;
    const recurringSettings = taskData.recurring || { enabled: false };

    task.name = taskData.name;
    task.category = taskData.category || task.category;
    task.deadline = taskData.deadline || null;
    task.notes = taskData.notes || '';
    task.recurring = recurringSettings;
    task.nextOccurrence = recurringSettings?.enabled ? computeNextOccurrence(recurringSettings) : null;

    persist();
    renderActiveTasks();
    showToast('Compito aggiornato');
    checkAndScheduleNotifications(state.activeTasks);
    syncTasksToServiceWorker();
}

export function toggleTaskComplete(id) {
    const task = state.activeTasks.find(t => t.id === id);
    if (!task) return;

    if (task.recurring?.enabled) {
        task.lastCompletedAt = new Date().toISOString();
        task.nextOccurrence = computeNextOccurrence(task.recurring);
        task.notifiedRecurringStuckAt = null;
        task.notifiedRecurringUpcomingAt = null;
        showToast('🔄 Compito ricorrente completato');
    } else if (task.status === 'completed') {
        task.status = 'active';
        showToast('▶️ Compito riattivato');
    } else {
        task.status = 'completed';
        addGardenPoints(10);
        showToast('✓ Compito completato! +10 punti');
    }
    persist();
    renderActiveTasks();
    checkAndScheduleNotifications(state.activeTasks);
    syncTasksToServiceWorker();
}

// Recurring Task Logic
export function toggleRecurringSection() {
    const isRecurring = document.getElementById('taskRecurringInput').checked;
    document.getElementById('recurringSection').style.display = isRecurring ? 'block' : 'none';
}

export function updateRecurringDaysVisibility() {
    const pattern = document.getElementById('taskRecurringPatternInput').value;
    const daysGroup = document.getElementById('recurringDaysGroup');
    daysGroup.style.display = pattern === 'weekly' ? 'block' : 'none';
    updateNextOccurrencePreview();
}

export function updateNextOccurrencePreview() {
    // Simplified preview logic
    const pattern = document.getElementById('taskRecurringPatternInput').value;
    const previewEl = document.getElementById('nextOccurrencePreview');
    if (!previewEl) return;

    let text = '';
    if (pattern === 'daily') text = 'Ogni giorno';
    else if (pattern === 'weekly') {
        const days = Array.from(document.querySelectorAll('#recurringDaysGroup input:checked')).map(cb => cb.nextElementSibling.textContent);
        text = days.length ? `Ogni ${days.join(', ')}` : 'Seleziona i giorni';
    } else if (pattern === 'biweekly') text = 'Ogni 2 settimane';
    else if (pattern === 'monthly') text = 'Ogni mese';

    previewEl.textContent = `Prossima: ${text}`;
}

export function deleteTask(id) {
    if (!confirm('Eliminare questo compito?')) return;
    state.activeTasks = state.activeTasks.filter(t => t.id !== id);
    persist();
    renderActiveTasks();
    showToast('🗑️ Compito eliminato');
    checkAndScheduleNotifications(state.activeTasks);
    syncTasksToServiceWorker();
}

export function setTaskStatusFilter(status) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.filter-chip[data-status="${status}"]`)?.classList.add('selected');
    renderActiveTasks();
    // Note: renderActiveTasks needs to handle filtering logic.
}

export function getRecurringSettingsFromUI() {
    const isRecurring = document.getElementById('taskRecurringInput')?.checked;
    if (!isRecurring) return { enabled: false };

    const pattern = document.getElementById('taskRecurringPatternInput')?.value || 'daily';
    const days = Array.from(document.querySelectorAll('#recurringDaysGroup input:checked'))
        .map(cb => Number(cb.value))
        .filter(v => Number.isFinite(v));

    return {
        enabled: true,
        pattern,
        days
    };
}

function collectRecurringSettings() {
    return getRecurringSettingsFromUI();
}

function computeNextOccurrence(recurring) {
    if (!recurring?.enabled) return null;
    const today = startOfDay(new Date());

    if (recurring.pattern === 'daily') {
        return toIsoDate(addDays(today, 1));
    }

    if (recurring.pattern === 'weekly') {
        return toIsoDate(nextWeekday(today, recurring.days));
    }

    if (recurring.pattern === 'biweekly') {
        const next = nextWeekday(today, recurring.days);
        if (next) return toIsoDate(next);
        return toIsoDate(addDays(today, 14));
    }

    if (recurring.pattern === 'monthly') {
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        return toIsoDate(startOfDay(nextMonth));
    }

    return null;
}

function nextWeekday(startDate, days) {
    if (!Array.isArray(days) || days.length === 0) return null;
    const sorted = [...days].sort();
    for (let offset = 0; offset <= 7; offset++) {
        const candidate = addDays(startDate, offset);
        if (sorted.includes(candidate.getDay()) && offset > 0) {
            return candidate;
        }
    }
    return addDays(startDate, 7);
}

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function toIsoDate(date) {
    return new Date(date).toISOString();
}

function syncTasksToServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const controller = navigator.serviceWorker.controller;
    if (!controller) return;
    controller.postMessage({
        type: 'TASKS_SYNC',
        payload: {
            tasks: state.activeTasks || [],
            settings: state.notificationSettings || {}
        }
    });
}
