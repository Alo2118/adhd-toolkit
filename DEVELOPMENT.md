# Guida allo Sviluppo - ADHD Toolkit

> Documento di riferimento per sviluppare, correggere e mantenere l'app ADHD Toolkit.

---

## 1. Architettura del Progetto

### 1.1 Struttura File

```
adhd-toolkit/
├── index.html              # App principale (entry point)
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (cache strategy)
├── version.js              # Versione globale
├── PRD.md                  # Product Requirements Document
├── DEVELOPMENT.md          # Questo documento
│
├── src/
│   ├── main.js             # Logic principale (~2000+ righe)
│   │
│   ├── config/
│   │   └── version.js      # APP_VERSION export
│   │
│   ├── data/               # Dati statici (configurazione)
│   │   ├── feelings.js     # Emozioni con emoji
│   │   ├── triggers.js     # Trigger categorizzati
│   │   ├── moods.js        # Mood per diario
│   │   ├── strategies.js   # Strategie per contesto
│   │   ├── responses.js    # Risposte personalizzate
│   │   └── learn.js        # Contenuti educativi
│   │
│   ├── utils/              # Utility functions
│   │   ├── state.js        # State object globale
│   │   ├── storage.js      # localStorage management
│   │   └── helpers.js      # Utility pure functions
│   │
│   ├── components/         # Componenti logici
│   │   └── garden.js       # Sistema gamification
│   │
│   ├── report/             # Generazione PDF
│   │   └── pdf-generator.js
│   │
│   └── styles/             # CSS modulare
│       ├── variables.css   # CSS custom properties
│       ├── base.css        # Reset e base
│       ├── components.css  # Stili componenti
│       └── animations.css  # Animazioni
│
└── assets/                 # Icone e immagini
    ├── icon-192.png
    ├── icon-192.svg
    └── icon-512.png
```

### 1.2 Flusso Dati

```
User Action
    ↓
Event Handler (main.js)
    ↓
Update State (state.js)
    ↓
Save to localStorage (storage.js)
    ↓
Update UI (render functions)
```

---

## 2. Convenzioni di Codice

### 2.1 JavaScript

#### Naming Conventions
```javascript
// Variabili e funzioni: camelCase
let currentFlow = {};
function updateHomeScreen() {}

// Costanti: UPPER_SNAKE_CASE
const STORAGE_KEY = 'come-stai-v2';
const SCHEMA_VERSION = 1;

// Oggetti dati/config: camelCase
const feelings = [...];
const triggerCategories = [...];

// ID elementi DOM: camelCase
document.getElementById('homeScreen');
document.getElementById('feelingGrid');
```

#### Pattern Funzioni

```javascript
// 1. Funzioni render: renderXxx()
function renderFeelings() { /* genera HTML */ }
function renderHistory() { /* genera HTML */ }

// 2. Funzioni update: updateXxx()
function updateHomeScreen() { /* aggiorna stato UI */ }
function updateGardenBadge() { /* aggiorna badge */ }

// 3. Funzioni show: showXxx()
function showScreen(screenId) { /* navigazione */ }
function showToast(message) { /* notifica */ }

// 4. Funzioni get: getXxx() - ritornano valore
function getBestStrategyForFeeling(feeling) { return strategy; }
function getGardenLevel() { return level; }

// 5. Funzioni check: checkXxx() - ritornano boolean o side effects
function checkGardenDecay() { /* verifica e applica */ }
function checkLegalConsent() { /* verifica e mostra screen */ }

// 6. Event handlers: handleXxx() o verbo diretto
function handleFeelingSelect(feeling) {}
function selectIntensity(level) {}
```

#### Struttura Funzioni

```javascript
// Pattern standard per funzioni che modificano state
function addHistoryEntry(entry) {
  // 1. Validazione input
  if (!entry.feeling || !entry.trigger) return;

  // 2. Normalizzazione dati
  entry.id = Date.now();
  entry.date = new Date().toISOString();

  // 3. Update state
  state.history.push(entry);

  // 4. Update patterns
  state.patterns.feelingCounts[entry.feeling] =
    (state.patterns.feelingCounts[entry.feeling] || 0) + 1;

  // 5. Persist
  saveState();

  // 6. Update UI
  updateHomeScreen();
}
```

