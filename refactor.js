#!/usr/bin/env node

/**
 * Automatic Refactoring Script
 * Converts monolithic index.html into modular ES6 structure
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting automatic refactoring...\n');

// Read the original file
const originalContent = fs.readFileSync('index.html.backup', 'utf-8');

// Extract CSS (between <style> and </style>)
const cssMatch = originalContent.match(/<style>([\s\S]*?)<\/style>/);
const fullCSS = cssMatch ? cssMatch[1].trim() : '';

// Split CSS into logical files
console.log('📦 Extracting CSS...');

// 1. Base styles (reset, html, body, app)
const baseCSS = fullCSS.match(/\*\{[^}]+\}|html,body\{[^}]+\}|body\{[^}]+\}|\.app\{[^}]+\}|\.screen[^{]*\{[^}]+\}/g) || [];
fs.writeFileSync('src/styles/base.css', `/* Base styles and resets */\n${baseCSS.join('\n')}\n`);

// 2. Animations
const animationsMatch = fullCSS.match(/@keyframes[^}]+\}[^}]*\}/g) || [];
fs.writeFileSync('src/styles/animations.css', `/* Animations */\n${animationsMatch.join('\n')}\n`);

// 3. Components (everything else)
const componentsCSS = fullCSS
  .replace(/@keyframes[^}]+\}[^}]*\}/g, '') // Remove animations
  .replace(/\*\{[^}]+\}|html,body\{[^}]+\}|body\{[^}]+\}|\.app\{[^}]+\}|\.screen[^{]*\{[^}]+\}/g, '') // Remove base
  .trim();
fs.writeFileSync('src/styles/components.css', `/* Component styles */\n${componentsCSS}\n`);

console.log('  ✓ variables.css (already created)');
console.log('  ✓ base.css');
console.log('  ✓ animations.css');
console.log('  ✓ components.css\n');

// Extract JavaScript
console.log('📦 Extracting JavaScript...');

const scriptMatch = originalContent.match(/<script>([\s\S]*?)<\/script>/);
const fullJS = scriptMatch ? scriptMatch[1].trim() : '';

// 2. Extract data objects
console.log('  📊 Extracting data...');

// Feelings
const feelingsMatch = fullJS.match(/const feelings\s*=\s*(\[[^\]]*\][^;]*);/s);
if (feelingsMatch) {
  fs.writeFileSync('src/data/feelings.js', `export const feelings = ${feelingsMatch[1]};\n`);
  console.log('    ✓ feelings.js');
}

// Trigger categories
const triggersMatch = fullJS.match(/const triggerCategories\s*=\s*(\[[^\]]*\][^;]*);/s);
if (triggersMatch) {
  fs.writeFileSync('src/data/triggers.js', `export const triggerCategories = ${triggersMatch[1]};\n\n// Flat array of all triggers\nexport const triggers = triggerCategories.flatMap(cat => cat.triggers);\n`);
  console.log('    ✓ triggers.js');
}

// Learn topics
const learnMatch = fullJS.match(/const learnTopics\s*=\s*(\[[^\]]*\][^;]*);/s);
if (learnMatch) {
  fs.writeFileSync('src/data/learn.js', `export const learnTopics = ${learnMatch[1]};\n`);
  console.log('    ✓ learn.js');
}

// Context strategies
const strategiesMatch = fullJS.match(/const contextStrategies\s*=\s*(\{[^;]*\});/s);
if (strategiesMatch) {
  fs.writeFileSync('src/data/strategies.js', `export const contextStrategies = ${strategiesMatch[1]};\n`);
  console.log('    ✓ strategies.js');
}

// Responses
const responsesMatch = fullJS.match(/const responses\s*=\s*(\{[\s\S]*?\n\};)/);
if (responsesMatch) {
  fs.writeFileSync('src/data/responses.js', `export const responses = ${responsesMatch[1]}\n`);
  console.log('    ✓ responses.js');
}

// Diary moods
const moodsMatch = fullJS.match(/const diaryMoods\s*=\s*(\[[^\]]*\][^;]*);/s);
if (moodsMatch) {
  fs.writeFileSync('src/data/moods.js', `export const diaryMoods = ${moodsMatch[1]};\n`);
  console.log('    ✓ moods.js');
}

