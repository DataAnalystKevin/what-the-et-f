import { savingsPlan, realValue, avSubsidy, eur } from './calc.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const pct = (n, d = 0) => `${n.toLocaleString('de-DE', { maximumFractionDigits: d })} %`;

function svgEl(tag, attrs, text) {
  const el = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text != null) el.textContent = text;
  return el;
}

// --- Kapitel 1: Kaufkraft -------------------------------------------------
function inflation(w) {
  const input = $('[data-in=years]', w);
  const rows = [
    { label: 'Girokonto (0 %)', rate: 0, cls: 'bad' },
    { label: 'Sparbuch (1 %)', rate: 0.01, cls: '' },
    { label: 'Welt-ETF (Ø 7 %)', rate: 0.07, cls: 'good' },
  ];
  const render = () => {
    const y = +input.value;
    $('[data-out=years]', w).textContent = y;
    input.setAttribute('aria-valuetext', `${y} Jahre`);
    const vals = rows.map((r) => realValue(10000 * Math.pow(1 + r.rate, y), y, 0.02));
    const max = Math.max(...vals, 10000);
    $('[data-bars]', w).innerHTML = rows.map((r, i) => `
      <div><div class="bar-label"><span>${r.label}</span><strong>${eur(vals[i])}</strong></div>
      <div class="bar-track"><div class="bar-fill ${r.cls}" style="width:${(vals[i] / max) * 100}%"></div></div></div>`).join('');
  };
  input.addEventListener('input', render);
  render();
}

// --- Kapitel 2: Obstkorb --------------------------------------------------
function basket(w) {
  const dots = $('[data-dots]', w);
  dots.innerHTML = '<i></i>'.repeat(100);
  const btn = $('[data-crash]', w);
  let crashed = false;
  btn.addEventListener('click', () => {
    crashed = !crashed;
    $('[data-single]', w).classList.toggle('gone', crashed);
    dots.children[37].classList.toggle('gone', crashed);
    $('[data-single-value]', w).textContent = crashed ? '0 €' : '10.000 €';
    $('[data-basket-value]', w).textContent = crashed ? '9.992 €' : '10.000 €';
    $('[data-result]', w).textContent = crashed
      ? 'Einzelaktie: −100 %. Welt-ETF: hier nur −0,08 %, denn die Firma war eine von rund 1.250. (Wie viel genau, hängt von ihrer Größe im Index ab – spürbar ist es kaum.)'
      : '';
    btn.textContent = crashed ? '↺ Nochmal' : '💥 Firma geht pleite (à la Wirecard)';
  });
}

