// Main application entry point
import { feelings } from './data/feelings.js';
import { triggerCategories, triggers } from './data/triggers.js';
import { diaryMoods } from './data/moods.js';
import { learnTopics } from './data/learn.js';
import { contextStrategies } from './data/strategies.js';
import { responses } from './data/responses.js';
import { state } from './utils/state.js';
import { loadState, saveState, exportData, importData, clearAllData, STORAGE_KEY, SCHEMA_VERSION } from './utils/storage.js';
import { showToast, toggleCheckbox, filterDataByPeriod, detectTaskCategory, normalizeTaskName, getCategoryEmoji } from './utils/helpers.js';
import {
  checkGardenDecay, getGardenLevel, getGardenEmoji, getGardenName,
  addGardenPoints, pauseGarden, resumeGarden, updateGardenBadge,
  updateMainButton, showGardenPauseModal
} from './components/garden.js';
import { APP_VERSION } from './config/version.js';

// Constants
const guidedActions=[{id:'timer',icon:'⏱️',name:'Timer 2 minuti',desc:'Inizia per soli 2 minuti',screen:'timerScreen'},{id:'breathe',icon:'🌬️',name:'Respira con me',desc:'5 cicli di respirazione',screen:'breatheScreen'},{id:'dump',icon:'🧠',name:'Svuota la mente',desc:'Scrivi tutto senza filtri',screen:'dumpScreen'},{id:'ground',icon:'🌿',name:'Torna al presente',desc:'Tecnica 5-4-3-2-1',screen:'groundScreen'},{id:'microstep',icon:'🎯',name:'Micro-step',desc:'Solo il primissimo passo',screen:'microStepScreen'}];
const strategyExplanations={'Body doubling':'La presenza di qualcuno riduce la solitudine cognitiva e crea responsabilità esterna. Il cervello ADHD lavora meglio con un\'ancora sociale.','Versione brutta':'Il perfezionismo blocca l\'inizio. Una versione imperfetta esiste, una perfetta mai iniziata no. Puoi sempre migliorare dopo.','Primo micro-step':'Il cervello ADHD si blocca sui compiti grandi. Il primo micro-step bypassa la paralisi perché è troppo piccolo per spaventare.','Deadline artificiale':'L\'urgenza attiva adrenalina e dopamina. Crea la pressione necessaria per attivare il cervello ADHD che funziona meglio sotto deadline.','Regola dei 3':'Troppe opzioni sovraccaricano la working memory. 3 è il numero massimo gestibile dal cervello ADHD senza paralisi decisionale.','Domanda magica':'Forzare una scelta elimina la paralisi. Se potessi fare solo UNA cosa, il cervello deve decidere invece di girare a vuoto.','Esternalizza lista':'Scrivere libera la working memory. Vedere visivamente le opzioni aiuta a scegliere invece di tenerle tutte in testa.','Eliminazione rapida':'Ridurre le opzioni riduce il carico cognitivo. Ogni cosa eliminata è energia risparmiata per ciò che conta.','Gamification':'Il gioco produce dopamina. Trasformare un compito noioso in sfida attiva il cervello ADHD che cerca stimoli.','Ricompensa dopo':'La dopamina della ricompensa anticipata aiuta a iniziare. Sapere cosa viene dopo crea motivazione esterna.','Musica/podcast':'Stimoli extra riempiono il bisogno di dopamina. Il cervello ADHD lavora meglio con doppia stimolazione controllata.','Pomodoro da 10':'10 minuti è abbastanza breve da non spaventare, abbastanza lungo da fare progresso. Spesso basta per sbloccarsi.','Ponte mentale':'Finire con successo riduce la resistenza alla transizione. Un mini-win dà dopamina per affrontare il cambio.','Nuovo contesto':'Cambio fisico aiuta il cambio mentale. Il cervello ADHD associa contesti a stati, spostarsi facilita il reset.','Chiusura esplicita':'Dire ad alta voce chiude il loop mentale aperto. Il cervello ADHD ha difficoltà a chiudere task senza rituale esplicito.','Buffer 5 minuti':'La pausa vuota permette al cervello di scaricare il contesto precedente prima di caricare il nuovo. Previene sovraccarico.','Fatto vs Interpretazione':'RSD fa confondere fatto e interpretazione. Separare i due mostra che la reazione è amplificata, non reale.','Test del tempo':'La prospettiva temporale riduce l\'intensità emotiva. Ciò che sembra enorme ora diventa piccolo nel tempo.','Scala RSD':'Riconoscere che la reazione è 10x aiuta a scalare giù. La consapevolezza dell\'amplificazione riduce il dolore.','Distanza temporale':'24 ore permettono all\'onda RSD di passare. Dopo, la reazione è più proporzionata e la risposta più chiara.','Zoom out':'Il contesto ridimensiona l\'errore. Su 100 cose, 99 vanno bene. L\'errore è eccezione, non regola.','Ripara e vai':'L\'azione ripara la vergogna. Fare qualcosa di concreto sposta da \"sono sbagliato\" a \"ho fatto un errore, ora lo sistemo\".','Diario vittorie':'Il cervello ADHD dimentica i successi e ricorda gli errori. Scrivere le vittorie bilancia la narrativa negativa.','Sistema, non colpa':'Gli errori ADHD richiedono sistemi, non forza di volontà. Checklist e reminder funzionano, colpevolizzarsi no.','Compassione':'Con ADHD è normale distrarsi. La compassione riduce la vergogna che peggiora il problema.','Normalizza':'Sapere che è ADHD, non te, riduce la vergogna. 10 persone ADHD = 10 distratte. È neurologia.','Reset ambientale':'Rimuovere stimoli riduce il carico sul filtro attentivo debole. Meno input = più focus.','Ancora al presente':'L\'ansia vive nel futuro. Tornare al presente riduce l\'ansia perché nel qui-e-ora non c\'è pericolo.','Worst case':'Scrivere lo scenario peggiore mostra che raramente è catastrofico. L\'ansia amplifica, la scrittura ridimensiona.','Micro-azione':'Un passo così piccolo bypassa l\'ansia. Il cervello dice \"ok, questo posso farlo\" e l\'azione spezza il blocco.','Mini-win':'Il progresso produce dopamina e riduce l\'ansia. Anche piccolo, il movimento avanti calma.','Relativizza':'La scala 1-10 ridimensiona. L\'ansia dice 10/10, la realtà spesso è 3/10.','Triage brutale':'Eliminare ciò che non è urgente riduce il sovraccarico. Ogni cosa tolta è energia risparmiata.','Una cosa alla volta':'Il multitasking sovraccarica la working memory ADHD. Focus seriale funziona, parallelo blocca.','Chiudi tutte le tab':'Ogni tab aperta è un carico cognitivo. Chiuderle libera memoria mentale per ciò che conta.','Lista di 3':'3 è il numero magico. Più di 3 sovraccarica, meno di 3 sottoutilizza. 3 è gestibile.','Riduzione stimoli':'Cuffie e luce soft riducono input sensoriali. Meno stimoli = meno energia spesa a filtrarli.','Break sensoriale':'5 minuti di silenzio e buio resettano il sistema sensoriale sovraccarico. Come riavviare un computer.','Rifugio sensoriale':'Avere un posto sicuro riduce l\'ansia da sovraccarico. Sapere dove andare calma.','Stimming controllato':'Fidget permette al corpo di scaricare energia irrequieta senza disturbare il focus. Movimento mirato.','Dimezza opzioni':'Ogni opzione consuma energia decisionale. Dimezzare libera energia per la scelta finale.','Flip a coin':'La moneta decide quando tu non puoi. Elimina la paralisi e spesso rivela la preferenza vera (\"speri che esca X\").','Timer di decisione':'Il limite temporale forza la scelta. La paralisi finisce quando il tempo finisce.','Delega decisione':'Quando l\'energia decisionale è zero, delegare è strategia valida. Non è debolezza, è efficienza.','Mini-routine':'Anche 3 passi ripetibili creano struttura. La routine sostituisce la decisione, risparmiando energia.','Ancora esterna':'Timer, posto, rituale sono protesi cognitive. Il cervello ADHD ha bisogno di ancore esterne.','Routine di emergenza':'Versione minima per giorni caotici. Meglio routine ridotta che nessuna routine.','Rituale reset':'Respiro-acqua-lista è reset rapido. Quando tutto salta, questo ricrea un minimo di struttura.','Separa ansia da fatto':'L\'ansia è emozione, il fatto è realtà. Separarli mostra che spesso l\'ansia mente.','Mini-task':'Lista di cose da 2 minuti riempie il bisogno di azione. Il cervello ADHD vuole fare, dare micro-task calma.','Fidget strategico':'Movimento ripetitivo occupa l\'irrequietezza senza richiedere attenzione. Penna, stress ball, respiro.','Phone time-box':'5 minuti con timer previene il buco nero dello scroll. Il limite contiene l\'impulsività.','Cammina':'Movimento fisico scarica energia irrequieta. 5 minuti di cammino resettano il sistema nervoso.','Quiet stillness':'Osservare senza fare calma il cervello iperattivo. Sdraiato, occhi aperti, solo osservare.','Stretching dolce':'Movimento lento senza cardio rilassa il corpo senza eccitare il cervello. Reset gentile.','White noise':'Rumore costante maschera stimoli variabili. Il cervello ADHD si calma con input prevedibile.','Body scan':'Attenzione progressiva al corpo sposta focus da pensieri a sensazioni. Grounding somatico.','Snapshot mentale':'Scrivere veloce cattura lo stato pre-interruzione. Permette ricostruzione dopo.','Foto schermo':'Screenshot letterale preserva il contesto visivo. Ricostruire è più facile con immagine.','Segnale protezione':'Cuffie o cartello previene interruzioni. Proteggere l\'iperfocus è legittimo.','Accetta e lascia':'L\'iperfocus perso non torna. Accettare riduce frustrazione, respirare permette ricostruzione.','Alarm ogni 30min':'Timer ricorrente interrompe l\'iperfocus sulla cosa sbagliata. Check-in regolare mantiene priorità.','Self-compassion':'Hai ADHD, il cervello funziona così. Non è colpa, è neurologia. Compassione riduce vergogna.','Celebra redirect':'Tornare al focus dopo distrazione è vittoria. Conta come successo, non fallimento.','Repair action':'Azione concreta ripara vergogna. Fare qualcosa sposta da emozione paralizzante ad azione costruttiva.','Checklist preventiva':'Sistema previene, volontà fallisce. Checklist funziona perché non richiede memoria.','Friend perspective':'Useresti compassione per un amico. Merita la stessa compassione da te.','Fonte check':'Chi critica? Conosce ADHD? Fonte ignara non è fonte valida.','24h rule':'L\'onda RSD passa in 24 ore. Aspettare previene reazione amplificata che peggiora tutto.','Vittorie recenti':'Scrivere successi bilancia il bias negativo. Il cervello ADHD dimentica vittorie, va ricordato.','Permesso di fermarti':'Riposare è produttivo per il cervello ADHD che lavora più intenso. Non è pigrizia.','Check fisico':'Fame, sete, sonno influenzano energia cognitiva. Check basics prima di assumere problema mentale.','Power nap 20min':'20 minuti resettano senza inerzia del sonno. Più lungo causa grogginess, meno non basta.','Modalità sopravvivenza':'Giorni duri richiedono minimo. Solo essenziale, resto aspetta. Preservare energia.','Modalità autopilota':'Zero decisioni, solo routine automatiche. Quando energia decisionale è zero.','Elimina scelte':'Ogni scelta consuma energia. Default elimina decisione.','Domani decide':'Lista per domani scarica la mente. Oggi solo esegue ciò che è deciso.','Brain dump totale':'Svuotare tutti i pensieri su carta libera RAM mentale. Poi scegliere uno.','Focus su uno':'Carta e penna, un compito, timer. Mono-focus funziona per ADHD, multi-focus blocca.','Ambiente nudo':'Solo necessario sul tavolo riduce stimoli competitivi. Meno scelte = più focus.','Riparti da zero':'Chiudi tutto, respiro, riapri essenziale. Reset completo quando dispersione è totale.','Chiusura rituale':'Dire \"ho finito X\" chiude loop mentale. Il cervello ADHD ha bisogno di chiusura esplicita.','Reset fisico':'Alzarsi e camminare 2 min resetta il sistema. Movimento aiuta transizione.','Pausa buffer':'5 minuti vuoti tra task permettono scarico contesto vecchio. Previene sovrapposizione mentale.','Checklist transizione':'Passi espliciti per chiudere A e aprire B. Rituale riduce energia di switching.','Cattura pensieri':'Nota rapida preserva contesto mentale. \"Ero qui, pensavo questo\" permette ricostruzione.','Ricostruisci contesto':'Rileggere ultime 5 righe ricarica contesto in memoria. Più facile che ricreare da zero.','Segnale busy':'Prevenire è meglio che riparare. Segnale visibile protegge il focus.','Accetta perdita':'Combattere frustrazione consuma energia. Accettare e ricostruire è più efficiente.','Stimolo extra':'Musica energica o podcast aggiunge dopamina. Doppia stimolazione per compito noioso.','Sprint 10 min':'10 minuti di intensità massima poi break. L\'intensità produce dopamina.','Ride the wave':'Non combattere l\'emozione, osservarla passare. Resistere amplifica, osservare calma.','Nessuna decisione':'Giorni di down non sono per decisioni importanti. Proteggere da scelte che peggioreranno tutto.','Attività passiva':'Serie TV, musica permettono al cervello di riposare. Non tutto richiede produttività.','Script mentale':'3 frasi pronte riducono ansia sociale. Sapere cosa dire calma.','Exit strategy':'Sapere di poter uscire riduce ansia. Il limite temporale contiene la paura.','Ruolo sociale':'Fare domande sposta focus da te agli altri. Meno ansia performativa.','Time-box':'Resto 1 ora\" definisce confine. Il limite riduce l\'ansia dell\'infinito.','Pausa prima':'5 respiri prima di rispondere previene reazione impulsiva amplificata da RSD.','Fatti vs Paura':'Separare fatto da paura mostra amplificazione. Consapevolezza riduce intensità.','Scrivi prima':'Buttare tutto su carta scarica l\'emotività. Poi scegliere cosa dire.','RSD check':'\"Mia reazione 10x, scala a 1x\" ridimensiona. Consapevolezza amplificazione aiuta.','Contenitore vittorie':'Scrivere 3 cose di cui vai fiero contrasta narrativa negativa. Bias positivo intenzionale.','Questo non sei tu':'Feedback su azione, non identità. Errore non definisce valore.','ADHD context':'Critica ignora neurologia? Fonte senza contesto ADHD non è valida.','Timeline di vittorie':'Rileggere note positive ricorda i successi. Memoria ADHD dimentica vittorie.','Pattern fix':'Quale sistema previene questo errore? Focus su soluzione, non colpa.','Contatore successi':'Quante cose bene oggi? Maggioranza è successo, errore è eccezione.','Amico ADHD':'Cosa diresti a amico con ADHD? Quella compassione è per te.'};
const groundingSteps=[{num:5,sense:'VEDI',desc:'5 cose che vedi',placeholders:['lampada','muro','telefono','finestra','mano']},{num:4,sense:'TOCCA',desc:'4 cose che tocchi',placeholders:['tavolo','tessuto','sedia','pelle']},{num:3,sense:'SENTI',desc:'3 cose che senti',placeholders:['respiro','traffico','musica']},{num:2,sense:'ANNUSA',desc:'2 cose che annusi',placeholders:['aria','caffè']},{num:1,sense:'GUSTA',desc:'1 cosa che gusti',placeholders:['saliva']}];













