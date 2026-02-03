export const triggerCategories = [
    {
        category: '🎯 Compiti e decisioni',
        triggers: [
            { id: 'task_paralysis', emoji: '📋', label: 'Devo fare un compito (qualsiasi)', oldIds: ['big_task', 'blocked_big_task'] },
            { id: 'too_many', emoji: '🗂️', label: 'Troppe cose, non so da dove partire', oldIds: ['blocked_too_many'] },
            { id: 'boring_task', emoji: '😑', label: 'Compito ripetitivo o poco stimolante' },
            { id: 'decision', emoji: '🤔', label: 'Devo scegliere tra opzioni' }
        ]
    },
    {
        category: '💭 Emozioni e relazioni',
        triggers: [
            { id: 'criticized', emoji: '💬', label: 'Mi hanno criticato o corretto', oldIds: ['shame_criticized'] },
            { id: 'mistake', emoji: '❌', label: 'Ho fatto un errore', oldIds: ['shame_mistake'] },
            { id: 'conflict', emoji: '💢', label: 'Tensione con qualcuno' },
            { id: 'social_event', emoji: '👥', label: 'Evento sociale che mi mette pressione' }
        ]
    },
    {
        category: '⚡ Attenzione e stimoli',
        triggers: [
            { id: 'distracted', emoji: '📱', label: 'Mi sono perso in qualcosa', oldIds: ['frustrated_distracted'] },
            { id: 'noise', emoji: '🔊', label: 'Troppo rumore/stimoli intorno' },
            { id: 'interruption', emoji: '🔔', label: 'Sono stato interrotto' },
            { id: 'understimulation', emoji: '💤', label: 'Niente mi cattura l\'attenzione' }
        ]
    },
    {
        category: '🔄 Transizioni e tempo',
        triggers: [
            { id: 'transition', emoji: '🔄', label: 'Devo passare a un\'altra cosa' },
            { id: 'routine_break', emoji: '💔', label: 'La mia routine è saltata' },
            { id: 'deadline', emoji: '⏰', label: 'Una scadenza si avvicina' },
            { id: 'waiting', emoji: '⏳', label: 'Devo aspettare e non so cosa fare' }
        ]
    },
    {
        category: '😴 Energia',
        triggers: [
            { id: 'tired', emoji: '😴', label: 'Sono fisicamente stanco' },
            { id: 'drained', emoji: '🥱', label: 'Sono mentalmente esaurito' }
        ]
    },
    {
        category: '❓ Altro',
        triggers: [
            { id: 'unknown', emoji: '❓', label: 'Non so, è arrivato così' }
        ]
    }
];
