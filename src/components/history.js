import { state, persist } from '../utils/state.js';
import { feelings, diaryMoods } from '../data/feelings.js';
import { triggerCategories } from '../data/triggers.js';
import { showScreen, showToast } from '../main.js';
import { formatDate } from '../utils/helpers.js';

// Flatten triggers for lookup
const allTriggers = triggerCategories.flatMap(c => c.triggers);
let reportPeriod = { type: 'days', value: 7 };
let historyPeriod = 'all';
let historyFeelingFilter = 'all';

const PERIOD_LABELS = {
    all: 'Tutto il periodo',
    week: 'Ultimi 7 giorni',
    month: 'Ultimi 30 giorni',
    today: 'Oggi'
};

export function renderHistory() {
    const container = document.getElementById('historyContent');
    if (!container) return;
    let list = state.history || [];
    if (list.length === 0) {
        try {
            const persisted = localStorage.getItem('adhdToolkitState') || localStorage.getItem('come-stai-v2');
            if (persisted) {
                const parsed = JSON.parse(persisted);
                if (parsed && Array.isArray(parsed.history) && parsed.history.length > 0) {
                    state.history = parsed.history;
                    list = state.history;
                }
            }
        } catch (_) {
            // Ignore parse errors; fall back to empty state
        }
    }
    const filtered = filterHistory(list);
    const countEl = document.getElementById('historyCount');
    if (countEl) countEl.textContent = `${filtered.length} momenti`;

    renderHistoryFeelingFilters(list);
    syncHistoryPeriodSelection();

    if (filtered.length === 0) {
        const label = PERIOD_LABELS[historyPeriod] || 'Questo periodo';
        const feelingLabel = historyFeelingFilter === 'all'
            ? 'tutte le emozioni'
            : (feelings.find(f => f.id === historyFeelingFilter)?.label || 'questa emozione').toLowerCase();
        container.innerHTML = `
            <div class="empty-state">
                <div class="emoji">🫧</div>
                <h3>Nessun momento registrato</h3>
                <p>Nessun dato per ${label.toLowerCase()} con ${feelingLabel}.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => {
        const feeling = feelings.find(f => f.id === item.feeling) || { emoji: '❓', label: '?' };
        const trigger = allTriggers.find(t => t.id === item.trigger) || { label: '?' };
        const strategy = getDisplayStrategy(item);
        const dateLabel = item.date ? formatDate(item.date) : '';
        const taskLine = item.taskName ? `<div class="history-card-task">Compito: ${item.taskName}</div>` : '';
        return `
            <div class="history-card">
                <div class="history-card-header">
                    <span class="history-card-emoji">${feeling.emoji}</span>
                    <div class="history-card-main">
                         <div class="history-card-feeling">${feeling.label}</div>
                         <div class="history-card-meta">${dateLabel}</div>
                    </div>
                </div>
                ${taskLine}
                <div class="history-card-trigger">Trigger: ${trigger.label}</div>
                <div class="history-card-strategy">${strategy}</div>
                <div class="history-card-actions">
                    <button class="edit-btn" onclick="openEditHistoryModal(${item.id})">✏️</button>
                    <button class="delete-btn" onclick="deleteHistoryEntry(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

export function renderDiaryEntries() {
    const list = document.getElementById('diaryEntries');
    if (!list) return;
    const entries = Array.isArray(state.diary) ? [...state.diary] : [];
    if (entries.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="emoji">📝</div>
                <h3>Nessuna nota salvata</h3>
                <p>Inizia con una nuova nota per vedere il tuo diario qui.</p>
            </div>
        `;
        return;
    }

    entries.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    list.innerHTML = entries.slice(0, 12).map(entry => {
        const mood = diaryMoods.find(m => m.id === entry.mood) || { emoji: '📝', label: '' };
        const dateLabel = entry.date ? formatDate(entry.date) : '';
        const text = (entry.text || '').trim();
        return `
            <div class="diary-entry" onclick="openDiaryEntry(${entry.id})">
                <div class="diary-entry-header">
                    <div class="diary-entry-emoji">${mood.emoji}</div>
                    <div class="diary-entry-meta">
                        <div class="diary-entry-date">${dateLabel}</div>
                        ${mood.label ? `<div class="diary-entry-time">${mood.label}</div>` : ''}
                    </div>
                </div>
                <div class="diary-entry-text">${text || 'Nota vuota'}</div>
            </div>
        `;
    }).join('');
}

export function generatePDFReport(updateLastPrinted = false) {
    // Requires jspdf loaded globally
    if (!window.jspdf) {
        showToast('PDF library loading...');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const includePatterns = document.getElementById('reportIncludePatterns')?.checked;
    const includeHistory = document.getElementById('reportIncludeHistory')?.checked;
    const includeDiary = document.getElementById('reportIncludeDiary')?.checked;
    const includeStrategies = document.getElementById('reportIncludeStrategies')?.checked;

    const now = new Date();
    const { label: periodLabel, cutoff, startLabel, endLabel } = getReportPeriodInfo();

    const history = (state.history || []).filter(item => {
        if (!item?.date) return false;
        if (!cutoff) return true;
        return new Date(item.date) >= cutoff;
    });

    const diary = (state.diary || []).filter(item => {
        if (!item?.date) return false;
        if (!cutoff) return true;
        return new Date(item.date) >= cutoff;
    });

    const colors = {
        primary: [92, 160, 250],
        secondary: [186, 133, 255],
        green: [76, 209, 155],
        coral: [240, 114, 114],
        dark: [24, 28, 45],
        muted: [110, 120, 140],
        light: [245, 247, 252],
        border: [220, 225, 235]
    };

    const page = {
        w: doc.internal.pageSize.getWidth(),
        h: doc.internal.pageSize.getHeight(),
        margin: 36
    };

    function drawHeader() {
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, page.w, 110, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text('ADHD Toolkit - Report', page.margin, 40);
        doc.setFontSize(11);
        doc.text(`Creato il ${now.toLocaleDateString()}`, page.margin, 60);
        doc.text(`Periodo: ${periodLabel}`, page.margin, 76);
        if (startLabel && endLabel) {
            doc.text(`Da: ${startLabel} | A: ${endLabel}`, page.margin, 92);
        }
        doc.setTextColor(...colors.dark);
        return 130;
    }

    let y = drawHeader();
    const lineHeight = 14;
    const pageBottom = page.h - page.margin;

    function addPageIfNeeded(extra = 0) {
        if (y + extra > pageBottom) {
            doc.addPage();
            y = drawHeader();
        }
    }

    function drawSectionTitle(title) {
        addPageIfNeeded(52);
        doc.setFontSize(14);
        doc.setTextColor(...colors.dark);
        doc.text(title, page.margin, y);
        doc.setDrawColor(...colors.primary);
        doc.setLineWidth(2);
        doc.line(page.margin, y + 6, page.margin + 120, y + 6);
        y += 28;
    }

    function wrapText(text, maxWidth) {
        if (!text) return [''];
        return doc.splitTextToSize(text, maxWidth);
    }

    function fitTextSingleLine(text, maxWidth, fontSize = 9, minFontSize = 7) {
        doc.setFontSize(fontSize);
        let currentSize = fontSize;
        while (doc.getTextWidth(text) > maxWidth && currentSize > minFontSize) {
            currentSize -= 1;
            doc.setFontSize(currentSize);
        }
        return currentSize;
    }

    function drawBarChart(items, getLabel, getValue, color = colors.primary, maxItems = 5) {
        const sliced = items.slice(0, maxItems);
        if (sliced.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...colors.muted);
            doc.text('Nessun dato disponibile.', page.margin, y + 6);
            y += 22;
            return;
        }

        const max = Math.max(...sliced.map(getValue), 1);
        const labelWidth = 180;
        const barWidth = page.w - page.margin * 2 - labelWidth - 40;

        sliced.forEach(item => {
            addPageIfNeeded(24);
            const label = getLabel(item);
            const value = getValue(item);

            doc.setFontSize(10);
            doc.setTextColor(...colors.dark);
            const labelLines = wrapText(label, labelWidth - 8);
            doc.text(labelLines, page.margin, y + 10);

            const barX = page.margin + labelWidth;
            const barY = y + 2 + (labelLines.length - 1) * 12;
            const barH = 10;
            const barW = Math.round((value / max) * barWidth);

            doc.setFillColor(...colors.border);
            doc.rect(barX, barY, barWidth, barH, 'F');
            doc.setFillColor(...color);
            doc.rect(barX, barY, Math.max(8, barW), barH, 'F');

            doc.setTextColor(...colors.muted);
            doc.text(String(value), barX + barWidth + 8, barY + 8);
            y += 12 * labelLines.length + 10;
        });
    }

    if (includePatterns) {
        drawSectionTitle('Pattern (Emozioni e Trigger)');

        const feelingCounts = {};
        const triggerCounts = {};
        history.forEach(item => {
            if (item.feeling) feelingCounts[item.feeling] = (feelingCounts[item.feeling] || 0) + 1;
            if (item.trigger) triggerCounts[item.trigger] = (triggerCounts[item.trigger] || 0) + 1;
        });

        const topFeelings = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        doc.setFontSize(11);
        doc.setTextColor(...colors.dark);
        doc.text('Emozioni più frequenti', page.margin, y);
        y += 8;
        drawBarChart(
            topFeelings,
            ([id]) => feelings.find(f => f.id === id)?.label || id,
            ([, count]) => count,
            colors.secondary
        );

        y += 8;
        doc.text('Trigger più frequenti', page.margin, y);
        y += 8;
        drawBarChart(
            topTriggers,
            ([id]) => allTriggers.find(t => t.id === id)?.label || id,
            ([, count]) => count,
            colors.primary
        );
        y += 6;
    }

    if (includeStrategies) {
        drawSectionTitle('Strategie Applicate e Risultati');

        const strategyCounts = {};
        const strategyScores = {};
        const strategyFeedbackCounts = {};
        history.forEach(item => {
            const strategy = getDisplayStrategy(item);
            if (!strategy || strategy === '—') return;
            strategyCounts[strategy] = (strategyCounts[strategy] || 0) + 1;
            const rating = getStrategyRating(item);
            if (rating) {
                strategyScores[strategy] = (strategyScores[strategy] || 0) + rating;
                strategyFeedbackCounts[strategy] = (strategyFeedbackCounts[strategy] || 0) + 1;
            }
        });

        const topStrategies = Object.entries(strategyCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        if (topStrategies.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...colors.muted);
            doc.text('Nessuna strategia registrata.', page.margin, y + 6);
            y += 18;
        } else {
            topStrategies.forEach(([name, count]) => {
                addPageIfNeeded(24);
                const feedbackCount = strategyFeedbackCounts[name] || 0;
                const avg = feedbackCount > 0 ? (strategyScores[name] / feedbackCount) : 0;
                const avgLabel = feedbackCount > 0 ? `${avg.toFixed(1)}/5` : '—';

                doc.setFontSize(10);
                doc.setTextColor(...colors.dark);
                const nameLines = wrapText(name, 220);
                doc.text(nameLines, page.margin, y + 8);
                doc.setTextColor(...colors.muted);
                doc.text(`${count} usi · media ${avgLabel} (${feedbackCount})`, page.margin + 240, y + 8);

                const barX = page.margin;
                const barY = y + 10 + (nameLines.length - 1) * 12;
                const barW = page.w - page.margin * 2;
                const barH = 6;
                doc.setFillColor(...colors.border);
                doc.rect(barX, barY, barW, barH, 'F');
                if (feedbackCount > 0) {
                    doc.setFillColor(...colors.green);
                    doc.rect(barX, barY, Math.max(6, (avg / 5) * barW), barH, 'F');
                }
                y += 12 + nameLines.length * 12;
            });
        }

        y += 12;
    }

    if (includeHistory) {
        drawSectionTitle('Momenti Registrati');

        if (history.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...colors.muted);
            doc.text('Nessun momento registrato nel periodo selezionato.', page.margin, y + 6);
            y += 18;
        } else {
            const colDateWidth = 140;
            const colTriggerWidth = 240;
            const colStrategyWidth = page.w - page.margin * 2 - colDateWidth - colTriggerWidth - 12;

            // Column headers
            addPageIfNeeded(22);
            doc.setFontSize(8);
            doc.setTextColor(...colors.muted);
            doc.text('Trigger', page.margin + 6 + colDateWidth, y + 8);
            doc.text('Strategia', page.margin + 6 + colDateWidth + colTriggerWidth, y + 8);
            y += 14;

            history.slice(0, 160).forEach((item, index) => {
                addPageIfNeeded(20);
                const feeling = feelings.find(f => f.id === item.feeling)?.label || item.feeling;
                const trigger = allTriggers.find(t => t.id === item.trigger)?.label || item.trigger;
                const strategy = getDisplayStrategy(item);
                const taskName = item.taskName || '';
                const dateText = item.date ? formatDate(item.date) : '';
                if (index % 2 === 0) {
                    doc.setFillColor(...colors.light);
                    doc.rect(page.margin, y - 2, page.w - page.margin * 2, 18, 'F');
                }

                const leftText = `${dateText} · ${feeling}`;
                const triggerText = taskName ? `${trigger} · ${taskName}` : trigger;
                const strategyText = strategy || '—';

                doc.setTextColor(...colors.dark);
                fitTextSingleLine(leftText, colDateWidth, 9, 7);
                doc.text(leftText, page.margin + 6, y + 10);

                doc.setTextColor(...colors.muted);
                fitTextSingleLine(triggerText, colTriggerWidth, 8, 7);
                doc.text(triggerText, page.margin + 6 + colDateWidth, y + 10);

                doc.setTextColor(...colors.muted);
                fitTextSingleLine(strategyText, colStrategyWidth, 8, 7);
                doc.text(strategyText, page.margin + 6 + colDateWidth + colTriggerWidth, y + 10);

                y += 18;
            });
        }

        y += 12;
    }

    if (includeDiary) {
        drawSectionTitle('Note Personali');

        if (diary.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...colors.muted);
            doc.text('Nessuna nota nel periodo selezionato.', page.margin, y + 6);
            y += 18;
        } else {
            diary.slice(0, 40).forEach(item => {
                addPageIfNeeded(36);
                const mood = diaryMoods.find(m => m.id === item.mood)?.label || item.mood || '';
                const dateText = item.date ? formatDate(item.date) : '';
                doc.setFontSize(9);
                doc.setTextColor(...colors.dark);
                const headerLines = wrapText(`${dateText} · ${mood}`, page.w - page.margin * 2 - 10);
                doc.text(headerLines, page.margin, y + 10);
                y += 12 * headerLines.length;
                const text = (item.text || '').trim();
                const lines = doc.splitTextToSize(text, page.w - page.margin * 2);
                lines.forEach(line => {
                    addPageIfNeeded(16);
                    doc.setTextColor(...colors.muted);
                    doc.text(line, page.margin, y + 10);
                    y += 14;
                });
                y += 10;
            });
        }
    }

    doc.save('adhd-report.pdf');
    if (updateLastPrinted) {
        if (!state.report) state.report = { lastPrintedAt: null };
        state.report.lastPrintedAt = new Date().toISOString();
        persist();
        renderReportMeta();
    }
    showToast(updateLastPrinted ? 'Report scaricato e data aggiornata' : 'Report scaricato');
}

export function renderInsights() {
    const container = document.getElementById('insightsContent');
    if (!container) return;

    const history = Array.isArray(state.history) ? state.history : [];
    const diary = Array.isArray(state.diary) ? state.diary : [];

    if (history.length === 0 && diary.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="emoji">📊</div>
                <h3>Nessun dato disponibile</h3>
                <p>Usa l'app per registrare momenti o note e vedere i tuoi pattern.</p>
            </div>
            <button class="generate-report-btn" onclick="showScreen('reportScreen')">📄 Crea report PDF</button>
        `;
        return;
    }

    const last7Days = getItemsWithinDays(history, 7).length;
    const last30Days = getItemsWithinDays(history, 30).length;

    const feelingCounts = countBy(history, item => item.feeling);
    const triggerCounts = countBy(history, item => item.trigger);
    const strategyCounts = countBy(history, item => {
        const value = getDisplayStrategy(item);
        return value === '—' ? null : value;
    });
    const { totals: strategyTotals, counts: strategyRatingCounts } = collectStrategyRatings(history);

    const topFeeling = getTopEntry(feelingCounts);
    const topTrigger = getTopEntry(triggerCounts);
    const topStrategy = getTopEntry(strategyCounts);

    const topFeelingLabel = topFeeling
        ? feelings.find(f => f.id === topFeeling.key)?.label || topFeeling.key
        : '—';
    const topTriggerLabel = topTrigger
        ? allTriggers.find(t => t.id === topTrigger.key)?.label || topTrigger.key
        : '—';

    const topStrategyLabel = topStrategy ? topStrategy.key : '—';
    const topStrategyCount = topStrategy ? topStrategy.value : 0;
    const topStrategyFeedback = topStrategy ? (strategyRatingCounts[topStrategy.key] || 0) : 0;
    const topStrategyAvg = topStrategyFeedback > 0
        ? (strategyTotals[topStrategy.key] / topStrategyFeedback)
        : 0;

    const moodCounts = countBy(diary, item => item.mood);
    const topMood = getTopEntry(moodCounts);
    const topMoodLabel = topMood
        ? diaryMoods.find(m => m.id === topMood.key)?.label || topMood.key
        : '—';

    container.innerHTML = `
        ${insightCard('📌', 'Momenti registrati', `
            Totale: <span class="insight-highlight">${history.length}</span><br>
            Ultimi 7 giorni: <span class="insight-highlight">${last7Days}</span><br>
            Ultimi 30 giorni: <span class="insight-highlight">${last30Days}</span>
        `)}
        ${insightCard('💭', 'Emozione più frequente', `
            <span class="insight-highlight">${topFeelingLabel}</span>
            ${topFeeling ? `(${topFeeling.value} volte)` : ''}
        `)}
        ${insightCard('🎯', 'Trigger più frequente', `
            <span class="insight-highlight">${topTriggerLabel}</span>
            ${topTrigger ? `(${topTrigger.value} volte)` : ''}
        `)}
        ${insightCard('🧠', 'Strategia più usata', `
            <span class="insight-highlight">${topStrategyLabel}</span>
            ${topStrategy ? `(${topStrategy.value} usi)` : ''}<br>
            ${topStrategyFeedback > 0
                ? `Valutazione media: <span class="insight-highlight">${topStrategyAvg.toFixed(1)}/5</span>`
                : 'Nessun feedback ancora'}
        `)}
        ${diary.length > 0 ? insightCard('📝', 'Diario', `
            Note totali: <span class="insight-highlight">${diary.length}</span><br>
            Mood più comune: <span class="insight-highlight">${topMoodLabel}</span>
        `) : ''}
        <button class="generate-report-btn" onclick="showScreen('reportScreen')">📄 Crea report PDF</button>
    `;
}

export function setHistoryPeriod(period) {
    historyPeriod = period;
    document.querySelectorAll('.filter-chip[data-period]').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.filter-chip[data-period="${period}"]`)?.classList.add('selected');
    renderHistory();
    // Note: renderHistory needs to handle filtering logic, omitted for brevity but UI feedback works
}

export function setHistoryFeelingFilter(feelingId) {
    historyFeelingFilter = feelingId || 'all';
    renderHistory();
}

export function selectReportPeriod(days) {
    if (days === 'last' && !state.report?.lastPrintedAt) return;
    document.querySelectorAll('.report-period-btn').forEach(b => b.classList.remove('selected'));
    const btn = event?.target;
    if (btn) btn.classList.add('selected');
    if (days === 0) {
        reportPeriod = { type: 'all', value: 0 };
        return;
    }
    if (days === 'last') {
        reportPeriod = { type: 'last', value: 'last' };
        return;
    }
    reportPeriod = { type: 'days', value: Number(days) || 7 };
}

export function toggleCheckbox(id) {
    const box = document.getElementById(id);
    if (!box) return;
    box.checked = !box.checked;
    const wrapper = box.closest('.report-checkbox');
    if (wrapper) wrapper.classList.toggle('checked', box.checked);
}

export function renderReportMeta() {
    const info = document.getElementById('reportLastPrint');
    if (!info) return;
    const lastPrintedAt = state.report?.lastPrintedAt;
    if (!lastPrintedAt) {
        info.textContent = 'Nessuna stampa precedente. Stampa una volta per abilitarla.';
        if (reportPeriod.type === 'last') {
            reportPeriod = { type: 'all', value: 0 };
            document.querySelectorAll('.report-period-btn').forEach(b => b.classList.remove('selected'));
            document.getElementById('reportPeriodAll')?.classList.add('selected');
        }
    } else {
        info.textContent = `Ultima stampa: ${formatDate(lastPrintedAt)}`;
    }

    const lastBtn = document.getElementById('reportPeriodLast');
    if (lastBtn) {
        const hasLast = Boolean(lastPrintedAt);
        lastBtn.disabled = !hasLast;
        lastBtn.classList.toggle('disabled', !hasLast);
    }

    syncReportPeriodSelection();
}

function filterHistory(list) {
    let filtered = Array.isArray(list) ? list : [];

    if (historyPeriod !== 'all') {
        const cutoff = getPeriodCutoff(historyPeriod);
        if (cutoff) {
            filtered = filtered.filter(item => item.date && new Date(item.date) >= cutoff);
        }
    }

    if (historyFeelingFilter !== 'all') {
        filtered = filtered.filter(item => item.feeling === historyFeelingFilter);
    }

    return filtered;
}

function getPeriodCutoff(period) {
    if (period === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }
    if (period === 'week') return new Date(Date.now() - 7 * 86400000);
    if (period === 'month') return new Date(Date.now() - 30 * 86400000);
    return null;
}

function renderHistoryFeelingFilters(list) {
    const container = document.getElementById('historyFeelingFilters');
    if (!container) return;

    const available = new Set((list || []).map(item => item.feeling).filter(Boolean));
    if (historyFeelingFilter !== 'all' && !available.has(historyFeelingFilter)) {
        historyFeelingFilter = 'all';
    }
    const feelingButtons = feelings
        .filter(f => available.has(f.id))
        .map(f => `
            <button class="filter-chip ${historyFeelingFilter === f.id ? 'selected' : ''}"
                onclick="setHistoryFeelingFilter('${f.id}')">
                ${f.emoji} ${f.label}
            </button>
        `)
        .join('');

    container.innerHTML = `
        <button class="filter-chip ${historyFeelingFilter === 'all' ? 'selected' : ''}"
            onclick="setHistoryFeelingFilter('all')">Tutte</button>
        ${feelingButtons}
    `;
}

function syncHistoryPeriodSelection() {
    document.querySelectorAll('.filter-chip[data-period]').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.filter-chip[data-period="${historyPeriod}"]`)?.classList.add('selected');
}

function syncReportPeriodSelection() {
    const btn7 = document.getElementById('reportPeriod7');
    const btn30 = document.getElementById('reportPeriod30');
    const btnAll = document.getElementById('reportPeriodAll');
    const btnLast = document.getElementById('reportPeriodLast');

    [btn7, btn30, btnAll, btnLast].forEach(btn => btn?.classList.remove('selected'));

    if (reportPeriod.type === 'all') {
        btnAll?.classList.add('selected');
    } else if (reportPeriod.type === 'last') {
        btnLast?.classList.add('selected');
    } else if (reportPeriod.value === 30) {
        btn30?.classList.add('selected');
    } else {
        btn7?.classList.add('selected');
    }
}

function getItemsWithinDays(items, days) {
    const cutoff = new Date(Date.now() - days * 86400000);
    return (items || []).filter(item => item.date && new Date(item.date) >= cutoff);
}

function getReportPeriodInfo() {
    if (reportPeriod.type === 'all') {
        return { label: 'Tutto il periodo', cutoff: null, startLabel: null, endLabel: null };
    }
    if (reportPeriod.type === 'last') {
        const lastPrintedAt = state.report?.lastPrintedAt;
        if (!lastPrintedAt) {
            return { label: 'Tutto il periodo', cutoff: null, startLabel: null, endLabel: null };
        }
        return {
            label: 'Dall’ultima stampa',
            cutoff: new Date(lastPrintedAt),
            startLabel: formatDate(lastPrintedAt),
            endLabel: formatDate(new Date())
        };
    }
    const days = reportPeriod.value || 7;
    return {
        label: `Ultimi ${days} giorni`,
        cutoff: new Date(Date.now() - days * 86400000),
        startLabel: formatDate(new Date(Date.now() - days * 86400000)),
        endLabel: formatDate(new Date())
    };
}

function getStrategyRating(item) {
    if (!item) return null;
    const rating = Number(item.strategyRating);
    if (Number.isFinite(rating) && rating >= 1 && rating <= 5) return Math.round(rating);
    if (item.strategyHelpful === true) return 5;
    if (item.strategyHelpful === false) return 2;
    return null;
}

function getDisplayStrategy(item) {
    if (!item) return '—';
    const used = item.strategyUsed;
    if (!used) return '—';
    if (item.strategy && used === item.strategy) return '—';
    return used;
}

function collectStrategyRatings(history) {
    const totals = {};
    const counts = {};
    (history || []).forEach(item => {
        const strategy = item.strategyUsed || item.strategy;
        if (!strategy) return;
        const rating = getStrategyRating(item);
        if (!rating) return;
        totals[strategy] = (totals[strategy] || 0) + rating;
        counts[strategy] = (counts[strategy] || 0) + 1;
    });
    return { totals, counts };
}

function countBy(items, keyFn) {
    const counts = {};
    (items || []).forEach(item => {
        const key = keyFn(item);
        if (!key) return;
        counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
}

function getTopEntry(counts) {
    const entries = Object.entries(counts || {});
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return { key: entries[0][0], value: entries[0][1] };
}

function insightCard(emoji, title, content) {
    return `
        <div class="insight-card">
            <div class="insight-card-header">
                <div class="insight-card-emoji">${emoji}</div>
                <div class="insight-card-title">${title}</div>
            </div>
            <div class="insight-card-content">${content}</div>
        </div>
    `;
}
