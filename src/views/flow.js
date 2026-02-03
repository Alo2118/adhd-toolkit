export const feelingScreen = `
<div class="flow-header">
    <button class="back-btn" onclick="showScreen('homeScreen')">←</button>
    <div class="progress-bar">
        <div class="progress-fill" style="width: 33%"></div>
    </div>
</div>
<h2 class="step-title">Cosa provi?</h2>
<div class="options-grid" id="feelingsGrid">
    <!-- Populated by JS -->
</div>
`;

export const triggerScreen = `
<div class="flow-header">
    <button class="back-btn" onclick="showScreen('feelingScreen')">←</button>
    <div class="progress-bar">
        <div class="progress-fill" style="width: 66%"></div>
    </div>
</div>
<h2 class="step-title">Cosa ti blocca?</h2>
<div class="trigger-list" id="triggersList">
    <!-- Populated by JS -->
</div>
`;

export const responseScreen = `
<div class="response-screen">
    <div class="flow-header">
        <button class="back-btn" onclick="showScreen('triggerScreen')">←</button>
        <div class="progress-bar">
            <div class="progress-fill" style="width: 100%"></div>
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
