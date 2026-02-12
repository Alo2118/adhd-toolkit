// Dati per il wizard guidato di riconoscimento difficoltà

export const bodySignals = [
    { id: 'chest_tight', emoji: '💗', label: 'Petto stretto', zone: 'chest', feeling_hint: ['anxious', 'overwhelmed'] },
    { id: 'breath_short', emoji: '😮‍💨', label: 'Fiato corto', zone: 'chest', feeling_hint: ['anxious', 'overwhelmed'] },
    { id: 'heart_racing', emoji: '💓', label: 'Cuore che corre', zone: 'chest', feeling_hint: ['anxious', 'restless'] },
    { id: 'stomach_knot', emoji: '🫄', label: 'Nodo allo stomaco', zone: 'stomach', feeling_hint: ['anxious', 'shame'] },
    { id: 'head_heavy', emoji: '🤯', label: 'Testa pesante', zone: 'head', feeling_hint: ['overwhelmed', 'drained'] },
    { id: 'head_buzzing', emoji: '💭', label: 'Testa che ronza', zone: 'head', feeling_hint: ['scattered', 'overwhelmed'] },
    { id: 'jaw_clenched', emoji: '😬', label: 'Mascella serrata', zone: 'head', feeling_hint: ['frustrated', 'restless'] },
    { id: 'face_hot', emoji: '🔥', label: 'Calore al viso', zone: 'head', feeling_hint: ['shame', 'frustrated'] },
    { id: 'shoulders_tense', emoji: '🏋️', label: 'Spalle tese', zone: 'shoulders', feeling_hint: ['overwhelmed', 'anxious'] },
    { id: 'throat_tight', emoji: '😶', label: 'Gola chiusa', zone: 'throat', feeling_hint: ['blocked', 'shame'] },
    { id: 'legs_restless', emoji: '🦵', label: 'Gambe irrequiete', zone: 'legs', feeling_hint: ['restless', 'anxious'] },
    { id: 'hands_shaky', emoji: '🤲', label: 'Mani agitate', zone: 'hands', feeling_hint: ['anxious', 'restless'] },
    { id: 'skin_tingling', emoji: '✨', label: 'Formicolio', zone: 'body', feeling_hint: ['restless', 'scattered'] },
    { id: 'eyes_heavy', emoji: '😴', label: 'Occhi pesanti', zone: 'head', feeling_hint: ['drained', 'down'] },
    { id: 'nothing', emoji: '🤷', label: 'Non lo so', zone: 'none', feeling_hint: [] },
];

export const contextOptions = [
    { id: 'work', emoji: '💼', label: 'Lavoro/studio' },
    { id: 'home', emoji: '🏠', label: 'A casa' },
    { id: 'social', emoji: '👥', label: 'Con persone' },
    { id: 'transit', emoji: '🚶', label: 'In movimento' },
    { id: 'bed', emoji: '🛏️', label: 'A letto' },
    { id: 'other', emoji: '📍', label: 'Altro' },
];

export const durationOptions = [
    { id: 'just_now', emoji: '⚡', label: 'Appena iniziato', minutes: 5 },
    { id: 'a_while', emoji: '⏰', label: 'Da un po\'', minutes: 30 },
    { id: 'hours', emoji: '🕐', label: 'Da ore', minutes: 120 },
    { id: 'all_day', emoji: '📅', label: 'Tutto il giorno', minutes: 480 },
    { id: 'days', emoji: '📆', label: 'Da giorni', minutes: 1440 },
];

export const intensityEmojis = [
    { level: 1, emoji: '😌', label: 'Lieve', color: '#7dd3a8' },
    { level: 2, emoji: '😐', label: 'Gestibile', color: '#7bd3ff' },
    { level: 3, emoji: '😕', label: 'Fastidioso', color: '#f2b38a' },
    { level: 4, emoji: '😣', label: 'Forte', color: '#ff8c8c' },
    { level: 5, emoji: '🆘', label: 'Insopportabile', color: '#e76868' },
];

export const wizardMessages = {
    welcome: [
        'Fermati un momento. Sei già qui, è il primo passo.',
        'Prendiamoci un attimo per capire cosa sta succedendo.',
        'Nessuna fretta. Esploriamo insieme cosa provi.',
    ],
    bodyIntro: [
        'Il corpo parla prima della mente. Dove lo senti?',
        'Spesso il corpo sa prima di noi. Cosa noti?',
    ],
    intensityIntro: [
        'Quanto è forte quello che provi?',
        'Su una scala da 1 a 5, quanto ti pesa?',
    ],
    feelingIntro: [
        'Ora diamo un nome a quello che senti.',
        'Quale parola risuona di più?',
    ],
    contextIntro: [
        'Dove sei in questo momento?',
        'In che situazione ti trovi?',
    ],
    durationIntro: [
        'Da quanto ti senti così?',
        'Da quando è iniziato?',
    ],
    patternAlert: 'Abbiamo notato un pattern...',
    transitionToStrategies: [
        'Ora che abbiamo capito meglio, troviamo cosa può aiutarti.',
        'Bene. Con quello che mi hai detto, ho delle idee per te.',
    ],
};

// Mappa intensità → urgenza strategie
export const intensityUrgency = {
    1: { approach: 'preventive', label: 'Prevenzione' },
    2: { approach: 'coping', label: 'Coping leggero' },
    3: { approach: 'active', label: 'Strategia attiva' },
    4: { approach: 'crisis', label: 'Intervento rapido' },
    5: { approach: 'emergency', label: 'SOS immediato' },
};
