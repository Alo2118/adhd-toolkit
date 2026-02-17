const STORAGE_KEY = 'adhdToolkitState';
const LEGACY_STORAGE_KEY = 'come-stai-v2';
const BACKUP_KEY = 'adhdToolkitState_backup';

export function loadState() {
    // Tentativo 1: chiave principale
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                return parsed;
            }
        } catch (e) {
            console.error('Errore nel parsing dei dati principali:', e);
            // Salva una copia di emergenza prima di tentare il backup
            try {
                localStorage.setItem(STORAGE_KEY + '_corrupted_' + Date.now(), saved);
            } catch (_) { /* ignore */ }
        }
    }

    // Tentativo 2: backup automatico
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
        try {
            const parsed = JSON.parse(backup);
            if (parsed && typeof parsed === 'object') {
                console.warn('Dati principali non disponibili, ripristino da backup automatico');
                // Ripristina i dati principali dal backup
                localStorage.setItem(STORAGE_KEY, backup);
                return parsed;
            }
        } catch (e) {
            console.error('Errore nel parsing del backup:', e);
        }
    }

    // Tentativo 3: chiave legacy
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
        try {
            const parsed = JSON.parse(legacy);
            if (parsed && typeof parsed === 'object') {
                return parsed;
            }
        } catch (e) {
            console.error('Errore nel caricamento dati legacy:', e);
        }
    }

    return null;
}

export function saveState(state) {
    try {
        const json = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, json);
        // Backup automatico: salva una copia di sicurezza ad ogni persist
        // per proteggersi da corruzione dati
        localStorage.setItem(BACKUP_KEY, json);
    } catch (e) {
        console.error('Errore nel salvataggio:', e);
    }
}

export function exportData(state) {
    // Rimuovi dati transitori e runtime dall'export
    const { runtime, currentFeeling, currentTrigger, diaryDraft, ...cleanState } = state || {};
    const payload = {
        meta: {
            app: 'adhd-toolkit',
            version: state?.version || 1,
            exportedAt: new Date().toISOString()
        },
        data: cleanState
    };
    const dataStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const exportFileDefaultName = `adhd-toolkit-backup-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.href = URL.createObjectURL(blob);
    linkElement.download = exportFileDefaultName;
    linkElement.click();
    URL.revokeObjectURL(linkElement.href);
}

export function importData(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            const data = parsed?.data || parsed;
            // Validazione: almeno un oggetto con una struttura riconoscibile
            // (garden oppure history oppure settings)
            if (data && typeof data === 'object' &&
                (data.garden || Array.isArray(data.history) || data.settings)) {
                const { runtime, currentFeeling, currentTrigger, ...cleanData } = data;
                // Assicura che le collezioni base esistano
                if (!Array.isArray(cleanData.history)) cleanData.history = [];
                if (!Array.isArray(cleanData.diary)) cleanData.diary = [];
                if (!Array.isArray(cleanData.activeTasks)) cleanData.activeTasks = [];
                if (!cleanData.garden) cleanData.garden = { points: 0, level: 1, streak: 0, lastVisit: null, isPaused: false, pauseUntil: null };
                const json = JSON.stringify(cleanData);
                // Salva sia chiave principale che backup
                localStorage.setItem(STORAGE_KEY, json);
                localStorage.setItem(BACKUP_KEY, json);
                callback(true, cleanData);
            } else {
                callback(false, null);
            }
        } catch (ex) {
            callback(false, null);
        }
    };
    reader.readAsText(file);
}

export function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    localStorage.removeItem('adhd-toolkit-install-prompted');
    localStorage.removeItem('adhd-toolkit-onboarding-done');
    localStorage.removeItem('adhd-toolkit-consent');
    // Rimuovi eventuali chiavi di corruzione salvate
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY + '_corrupted_')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
}
