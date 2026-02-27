export const settingsScreen = `
<div class="diary-screen settings-screen-v2">
    <div class="flow-header">
      <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
      <div style="flex:1"></div>
    </div>
    <div class="insights-hero">
      <div class="insights-hero-icon">⚙️</div>
      <div>
        <h1 class="insights-hero-title">Impostazioni</h1>
        <p class="insights-hero-sub">Gestione dati e preferenze</p>
      </div>
    </div>
    <div class="settings-cards-v2">
      <div class="report-card-v2">
        <label class="report-option-label">👤 Nome utente</label>
        <p class="settings-card-desc">Personalizza il saluto in home.</p>
        <input type="text" id="userNameInput" class="form-input" placeholder="Es. Nicola">
        <button class="settings-btn-v2 primary" onclick="saveUserName()">
          Salva nome
        </button>
      </div>
      <div class="report-card-v2">
        <label class="report-option-label">🎨 Tema</label>
        <p class="settings-card-desc">Scegli il tema che preferisci.</p>
        <div class="settings-theme-chips">
          <button class="report-period-chip" onclick="setTheme('system')" id="themeSystemBtn">Sistema</button>
          <button class="report-period-chip" onclick="setTheme('light')" id="themeLightBtn">Chiaro</button>
          <button class="report-period-chip" onclick="setTheme('dark')" id="themeDarkBtn">Scuro</button>
        </div>
      </div>
      <div class="report-card-v2">
        <label class="report-option-label">🔔 Notifiche</label>
        <p class="settings-card-desc">Promemoria per compiti fermi e scadenze vicine.</p>
        <div class="settings-notify-actions">
          <button class="settings-btn-v2 primary" id="notificationsEnableBtn" onclick="requestNotificationPermission()">
            Attiva Notifiche
          </button>
          <button class="settings-btn-v2 secondary" id="notificationsDisableBtn" onclick="disableNotifications()">
            Disattiva Notifiche
          </button>
        </div>
        <p id="notificationsStatus" style="font-size:0.8rem;color:var(--text-muted);margin-top:12px"></p>
        <p class="settings-notify-info">
          Compiti fermi da <strong id="taskStuckDaysValue">3</strong> giorni &middot;
          Scadenze entro <strong id="deadlineWarningDaysValue">2</strong> giorni
        </p>
        <div class="settings-notify-inputs">
          <label class="settings-input-group">
            <span class="settings-input-label">Giorni fermo</span>
            <input type="number" min="1" max="30" id="taskStuckDaysInput" class="form-input" onchange="updateNotificationDays()">
          </label>
          <label class="settings-input-group">
            <span class="settings-input-label">Avviso scadenza</span>
            <input type="number" min="1" max="30" id="deadlineWarningDaysInput" class="form-input" onchange="updateNotificationDays()">
          </label>
        </div>
      </div>
      <div class="report-card-v2">
        <label class="report-option-label">💾 Backup</label>
        <p class="settings-card-desc">Esporta i tuoi dati per una copia di sicurezza.</p>
        <button class="settings-btn-v2 primary" onclick="exportData()">
          Scarica Backup
        </button>
      </div>
      <div class="report-card-v2">
        <label class="report-option-label">📤 Ripristino</label>
        <p class="settings-card-desc">Importa un backup precedente.</p>
        <button class="settings-btn-v2 accent" onclick="importData()">
          Carica Backup
        </button>
      </div>
      <div class="report-card-v2">
        <label class="report-option-label">ℹ️ Versione App</label>
        <p class="settings-card-desc">Versione attuale: <strong id="appVersionValue">—</strong></p>
        <button class="settings-btn-v2 secondary" onclick="checkForUpdates()">
          Controlla Aggiornamenti
        </button>
      </div>
      <div class="report-card-v2 settings-danger-card">
        <label class="report-option-label settings-danger-label">🗑️ Zona pericolosa</label>
        <p class="settings-card-desc">Elimina tutti i dati. Irreversibile.</p>
        <button class="settings-btn-v2 danger" onclick="clearAllData()">
          Elimina Tutti i Dati
        </button>
      </div>
    </div>
</div>
`;
