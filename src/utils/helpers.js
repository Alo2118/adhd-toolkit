// Helper utility functions - Pure utilities only
// Functions that use state or DOM should be in main.js

// Toast notification
export function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Checkbox toggle helper
export function toggleCheckbox(id) {
  const checkbox = document.getElementById(id);
  checkbox.checked = !checkbox.checked;
  checkbox.parentElement.classList.toggle('checked', checkbox.checked);
}

// Filter data by period
export function filterDataByPeriod(data, periodDays) {
  if (periodDays === 0) return data;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - periodDays);
  return data.filter(item => new Date(item.date) >= cutoff);
}

// Task detection and categorization
export function detectTaskCategory(taskName) {
  const taskCategories = {
    studio: ['studiare', 'leggere', 'libro', 'esame', 'corso', 'imparare', 'università', 'scuola'],
    lavoro: ['lavoro', 'progetto', 'deadline', 'email', 'meeting', 'presentazione', 'report', 'cliente'],
    casa: ['pulire', 'cucina', 'spesa', 'bucato', 'ordinare', 'sistemare', 'riparare'],
    sociale: ['amici', 'famiglia', 'messaggio', 'chiamata', 'evento', 'compleanno', 'rispondere'],
    cura: ['doccia', 'denti', 'sport', 'palestra', 'medico', 'terapia', 'dormire', 'mangiare'],
    admin: ['bolletta', 'tasse', 'documenti', 'banca', 'assicurazione', 'burocrazia', 'appuntamento']
  };

  const t = taskName.toLowerCase();
  for (const [cat, keywords] of Object.entries(taskCategories)) {
    if (keywords.some(k => t.includes(k))) return cat;
  }
  return 'altro';
}

export function normalizeTaskName(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function getCategoryEmoji(cat) {
  const emojis = {
    studio: '📚',
    lavoro: '💼',
    casa: '🏠',
    sociale: '👥',
    cura: '💚',
    admin: '📋',
    altro: '📌'
  };
  return emojis[cat] || '📌';
}
