export const feelingScreen = `
<div class="wizard-screen wizard-feeling-step">
    <div class="wizard-header">
        <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
        <div class="wizard-steps-indicator">
            <div class="wizard-step-dot active"></div>
            <div class="wizard-step-dot"></div>
            <div class="wizard-step-dot"></div>
        </div>
    </div>
    <div class="wizard-body">
        <h2 class="wizard-title">Cosa provi?</h2>
        <p class="wizard-subtitle">Scegli quello che senti di più</p>
        <div class="wizard-feelings-grid" id="feelingsGrid">
            <!-- Populated by JS -->
        </div>
    </div>
</div>
`;

export const triggerScreen = `
<div class="wizard-screen wizard-trigger-step">
    <div class="wizard-header">
        <button class="back-btn" id="triggerBackBtn" onclick="showScreen('feelingScreen')">←</button>
        <div class="wizard-steps-indicator" id="triggerStepsIndicator">
            <div class="wizard-step-dot completed"></div>
            <div class="wizard-step-dot completed"></div>
            <div class="wizard-step-dot active"></div>
        </div>
    </div>
    <div class="wizard-body">
        <h2 class="wizard-title">Cosa ti blocca?</h2>
        <p class="wizard-subtitle" id="triggerSubtitle">Scegli quello che risuona di più</p>
        <div class="wizard-trigger-list" id="triggersList">
            <!-- Populated by JS -->
        </div>
    </div>
</div>
`;

export const responseScreen = `
<div class="response-screen wizard-screen">
    <div class="wizard-header">
        <button class="back-btn" onclick="showScreen('triggerScreen')">←</button>
        <div class="wizard-steps-indicator" id="responseStepsIndicator">
            <div class="wizard-step-dot completed"></div>
            <div class="wizard-step-dot completed"></div>
            <div class="wizard-step-dot completed"></div>
        </div>
        <button class="close-btn" onclick="showScreen('homeScreen')" style="position:static">×</button>
    </div>
    
    <div class="response-header">
        <div class="response-emoji" id="responseEmoji">🤔</div>
        <div class="response-title">
            <span id="responseFeelingText" style="text-transform: capitalize">...</span>
        </div>
    </div>

    <div class="understanding-card">
        <div class="understanding-title" id="understandingTldr">Analisi...</div>
        <p class="understanding-text" id="understandingText">Sto pensando...</p>
    </div>

    <div class="guided-actions" id="guidedActionsContainer">
        <div class="guided-actions-title">⚡ Prova subito</div>
        <div id="guidedActionsList">
            <!-- Populated by JS -->
        </div>
    </div>

    <div class="strategies-section">
        <div class="strategies-title">🛠️ Altre strategie</div>
        <div id="strategiesList">
            <!-- Populated by JS -->
        </div>
    </div>

</div>
`;
