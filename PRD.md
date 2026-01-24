# Product Requirements Document (PRD)
## ADHD Toolkit - App di Supporto per ADHD

**Versione:** 1.0.3
**Data:** Gennaio 2025
**Stato:** Production

---

## 1. Executive Summary

### 1.1 Visione del Prodotto
ADHD Toolkit è una Progressive Web App (PWA) progettata per aiutare persone con ADHD a gestire momenti di difficoltà, tracciare pattern emotivi, e sviluppare strategie personalizzate attraverso un approccio gamificato e compassionevole.

### 1.2 Problema da Risolvere
Le persone con ADHD affrontano sfide quotidiane legate a:
- Difficoltà nel riconoscere e gestire emozioni intense
- Mancanza di consapevolezza dei propri pattern e trigger
- Necessità di supporto immediato in momenti critici
- Difficoltà nel comunicare il proprio stato a terapeuti/famiglia

### 1.3 Soluzione Proposta
Un'app che:
1. Fornisce supporto immediato nei momenti di crisi
2. Traccia pattern emotivi e trigger nel tempo
3. Suggerisce strategie personalizzate basate su dati reali
4. Genera report condivisibili con terapeuti
5. Gamifica il progresso con un sistema di "giardino"

---

## 2. Target Users

### 2.1 Persona Primaria
**Marco, 28 anni, Diagnosi ADHD Adulto**
- Lavora in ambito tech, spesso in remoto
- Sperimenta overwhelm durante task complessi
- Vuole strumenti pratici per gestire momenti difficili
- Desidera condividere progressi con il terapeuta

### 2.2 Persona Secondaria
**Sofia, 22 anni, Studentessa Universitaria**
- Diagnosticata ADHD recentemente
- Cerca di capire i propri pattern
- Vuole validazione e supporto emotivo
- Ha difficoltà a completare task e gestire deadline

### 2.3 Stakeholders
- **Terapeuti/Psicologi:** Ricevono report dettagliati sui pazienti
- **Familiari:** Comprendono meglio le difficoltà della persona
- **Supporto comunità ADHD:** Condivisione di strategie efficaci

---

## 3. Funzionalità Core

### 3.1 Flusso di Supporto Immediato

#### User Flow
```
Momento difficile → Selezione Emozione → Selezione Trigger →
Selezione Intensità → Risposta Personalizzata → Strategie →
Esecuzione Strategia → Feedback
```

#### 3.1.1 Selezione Emozione (Feeling)
**Opzioni disponibili:**
- Sopraffatto (overwhelmed)
- Bloccato (stuck)
- Frustrato (frustrated)
- Giù (down)
- Ansioso (anxious)
- Svuotato (depleted)
- Disperso (scattered)
- Irrequieto (restless)
- Iperfocus (hyperfocus)
- In colpa (guilty)

**Caratteristiche:**
- Emoji grandi per identificazione rapida
- Grid responsive (2 colonne)
- Mostra intensità 1-5 dopo selezione

#### 3.1.2 Identificazione Trigger
**Categorie di Trigger:**
- **Transizioni:** Cambi di attività, decisioni
- **Carico cognitivo:** Troppe informazioni, task complessi
- **Tempo:** Deadline, perdita traccia tempo
- **Sociale:** Conflitti, aspettative
- **Fisico:** Fame, stanchezza, sovrastimolazione
- **Emotivo:** Noia, paura fallimento, perfezionismo

**Implementazione:**
- Lista categorizzata e scrollabile
- Ricerca rapida per keyword
- Selezione singola

#### 3.1.3 Risposta Personalizzata
**Elementi della Risposta:**
- **TL;DR empatico:** Validazione immediata
- **Comprensione:** Spiegazione neurobiologica ADHD-friendly
- **Strategie immediate:** 3-5 azioni concrete
- **Strategie di contesto:** Basate su lavoro/studio/casa

**Tone of Voice:**
- Compassionevole, mai giudicante
- Usa "io" statements per relazionarsi
- Normalizza le difficoltà
- Focus su piccoli passi

### 3.2 Sistema Strategie

#### 3.2.1 Strategie Rapide
- **Micro-step:** Scomponi in 1 azione da 2 minuti
- **Body Doubling Virtuale:** Timer con presenza simulata
- **5-4-3-2-1 Grounding:** Tecnica sensoriale guidata
- **Pomodoro ADHD:** 15 min lavoro + 5 min pausa
- **Urgency Boost:** Deadline artificiale +30min

