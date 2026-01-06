// Helper utility functions

function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}
function toggleCheckbox(id){const checkbox=document.getElementById(id);checkbox.checked=!checkbox.checked;checkbox.parentElement.classList.toggle('checked',checkbox.checked);}
function selectReportPeriod(days){reportPeriodDays=days;document.querySelectorAll('.report-period-btn').forEach(b=>b.classList.remove('selected'));event.target.classList.add('selected');}
function filterDataByPeriod(data){if(reportPeriodDays===0)return data;const cutoff=new Date();cutoff.setDate(cutoff.getDate()-reportPeriodDays);return data.filter(item=>new Date(item.date)>=cutoff);}
function generatePDFReport(){
const{jsPDF}=window.jspdf;
const doc=new jsPDF();
const includePatterns=document.getElementById('reportIncludePatterns').checked;
const includeHistory=document.getElementById('reportIncludeHistory').checked;
const includeDiary=document.getElementById('reportIncludeDiary').checked;
const includeStrategies=document.getElementById('reportIncludeStrategies').checked;

const today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
const periodText=reportPeriodDays===0?'dall\'inizio':reportPeriodDays===7?'nell\'ultima settimana':'nell\'ultimo mese';

const filteredHistory=filterDataByPeriod(state.history);
const filteredDiary=filterDataByPeriod(state.diary);

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

function toggleCheckbox(id){const checkbox=document.getElementById(id);checkbox.checked=!checkbox.checked;checkbox.parentElement.classList.toggle('checked',checkbox.checked);}
function selectReportPeriod(days){reportPeriodDays=days;document.querySelectorAll('.report-period-btn').forEach(b=>b.classList.remove('selected'));event.target.classList.add('selected');}
function filterDataByPeriod(data){if(reportPeriodDays===0)return data;const cutoff=new Date();cutoff.setDate(cutoff.getDate()-reportPeriodDays);return data.filter(item=>new Date(item.date)>=cutoff);}
function generatePDFReport(){
const{jsPDF}=window.jspdf;
const doc=new jsPDF();
const includePatterns=document.getElementById('reportIncludePatterns').checked;
const includeHistory=document.getElementById('reportIncludeHistory').checked;
const includeDiary=document.getElementById('reportIncludeDiary').checked;
const includeStrategies=document.getElementById('reportIncludeStrategies').checked;

const today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
const periodText=reportPeriodDays===0?'dall\'inizio':reportPeriodDays===7?'nell\'ultima settimana':'nell\'ultimo mese';

const filteredHistory=filterDataByPeriod(state.history);
const filteredDiary=filterDataByPeriod(state.diary);

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

function filterDataByPeriod(data){if(reportPeriodDays===0)return data;const cutoff=new Date();cutoff.setDate(cutoff.getDate()-reportPeriodDays);return data.filter(item=>new Date(item.date)>=cutoff);}
function generatePDFReport(){
const{jsPDF}=window.jspdf;
const doc=new jsPDF();
const includePatterns=document.getElementById('reportIncludePatterns').checked;
const includeHistory=document.getElementById('reportIncludeHistory').checked;
const includeDiary=document.getElementById('reportIncludeDiary').checked;
const includeStrategies=document.getElementById('reportIncludeStrategies').checked;

const today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
const periodText=reportPeriodDays===0?'dall\'inizio':reportPeriodDays===7?'nell\'ultima settimana':'nell\'ultimo mese';

const filteredHistory=filterDataByPeriod(state.history);
const filteredDiary=filterDataByPeriod(state.diary);

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

function detectTaskCategory(taskName){const t=taskName.toLowerCase();for(const[cat,keywords]of Object.entries(taskCategories)){if(keywords.some(k=>t.includes(k)))return cat;}return 'altro';}
function normalizeTaskName(name){return name.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');}
function updateTaskDatabase(taskName,category,feeling,trigger,intensity,strategyUsed,completed){if(!taskName)return;const taskId=normalizeTaskName(taskName);if(!state.tasks[taskId]){state.tasks[taskId]={name:taskName,category:category,firstSeen:new Date().toISOString(),lastMentioned:new Date().toISOString(),timesBlocked:0,timesResolved:0,feelings:{},triggers:{},strategies:{},avgIntensity:0,totalIntensity:0,count:0};}const task=state.tasks[taskId];task.lastMentioned=new Date().toISOString();task.count++;task.totalIntensity+=intensity;task.avgIntensity=(task.totalIntensity/task.count).toFixed(1);task.timesBlocked++;if(completed)task.timesResolved++;task.feelings[feeling]=(task.feelings[feeling]||0)+1;task.triggers[trigger]=(task.triggers[trigger]||0)+1;if(strategyUsed){if(!task.strategies[strategyUsed])task.strategies[strategyUsed]={used:0,completed:0};task.strategies[strategyUsed].used++;if(completed)task.strategies[strategyUsed].completed++;}saveState();}
function getBestStrategyForTask(taskId){const task=state.tasks[taskId];if(!task||!task.strategies)return null;let best=null;let bestRate=0;for(const[stratName,stats]of Object.entries(task.strategies)){if(stats.used<2)continue;const rate=stats.completed/stats.used;if(rate>bestRate){bestRate=rate;best={name:stratName,rate:rate,used:stats.used};}}return best;}

// Personal Insights & Adaptive Learning Functions
function getPersonalStrategyStats(){
  const stats={};
  state.history.forEach(h=>{
    if(h.strategyUsed){
      if(!stats[h.strategyUsed])stats[h.strategyUsed]={used:0,completed:0};
      stats[h.strategyUsed].used++;
      if(h.strategyCompleted)stats[h.strategyUsed].completed++;
    }
  });
  return Object.entries(stats)
    .filter(([,s])=>s.used>=2)
    .map(([name,s])=>({name,used:s.used,completed:s.completed,rate:s.completed/s.used}))
    .sort((a,b)=>b.rate-a.rate||b.used-a.used);
}

function normalizeTaskName(name){return name.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');}
function updateTaskDatabase(taskName,category,feeling,trigger,intensity,strategyUsed,completed){if(!taskName)return;const taskId=normalizeTaskName(taskName);if(!state.tasks[taskId]){state.tasks[taskId]={name:taskName,category:category,firstSeen:new Date().toISOString(),lastMentioned:new Date().toISOString(),timesBlocked:0,timesResolved:0,feelings:{},triggers:{},strategies:{},avgIntensity:0,totalIntensity:0,count:0};}const task=state.tasks[taskId];task.lastMentioned=new Date().toISOString();task.count++;task.totalIntensity+=intensity;task.avgIntensity=(task.totalIntensity/task.count).toFixed(1);task.timesBlocked++;if(completed)task.timesResolved++;task.feelings[feeling]=(task.feelings[feeling]||0)+1;task.triggers[trigger]=(task.triggers[trigger]||0)+1;if(strategyUsed){if(!task.strategies[strategyUsed])task.strategies[strategyUsed]={used:0,completed:0};task.strategies[strategyUsed].used++;if(completed)task.strategies[strategyUsed].completed++;}saveState();}
function getBestStrategyForTask(taskId){const task=state.tasks[taskId];if(!task||!task.strategies)return null;let best=null;let bestRate=0;for(const[stratName,stats]of Object.entries(task.strategies)){if(stats.used<2)continue;const rate=stats.completed/stats.used;if(rate>bestRate){bestRate=rate;best={name:stratName,rate:rate,used:stats.used};}}return best;}

// Personal Insights & Adaptive Learning Functions
function getPersonalStrategyStats(){
  const stats={};
  state.history.forEach(h=>{
    if(h.strategyUsed){
      if(!stats[h.strategyUsed])stats[h.strategyUsed]={used:0,completed:0};
      stats[h.strategyUsed].used++;
      if(h.strategyCompleted)stats[h.strategyUsed].completed++;
    }
  });
  return Object.entries(stats)
    .filter(([,s])=>s.used>=2)
    .map(([name,s])=>({name,used:s.used,completed:s.completed,rate:s.completed/s.used}))
    .sort((a,b)=>b.rate-a.rate||b.used-a.used);
}

function getCategoryEmoji(cat){const e={studio:'📚',lavoro:'💼',casa:'🏠',sociale:'👥',cura:'💚',admin:'📋',altro:'📌'};return e[cat]||'📌';}
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

export { showToast, toggleCheckbox, filterDataByPeriod, detectTaskCategory, normalizeTaskName, getCategoryEmoji };
