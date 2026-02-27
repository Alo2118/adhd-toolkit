export const tasksViews = {
    list: `
    <div class="diary-screen tasks-screen-v2">
        <div class="flow-header">
          <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
          <div style="flex:1"></div>
        </div>
        <div class="insights-hero">
          <div class="insights-hero-icon">✓</div>
          <div>
            <h1 class="insights-hero-title">I miei compiti</h1>
            <p class="insights-hero-sub" id="activeTasksCount">Attività attive</p>
          </div>
        </div>
        <div class="screen-actions-v2">
          <button class="settings-btn-v2 primary" onclick="showAddTaskModal()">+ Nuovo compito</button>
          <div class="filter-section-v2">
            <label class="filter-section-label">Filtro</label>
            <div class="filter-chips-row">
              <button class="filter-chip selected" data-status="all" onclick="setTaskStatusFilter('all')">Tutti</button>
              <button class="filter-chip" data-status="active" onclick="setTaskStatusFilter('active')">Attivi</button>
              <button class="filter-chip" data-status="paused" onclick="setTaskStatusFilter('paused')">In pausa</button>
              <button class="filter-chip" data-status="completed" onclick="setTaskStatusFilter('completed')">Completati</button>
            </div>
          </div>
        </div>
        <div id="activeTasksContent"></div>
    </div>
    `,

    modal: `
    <div class="modal-backdrop" onclick="closeTaskModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="taskModalTitle">Nuovo compito</h2>
          <button class="modal-close" onclick="closeTaskModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nome del compito</label>
            <input type="text" id="taskNameInput" class="form-input" placeholder="es. studiare storia, fare la spesa...">
          </div>
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <select id="taskCategoryInput" class="form-input">
              <option value="">Scegli categoria</option>
              <option value="studio">📚 Studio</option>
              <option value="lavoro">💼 Lavoro</option>
              <option value="casa">🏠 Casa</option>
              <option value="sociale">👥 Sociale</option>
              <option value="cura">💚 Cura di sé</option>
              <option value="admin">📋 Amministrativo</option>
              <option value="altro">📌 Altro</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Scadenza (opzionale)</label>
            <input type="date" id="taskDeadlineInput" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer">
              <input type="checkbox" id="taskRecurringInput" onclick="toggleRecurringSection()" style="width:18px;height:18px;cursor:pointer">
              <span>🔄 Compito ricorrente</span>
            </label>
          </div>
          <div id="recurringSection" style="display:none">
            <div class="form-group">
              <label class="form-label">Frequenza</label>
              <select id="taskRecurringPatternInput" class="form-input" onchange="updateRecurringDaysVisibility()">
                <option value="daily">Giornaliero</option>
                <option value="weekly">Settimanale</option>
                <option value="biweekly">Bisettimanale (ogni 2 settimane)</option>
                <option value="monthly">Mensile</option>
              </select>
            </div>
            <div class="form-group" id="recurringDaysGroup">
              <label class="form-label">Giorni della settimana</label>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <label class="day-checkbox"><input type="checkbox" value="1" id="dayMon" onchange="updateNextOccurrencePreview()"><span>Lun</span></label>
                <label class="day-checkbox"><input type="checkbox" value="2" id="dayTue" onchange="updateNextOccurrencePreview()"><span>Mar</span></label>
                <label class="day-checkbox"><input type="checkbox" value="3" id="dayWed" onchange="updateNextOccurrencePreview()"><span>Mer</span></label>
                <label class="day-checkbox"><input type="checkbox" value="4" id="dayThu" onchange="updateNextOccurrencePreview()"><span>Gio</span></label>
                <label class="day-checkbox"><input type="checkbox" value="5" id="dayFri" onchange="updateNextOccurrencePreview()"><span>Ven</span></label>
                <label class="day-checkbox"><input type="checkbox" value="6" id="daySat" onchange="updateNextOccurrencePreview()"><span>Sab</span></label>
                <label class="day-checkbox"><input type="checkbox" value="0" id="daySun" onchange="updateNextOccurrencePreview()"><span>Dom</span></label>
              </div>
            </div>
            <div id="nextOccurrencePreview" style="margin-top:12px;padding:12px;background:rgba(126,184,218,0.1);border-radius:8px;font-size:0.9rem;color:var(--text-secondary)"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Note (opzionale)</label>
            <textarea id="taskNotesInput" class="form-input" rows="3" placeholder="Aggiungi dettagli..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" onclick="closeTaskModal()">Annulla</button>
          <button class="primary-btn" onclick="handleSaveTask()">Salva</button>
        </div>
      </div>
    `
};