### 2.2 CSS

#### Utilizzo Variabili

```css
/* SEMPRE usare variabili per colori */
.card {
  background: var(--bg-card);        /* ✓ corretto */
  color: var(--text-primary);        /* ✓ corretto */
  border-radius: var(--radius-md);   /* ✓ corretto */
}

/* MAI hardcodare colori */
.card {
  background: #25253d;               /* ✗ evitare */
}
```

#### Palette Colori

| Variabile | Valore | Uso |
|-----------|--------|-----|
| `--bg-deep` | #1a1a2e | Background principale |
| `--bg-card` | #25253d | Card e superfici |
| `--bg-elevated` | #2d2d4a | Elementi in rilievo |
| `--accent-calm` | #7eb8da | Azioni primarie, link |
| `--accent-warm` | #e8a87c | Warning, intensità |
| `--accent-soft` | #c3aed6 | Insights, secondario |
| `--accent-green` | #7dd3a8 | Success, conferme |
| `--accent-coral` | #e07a7a | Danger, delete |
| `--text-primary` | #f0f0f5 | Testo principale |
| `--text-secondary` | #a0a0b8 | Testo secondario |
| `--text-muted` | #6a6a82 | Testo disabilitato |

#### Classi Componenti

```css
/* Pattern BEM semplificato */
.card { }
.card-header { }
.card-body { }
.card-footer { }

/* Stati con suffisso */
.btn { }
.btn.active { }
.btn.disabled { }
.btn:hover { }

/* Varianti con modificatore */
.btn-primary { }
.btn-danger { }
.btn-ghost { }
```

### 2.3 HTML

#### Struttura Screen

```html
<!-- Pattern standard per ogni screen -->
<div id="nomeScreen" class="screen">
  <!-- Header con back button (se non home) -->
  <div class="screen-header">
    <button class="back-btn" onclick="goBack()">←</button>
    <h1>Titolo Screen</h1>
  </div>

  <!-- Content scrollabile -->
  <div class="screen-content">
    <!-- Contenuto qui -->
  </div>

  <!-- Footer con CTA (se necessario) -->
  <div class="screen-footer">
    <button class="btn-primary" onclick="action()">Azione</button>
  </div>
</div>
```

#### Accessibilità

```html
<!-- Sempre includere -->
<button aria-label="Chiudi" onclick="close()">×</button>
<input type="text" placeholder="Descrizione" aria-label="Campo descrizione">

<!-- Touch targets minimi 44x44px -->
<button style="min-height: 44px; min-width: 44px;">Tap</button>
```

---

## 3. State Management

### 3.1 Struttura State

```javascript
// src/utils/state.js
export const state = {
  version: 1,
  lastSaved: null,
  userName: 'Bentornato',

  // Array di momenti registrati
  history: [{
    id: 1234567890,
    date: '2025-01-20T10:30:00.000Z',
    feeling: 'overwhelmed',
    trigger: 'too-many-things',
    intensity: 4,
    taskName: 'preparare presentazione',
    taskCategory: 'lavoro',
    strategyUsed: 'Tecnica Pomodoro',
    strategyCompleted: true,
    notes: 'è servito molto',
    helpful: true
  }],

  // Array di note diario
  diary: [{
    id: 1234567891,
    date: '2025-01-20T20:00:00.000Z',
    mood: 'calm',
    text: 'Giornata produttiva'
  }],

  // Contatori aggregati
  patterns: {
    feelingCounts: { overwhelmed: 5, stuck: 3 },
    triggerCounts: { 'too-many-things': 4 }
  },

  // Sistema gamification
  garden: {
    points: 45,
    level: 2,
    lastActivityDate: '2025-01-20',
    isPaused: false,
    pauseUntil: null
  },

  // Task tracking
  tasks: {
    'preparare-presentazione': {
      name: 'preparare presentazione',
      timesBlocked: 5,
      timesResolved: 3,
      strategies: {
        'Pomodoro': { used: 3, completed: 2 }
      }
    }
  },

  // Task attivi con scadenze
  activeTasks: [{
    id: 'task-123',
    name: 'Consegna progetto',
    deadline: '2025-01-25',
    category: 'lavoro',
    status: 'active',
    createdAt: '2025-01-20'
  }],

  // Impostazioni notifiche
  notificationSettings: {
    enabled: false,
    taskStuckDays: 3,
    deadlineWarningDays: 2
  }
};
```

