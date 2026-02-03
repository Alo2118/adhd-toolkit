export const toolsViews = {
    timer: `
    <div class="screen-content">
      <div class="flow-header">
         <button class="back-btn" onclick="stopTimer();showScreen('responseScreen')">←</button>
      </div>
      <div class="timer-screen">
        <h2 class="timer-title">⏱️ Timer 2 Minuti</h2>
        <p class="timer-subtitle">Puoi fare qualsiasi cosa per 2 minuti.</p>
        <div class="timer-circle">
          <svg width="200" height="200">
            <circle class="bg" cx="100" cy="100" r="90"></circle>
            <circle class="progress" cx="100" cy="100" r="90" pathLength="283" stroke-dasharray="283"
              stroke-dashoffset="0"></circle>
          </svg>
          <div class="timer-display" id="timer-display">02:00</div>
        </div>
        
        <div class="timer-controls">
          <button class="timer-btn primary" onclick="startTimer(2)">Start</button>
          <button class="timer-btn secondary" onclick="resetTimer()">Resetta</button>
        </div>

        <div class="timer-done" id="timerDone">
          <div class="timer-done-emoji">🎉</div>
          <div class="timer-done-text">Ce l'hai fatta!</div>
          <button class="timer-btn primary" onclick="resetTimer()">Altri 2 minuti</button>
          <button class="timer-btn secondary" onclick="completeTimerReward()">Chiudi</button>
        </div>
        <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
          <p class="feedback-question">Quanto è stata utile la strategia?</p>
          <div class="feedback-btns">
            <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
            <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
            <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
            <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
            <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
          </div>
        </div>
      </div>
    </div>
    `,

    breathe: `
    <div class="screen-content">
      <button class="close-btn" onclick="stopBreathing();showScreen('responseScreen')">×</button>
      <div class="breathe-screen">
        <h2 class="breathe-title">🌬️ Respira con me</h2>
        <p class="breathe-subtitle">Segui il ritmo. 4 secondi inspira, 4 secondi espira.</p>
        <div class="breathe-circle" id="breatheCircle">
          <span class="breathe-instruction" id="breatheInstruction">Pronto?</span>
        </div>
        <div class="breathe-counter" id="breatheCounter">5 cicli</div>
        <div class="breathe-controls">
          <button class="timer-btn primary" id="breatheStartBtn" onclick="startBreathing()">Inizia</button>
          <button class="timer-btn secondary" onclick="stopBreathing();showScreen('responseScreen')">Chiudi</button>
        </div>
        <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
          <p class="feedback-question">Quanto è stata utile la strategia?</p>
          <div class="feedback-btns">
            <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
            <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
            <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
            <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
            <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
          </div>
        </div>
      </div>
    </div>
    `,

    dump: `
    <div class="screen-content">
      <div class="dump-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('responseScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="dump-header">
          <div class="dump-emoji">🧠</div>
          <h2 class="dump-title">Svuota la mente</h2>
          <p class="dump-subtitle">Scrivi tutto quello che hai in testa. Non deve essere ordinato o sensato.</p>
        </div>
        <textarea class="dump-textarea" id="dumpTextarea" placeholder="Scrivi tutto..."></textarea>
        <div class="dump-tip">💡 Una volta fuori dalla testa, i pensieri pesano meno.</div>
      </div>
      <div class="dump-actions">
        <button class="btn secondary" onclick="showScreen('responseScreen')">Chiudi</button>
        <button class="btn primary" onclick="saveDump()">Fatto ✓</button>
      </div>
      <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
        <p class="feedback-question">Quanto è stata utile la strategia?</p>
        <div class="feedback-btns">
          <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
          <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
          <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
          <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
          <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
        </div>
      </div>
    </div>
    `,

    ground: `
    <div class="screen-content">
      <div class="ground-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('responseScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="ground-header">
          <div class="ground-emoji">🌿</div>
          <h2 class="ground-title">Torna al presente</h2>
          <p class="ground-subtitle">Tecnica 5-4-3-2-1</p>
        </div>
        <div id="grounding-container"></div>
      </div>
      <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
        <p class="feedback-question">Quanto è stata utile la strategia?</p>
        <div class="feedback-btns">
          <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
          <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
          <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
          <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
          <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
        </div>
      </div>
    </div>
    `,

    microstep: `
    <div class="screen-content">
      <button class="close-btn" onclick="showScreen('responseScreen')">×</button>
      <div class="timer-screen">
        <h2 class="timer-title">🎯 Micro-step</h2>
        <p class="timer-subtitle">Qual è il primissimo passo più piccolo che puoi fare?</p>
        <div style="padding:0 20px">
          <textarea class="dump-textarea" id="microStepInput"
            placeholder="Il mio micro-step è...&#x0a;&#x0a;Es: Aprire il file&#x0a;Es: Leggere la prima riga&#x0a;Es: Scrivere il titolo"
            style="min-height:150px;margin:20px 0"></textarea>
          <div class="understanding-card" style="margin-bottom:20px">
            <div class="understanding-title">💡 Perché funziona</div>
            <p class="understanding-text">Il cervello ADHD si blocca sui compiti grandi. Un micro-step è troppo piccolo per spaventare.</p>
          </div>
        </div>
        <div class="timer-controls">
          <button class="timer-btn secondary" onclick="showScreen('responseScreen')">Chiudi</button>
          <button class="timer-btn primary" onclick="completeMicroStep()">L'ho fatto! ✓</button>
        </div>
        <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
          <p class="feedback-question">Quanto è stata utile la strategia?</p>
          <div class="feedback-btns">
            <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
            <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
            <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
            <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
            <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
          </div>
        </div>
      </div>
    </div>
    `
};

