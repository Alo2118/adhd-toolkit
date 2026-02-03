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
        lastVisit: new Date().toISOString(),
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

export const state = { ...defaultState };

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
    }

    // Ensure schema compatibility and required defaults
    mergeDefaults(state, defaultState);

    // Normalize key collections
    if (!Array.isArray(state.history)) state.history = [];
    if (!Array.isArray(state.diary)) state.diary = [];
    if (!Array.isArray(state.activeTasks)) state.activeTasks = [];
    if (typeof state.tasks !== 'object' || state.tasks === null) state.tasks = {};

    // Update streak logic
    checkStreak();
}

export function persist() {
    // Don't save runtime state
    const { runtime, ...stateToSave } = state;
    stateToSave.lastSaved = new Date().toISOString();
    saveState(stateToSave);
}

function checkStreak() {
    const lastVisit = new Date(state.garden.lastVisit).toDateString();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastVisit === yesterday) {
        state.garden.streak++;
    } else if (lastVisit !== today) {
        state.garden.streak = 1;
    }

    state.garden.lastVisit = new Date().toISOString();
    persist();
}