let currentFlow={feeling:null,intensity:3,trigger:null,taskName:'',notes:''};
let screenHistory=['homeScreen'];
let timerInterval=null,timerSeconds=120,timerTotalSeconds=120;
let breatheCycles=5;
let currentGroundStep=0;
let diaryMood=null;
let currentDiaryEntry=null;
let reportPeriodDays=7;
let historyPeriodFilter='all';
let historyFeelingFilter=null;
let taskStatusFilter='all';
let currentEditingTaskId=null;
function checkLegalConsent() {
  const consent = localStorage.getItem('legal-consent');
  if (consent === 'accepted') {
    document.getElementById('legalScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.add('active');
  } else {
    document.getElementById('legalScreen').classList.add('active');
    document.getElementById('homeScreen').classList.remove('active');
  }
}

function updateAcceptButton() {
  const check1 = document.getElementById('consentCheckbox1').checked;
  const check2 = document.getElementById('consentCheckbox2').checked;
  const check3 = document.getElementById('consentCheckbox3').checked;
  const check4 = document.getElementById('consentCheckbox4').checked;
  document.getElementById('acceptBtn').disabled = !(check1 && check2 && check3 && check4);
}

function acceptTerms() {
  localStorage.setItem('legal-consent', 'accepted');
  localStorage.setItem('legal-consent-date', new Date().toISOString());
  document.getElementById('legalScreen').classList.remove('active');
  document.getElementById('homeScreen').classList.add('active');
  showToast('✅ Benvenuto!');
}

function declineTerms() {
  if (confirm('Se rifiuti i termini non potrai utilizzare l\'app. Sei sicuro?')) {
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;text-align:center;padding:40px;color:#f0f0f5"><div style="font-size:3rem;margin-bottom:20px">😔</div><h2 style="margin-bottom:10px">Termini rifiutati</h2><p style="color:#a0a0b8">Per utilizzare l\'app devi accettare i Termini e Condizioni.</p><button onclick="location.reload()" style="margin-top:30px;padding:14px 28px;background:#7eb8da;color:#1a1a2e;border:none;border-radius:100px;font-weight:700;cursor:pointer">Riprova</button></div>';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  checkLegalConsent();
  loadState();
  updateHomeScreen();
  renderFeelings();
  renderTriggers();
  renderDiaryMoods();
  checkAndScheduleNotifications();
});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});



function getBestStrategyForFeeling(feeling){
  const stats={};
  state.history.filter(h=>h.feeling===feeling&&h.strategyUsed).forEach(h=>{
    if(!stats[h.strategyUsed])stats[h.strategyUsed]={used:0,completed:0};
    stats[h.strategyUsed].used++;
    if(h.strategyCompleted)stats[h.strategyUsed].completed++;
  });
  let best=null;
  let bestRate=0;
  for(const[name,s]of Object.entries(stats)){
    if(s.used<2)continue;
    const rate=s.completed/s.used;
    if(rate>bestRate){bestRate=rate;best={name,rate,used:s.used};}
  }
  return best;
}

function getBestStrategyForTrigger(trigger){
  const stats={};
  state.history.filter(h=>h.trigger===trigger&&h.strategyUsed).forEach(h=>{
    if(!stats[h.strategyUsed])stats[h.strategyUsed]={used:0,completed:0};
    stats[h.strategyUsed].used++;
    if(h.strategyCompleted)stats[h.strategyUsed].completed++;
  });
  let best=null;
  let bestRate=0;
  for(const[name,s]of Object.entries(stats)){
    if(s.used<2)continue;
    const rate=s.completed/s.used;
    if(rate>bestRate){bestRate=rate;best={name,rate,used:s.used};}
  }
  return best;
}

function getRecentSuccessRate(days=7){
  const cutoff=new Date();
  cutoff.setDate(cutoff.getDate()-days);
  const recent=state.history.filter(h=>new Date(h.date)>=cutoff&&h.strategyUsed);
  if(recent.length===0)return null;
  const completed=recent.filter(h=>h.strategyCompleted).length;
  return{total:recent.length,completed,rate:completed/recent.length};
}

function getTemporalPatterns(){
  const patterns={dayOfWeek:{},hourOfDay:{}};
  state.history.forEach(h=>{
    const d=new Date(h.date);
    const day=d.getDay();
    const hour=d.getHours();
    patterns.dayOfWeek[day]=(patterns.dayOfWeek[day]||0)+1;
    patterns.hourOfDay[hour]=(patterns.hourOfDay[hour]||0)+1;
  });
  const topDay=Object.entries(patterns.dayOfWeek).sort((a,b)=>b[1]-a[1])[0];
  const topHour=Object.entries(patterns.hourOfDay).sort((a,b)=>b[1]-a[1])[0];
  const dayNames=['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  return{
    dayOfWeek:topDay?{day:parseInt(topDay[0]),name:dayNames[topDay[0]],count:topDay[1]}:null,
    hourOfDay:topHour?{hour:parseInt(topHour[0]),count:topHour[1]}:null
  };
}

function getPersonalStrategyStats() {
  const stats = {};
  state.history.forEach(h => {
    if (h.strategyUsed) {
      if (!stats[h.strategyUsed]) stats[h.strategyUsed] = { used: 0, completed: 0 };
      stats[h.strategyUsed].used++;
      if (h.strategyCompleted) stats[h.strategyUsed].completed++;
    }
  });
  return Object.entries(stats)
    .filter(([, s]) => s.used >= 2)
    .map(([name, s]) => ({ name, used: s.used, completed: s.completed, rate: s.completed / s.used }))
    .sort((a, b) => b.rate - a.rate || b.used - a.used);
}

function getPersonalInsights(){
  if(state.history.length<3)return null;
  const insights={};

  insights.recentSuccess=getRecentSuccessRate(7);
  insights.topStrategies=getPersonalStrategyStats().slice(0,3);
  insights.temporalPatterns=getTemporalPatterns();

  const feelingCounts={};
  state.history.forEach(h=>{feelingCounts[h.feeling]=(feelingCounts[h.feeling]||0)+1;});
  const topFeeling=Object.entries(feelingCounts).sort((a,b)=>b[1]-a[1])[0];
  if(topFeeling){
    const bestStrat=getBestStrategyForFeeling(topFeeling[0]);
    insights.feelingStrategy={feeling:topFeeling[0],count:topFeeling[1],bestStrategy:bestStrat};
  }

  const triggerCounts={};
  state.history.forEach(h=>{triggerCounts[h.trigger]=(triggerCounts[h.trigger]||0)+1;});
  const topTrigger=Object.entries(triggerCounts).sort((a,b)=>b[1]-a[1])[0];
  if(topTrigger){
    const bestStrat=getBestStrategyForTrigger(topTrigger[0]);
    insights.triggerStrategy={trigger:topTrigger[0],count:topTrigger[1],bestStrategy:bestStrat};
  }

  return insights;
}

function getRecentTasks(limit=5){const tasks=Object.values(state.tasks).sort((a,b)=>new Date(b.lastMentioned)-new Date(a.lastMentioned));return tasks.slice(0,limit);}
function isTaskRelatedTrigger(trigger){const taskTriggers=['task_paralysis','too_many','boring_task','transition','decision','big_task'];return taskTriggers.includes(trigger);}
function mapTriggerForResponse(trigger){const triggerMap={'task_paralysis':'big_task','criticized':'criticized','mistake':'mistake','conflict':'conflict','social_event':'social_event','distracted':'distracted','noise':'noise','interruption':'interruption','understimulation':'boring_task','transition':'transition','routine_break':'routine_break','deadline':'deadline','waiting':'waiting','tired':'tired','drained':'too_many','decision':'decision','boring_task':'boring_task','too_many':'too_many','unknown':'unknown','big_task':'big_task'};return triggerMap[trigger]||trigger;}

function updateTaskDatabase(taskName, category, feeling, trigger, intensity, strategyUsed, completed) {
  if (!taskName) return;

  const taskId = normalizeTaskName(taskName);

  // Initialize task if doesn't exist
  if (!state.tasks[taskId]) {
    state.tasks[taskId] = {
      name: taskName,
      category: category,
      firstSeen: new Date().toISOString(),
      lastMentioned: new Date().toISOString(),
      timesBlocked: 0,
      timesResolved: 0,
      feelings: {},
      triggers: {},
      strategies: {},
      avgIntensity: 0,
      totalIntensity: 0,
      count: 0
    };
  }

  const task = state.tasks[taskId];
  task.lastMentioned = new Date().toISOString();
  task.count++;
  task.totalIntensity += intensity;
  task.avgIntensity = (task.totalIntensity / task.count).toFixed(1);
  task.timesBlocked++;
  if (completed) task.timesResolved++;

  task.feelings[feeling] = (task.feelings[feeling] || 0) + 1;
  task.triggers[trigger] = (task.triggers[trigger] || 0) + 1;

  if (strategyUsed) {
    if (!task.strategies[strategyUsed]) {
      task.strategies[strategyUsed] = { used: 0, completed: 0 };
    }
    task.strategies[strategyUsed].used++;
    if (completed) task.strategies[strategyUsed].completed++;
  }

  saveState();
}

function getBestStrategyForTask(taskId) {
  const task = state.tasks[taskId];
  if (!task || !task.strategies) return null;

  let best = null;
  let bestRate = 0;

  for (const [stratName, stats] of Object.entries(task.strategies)) {
    if (stats.used < 2) continue; // Need at least 2 uses
    const rate = stats.completed / stats.used;
    if (rate > bestRate) {
      bestRate = rate;
      best = { name: stratName, rate: rate, used: stats.used };
    }
  }

  return best;
}
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY && e.newValue) {
    try {
      const newState = JSON.parse(e.newValue);
      if (newState && typeof newState === 'object') {
        state.history = Array.isArray(newState.history) ? newState.history : state.history;
        state.diary = Array.isArray(newState.diary) ? newState.diary : state.diary;
        state.patterns = newState.patterns || state.patterns;
        state.garden = (newState.garden && typeof newState.garden === 'object') ? newState.garden : state.garden;
        state.tasks = (newState.tasks && typeof newState.tasks === 'object') ? newState.tasks : state.tasks;
        state.userName = (newState.userName && typeof newState.userName === 'string') ? newState.userName : state.userName;
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen) {
          const id = activeScreen.id;
          if (id === 'insightsScreen') renderInsights();
          if (id === 'historyScreen') renderHistory();
          if (id === 'diaryScreen') renderDiaryEntries();
          if (id === 'homeScreen') updateHomeScreen();
        }
      }
    } catch (err) {
    }
  }
});




function saveUserName(){
  const input=document.getElementById('userNameInput');
  if(!input)return;
  const name=input.value.trim();
  if(!name){
    showToast('⚠️ Inserisci un nome');
    return;
  }
  if(name.length>20){
    showToast('⚠️ Nome troppo lungo (max 20 caratteri)');
    return;
  }
  state.userName=name;
  saveState();
  updateHomeScreen();
  showToast('✓ Nome salvato: '+name);
}

function loadUserNameInSettings(){
  const input=document.getElementById('userNameInput');
  if(!input)return;
  input.value=state.userName==='Bentornato'?'':state.userName;
}

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');if(screenHistory[screenHistory.length-1]!==id)screenHistory.push(id);if(id==='homeScreen')updateHomeScreen();if(id==='settingsScreen')loadUserNameInSettings();if(id==='insightsScreen')renderInsights();if(id==='historyScreen')renderHistory();if(id==='diaryScreen')renderDiaryEntries();if(id==='groundScreen')initGrounding();if(id==='learnScreen')renderLearn();if(id==='activeTasksScreen')renderActiveTasks();const fabContainer=document.getElementById('fabContainer');if(fabContainer){fabContainer.style.display=(id==='homeScreen'||id==='diaryScreen'||id==='activeTasksScreen')?'block':'none';}}
function goBack(){screenHistory.pop();const prev=screenHistory[screenHistory.length-1]||'homeScreen';document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(prev).classList.add('active');}
function setGreeting(){const h=new Date().getHours();const greetingEl=document.getElementById('greeting');const userNameEl=document.getElementById('userName');if(greetingEl)greetingEl.textContent=h<12?'Buongiorno':h<18?'Buon pomeriggio':'Buonasera';if(userNameEl){const userName=state.userName||'Bentornato';userNameEl.textContent=userName;}}

