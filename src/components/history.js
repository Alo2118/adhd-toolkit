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
        const rating = getStrategyRating(item);
        const ratingDisplay = rating ? ` <span class="history-card-rating">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span>` : '';
        const dateLabel = item.date ? formatDate(item.date) : '';
        const taskLine = item.taskName ? `<div class="history-card-task">Compito: ${item.taskName}</div>` : '';
        const strategyLine = strategy !== '—'
            ? `<div class="history-card-strategy">Strategia: ${strategy}${ratingDisplay}</div>`
            : '';
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
                ${strategyLine}
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
        orange: [242, 179, 138],
        dark: [24, 28, 45],
        muted: [110, 120, 140],
        light: [245, 247, 252],
        border: [220, 225, 235],
        white: [255, 255, 255]
    };

    const page = {
        w: doc.internal.pageSize.getWidth(),
        h: doc.internal.pageSize.getHeight(),
        margin: 40
    };

    let pageNumber = 1;

    function drawHeader() {
        // Gradient-style header with rounded accent
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, page.w, 100, 'F');
        // Accent stripe
        doc.setFillColor(...colors.secondary);
        doc.rect(0, 100, page.w, 4, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text('ADHD Toolkit', page.margin, 36);
        doc.setFontSize(10);
        doc.text('Report personale', page.margin, 52);
        doc.setFontSize(9);
        doc.text(`${periodLabel}  |  ${now.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}`, page.margin, 72);
        if (startLabel && endLabel) {
            doc.text(`Dal ${startLabel} al ${endLabel}`, page.margin, 86);
        }
        doc.setTextColor(...colors.dark);
        return 120;
    }

    function drawFooter() {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(...colors.muted);
            doc.text(`Pagina ${i} di ${totalPages}`, page.w / 2, page.h - 16, { align: 'center' });
            doc.text('ADHD Toolkit | Generato automaticamente', page.margin, page.h - 16);
        }
    }

    let y = drawHeader();
    const lineHeight = 14;
    const pageBottom = page.h - page.margin - 20;

    function addPageIfNeeded(extra = 0) {
        if (y + extra > pageBottom) {
            doc.addPage();
            pageNumber++;
            y = drawHeader();
        }
    }

    function drawSectionTitle(title) {
        addPageIfNeeded(52);
        y += 6;
        // Section accent bar
        doc.setFillColor(...colors.primary);
        doc.roundedRect(page.margin, y - 4, 4, 22, 2, 2, 'F');
        doc.setFontSize(13);
        doc.setTextColor(...colors.dark);
        doc.text(title, page.margin + 12, y + 12);
        y += 30;
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
        const labelWidth = 160;
        const barWidth = page.w - page.margin * 2 - labelWidth - 50;

        sliced.forEach(item => {
            addPageIfNeeded(26);
            const label = getLabel(item);
            const value = getValue(item);

            doc.setFontSize(9);
            doc.setTextColor(...colors.dark);
            const labelLines = wrapText(label, labelWidth - 8);
            doc.text(labelLines, page.margin + 4, y + 10);

            const barX = page.margin + labelWidth;
            const barY = y + 2 + (labelLines.length - 1) * 12;
            const barH = 12;
            const barW = Math.round((value / max) * barWidth);

            doc.setFillColor(...colors.border);
            doc.roundedRect(barX, barY, barWidth, barH, 3, 3, 'F');
            doc.setFillColor(...color);
            doc.roundedRect(barX, barY, Math.max(10, barW), barH, 3, 3, 'F');

            doc.setFontSize(9);
            doc.setTextColor(...colors.dark);
            doc.text(String(value), barX + barWidth + 8, barY + 9);
            y += 12 * labelLines.length + 12;
        });
    }

    function drawStatBox(x, boxW, value, label, color) {
        doc.setFillColor(...colors.light);
        doc.roundedRect(x, y, boxW, 50, 6, 6, 'F');
        doc.setFillColor(...color);
        doc.roundedRect(x, y, boxW, 4, 2, 2, 'F');
        doc.setFontSize(16);
        doc.setTextColor(...color);
        doc.text(String(value), x + boxW / 2, y + 26, { align: 'center' });
        doc.setFontSize(7);
        doc.setTextColor(...colors.muted);
        doc.text(label, x + boxW / 2, y + 40, { align: 'center' });
    }

    // ======== EXECUTIVE SUMMARY ========
    {
        const feelingCounts = {};
        const triggerCounts = {};
        history.forEach(item => {
            if (item.feeling) feelingCounts[item.feeling] = (feelingCounts[item.feeling] || 0) + 1;
            if (item.trigger) triggerCounts[item.trigger] = (triggerCounts[item.trigger] || 0) + 1;
        });
        const topF = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1])[0];
        const topT = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];
        const topFLabel = topF ? (feelings.find(f => f.id === topF[0])?.label || topF[0]) : '—';
        const topTLabel = topT ? (allTriggers.find(t => t.id === topT[0])?.label || topT[0]) : '—';

        const usableW = page.w - page.margin * 2;
        const boxW = (usableW - 20) / 3;

        drawStatBox(page.margin, boxW, history.length, 'Check-in', colors.primary);
        drawStatBox(page.margin + boxW + 10, boxW, diary.length, 'Note diario', colors.secondary);
        drawStatBox(page.margin + (boxW + 10) * 2, boxW, calculateStreak(history) + 'd', 'Streak', colors.green);
        y += 60;

        // Key insight line
        if (topF) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.muted);
            doc.text(`Emozione dominante: ${topFLabel} (${topF[1]}x)  -  Trigger principale: ${topTLabel} (${topT?.[1] || 0}x)`, page.margin, y + 4);
            y += 18;
        }
    }

    if (includePatterns) {
        drawSectionTitle('Emozioni e Trigger');

        const feelingCounts = {};
        const triggerCounts = {};
        history.forEach(item => {
            if (item.feeling) feelingCounts[item.feeling] = (feelingCounts[item.feeling] || 0) + 1;
            if (item.trigger) triggerCounts[item.trigger] = (triggerCounts[item.trigger] || 0) + 1;
        });

        const topFeelings = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        doc.setFontSize(10);
        doc.setTextColor(...colors.dark);
        doc.text('Emozioni più frequenti', page.margin + 4, y);
        y += 10;
        drawBarChart(
            topFeelings,
            ([id]) => feelings.find(f => f.id === id)?.label || id,
            ([, count]) => count,
            colors.secondary
        );

        y += 8;
        doc.setFontSize(10);
        doc.setTextColor(...colors.dark);
        doc.text('Trigger più frequenti', page.margin + 4, y);
        y += 10;
        drawBarChart(
            topTriggers,
            ([id]) => allTriggers.find(t => t.id === id)?.label || id,
            ([, count]) => count,
            colors.primary
        );

        // Correlations
        const corrs = buildCorrelations(history);
        if (corrs.length > 0) {
            y += 6;
            doc.setFontSize(10);
            doc.setTextColor(...colors.dark);
            doc.text('Connessioni Emozione > Trigger', page.margin + 4, y);
            y += 12;
            corrs.slice(0, 5).forEach(c => {
                addPageIfNeeded(18);
                doc.setFontSize(9);
                doc.setTextColor(...colors.muted);
                doc.text(`${c.feelingLabel}  >  ${c.triggerLabel}`, page.margin + 8, y + 6);
                doc.setTextColor(...colors.dark);
                doc.text(`${c.count}x`, page.w - page.margin - 30, y + 6);
                y += 16;
            });
        }

        // Time patterns
        const tp = analyzeTimePatterns(history);
        if (tp.peakHour !== null) {
            y += 6;
            addPageIfNeeded(70);
            doc.setFontSize(10);
            doc.setTextColor(...colors.dark);
            doc.text('Distribuzione temporale', page.margin + 4, y);
            y += 14;

            const periods = [
                { label: 'Mattina (6-12)', value: tp.morning, color: colors.orange },
                { label: 'Pomeriggio (12-18)', value: tp.afternoon, color: colors.primary },
                { label: 'Sera (18-23)', value: tp.evening, color: colors.secondary },
                { label: 'Notte (23-6)', value: tp.night, color: colors.dark }
            ];
            const maxP = Math.max(...periods.map(p => p.value), 1);
            periods.forEach(p => {
                addPageIfNeeded(20);
                doc.setFontSize(8);
                doc.setTextColor(...colors.muted);
                doc.text(p.label, page.margin + 8, y + 8);
                const barX = page.margin + 130;
                const barW = page.w - page.margin * 2 - 180;
                doc.setFillColor(...colors.border);
                doc.roundedRect(barX, y, barW, 10, 3, 3, 'F');
                doc.setFillColor(...p.color);
                doc.roundedRect(barX, y, Math.max(6, (p.value / maxP) * barW), 10, 3, 3, 'F');
                doc.setTextColor(...colors.dark);
                doc.text(String(p.value), barX + barW + 8, y + 8);
                y += 16;
            });
            doc.setFontSize(8);
            doc.setTextColor(...colors.muted);
            doc.text(`Orario di picco: ${formatHourRange(tp.peakHour)}`, page.margin + 8, y + 4);
            y += 14;
        }

        y += 6;
    }

    if (includeStrategies) {
        drawSectionTitle('Strategie e Risultati');

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
            doc.text('Nessuna strategia registrata.', page.margin + 4, y + 6);
            y += 18;
        } else {
            // Table header
            addPageIfNeeded(22);
            doc.setFillColor(...colors.light);
            doc.roundedRect(page.margin, y, page.w - page.margin * 2, 18, 4, 4, 'F');
            doc.setFontSize(8);
            doc.setTextColor(...colors.muted);
            doc.text('Strategia', page.margin + 8, y + 12);
            doc.text('Usi', page.w - page.margin - 110, y + 12);
            doc.text('Valutazione', page.w - page.margin - 60, y + 12);
            y += 22;

            topStrategies.forEach(([name, count], idx) => {
                addPageIfNeeded(28);
                const feedbackCount = strategyFeedbackCounts[name] || 0;
                const avg = feedbackCount > 0 ? (strategyScores[name] / feedbackCount) : 0;
                const avgLabel = feedbackCount > 0 ? `${avg.toFixed(1)}/5` : '—';

                if (idx % 2 === 0) {
                    doc.setFillColor(248, 249, 254);
                    doc.rect(page.margin, y - 2, page.w - page.margin * 2, 22, 'F');
                }

                doc.setFontSize(9);
                doc.setTextColor(...colors.dark);
                const nameLines = wrapText(name, 300);
                doc.text(nameLines[0], page.margin + 8, y + 10);
                doc.setTextColor(...colors.muted);
                doc.text(String(count), page.w - page.margin - 110, y + 10);

                // Rating bar mini
                if (feedbackCount > 0) {
                    const rX = page.w - page.margin - 56;
                    doc.setFillColor(...colors.border);
                    doc.roundedRect(rX, y + 2, 40, 6, 2, 2, 'F');
                    doc.setFillColor(...colors.green);
                    doc.roundedRect(rX, y + 2, Math.max(4, (avg / 5) * 40), 6, 2, 2, 'F');
                    doc.setFontSize(7);
                    doc.text(avgLabel, rX + 42, y + 8);
                } else {
                    doc.setFontSize(7);
                    doc.text('-', page.w - page.margin - 40, y + 10);
                }

                y += 22;
            });
        }

        y += 12;
    }

    if (includeHistory) {
        drawSectionTitle('Momenti Registrati');

        if (history.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...colors.muted);
            doc.text('Nessun momento registrato nel periodo selezionato.', page.margin + 4, y + 6);
            y += 18;
        } else {
            const colDateWidth = 130;
            const colTriggerWidth = 220;
            const colStrategyWidth = page.w - page.margin * 2 - colDateWidth - colTriggerWidth - 12;

            // Column headers
            addPageIfNeeded(24);
            doc.setFillColor(...colors.light);
            doc.roundedRect(page.margin, y - 2, page.w - page.margin * 2, 18, 4, 4, 'F');
            doc.setFontSize(7);
            doc.setTextColor(...colors.muted);
            doc.text('DATA / EMOZIONE', page.margin + 8, y + 9);
            doc.text('TRIGGER', page.margin + 8 + colDateWidth, y + 9);
            doc.text('STRATEGIA', page.margin + 8 + colDateWidth + colTriggerWidth, y + 9);
            y += 20;

            history.slice(0, 160).forEach((item, index) => {
                addPageIfNeeded(20);
                const feeling = feelings.find(f => f.id === item.feeling)?.label || item.feeling;
                const trigger = allTriggers.find(t => t.id === item.trigger)?.label || item.trigger;
                const strategy = getDisplayStrategy(item);
                const rating = getStrategyRating(item);
                const taskName = item.taskName || '';
                const dateText = item.date ? formatDate(item.date) : '';
                if (index % 2 === 0) {
                    doc.setFillColor(248, 249, 254);
                    doc.rect(page.margin, y - 2, page.w - page.margin * 2, 18, 'F');
                }

                const leftText = `${dateText} - ${feeling}`;
                const triggerText = taskName ? `${trigger} - ${taskName}` : trigger;
                const ratingText = rating ? ` (${rating}/5)` : '';
                const strategyText = (strategy && strategy !== '—') ? `${strategy}${ratingText}` : '-';

                doc.setTextColor(...colors.dark);
                fitTextSingleLine(leftText, colDateWidth, 8, 6);
                doc.text(leftText, page.margin + 8, y + 10);

                doc.setTextColor(...colors.muted);
                fitTextSingleLine(triggerText, colTriggerWidth, 8, 6);
                doc.text(triggerText, page.margin + 8 + colDateWidth, y + 10);

                doc.setTextColor(...colors.muted);
                fitTextSingleLine(strategyText, colStrategyWidth, 8, 6);
                doc.text(strategyText, page.margin + 8 + colDateWidth + colTriggerWidth, y + 10);

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
            doc.text('Nessuna nota nel periodo selezionato.', page.margin + 4, y + 6);
            y += 18;
        } else {
            diary.slice(0, 40).forEach(item => {
                addPageIfNeeded(42);
                const mood = diaryMoods.find(m => m.id === item.mood)?.label || item.mood || '';
                const dateText = item.date ? formatDate(item.date) : '';

                // Card background
                const text = (item.text || '').trim();
                const textLines = doc.splitTextToSize(text, page.w - page.margin * 2 - 24);
                const cardH = 32 + textLines.length * 13;
                addPageIfNeeded(cardH + 8);

                doc.setFillColor(...colors.light);
                doc.roundedRect(page.margin, y, page.w - page.margin * 2, cardH, 6, 6, 'F');

                // Header
                doc.setFontSize(9);
                doc.setTextColor(...colors.dark);
                doc.text(mood, page.margin + 10, y + 14);
                doc.setFontSize(7);
                doc.setTextColor(...colors.muted);
                doc.text(dateText, page.w - page.margin - 10, y + 14, { align: 'right' });

                // Body
                let ty = y + 26;
                textLines.forEach(line => {
                    doc.setFontSize(8);
                    doc.setTextColor(...colors.muted);
                    doc.text(line, page.margin + 10, ty);
                    ty += 13;
                });

                y += cardH + 8;
            });
        }
    }

    // Draw footer with page numbers
    drawFooter();

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
    const summaryStrip = document.getElementById('insightsSummary');
    if (!container) return;

    const history = Array.isArray(state.history) ? state.history : [];
    const diary = Array.isArray(state.diary) ? state.diary : [];

    if (history.length === 0 && diary.length === 0) {
        if (summaryStrip) summaryStrip.innerHTML = '';
        container.innerHTML = `
            <div class="empty-state">
                <div class="emoji">📊</div>
                <h3>Nessun dato disponibile</h3>
                <p>Usa l'app per registrare momenti o note e vedere i tuoi pattern.</p>
            </div>
        `;
        return;
    }

    const last7Days = getItemsWithinDays(history, 7);
    const last30Days = getItemsWithinDays(history, 30);
    const prev7Days = history.filter(i => {
        if (!i.date) return false;
        const d = new Date(i.date);
        const now = Date.now();
        return d >= new Date(now - 14 * 86400000) && d < new Date(now - 7 * 86400000);
    });

    // Trend calculation
    const trend7 = prev7Days.length > 0
        ? Math.round(((last7Days.length - prev7Days.length) / prev7Days.length) * 100)
        : null;
    const trendIcon = trend7 === null ? '➖' : trend7 > 0 ? '📈' : trend7 < 0 ? '📉' : '➖';
    const trendLabel = trend7 === null ? 'Primo periodo'
        : trend7 > 0 ? `+${trend7}% vs settimana prima`
        : trend7 < 0 ? `${trend7}% vs settimana prima`
        : 'Stabile vs settimana prima';

    // Streak calculation
    const streak = calculateStreak(history);

    // Summary strip
    if (summaryStrip) {
        summaryStrip.innerHTML = `
            <div class="summary-stat">
                <span class="summary-stat-value">${history.length}</span>
                <span class="summary-stat-label">Totale</span>
            </div>
            <div class="summary-stat">
                <span class="summary-stat-value">${last7Days.length}</span>
                <span class="summary-stat-label">7 giorni</span>
            </div>
            <div class="summary-stat">
                <span class="summary-stat-value">${streak}🔥</span>
                <span class="summary-stat-label">Streak</span>
            </div>
            <div class="summary-stat">
                <span class="summary-stat-value">${trendIcon}</span>
                <span class="summary-stat-label">${trend7 !== null ? (trend7 >= 0 ? '+' + trend7 + '%' : trend7 + '%') : '—'}</span>
            </div>
        `;
    }

    const feelingCounts = countBy(history, item => item.feeling);
    const triggerCounts = countBy(history, item => item.trigger);
    const strategyCounts = countBy(history, item => {
        const value = getDisplayStrategy(item);
        return value === '—' ? null : value;
    });
    const { totals: strategyTotals, counts: strategyRatingCounts } = collectStrategyRatings(history);

    // Top entries
    const topFeelings = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topStrategies = Object.entries(strategyCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Feeling-Trigger correlations
    const correlations = buildCorrelations(history);

    // Time patterns
    const timePatterns = analyzeTimePatterns(history);

    // Mood from diary
    const moodCounts = countBy(diary, item => item.mood);
    const topMood = getTopEntry(moodCounts);
    const topMoodLabel = topMood
        ? diaryMoods.find(m => m.id === topMood.key)?.label || topMood.key
        : '—';

    let html = '';

    // --- Trend Card ---
    html += `
        <div class="insight-card-v2 insight-trend">
            <div class="insight-card-icon">${trendIcon}</div>
            <div class="insight-card-body">
                <div class="insight-card-label">Trend settimanale</div>
                <div class="insight-card-value">${last7Days.length} check-in questa settimana</div>
                <div class="insight-card-meta">${trendLabel}</div>
            </div>
        </div>
    `;

    // --- Feelings Distribution ---
    if (topFeelings.length > 0) {
        const maxFeeling = topFeelings[0][1];
        html += `
            <div class="insight-section">
                <h3 class="insight-section-title">💭 Emozioni più frequenti</h3>
                <div class="insight-bars">
                    ${topFeelings.map(([id, count]) => {
                        const f = feelings.find(ff => ff.id === id);
                        const pct = Math.round((count / maxFeeling) * 100);
                        return `
                            <div class="insight-bar-row">
                                <span class="insight-bar-emoji">${f?.emoji || '❓'}</span>
                                <span class="insight-bar-label">${f?.label || id}</span>
                                <div class="insight-bar-track">
                                    <div class="insight-bar-fill insight-bar-feeling" style="width:${pct}%"></div>
                                </div>
                                <span class="insight-bar-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- Triggers Distribution ---
    if (topTriggers.length > 0) {
        const maxTrigger = topTriggers[0][1];
        html += `
            <div class="insight-section">
                <h3 class="insight-section-title">🎯 Trigger principali</h3>
                <div class="insight-bars">
                    ${topTriggers.map(([id, count]) => {
                        const t = allTriggers.find(tt => tt.id === id);
                        const pct = Math.round((count / maxTrigger) * 100);
                        return `
                            <div class="insight-bar-row">
                                <span class="insight-bar-emoji">${t?.emoji || '📌'}</span>
                                <span class="insight-bar-label">${t?.label || id}</span>
                                <div class="insight-bar-track">
                                    <div class="insight-bar-fill insight-bar-trigger" style="width:${pct}%"></div>
                                </div>
                                <span class="insight-bar-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- Strategy Effectiveness ---
    if (topStrategies.length > 0) {
        html += `
            <div class="insight-section">
                <h3 class="insight-section-title">🧠 Strategie più efficaci</h3>
                <div class="insight-strategy-list">
                    ${topStrategies.map(([name, count]) => {
                        const fc = strategyRatingCounts[name] || 0;
                        const avg = fc > 0 ? (strategyTotals[name] / fc) : 0;
                        const stars = fc > 0 ? renderStars(avg) : '<span class="no-rating">Nessun feedback</span>';
                        return `
                            <div class="insight-strategy-item">
                                <div class="insight-strategy-name">${name}</div>
                                <div class="insight-strategy-meta">
                                    <span class="insight-strategy-uses">${count} usi</span>
                                    <span class="insight-strategy-rating">${stars}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- Correlations ---
    if (correlations.length > 0) {
        html += `
            <div class="insight-section">
                <h3 class="insight-section-title">🔗 Connessioni Emozione → Trigger</h3>
                <div class="insight-correlations">
                    ${correlations.slice(0, 4).map(c => `
                        <div class="insight-correlation-card">
                            <span class="corr-feeling">${c.feelingEmoji} ${c.feelingLabel}</span>
                            <span class="corr-arrow">→</span>
                            <span class="corr-trigger">${c.triggerLabel}</span>
                            <span class="corr-count">${c.count}×</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // --- Time Patterns ---
    if (timePatterns.peakHour !== null) {
        html += `
            <div class="insight-section">
                <h3 class="insight-section-title">🕐 Quando succede di più</h3>
                <div class="insight-time-grid">
                    <div class="insight-time-card ${timePatterns.peakPeriod === 'mattina' ? 'active' : ''}">
                        <span class="time-icon">🌅</span>
                        <span class="time-label">Mattina</span>
                        <span class="time-count">${timePatterns.morning}</span>
                    </div>
                    <div class="insight-time-card ${timePatterns.peakPeriod === 'pomeriggio' ? 'active' : ''}">
                        <span class="time-icon">☀️</span>
                        <span class="time-label">Pomeriggio</span>
                        <span class="time-count">${timePatterns.afternoon}</span>
                    </div>
                    <div class="insight-time-card ${timePatterns.peakPeriod === 'sera' ? 'active' : ''}">
                        <span class="time-icon">🌙</span>
                        <span class="time-label">Sera</span>
                        <span class="time-count">${timePatterns.evening}</span>
                    </div>
                    <div class="insight-time-card ${timePatterns.peakPeriod === 'notte' ? 'active' : ''}">
                        <span class="time-icon">🌑</span>
                        <span class="time-label">Notte</span>
                        <span class="time-count">${timePatterns.night}</span>
                    </div>
                </div>
                <p class="insight-time-summary">Orario di picco: <strong>${formatHourRange(timePatterns.peakHour)}</strong></p>
            </div>
        `;
    }

    // --- Diary Summary ---
    if (diary.length > 0) {
        html += `
            <div class="insight-card-v2 insight-diary-summary">
                <div class="insight-card-icon">📝</div>
                <div class="insight-card-body">
                    <div class="insight-card-label">Diario emotivo</div>
                    <div class="insight-card-value">${diary.length} note scritte</div>
                    <div class="insight-card-meta">Mood prevalente: ${topMoodLabel}</div>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

export function renderReportPreview() {
    const container = document.getElementById('reportPreview');
    if (!container) return;
    const history = Array.isArray(state.history) ? state.history : [];
    const diary = Array.isArray(state.diary) ? state.diary : [];
    const topFeeling = getTopEntry(countBy(history, i => i.feeling));
    const fLabel = topFeeling ? (feelings.find(f => f.id === topFeeling.key)?.label || '—') : '—';
    const fEmoji = topFeeling ? (feelings.find(f => f.id === topFeeling.key)?.emoji || '') : '';
    container.innerHTML = `
        <div class="report-preview-title">Anteprima dati</div>
        <div class="report-preview-stats">
            <div class="report-preview-stat">
                <span class="rps-value">${history.length}</span>
                <span class="rps-label">Check-in</span>
            </div>
            <div class="report-preview-stat">
                <span class="rps-value">${diary.length}</span>
                <span class="rps-label">Note</span>
            </div>
            <div class="report-preview-stat">
                <span class="rps-value">${fEmoji}</span>
                <span class="rps-label">${fLabel}</span>
            </div>
        </div>
    `;
}

// --- Helper functions for insights ---

function calculateStreak(history) {
    if (!history || history.length === 0) return 0;
    const days = new Set();
    history.forEach(item => {
        if (item.date) {
            const d = new Date(item.date);
            days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
        }
    });
    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);
    while (true) {
        const key = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
        if (days.has(key)) {
            streak++;
            current = new Date(current.getTime() - 86400000);
        } else {
            break;
        }
    }
    return streak;
}

function buildCorrelations(history) {
    const pairs = {};
    (history || []).forEach(item => {
        if (!item.feeling || !item.trigger) return;
        const key = `${item.feeling}__${item.trigger}`;
        pairs[key] = (pairs[key] || 0) + 1;
    });
    return Object.entries(pairs)
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => {
            const [fId, tId] = key.split('__');
            const f = feelings.find(ff => ff.id === fId);
            const t = allTriggers.find(tt => tt.id === tId);
            return {
                feelingEmoji: f?.emoji || '❓',
                feelingLabel: f?.label || fId,
                triggerLabel: t?.label || tId,
                count
            };
        });
}

function analyzeTimePatterns(history) {
    const hours = new Array(24).fill(0);
    let counted = 0;
    (history || []).forEach(item => {
        if (!item.date) return;
        const h = new Date(item.date).getHours();
        hours[h]++;
        counted++;
    });
    if (counted === 0) return { peakHour: null, morning: 0, afternoon: 0, evening: 0, night: 0, peakPeriod: null };

    const morning = hours.slice(6, 12).reduce((a, b) => a + b, 0);
    const afternoon = hours.slice(12, 18).reduce((a, b) => a + b, 0);
    const evening = hours.slice(18, 23).reduce((a, b) => a + b, 0);
    const night = hours.slice(0, 6).reduce((a, b) => a + b, 0) + (hours[23] || 0);

    const peakHour = hours.indexOf(Math.max(...hours));
    const periods = { mattina: morning, pomeriggio: afternoon, sera: evening, notte: night };
    const peakPeriod = Object.entries(periods).sort((a, b) => b[1] - a[1])[0][0];

    return { peakHour, morning, afternoon, evening, night, peakPeriod };
}

function formatHourRange(hour) {
    return `${String(hour).padStart(2, '0')}:00 - ${String((hour + 1) % 24).padStart(2, '0')}:00`;
}

function renderStars(avg) {
    const full = Math.floor(avg);
    const half = avg - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty) + ` <span class="star-value">${avg.toFixed(1)}</span>`;
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
    document.querySelectorAll('.report-period-btn, .report-period-chip').forEach(b => b.classList.remove('selected'));
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
    const wrapper = box.closest('.report-checkbox, .report-toggle');
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
            document.querySelectorAll('.report-period-btn, .report-period-chip').forEach(b => b.classList.remove('selected'));
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
    // Mostra solo la strategia effettivamente usata (tool/strategia aperta)
    // item.strategy è il titolo della risposta emotiva, NON la strategia
    return item.strategyUsed || '—';
}

function collectStrategyRatings(history) {
    const totals = {};
    const counts = {};
    (history || []).forEach(item => {
        const strategy = item.strategyUsed;
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