// Guided Screens for Strategy Detail, Checklist, Question, Tip
export const guidedViews = {
    strategyDetail: `
    <div class="screen-content">
      <div class="timer-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('responseScreen')">←</button>
          <div style="flex:1"></div>
          <button class="close-btn" onclick="showScreen('responseScreen')" style="position:static">×</button>
        </div>
        <div style="padding:20px;padding-top:0">
          <h2 class="timer-title" id="strategyDetailTitle">Strategia</h2>
          <p class="timer-subtitle" id="strategyDetailDesc">Descrizione</p>
          <div class="understanding-card" style="margin:20px 0">
            <div class="understanding-title">💡 Perché funziona</div>
            <p class="understanding-text" id="strategyDetailExplanation">Spiegazione</p>
          </div>
          <div class="timer-controls" style="flex-direction:column;gap:12px">
            <button class="timer-btn primary" id="strategyDetailExecute" onclick="executeStrategyFromDetail()">Inizia →</button>
            <button class="timer-btn secondary" onclick="completeStrategyFromDetail()">L'ho fatto ✓</button>
          </div>
          <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
            <p class="feedback-question">Quanto è stata utile la strategia?</p>
            <div class="feedback-btns">
              <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
              <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
              <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
              <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
              <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,

    checklist: `
    <div class="screen-content">
      <div class="dump-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('responseScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="dump-header">
          <div class="dump-emoji" id="checklistEmoji">✓</div>
          <h2 class="dump-title" id="checklistTitle">Checklist</h2>
          <p class="dump-subtitle" id="checklistSubtitle">Controlla questi punti</p>
        </div>
        <div id="checklistItems" style="margin:20px 0"></div>
      </div>
      <div class="dump-actions">
        <button class="btn secondary" onclick="showScreen('responseScreen')">Chiudi</button>
        <button class="btn primary" onclick="completeChecklist()">Fatto ✓</button>
      </div>
      <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
        <p class="feedback-question">Quanto è stata utile la strategia?</p>
        <div class="feedback-btns">
          <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
          <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
          <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
          <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
          <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
        </div>
      </div>
    </div>
    `,

    question: `
    <div class="screen-content">
      <div class="dump-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('responseScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="dump-header">
          <div class="dump-emoji" id="questionEmoji">💭</div>
          <h2 class="dump-title" id="questionTitle">Rifletti</h2>
          <p class="dump-subtitle" id="questionPrompt">Prenditi un momento per pensare</p>
        </div>
        <textarea class="dump-textarea" id="questionAnswer" placeholder="La tua risposta..."></textarea>
        <div class="dump-tip">💡 Scrivere aiuta a chiarire i pensieri</div>
      </div>
      <div class="dump-actions">
        <button class="btn secondary" onclick="showScreen('responseScreen')">Chiudi</button>
        <button class="btn primary" onclick="saveGuidedAnswer()">Salva ✓</button>
      </div>
      <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
        <p class="feedback-question">Quanto è stata utile la strategia?</p>
        <div class="feedback-btns">
          <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
          <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
          <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
          <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
          <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
        </div>
      </div>
    </div>
    `,

    tip: `
    <div class="screen-content">
      <div class="dump-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('responseScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="dump-header">
          <div class="dump-emoji" id="tipEmoji">💡</div>
          <h2 class="dump-title" id="tipTitle">Strategia</h2>
        </div>
        <div id="tipContent" style="padding:20px;font-size:0.95rem;line-height:1.7;color:var(--text-secondary);white-space:pre-line"></div>
      </div>
      <div class="dump-actions">
        <button class="btn primary" onclick="showScreen('responseScreen')" style="width:100%">Ho capito ✓</button>
      </div>
      <div class="feedback-section" id="strategyRatingSection" style="margin-top:24px">
        <p class="feedback-question">Quanto è stata utile la strategia?</p>
        <div class="feedback-btns">
          <button class="feedback-btn" data-rating="1" onclick="recordStrategyOutcome(1)">1</button>
          <button class="feedback-btn" data-rating="2" onclick="recordStrategyOutcome(2)">2</button>
          <button class="feedback-btn" data-rating="3" onclick="recordStrategyOutcome(3)">3</button>
          <button class="feedback-btn" data-rating="4" onclick="recordStrategyOutcome(4)">4</button>
          <button class="feedback-btn" data-rating="5" onclick="recordStrategyOutcome(5)">5</button>
        </div>
      </div>
    </div>
    `
};