function calculateStreak() {
  if (state.history.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort history by date descending
  const sortedHistory = [...state.history].sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  let currentDate = new Date(today);

  for (const entry of sortedHistory) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    if (entryDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (entryDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
}

function updateHomeScreen() {
  setGreeting();
  updateGardenBadge();

  // Update stats if home stats element exists
  const homeStats = document.getElementById('homeStats');
  if (homeStats && state.history.length > 0) {
    const streak = calculateStreak();
    const totalMoments = state.history.length;
    const recentMoments = filterDataByPeriod(state.history, 7).length;

    homeStats.innerHTML = `
      <div style="display:flex;gap:12px;margin-top:16px">
        <div style="flex:1;background:var(--bg-card);padding:12px;border-radius:var(--radius-md);text-align:center">
          <div style="font-size:1.5rem;font-weight:700;color:var(--accent-energy)">${streak}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">giorni di fila</div>
        </div>
        <div style="flex:1;background:var(--bg-card);padding:12px;border-radius:var(--radius-md);text-align:center">
          <div style="font-size:1.5rem;font-weight:700;color:var(--accent-calm)">${recentMoments}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">questa settimana</div>
        </div>
        <div style="flex:1;background:var(--bg-card);padding:12px;border-radius:var(--radius-md);text-align:center">
          <div style="font-size:1.5rem;font-weight:700;color:var(--accent-focus)">${totalMoments}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">momenti totali</div>
        </div>
      </div>
    `;
  }
}

function toggleFabMenu() {
  const fabMenu = document.querySelector('.fab-menu');
  const fabButton = document.querySelector('.fab-button');

  if (fabMenu && fabButton) {
    const isOpen = fabMenu.classList.contains('open');
    fabMenu.classList.toggle('open');
    fabButton.textContent = isOpen ? '+' : '×';
    fabButton.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
  }
}

function startFlow(){currentFlow={feeling:null,intensity:3,trigger:null,notes:''};document.getElementById('intensitySection').style.display='none';document.getElementById('feelingContinue').classList.remove('show');renderFeelings();showScreen('feelingScreen');}
function renderFeelings(){document.getElementById('feelingsGrid').innerHTML=feelings.map(f=>'<div class="option-card" data-id="'+f.id+'" onclick="selectFeeling(\''+f.id+'\')"><span class="emoji">'+f.emoji+'</span><span class="label">'+f.label+'</span></div>').join('');}
function selectFeeling(id){currentFlow.feeling=id;document.querySelectorAll('#feelingsGrid .option-card').forEach(c=>c.classList.toggle('selected',c.dataset.id===id));document.getElementById('intensitySection').style.display='block';document.getElementById('feelingContinue').classList.add('show');}
function setIntensity(v){currentFlow.intensity=v;document.getElementById('intensityValue').textContent=v;document.querySelectorAll('.intensity-dot').forEach((d,i)=>d.classList.toggle('selected',i+1===v));}
function goToTrigger(){document.getElementById('triggerContinue').classList.remove('show');renderTriggers();showScreen('triggerScreen');}
function renderTriggers(){let html='';triggerCategories.forEach(cat=>{html+='<div class="trigger-category">';html+='<div class="trigger-category-title">'+cat.category+'</div>';html+='<div class="trigger-category-items">';cat.triggers.forEach(t=>{html+='<div class="trigger-card" data-id="'+t.id+'" onclick="selectTrigger(\''+t.id+'\')"><span class="emoji">'+t.emoji+'</span><span class="label">'+t.label+'</span></div>';});html+='</div></div>';});document.getElementById('triggersList').innerHTML=html;}
function selectTrigger(id){currentFlow.trigger=id;document.querySelectorAll('#triggersList .trigger-card').forEach(c=>c.classList.toggle('selected',c.dataset.id===id));document.getElementById('triggerContinue').classList.add('show');}
function goToTaskOrResponse(){if(isTaskRelatedTrigger(currentFlow.trigger)){renderRecentTasks();showScreen('taskScreen');}else{currentFlow.taskName='';generateResponse();}}
function renderRecentTasks(){const list=document.getElementById('recentTasksList');const recent=getRecentTasks(5);if(recent.length===0){list.innerHTML='';return;}let html='<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">Recenti:</p>';recent.forEach(t=>{const best=getBestStrategyForTask(normalizeTaskName(t.name));const badge=best?'⚡ ('+Math.round(best.rate*100)+'%)':'';html+='<div onclick="selectRecentTask(\''+t.name.replace(/'/g,"\\'")+'\',\''+t.category+'\')" style="display:flex;align-items:center;gap:8px;padding:12px;background:var(--bg-card);border-radius:var(--radius-md);margin-bottom:8px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background=\'var(--bg-elevated)\'" onmouseout="this.style.background=\'var(--bg-card)\'"><div style="flex:1"><div style="font-size:0.95rem">'+t.name+' '+badge+'</div><div style="font-size:0.75rem;color:var(--text-muted)">'+getCategoryEmoji(t.category)+' '+t.category+' · usato '+t.count+' volte</div></div></div>';});list.innerHTML=html;}
function selectRecentTask(name,category){document.getElementById('taskInput').value=name;currentFlow.taskName=name;}
function skipTask(){currentFlow.taskName='';generateResponse();}
function getTopDifficultTasks(limit=5){const tasks=Object.values(state.tasks).filter(t=>t.timesBlocked>=2).sort((a,b)=>{const aRate=a.timesResolved/a.timesBlocked;const bRate=b.timesResolved/b.timesBlocked;if(aRate!==bRate)return aRate-bRate;return b.timesBlocked-a.timesBlocked;});return tasks.slice(0,limit);}
function getTasksWithBestStrategies(limit=5){const tasksWithStrat=Object.values(state.tasks).filter(t=>t.strategies&&Object.keys(t.strategies).length>0&&t.timesBlocked>=2);const results=[];tasksWithStrat.forEach(task=>{const best=getBestStrategyForTask(normalizeTaskName(task.name));if(best&&best.rate>=0.5){results.push({task:task,strategy:best});}});return results.sort((a,b)=>b.strategy.rate-a.strategy.rate).slice(0,limit);}
function generateResponse(){
  const taskInput=document.getElementById('taskInput');
  if(taskInput){currentFlow.taskName=taskInput.value.trim();}
  const notesInput=document.getElementById('notesInput');
  if(notesInput){currentFlow.notes=notesInput.value;}

  const mappedTrigger=mapTriggerForResponse(currentFlow.trigger);
  const key=currentFlow.feeling+'_'+mappedTrigger;
  const r=responses[key]||responses['default'];
  const f=feelings.find(x=>x.id===currentFlow.feeling);

  document.getElementById('responseEmoji').textContent=f.emoji;
  document.getElementById('responseFeelingText').textContent=f.label.toLowerCase();
  document.getElementById('understandingTldr').textContent=r.tldr||'';
  document.getElementById('understandingText').innerHTML=r.understanding;
  document.getElementById('guidedActionsList').innerHTML=r.actions.map(aid=>{
    const a=guidedActions.find(x=>x.id===aid);
    return'<div class="guided-action-card" onclick="showScreen(\''+a.screen+'\')"><div class="guided-action-icon">'+a.icon+'</div><div class="guided-action-info"><div class="guided-action-name">'+a.name+'</div><div class="guided-action-desc">'+a.desc+'</div></div><span class="guided-action-arrow">→</span></div>';
  }).join('');

  // INTELLIGENT SUGGESTIONS - Personal recommendations
  let strategiesHtml='';
  const taskId=currentFlow.taskName?normalizeTaskName(currentFlow.taskName):null;
  const bestStrat=taskId?getBestStrategyForTask(taskId):null;
  const bestForFeeling=getBestStrategyForFeeling(currentFlow.feeling);
  const bestForTrigger=getBestStrategyForTrigger(currentFlow.trigger);

  // Show task-specific recommendation
  if(bestStrat){
    strategiesHtml+='<div style="background:rgba(152,195,121,0.15);border:1px solid rgba(152,195,121,0.3);border-radius:12px;padding:16px;margin-bottom:16px"><div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px">💡 Per "'+currentFlow.taskName+'" funziona:</div><div style="font-weight:600;color:var(--accent-green)">'+bestStrat.name+' ('+Math.round(bestStrat.rate*100)+'% successo)</div></div>';
  }
  // Or show feeling/trigger-based recommendation
  else if(bestForFeeling){
    strategiesHtml+='<div style="background:rgba(126,184,218,0.15);border:1px solid rgba(126,184,218,0.3);border-radius:12px;padding:16px;margin-bottom:16px"><div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px">⭐ Quando ti senti '+f.label.toLowerCase()+', per TE funziona:</div><div style="font-weight:600;color:var(--accent-calm)">'+bestForFeeling.name+' ('+Math.round(bestForFeeling.rate*100)+'% successo)</div></div>';
  }
  else if(bestForTrigger){
    const tr=triggers.find(x=>x.id===currentFlow.trigger);
    strategiesHtml+='<div style="background:rgba(126,184,218,0.15);border:1px solid rgba(126,184,218,0.3);border-radius:12px;padding:16px;margin-bottom:16px"><div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px">⭐ Con questo trigger, per TE funziona:</div><div style="font-weight:600;color:var(--accent-calm)">'+bestForTrigger.name+' ('+Math.round(bestForTrigger.rate*100)+'% successo)</div></div>';
  }

  strategiesHtml+=r.strategies.map((s,i)=>'<div class="strategy-card'+(i===1?' secondary':'')+'" onclick="showStrategyDetail(\''+s.name.replace(/'/g,"\\'")+'\')" style="cursor:pointer"><div class="strategy-name">'+s.name+' →</div><div class="strategy-desc">'+s.desc+'</div></div>').join('');
  document.getElementById('strategiesList').innerHTML=strategiesHtml;

  const taskCategory=currentFlow.taskName?detectTaskCategory(currentFlow.taskName):'';
  const historyId=Date.now();
  state.history.unshift({
    id:historyId,
    date:new Date().toISOString(),
    feeling:currentFlow.feeling,
    trigger:currentFlow.trigger,
    intensity:currentFlow.intensity,
    notes:currentFlow.notes,
    taskName:currentFlow.taskName,
    taskCategory:taskCategory,
    strategyUsed:null,
    strategyCompleted:false
  });

  updatePatterns();
  saveState();

  const saveTaskPrompt=document.getElementById('saveTaskPrompt');
  if(currentFlow.taskName&&isTaskRelatedTrigger(currentFlow.trigger)){
    saveTaskPrompt.style.display='block';
  }else{
    saveTaskPrompt.style.display='none';
  }

  showScreen('responseScreen');
}
function executeStrategy(name){if(state.history.length>0){state.history[0].strategyUsed=name;saveState();}const n=name.toLowerCase();if(n.includes('respira')||n.includes('breath')||n.includes('pausa vuota')){showScreen('breatheScreen');return;}if(n.includes('pomodoro')||n.includes('sprint')||n.includes('timer')||n.includes('nap')||n.includes('buffer')||n.includes('min')||n.includes('cammina')||n.includes('corri')||n.includes('movimento')||n.includes('phone')||n.includes('social')||n.includes('scroll')||n.includes('pausa')||n.includes('break')||n.includes('serie')||n.includes('tv')||n.includes('passiva')||n.includes('stretching')){let mins=2;if(n.includes('serie')||n.includes('tv')||n.includes('passiva'))mins=20;else if(n.includes('30'))mins=30;else if(n.includes('25'))mins=25;else if(n.includes('20'))mins=20;else if(n.includes('10'))mins=10;else if(n.includes('5'))mins=5;else if(n.includes('2'))mins=2;else if(n.includes('cammina')||n.includes('corri')||n.includes('movimento')||n.includes('phone')||n.includes('social')||n.includes('scroll')||n.includes('pausa')||n.includes('break')||n.includes('stretching'))mins=5;startCustomTimer(mins);return;}if(n.includes('dump')||n.includes('scrivi')||n.includes('lista')||n.includes('nota')||n.includes('vittorie')||n.includes('successi')||n.includes('contatore')||n.includes('diario')||n.includes('repair')||n.includes('snapshot')||n.includes('cattura')){let prompt='';if(n.includes('vittorie')||n.includes('successi')||n.includes('fiero'))prompt='3 cose di cui vado fiero oggi:\n1. \n2. \n3. ';else if(n.includes('lista')||n.includes('elimina')||n.includes('dimezza')||n.includes('triage'))prompt='Lista:\n• ';else if(n.includes('3 righe'))prompt='Cosa sento:\nPerché:\nCosa mi serve:';else if(n.includes('worst')||n.includes('scenario'))prompt='Worst case scenario:\n\nCosa succederebbe davvero?\n';else if(n.includes('fatto')||n.includes('interpreta'))prompt='FATTO:\n\nINTERPRETAZIONE:\n';else if(n.includes('paura'))prompt='FATTO:\n\nPAURA:\n';else if(n.includes('contatore')||n.includes('quante'))prompt='Cose che ho fatto BENE:\n1. \n2. \n3. \n4. \n5. ';else if(n.includes('repair')||n.includes('sistemare'))prompt='Cosa posso fare ORA per sistemare:\n\n';else if(n.includes('snapshot')||n.includes('nota')||n.includes('cattura'))prompt='Dove ero:\n\nCosa pensavo:\n\nProssimo passo:\n';else prompt='';showDumpWithPrompt(prompt);return;}if(n.includes('ground')||n.includes('5 cose')||n.includes('ancora al presente')){showScreen('groundingScreen');return;}if(n.includes('check')||n.includes('basics')){showChecklist(name);return;}if(n.includes('doubling')||n.includes('body')){showGuidedTip('Body Doubling','💡 Lavora accanto a qualcuno:\n\n• Chiamata video con un amico\n• Vai in caffè o biblioteca\n• App come Focusmate o StudyStream\n• Anche solo la presenza aiuta\n\nNon serve parlare!');return;}if(n.includes('gamif')||n.includes('sfida')){showGuidedTip('Gamification','🎮 Trasforma in gioco:\n\n• "Quanto veloce riesco?"\n• Metti canzone, finisci prima che finisca\n• Competi con te di ieri\n• Ricompensa alla fine\n\nChe punteggio fai oggi?');return;}if(n.includes('ricompensa')||n.includes('dopo')){showGuidedTip('Ricompensa','🎁 Cosa fai DOPO averlo finito?\n\n• Episodio serie\n• 10 min gioco\n• Snack\n• Pausa fuori\n\nDecidi ORA, prima di iniziare!');return;}if(n.includes('compassione')||n.includes('normaliz')){showGuidedTip('Self-Compassion','💚 Con ADHD è NORMALE:\n\n• Distrarsi spesso\n• Errori frequenti\n• Emozioni intense\n• Bisogno di supporti\n\nNon sei pigro. Sei ADHD.');return;}if(n.includes('zoom')||n.includes('100')){showGuidedQuestion('Zoom Out','Su 100 cose che fai, quante vanno bene?\n\n(Scrivi un numero)');return;}if(n.includes('test del tempo')||n.includes('settimana')){showGuidedQuestion('Test del Tempo','Tra una settimana sarà ancora grave?\n\nTra un mese?\n\nTra un anno?');return;}if(n.includes('script')||n.includes('frasi')){showGuidedTip('Script Sociale','💬 3 frasi pronte:\n\n1. "Ciao! Come va?"\n2. "Che cosa fai?"\n3. "Interessante, dimmi di più"\n\nBasta questo per iniziare!');return;}if(n.includes('exit')||n.includes('andare')){showGuidedTip('Exit Strategy','🚪 Puoi uscire quando vuoi:\n\n• "Resto max 1h"\n• "Ho impegno alle X"\n• "Devo fare chiamata"\n\nDecidilo PRIMA. Calma.');return;}if(n.includes('scale')||n.includes('10x')||n.includes('rsd')){showGuidedQuestion('RSD Scale-Down','La tua reazione è: 10/10\n\nIl fatto oggettivo è: _/10\n\n(Scala da 1 a 10)');return;}if(n.includes('fonte')||n.includes('chi')){showGuidedQuestion('Check Fonte','Chi ha fatto questa critica?\n\nConosce il tuo ADHD?\n\nÈ fonte affidabile?');return;}if(n.includes('priority')||n.includes('priorità')||n.includes('urgente')){showGuidedQuestion('Priority Check','Questa è DAVVERO la cosa più urgente ORA?\n\nSe sì, perché?\n\nSe no, qual è?');return;}if(n.includes('ambiente')||n.includes('stimoli')||n.includes('reset amb')){showGuidedTip('Reset Ambiente','🧹 Togli stimoli non necessari:\n\n• Chiudi tab extra\n• Phone in altra stanza\n• Cuffie noise-cancelling\n• Solo il necessario sul tavolo\n\nAmbiente pulito = mente pulita');return;}if(n.includes('amico')||n.includes('friend')){showGuidedQuestion('Prospettiva Amico','Cosa diresti a un amico ADHD in questa situazione?\n\n(Usa quella compassione per te)');return;}if(n.includes('ripara')){showGuidedQuestion('Ripara e Vai','Puoi rimediare?\n\nSe sì: fallo ORA\nSe no: lascia andare\n\nQuale scegli?');return;}showGuidedTip(name,'💡 '+name+'\n\nStrategia attivata!');}
function startCustomTimer(minutes){timerSeconds=minutes*60;timerTotalSeconds=minutes*60;showScreen('timerScreen');resetTimer();updateTimerDisplay();}
function showDumpWithPrompt(prompt){showScreen('dumpScreen');document.getElementById('dumpTextarea').value=prompt;document.getElementById('dumpTextarea').focus();}
function showChecklist(strategyName){const n=strategyName.toLowerCase();let items=[];let emoji='✓';let subtitle='Controlla questi punti';if(n.includes('check')||n.includes('basics')){items=['Ho mangiato?','Ho bevuto acqua?','Ho dormito abbastanza?','Sto sovrastimolato?','Ho preso le medicine?'];emoji='🏥';subtitle='Check fisico - Basics prima di tutto';}else{items=['Punto 1','Punto 2','Punto 3'];}document.getElementById('checklistEmoji').textContent=emoji;document.getElementById('checklistTitle').textContent=strategyName;document.getElementById('checklistSubtitle').textContent=subtitle;let html='';items.forEach((item,i)=>{html+='<div style="display:flex;align-items:center;gap:12px;padding:16px;background:var(--bg-card);border-radius:var(--radius-md);margin-bottom:12px;cursor:pointer" onclick="toggleCheckItem('+i+')"><input type="checkbox" id="check_'+i+'" style="width:20px;height:20px;cursor:pointer"><label for="check_'+i+'" style="flex:1;font-size:0.95rem;cursor:pointer">'+item+'</label></div>';});document.getElementById('checklistItems').innerHTML=html;showScreen('checklistScreen');}
function toggleCheckItem(i){const cb=document.getElementById('check_'+i);cb.checked=!cb.checked;}
function toggleUnderstandingDetails(){const details=document.getElementById('understandingDetails');const toggleText=document.getElementById('understandingToggleText');const toggleIcon=document.getElementById('understandingToggleIcon');if(details.classList.contains('collapsed')){details.classList.remove('collapsed');details.classList.add('expanded');toggleText.textContent='Nascondi dettagli';toggleIcon.textContent='↑';}else{details.classList.remove('expanded');details.classList.add('collapsed');toggleText.textContent='Scopri di più';toggleIcon.textContent='↓';}}
function completeChecklist(){addGardenPoints(10,'Checklist completata');if(state.history.length>0){const h=state.history[0];h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,h.strategyUsed,true);}showScreen('responseScreen');}
function completeMicroStep(){const input=document.getElementById('microStepInput').value.trim();if(input){state.diary.unshift({id:Date.now(),date:new Date().toISOString(),mood:'microstep',text:'🎯 Micro-step: '+input,type:'microstep'});saveState();}addGardenPoints(5,'Micro-step completato');if(state.history.length>0){const h=state.history[0];h.strategyUsed=h.strategyUsed||'Primo micro-step';h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,h.strategyUsed,true);}document.getElementById('microStepInput').value='';showToast('🎯 Ottimo! Hai fatto il primo passo!');showScreen('responseScreen');}
function completeStrategy(name){addGardenPoints(3,'Strategia: '+name);if(state.history.length>0){const h=state.history[0];h.strategyUsed=name;h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,name,true);}saveState();showToast('✓ '+name+' completata! +3 punti');event.target.textContent='✓ Fatto';event.target.style.background='var(--accent-green)';event.target.style.color='white';event.target.disabled=true;}
let currentStrategyDetail={name:'',desc:''};
function showStrategyDetail(name){const allStrats=Object.values(responses).flatMap(r=>r.strategies);const strat=allStrats.find(s=>s.name===name);if(!strat)return;currentStrategyDetail={name:name,desc:strat.desc};document.getElementById('strategyDetailTitle').textContent=name;document.getElementById('strategyDetailDesc').textContent=strat.desc;const explanation=strategyExplanations[name]||'Questa strategia può aiutarti a gestire la situazione.';document.getElementById('strategyDetailExplanation').textContent=explanation;showScreen('strategyDetailScreen');}
function executeStrategyFromDetail(){const name=currentStrategyDetail.name;executeStrategy(name);}
function completeStrategyFromDetail(){const name=currentStrategyDetail.name;addGardenPoints(3,'Strategia: '+name);if(state.history.length>0){const h=state.history[0];h.strategyUsed=name;h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,name,true);}saveState();showToast('✓ '+name+' completata! +3 punti');showScreen('responseScreen');}
function showGuidedTip(title,content){document.getElementById('tipEmoji').textContent='💡';document.getElementById('tipTitle').textContent=title;document.getElementById('tipContent').textContent=content;showScreen('guidedTipScreen');}
function showGuidedQuestion(title,question){document.getElementById('questionEmoji').textContent='💭';document.getElementById('questionTitle').textContent=title;document.getElementById('questionPrompt').textContent=question;document.getElementById('questionAnswer').value='';showScreen('guidedQuestionScreen');}
function saveGuidedAnswer(){const answer=document.getElementById('questionAnswer').value.trim();if(answer){state.diary.unshift({id:Date.now(),date:new Date().toISOString(),mood:'reflection',text:answer,type:'reflection'});saveState();addGardenPoints(5,'Riflessione salvata');if(state.history.length>0){const h=state.history[0];h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,h.strategyUsed,true);}showScreen('responseScreen');}else{showToast('Scrivi una risposta');}}
function giveFeedback(h){if(state.history.length>0)state.history[0].helpful=h;saveState();document.querySelectorAll('.feedback-btn').forEach(b=>b.classList.remove('selected'));event.target.classList.add('selected');showToast(h?'Grazie! 💚':'Grazie per il feedback');}
function finishAndGoHome(){screenHistory=['homeScreen'];showScreen('homeScreen');}
function startTimer(){document.getElementById('timerStartBtn').style.display='none';timerInterval=setInterval(()=>{timerSeconds--;updateTimerDisplay();if(timerSeconds<=0){clearInterval(timerInterval);timerDone();}},1000);}
function updateTimerDisplay(){const m=Math.floor(timerSeconds/60),s=timerSeconds%60;document.getElementById('timerDisplay').textContent=m+':'+(s<10?'0':'')+s;const offset=565.48*(1-timerSeconds/timerTotalSeconds);document.getElementById('timerProgress').style.strokeDashoffset=offset;}
function timerDone(){document.getElementById('timerControls').style.display='none';document.getElementById('timerDone').classList.add('show');addGardenPoints(10,'Timer completato');if(state.history.length>0){const h=state.history[0];h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,h.strategyUsed,true);}}
function resetTimer(){timerSeconds=timerTotalSeconds;updateTimerDisplay();document.getElementById('timerDone').classList.remove('show');document.getElementById('timerControls').style.display='flex';document.getElementById('timerStartBtn').style.display='block';}
function stopTimer(){clearInterval(timerInterval);resetTimer();}
function startBreathing(){document.getElementById('breatheStartBtn').style.display='none';breatheCycles=5;runBreatheCycle();}
function runBreatheCycle(){if(breatheCycles<=0){breathingDone();return;}const c=document.getElementById('breatheCircle'),i=document.getElementById('breatheInstruction'),n=document.getElementById('breatheCounter');c.classList.add('inhale');c.classList.remove('exhale');i.textContent='Inspira...';n.textContent=breatheCycles+' cicli';setTimeout(()=>{c.classList.remove('inhale');c.classList.add('exhale');i.textContent='Espira...';setTimeout(()=>{breatheCycles--;runBreatheCycle();},4000);},4000);}
function breathingDone(){document.getElementById('breatheInstruction').textContent='Fatto! 🙏';document.getElementById('breatheCounter').textContent='Come ti senti?';document.getElementById('breatheStartBtn').style.display='block';document.getElementById('breatheStartBtn').textContent='Ripeti';addGardenPoints(5,'Respirazione completata');if(state.history.length>0){const h=state.history[0];h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,h.strategyUsed,true);}}
function stopBreathing(){breatheCycles=0;document.getElementById('breatheCircle').classList.remove('inhale','exhale');document.getElementById('breatheInstruction').textContent='Pronto?';document.getElementById('breatheCounter').textContent='5 cicli';document.getElementById('breatheStartBtn').style.display='block';document.getElementById('breatheStartBtn').textContent='Inizia';}
function saveDump(){const t=document.getElementById('dumpTextarea').value;if(t.trim()){state.diary.unshift({id:Date.now(),date:new Date().toISOString(),mood:'dump',text:t,type:'dump'});saveState();addGardenPoints(5,'Pensieri salvati');if(state.history.length>0){const h=state.history[0];h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,h.strategyUsed,true);}}else{showScreen('responseScreen');}document.getElementById('dumpTextarea').value='';showScreen('responseScreen');}
function initGrounding(){currentGroundStep=0;renderGroundingSteps();}
function renderGroundingSteps(){document.getElementById('groundingSteps').innerHTML=groundingSteps.map((s,i)=>'<div class="ground-step'+(i===currentGroundStep?' active':'')+(i<currentGroundStep?' done':'')+'"><div class="ground-step-num">'+(i<currentGroundStep?'✓':s.num)+'</div><div class="ground-step-content"><div class="ground-step-title">'+s.sense+'</div><div class="ground-step-desc">'+s.desc+'</div><div class="ground-step-input"><div class="ground-input-row">'+s.placeholders.map(p=>'<input type="text" class="ground-input-item" placeholder="'+p+'">').join('')+'</div><button class="ground-next-btn" onclick="nextGroundStep()">Avanti →</button></div></div></div>').join('');}
function nextGroundStep(){currentGroundStep++;if(currentGroundStep>=groundingSteps.length){addGardenPoints(5,'Grounding completato');if(state.history.length>0){const h=state.history[0];h.strategyCompleted=true;if(h.taskName)updateTaskDatabase(h.taskName,h.taskCategory,h.feeling,h.trigger,h.intensity,h.strategyUsed,true);}setTimeout(()=>showScreen('responseScreen'),1500);return;}renderGroundingSteps();}
function renderDiaryMoods(){document.getElementById('diaryMoodGrid').innerHTML=diaryMoods.map(m=>'<button class="diary-mood-btn" data-id="'+m.id+'" onclick="selectDiaryMood(\''+m.id+'\')"><span class="emoji">'+m.emoji+'</span><span class="label">'+m.label+'</span></button>').join('');}
function selectDiaryMood(id){diaryMood=id;document.querySelectorAll('.diary-mood-btn').forEach(b=>b.classList.toggle('selected',b.dataset.id===id));}
function addPrompt(t){const i=document.getElementById('diaryTextInput');i.value=t+' '+i.value;i.focus();}
function saveDiaryEntry(){const t=document.getElementById('diaryTextInput').value.trim();if(!t){showToast('Scrivi qualcosa');return;}state.diary.unshift({id:Date.now(),date:new Date().toISOString(),mood:diaryMood||'okay',text:t,type:'entry'});saveState();document.getElementById('diaryTextInput').value='';diaryMood=null;document.querySelectorAll('.diary-mood-btn').forEach(b=>b.classList.remove('selected'));addGardenPoints(5,'Nota salvata');showScreen('diaryScreen');}
function renderDiaryEntries(){const c=document.getElementById('diaryEntries');const e=state.diary.filter(x=>x.type==='entry'||x.type==='dump'||x.type==='microstep');if(e.length===0){c.innerHTML='<div class="empty-state"><div class="emoji">📝</div><h3>Nessuna nota</h3><p>Inizia a scrivere</p></div>';return;}c.innerHTML=e.slice(0,20).map(x=>{const m=diaryMoods.find(d=>d.id===x.mood)||{emoji:'💭'};const d=new Date(x.date);return'<div class="diary-entry"><div class="history-card-actions"><button class="edit-btn" onclick="event.stopPropagation();editDiaryEntryById('+x.id+')">✏️</button><button class="delete-btn" onclick="event.stopPropagation();deleteDiaryEntryById('+x.id+')">🗑️</button></div><div class="diary-entry-header" onclick="openDiaryEntry('+x.id+')" style="cursor:pointer"><span class="diary-entry-emoji">'+m.emoji+'</span><div class="diary-entry-meta"><div class="diary-entry-date">'+formatDate(d)+'</div><div class="diary-entry-time">'+d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+'</div></div></div><p class="diary-entry-text" onclick="openDiaryEntry('+x.id+')" style="cursor:pointer">'+x.text+'</p></div>';}).join('');}
function openDiaryEntry(id){currentDiaryEntry=state.diary.find(x=>x.id===id);if(!currentDiaryEntry)return;const m=diaryMoods.find(x=>x.id===currentDiaryEntry.mood)||{emoji:'💭'};const d=new Date(currentDiaryEntry.date);document.getElementById('diaryDetailHeader').innerHTML='<div class="diary-detail-emoji">'+m.emoji+'</div><div class="diary-detail-date">'+formatDate(d)+'</div><div class="diary-detail-time">'+d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+'</div>';document.getElementById('diaryDetailText').textContent=currentDiaryEntry.text;showScreen('diaryDetailScreen');}
function deleteDiaryEntry(){if(!currentDiaryEntry)return;if(confirm('Eliminare?')){state.diary=state.diary.filter(x=>x.id!==currentDiaryEntry.id);saveState();showToast('Eliminata');showScreen('diaryScreen');}}
function deleteDiaryEntryById(id){if(!confirm('Vuoi davvero eliminare questa nota?\n\nQuesta azione non può essere annullata.'))return;state.diary=state.diary.filter(x=>x.id!==id);saveState();renderDiaryEntries();showToast('🗑️ Nota eliminata');}
function editDiaryEntryById(id){const entry=state.diary.find(x=>x.id===id);if(!entry)return;const newText=prompt('Modifica il testo:',entry.text);if(newText===null)return;if(!newText.trim()){showToast('Il testo non può essere vuoto');return;}entry.text=newText;saveState();renderDiaryEntries();showToast('✏️ Modificata');}
function updatePatterns(){const e=state.history[0];if(!e)return;if(!state.patterns.feelings)state.patterns.feelings={};if(!state.patterns.triggers)state.patterns.triggers={};if(!state.patterns.times)state.patterns.times={};state.patterns.feelings[e.feeling]=(state.patterns.feelings[e.feeling]||0)+1;state.patterns.triggers[e.trigger]=(state.patterns.triggers[e.trigger]||0)+1;const h=new Date(e.date).getHours();const t=h<12?'mattina':h<18?'pomeriggio':'sera';state.patterns.times[t]=(state.patterns.times[t]||0)+1;}
function renderInsights(){
  const c=document.getElementById('insightsContent');
  let h='<button class="generate-report-btn" onclick="showScreen(\'reportScreen\')"><span>📖</span><span>Condividi il tuo percorso</span></button>';

  if(state.history.length<3){
    c.innerHTML=h+'<div class="empty-state"><div class="emoji">📊</div><h3>Non ho abbastanza dati</h3><p>Usa l\'app qualche volta</p></div>';
    return;
  }

  // PERSONAL INSIGHTS - New adaptive section
  const personalInsights=getPersonalInsights();
  if(personalInsights){
    h+='<div class="diary-entries-title" style="margin-top:16px">🧠 I tuoi insights personali</div>';

    // Recent success rate
    if(personalInsights.recentSuccess){
      const perc=Math.round(personalInsights.recentSuccess.rate*100);
      const emoji=perc>=70?'🎉':perc>=50?'💪':'📈';
      h+='<div class="insight-card" style="background:rgba(152,195,121,0.08);border:1px solid rgba(152,195,121,0.2)"><div class="insight-card-header"><span class="insight-card-emoji">'+emoji+'</span><span class="insight-card-title">Questa settimana</span></div><p class="insight-card-content">Hai superato il blocco <span class="insight-highlight" style="color:var(--accent-green)">'+personalInsights.recentSuccess.completed+'/'+personalInsights.recentSuccess.total+' volte</span> ('+perc+'%). '+(perc>=70?'Stai andando alla grande!':perc>=50?'Continua così!':'Ogni tentativo è apprendimento.')+'</p></div>';
    }

    // Best strategies for YOU
    if(personalInsights.topStrategies&&personalInsights.topStrategies.length>0){
      h+='<div class="insight-card"><div class="insight-card-header"><span class="insight-card-emoji">⭐</span><span class="insight-card-title">Le TUE strategie migliori</span></div><div class="insight-card-content">';
      personalInsights.topStrategies.forEach((s,i)=>{
        const perc=Math.round(s.rate*100);
        h+='<div style="margin-bottom:'+(i<personalInsights.topStrategies.length-1?'10px':'0')+'"><div style="font-weight:600;color:var(--accent-green)">'+s.name+'</div><div style="font-size:0.85rem;color:var(--text-muted)">Funziona per te nel '+perc+'% dei casi (usata '+s.used+' volte)</div></div>';
      });
      h+='</div></div>';
    }

    // Best strategy for most common feeling
    if(personalInsights.feelingStrategy&&personalInsights.feelingStrategy.bestStrategy){
      const f=feelings.find(x=>x.id===personalInsights.feelingStrategy.feeling);
      if(f){
        const perc=Math.round(personalInsights.feelingStrategy.bestStrategy.rate*100);
        h+='<div class="insight-card"><div class="insight-card-header"><span class="insight-card-emoji">'+f.emoji+'</span><span class="insight-card-title">Quando ti senti '+f.label+'</span></div><p class="insight-card-content">Per te funziona meglio: <span class="insight-highlight" style="color:var(--accent-calm)">'+personalInsights.feelingStrategy.bestStrategy.name+'</span> ('+perc+'% successo)</p></div>';
      }
    }

    // Temporal patterns
    if(personalInsights.temporalPatterns&&personalInsights.temporalPatterns.dayOfWeek){
      const day=personalInsights.temporalPatterns.dayOfWeek;
      h+='<div class="insight-card"><div class="insight-card-header"><span class="insight-card-emoji">📅</span><span class="insight-card-title">I tuoi pattern</span></div><p class="insight-card-content">Tendi a bloccarti più spesso <span class="insight-highlight">di '+day.name.toLowerCase()+'</span> ('+day.count+' volte). Previeni con strategie in quel giorno.</p></div>';
    }

    h+='<div class="diary-entries-title" style="margin-top:24px">📊 Pattern generali</div>';
  }

  // Existing insights
  if(state.patterns.feelings && Object.keys(state.patterns.feelings).length > 0){
    const t=Object.entries(state.patterns.feelings).sort((a,b)=>b[1]-a[1])[0];
    if(t){
      const f=feelings.find(x=>x.id===t[0]);
      if(f){
        h+='<div class="insight-card"><div class="insight-card-header"><span class="insight-card-emoji">'+f.emoji+'</span><span class="insight-card-title">Emozione più frequente</span></div><p class="insight-card-content">Ti senti <span class="insight-highlight">'+f.label.toLowerCase()+'</span> più spesso ('+t[1]+' volte).</p></div>';
      }
    }
  }

  if(state.patterns.triggers && Object.keys(state.patterns.triggers).length > 0){
    const t=Object.entries(state.patterns.triggers).sort((a,b)=>b[1]-a[1])[0];
    if(t){
      const tr=triggers.find(x=>x.id===t[0]);
      if(tr){
        h+='<div class="insight-card"><div class="insight-card-header"><span class="insight-card-emoji">'+tr.emoji+'</span><span class="insight-card-title">Trigger più comune</span></div><p class="insight-card-content">"<span class="insight-highlight">'+tr.label+'</span>" ti mette in difficoltà più spesso.</p></div>';
      }
    }
  }

  const difficultTasks=getTopDifficultTasks(3);
  if(difficultTasks.length>0){
    h+='<div class="insight-card"><div class="insight-card-header"><span class="insight-card-emoji">📋</span><span class="insight-card-title">Task più difficili</span></div><div class="insight-card-content">';
    difficultTasks.forEach(task=>{
      const rate=task.timesResolved>0?Math.round((task.timesResolved/task.timesBlocked)*100):0;
      const best=getBestStrategyForTask(normalizeTaskName(task.name));
      h+='<div style="margin-bottom:12px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span>'+getCategoryEmoji(task.category)+'</span><span style="font-weight:600">'+task.name+'</span></div><div style="font-size:0.85rem;color:var(--text-muted)">Blocca spesso ('+task.timesBlocked+' volte) · Risolto '+rate+'%</div>';
      if(best){
        h+='<div style="font-size:0.85rem;color:var(--accent-green);margin-top:4px">→ '+best.name+' funziona ('+Math.round(best.rate*100)+'%)</div>';
      }
      h+='</div>';
    });
    h+='</div></div>';
  }

  if(state.diary.length>0){
    h+='<div class="insight-card"><div class="insight-card-header"><span class="insight-card-emoji">📝</span><span class="insight-card-title">Il tuo diario</span></div><p class="insight-card-content">Hai scritto <span class="insight-highlight">'+state.diary.length+' note</span>.</p></div>';
  }

  c.innerHTML=h||'<div class="empty-state"><div class="emoji">🔍</div><h3>Pochi dati</h3></div>';
}
function setHistoryPeriod(period){historyPeriodFilter=period;document.querySelectorAll('[data-period]').forEach(b=>b.classList.toggle('selected',b.dataset.period===period));renderHistory();}
function setHistoryFeeling(feelingId){historyFeelingFilter=historyFeelingFilter===feelingId?null:feelingId;renderHistory();}
function initHistoryFilters(){const container=document.getElementById('historyFeelingFilters');if(!container)return;let h='<button class="filter-chip'+(historyFeelingFilter===null?' selected':'')+'" data-feeling="all" onclick="setHistoryFeeling(null)">Tutte</button>';feelings.forEach(f=>{h+='<button class="filter-chip'+(historyFeelingFilter===f.id?' selected':'')+'" data-feeling="'+f.id+'" onclick="setHistoryFeeling(\''+f.id+'\')">'+f.emoji+' '+f.label+'</button>';});container.innerHTML=h;}
function filterHistory(){let filtered=[...state.history];if(historyPeriodFilter!=='all'){const now=new Date();const cutoff=new Date();if(historyPeriodFilter==='today')cutoff.setHours(0,0,0,0);else if(historyPeriodFilter==='week')cutoff.setDate(now.getDate()-7);else if(historyPeriodFilter==='month')cutoff.setMonth(now.getMonth()-1);filtered=filtered.filter(e=>new Date(e.date)>=cutoff);}if(historyFeelingFilter){filtered=filtered.filter(e=>e.feeling===historyFeelingFilter);}return filtered;}
function renderHistory(){
  initHistoryFilters();
  const filtered=filterHistory();
  const c=document.getElementById('historyContent');
  const counter=document.getElementById('historyCount');

  if(state.history.length===0){
    c.innerHTML='<div class="empty-state"><div class="emoji">📋</div><h3>Nessun momento</h3></div>';
    counter.textContent='I tuoi momenti';
    return;
  }

  counter.textContent=filtered.length+(filtered.length===1?' momento':' momenti')+(filtered.length<state.history.length?' (filtrati)':'');

  if(filtered.length===0){
    c.innerHTML='<div class="empty-state"><div class="emoji">🔍</div><h3>Nessun risultato</h3><p>Prova altri filtri</p></div>';
    return;
  }

  const cards=filtered.slice(0,50).map(e=>{
    if(!e||!e.id)return '';
    const f=feelings.find(x=>x.id===e.feeling)||{emoji:'😶',label:'Sconosciuto'};
    const tr=triggers.find(x=>x.id===e.trigger)||{label:'Sconosciuto',emoji:'📋'};
    const d=e.date?new Date(e.date):new Date();
    let h='<div class="history-card">';
    h+='<div class="history-card-actions"><button class="edit-btn" onclick="editHistoryItem('+e.id+')">✏️</button><button class="delete-btn" onclick="deleteHistoryItem('+e.id+')">🗑️</button></div>';
    h+='<div class="history-card-header">';
    h+='<div class="history-card-emoji">'+f.emoji+'</div>';
    h+='<div class="history-card-main">';
    h+='<div class="history-card-feeling">'+f.label+'</div>';
    h+='<div class="history-card-meta">';
    h+='<span>'+formatDate(d)+'</span>';
    h+='<span>•</span>';
    h+='<span>'+d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+'</span>';
    h+='</div>';
    h+='</div>';
    h+='<div class="diary-entry-intensity" style="margin-top:4px">'+ [1,2,3,4,5].map(i=>'<div class="diary-intensity-dot'+(i<=(e.intensity||0)?' filled':'')+'"></div>').join('')+'</div>';
    h+='</div>';
    h+='<div class="history-card-trigger">'+(tr.emoji||'📋')+' '+tr.label+'</div>';
    if(e.taskName){
      const emoji=getCategoryEmoji(e.taskCategory||'altro');
      h+='<div class="history-card-task">'+emoji+' <strong>'+e.taskName+'</strong></div>';
    }
    if(e.strategyUsed){
      const completed=e.strategyCompleted;
      h+='<div class="history-card-strategy'+(completed?'':' incomplete')+'"><span>'+(completed?'✓':'○')+'</span><span>'+e.strategyUsed+'</span></div>';
    }
    if(e.notes){
      h+='<div style="margin-top:8px;padding:8px;background:rgba(160,160,184,0.1);border-radius:6px;font-size:0.85rem;color:var(--text-secondary)">'+e.notes+'</div>';
    }
    h+='</div>';
    return h;
  }).filter(Boolean).join('');

  c.innerHTML='<div style="padding:0 20px">'+cards+'</div>';
}
function formatDate(d){const n=new Date(),diff=n-d,days=Math.floor(diff/(1000*60*60*24));if(days===0){const h=Math.floor(diff/(1000*60*60));return h===0?'Ora':h+' ore fa';}if(days===1)return'Ieri';if(days<7)return days+' giorni fa';return d.toLocaleDateString('it-IT',{day:'numeric',month:'short'});}
function deleteHistoryItem(id){if(!confirm('Vuoi davvero eliminare questo momento?\n\nQuesta azione non può essere annullata.'))return;state.history=state.history.filter(e=>e.id!==id);saveState();renderHistory();showToast('🗑️ Momento eliminato');}
function editHistoryItem(id){const item=state.history.find(e=>e.id===id);if(!item)return;if(item.taskName){const newTaskName=prompt('Modifica il nome dell\'attività:',item.taskName);if(newTaskName===null)return;if(newTaskName.trim())item.taskName=newTaskName.trim();}const newNotes=prompt('Modifica le note:',item.notes||'');if(newNotes===null)return;item.notes=newNotes;saveState();renderHistory();showToast('✏️ Modificato');}
function renderLearn(){
  const c=document.getElementById('learnContent');
  if(!c)return;

  let h='<div class="diary-entries-title">Concetti chiave</div>';
  learnTopics.forEach(t=>{
    h+='<div class="insight-card"><div class="insight-card-header"><span class="insight-card-emoji">'+t.emoji+'</span><span class="insight-card-title">'+t.title+'</span></div><p class="insight-card-content">'+t.content+'</p></div>';
  });

  h+='<div class="diary-entries-title" style="margin-top:24px">Strategie per contesto</div>';

  const contexts=[
    {key:'lavoro',icon:'💼',label:'LAVORO'},
    {key:'studio',icon:'📚',label:'STUDIO'},
    {key:'casa',icon:'🏠',label:'CASA'},
    {key:'sociale',icon:'👥',label:'SOCIALE'},
    {key:'cura',icon:'💚',label:'CURA PERSONALE'},
    {key:'admin',icon:'📋',label:'BUROCRAZIA'}
  ];

  contexts.forEach((ctx,index)=>{
    if(contextStrategies[ctx.key]){
      h+='<div class="understanding-card" style="margin-top:'+(index===0?'0':'12')+'px"><div class="understanding-title">'+ctx.icon+' '+ctx.label+'</div>';
      contextStrategies[ctx.key].forEach(s=>{
        h+='<div class="strategy-card" style="margin-top:10px"><div class="strategy-name">'+s.name+'</div><div class="strategy-desc">'+s.desc+'</div></div>';
      });
      h+='</div>';
    }
  });

  c.innerHTML=h;
}
function selectReportPeriod(days){reportPeriodDays=days;document.querySelectorAll('.report-period-btn').forEach(b=>b.classList.remove('selected'));event.target.classList.add('selected');}
function generatePDFReport(){
const{jsPDF}=window.jspdf;
const doc=new jsPDF();
const includePatterns=document.getElementById('reportIncludePatterns').checked;
const includeHistory=document.getElementById('reportIncludeHistory').checked;
const includeDiary=document.getElementById('reportIncludeDiary').checked;
const includeStrategies=document.getElementById('reportIncludeStrategies').checked;

const today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
const periodText=reportPeriodDays===0?'dall\'inizio':reportPeriodDays===7?'nell\'ultima settimana':'nell\'ultimo mese';

const filteredHistory=filterDataByPeriod(state.history, reportPeriodDays);
const filteredDiary=filterDataByPeriod(state.diary, reportPeriodDays);

// Helper functions for visual elements
function drawStatBox(x,y,w,h,value,label,color){
  doc.setFillColor(color[0],color[1],color[2]);
  doc.setDrawColor(color[0],color[1],color[2]);
  doc.setLineWidth(1);
  doc.roundedRect(x,y,w,h,2,2,'FD');
  doc.setTextColor(255,255,255);
  doc.setFontSize(20);
  doc.setFont(undefined,'bold');
  doc.text(value.toString(),x+w/2,y+h/2-1,{align:'center'});
  doc.setFontSize(8);
  doc.setFont(undefined,'normal');
  doc.text(label,x+w/2,y+h/2+5,{align:'center',maxWidth:w-4});
  doc.setTextColor(0);
}

function drawProgressBar(x,y,w,percent,color){
  doc.setFillColor(230,230,230);
  doc.roundedRect(x,y,w,5,2,2,'F');
  if(percent>0){
    doc.setFillColor(color[0],color[1],color[2]);
    doc.roundedRect(x,y,w*(percent/100),5,2,2,'F');
  }
}

function drawBarChart(x,y,w,h,data,maxValue){
  const barWidth=(w/data.length)-3;
  data.forEach((item,i)=>{
    const barHeight=Math.max((item.value/maxValue)*h,2);
    doc.setFillColor(item.color[0],item.color[1],item.color[2]);
    doc.roundedRect(x+(i*(barWidth+3)),y+h-barHeight,barWidth,barHeight,1,1,'F');
    doc.setFontSize(7);
    doc.setTextColor(80);
    const labelLines=doc.splitTextToSize(item.label,barWidth);
    doc.text(labelLines[0]||'',x+(i*(barWidth+3))+barWidth/2,y+h+4,{align:'center'});
    doc.setTextColor(0);
  });
}

function drawCard(x,y,w,h,title,content,color){
  doc.setFillColor(color[0],color[1],color[2]);
  doc.setDrawColor(color[0]-20,color[1]-20,color[2]-20);
  doc.setLineWidth(0.5);
  doc.roundedRect(x,y,w,h,2,2,'FD');
  doc.setTextColor(255,255,255);
  doc.setFontSize(9);
  doc.setFont(undefined,'bold');
  doc.text(title,x+3,y+5);
  doc.setFontSize(8);
  doc.setFont(undefined,'normal');
  const lines=doc.splitTextToSize(content,w-6);
  lines.slice(0,2).forEach((line,i)=>{
    doc.text(line,x+3,y+11+(i*4));
  });
  doc.setTextColor(0);
}

// COVER PAGE with gradient effect
doc.setFillColor(103,126,234);
doc.rect(0,0,210,65,'F');
doc.setFillColor(118,142,218);
doc.rect(0,40,210,25,'F');

doc.setTextColor(255,255,255);
doc.setFontSize(32);
doc.setFont(undefined,'bold');
doc.text('IL MIO PERCORSO',105,28,{align:'center'});
doc.setFontSize(36);
doc.text('ADHD',105,43,{align:'center'});
doc.setFontSize(11);
doc.setFont(undefined,'normal');
doc.text(today+' • '+periodText,105,55,{align:'center'});
doc.setTextColor(0);

let y=75;

// STATS BOXES
if(filteredHistory.length>0){
  const streak=calculateStreak();
  const totalMoments=filteredHistory.length;
  const successRate=filteredHistory.filter(e=>e.strategyCompleted).length;
  const successPercent=totalMoments>0?Math.round((successRate/totalMoments)*100):0;

  drawStatBox(15,y,38,22,totalMoments,totalMoments===1?'momento':'momenti',[103,126,234]);
  drawStatBox(56,y,38,22,successPercent+'%','successo',[125,211,168]);
  drawStatBox(97,y,38,22,streak,streak===1?'giorno':'giorni',[232,168,124]);

  const avgIntensity=(filteredHistory.reduce((sum,e)=>sum+e.intensity,0)/filteredHistory.length).toFixed(1);
  drawStatBox(138,y,38,22,avgIntensity+'/5','intensità media',[195,174,214]);

  y+=30;
}

// PATTERNS SECTION
if(includePatterns&&filteredHistory.length>0){
  doc.setFillColor(240,245,250);
  doc.roundedRect(15,y,180,8,1,1,'F');
  doc.setFontSize(12);
  doc.setFont(undefined,'bold');
  doc.text('COME MI SONO SENTITO',18,y+5.5);
  doc.setFont(undefined,'normal');
  y+=12;

  const feelingCounts={};
  const triggerCounts={};
  filteredHistory.forEach(e=>{
    feelingCounts[e.feeling]=(feelingCounts[e.feeling]||0)+1;
    triggerCounts[e.trigger]=(triggerCounts[e.trigger]||0)+1;
  });

  // Feelings bar chart
  const feelingData=Object.entries(feelingCounts)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5)
    .map(([id,count])=>{
      const f=feelings.find(x=>x.id===id)||{label:'?'};
      return{
        label:f.label,
        value:count,
        color:[103,126,234]
      };
    });

  if(feelingData.length>0){
    const maxFeeling=Math.max(...feelingData.map(d=>d.value));
    drawBarChart(20,y,80,30,feelingData,maxFeeling);
    y+=40;
  }

  // Top feeling text
  const topFeeling=Object.entries(feelingCounts).sort((a,b)=>b[1]-a[1])[0];
  if(topFeeling){
    const f=feelings.find(x=>x.id===topFeeling[0]);
    if(f){
      doc.setFontSize(9);
      doc.setTextColor(80);
      const text='Più spesso: '+f.label.toLowerCase()+' ('+topFeeling[1]+(topFeeling[1]===1?' volta':' volte')+')';
      doc.text(text,20,y);
      y+=8;
      doc.setTextColor(0);
    }
  }

  // TRIGGERS SECTION
  doc.setFillColor(240,245,250);
  doc.roundedRect(15,y,180,8,1,1,'F');
  doc.setFontSize(12);
  doc.setFont(undefined,'bold');
  doc.text('TRIGGER PRINCIPALI',18,y+5.5);
  doc.setFont(undefined,'normal');
  y+=12;

  const triggerData=Object.entries(triggerCounts)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5)
    .map(([id,count])=>{
      const tr=triggers.find(x=>x.id===id)||{label:'?'};
      return{
        label:tr.label.length>15?tr.label.substring(0,13)+'..':tr.label,
        value:count,
        color:[232,168,124]
      };
    });

  if(triggerData.length>0){
    const maxTrigger=Math.max(...triggerData.map(d=>d.value));
    drawBarChart(20,y,80,30,triggerData,maxTrigger);
    y+=40;
  }

  // Top trigger text
  const topTrigger=Object.entries(triggerCounts).sort((a,b)=>b[1]-a[1])[0];
  if(topTrigger){
    const tr=triggers.find(x=>x.id===topTrigger[0]);
    if(tr){
      doc.setFontSize(9);
      doc.setTextColor(80);
      const text='Più frequente: '+tr.label+' ('+topTrigger[1]+(topTrigger[1]===1?' volta':' volte')+')';
      doc.text(text,20,y);
      y+=8;
      doc.setTextColor(0);
    }
  }
}

