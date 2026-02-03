const STORAGE_KEY = 'adhdToolkitState';
const LEGACY_STORAGE_KEY = 'come-stai-v2';

export function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Errore nel caricamento dati:', e);
            return null;
        }
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
        try {
            return JSON.parse(legacy);
        } catch (e) {
            console.error('Errore nel caricamento dati legacy:', e);
            return null;
        }
    }
    return null;
}

export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Errore nel salvataggio:', e);
    }
}

export function exportData(state) {
    const { runtime, ...cleanState } = state || {};
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
            // Basic validation
            if (data && Array.isArray(data.history) && data.garden) {
                const { runtime, ...cleanData } = data;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
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
    localStorage.removeItem('adhd-toolkit-install-prompted');
}
