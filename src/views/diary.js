export const diaryViews = {
    list: `
    <div class="diary-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="diary-header">
          <h1 class="diary-title">📝 Diario emotivo</h1>
          <p class="diary-subtitle">Cattura i tuoi momenti</p>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;padding:0 20px 10px">
          <button class="diary-new-btn" onclick="showScreen('diaryNewScreen')">✏️ Nuova nota</button>
          <button class="diary-new-btn" onclick="showScreen('historyScreen')" style="background:var(--bg-elevated)">📋 Storico</button>
        </div>
        <div class="diary-entries-title">Note recenti</div>
        <div id="diaryEntries"></div>
    </div>
    `,

    new: `
    <div class="diary-new-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('diaryScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="diary-new-header">
          <h2 class="diary-new-title">Come ti senti ora?</h2>
        </div>
        <div class="diary-mood-section">
          <p class="diary-section-label">Il tuo stato d'animo</p>
          <div class="diary-mood-grid" id="diaryMoodGrid"></div>
        </div>
        <div class="diary-text-section">
          <p class="diary-section-label">Cosa vuoi annotare?</p>
          <textarea class="diary-text-input" id="diaryTextInput" placeholder="Scrivi liberamente..."></textarea>
          <div class="diary-prompts">
            <button class="diary-prompt" onclick="addPrompt('Mi sento così perché...')">Mi sento così perché...</button>
            <button class="diary-prompt" onclick="addPrompt('Oggi ho notato che...')">Oggi ho notato...</button>
          </div>
        </div>
    </div>
    <button class="diary-save-btn" onclick="saveDiaryEntry()">Salva nota</button>
    `,

    detail: `
    <div class="diary-detail-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('diaryScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="diary-detail-header" id="diaryDetailHeader"></div>
        <div class="diary-detail-content">
          <p class="diary-detail-text" id="diaryDetailText"></p>
        </div>
        <button class="diary-new-btn" onclick="editDiaryEntry()" style="background:var(--bg-elevated);color:var(--text-primary)">✏️ Modifica nota</button>
        <button class="diary-delete-btn" onclick="deleteDiaryEntry()">🗑️ Elimina nota</button>
    </div>
    `,

    insights: `
    <div class="diary-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="insights-header">
          <h1 class="insights-title">📊 I tuoi pattern</h1>
          <p class="insights-subtitle">Cosa abbiamo imparato insieme</p>
        </div>
        <div id="insightsContent"></div>
    </div>
    `,

    report: `
    <div class="diary-screen report-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('insightsScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="insights-header report-hero">
          <div class="report-hero-icon">📖</div>
          <div>
            <h1 class="insights-title">Il mio percorso ADHD</h1>
            <p class="insights-subtitle">Crea un PDF chiaro e condivisibile</p>
          </div>
        </div>
        <div class="report-card">
          <label class="report-option-label">Periodo</label>
          <div class="report-period">
            <button class="report-period-btn selected" id="reportPeriod7" onclick="selectReportPeriod(7)">7 giorni</button>
            <button class="report-period-btn" id="reportPeriod30" onclick="selectReportPeriod(30)">30 giorni</button>
            <button class="report-period-btn" id="reportPeriodAll" onclick="selectReportPeriod(0)">Tutto</button>
            <button class="report-period-btn" id="reportPeriodLast" onclick="selectReportPeriod('last')">Dall'ultima stampa</button>
          </div>
          <div class="report-last-print" id="reportLastPrint"></div>
        </div>
        <div class="report-card">
          <label class="report-option-label">Cosa vuoi condividere?</label>
          <label class="report-checkbox checked" onclick="toggleCheckbox('reportIncludePatterns')">
            <input type="checkbox" id="reportIncludePatterns" checked onclick="event.stopPropagation()">
            <span class="report-checkbox-label">I miei pattern e trigger</span>
          </label>
          <label class="report-checkbox checked" onclick="toggleCheckbox('reportIncludeHistory')">
            <input type="checkbox" id="reportIncludeHistory" checked onclick="event.stopPropagation()">
            <span class="report-checkbox-label">Momenti in cui ho chiesto aiuto</span>
          </label>
          <label class="report-checkbox" onclick="toggleCheckbox('reportIncludeDiary')">
            <input type="checkbox" id="reportIncludeDiary" onclick="event.stopPropagation()">
            <span class="report-checkbox-label">Le mie note personali</span>
          </label>
          <label class="report-checkbox checked" onclick="toggleCheckbox('reportIncludeStrategies')">
            <input type="checkbox" id="reportIncludeStrategies" checked onclick="event.stopPropagation()">
            <span class="report-checkbox-label">Cosa funziona per me</span>
          </label>
        </div>
        <div class="report-card report-actions">
          <button class="report-download-btn" onclick="generatePDFReport(false)">
          <span>📥</span>
          <span>Scarica PDF</span>
          </button>
          <button class="report-download-btn report-download-secondary" onclick="generatePDFReport(true)">
          <span>✅</span>
          <span>Scarica PDF e aggiorna data stampa</span>
          </button>
        </div>
    </div>
    `,

    history: `
    <div class="diary-screen">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="diary-header">
          <h1 class="diary-title">📋 Storico</h1>
          <p class="diary-subtitle" id="historyCount">I tuoi momenti</p>
        </div>
        <div style="padding:0 20px 16px">
          <div style="margin-bottom:12px">
            <label style="font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;display:block;margin-bottom:8px">Periodo</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="filter-chip selected" data-period="all" onclick="setHistoryPeriod('all')">Tutto</button>
              <button class="filter-chip" data-period="week" onclick="setHistoryPeriod('week')">Settimana</button>
              <button class="filter-chip" data-period="month" onclick="setHistoryPeriod('month')">Mese</button>
              <button class="filter-chip" data-period="today" onclick="setHistoryPeriod('today')">Oggi</button>
            </div>
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;display:block;margin-bottom:8px">Emozione</label>
            <div id="historyFeelingFilters" style="display:flex;gap:6px;flex-wrap:wrap"></div>
          </div>
        </div>
        <div id="historyContent"></div>
    </div>
    `
};