// TIMELINE VISUAL
if(includeHistory&&filteredHistory.length>0){
  if(y>240){
    doc.addPage();
    y=20;
  }

  doc.setFillColor(240,245,250);
  doc.roundedRect(15,y,180,8,1,1,'F');
  doc.setFontSize(12);
  doc.setFont(undefined,'bold');
  doc.text('TIMELINE DEI MOMENTI',18,y+5.5);
  doc.setFont(undefined,'normal');
  y+=12;

  doc.setFontSize(8);
  const recentMoments=filteredHistory.slice(0,8);
  recentMoments.forEach((e,i)=>{
    if(y>270){
      doc.addPage();
      y=20;
    }
    const f=feelings.find(x=>x.id===e.feeling)||{label:'?',emoji:'•'};
    const d=new Date(e.date);
    const dateStr=d.toLocaleDateString('it-IT',{day:'numeric',month:'short'});
    const timeStr=d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});

    // Timeline dot
    doc.setFillColor(103,126,234);
    doc.circle(20,y,1,'F');
    if(i<recentMoments.length-1){
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(20,y+1,20,y+6);
    }

    doc.setFont(undefined,'bold');
    doc.setTextColor(0);
    doc.text(dateStr+' '+timeStr,25,y+1);
    doc.setFont(undefined,'normal');
    doc.setTextColor(100);
    doc.text(f.label,50,y+1);
    doc.setTextColor(0);

    y+=7;
  });
  y+=5;
}