#### 3.2.2 Strategie per Contesto
**Lavoro:**
- Tecnica Pomodoro
- Ambient noise/musica
- Cambia ambiente
- Checklist micro-step

**Studio:**
- Active recall
- Spaced repetition
- Spiegare a voce alta
- Quiz auto-creati

**Casa:**
- One-touch rule
- Timer visivo
- Gamification task
- Playlist energizzante

#### 3.2.3 Esecuzione Guidata
**Timer Pomodoro:**
- Durata: 15/25 minuti configurabili
- Progress circolare animato
- Notifica sonora al termine
- +10 punti giardino

**Breathing Exercise:**
- 5 cicli guidati
- Animazione visuale (cerchio espande/contrae)
- 4 sec inspira, 4 sec espira
- +5 punti giardino

**Grounding 5-4-3-2-1:**
- 5 step progressivi
- Input testo per ogni senso
- Placeholder suggerimenti
- +5 punti giardino

### 3.3 Tracking e Pattern

#### 3.3.1 Storia Momenti
**Dati Tracciati:**
```javascript
{
  id: timestamp,
  date: ISO_string,
  feeling: 'overwhelmed',
  trigger: 'too-many-things',
  intensity: 4,
  taskName: 'preparare presentazione',
  taskCategory: 'lavoro',
  strategyUsed: 'Tecnica Pomodoro',
  strategyCompleted: true,
  notes: 'è servito davvero',
  helpful: true
}
```

#### 3.3.2 Insights Automatici
**Pattern Rilevati:**
- Emozione più frequente
- Trigger ricorrenti
- Orari critici (heatmap settimanale)
- Strategie più efficaci (% successo)
- Task che bloccano di più

**Visualizzazioni:**
- Bar chart emozioni
- Timeline cronologica
- Mappa settimanale
- Card strategie vincenti

### 3.4 Sistema Giardino (Gamification)

#### 3.4.1 Meccanica Punti
**Azioni che Danno Punti:**
- Registra momento: +2 punti
- Completa strategia: +3 punti
- Timer completato: +10 punti
- Breathing/Grounding: +5 punti
- Nota diario: +1 punto

**Livelli Giardino:**
```javascript
[
  { min: 0, emoji: '🌱', name: 'Seme' },
  { min: 10, emoji: '🌿', name: 'Germoglio' },
  { min: 30, emoji: '🪴', name: 'Piantina' },
  { min: 60, emoji: '🌳', name: 'Alberello' },
  { min: 100, emoji: '🌺', name: 'Fiore' },
  { min: 150, emoji: '🌸', name: 'Giardino' },
  { min: 250, emoji: '🏵️', name: 'Giardino Fiorito' }
]
```

#### 3.4.2 Sistema Decay
- **Decay rate:** -1 punto ogni 3 giorni di inattività
- **Protezione:** Livello minimo del livello attuale
- **Pausa:** Possibilità di pausare il giardino
- **Animazione:** Breathe effect (CSS animation)

### 3.5 Diario Personale

#### 3.5.1 Entry Diario
**Campi:**
- Data/ora automatica
- Mood (emoji selector)
- Testo libero
- Prompt suggeriti per sblocco

**Prompt Suggeriti:**
- "Oggi mi sento..."
- "Vorrei ricordare che..."
- "Sono grato per..."
- "Domani voglio..."

#### 3.5.2 Visualizzazione
- Lista cronologica inversa
- Filtro per mood
- Ricerca full-text
- Edit/Delete inline

### 3.6 Task Database

#### 3.6.1 Tracciamento Automatico
Quando registri un momento, il sistema:
1. Chiede "cosa stavi facendo?"
2. Categorizza automaticamente (lavoro/studio/casa/altro)
3. Traccia quante volte il task ti ha bloccato
4. Registra quali strategie hai usato e se hanno funzionato

**Metriche per Task:**
```javascript
{
  name: 'preparare presentazione',
  normalizedId: 'preparare-presentazione',
  timesBlocked: 5,
  timesResolved: 3,
  strategies: {
    'Tecnica Pomodoro': { used: 3, completed: 2 },
    'Micro-step': { used: 2, completed: 1 }
  },
  lastEncountered: ISO_date
}
```

#### 3.6.2 Insights Task
- **Top task difficili:** Ordinati per rapporto risolti/bloccati
- **Best strategy per task:** Migliore % successo (min 2 usi)
- **Raccomandazioni:** "Per X prova Y (funziona 80%)"

### 3.7 Report PDF

