// Main application entry point
import './utils/state.js';
import { loadState, saveState } from './utils/storage.js';
import { feelings } from './data/feelings.js';
import { triggerCategories, triggers } from './data/triggers.js';
import { diaryMoods } from './data/moods.js';
import { updateMainButton, checkGardenDecay } from './components/garden.js';

// Make key functions available globally for inline onclick handlers
window.startFlow = startFlow;
window.showScreen = showScreen;
window.goBack = goBack;
// ... (all other functions will be imported and exported)

// Initialize app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  checkLegalConsent();
  loadState();
  updateHomeScreen();
  renderFeelings();
  renderTriggers();
  renderDiaryMoods();
  checkAndScheduleNotifications();
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// TODO: Import and expose all remaining functions
