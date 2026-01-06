// Storage and state management
import { state } from './state.js';

export const STORAGE_KEY = 'come-stai-v2';
export const SCHEMA_VERSION = 1;

export function saveState() {
  try {
    state.version = SCHEMA_VERSION;
    state.lastSaved = new Date().toISOString();

    const data = JSON.stringify(state);
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) {
        localStorage.setItem(STORAGE_KEY + '-backup', current);
      }
    } catch (backupErr) {
    }
    localStorage.setItem(STORAGE_KEY, data);
    return { success: true };
  } catch (err) {
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
      const originalHistoryLength = state.history.length;
      const originalDiaryLength = state.diary.length;

      state.history = state.history.filter(e => new Date(e.date).getTime() > sixMonthsAgo);
      state.diary = state.diary.filter(e => new Date(e.date).getTime() > sixMonthsAgo);

      const removedHistory = originalHistoryLength - state.history.length;
      const removedDiary = originalDiaryLength - state.diary.length;
      if (removedHistory > 0 || removedDiary > 0) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          return { success: true, archived: true };
        } catch (retryErr) {
        }
      }

      return { success: false, error: 'quota_exceeded' };
    } else {
      return { success: false, error: 'save_error' };
    }
  }
}

export function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return { success: true };
    const loaded = JSON.parse(s);

    if (!loaded || typeof loaded !== 'object') {
      return { success: true };
    }
    if (!loaded.version || loaded.version < SCHEMA_VERSION) {
      loaded.version = SCHEMA_VERSION;
    }
    state.history = Array.isArray(loaded.history) ? loaded.history : [];
    state.diary = Array.isArray(loaded.diary) ? loaded.diary : [];
    state.patterns = (loaded.patterns && typeof loaded.patterns === 'object') ? loaded.patterns : {};
    state.garden = (loaded.garden && typeof loaded.garden === 'object') ? loaded.garden : {points:0,level:0,lastActivityDate:null,isPaused:false,pauseUntil:null};
    state.tasks = (loaded.tasks && typeof loaded.tasks === 'object') ? loaded.tasks : {};
    state.activeTasks = Array.isArray(loaded.activeTasks) ? loaded.activeTasks : [];
    state.notificationSettings = (loaded.notificationSettings && typeof loaded.notificationSettings === 'object') ? loaded.notificationSettings : {enabled:false,taskStuckDays:3,deadlineWarningDays:2};
    state.userName = (loaded.userName && typeof loaded.userName === 'string') ? loaded.userName : 'Bentornato';
    state.version = SCHEMA_VERSION;
    return { success: true };
  } catch (err) {
    try {
      const backup = localStorage.getItem(STORAGE_KEY + '-backup');
      if (backup) {
        const loaded = JSON.parse(backup);
        state.history = Array.isArray(loaded.history) ? loaded.history : [];
        state.diary = Array.isArray(loaded.diary) ? loaded.diary : [];
        state.patterns = loaded.patterns || {};
        state.garden = (loaded.garden && typeof loaded.garden === 'object') ? loaded.garden : {points:0,level:0,lastActivityDate:null,isPaused:false,pauseUntil:null};
        state.tasks = (loaded.tasks && typeof loaded.tasks === 'object') ? loaded.tasks : {};
        state.activeTasks = Array.isArray(loaded.activeTasks) ? loaded.activeTasks : [];
        state.notificationSettings = (loaded.notificationSettings && typeof loaded.notificationSettings === 'object') ? loaded.notificationSettings : {enabled:false,taskStuckDays:3,deadlineWarningDays:2};
        state.userName = (loaded.userName && typeof loaded.userName === 'string') ? loaded.userName : 'Bentornato';
        return { success: true, fromBackup: true };
      }
    } catch (backupErr) {
    }
    return { success: false, error: 'load_error' };
  }
}

export function exportData() {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'come-stai-backup-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (err) {
    return { success: false, error: 'export_error' };
  }
}

export function importData(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!imported || typeof imported !== 'object') {
          if (callback) callback({ success: false, error: 'invalid_file' });
          return;
        }
        const hasData = state.history.length > 0 || state.diary.length > 0;
        if (hasData) {
          if (!confirm('Attenzione: questo sovrascriverà i tuoi dati attuali. Continua?')) {
            if (callback) callback({ success: false, error: 'cancelled' });
            return;
          }
        }
        state.history = Array.isArray(imported.history) ? imported.history : [];
        state.diary = Array.isArray(imported.diary) ? imported.diary : [];
        state.patterns = imported.patterns || {};
        saveState();

        if (callback) callback({ success: true, count: { history: state.history.length, diary: state.diary.length } });
      } catch (err) {
        if (callback) callback({ success: false, error: 'read_error' });
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export function clearAllData() {
  if (!confirm('Attenzione: questo eliminerà TUTTI i tuoi dati in modo permanente. Sei sicuro?')) {
    return { success: false, error: 'cancelled' };
  }
  if (!confirm('Ultima conferma: eliminare tutti i dati?')) {
    return { success: false, error: 'cancelled' };
  }

  state.history = [];
  state.diary = [];
  state.patterns = {};

  saveState();
  try {
    localStorage.removeItem(STORAGE_KEY + '-backup');
  } catch (err) {
  }

  return { success: true };
}