// WEEK HEATMAP
if(includePatterns&&filteredHistory.length>=3){
  if(y>230){
    doc.addPage();
    y=20;
  }

  doc.setFillColor(240,245,250);
  doc.roundedRect(15,y,180,8,1,1,'F');
  doc.setFontSize(12);
  doc.setFont(undefined,'bold');
  doc.text('MAPPA SETTIMANALE',18,y+5.5);
  doc.setFont(undefined,'normal');
  y+=12;

  const dayNames=['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
  const dayCounts=[0,0,0,0,0,0,0];
  filteredHistory.forEach(e=>{
    const day=new Date(e.date).getDay();
    dayCounts[day]++;
  });

  const maxDay=Math.max(...dayCounts);
  const cellSize=10;

  dayNames.forEach((name,i)=>{
    const intensity=maxDay>0?dayCounts[i]/maxDay:0;
    const x=20+(i*20);

    // Draw cell with intensity
    if(intensity>0.7){
      doc.setFillColor(103,126,234);
    }else if(intensity>0.4){
      doc.setFillColor(150,170,220);
    }else if(intensity>0){
      doc.setFillColor(200,210,235);
    }else{
      doc.setFillColor(240,240,240);
    }
    doc.roundedRect(x,y,cellSize,cellSize,1,1,'F');

    // Day label
    doc.setFontSize(7);
    doc.setTextColor(80);
    doc.text(name,x+cellSize/2,y+cellSize+4,{align:'center'});

    // Count
    if(dayCounts[i]>0){
      doc.setFontSize(7);
      doc.setTextColor(intensity>0.7?255:0);
      doc.text(dayCounts[i].toString(),x+cellSize/2,y+cellSize/2+1,{align:'center'});
    }
    doc.setTextColor(0);
  });

  y+=20;
}

// NEW PAGE for strategies and insights
doc.addPage();
y=20;

// DIFFICULT TASKS cards
const difficultTasks=getTopDifficultTasks(3);
if(difficultTasks.length>0){
  doc.setFillColor(240,245,250);
  doc.roundedRect(15,y,180,8,1,1,'F');
  doc.setFontSize(12);
  doc.setFont(undefined,'bold');
  doc.text('SFIDE PRINCIPALI',18,y+5.5);
  doc.setFont(undefined,'normal');
  y+=14;

  difficultTasks.forEach(task=>{
    if(y>260){
      doc.addPage();
      y=20;
    }
    const rate=task.timesResolved>0?Math.round((task.timesResolved/task.timesBlocked)*100):0;
    const title=task.name.length>25?task.name.substring(0,23)+'..':task.name;
    const content='Bloccato '+task.timesBlocked+(task.timesBlocked===1?' volta':' volte')+' • Risolto '+rate+'%';

    drawCard(20,y,85,18,title,content,[224,122,122]);

    const best=getBestStrategyForTask(normalizeTaskName(task.name));
    if(best){
      doc.setFontSize(7);
      doc.setTextColor(80,150,100);
      const stratText='✓ '+best.name+' funziona '+Math.round(best.rate*100)+'%';
      doc.text(stratText,22,y+14);
      doc.setTextColor(0);
    }

    y+=20;
  });
}

// WORKING STRATEGIES cards
const tasksWithStrat=getTasksWithBestStrategies(3);
if(tasksWithStrat.length>0){
  if(y>220){
    doc.addPage();
    y=20;
  }

  doc.setFillColor(240,245,250);
  doc.roundedRect(15,y,180,8,1,1,'F');
  doc.setFontSize(12);
  doc.setFont(undefined,'bold');
  doc.text('✨  COSA FUNZIONA PER ME',18,y+5.5);
  doc.setFont(undefined,'normal');
  y+=14;

  tasksWithStrat.forEach(item=>{
    if(y>260){
      doc.addPage();
      y=20;
    }
    const title=item.task.name.length>25?item.task.name.substring(0,23)+'..':item.task.name;
    const content=item.strategy.name+' • '+Math.round(item.strategy.rate*100)+'% successo';

    drawCard(20,y,85,15,title,content,[125,211,168]);
    y+=17;
  });
}

// DIARY ENTRIES
if(includeDiary&&filteredDiary.length>0){
  if(y>210){
    doc.addPage();
    y=20;
  }

  doc.setFillColor(240,245,250);
  doc.roundedRect(15,y,180,8,1,1,'F');
  doc.setFontSize(12);
  doc.setFont(undefined,'bold');
  doc.text('📝  LE MIE RIFLESSIONI',18,y+5.5);
  doc.setFont(undefined,'normal');
  y+=14;

  doc.setFontSize(8);
  filteredDiary.slice(0,5).forEach(entry=>{
    if(y>250){
      doc.addPage();
      y=20;
    }
    const d=new Date(entry.date);
    const dateStr=d.toLocaleDateString('it-IT',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});

    doc.setFont(undefined,'bold');
    doc.setTextColor(103,126,234);
    doc.text(dateStr,20,y);
    doc.setFont(undefined,'normal');
    doc.setTextColor(80);
    y+=5;

    const lines=doc.splitTextToSize(entry.text,170);
    lines.slice(0,3).forEach(line=>{
      if(y>270){
        doc.addPage();
        y=20;
      }
      doc.text(line,20,y);
      y+=4;
    });
    y+=3;
  });
  doc.setTextColor(0);
}