#### 3.7.1 Opzioni Report
**Periodo:**
- Ultimi 7 giorni
- Ultimi 30 giorni
- Tutto

**Sezioni Selezionabili:**
- Pattern e trigger (grafici e stats)
- Timeline momenti (ultimi 12)
- Note personali diario (ultime 5)
- Strategie efficaci

#### 3.7.2 Contenuto PDF
**Pagina 1 - Cover:**
- Titolo "IL MIO PERCORSO ADHD"
- Data e periodo
- 4 stat boxes: Momenti, % Successo, Streak, Intensità media

**Pagina 2 - Pattern:**
- Due colonne: Emozioni | Trigger
- Bar chart orizzontali inline
- Top 5 per categoria
- Font 10pt per leggibilità

**Pagina 3 - Timeline:**
- Layout a 2 righe per entry
- Riga 1: Data/ora bold
- Riga 2: Feeling | Task | Strategia | Note
- Massimo 12 entry

**Pagina 4 - Mappa Settimanale:**
- Heatmap 7 giorni
- Colore basato su intensità
- Numeri nei box

**Pagina 5 - Task e Strategie:**
- Sfide principali (card rosse)
- Cosa funziona (card verdi)
- Strategie da provare per contesto

**Pagina Finale - Riflessione:**
- Box viola header
- Testo motivazionale compassionevole
- "Questo è il mio percorso"

---

## 4. Architettura Tecnica

### 4.1 Stack Tecnologico

#### Frontend
- **Vanilla JavaScript (ES6 Modules)**
- **HTML5 + CSS3**
- **Progressive Web App (PWA)**
- **jsPDF** per generazione PDF
- **Service Worker** per offline

#### Storage
- **LocalStorage** per persistenza
- **JSON** format
- **Backup automatico** su ogni save
- **Export/Import** JSON manuale

#### Deployment
- **Static hosting** (Netlify/Vercel/GitHub Pages)
- **No backend required**
- **100% client-side**

### 4.2 Architettura Modular

```
adhd-toolkit/
├── index.html                 # Entry point
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── version.js                 # Version centrale
│
├── src/
│   ├── main.js                # Core logic
│   │
│   ├── config/
│   │   └── version.js         # Version ES6
│   │
│   ├── data/
│   │   ├── feelings.js        # Emoji + labels emozioni
│   │   ├── triggers.js        # Trigger categorizzati
│   │   ├── moods.js           # Mood diario
│   │   ├── strategies.js      # Strategie per contesto
│   │   ├── responses.js       # Risposte personalizzate
│   │   └── learn.js           # Contenuti educativi
│   │
│   ├── utils/
│   │   ├── state.js           # State globale
│   │   ├── storage.js         # Load/save/export/import
│   │   └── helpers.js         # Utility functions
│   │
│   ├── components/
│   │   └── garden.js          # Sistema giardino
│   │
│   └── styles/
│       ├── variables.css      # CSS vars (colori, spacing)
│       ├── base.css           # Reset + base styles
│       ├── components.css     # Component styles
│       └── animations.css     # Animations + transitions
│
└── PRD.md                     # Questo documento
```

### 4.3 State Management

#### Global State Object
```javascript
state = {
  version: 1,
  lastSaved: ISO_string,
  userName: 'Bentornato',

  history: [
    { id, date, feeling, trigger, intensity, taskName,
      strategyUsed, strategyCompleted, notes, helpful }
  ],

  diary: [
    { id, date, mood, text, type: 'entry' }
  ],

  patterns: {
    feelingCounts: { overwhelmed: 5, ... },
    triggerCounts: { 'too-many-things': 3, ... }
  },

  garden: {
    points: 45,
    level: 2,
    lastActivityDate: ISO_string,
    isPaused: false,
    pauseUntil: null
  },

  tasks: {
    'preparare-presentazione': {
      name: 'preparare presentazione',
      timesBlocked: 5,
      timesResolved: 3,
      strategies: { 'Pomodoro': { used: 3, completed: 2 } }
    }
  },

  activeTasks: [],

  notificationSettings: {
    enabled: false,
    taskStuckDays: 3,
    deadlineWarningDays: 2
  }
}
```

#### Persistence Strategy
1. **Save on every action** (saveState())
2. **Automatic backup** (STORAGE_KEY + '-backup')
3. **Auto-cleanup** su quota exceeded (rimuove >6 mesi)
4. **Data cleanup** su load (rimuove spazi extra)

### 4.4 Service Worker Strategy

