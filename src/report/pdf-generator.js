// PDF Report Generator
import { state } from '../utils/state.js';
import { feelings } from '../data/feelings.js';
import { triggers } from '../data/triggers.js';
import { contextStrategies } from '../data/strategies.js';

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

export { generatePDFReport };