// STRATEGIES TO TRY
if(includeStrategies){
  if(y>200){
    doc.addPage();
    y=20;
  }

  doc.setFillColor(240,245,250);
  doc.roundedRect(15,y,180,8,1,1,'F');
  doc.setFontSize(12);
  doc.setFont(undefined,'bold');
  doc.text('STRATEGIE DA PROVARE',18,y+5.5);
  doc.setFont(undefined,'normal');
  y+=14;

  const contexts=[
    {key:'lavoro',label:'Al lavoro',strategies:contextStrategies.lavoro.slice(0,2)},
    {key:'studio',label:'Nello studio',strategies:contextStrategies.studio.slice(0,2)},
    {key:'casa',label:'A casa',strategies:contextStrategies.casa.slice(0,2)}
  ];

  contexts.forEach(ctx=>{
    if(y>250){
      doc.addPage();
      y=20;
    }
    doc.setFontSize(10);
    doc.setFont(undefined,'bold');
    doc.text(ctx.label,20,y);
    doc.setFont(undefined,'normal');
    y+=6;

    doc.setFontSize(8);
    ctx.strategies.forEach(s=>{
      if(y>270){
        doc.addPage();
        y=20;
      }
      doc.setTextColor(0);
      doc.text('• '+s.name,22,y);
      doc.setTextColor(100);
      const descLines=doc.splitTextToSize(s.desc,160);
      doc.text(descLines[0]||'',28,y+4);
      doc.setTextColor(0);
      y+=9;
    });
    y+=3;
  });
}

