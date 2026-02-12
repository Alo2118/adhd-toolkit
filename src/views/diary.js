export const diaryViews = {
    list: `
    <div class="diary-screen diary-screen-v2">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="insights-hero">
          <div class="insights-hero-icon">📝</div>
          <div>
            <h1 class="insights-hero-title">Diario emotivo</h1>
            <p class="insights-hero-sub">Cattura i tuoi momenti</p>
          </div>
        </div>
        <div class="screen-actions-v2" style="display:flex;gap:12px">
          <button class="settings-btn-v2 primary" onclick="showScreen('diaryNewScreen')" style="flex:1">✏️ Nuova nota</button>
          <button class="settings-btn-v2 secondary" onclick="showScreen('historyScreen')" style="flex:1">📋 Storico</button>
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
    <div class="diary-screen insights-screen-v2">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="insights-hero">
          <div class="insights-hero-icon">📊</div>
          <div>
            <h1 class="insights-hero-title">I tuoi pattern</h1>
            <p class="insights-hero-sub">Cosa abbiamo imparato insieme</p>
          </div>
        </div>
        <div class="insights-summary-strip" id="insightsSummary"></div>
        <div id="insightsContent"></div>
        <button class="generate-report-btn" onclick="showScreen('reportScreen')">📄 Crea report PDF</button>
    </div>
    `,

    report: `
    <div class="diary-screen report-screen-v2">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('insightsScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="report-hero-v2">
          <div class="report-hero-icon-v2">📖</div>
          <div>
            <h1 class="report-hero-title">Il mio percorso</h1>
            <p class="report-hero-sub">Un PDF chiaro e condivisibile</p>
          </div>
        </div>
        <div class="report-preview-card" id="reportPreview"></div>
        <div class="report-card-v2">
          <label class="report-option-label">📅 Periodo</label>
          <div class="report-period-v2">
            <button class="report-period-chip selected" id="reportPeriod7" onclick="selectReportPeriod(7)">7 giorni</button>
            <button class="report-period-chip" id="reportPeriod30" onclick="selectReportPeriod(30)">30 giorni</button>
            <button class="report-period-chip" id="reportPeriodAll" onclick="selectReportPeriod(0)">Tutto</button>
            <button class="report-period-chip" id="reportPeriodLast" onclick="selectReportPeriod('last')">Dall'ultima stampa</button>
          </div>
          <div class="report-last-print" id="reportLastPrint"></div>
        </div>
        <div class="report-card-v2">
          <label class="report-option-label">📋 Contenuti del report</label>
          <label class="report-toggle checked" onclick="toggleCheckbox('reportIncludePatterns')">
            <input type="checkbox" id="reportIncludePatterns" checked onclick="event.stopPropagation()">
            <span class="report-toggle-track"><span class="report-toggle-thumb"></span></span>
            <span class="report-toggle-label">Pattern e trigger</span>
          </label>
          <label class="report-toggle checked" onclick="toggleCheckbox('reportIncludeHistory')">
            <input type="checkbox" id="reportIncludeHistory" checked onclick="event.stopPropagation()">
            <span class="report-toggle-track"><span class="report-toggle-thumb"></span></span>
            <span class="report-toggle-label">Momenti registrati</span>
          </label>
          <label class="report-toggle" onclick="toggleCheckbox('reportIncludeDiary')">
            <input type="checkbox" id="reportIncludeDiary" onclick="event.stopPropagation()">
            <span class="report-toggle-track"><span class="report-toggle-thumb"></span></span>
            <span class="report-toggle-label">Note personali</span>
          </label>
          <label class="report-toggle checked" onclick="toggleCheckbox('reportIncludeStrategies')">
            <input type="checkbox" id="reportIncludeStrategies" checked onclick="event.stopPropagation()">
            <span class="report-toggle-track"><span class="report-toggle-thumb"></span></span>
            <span class="report-toggle-label">Strategie efficaci</span>
          </label>
        </div>
        <div class="report-actions-v2">
          <button class="report-download-btn-v2" onclick="generatePDFReport(false)">
            <span class="report-btn-icon">📥</span>
            <div class="report-btn-text">
              <span class="report-btn-title">Scarica PDF</span>
              <span class="report-btn-desc">Salva il report sul dispositivo</span>
            </div>
          </button>
          <button class="report-download-btn-v2 report-btn-secondary" onclick="generatePDFReport(true)">
            <span class="report-btn-icon">✅</span>
            <div class="report-btn-text">
              <span class="report-btn-title">Scarica e aggiorna data</span>
              <span class="report-btn-desc">Per tracciare cosa hai già stampato</span>
            </div>
          </button>
        </div>
    </div>
    `,

    history: `
    <div class="diary-screen history-screen-v2">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="insights-hero">
          <div class="insights-hero-icon">📋</div>
          <div>
            <h1 class="insights-hero-title">Storico</h1>
            <p class="insights-hero-sub" id="historyCount">I tuoi momenti</p>
          </div>
        </div>
        <div class="screen-actions-v2">
          <div class="filter-section-v2">
            <label class="filter-section-label">Periodo</label>
            <div class="filter-chips-row">
              <button class="filter-chip selected" data-period="all" onclick="setHistoryPeriod('all')">Tutto</button>
              <button class="filter-chip" data-period="week" onclick="setHistoryPeriod('week')">Settimana</button>
              <button class="filter-chip" data-period="month" onclick="setHistoryPeriod('month')">Mese</button>
              <button class="filter-chip" data-period="today" onclick="setHistoryPeriod('today')">Oggi</button>
            </div>
          </div>
          <div class="filter-section-v2">
            <label class="filter-section-label">Emozione</label>
            <div id="historyFeelingFilters" class="filter-chips-row"></div>
          </div>
        </div>
        <div id="historyContent"></div>
    </div>
    `
};
