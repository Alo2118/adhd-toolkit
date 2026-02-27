// Views per il wizard guidato di riconoscimento difficoltà

export const wizardViews = {

    welcome: `
    <div class="wizard-screen wizard-welcome">
        <div class="wizard-header">
            <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
            <div class="wizard-steps-indicator">
                <div class="wizard-step-dot active"></div>
                <div class="wizard-step-dot"></div>
                <div class="wizard-step-dot"></div>
                <div class="wizard-step-dot"></div>
                <div class="wizard-step-dot"></div>
            </div>
        </div>
        <div class="wizard-body">
            <div class="wizard-emoji-float" id="wizardWelcomeEmoji">🫶</div>
            <h2 class="wizard-title" id="wizardWelcomeTitle">Fermati un momento</h2>
            <p class="wizard-subtitle" id="wizardWelcomeText">Sei già qui, è il primo passo. Prendiamoci un attimo per capire cosa sta succedendo.</p>
            <div class="wizard-breathe-prompt">
                <div class="wizard-breathe-circle" id="wizardBreatheCircle"></div>
                <p class="wizard-breathe-text">Fai un respiro profondo...</p>
            </div>
        </div>
        <div class="wizard-footer">
            <button class="wizard-next-btn" onclick="wizardNext('body')">
                Sono pronto
                <span class="wizard-btn-arrow">→</span>
            </button>
            <button class="wizard-skip-btn" onclick="wizardSkipToClassic()">Vai al percorso rapido →</button>
        </div>
    </div>
    `,

    body: `
    <div class="wizard-screen wizard-body-step">
        <div class="wizard-header">
            <button class="back-btn" onclick="wizardBack('welcome')">←</button>
            <div class="wizard-steps-indicator">
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot active"></div>
                <div class="wizard-step-dot"></div>
                <div class="wizard-step-dot"></div>
                <div class="wizard-step-dot"></div>
            </div>
        </div>
        <div class="wizard-body">
            <h2 class="wizard-title" id="wizardBodyTitle">Dove lo senti nel corpo?</h2>
            <p class="wizard-subtitle">Il corpo parla prima della mente</p>
            <div class="wizard-body-grid" id="wizardBodyGrid">
                <!-- Populated by JS -->
            </div>
            <div class="wizard-body-hint" id="wizardBodyHint"></div>
        </div>
        <div class="wizard-footer">
            <button class="wizard-next-btn disabled" id="wizardBodyNext" onclick="wizardNext('intensity')" disabled>
                Avanti
                <span class="wizard-btn-arrow">→</span>
            </button>
        </div>
    </div>
    `,

    intensity: `
    <div class="wizard-screen wizard-intensity-step">
        <div class="wizard-header">
            <button class="back-btn" onclick="wizardBack('body')">←</button>
            <div class="wizard-steps-indicator">
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot active"></div>
                <div class="wizard-step-dot"></div>
                <div class="wizard-step-dot"></div>
            </div>
        </div>
        <div class="wizard-body">
            <h2 class="wizard-title">Quanto è forte?</h2>
            <p class="wizard-subtitle">Scorri per indicare l'intensità</p>
            <div class="wizard-intensity-display">
                <div class="wizard-intensity-emoji" id="wizardIntensityEmoji">😐</div>
                <div class="wizard-intensity-label" id="wizardIntensityLabel">Gestibile</div>
            </div>
            <div class="wizard-slider-container">
                <input type="range" min="1" max="5" value="2" class="wizard-intensity-slider" id="wizardIntensitySlider" oninput="updateWizardIntensity(this.value)">
                <div class="wizard-slider-labels">
                    <span>Lieve</span>
                    <span>SOS</span>
                </div>
            </div>
            <div class="wizard-intensity-bar">
                <div class="wizard-intensity-fill" id="wizardIntensityFill" style="width: 40%"></div>
            </div>
        </div>
        <div class="wizard-footer">
            <button class="wizard-next-btn" onclick="wizardNext('feeling')">
                Avanti
                <span class="wizard-btn-arrow">→</span>
            </button>
        </div>
    </div>
    `,

    feeling: `
    <div class="wizard-screen wizard-feeling-step">
        <div class="wizard-header">
            <button class="back-btn" onclick="wizardBack('intensity')">←</button>
            <div class="wizard-steps-indicator">
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot active"></div>
                <div class="wizard-step-dot"></div>
            </div>
        </div>
        <div class="wizard-body">
            <h2 class="wizard-title">Quale parola risuona di più?</h2>
            <p class="wizard-subtitle" id="wizardFeelingSuggestion">Scegli quello che senti</p>
            <div class="wizard-feelings-grid" id="wizardFeelingsGrid">
                <!-- Populated by JS with smart ordering -->
            </div>
        </div>
        <div class="wizard-footer">
            <button class="wizard-next-btn disabled" id="wizardFeelingNext" onclick="wizardNext('context')" disabled>
                Avanti
                <span class="wizard-btn-arrow">→</span>
            </button>
        </div>
    </div>
    `,

    context: `
    <div class="wizard-screen wizard-context-step">
        <div class="wizard-header">
            <button class="back-btn" onclick="wizardBack('feeling')">←</button>
            <div class="wizard-steps-indicator">
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot completed"></div>
                <div class="wizard-step-dot active"></div>
            </div>
        </div>
        <div class="wizard-body">
            <h2 class="wizard-title">Dove sei adesso?</h2>
            <p class="wizard-subtitle">Il contesto ci aiuta a trovare la strategia giusta</p>
            <div class="wizard-context-grid" id="wizardContextGrid">
                <!-- Populated by JS -->
            </div>
            <div class="wizard-duration-section">
                <h3 class="wizard-section-title">Da quanto ti senti così?</h3>
                <div class="wizard-duration-grid" id="wizardDurationGrid">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>
        <div class="wizard-footer">
            <button class="wizard-next-btn" id="wizardContextNext" onclick="wizardFinish()">
                Cosa ti blocca?
                <span class="wizard-btn-arrow">→</span>
            </button>
        </div>
    </div>
    `,

    summary: `
    <div class="wizard-screen wizard-summary-step">
        <div class="wizard-header">
            <button class="back-btn" onclick="wizardBack('context')">←</button>
            <button class="close-btn" onclick="showScreen('homeScreen')" style="position:static;margin-left:auto">×</button>
        </div>
        <div class="wizard-body">
            <div class="wizard-summary-card" id="wizardSummaryCard">
                <div class="wizard-summary-emoji" id="wizardSummaryEmoji">🤔</div>
                <div class="wizard-summary-title" id="wizardSummaryTitle">Il tuo momento</div>
                <div class="wizard-summary-tags" id="wizardSummaryTags"></div>
                <div class="wizard-summary-insight" id="wizardSummaryInsight"></div>
            </div>
            
            <div class="wizard-pattern-card" id="wizardPatternCard" style="display:none">
                <div class="wizard-pattern-icon">🔄</div>
                <div class="wizard-pattern-text" id="wizardPatternText"></div>
            </div>

            <div class="wizard-urgency-banner" id="wizardUrgencyBanner">
                <span class="wizard-urgency-icon" id="wizardUrgencyIcon">⚡</span>
                <span class="wizard-urgency-text" id="wizardUrgencyText">Strategia attiva</span>
            </div>

            <div class="wizard-trigger-section">
                <h3 class="wizard-section-title">Cosa ti blocca nello specifico?</h3>
                <div class="wizard-trigger-list" id="wizardTriggerList">
                    <!-- Smart-filtered triggers -->
                </div>
            </div>
        </div>
    </div>
    `,
};

