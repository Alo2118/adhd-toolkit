export const homeScreen = `
<div class="home-screen home-v3">
    <div class="home-top">
        <div class="home-greeting" id="homeGreeting">BUONGIORNO</div>
        <div class="home-title" id="homeWelcome">Bentornato</div>
    </div>

    <div class="home-stats">
        <div class="home-stat-card">
            <div class="home-stat-value" id="homeStreakValue">0</div>
            <div class="home-stat-label">giorni di fila</div>
        </div>
        <div class="home-stat-card">
            <div class="home-stat-value" id="homeMomentsValue">0</div>
            <div class="home-stat-label">momenti tracciati</div>
        </div>
    </div>

    <button class="home-cta-card" onclick="startFlow()">
        <div class="home-cta-text">
            <div class="home-cta-title">Ho bisogno di aiuto</div>
            <div class="home-cta-subtitle">Percorso guidato per capire cosa succede</div>
        </div>
        <div class="home-cta-icon">🧭</div>
    </button>

    <div class="home-garden-card" onclick="openGarden()">
        <div class="home-garden-circle">
            <span id="gardenEmojiDisplay">🌱</span>
        </div>
        <div class="home-garden-info">
            <div class="home-garden-level" id="gardenLevelDisplay" data-garden="home">Lv 1 • Germoglio</div>
            <div class="home-garden-progress">
                <div class="home-garden-progress-fill" id="gardenProgressFill"></div>
            </div>
            <div class="home-garden-points" id="gardenPointsDisplay" data-garden="home">0 / 100 punti al prossimo livello</div>
        </div>
        <button class="home-garden-pause" onclick="event.stopPropagation();showScreen('settingsScreen')">⏸</button>
    </div>

    <div class="quick-actions home-quick-actions">
        <button class="quick-action-card" onclick="showScreen('activeTasksScreen')">
            <div class="quick-action-icon" style="background: rgba(126, 184, 218, 0.15); color: var(--accent-calm);">✓</div>
            <span class="quick-action-label">Compiti</span>
        </button>
        <button class="quick-action-card" onclick="openDiary()">
            <div class="quick-action-icon" style="background: rgba(232, 168, 124, 0.15); color: var(--accent-warm);">📝</div>
            <span class="quick-action-label">Diario</span>
        </button>
        <button class="quick-action-card" onclick="showMoreMenu()">
            <div class="quick-action-icon" style="background: rgba(125, 211, 168, 0.15); color: var(--accent-green);">⋯</div>
            <span class="quick-action-label">Altro</span>
        </button>
    </div>
    
    <div class="quote-container">
        <p class="quote-text" id="homeMotivation">Un passo piccolo è già un passo.</p>
    </div>
    <div class="home-copyright">© 2026 Alo – Tutti i diritti riservati</div>
</div>
`;