#### Cache Strategy
- **Network-first** per app files (.html, .css, .js)
  - Sempre scarica ultima versione se online
  - Fallback a cache se offline
- **Cache-first** per risorse esterne (fonts, jsPDF)
  - Velocizza caricamento
  - Riduce banda

#### Cache Invalidation
- Nome cache include versione: `come-stai-v1-0-3`
- Activate event elimina vecchie cache
- SkipWaiting + claim per update immediato

---

## 5. User Flows Dettagliati

### 5.1 First Time User Experience

```
1. Landing → Legal Screen
   - Mostra termini e condizioni
   - Checkbox consenso obbligatorio
   - Bottone "Accetto e Continua"

2. Legal Accept → Home Screen
   - Salva consenso in localStorage
   - Inizializza state vuoto
   - Mostra CTA principale "Ho bisogno di aiuto"
   - Badge giardino: 🌱 Seme (0 punti)

3. Home → First Help Flow
   - Tap "Ho bisogno di aiuto"
   - Guided flow: Feeling → Trigger → Intensity
   - Prima risposta personalizzata
   - Prima strategia suggerita

4. Complete Strategy
   - +3 punti giardino
   - Badge diventa 🌿 Germoglio (10 punti)
   - Celebration toast
   - Ritorno home con stats aggiornate
```

### 5.2 Returning User Experience

```
1. App Load
   - Check legal consent
   - Load state da localStorage
   - Auto-cleanup spazi extra dati
   - Check garden decay
   - Update badge livello

2. Home Screen Mostra:
   - Greeting + nome utente
   - 3 stat cards: Streak, Momenti, Ultima attività
   - CTA principale "Ho bisogno di aiuto"
   - Garden card: Emoji + livello + punti + progress bar
   - Insights preview (se ≥3 momenti)
   - Quick nav: Diario, Insights, Impara, Impostazioni

3. Typical Usage Pattern:
   - Momento difficile → Help flow → Strategy → +punti
   - Oppure: Diario → Nota riflessione → +1 punto
   - Oppure: Insights → Visualizza pattern → Generate PDF
```

### 5.3 Weekly Report Generation

```
1. Home → Insights
   - Tap "📖 Condividi il tuo percorso"

2. Report Screen
   - Seleziona periodo: 7gg / 30gg / Tutto
   - Toggle sezioni:
     ✓ Pattern e trigger
     ✓ Timeline momenti
     ☐ Note personali
     ✓ Strategie

3. Tap "Scarica PDF"
   - Mostra console logs (debug)
   - Genera PDF multi-pagina
   - Auto-download: "il-mio-percorso-adhd-{data}.pdf"
   - Toast conferma

4. Condivisione
   - Apri PDF con sistema
   - Condividi via email/WhatsApp/ecc
   - Porta a sessione terapia
```

---

## 6. Design System

### 6.1 Color Palette

```css
/* Primary */
--bg-deep: #16213e;           /* Background scuro navy */
--bg-card: #1a1a2e;           /* Card background */
--bg-elevated: #25274d;       /* Elevated surfaces */

/* Text */
--text-primary: #f0f0f5;      /* Testo principale bianco */
--text-secondary: #d0d0e0;    /* Testo secondario grigio chiaro */
--text-muted: #a0a0b8;        /* Testo muted grigio */

/* Accents */
--accent-calm: #7eb8da;       /* Blu calmo (feeling, strategy) */
--accent-warm: #e8a87c;       /* Arancio caldo (intensity) */
--accent-soft: #c3aed6;       /* Viola soft (insights) */
--accent-green: #7dd3a8;      /* Verde (success, garden) */
--accent-coral: #e07a7a;      /* Corallo (delete, danger) */
```

### 6.2 Typography

**Font Family:** Nunito (Google Fonts)
- Regular 400
- SemiBold 600
- Bold 700
- ExtraBold 800

**Scales:**
- H1: 1.8rem (28.8px) - Screen titles
- H2: 1.3rem (20.8px) - Section headers
- Body: 1rem (16px) - Default
- Small: 0.9rem (14.4px) - Meta info
- Tiny: 0.8rem (12.8px) - Labels

### 6.3 Spacing System

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;

