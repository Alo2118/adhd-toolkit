import { loadState, saveState } from './storage.js';

export const defaultState = {
    version: 1,
    lastSaved: null,
    userName: 'Bentornato',

    history: [],
    diary: [],
    patterns: {
        feelingCounts: {},
        triggerCounts: {},
        strategyEffectiveness: {}
    },

    garden: {
        points: 0,
        level: 1,
        streak: 0,
        lastVisit: null,
        isPaused: false,
        pauseUntil: null
    },

    tasks: {},
    activeTasks: [],

    notificationSettings: {
        enabled: false,
        taskStuckDays: 3,
        deadlineWarningDays: 2
    },

    settings: {
        theme: 'dark',
        notifications: true
    },

    report: {
        lastPrintedAt: null
    },

    currentFeeling: null,
    currentTrigger: null,
    diaryDraft: {
        text: '',
        mood: null,
        intensity: 0,
        tags: []
    },

    // Temporary runtime state (not saved)
    runtime: {
        previousScreen: null
    }
};

// Deep copy per evitare che state e defaultState condividano riferimenti
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepClone);
    const clone = {};
    for (const key of Object.keys(obj)) {
        clone[key] = deepClone(obj[key]);
    }
    return clone;
}

export const state = deepClone(defaultState);

// Flag: true solo dopo che initState ha caricato i dati da localStorage
let hydrated = false;

function mergeDefaults(target, defaults) {
    Object.keys(defaults).forEach(key => {
        const defaultValue = defaults[key];
        const currentValue = target[key];

        if (currentValue === undefined || currentValue === null) {
            target[key] = Array.isArray(defaultValue) ? [...defaultValue] : defaultValue;
            return;
        }

        if (Array.isArray(defaultValue)) {
            if (!Array.isArray(currentValue)) target[key] = [];
            return;
        }

        if (typeof defaultValue === 'object' && defaultValue !== null) {
            if (typeof currentValue !== 'object' || currentValue === null) {
                target[key] = { ...defaultValue };
            } else {
                mergeDefaults(currentValue, defaultValue);
            }
        }
    });
}

export function initState() {
    const saved = loadState();
    if (saved) {
        Object.keys(saved).forEach(key => {
            state[key] = saved[key];
        });
        hydrated = true;
    }

    // Ensure schema compatibility and required defaults
    mergeDefaults(state, defaultState);

    // Normalize key collections
    if (!Array.isArray(state.history)) state.history = [];
    if (!Array.isArray(state.diary)) state.diary = [];
    if (!Array.isArray(state.activeTasks)) state.activeTasks = [];
    if (typeof state.tasks !== 'object' || state.tasks === null) state.tasks = {};

    // Update streak logic (solo se abbiamo dati reali)
    if (hydrated) {
        checkStreak();
    }
}

export function persist() {
    // Non sovrascrivere dati reali con default se lo state non è stato idratato
    if (!hydrated) {
        // Se non c'è mai stato un salvataggio (primo avvio), permettiamo il persist
        const existing = loadState();
        if (existing && existing.garden && existing.garden.points > 0) {
            console.warn('persist() bloccato: state non idratato ma dati esistenti in localStorage');
            return;
        }
        hydrated = true; // Primo avvio, nessun dato da proteggere
    }

    // Don't save runtime state
    const { runtime, ...stateToSave } = state;
    stateToSave.lastSaved = new Date().toISOString();
    saveState(stateToSave);
}

function checkStreak() {
    // Rispetta la pausa del giardino
    if (state.garden.isPaused) {
        const pauseUntil = state.garden.pauseUntil ? new Date(state.garden.pauseUntil).getTime() : null;
        if (!pauseUntil || Date.now() < pauseUntil) {
            // Giardino in pausa: aggiorna lastVisit ma non toccare lo streak
            state.garden.lastVisit = new Date().toISOString();
            persist();
            return;
        }
        // Pausa scaduta, riprendi normalmente
        state.garden.isPaused = false;
        state.garden.pauseUntil = null;
    }

    const lastVisit = state.garden.lastVisit
        ? new Date(state.garden.lastVisit).toDateString()
        : null;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (!lastVisit) {
        // Primo avvio in assoluto
        state.garden.streak = 1;
    } else if (lastVisit === yesterday) {
        state.garden.streak++;
    } else if (lastVisit !== today) {
        state.garden.streak = 1;
    }

    state.garden.lastVisit = new Date().toISOString();
    persist();
}