export const pulseCheckWidget = `
    <div class="pulse-check" id="pulseCheck" onclick="startPulseCheck()">
        <div class="pulse-ring"></div>
        <div class="pulse-content">
            <div class="pulse-emoji" id="pulseEmoji">💚</div>
            <div class="pulse-text">
                <div class="pulse-title">Come stai?</div>
                <div class="pulse-subtitle">Tocca per un check-in rapido</div>
            </div>
        </div>
    </div>
`;

export const pulseCheckOverlay = `
    <div class="pulse-overlay" id="pulseOverlay">
        <div class="pulse-overlay-content">
            <h3 class="pulse-overlay-title">Come ti senti adesso?</h3>
            <div class="pulse-scale" id="pulseScale">
                <button class="pulse-scale-btn" data-level="1" onclick="recordPulse(1)">
                    <span class="pulse-scale-emoji">😌</span>
                    <span class="pulse-scale-label">Bene</span>
                </button>
                <button class="pulse-scale-btn" data-level="2" onclick="recordPulse(2)">
                    <span class="pulse-scale-emoji">😐</span>
                    <span class="pulse-scale-label">Così così</span>
                </button>
                <button class="pulse-scale-btn" data-level="3" onclick="recordPulse(3)">
                    <span class="pulse-scale-emoji">😕</span>
                    <span class="pulse-scale-label">Non bene</span>
                </button>
                <button class="pulse-scale-btn" data-level="4" onclick="recordPulse(4)">
                    <span class="pulse-scale-emoji">😣</span>
                    <span class="pulse-scale-label">Male</span>
                </button>
                <button class="pulse-scale-btn" data-level="5" onclick="recordPulse(5)">
                    <span class="pulse-scale-emoji">🆘</span>
                    <span class="pulse-scale-label">SOS</span>
                </button>
            </div>
            <button class="pulse-close" onclick="closePulseCheck()">Chiudi</button>
        </div>
    </div>
`;