// FINAL PAGE
doc.addPage();
y=40;

doc.setFillColor(195,174,214);
doc.rect(0,0,210,60,'F');

doc.setTextColor(255,255,255);
doc.setFontSize(18);
doc.setFont(undefined,'bold');
doc.text('RIFLESSIONE FINALE',105,25,{align:'center'});
doc.setTextColor(0);

y=75;
doc.setFontSize(10);
doc.setTextColor(60);
const conclusion=doc.splitTextToSize('Questo documento racconta il mio viaggio. Non è perfetto, e non deve esserlo. Ogni momento di difficoltà che ho affrontato, ogni strategia che ho provato, ogni nota che ho scritto - tutto questo fa parte della mia crescita.\n\nConvivere con l\'ADHD è una sfida quotidiana, ma sto imparando a conoscermi meglio. Sto costruendo la mia cassetta degli attrezzi. Sto diventando più consapevole.\n\nQuesto non è un fallimento. È il mio percorso.',170);

conclusion.forEach(line=>{
  if(y>270){
    doc.addPage();
    y=20;
  }
  doc.text(line,20,y);
  y+=5;
});

doc.setTextColor(0);

// Save
const filename='il-mio-percorso-adhd-'+today.replace(/\s/g,'-').replace(/,/g,'')+'.pdf';
doc.save(filename);
showScreen('insightsScreen');
showToast('📊 Report infografico creato!');
}

// Active Tasks Management Functions

// Show/Hide Modal
function showAddTaskModal(){
  currentEditingTaskId=null;
  document.getElementById('taskModalTitle').textContent='Nuovo compito';
  document.getElementById('taskNameInput').value='';
  document.getElementById('taskCategoryInput').value='';
  document.getElementById('taskDeadlineInput').value='';
  document.getElementById('taskNotesInput').value='';
  document.getElementById('taskRecurringInput').checked=false;
  document.getElementById('taskDeadlineInput').disabled=false;
  document.getElementById('recurringSection').style.display='none';
  document.getElementById('taskRecurringPatternInput').value='weekly';
  ['daySun','dayMon','dayTue','dayWed','dayThu','dayFri','daySat'].forEach(id=>{
    const checkbox=document.getElementById(id);
    if(checkbox)checkbox.checked=false;
  });
  document.getElementById('taskModal').style.display='flex';
}

function showEditTaskModal(id){
  const task=state.activeTasks.find(t=>t.id===id);
  if(!task)return;
  currentEditingTaskId=id;
  document.getElementById('taskModalTitle').textContent='Modifica compito';
  document.getElementById('taskNameInput').value=task.name;
  document.getElementById('taskCategoryInput').value=task.category||'';
  document.getElementById('taskDeadlineInput').value=task.deadline||'';
  document.getElementById('taskNotesInput').value=task.notes||'';

  if(task.isRecurring){
    document.getElementById('taskRecurringInput').checked=true;
    document.getElementById('taskDeadlineInput').disabled=true;
    document.getElementById('recurringSection').style.display='block';
    document.getElementById('taskRecurringPatternInput').value=task.recurringPattern.type;

    ['daySun','dayMon','dayTue','dayWed','dayThu','dayFri','daySat'].forEach((id,index)=>{
      const checkbox=document.getElementById(id);
      if(checkbox){
        checkbox.checked=task.recurringPattern.days&&task.recurringPattern.days.includes(index);
      }
    });
    updateRecurringDaysVisibility();
    updateNextOccurrencePreview();
  }else{
    document.getElementById('taskRecurringInput').checked=false;
    document.getElementById('recurringSection').style.display='none';
  }

  document.getElementById('taskModal').style.display='flex';
}

function closeTaskModal(){
  document.getElementById('taskModal').style.display='none';
  currentEditingTaskId=null;
}

// Save Task
function saveTask(){
  const name=document.getElementById('taskNameInput').value.trim();
  const category=document.getElementById('taskCategoryInput').value;
  const deadline=document.getElementById('taskDeadlineInput').value;
  const notes=document.getElementById('taskNotesInput').value.trim();
  const isRecurring=document.getElementById('taskRecurringInput').checked;

  if(!name){
    showToast('❌ Inserisci un nome per il compito');
    return;
  }

  let recurringData=null;
  if(isRecurring){
    const pattern=document.getElementById('taskRecurringPatternInput').value;
    const selectedDays=getSelectedDays();

    if((pattern==='weekly'||pattern==='biweekly')&&selectedDays.length===0){
      showToast('❌ Seleziona almeno un giorno della settimana');
      return;
    }

    const nextOccurrence=calculateNextOccurrence(pattern,selectedDays);
    if(!nextOccurrence){
      showToast('❌ Errore nel calcolo della prossima occorrenza');
      return;
    }

    recurringData={
      isRecurring:true,
      recurringPattern:{type:pattern,days:selectedDays},
      nextOccurrence:nextOccurrence.toISOString(),
      completionHistory:[]
    };
  }

  const now=new Date().toISOString();

  if(currentEditingTaskId){
    const task=state.activeTasks.find(t=>t.id===currentEditingTaskId);
    if(task){
      task.name=name;
      task.category=category;
      task.notes=notes;
      task.lastUpdatedAt=now;

      if(isRecurring){
        task.isRecurring=recurringData.isRecurring;
        task.recurringPattern=recurringData.recurringPattern;
        task.nextOccurrence=recurringData.nextOccurrence;
        task.deadline=null;
        if(!task.completionHistory)task.completionHistory=[];
      }else{
        task.isRecurring=false;
        task.recurringPattern=null;
        task.nextOccurrence=null;
        task.completionHistory=null;
        task.deadline=deadline||null;
      }

      saveState();
      renderActiveTasks();
      closeTaskModal();
      showToast('✏️ Compito aggiornato');
    }
  }else{
    const newTask={
      id:Date.now(),
      name:name,
      category:category,
      notes:notes,
      status:'active',
      createdAt:now,
      lastUpdatedAt:now,
      relatedHistoryIds:[],
      isRecurring:isRecurring,
      recurringPattern:isRecurring?recurringData.recurringPattern:null,
      nextOccurrence:isRecurring?recurringData.nextOccurrence:null,
      deadline:isRecurring?null:(deadline||null),
      completionHistory:isRecurring?[]:null
    };
    state.activeTasks.push(newTask);
    saveState();
    renderActiveTasks();
    closeTaskModal();
    showToast('✓ Compito aggiunto');
    checkAndScheduleNotifications();
  }
}

// Filters
function setTaskStatusFilter(status){
  taskStatusFilter=status;
  document.querySelectorAll('[data-status]').forEach(b=>b.classList.toggle('selected',b.dataset.status===status));
  renderActiveTasks();
}

function filterActiveTasks(){
  if(taskStatusFilter==='all')return state.activeTasks;
  return state.activeTasks.filter(t=>t.status===taskStatusFilter);
}

// Date helpers
function getDaysUntilDeadline(deadline){
  if(!deadline)return null;
  const now=new Date();
  const deadlineDate=new Date(deadline);
  deadlineDate.setHours(23,59,59,999);
  const diff=deadlineDate-now;
  return Math.ceil(diff/(1000*60*60*24));
}

function getDaysSinceUpdate(lastUpdatedAt){
  const now=new Date();
  const lastUpdate=new Date(lastUpdatedAt);
  const diff=now-lastUpdate;
  return Math.floor(diff/(1000*60*60*24));
}

// Render
function renderActiveTasks(){
  const filtered=filterActiveTasks().sort((a,b)=>{
    if(a.status!==b.status){
      const order={'active':0,'paused':1,'completed':2};
      return order[a.status]-order[b.status];
    }
    const aDate=a.isRecurring?a.nextOccurrence:a.deadline;
    const bDate=b.isRecurring?b.nextOccurrence:b.deadline;
    if(aDate&&bDate)return new Date(aDate)-new Date(bDate);
    if(aDate)return -1;
    if(bDate)return 1;
    return new Date(b.createdAt)-new Date(a.createdAt);
  });

  const c=document.getElementById('activeTasksContent');
  const counter=document.getElementById('activeTasksCount');
  const activeCount=state.activeTasks.filter(t=>t.status==='active').length;
  counter.textContent=activeCount+(activeCount===1?' attività attiva':' attività attive');

  if(state.activeTasks.length===0){
    c.innerHTML='<div class="task-empty-state"><div class="task-empty-state-emoji">✓</div><div class="task-empty-state-text">Nessun compito</div><div class="task-empty-state-hint">Aggiungi il tuo primo compito per iniziare</div></div>';
    return;
  }

  if(filtered.length===0){
    c.innerHTML='<div class="task-empty-state"><div class="task-empty-state-emoji">🔍</div><div class="task-empty-state-text">Nessun risultato</div><div class="task-empty-state-hint">Prova un altro filtro</div></div>';
    return;
  }

  let h='<div style="padding:0 20px">';
  filtered.forEach(task=>{
    const effectiveDeadline=task.isRecurring?task.nextOccurrence:task.deadline;
    const daysUntil=getDaysUntilDeadline(effectiveDeadline);
    const daysSince=getDaysSinceUpdate(task.lastUpdatedAt);
    let cardClass='task-card';
    let deadlineClass='';
    let deadlineText='';

    if(task.status==='completed')cardClass+=' completed';
    else if(task.status==='paused')cardClass+=' paused';
    else if(daysUntil!==null){
      const prefix=task.isRecurring?'🔄 Prossima':'';
      if(daysUntil<0){
        cardClass+=' overdue';
        deadlineClass='urgent';
        deadlineText=(task.isRecurring?prefix+': ':'')+'⚠️ '+(task.isRecurring?'Mancata':' Scaduto')+' '+Math.abs(daysUntil)+' giorni fa';
      }else if(daysUntil===0){
        cardClass+=' near-deadline';
        deadlineClass='urgent';
        deadlineText=(task.isRecurring?prefix+': ':'')+'⏰ '+formatRecurringDate(new Date(effectiveDeadline));
      }else if(daysUntil===1){
        cardClass+=' near-deadline';
        deadlineClass='soon';
        deadlineText=(task.isRecurring?prefix+': ':'')+'⏰ Domani';
      }else if(daysUntil<=state.notificationSettings.deadlineWarningDays){
        cardClass+=' near-deadline';
        deadlineClass='soon';
        deadlineText=(task.isRecurring?prefix+': ':'')+'⏰ '+daysUntil+' giorni';
      }else{
        deadlineText=(task.isRecurring?prefix+': ':'')+'📅 '+formatRecurringDate(new Date(effectiveDeadline));
      }
    }

    h+='<div class="'+cardClass+'">';
    h+='<div class="task-card-header">';
    h+='<input type="checkbox" class="task-card-checkbox" '+(task.status==='completed'?'checked':'')+' onclick="toggleTaskComplete('+task.id+')">';
    h+='<div class="task-card-main">';
    h+='<div class="task-card-name">';
    if(task.isRecurring){
      h+='🔄 ';
    }
    h+=task.name+'</div>';
    h+='<div class="task-card-meta">';
    if(task.category){
      const emoji=getCategoryEmoji(task.category);
      h+='<span class="task-card-category">'+emoji+' '+task.category+'</span>';
    }
    if(deadlineText){
      h+='<span class="task-card-deadline '+deadlineClass+'">'+deadlineText+'</span>';
    }
    if(daysSince>=state.notificationSettings.taskStuckDays&&task.status==='active'&&!task.isRecurring){
      h+='<span style="color:var(--accent-warm)">💭 Fermo da '+daysSince+' giorni</span>';
    }
    h+='</div>';
    h+='</div>';
    h+='</div>';
    if(task.isRecurring&&task.completionHistory&&task.completionHistory.length>0){
      const last30Days=task.completionHistory.filter(c=>{
        const diff=new Date()-new Date(c.date);
        return diff<=(30*24*60*60*1000);
      });
      h+='<div style="margin-top:8px;padding:8px;background:rgba(152,195,121,0.1);border-radius:6px;font-size:0.85rem;color:var(--accent-green);cursor:pointer" onclick="toggleCompletionHistory('+task.id+')">';
      h+='<span>✓ Completato '+last30Days.length+(last30Days.length===1?' volta':' volte')+' negli ultimi 30 giorni</span>';
      h+=' <span style="font-size:0.7rem;color:var(--text-muted)">▼</span>';
      h+='</div>';
      h+='<div id="completion-history-'+task.id+'" style="display:none;margin-top:8px;padding:8px;background:rgba(160,160,184,0.05);border-radius:6px;font-size:0.85rem">';
      const sortedHistory=[...task.completionHistory].sort((a,b)=>new Date(b.date)-new Date(a.date));
      sortedHistory.forEach((c,index)=>{
        const d=new Date(c.date);
        const dateStr=d.toLocaleDateString('it-IT',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
        const borderStyle=index>0?'border-top:1px solid rgba(160,160,184,0.1);':'';
        h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;'+borderStyle+'">';
        h+='<span style="color:var(--text-secondary)">'+dateStr+'</span>';
        h+='<button class="delete-btn" onclick="event.stopPropagation();deleteCompletion('+task.id+','+index+')" style="font-size:0.8rem;padding:4px 8px" title="Elimina questo completamento">🗑️</button>';
        h+='</div>';
      });
      h+='</div>';
    }
    if(task.notes){
      h+='<div class="task-card-notes">'+task.notes+'</div>';
    }
    h+='<div class="task-card-actions">';
    if(task.status==='active'){
      h+='<button class="task-card-action-btn" onclick="pauseTask('+task.id+')" title="Metti in pausa">⏸️</button>';
    }else if(task.status==='paused'){
      h+='<button class="task-card-action-btn" onclick="resumeTask('+task.id+')" title="Riprendi">▶️</button>';
    }
    h+='<button class="task-card-action-btn" onclick="showEditTaskModal('+task.id+')" title="Modifica">✏️</button>';
    h+='<button class="task-card-action-btn" onclick="deleteTask('+task.id+')" title="Elimina">🗑️</button>';
    h+='</div>';
    h+='</div>';
  });
  h+='</div>';
  c.innerHTML=h;
}

// Task actions
function toggleTaskComplete(id){
  const task=state.activeTasks.find(t=>t.id===id);
  if(!task)return;

  if(task.isRecurring&&task.status!=='completed'){
    const now=new Date().toISOString();
    if(!task.completionHistory)task.completionHistory=[];
    task.completionHistory.push({date:now,completed:true});
    task.lastUpdatedAt=now;

    const nextOccurrence=calculateNextOccurrence(
      task.recurringPattern.type,
      task.recurringPattern.days,
      new Date(task.nextOccurrence)
    );

    if(nextOccurrence){
      task.nextOccurrence=nextOccurrence.toISOString();
      addGardenPoints(10,'Compito completato');
      showToast('✓ Completato! +10 punti • Prossima: '+formatRecurringDate(nextOccurrence));
    }else{
      showToast('⚠️ Errore nel calcolare la prossima occorrenza');
    }
  }else if(task.status==='completed'){
    task.status='active';
    task.lastUpdatedAt=new Date().toISOString();
    showToast('▶️ Compito riattivato');
  }else{
    task.status='completed';
    task.lastUpdatedAt=new Date().toISOString();
    addGardenPoints(10,'Compito completato');
    showToast('✓ Compito completato! +10 punti');
  }

  saveState();
  renderActiveTasks();
  checkAndScheduleNotifications();
}

function pauseTask(id){
  const task=state.activeTasks.find(t=>t.id===id);
  if(!task)return;
  task.status='paused';
  task.lastUpdatedAt=new Date().toISOString();
  saveState();
  renderActiveTasks();
  showToast('⏸️ Compito in pausa');
}

function resumeTask(id){
  const task=state.activeTasks.find(t=>t.id===id);
  if(!task)return;
  task.status='active';
  task.lastUpdatedAt=new Date().toISOString();
  saveState();
  renderActiveTasks();
  showToast('▶️ Compito ripreso');
  checkAndScheduleNotifications();
}

function deleteTask(id){
  if(!confirm('Vuoi davvero eliminare questo compito?\n\nQuesta azione non può essere annullata.'))return;
  state.activeTasks=state.activeTasks.filter(t=>t.id!==id);
  saveState();
  renderActiveTasks();
  showToast('🗑️ Compito eliminato');
}

function toggleCompletionHistory(taskId){
  const historyDiv=document.getElementById('completion-history-'+taskId);
  if(!historyDiv)return;
  if(historyDiv.style.display==='none'){
    historyDiv.style.display='block';
  }else{
    historyDiv.style.display='none';
  }
}

function deleteCompletion(taskId,completionIndex){
  const task=state.activeTasks.find(t=>t.id===taskId);
  if(!task||!task.completionHistory)return;

  const sortedHistory=[...task.completionHistory].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const completion=sortedHistory[completionIndex];
  if(!completion)return;

  const dateStr=new Date(completion.date).toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});
  if(!confirm('Eliminare questo completamento?\n\n'+dateStr))return;

  task.completionHistory=task.completionHistory.filter(c=>c.date!==completion.date);
  task.lastUpdatedAt=new Date().toISOString();

  saveState();
  renderActiveTasks();
  showToast('🗑️ Completamento eliminato');
}