### 3.2 Regole Modifica State

```javascript
// ✓ CORRETTO: Modifica diretta + saveState()
state.history.push(newEntry);
saveState();

// ✓ CORRETTO: Update oggetto nested
state.garden.points += 10;
saveState();

// ✗ EVITARE: Riassegnazione completa senza merge
state = newState; // NO! Perdi reattività

// ✓ CORRETTO: Merge con spread
Object.assign(state, loadedData);
```

### 3.3 Persistenza

```javascript
// Salva SEMPRE dopo modifica state
function addDiaryEntry(entry) {
  state.diary.push(entry);
  saveState();  // ← OBBLIGATORIO
}

// Load all'avvio
document.addEventListener('DOMContentLoaded', () => {
  loadState();           // Carica da localStorage
  cleanupDataSpaces();   // Pulisci dati
  updateHomeScreen();    // Aggiorna UI
});
```

---

## 4. Aggiungere Nuove Funzionalità

### 4.1 Checklist Pre-Sviluppo

- [ ] Verificare che la feature sia nel PRD o approvata
- [ ] Identificare i file da modificare
- [ ] Pianificare struttura dati (se nuovi campi state)
- [ ] Considerare backward compatibility

### 4.2 Workflow Sviluppo

#### Step 1: Aggiornare State (se necessario)

```javascript
// src/utils/state.js - aggiungere nuovi campi con default
export const state = {
  // ... campi esistenti
  newFeature: {
    enabled: false,
    data: []
  }
};

// src/utils/storage.js - gestire nel loadState()
state.newFeature = loaded.newFeature || { enabled: false, data: [] };
```

#### Step 2: Aggiungere Dati Statici (se necessario)

```javascript
// src/data/newdata.js
export const newData = [
  { id: 'item1', name: 'Item 1', emoji: '📌' },
  { id: 'item2', name: 'Item 2', emoji: '📍' }
];
```

#### Step 3: Implementare Logica in main.js

```javascript
// Importare nuovi dati
import { newData } from './data/newdata.js';

// Funzione render
function renderNewFeature() {
  const container = document.getElementById('newFeatureContainer');
  container.innerHTML = newData.map(item => `
    <div class="new-item" onclick="selectNewItem('${item.id}')">
      <span class="emoji">${item.emoji}</span>
      <span class="name">${item.name}</span>
    </div>
  `).join('');
}

// Event handler
function selectNewItem(itemId) {
  // Logica selezione
  saveState();
  updateUI();
}

// Esporre globalmente se chiamato da onclick HTML
window.selectNewItem = selectNewItem;
```

#### Step 4: Aggiungere HTML

```html
<!-- In index.html -->
<div id="newFeatureScreen" class="screen">
  <div class="screen-header">
    <button class="back-btn" onclick="goBack()">←</button>
    <h1>Nuova Feature</h1>
  </div>
  <div id="newFeatureContainer" class="screen-content">
    <!-- Popolato da JS -->
  </div>
</div>
```

#### Step 5: Aggiungere Stili

```css
/* In src/styles/components.css */
.new-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.new-item:hover {
  background: var(--bg-elevated);
  transform: translateY(-2px);
}

.new-item .emoji {
  font-size: 1.5rem;
}
```

### 4.3 Pattern Comuni

#### Aggiungere Screen Navigabile

```javascript
// 1. Creare HTML screen
// 2. Aggiungere alla navigazione
function showNewScreen() {
  showScreen('newScreen');
}

// 3. Collegare da home o menu
// onclick="showNewScreen()"
```

#### Aggiungere Filtro/Toggle

```javascript
// Stato filtro
let myFilter = 'all';

// Handler cambio filtro
function setMyFilter(value) {
  myFilter = value;
  renderFilteredContent();

  // Update UI bottoni
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === value);
  });
}
```

#### Aggiungere Modal

