// Storage and state management
import { state } from './state.js';

export const STORAGE_KEY = 'come-stai-v2';
export const SCHEMA_VERSION = 1;

function saveState() {
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
          showToast('⚠️ Dati vecchi archiviati (storage pieno)');
          return;
        } catch (retryErr) {
        }
      }

      showToast('❌ Storage pieno - esporta i dati');
    } else {
      showToast('❌ Errore salvataggio dati');
    }
  }
}

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return;
    const loaded = JSON.parse(s);

    if (!loaded || typeof loaded !== 'object') {
      return;
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
        showToast('⚠️ Dati recuperati da backup');
        return;
      }
    } catch (backupErr) {
    }
    showToast('⚠️ Errore caricamento dati');
  }
}

function exportData() {
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
    showToast('💾 Backup scaricato');
  } catch (err) {
    showToast('❌ Errore export');
  }
}

function importData() {
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
          showToast('❌ File non valido');
          return;
        }
        const hasData = state.history.length > 0 || state.diary.length > 0;
        if (hasData) {
          if (!confirm('Attenzione: questo sovrascriverà i tuoi dati attuali. Continua?')) {
            return;
          }
        }
        state.history = Array.isArray(imported.history) ? imported.history : [];
        state.diary = Array.isArray(imported.diary) ? imported.diary : [];
        state.patterns = imported.patterns || {};
        saveState();
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen) {
          const id = activeScreen.id;
          if (id === 'insightsScreen') renderInsights();
          if (id === 'historyScreen') renderHistory();
          if (id === 'diaryScreen') renderDiaryEntries();
        }

        showToast('✅ Dati importati (' + state.history.length + ' momenti, ' + state.diary.length + ' note)');
      } catch (err) {
        showToast('❌ Errore lettura file');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function clearAllData() {
  if (!confirm('Attenzione: questo eliminerà TUTTI i tuoi dati in modo permanente. Sei sicuro?')) {
    return;
  }
  if (!confirm('Ultima conferma: eliminare tutti i dati?')) {
    return;
  }

  state.history = [];
  state.diary = [];
  state.patterns = {};

  saveState();
  try {
    localStorage.removeItem(STORAGE_KEY + '-backup');
  } catch (err) {
  }
  showToast('🗑️ Tutti i dati eliminati');
  screenHistory = ['homeScreen'];
  showScreen('homeScreen');
}

export { saveState, loadState, exportData, importData, clearAllData };
