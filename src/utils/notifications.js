import { state, persist } from './state.js';
import { showToast } from '../main.js';

const scheduled = new Map();

function canNotify() {
    return state.notificationSettings.enabled
        && ('Notification' in window)
        && Notification.permission === 'granted';
}

export function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showToast('❌ Notifiche non supportate');
        return;
    }
    if (Notification.permission === 'granted') {
        state.notificationSettings.enabled = true;
        persist();
        showToast('✓ Notifiche già attive');
        updateNotificationStatusUI();
        return;
    }
    if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                state.notificationSettings.enabled = true;
                persist();
                showToast('✓ Notifiche attivate');
                registerBackgroundNotifications();
                updateNotificationStatusUI();
            } else {
                showToast('❌ Notifiche rifiutate');
                updateNotificationStatusUI();
            }
        });
    }
}

export function checkAndScheduleNotifications(activeTasks) {
    if (!canNotify()) return;
    if (!Array.isArray(activeTasks)) return;

    const now = Date.now();
    const stuckDays = state.notificationSettings.taskStuckDays || 3;
    const deadlineDays = state.notificationSettings.deadlineWarningDays || 2;
    const stuckMs = stuckDays * 86400000;
    const deadlineMs = deadlineDays * 86400000;

    activeTasks.filter(t => t.status === 'active').forEach(task => {
        const createdAt = task.createdAt ? new Date(task.createdAt).getTime() : null;
        const deadlineAt = task.deadline ? new Date(task.deadline).getTime() : null;
        const nextOccurrenceAt = task.nextOccurrence ? new Date(task.nextOccurrence).getTime() : null;

        // Stuck notification (non-recurring)
        if (!task.recurring?.enabled && createdAt) {
            const stuckAt = createdAt + stuckMs;
            const key = `${task.id}:stuck`;
            if (task.notifiedStuckAt) {
                clearScheduled(key);
            } else if (now >= stuckAt) {
                sendNotification(
                    'Compito fermo',
                    `“${task.name}” è fermo da ${stuckDays} giorni.`,
                    key
                );
                task.notifiedStuckAt = new Date().toISOString();
                persist();
            } else {
                scheduleNotification(key, stuckAt, () => {
                    sendNotification(
                        'Compito fermo',
                        `“${task.name}” è fermo da ${stuckDays} giorni.`,
                        key
                    );
                    task.notifiedStuckAt = new Date().toISOString();
                    persist();
                });
            }
        }

        // Deadline warning (non-recurring)
        if (deadlineAt && deadlineAt > now && !task.recurring?.enabled) {
            const warnAt = deadlineAt - deadlineMs;
            const key = `${task.id}:deadline`;
            if (task.notifiedDeadlineAt) {
                clearScheduled(key);
            } else if (now >= warnAt) {
                sendNotification(
                    'Scadenza vicina',
                    `“${task.name}” scade tra ${deadlineDays} giorni.`,
                    key
                );
                task.notifiedDeadlineAt = new Date().toISOString();
                persist();
            } else {
                scheduleNotification(key, warnAt, () => {
                    sendNotification(
                        'Scadenza vicina',
                        `“${task.name}” scade tra ${deadlineDays} giorni.`,
                        key
                    );
                    task.notifiedDeadlineAt = new Date().toISOString();
                    persist();
                });
            }
        }

        // Recurring stuck (based on next occurrence)
        if (task.recurring?.enabled && nextOccurrenceAt) {
            const stuckAt = nextOccurrenceAt + stuckMs;
            const key = `${task.id}:recurring-stuck`;
            if (task.notifiedRecurringStuckAt) {
                clearScheduled(key);
            } else if (now >= stuckAt) {
                sendNotification(
                    'Compito ricorrente fermo',
                    `“${task.name}” è fermo da ${stuckDays} giorni.`,
                    key
                );
                task.notifiedRecurringStuckAt = new Date().toISOString();
                persist();
            } else {
                scheduleNotification(key, stuckAt, () => {
                    sendNotification(
                        'Compito ricorrente fermo',
                        `“${task.name}” è fermo da ${stuckDays} giorni.`,
                        key
                    );
                    task.notifiedRecurringStuckAt = new Date().toISOString();
                    persist();
                });
            }
        }

        // Recurring upcoming (based on next occurrence)
        if (task.recurring?.enabled && nextOccurrenceAt && nextOccurrenceAt > now) {
            const warnAt = nextOccurrenceAt - deadlineMs;
            const key = `${task.id}:recurring-upcoming`;
            if (task.notifiedRecurringUpcomingAt) {
                clearScheduled(key);
            } else if (now >= warnAt) {
                sendNotification(
                    'Compito ricorrente in arrivo',
                    `“${task.name}” è previsto tra ${deadlineDays} giorni.`,
                    key
                );
                task.notifiedRecurringUpcomingAt = new Date().toISOString();
                persist();
            } else {
                scheduleNotification(key, warnAt, () => {
                    sendNotification(
                        'Compito ricorrente in arrivo',
                        `“${task.name}” è previsto tra ${deadlineDays} giorni.`,
                        key
                    );
                    task.notifiedRecurringUpcomingAt = new Date().toISOString();
                    persist();
                });
            }
        }
    });
}