```javascript
function showMyModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Titolo Modal</h2>
      <p>Contenuto</p>
      <div class="modal-actions">
        <button onclick="closeModal(this)">Annulla</button>
        <button class="btn-primary" onclick="confirmAction()">Conferma</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeModal(btn) {
  btn.closest('.modal-overlay').remove();
}
```

---

## 5. Correggere Bug

### 5.1 Workflow Debug

```
1. Riprodurre il bug
2. Aprire DevTools (F12)
3. Controllare Console per errori
4. Identificare funzione problematica
5. Aggiungere console.log temporanei
6. Testare fix
7. Rimuovere console.log
8. Testare regressioni
```

### 5.2 Bug Comuni e Soluzioni

#### Dati non persistiti

```javascript
// PROBLEMA: Modifico state ma non salvo
state.history.push(entry);
// Manca saveState()!

// SOLUZIONE
state.history.push(entry);
saveState();  // ← Aggiungere sempre
```

#### UI non aggiornata

```javascript
// PROBLEMA: Salvo ma UI vecchia
saveState();
// Manca update UI!

// SOLUZIONE
saveState();
updateHomeScreen();  // ← Aggiungere refresh UI
// oppure
renderHistory();     // ← Render specifico
```

#### Funzione non trovata

```javascript
// PROBLEMA: onclick="myFunc()" → myFunc is not defined

// SOLUZIONE: Esporre su window
function myFunc() { /* ... */ }
window.myFunc = myFunc;  // ← Esporre globalmente
```

#### localStorage pieno

```javascript
// PROBLEMA: QuotaExceededError

// SOLUZIONE: Già gestito in saveState() - pulisce dati >6 mesi
// Se persiste: suggerire export + clear vecchi dati
```

#### Spazi extra nei dati

```javascript
// PROBLEMA: Testo con "spazi    extra"

// SOLUZIONE: Normalizzare all'input
const cleanText = input.value.replace(/\s+/g, ' ').trim();
```

### 5.3 Checklist Pre-Fix

- [ ] Bug riproducibile?
- [ ] Identificata causa root?
- [ ] Fix minimo necessario (no over-engineering)?
- [ ] Testato su mobile e desktop?
- [ ] Nessuna regressione su funzionalità esistenti?

---

## 6. Testing

### 6.1 Test Manuali Obbligatori

Prima di ogni commit, verificare:

#### Funzionalità Core
- [ ] Flow completo: Feeling → Trigger → Intensity → Response → Strategy
- [ ] Salvataggio in history funziona
- [ ] Garden points si aggiornano
- [ ] Navigazione back funziona

#### Persistenza
- [ ] Refresh pagina mantiene dati
- [ ] Export backup genera JSON valido
- [ ] Import backup ripristina dati

#### Responsive
- [ ] Mobile 375px (iPhone)
- [ ] Mobile 390px (iPhone 12+)
- [ ] Tablet 768px
- [ ] Desktop 1440px

#### PWA
- [ ] Funziona offline (dopo prima visita)
- [ ] Installabile su mobile

### 6.2 Test Specifici per Modifiche

#### Se modifichi State
- [ ] loadState() gestisce campo mancante
- [ ] Backward compatibility con dati esistenti

#### Se modifichi UI
- [ ] Touch target ≥44px
- [ ] Contrasto testo leggibile
- [ ] Animazioni non bloccanti

#### Se modifichi Storage
- [ ] Non perde dati esistenti
- [ ] Gestisce localStorage pieno

---

## 7. Git Workflow

### 7.1 Branch Strategy

```bash
# Branch principale
main                    # Produzione stabile

# Branch sviluppo (pattern Claude)
claude/feature-name-xxx # Feature development
```

### 7.2 Commit Messages

```bash
# Pattern: Tipo: Descrizione breve

# Tipi
Add:      # Nuova funzionalità
Fix:      # Correzione bug
Update:   # Modifica esistente
Refactor: # Ristrutturazione codice
Style:    # Solo CSS/UI
Docs:     # Documentazione

# Esempi
git commit -m "Add: Sistema compiti ricorrenti"
git commit -m "Fix: Correzione selezione filtri emozione"
git commit -m "Update: Miglioramento UX trigger categories"
git commit -m "Refactor: Estrazione funzioni garden in modulo"
```