--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 100px;
```

### 6.4 Component Patterns

#### Button Hierarchy
1. **Primary CTA:** Gradient azzurro-viola, shadow grande
2. **Secondary:** Background accent, no gradient
3. **Tertiary:** Outline only, transparent bg
4. **Danger:** Coral background

#### Card Types
1. **Home stat card:** Accent border, hover lift
2. **Garden card:** Gradient bg, breathe animation
3. **Insight card:** Soft bg, emoji header
4. **History card:** Timeline dot, edit/delete buttons

#### Input Patterns
1. **Checkbox:** Custom styled, toggle animation
2. **Intensity bar:** 5 dots, seleziona con animazione
3. **Textarea:** Auto-resize, placeholder empatico

---

## 7. Responsive Design

### 7.1 Breakpoints

```css
/* Mobile-first approach */
@media (max-width: 600px) {
  /* Mobile optimizations */
  body { padding: 8px; }
  .screen { padding: 12px; }
  .intensity-dot { height: 55px; font-size: 1.05rem; }
  .screen { padding-bottom: 150px; } /* Fixed button space */
}

@media (max-width: 480px) {
  /* Ultra-compact mobile */
  body { padding: 8px; }
  .screen { padding: 12px; }
}
```

### 7.2 Mobile Optimizations

**Touch Targets:**
- Minimum 44x44px per touch
- Intensity dots: 55px altezza
- Buttons: min 48px altezza
- Gap tra elementi: min 8px

**Fixed Elements:**
- Continue button: fixed bottom, z-index 100
- Close button: fixed top-right
- Bottom padding screens: 150px per compensare

**Keyboard:**
- Input auto-focus dove appropriato
- Return to close keyboard
- Scroll to input on focus

---

## 8. Performance

### 8.1 Metrics Target

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2.5s
- **Largest Contentful Paint:** < 2.5s
- **Bundle Size:** < 500KB (attualmente ~200KB)
- **Lighthouse Score:** > 90

### 8.2 Optimization Strategies

**Code:**
- ES6 modules per code splitting
- Minify CSS inline
- Defer non-critical JS
- Lazy load jsPDF solo quando serve

**Assets:**
- No images (solo emoji Unicode)
- Inline critical CSS
- Font display: swap
- Service Worker precaching

**Data:**
- LocalStorage (sync, fast)
- JSON stringify/parse efficiente
- Auto-cleanup vecchi dati (>6 mesi)
- Debounce save operations

---

## 9. Privacy & Security

### 9.1 Data Privacy

**Principi:**
- **100% local:** Tutti i dati solo su dispositivo utente
- **No backend:** Zero invio dati a server
- **No analytics:** Nessun tracking
- **No ads:** Nessuna pubblicità
- **Offline-first:** Funziona senza connessione

**GDPR Compliance:**
- Consenso esplicito termini
- Diritto cancellazione (Clear All Data)
- Diritto portabilità (Export JSON)
- No profilazione
- No condivisione terze parti

### 9.2 Data Security

**Storage:**
- LocalStorage (non encrypted, ma locale)
- Backup automatico su -backup key
- Export in JSON chiaro

**Limitations:**
- Quota LocalStorage: ~5-10MB
- No password protection
- No cloud sync
- Perdita dati se cancelli browser data

**Recommendations per Users:**
- Export backup regolarmente
- Salva JSON in luogo sicuro
- Non condividere dispositivo se sensibile

---

## 10. Accessibility

### 10.1 Standards

**Target:** WCAG 2.1 Level AA

**Implemented:**
- Contrasto colori > 4.5:1
- Font min 16px (scalabile)
- Focus states visibili
- Touch targets > 44px
- Semantic HTML

**To Improve:**
- Screen reader labels
- ARIA attributes
- Keyboard navigation completa
- Skip links

### 10.2 ADHD-Specific Accessibility

**Cognitive Load:**
- Una domanda per volta nel flow
- Progress indicator chiaro
- Conferme per azioni distruttive
- Undo non disponibile → chiedi conferma

**Visual:**
- Emoji grandi per rapido scanning
- Colori distinti per categorie
- Whitespace generoso
- No animazioni eccessive (solo breathe)

**Interaction:**
- No multi-step complicati
- Feedback immediato (toast)
- Stati salvati automaticamente
- No perdita dati su navigate back

---

## 11. Testing Strategy

### 11.1 Test Coverage Needed

**Unit Tests:**
- `storage.js`: saveState, loadState, importData
- `helpers.js`: filterDataByPeriod, detectTaskCategory
- `garden.js`: addGardenPoints, checkGardenDecay

**Integration Tests:**
- Flow completo: feeling → trigger → response → strategy
- PDF generation con vari dataset
- Import/export backup

**E2E Tests:**
- First time user onboarding
- Typical help flow
- Generate and download PDF

### 11.2 Manual Testing Checklist

**Cross-browser:**
- [ ] Chrome/Edge (Desktop + Mobile)
- [ ] Firefox (Desktop + Mobile)
- [ ] Safari (Desktop + iOS)

**PWA:**
- [ ] Install to home screen
- [ ] Offline functionality
- [ ] Update notification

**Data:**
- [ ] Save/load state
- [ ] Export backup
- [ ] Import backup (sovrascrive)
- [ ] Clear all data

**Responsive:**
- [ ] Mobile 320px
- [ ] Mobile 375px
- [ ] Tablet 768px
- [ ] Desktop 1440px

---

## 12. Roadmap & Future Enhancements

### 12.1 V1.1 - Q1 2025 (Next)

**Features:**
- [ ] Reminder notifications (se abilitato)
- [ ] Task active tracking migliorato
- [ ] Export CSV per analytics
- [ ] Dark/Light theme toggle

**Fixes:**
- [x] Timeline font consistency 10pt
- [x] Mobile responsive intensity dots
- [x] Backup import refresh UI
- [x] Service Worker network-first
- [x] PDF extra spaces cleanup

### 12.2 V1.2 - Q2 2025

**Features:**
- [ ] Grafici interattivi (Chart.js)
- [ ] Filtri avanzati insights
- [ ] Statistiche per periodo customizzabile
- [ ] Obiettivi settimanali
- [ ] Badge achievements

### 12.3 V2.0 - Q3 2025

**Major Features:**
- [ ] Cloud sync opzionale (Firebase)
- [ ] Condivisione anoninima pattern community
- [ ] AI suggestions (OpenAI API)
- [ ] Voice notes
- [ ] Integrazione calendario

### 12.4 Future Considerations

**Platform:**
- [ ] Native app (React Native)
- [ ] Desktop app (Electron)
- [ ] Browser extension

**Features:**
- [ ] Collaborazione con terapeuta in-app
- [ ] Import dati da altre app
- [ ] Telegram/WhatsApp bot
- [ ] Wearable integration

---

## 13. Success Metrics

### 13.1 User Engagement

**Primary:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Retention Rate (D7, D30)
- Avg sessions per week

**Secondary:**
- Avg moments logged per user
- Avg strategies completed per user
- Garden level distribution
- PDF reports generated

### 13.2 Quality Metrics

**Technical:**
- Lighthouse score > 90
- Crash rate < 0.1%
- Load time < 2s
- Service Worker install success rate

**UX:**
- Time to first action < 30s
- Flow completion rate > 80%
- User rating (if store) > 4.5
- Support tickets per user < 0.05

### 13.3 Impact Metrics (Self-Reported)

**Surveys:**
- "How helpful is this app?" (1-5)
- "Has it improved self-awareness?" (Yes/No)
- "Would you recommend it?" (NPS)

---

## 14. Appendix

### 14.1 Glossary

- **Feeling:** Emozione provata (es. sopraffatto)
- **Trigger:** Evento/situazione scatenante
- **Intensity:** Scala 1-5 dell'intensità emotiva
- **Strategy:** Tecnica/azione per gestire il momento
- **Garden:** Sistema gamification con livelli e punti
- **Moment:** Entry in history di feeling+trigger+strategy
- **Pattern:** Ricorrenza di feeling/trigger nel tempo
- **Insight:** Analisi automatica dei pattern

### 14.2 Technical Dependencies

```json
{
  "dependencies": {
    "jspdf": "^2.5.1"
  },
  "fonts": {
    "Nunito": "Google Fonts"
  },
  "browser_support": {
    "chrome": ">=90",
    "firefox": ">=88",
    "safari": ">=14",
    "edge": ">=90"
  }
}
```

### 14.3 File Size Breakdown

```
index.html:        ~45 KB
src/main.js:       ~85 KB
src/data/*.js:     ~35 KB
src/styles/*.css:  ~25 KB
src/utils/*.js:    ~10 KB
sw.js:             ~5 KB
manifest.json:     ~2 KB
icons:             ~20 KB (2 files)
--------------------------------
Total (uncompressed): ~227 KB
Total (gzipped):      ~65 KB
```

---

## 15. Contact & Contributors

**Product Owner:** [Da definire]
**Lead Developer:** AI Assistant + User
**Design:** Minimal, ADHD-friendly approach

**Repository:** `adhd-toolkit`
**License:** [Da definire]
**Version:** 1.0.3
**Last Updated:** January 2025

---

*Questo documento è vivo e verrà aggiornato con l'evoluzione del prodotto.*