// 3. Extract utilities
console.log('  🔧 Extracting utilities...');

// Storage functions
const storageFuncs = [
  'saveState', 'loadState', 'exportData', 'importData', 'clearAllData'
].map(name => {
  const regex = new RegExp(`function ${name}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}(?=\\n(?:function|const|let|var|\\n|$))`, 'm');
  const match = fullJS.match(regex);
  return match ? match[0] : null;
}).filter(Boolean);

if (storageFuncs.length > 0) {
  const storageContent = `// Storage and state management\nimport { state } from './state.js';\n\nexport const STORAGE_KEY = 'come-stai-v2';\nexport const SCHEMA_VERSION = 1;\n\n${storageFuncs.join('\n\n')}\n\nexport { saveState, loadState, exportData, importData, clearAllData };\n`;
  fs.writeFileSync('src/utils/storage.js', storageContent);
  console.log('    ✓ storage.js');
}

// State object
const stateMatch = fullJS.match(/let state\s*=\s*\{[^;]+\};/s);
if (stateMatch) {
  fs.writeFileSync('src/utils/state.js', `// Application state\nexport ${stateMatch[0]}\n`);
  console.log('    ✓ state.js');
}

// Helper functions
const helperFuncs = [
  'showToast', 'toggleCheckbox', 'filterDataByPeriod',
  'detectTaskCategory', 'normalizeTaskName', 'getCategoryEmoji'
].map(name => {
  const regex = new RegExp(`function ${name}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}(?=\\n(?:function|const|let|var|\\n|$))`, 'm');
  const match = fullJS.match(regex);
  return match ? match[0] : null;
}).filter(Boolean);

if (helperFuncs.length > 0) {
  fs.writeFileSync('src/utils/helpers.js', `// Helper utility functions\n\n${helperFuncs.join('\n\n')}\n\nexport { ${helperFuncs.map(f => f.match(/function (\w+)/)[1]).join(', ')} };\n`);
  console.log('    ✓ helpers.js');
}

// 4. Extract components
console.log('  🧩 Extracting components...');

// Garden component
const gardenFuncs = [
  'checkGardenDecay', 'getGardenLevel', 'getGardenEmoji', 'getGardenName',
  'addGardenPoints', 'pauseGarden', 'resumeGarden',
  'updateGardenBadge', 'updateMainButton', 'showGardenPauseModal'
].map(name => {
  const regex = new RegExp(`function ${name}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}(?=\\n(?:function|const|let|var|\\n|$))`, 'm');
  const match = fullJS.match(regex);
  return match ? match[0] : null;
}).filter(Boolean);

if (gardenFuncs.length > 0) {
  fs.writeFileSync('src/components/garden.js', `// Garden gamification component\nimport { state } from '../utils/state.js';\nimport { saveState } from '../utils/storage.js';\nimport { showToast } from '../utils/helpers.js';\n\n${gardenFuncs.join('\n\n')}\n\nexport { ${gardenFuncs.map(f => f.match(/function (\w+)/)[1]).join(', ')} };\n`);
  console.log('    ✓ garden.js');
}

// PDF Report generator (the largest component)
const reportMatch = fullJS.match(/function generatePDFReport\s*\([^)]*\)\s*\{[\s\S]*?\n\}(?=\n\n\/\/|$)/m);
if (reportMatch) {
  fs.writeFileSync('src/report/pdf-generator.js', `// PDF Report Generator\nimport { state } from '../utils/state.js';\nimport { feelings } from '../data/feelings.js';\nimport { triggers } from '../data/triggers.js';\nimport { contextStrategies } from '../data/strategies.js';\n\n${reportMatch[0]}\n\nexport { generatePDFReport };\n`);
  console.log('    ✓ pdf-generator.js');
}

// 5. Create main.js entry point
console.log('  📄 Creating main.js...');

const mainJS = `// Main application entry point
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
`;

fs.writeFileSync('src/main.js', mainJS);
console.log('    ✓ main.js\n');

console.log('✅ Refactoring complete!');
console.log('\n📋 Next steps:');
console.log('  1. Update index.html to import src/main.js');
console.log('  2. Update service worker to cache src/ files');
console.log('  3. Test the application');
console.log('  4. Commit changes\n');
