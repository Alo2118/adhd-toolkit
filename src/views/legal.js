export const legalScreen = `
<div class="legal-screen">
    <div class="legal-header">
        <div class="legal-icon">⚖️</div>
        <h1 class="legal-title">Termini e autorizzazioni</h1>
        <p class="legal-subtitle">Leggi e accetta per continuare</p>
    </div>

    <div class="legal-warning">
        <div class="legal-warning-title">⚠️ Importante</div>
        ADHD Toolkit è uno strumento di supporto e <strong>non sostituisce un parere medico</strong>.
        In caso di emergenza contatta i servizi competenti.
    </div>

    <div class="legal-section">
        <div class="legal-section-title">📄 Termini e condizioni</div>
        <div class="legal-terms" id="legalTermsContent">Caricamento termini...</div>
    </div>

    <div class="legal-consent">
        <label class="legal-checkbox-container">
            <input type="checkbox" id="consentCheckbox1" onchange="updateAcceptButton()">
            <span class="legal-checkbox-label">Ho capito che questa non è un'app medica</span>
        </label>
        <label class="legal-checkbox-container">
            <input type="checkbox" id="consentCheckbox2" onchange="updateAcceptButton()">
            <span class="legal-checkbox-label">Userò le strategie con buon senso</span>
        </label>
        <label class="legal-checkbox-container">
            <input type="checkbox" id="consentCheckbox3" onchange="updateAcceptButton()">
            <span class="legal-checkbox-label">I dati restano sul mio dispositivo</span>
        </label>
        <label class="legal-checkbox-container">
            <input type="checkbox" id="consentCheckbox4" onchange="updateAcceptButton()">
            <span class="legal-checkbox-label">Accetto i termini di utilizzo</span>
        </label>
    </div>

    <div class="legal-actions">
        <button class="legal-decline-btn" onclick="declineTerms()">Non accetto</button>
        <button class="legal-accept-btn" id="acceptBtn" disabled onclick="acceptTerms()">Inizia il percorso</button>
    </div>
</div>
`;
