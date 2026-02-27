export const guidedActions = [
    { id: 'timer', icon: '⏱️', name: 'Timer 2 minuti', desc: 'Inizia per soli 2 minuti', screen: 'timerScreen' },
    { id: 'breathe', icon: '🌬️', name: 'Respira con me', desc: '5 cicli di respirazione', screen: 'breatheScreen' },
    { id: 'dump', icon: '🧠', name: 'Svuota la mente', desc: 'Scrivi tutto senza filtri', screen: 'dumpScreen' },
    { id: 'ground', icon: '🌿', name: 'Torna al presente', desc: 'Tecnica 5-4-3-2-1', screen: 'groundScreen' },
    { id: 'microstep', icon: '🎯', name: 'Micro-step', desc: 'Solo il primissimo passo', screen: 'microStepScreen' }
];

export const groundingSteps = [
    { num: 5, sense: 'VEDI', desc: '5 cose che vedi', placeholders: ['lampada', 'muro', 'telefono', 'finestra', 'mano'] },
    { num: 4, sense: 'TOCCA', desc: '4 cose che tocchi', placeholders: ['tavolo', 'tessuto', 'sedia', 'pelle'] },
    { num: 3, sense: 'SENTI', desc: '3 cose che senti', placeholders: ['respiro', 'traffico', 'musica'] },
    { num: 2, sense: 'ANNUSA', desc: '2 cose che annusi', placeholders: ['aria', 'caffè'] },
    { num: 1, sense: 'GUSTA', desc: '1 cosa che gusti', placeholders: ['saliva'] }
];

export const learnTopics = [
    { emoji: '🧠', title: 'Cos\'è l\'ADHD', content: 'L\'ADHD è una <strong>differenza neurologica</strong> che influenza attenzione, impulsi e regolazione emotiva. Non è pigrizia o mancanza di volontà. Il tuo cervello funziona in modo diverso.', context: 'generale' },
    { emoji: '⚡', title: 'Deficit di dopamina', content: 'Il cervello ADHD produce <strong>meno dopamina</strong>. Per questo cerchi stimoli forti, ti annoi facilmente e hai bisogno di "urgenza" per attivarti.', context: 'generale' },
    { emoji: '🎯', title: 'Iperfocus', content: 'L\'iperfocus è quando sei <strong>totalmente assorbito</strong> in un\'attività interessante. È un superpotere ADHD, ma può farti perdere tempo su cose non prioritarie.', context: 'lavoro' },
    { emoji: '💔', title: 'RSD - Sensibilità al rifiuto', content: 'La <strong>Rejection Sensitive Dysphoria</strong> è quando una critica o un rifiuto ti colpisce 10 volte più forte. È parte dell\'ADHD, non debolezza.', context: 'sociale' },
    { emoji: '⏰', title: 'Cecità temporale', content: 'Il cervello ADHD non percepisce il tempo come gli altri. Ci sono solo <strong>"adesso" e "non adesso"</strong>. Per questo le scadenze lontane non ti motivano.', context: 'lavoro' },
    { emoji: '🌀', title: 'Paralisi da analisi', content: 'Troppe opzioni causano <strong>blocco decisionale</strong>. Il cervello ADHD va in overload. Soluzione: riduci le scelte drasticamente.', context: 'studio' },
    { emoji: '🔋', title: 'Energy management', content: 'Con ADHD l\'energia mentale è <strong>limitata</strong>. Ogni decisione, cambio compito o stimolo la consuma. Gestisci l\'energia, non solo il tempo.', context: 'lavoro' },
    { emoji: '📱', title: 'Distraibilità', content: 'Non è che "non ti concentri". Il tuo cervello <strong>si concentra su tutto</strong> contemporaneamente. Servono barriere esterne (timer, ambiente, body doubling).', context: 'studio' },
    { emoji: '🎲', title: 'Ricerca di novità', content: 'Il cervello ADHD <strong>ama il nuovo</strong>. Per questo inizi mille progetti. Non è mancanza di impegno, è bisogno di stimoli freschi.', context: 'generale' },
    { emoji: '🛡️', title: 'Strategie vs Forza di volontà', content: 'La forza di volontà non basta con ADHD. Servono <strong>sistemi esterni</strong>: timer, checklist, body doubling, environment design.', context: 'lavoro' },
    { emoji: '😴', title: 'Paradosso stanco/agitato', content: 'Con ADHD l\'energia mentale è <strong>limitata</strong>. Ogni decisione, cambio compito o stimolo la consuma. Gestisci l\'energia, non solo il tempo.', context: 'generale' },
    { emoji: '🔄', title: 'Task switching', content: 'Cambiare attività <strong>costa molto</strong> al cervello ADHD. Serve un rituale di chiusura e uno di apertura per ogni transizione.', context: 'lavoro' },
    { emoji: '💊', title: 'Medication & tools', content: 'I farmaci possono aiutare, ma non sono magici. Funzionano meglio <strong>insieme a strategie</strong> comportamentali e sistemi di supporto.', context: 'generale' },
    { emoji: '🎭', title: 'Masking', content: 'Nascondere l\'ADHD per sembrare "normale" consuma <strong>energia immensa</strong>. Va bene mostrare chi sei. L\'ADHD non è difetto.', context: 'sociale' },
    { emoji: '✅', title: 'Sistemi che funzionano', content: '<strong>Timer visivi, body doubling, gamification, chunking, external accountability</strong>. Non cambiare te stesso, cambia l\'ambiente.', context: 'studio' }
];

export const homeMotivations = [
    'Un passo piccolo è già un passo.',
    'Anche 2 minuti contano.',
    'Non serve farlo tutto, basta iniziare.',
    'Il progresso è fatto di micro‑azioni.',
    'Sii gentile con te stesso: ripartiamo da qui.',
    'Una cosa alla volta, davvero.',
    'Se è difficile, riducilo.',
    'Non devi essere perfetto per iniziare.',
    'Piccolo adesso, grande dopo.',
    'Respira. Poi scegli il prossimo micro‑passo.'
];
