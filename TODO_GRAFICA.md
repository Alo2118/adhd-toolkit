# Piano Coerenza Grafica — ADHD Toolkit

## Contesto
L'app ha subito un aggiornamento grafico importante con l'introduzione del **wizard guidato** (wizard.css, wizard.js). Le schermate aggiornate usano un design system coerente con step dots, hero sections, cards arrotondate, animazioni morbide. Molte schermate restano con il vecchio stile e devono essere allineate.

## Design System Attuale (target)

### Principi
- **Header**: `wizard-header` con back button + step dots (o titolo centrato)
- **Hero section**: Icona in cerchio sfumato + titolo bold (font-weight: 800) + subtitle muted
- **Cards**: `border-radius: var(--radius-lg)`, `border: 1px solid var(--border-subtle)`, `box-shadow: var(--shadow-soft)`
- **Bottoni primari**: Gradiente `accent-soft → accent-calm`, border-radius largo
- **Bottoni secondari**: `bg-card` con bordo sottile
- **Toggle switch**: Animato (implementato nel report v2)
- **Spaziatura**: Padding uniforme `20px 24px`
- **Animazioni**: Transizioni morbide `0.2s-0.4s`, scale su tap

### Classi di riferimento
- Layout: `wizard-screen`, `wizard-header`, `wizard-body`
- Hero: `insights-hero`, `insights-hero-icon`, `insights-hero-title`, `insights-hero-sub`
- Cards: `insight-section`, `insight-card-v2`, `report-card-v2`
- Toggle: `report-toggle`, `report-toggle-track`, `report-toggle-thumb`
- Barre: `insight-bar-row`, `insight-bar-track`, `insight-bar-fill`
- Summary: `insights-summary-strip`, `summary-stat`

## 3 Linguaggi Visivi Attuali

| Stile | File CSS | Dove usato |
|-------|----------|-----------|
| **Wizard (nuovo)** | wizard.css + components.css (v2 classes) | Welcome, Body, Intensity, Feeling, Context, Trigger, Response, Insights v2, Report v2 |
| **Diary/Old** | screens.css + components.css | Diario lista, Nuova nota, Dettaglio nota, Storico, Compiti, Impostazioni |
| **Tools (vecchio)** | screens.css (timer/breathe/dump/ground) | Timer, Respira, Brain dump, Grounding, Micro-step, Strategy detail, Checklist, Question, Tip |

## Schermate da Aggiornare

### Fase 1 — Schermate "contenitore" (header + hero uniformi)
- [x] **Impostazioni** (`views/settings.js`) — `diary-screen` + `understanding-card` + `timer-btn` → Hero icon, card v2, toggle switch
- [x] **Compiti lista** (`views/tasks.js` → list) — `diary-screen` + `diary-header` → Hero icon + coerenza header
- [x] **Diario lista** (`views/diary.js` → list) — `diary-screen` + `diary-header` → Hero icon + coerenza header
- [x] **Storico** (`views/diary.js` → history) — `diary-screen` + `diary-header` → Hero icon

### Fase 2 — Schermate "strumenti" (wrappare in wizard layout)
- [ ] **Timer** (`views/tools.js` → timer) — `screen-content`+`timer-screen` → Wizard wrapper + back coerente
- [ ] **Respira** (`views/tools.js` → breathe) — `screen-content`+`breathe-screen` → Wizard wrapper
- [ ] **Brain dump** (`views/tools.js` → dump) — `screen-content`+`dump-screen` → Wizard wrapper
- [ ] **Grounding** (`views/tools.js` → ground) — `screen-content`+`ground-screen` → Wizard wrapper
- [ ] **Micro-step** (`views/tools.js` → microstep) — `screen-content`+`timer-screen` riusato → Wizard wrapper

### Fase 3 — Schermate "guidate" (wizard layout)
- [ ] **Strategy detail** (`views/tools.js` → guidedViews.strategyDetail) — `screen-content`+`timer-screen` → Wizard wrapper
- [ ] **Checklist** (`views/tools.js` → guidedViews.checklist) — `screen-content`+`dump-screen` → Wizard wrapper
- [ ] **Question** (`views/tools.js` → guidedViews.question) — `screen-content`+`dump-screen` → Wizard wrapper
- [ ] **Tip** (`views/tools.js` → guidedViews.tip) — `screen-content`+`dump-screen` → Wizard wrapper

### Fase 4 — Pulizia CSS
- [ ] Rimuovere stili orfani non più usati
- [ ] Consolidare classi duplicate tra screens.css e components.css
- [ ] Verificare che tutti i colori usino CSS custom properties

## Note Tecniche
- L'app è una **Vanilla JS SPA** (no framework) con ES modules
- Routing: mappa `routes` in `main.js` → `showScreen(screenId)` inietta HTML in `#app`
- CSS: `variables.css` (tema), `base.css`, `components.css`, `screens.css`, `wizard.css`
- PWA con service worker
- Il file `main.js` ha ~1800+ righe, è il controller principale
- `handlePostRender()` in main.js gestisce il post-rendering per ogni schermata

## Lavoro Già Completato
- ✅ Wizard guidato (6 step: welcome → body → intensity → feeling → context → summary)
- ✅ Flow screens allineati (feeling, trigger, response usano wizard classes)
- ✅ Insights v2 (summary strip, bar charts, correlazioni, pattern temporali, strategie con stelle)
- ✅ Report v2 (hero, preview dati, toggle switch, download cards)
- ✅ PDF migliorato (executive summary, stat boxes, footer pagine, correlazioni, time patterns, no emoji)
- ✅ Home CTA aggiornata (🧭 "Percorso guidato per capire cosa succede")
- ✅ Fix "Altre strategie" title color
- ✅ Fix PDF encoding (rimossi emoji e caratteri Unicode non supportati da jsPDF)