### 7.3 Pre-Commit Checklist

- [ ] Codice testato manualmente
- [ ] Nessun console.log di debug
- [ ] Nessun TODO lasciato incompleto
- [ ] Commit message descrittivo

---

## 8. Performance Guidelines

### 8.1 JavaScript

```javascript
// ✓ EVITARE re-render inutili
// Renderizza solo quando necessario
if (dataChanged) {
  renderHistory();
}

// ✓ Debounce input frequenti
let saveTimeout;
function debouncedSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveState, 300);
}

// ✓ Event delegation per liste
document.getElementById('historyList').onclick = (e) => {
  const item = e.target.closest('.history-item');
  if (item) handleItemClick(item.dataset.id);
};
```

### 8.2 CSS

```css
/* ✓ Usare transform per animazioni (GPU accelerated) */
.card:hover {
  transform: translateY(-4px);  /* ✓ */
}

/* ✗ Evitare animazioni su width/height */
.card:hover {
  height: 200px;  /* ✗ causa reflow */
}

/* ✓ Limitare ombre complesse */
box-shadow: 0 4px 12px rgba(0,0,0,0.15);  /* ✓ una ombra */
```

### 8.3 Storage

```javascript
// ✓ Salvare dati aggregati, non calcolare ogni volta
state.patterns.feelingCounts  // Pre-calcolato

// ✓ Cleanup automatico dati vecchi (già implementato)
// saveState() rimuove dati >6 mesi se quota exceeded
```

---

## 9. Accessibilità ADHD-Specific

### 9.1 Principi UX

1. **Una cosa alla volta** - Mai sovraccaricare di opzioni
2. **Feedback immediato** - Toast/animazioni per ogni azione
3. **Undo facile** - Conferme per azioni distruttive
4. **Progress visibile** - Sempre mostrare dove sei nel flow
5. **Emoji grandi** - Scanning rapido senza leggere

### 9.2 Implementazione

```html
<!-- Progress indicator nel flow -->
<div class="progress-dots">
  <span class="dot active"></span>
  <span class="dot"></span>
  <span class="dot"></span>
</div>

<!-- Conferma per azioni distruttive -->
<button onclick="if(confirm('Eliminare?')) deleteItem()">
  Elimina
</button>

<!-- Toast feedback -->
<script>
function afterAction() {
  showToast('✓ Salvato!');
}
</script>
```

---

## 10. Troubleshooting

### Problema: App non si carica

```bash
# 1. Verifica console errori (F12)
# 2. Verifica import/export modules
# 3. Verifica service worker
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(r => r.unregister()));
```

### Problema: Dati persi

```javascript
// 1. Controllare localStorage
localStorage.getItem('come-stai-v2');

// 2. Controllare backup
localStorage.getItem('come-stai-v2-backup');

// 3. Se corrotto, recuperare da backup
const backup = localStorage.getItem('come-stai-v2-backup');
localStorage.setItem('come-stai-v2', backup);
```

### Problema: PWA non aggiorna

```javascript
// Force update service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(registrations => {
      registrations.forEach(reg => reg.update());
    });
}

// Oppure: Clear cache da DevTools > Application > Storage > Clear site data
```

---

## 11. Riferimenti Rapidi

### File da Modificare per Tipo di Lavoro

| Tipo | File Principali |
|------|-----------------|
| Nuova emozione | `src/data/feelings.js`, `src/data/responses.js` |
| Nuovo trigger | `src/data/triggers.js`, `src/data/responses.js` |
| Nuova strategia | `src/data/strategies.js` |
| Nuova sezione Learn | `src/data/learn.js` |
| Logica app | `src/main.js` |
| Gamification | `src/components/garden.js` |
| Stili | `src/styles/*.css` |
| Storage | `src/utils/storage.js` |
| PDF report | `src/report/pdf-generator.js` |

### Comandi Utili

```bash
# Serve locale (Python)
python -m http.server 8000

# Serve locale (Node)
npx serve .

# Git status
git status

# Git log recente
git log --oneline -10

# Cerca in codebase
grep -r "searchTerm" src/
```

---

*Documento aggiornato: Gennaio 2025*
*Versione: 1.0*