// --- Kapitel 3: Crash-Simulator ------------------------------------------
// Gerundete Näherung MSCI World (EUR, Net Return), Monate ab Jan 2020, Start = 100.
const COVID = [[0, 100], [1.6, 109], [2.75, 72], [4, 82], [6, 89], [8, 95], [10, 92], [12, 106], [15, 115], [18, 121], [21, 125], [24, 139]];
function crash(w) {
  const svg = $('[data-chart]', w);
  const W = 320, H = 160, P = { l: 8, r: 8, t: 14, b: 22 };
  const x = (m) => P.l + (m / 24) * (W - P.l - P.r);
  const y = (v) => P.t + (1 - (v - 60) / (145 - 60)) * (H - P.t - P.b);
  const line = (pts) => pts.map(([m, v]) => `${x(m)},${y(v)}`).join(' ');

  const draw = (choice) => {
    svg.replaceChildren(
      svgEl('line', { x1: P.l, x2: W - P.r, y1: y(100), y2: y(100), stroke: 'currentColor', 'stroke-opacity': .2, 'stroke-dasharray': '3 3' }),
      svgEl('text', { x: P.l, y: H - 6 }, 'Jan 2020'),
      svgEl('text', { x: x(12), y: H - 6, 'text-anchor': 'middle' }, 'Jan 2021'),
      svgEl('text', { x: W - P.r, y: H - 6, 'text-anchor': 'end' }, 'Ende 2021'),
    );
    const upToCrash = COVID.slice(0, 3);
    svg.setAttribute('aria-label', !choice ? 'Verlauf des MSCI World: Einbruch um 34 Prozent im März 2020'
      : choice === 'sell' ? 'Verkauft im März 2020: 7.200 Euro bleiben, der Index erholt sich bis Ende 2021 auf 13.900 Euro'
      : 'Gehalten: Ende 2020 rund 10.600 Euro, Ende 2021 rund 13.900 Euro');
    if (!choice) {
      svg.append(svgEl('polyline', { points: line(upToCrash), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
    } else {
      svg.append(svgEl('polyline', { points: line(COVID), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-opacity': choice === 'sell' ? .35 : 1 }));
      if (choice === 'sell') svg.append(svgEl('polyline', { points: line([...upToCrash, [24, 72]]), fill: 'none', stroke: 'var(--danger)', 'stroke-width': 2.5 }));
      const end = choice === 'sell' ? 72 : 139;
      svg.append(svgEl('text', { x: W - P.r, y: y(end) - 6, 'text-anchor': 'end' }, `${eur(end * 100)}`));
    }
    svg.append(svgEl('circle', { cx: x(2.75), cy: y(72), r: 4, fill: 'var(--danger)' }),
      svgEl('text', { x: x(2.75) + 7, y: y(72) + 3 }, 'März 2020: −34 %'));
  };

  const result = $('[data-result]', w);
  const step = $('.crash-step', w);
  $$('[data-choice]', w).forEach((b) => b.addEventListener('click', () => {
    const c = b.dataset.choice;
    draw(c);
    step.hidden = true;
    result.innerHTML = c === 'hold'
      ? 'Gute Nerven! Ende 2020 lag dein Depot schon wieder bei ca. 10.600 €, Ende 2021 bei ca. 13.900 €. Die Pandemie war aus Anlegersicht nach rund einem Jahr Geschichte.'
      : 'Du hast 7.200 € gerettet – und 2.800 € Verlust endgültig gemacht. Wer liegen ließ, hatte Ende 2021 ca. 13.900 €. Und ehrlich: Wann hättest du dich getraut, wieder einzusteigen?';
    const again = Object.assign(document.createElement('button'), { type: 'button', className: 'link-btn', textContent: '↺ Nochmal von vorn' });
    again.onclick = () => { draw(); step.hidden = false; result.textContent = ''; $('[data-choice]', w).focus(); };
    result.append(document.createElement('br'), again);
    result.focus(); // Der geklickte Button verschwindet – Fokus aufs Ergebnis
  }));
  draw();
}

// --- Kapitel 3: Haltedauer -----------------------------------------------
// DAI-Renditedreieck MSCI World (Sparplan), Stand 31.12.2024: Rendite p.a. [Jahre, min, Ø, max]
const HORIZON = [[1, -42.2, 10.3, 51.7], [5, -13.0, 10.2, 29.9], [10, -6.2, 9.8, 20.3], [15, -0.7, 9.0, 16.0], [20, 2.2, 8.6, 15.4], [25, 3.8, 8.2, 15.0], [30, 6.2, 7.9, 10.1]];
function horizon(w) {
  const input = $('[data-in=step]', w);
  const svg = $('[data-chart]', w);
  const W = 320, P = 12;
  const x = (v) => P + ((v + 45) / 100) * (W - 2 * P); // Achse −45 % … +55 %
  const fmt = (v) => `${v > 0 ? '+' : ''}${v.toLocaleString('de-DE', { minimumFractionDigits: 1 })} %`;
  const render = () => {
    const [years, min, avg, max] = HORIZON[+input.value];
    $('[data-out=years]', w).textContent = `${years} ${years === 1 ? 'Jahr' : 'Jahre'}`;
    input.setAttribute('aria-valuetext', `${years} ${years === 1 ? 'Jahr' : 'Jahre'}`);
    svg.setAttribute('aria-label', `Bei ${years} ${years === 1 ? 'Jahr' : 'Jahren'} Anlagedauer lag die Rendite pro Jahr zwischen ${fmt(min)} und ${fmt(max)}`);
    svg.replaceChildren(
      svgEl('line', { x1: x(0), x2: x(0), y1: 6, y2: 50, stroke: 'currentColor', 'stroke-opacity': .35, 'stroke-dasharray': '3 3' }),
      svgEl('text', { x: x(0), y: 64, 'text-anchor': 'middle' }, '0 %'),
      svgEl('text', { x: x(-40), y: 64, 'text-anchor': 'middle' }, '−40 %'),
      svgEl('text', { x: x(50), y: 64, 'text-anchor': 'middle' }, '+50 %'),
      ...(min < 0 ? [svgEl('rect', { x: x(min), y: 18, width: x(0) - x(min), height: 18, rx: 4, fill: 'var(--danger)' })] : []),
      svgEl('rect', { x: x(Math.max(min, 0)), y: 18, width: x(max) - x(Math.max(min, 0)), height: 18, rx: 4, fill: 'var(--accent)' }),
      svgEl('circle', { cx: x(avg), cy: 27, r: 5, fill: 'var(--bg)', stroke: 'var(--ink)', 'stroke-width': 2 }),
    );
    $('[data-stat=min]', w).textContent = fmt(min);
    $('[data-stat=avg]', w).textContent = fmt(avg);
    $('[data-stat=max]', w).textContent = fmt(max);
    $('[data-result]', w).textContent = years === 1
      ? 'Kurzfristig ist alles drin – auch dicke Verluste. Das ist Glücksspiel-Terrain.'
      : min < -1
        ? 'Verluste sind noch möglich, aber die Spanne schrumpft mit jedem Jahr. Schieb weiter!'
      : min < 0
        ? 'Fast geschafft: Selbst im schlechtesten Fall nur ein minimales Minus pro Jahr.'
        : 'Selbst im schlechtesten aller bisherigen Zeiträume warst du im Plus. Zeit ist dein Sicherheitsgurt.';
  };
  input.addEventListener('input', render);
  render();
}

// --- Kapitel 4: Sparrechner ----------------------------------------------
let calcInputs;
let calcRender = () => {};
export const getCalcValues = () => calcInputs
  ? { monthly: +calcInputs.monthly.value, years: +calcInputs.years.value, ratePa: +calcInputs.rate.value / 100 }
  : { monthly: 200, years: 20, ratePa: 0.07 };
export function setCalcMonthly(n) { if (calcInputs) { calcInputs.monthly.value = n; calcRender(); } }

function calc(w) {
  calcInputs = { monthly: $('[data-in=monthly]', w), years: $('[data-in=years]', w), rate: $('[data-in=rate]', w) };
  const svg = $('[data-chart]', w);
  const W = 320, H = 180, P = { l: 4, r: 4, t: 18, b: 20 };

  calcRender = () => {
    const v = getCalcValues();
    $('[data-out=monthly]', w).textContent = eur(v.monthly);
    $('[data-out=years]', w).textContent = `${v.years} ${v.years === 1 ? 'Jahr' : 'Jahre'}`;
    $('[data-out=rate]', w).textContent = pct(v.ratePa * 100, 1);
    calcInputs.monthly.setAttribute('aria-valuetext', `${eur(v.monthly)} im Monat`);
    calcInputs.years.setAttribute('aria-valuetext', `${v.years} ${v.years === 1 ? 'Jahr' : 'Jahre'}`);
    calcInputs.rate.setAttribute('aria-valuetext', `${pct(v.ratePa * 100, 1)} pro Jahr`);

    const main = savingsPlan(v);
    const lo = savingsPlan({ ...v, ratePa: 0.04 });
    const hi = savingsPlan({ ...v, ratePa: 0.09 });
    const max = Math.max(hi.total, main.total, 1);
    const x = (yr) => P.l + (yr / v.years) * (W - P.l - P.r);
    const y = (val) => P.t + (1 - val / max) * (H - P.t - P.b);
    const area = (key) => `${x(0)},${y(0)} ${main.series.map((s) => `${x(s.year)},${y(s[key])}`).join(' ')} ${x(v.years)},${y(0)}`;
    const line = (plan) => plan.series.map((s) => `${x(s.year)},${y(s.total)}`).join(' ');

    svg.replaceChildren(
      svgEl('polygon', { points: area('total'), fill: 'var(--accent)' }),
      svgEl('polygon', { points: area('paidIn'), fill: 'var(--paid)' }),
      svgEl('polyline', { points: line(lo), fill: 'none', stroke: 'var(--band)', 'stroke-opacity': .6, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }),
      svgEl('polyline', { points: line(hi), fill: 'none', stroke: 'var(--band)', 'stroke-opacity': .6, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }),
      // 9-%-Beschriftung weicht nach unten aus, wenn sie den Endbetrag überdecken würde
      svgEl('text', { x: W - P.r, y: Math.abs(y(hi.total) - y(main.total)) < 16 ? y(hi.total) + 14 : y(hi.total) - 5, 'text-anchor': 'end' }, `9 %: ${eur(hi.total)}`),
      svgEl('circle', { cx: x(v.years), cy: y(main.total), r: 3.5, fill: 'var(--accent)', stroke: 'var(--surface)', 'stroke-width': 1.5 }),
      svgEl('text', { x: x(v.years) - 6, y: y(main.total) + 4, 'text-anchor': 'end', class: 'chart-strong' }, eur(main.total)),
      svgEl('text', { x: x(v.years) - 6, y: y(main.paidIn) + 12, 'text-anchor': 'end', class: 'chart-on-fill' }, eur(main.paidIn)),
      svgEl('text', { x: P.l, y: H - 5 }, 'heute'),
      svgEl('text', { x: W - P.r, y: H - 5, 'text-anchor': 'end' }, `in ${v.years} J.`),
    );

    svg.setAttribute('aria-label', `Nach ${v.years} Jahren: ${eur(main.total)}, davon ${eur(main.paidIn)} selbst eingezahlt. Spanne bei 4 bis 9 Prozent: ${eur(lo.total)} bis ${eur(hi.total)}.`);
    $('[data-stat=total]', w).textContent = eur(main.total);
    $('[data-stat=paid]', w).textContent = eur(main.paidIn);
    $('[data-stat=gains]', w).textContent = eur(main.gains);
    const share = main.total > 0 ? (main.gains / main.total) * 100 : 0;
    let msg = `${pct(share)} deines Endbetrags sind Kursgewinne – Geld, das für dich gearbeitet hat.`;
    if (v.years > 10) {
      const late = savingsPlan({ ...v, years: v.years - 10 });
      msg += ` Fängst du 10 Jahre später an, hast du am Ende ${eur(main.total - late.total)} weniger.`;
    }
    if (v.ratePa > 0.09) msg += ' Achtung: Mehr als 9 % pro Jahr sind historisch die Ausnahme, nicht die Regel.';
    $('[data-result]', w).textContent = msg;
  };
  Object.values(calcInputs).forEach((i) => i.addEventListener('input', calcRender));
  calcRender();
}

// --- Kapitel 6: Flip-Karten ----------------------------------------------
function flips() {
  $$('.flip').forEach((b) => {
    const sync = () => {
      const on = b.getAttribute('aria-pressed') === 'true';
      $('.flip-front', b).setAttribute('aria-hidden', on);
      $('.flip-back', b).setAttribute('aria-hidden', !on);
    };
    b.addEventListener('click', () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); sync(); });
    sync();
  });
}

// --- Kapitel 8: Tabs -----------------------------------------------------
function tabs(w) {
  const tabsEls = $$('[role=tab]', w);
  const select = (t) => {
    tabsEls.forEach((o) => {
      const on = o === t;
      o.setAttribute('aria-selected', on);
      o.tabIndex = on ? 0 : -1;
      document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabsEls.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabsEls[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabsEls.length) % tabsEls.length];
      select(n); n.focus();
    });
  });
}

// --- Kapitel 9: AV-Zulagen -----------------------------------------------
function av(w) {
  const m = $('[data-in=monthly]', w), k = $('[data-in=kids]', w), u = $('[data-in=under25]', w);
  const render = () => {
    const annual = +m.value * 12;
    const z = avSubsidy({ annual, kids: +k.value, under25: u.checked });
    $('[data-out=monthly]', w).textContent = eur(+m.value);
    $('[data-out=kids]', w).textContent = k.value;
    m.setAttribute('aria-valuetext', `${eur(+m.value)} im Monat`);
    k.setAttribute('aria-valuetext', `${k.value} ${+k.value === 1 ? 'Kind' : 'Kinder'}`);
    $('[data-stat=base]', w).textContent = eur(z.base);
    $('[data-stat=kids]', w).textContent = eur(z.kids);
    $('[data-stat=starter]', w).textContent = eur(z.starter);
    const yearly = z.base + z.kids;
    $('[data-result]', w).textContent = !z.eligible
      ? 'Unter 10 € im Monat (120 € im Jahr) gibt es leider keine Zulage.'
      : `Der Staat legt ${eur(yearly)} pro Jahr dazu${z.starter ? ` (plus einmalig ${eur(z.starter)})` : ''}. Das sind ${pct((yearly / annual) * 100)} auf deine ${eur(annual)} – bevor dein ETF auch nur einen Cent Rendite gemacht hat.`;
  };
  [m, k, u].forEach((i) => i.addEventListener('input', render));
  render();
}

const WIDGETS = { inflation, basket, crash, horizon, calc, tabs, av };
export function initWidgets() {
  $$('[data-widget]').forEach((w) => WIDGETS[w.dataset.widget]?.(w));
  flips();
}
