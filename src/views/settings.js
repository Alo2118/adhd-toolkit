export const settingsScreen = `
<div class="diary-screen">
    <div class="flow-header">
      <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
      <div style="flex:1"></div>
    </div>
    <div class="insights-header">
      <h1 class="insights-title">⚙️ Gestione Dati</h1>
      <p class="insights-subtitle">Backup e sicurezza</p>
    </div>
    <div style="margin-top:20px">
      <div class="understanding-card" style="margin-bottom:16px">
        <div class="understanding-title">👤 NOME UTENTE</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:16px">
          Personalizza il saluto in home.
        </p>
        <input type="text" id="userNameInput" class="form-input" placeholder="Es. Nicola">
        <button class="timer-btn primary" onclick="saveUserName()" style="width:100%;margin-top:12px">
          Salva nome
        </button>
      </div>
      <div class="understanding-card" style="margin-bottom:16px">
        <div class="understanding-title">🎨 TEMA</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:16px">
          Scegli il tema che preferisci. Puoi seguire il sistema o forzare chiaro/scuro.
        </p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="timer-btn secondary" onclick="setTheme('system')" id="themeSystemBtn">Sistema</button>
          <button class="timer-btn secondary" onclick="setTheme('light')" id="themeLightBtn">Chiaro</button>
          <button class="timer-btn secondary" onclick="setTheme('dark')" id="themeDarkBtn">Scuro</button>
        </div>
      </div>
      <div class="understanding-card" style="margin-bottom:16px">
        <div class="understanding-title">🔔 NOTIFICHE</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:16px">
          Ricevi promemoria gentili per i compiti fermi o le scadenze vicine.
        </p>
        <button class="timer-btn primary" id="notificationsEnableBtn" onclick="requestNotificationPermission()" style="width:100%;margin-bottom:10px">
          🔔 Attiva Notifiche
        </button>
        <button class="timer-btn secondary" id="notificationsDisableBtn" onclick="disableNotifications()" style="width:100%">
          Disattiva Notifiche
        </button>
        <p id="notificationsStatus" style="font-size:0.8rem;color:var(--text-muted);margin-top:12px"></p>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:12px">
          • Compiti fermi da <strong id="taskStuckDaysValue">3</strong> giorni<br>
          • Scadenze entro <strong id="deadlineWarningDaysValue">2</strong> giorni
        </p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">
          <label style="flex:1;min-width:140px">
            <span style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:6px">Giorni fermo</span>
            <input type="number" min="1" max="30" id="taskStuckDaysInput" class="form-input" style="width:100%" onchange="updateNotificationDays()">
          </label>
          <label style="flex:1;min-width:140px">
            <span style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:6px">Avviso scadenza</span>
            <input type="number" min="1" max="30" id="deadlineWarningDaysInput" class="form-input" style="width:100%" onchange="updateNotificationDays()">
          </label>
        </div>
      </div>
      <div class="understanding-card" style="margin-bottom:16px">
        <div class="understanding-title">💾 BACKUP</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:16px">
          Esporta i tuoi dati per creare una copia di sicurezza.
        </p>
        <button class="timer-btn primary" onclick="exportData()" style="width:100%">
          📥 Scarica Backup
        </button>
      </div>
      <div class="understanding-card" style="margin-bottom:16px">
        <div class="understanding-title">📤 RIPRISTINO</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:16px">
          Importa un backup precedente per ripristinare i tuoi dati.
        </p>
        <button class="timer-btn secondary" onclick="importData()" style="width:100%;background:var(--accent-calm);color:white">
          📤 Carica Backup
        </button>
      </div>
      <div class="understanding-card" style="background:rgba(224,122,122,0.1);border:1px solid var(--accent-coral)">
        <div class="understanding-title" style="color:var(--accent-coral)">🗑️ ZONA PERICOLOSA</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:16px">
          Elimina tutti i dati salvati nell'app. Irreversibile.
        </p>
        <button class="timer-btn secondary" onclick="clearAllData()" style="width:100%;background:var(--accent-coral);color:white">
          ⚠️ Elimina Tutti i Dati
        </button>
      </div>
    </div>
</div>
`;
