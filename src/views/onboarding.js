export const onboardingSteps = [
    // Step 0 — Benvenuto
    `<div class="onboarding-screen">
        <div class="onboarding-progress">
            <div class="onboarding-progress-fill" style="width: 20%"></div>
        </div>
        <div class="onboarding-content">
            <div class="onboarding-emoji-hero">👋</div>
            <h1 class="onboarding-title">Ciao!</h1>
            <p class="onboarding-text">Benvenuto in <strong>Alo</strong>, il tuo compagno quotidiano per gestire l'ADHD con più consapevolezza.</p>
            <p class="onboarding-text-sm">Questa mini-guida ti aiuterà a configurare l'app in pochi secondi.</p>
        </div>
        <div class="onboarding-actions">
            <button class="onboarding-btn primary" onclick="onboardingNext()">Iniziamo →</button>
        </div>
    </div>`,

    // Step 1 — Come funziona
    `<div class="onboarding-screen">
        <div class="onboarding-progress">
            <div class="onboarding-progress-fill" style="width: 40%"></div>
        </div>
        <div class="onboarding-content">
            <h1 class="onboarding-title">Come funziona?</h1>
            <div class="onboarding-features">
                <div class="onboarding-feature-card">
                    <span class="onboarding-feature-icon">🧭</span>
                    <div>
                        <strong>Percorso guidato</strong>
                        <p>Quando ti senti sopraffatto, l'app ti guida passo-passo a capire cosa stai provando e ti suggerisce strategie.</p>
                    </div>
                </div>
                <div class="onboarding-feature-card">
                    <span class="onboarding-feature-icon">📝</span>
                    <div>
                        <strong>Diario emotivo</strong>
                        <p>Tieni traccia dei tuoi momenti, emozioni e progressi nel tempo.</p>
                    </div>
                </div>
                <div class="onboarding-feature-card">
                    <span class="onboarding-feature-icon">✅</span>
                    <div>
                        <strong>Gestione compiti</strong>
                        <p>Organizza le attività in modo semplice, con promemoria pensati per l'ADHD.</p>
                    </div>
                </div>
                <div class="onboarding-feature-card">
                    <span class="onboarding-feature-icon">🌱</span>
                    <div>
                        <strong>Giardino personale</strong>
                        <p>Ogni azione positiva fa crescere il tuo giardino. Più usi l'app, più fiorisce!</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="onboarding-actions">
            <button class="onboarding-btn secondary" onclick="onboardingBack()">← Indietro</button>
            <button class="onboarding-btn primary" onclick="onboardingNext()">Avanti →</button>
        </div>
    </div>`,

    // Step 2 — Nome utente
    `<div class="onboarding-screen">
        <div class="onboarding-progress">
            <div class="onboarding-progress-fill" style="width: 60%"></div>
        </div>
        <div class="onboarding-content">
            <div class="onboarding-emoji-hero">👤</div>
            <h1 class="onboarding-title">Come ti chiami?</h1>
            <p class="onboarding-text">Così potrò salutarti ogni volta che apri l'app.</p>
            <div class="onboarding-input-wrap">
                <input type="text" id="onboardingNameInput" class="onboarding-input" placeholder="Il tuo nome..." maxlength="30" autocomplete="off">
            </div>
            <p class="onboarding-text-sm">Puoi sempre cambiarlo nelle impostazioni.</p>
        </div>
        <div class="onboarding-actions">
            <button class="onboarding-btn secondary" onclick="onboardingBack()">← Indietro</button>
            <button class="onboarding-btn primary" onclick="onboardingNext()">Avanti →</button>
        </div>
    </div>`,

    // Step 3 — Tema
    `<div class="onboarding-screen">
        <div class="onboarding-progress">
            <div class="onboarding-progress-fill" style="width: 80%"></div>
        </div>
        <div class="onboarding-content">
            <div class="onboarding-emoji-hero">🎨</div>
            <h1 class="onboarding-title">Scegli il tema</h1>
            <p class="onboarding-text">Quale aspetto preferisci?</p>
            <div class="onboarding-theme-options">
                <button class="onboarding-theme-card" id="onbThemeSystem" onclick="onboardingSelectTheme('system')">
                    <span class="onboarding-theme-icon">🔄</span>
                    <span class="onboarding-theme-label">Sistema</span>
                    <span class="onboarding-theme-desc">Segue il tuo dispositivo</span>
                </button>
                <button class="onboarding-theme-card" id="onbThemeLight" onclick="onboardingSelectTheme('light')">
                    <span class="onboarding-theme-icon">☀️</span>
                    <span class="onboarding-theme-label">Chiaro</span>
                    <span class="onboarding-theme-desc">Luminoso e pulito</span>
                </button>
                <button class="onboarding-theme-card" id="onbThemeDark" onclick="onboardingSelectTheme('dark')">
                    <span class="onboarding-theme-icon">🌙</span>
                    <span class="onboarding-theme-label">Scuro</span>
                    <span class="onboarding-theme-desc">Rilassante per gli occhi</span>
                </button>
            </div>
        </div>
        <div class="onboarding-actions">
            <button class="onboarding-btn secondary" onclick="onboardingBack()">← Indietro</button>
            <button class="onboarding-btn primary" onclick="onboardingNext()">Avanti →</button>
        </div>
    </div>`,

    // Step 4 — Notifiche + Pronto
    `<div class="onboarding-screen">
        <div class="onboarding-progress">
            <div class="onboarding-progress-fill" style="width: 100%"></div>
        </div>
        <div class="onboarding-content">
            <div class="onboarding-emoji-hero">🔔</div>
            <h1 class="onboarding-title">Notifiche</h1>
            <p class="onboarding-text">Vuoi ricevere promemoria per compiti fermi e scadenze vicine?</p>
            <div class="onboarding-notify-options">
                <button class="onboarding-notify-btn" id="onbNotifyYes" onclick="onboardingToggleNotify(true)">
                    <span class="onboarding-notify-icon">✅</span>
                    <span>Sì, attiva</span>
                </button>
                <button class="onboarding-notify-btn" id="onbNotifyNo" onclick="onboardingToggleNotify(false)">
                    <span class="onboarding-notify-icon">🚫</span>
                    <span>No, grazie</span>
                </button>
            </div>
            <p class="onboarding-text-sm">Puoi cambiare questa scelta in qualsiasi momento nelle impostazioni.</p>
        </div>
        <div class="onboarding-actions">
            <button class="onboarding-btn secondary" onclick="onboardingBack()">← Indietro</button>
            <button class="onboarding-btn primary accent" onclick="onboardingFinish()">🚀 Inizia!</button>
        </div>
    </div>`
];