// Notifications
function requestNotificationPermission(){
  if(!('Notification' in window)){
    showToast('❌ Notifiche non supportate');
    return;
  }
  if(Notification.permission==='granted'){
    state.notificationSettings.enabled=true;
    saveState();
    showToast('✓ Notifiche già attive');
    checkAndScheduleNotifications();
    return;
  }
  if(Notification.permission!=='denied'){
    Notification.requestPermission().then(permission=>{
      if(permission==='granted'){
        state.notificationSettings.enabled=true;
        saveState();
        showToast('✓ Notifiche attivate');
        checkAndScheduleNotifications();
      }else{
        showToast('❌ Notifiche rifiutate');
      }
    });
  }
}

function checkAndScheduleNotifications(){
  if(!state.notificationSettings.enabled||!('Notification' in window)||Notification.permission!=='granted')return;

  state.activeTasks.filter(t=>t.status==='active').forEach(task=>{
    const effectiveDeadline=task.isRecurring?task.nextOccurrence:task.deadline;
    const daysUntil=getDaysUntilDeadline(effectiveDeadline);

    if(!task.isRecurring){
      const daysSince=getDaysSinceUpdate(task.lastUpdatedAt);
      if(daysSince>=state.notificationSettings.taskStuckDays){
        scheduleNotification(task.id,'stuck',{
          title:'💭 '+task.name,
          body:'Questo compito è fermo da '+daysSince+' giorni. Va bene se non sei pronto, ma volevo ricordartelo.',
          tag:'task-stuck-'+task.id
        });
      }
    }

    if(daysUntil!==null&&daysUntil<=state.notificationSettings.deadlineWarningDays&&daysUntil>=0){
      let body='';
      if(task.isRecurring){
        if(daysUntil===0)body='🔄 Programmato per oggi. Quando sei pronto!';
        else if(daysUntil===1)body='🔄 Programmato per domani.';
        else body='🔄 Prossima occorrenza tra '+daysUntil+' giorni.';
      }else{
        if(daysUntil===0)body='La scadenza è oggi. Respira, puoi farcela.';
        else if(daysUntil===1)body='La scadenza è domani. Un passo alla volta.';
        else body='La scadenza è tra '+daysUntil+' giorni.';
      }

      scheduleNotification(task.id,'deadline',{
        title:'⏰ '+task.name,
        body:body,
        tag:'task-deadline-'+task.id
      });
    }
  });
}

function scheduleNotification(taskId,type,options){
  if(!state.notificationSettings.enabled||!('Notification' in window)||Notification.permission!=='granted')return;

  const notifKey='notif-'+taskId+'-'+type;
  const lastShown=localStorage.getItem(notifKey);
  const now=Date.now();

  if(lastShown&&now-parseInt(lastShown)<86400000)return;

  new Notification(options.title,{
    body:options.body,
    tag:options.tag,
    icon:'/icon-192.png',
    badge:'/icon-192.png',
    requireInteraction:false
  });

  localStorage.setItem(notifKey,now.toString());
}

function saveCurrentTaskToList(){
  if(!currentFlow.taskName)return;

  const taskName=currentFlow.taskName.trim();
  const taskCategory=currentFlow.taskCategory||'altro';

  const exists=state.activeTasks.find(t=>
    t.name.toLowerCase()===taskName.toLowerCase()&&t.status==='active'
  );

  if(exists){
    showToast('⚠️ Questo compito esiste già nella lista');
    return;
  }

  const now=new Date().toISOString();
  const newTask={
    id:Date.now(),
    name:taskName,
    category:taskCategory,
    notes:'',
    status:'active',
    createdAt:now,
    lastUpdatedAt:now,
    relatedHistoryIds:[],
    isRecurring:false,
    recurringPattern:null,
    nextOccurrence:null,
    deadline:null,
    completionHistory:null
  };

  state.activeTasks.push(newTask);

  if(state.history.length>0){
    const historyId=state.history[0].id;
    newTask.relatedHistoryIds.push(historyId);
  }

  saveState();
  document.getElementById('saveTaskPrompt').style.display='none';
  showToast('✓ Compito salvato nella lista');
  checkAndScheduleNotifications();
}

function linkTaskToHistory(taskId,historyId){
  const task=state.activeTasks.find(t=>t.id===taskId);
  if(!task)return;
  if(!task.relatedHistoryIds.includes(historyId)){
    task.relatedHistoryIds.push(historyId);
    task.lastUpdatedAt=new Date().toISOString();
    saveState();
  }
}

// Recurring Tasks Functions
function toggleRecurringSection(){
  const checkbox=document.getElementById('taskRecurringInput');
  const section=document.getElementById('recurringSection');
  const deadlineInput=document.getElementById('taskDeadlineInput');
  if(checkbox.checked){
    section.style.display='block';
    deadlineInput.disabled=true;
    deadlineInput.value='';
    updateRecurringDaysVisibility();
    updateNextOccurrencePreview();
  }else{
    section.style.display='none';
    deadlineInput.disabled=false;
  }
}

function updateRecurringDaysVisibility(){
  const pattern=document.getElementById('taskRecurringPatternInput').value;
  const daysGroup=document.getElementById('recurringDaysGroup');
  if(pattern==='daily'||pattern==='monthly'){
    daysGroup.style.display='none';
  }else{
    daysGroup.style.display='block';
  }
  updateNextOccurrencePreview();
}

function getSelectedDays(){
  const days=[];
  ['daySun','dayMon','dayTue','dayWed','dayThu','dayFri','daySat'].forEach((id,index)=>{
    const checkbox=document.getElementById(id);
    if(checkbox&&checkbox.checked){
      days.push(index);
    }
  });
  return days.sort((a,b)=>a-b);
}

function calculateNextOccurrence(pattern,selectedDays,fromDate=new Date()){
  const now=new Date(fromDate);
  now.setHours(23,59,59,999);

  if(pattern==='daily'){
    now.setDate(now.getDate()+1);
    return now;
  }

  if(pattern==='monthly'){
    const next=new Date(now);
    next.setMonth(next.getMonth()+1);
    return next;
  }

  if(pattern==='weekly'||pattern==='biweekly'){
    if(!selectedDays||selectedDays.length===0)return null;

    const currentDay=now.getDay();
    let daysToAdd=null;

    for(let day of selectedDays){
      let diff=day-currentDay;
      if(diff<=0)diff+=7;
      if(daysToAdd===null||diff<daysToAdd){
        daysToAdd=diff;
      }
    }

    if(daysToAdd!==null){
      now.setDate(now.getDate()+daysToAdd);
      if(pattern==='biweekly'&&daysToAdd===7){
        now.setDate(now.getDate()+7);
      }
      return now;
    }
  }

  return null;
}

function updateNextOccurrencePreview(){
  const pattern=document.getElementById('taskRecurringPatternInput').value;
  const selectedDays=getSelectedDays();
  const next=calculateNextOccurrence(pattern,selectedDays);
  const preview=document.getElementById('nextOccurrencePreview');

  if(next){
    const dayNames=['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
    const dayName=dayNames[next.getDay()];
    const dateStr=next.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
    preview.innerHTML='📅 Prossima occorrenza: <strong>'+dayName+' '+dateStr+'</strong>';
    preview.style.display='block';
  }else{
    if(pattern==='weekly'||pattern==='biweekly'){
      preview.innerHTML='⚠️ Seleziona almeno un giorno della settimana';
      preview.style.display='block';
    }else{
      preview.style.display='none';
    }
  }
}

function formatRecurringDate(date){
  const dayNames=['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
  const d=new Date(date);
  const dayName=dayNames[d.getDay()];
  const day=d.getDate();
  const month=d.getMonth()+1;
  return dayName+' '+day+'/'+month;
}



// Expose all onclick-referenced functions to global scope
window.acceptTerms = acceptTerms;
window.declineTerms = declineTerms;
window.updateAcceptButton = updateAcceptButton;
window.startFlow = startFlow;
window.showScreen = showScreen;
window.goBack = goBack;
window.selectFeeling = selectFeeling;
window.setIntensity = setIntensity;
window.goToTrigger = goToTrigger;
window.selectTrigger = selectTrigger;
window.goToTaskOrResponse = goToTaskOrResponse;
window.skipTask = skipTask;
window.generateResponse = generateResponse;
window.finishAndGoHome = finishAndGoHome;
window.toggleUnderstandingDetails = toggleUnderstandingDetails;
window.giveFeedback = giveFeedback;
window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.resetTimer = resetTimer;
window.startBreathing = startBreathing;
window.stopBreathing = stopBreathing;
window.saveDump = saveDump;
window.completeMicroStep = completeMicroStep;
window.showStrategyDetail = showStrategyDetail;
window.executeStrategyFromDetail = executeStrategyFromDetail;
window.completeStrategyFromDetail = completeStrategyFromDetail;
window.saveCurrentTaskToList = saveCurrentTaskToList;
window.showScreen = showScreen;
window.toggleFabMenu = toggleFabMenu;
window.showGardenPauseModal = showGardenPauseModal;
window.saveDiaryEntry = saveDiaryEntry;
window.selectDiaryMood = selectDiaryMood;
window.addPrompt = addPrompt;
window.openDiaryEntry = openDiaryEntry;
window.deleteDiaryEntry = deleteDiaryEntry;
window.setHistoryPeriod = setHistoryPeriod;
window.setHistoryFeeling = setHistoryFeeling;
window.editHistoryItem = editHistoryItem;
window.deleteHistoryItem = deleteHistoryItem;
window.selectReportPeriod = selectReportPeriod;
window.toggleCheckbox = toggleCheckbox;
window.generatePDFReport = generatePDFReport;
window.showAddTaskModal = showAddTaskModal;
window.closeTaskModal = closeTaskModal;
window.saveTask = saveTask;
window.setTaskStatusFilter = setTaskStatusFilter;
window.showEditTaskModal = showEditTaskModal;
window.deleteTask = deleteTask;
window.toggleTaskComplete = toggleTaskComplete;
window.pauseTask = pauseTask;
window.resumeTask = resumeTask;
window.toggleCompletionHistory = toggleCompletionHistory;
window.toggleRecurringSection = toggleRecurringSection;
window.updateRecurringDaysVisibility = updateRecurringDaysVisibility;
window.updateNextOccurrencePreview = updateNextOccurrencePreview;
window.selectRecentTask = selectRecentTask;
window.saveUserName = saveUserName;
window.requestNotificationPermission = requestNotificationPermission;
window.exportData = exportData;
window.importData = importData;
window.clearAllData = clearAllData;
window.nextGroundStep = nextGroundStep;
window.completeChecklist = completeChecklist;
window.saveGuidedAnswer = saveGuidedAnswer;
window.toggleCheckItem = toggleCheckItem;