export function disableNotifications() {
    state.notificationSettings.enabled = false;
    persist();
    clearAllScheduled();
    unregisterBackgroundNotifications();
    updateNotificationStatusUI();
    showToast('Notifiche disattivate');
}

export function updateNotificationStatusUI() {
    const enableBtn = document.getElementById('notificationsEnableBtn');
    const disableBtn = document.getElementById('notificationsDisableBtn');
    const status = document.getElementById('notificationsStatus');

    const supported = 'Notification' in window;
    const permission = supported ? Notification.permission : 'unsupported';
    const enabled = state.notificationSettings.enabled && permission === 'granted';

    if (enableBtn) enableBtn.disabled = !supported || permission === 'denied' || enabled;
    if (disableBtn) disableBtn.disabled = !enabled;

    if (status) {
        if (!supported) status.textContent = 'Notifiche non supportate dal browser.';
        else if (permission === 'denied') status.textContent = 'Notifiche bloccate dal browser.';
        else if (enabled) status.textContent = 'Notifiche attive.';
        else status.textContent = 'Notifiche non attive.';
    }

    const stuckValue = document.getElementById('taskStuckDaysValue');
    const deadlineValue = document.getElementById('deadlineWarningDaysValue');
    const stuckInput = document.getElementById('taskStuckDaysInput');
    const deadlineInput = document.getElementById('deadlineWarningDaysInput');

    const stuckDays = state.notificationSettings.taskStuckDays || 3;
    const deadlineDays = state.notificationSettings.deadlineWarningDays || 2;

    if (stuckValue) stuckValue.textContent = stuckDays;
    if (deadlineValue) deadlineValue.textContent = deadlineDays;
    if (stuckInput) stuckInput.value = stuckDays;
    if (deadlineInput) deadlineInput.value = deadlineDays;
}

export function updateNotificationDays() {
    const stuckInput = document.getElementById('taskStuckDaysInput');
    const deadlineInput = document.getElementById('deadlineWarningDaysInput');
    if (!stuckInput || !deadlineInput) return;

    const stuck = Number(stuckInput.value);
    const deadline = Number(deadlineInput.value);

    if (!Number.isFinite(stuck) || stuck < 1 || stuck > 30) {
        showToast('Giorni fermo non valido');
        return;
    }
    if (!Number.isFinite(deadline) || deadline < 1 || deadline > 30) {
        showToast('Giorni scadenza non valido');
        return;
    }

    state.notificationSettings.taskStuckDays = Math.round(stuck);
    state.notificationSettings.deadlineWarningDays = Math.round(deadline);
    persist();
    updateNotificationStatusUI();
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'TASKS_SYNC',
            payload: {
                tasks: state.activeTasks || [],
                settings: state.notificationSettings || {}
            }
        });
    }
    showToast('Notifiche aggiornate');
}

function scheduleNotification(key, timestamp, callback) {
    if (scheduled.has(key)) return;
    const delay = Math.max(0, timestamp - Date.now());
    const timeoutId = setTimeout(() => {
        scheduled.delete(key);
        callback();
    }, delay);
    scheduled.set(key, timeoutId);
}

function clearScheduled(key) {
    const timeoutId = scheduled.get(key);
    if (timeoutId) {
        clearTimeout(timeoutId);
        scheduled.delete(key);
    }
}

function clearAllScheduled() {
    scheduled.forEach(timeoutId => clearTimeout(timeoutId));
    scheduled.clear();
}

function sendNotification(title, body, tag) {
    if (!canNotify()) return;
    const options = {
        body,
        tag,
        icon: 'icon-192.png'
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) reg.showNotification(title, options);
            else new Notification(title, options);
        });
    } else {
        new Notification(title, options);
    }
}

async function registerBackgroundNotifications() {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    if (!reg) return;
    if ('periodicSync' in reg) {
        try {
            await reg.periodicSync.register('adhd-notifications', {
                minInterval: 6 * 60 * 60 * 1000 // 6 ore
            });
        } catch (_) {
            // Ignore if not allowed
        }
    }
}

async function unregisterBackgroundNotifications() {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    if (!reg || !('periodicSync' in reg)) return;
    try {
        const tags = await reg.periodicSync.getTags();
        if (tags.includes('adhd-notifications')) {
            await reg.periodicSync.unregister('adhd-notifications');
        }
    } catch (_) {
        // Ignore
    }
}
