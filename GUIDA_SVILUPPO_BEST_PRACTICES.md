# Guida di Sviluppo - Best Practices (ADHD Toolkit)

Questa guida definisce gli standard di sviluppo che useremo per correggere bug e aggiungere funzionalità in modo consistente, sicuro e sostenibile. È pensata per una PWA statica (HTML/CSS/JS) con persistenza in `localStorage`.

Se una sezione confligge con `DEVELOPMENT.md`, preferire `DEVELOPMENT.md` per le convenzioni già presenti nel progetto e aggiornare questa guida di conseguenza.

---

## 1) Principi Chiave

1. **Stabilità prima di tutto**: ogni modifica deve preservare dati utente e flussi esistenti.
2. **Semplicità**: evitare framework o dipendenze nuove se non strettamente necessarie.
3. **Accessibilità e UX ADHD-first**: meno carico cognitivo, feedback immediato, azioni chiare.
4. **Offline-first**: l’app deve funzionare senza rete dopo la prima visita.
5. **Manutenibilità**: codice leggibile, funzioni piccole, responsabilità chiare.

---

## 2) Struttura e Modularità

- **Entry**: `index.html` (solo markup, niente logica complessa).
- **Logica**: `src/main.js` come orchestratore, ma estrarre in moduli quando una sezione cresce.
- **Stato**: `src/utils/state.js` come fonte di verità.
- **Persistenza**: `src/utils/storage.js` per carico/salvataggio e migrazioni.
- **Dati statici**: `src/data/*.js` (solo JSON-like data, nessuna logica).
- **UI/DOM**: funzioni `renderXxx()` e `updateXxx()` ben distinte.

Regola pratica: se una funzione supera ~60–80 righe o mischia 2+ responsabilità, va spezzata.

---

## 3) Regole per lo Stato e la Persistenza

1. **Mutazioni sempre seguite da `saveState()`**.
2. **Niente riassegnazione completa dello state**: usare merge o update puntuali.
3. **Versionamento schema**:
   - Incrementare `state.version` quando cambia la struttura.
   - Gestire migrazioni in `loadState()` (default per campi nuovi).
4. **Non rompere dati storici**:
   - Mai cambiare il significato di un campo esistente senza migrazione.
5. **Salvataggio resiliente**:
   - Se `localStorage` è pieno, applicare cleanup controllato (già previsto).

---

## 4) Error Handling e Qualità del Dato

1. **Validazione input**: normalizzare stringhe (`trim`, rimozione spazi multipli).
2. **Guard clause**: verificare precondizioni prima di scrivere su state.
3. **Fail soft**: in caso di errori, mostrare un toast e non bloccare il flusso.
4. **Default safe**: se un campo manca, usare un valore neutro.

---

## 5) UI/UX (ADHD-first)

- **Una decisione per schermata**: evitare overload di opzioni.
- **Feedback immediato**: toast o micro-animazioni su ogni azione.
- **Undo o conferme**: per azioni distruttive.
- **Progress visibile**: indicatori di step nel flow.
- **Touch target ≥ 44px**.
- **Contrasto elevato** e tipografia leggibile.

---

## 6) Accessibilità (A11y)

1. **`aria-label`** per pulsanti icon-only.
2. **Focus visibile** per navigazione da tastiera.
3. **Ordine logico** dei contenuti (DOM order coerente).
4. **Semantic HTML** dove possibile (`button`, `section`, `header`).

---

## 7) Performance

1. **Render selettivo**: aggiornare solo le sezioni impattate.
2. **Event delegation** per liste lunghe.
3. **Animazioni con `transform`/`opacity`**.
4. **Debounce** input frequenti.
5. **Cache PWA**: non bloccare il runtime con fetch non necessari.

---

## 8) PWA e Service Worker

- **Cache strategy chiara**:  
  - Static assets: cache-first.  
  - Dati dinamici (se presenti): network-first con fallback.  
- **Versionamento**: quando si modifica la cache, incrementare la versione nel SW.
- **Aggiornamento**: notificare l’utente quando una nuova versione è disponibile.

Checklist:
1. L’app funziona offline dopo la prima visita.
2. Non si rompe se il SW è disabilitato.
3. Aggiornamenti non cancellano `localStorage`.

---

## 9) Sicurezza e Privacy

1. **Dati sensibili solo localmente** (nessun invio remoto).
2. **Export/Import**:
   - Validare JSON in import.
   - Informare l’utente di cosa verrà sovrascritto.
3. **Minimizzare log**: nessun dato personale in console.

---

## 10) Quality Gates (Prima di Ogni Change)

1. **Riproduzione bug** (se è un fix).
2. **Test manuali minimi**:
   - Flow principale completo.
   - Persistenza dopo refresh.
   - Navigazione avanti/indietro.
   - Offline (se coinvolge SW).
3. **Controllo console**: nessun errore.
4. **No regressioni** su feature esistenti.

---

## 11) Pattern Consigliati

### 11.1 Funzioni di Aggiornamento

```javascript
function updateSomething(data) {
  if (!data) return;

  // Normalizza
  const normalized = normalizeData(data);

  // Aggiorna state
  state.something = normalized;
  saveState();

  // Aggiorna UI
  renderSomething();
}
```

### 11.2 Event Handler

```javascript
function handleClickSomething(id) {
  const item = getItemById(id);
  if (!item) {
    showToast('Elemento non trovato');
    return;
  }

  updateSomething(item);
}
```

---

## 12) Workflow Suggerito

1. **Definisci obiettivo** (bug o feature).
2. **Mappa impatto** su state, storage e UI.
3. **Implementa in piccolo** (minimo cambiamento utile).
4. **Test manuale** con checklist.
5. **Pulizia**: rimuovere log/debug temporanei.

---

## 13) Convenzioni Commit

Seguire `DEVELOPMENT.md`:
- `Fix: ...`
- `Add: ...`
- `Update: ...`
- `Refactor: ...`
- `Style: ...`
- `Docs: ...`

---

## 14) FAQ di Sviluppo

**Q: Posso aggiungere nuove dipendenze?**  
A: Solo se sbloccano un requisito non realizzabile altrimenti. Valutare impatto su offline/PWA.

**Q: Dove metto dati statici?**  
A: In `src/data/*.js` con export puliti e senza logica.

**Q: Come gestisco un nuovo campo nello state?**  
A: Aggiungere il default in `state.js` e gestire fallback in `loadState()`.

---

*Ultimo aggiornamento: 3 febbraio 2026*
