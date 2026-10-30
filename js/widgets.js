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
// Ein Apfel im 20×20-Raster; der äußere <g> positioniert, der innere wird per CSS faulig.
const apple = (x, y, size, kind) => `<g transform="translate(${x - size / 2} ${y - size / 2}) scale(${size / 20})"><g class="apple ${kind}">
  <path class="apple-body" d="M10 6.2C8.4 4.9 3.2 4.6 2.6 9.6 2.1 14 5 18.6 7.6 18.9c1 .1 1.6-.4 2.4-.4s1.4.5 2.4.4c2.6-.3 5.5-4.9 5-9.3C16.8 4.6 11.6 4.9 10 6.2z"/>
  <path class="apple-stem" d="M10 6.4C10 4.6 10.6 3 11.6 1.8"/>
  <path class="apple-leaf" d="M10.8 3.6c1.2-1.6 3.4-2 4.8-1.4-.8 1.6-3 2.4-4.8 1.4z"/>
  <ellipse class="apple-shine" cx="6.2" cy="10" rx="1.1" ry="2" transform="rotate(20 6.2 10)"/>
  <circle class="apple-spot" cx="12.4" cy="12.6" r="1.9"/><circle class="apple-spot" cx="8" cy="15.4" r="1.2"/>
</g></g>`;

// Korb in leichter Aufsicht: Öffnung als Ellipse, davor die Korbwand.
const RIM = { cx: 130, cy: 100, rx: 115, ry: 32 };
const BOTTOM = { cx: 130, cy: 172, rx: 82, ry: 20 };
const ring = (t) => ({ rx: RIM.rx + (BOTTOM.rx - RIM.rx) * t, cy: RIM.cy + (BOTTOM.cy - RIM.cy) * t, ry: RIM.ry + (BOTTOM.ry - RIM.ry) * t });

function wicker() {
  const bands = [0.2, 0.4, 0.6, 0.8].map((t) => { const r = ring(t); return `M${130 - r.rx} ${r.cy}A${r.rx} ${r.ry} 0 0 0 ${130 + r.rx} ${r.cy}`; });
  const staves = Array.from({ length: 11 }, (_, k) => {
    const th = Math.PI * (k + 1) / 12;
    return `M${(130 - RIM.rx * Math.cos(th)).toFixed(1)} ${(RIM.cy + RIM.ry * Math.sin(th)).toFixed(1)}L${(130 - BOTTOM.rx * Math.cos(th)).toFixed(1)} ${(BOTTOM.cy + BOTTOM.ry * Math.sin(th)).toFixed(1)}`;
  });
  return { weave: [...bands, ...staves].join(''), front: `M${130 - RIM.rx} ${RIM.cy}L${130 - BOTTOM.rx} ${BOTTOM.cy}A${BOTTOM.rx} ${BOTTOM.ry} 0 0 0 ${130 + BOTTOM.rx} ${BOTTOM.cy}L${130 + RIM.rx} ${RIM.cy}A${RIM.rx} ${RIM.ry} 0 0 1 ${130 - RIM.rx} ${RIM.cy}Z` };
}

// 14 Äpfel, dicht gestapelt; von hinten nach vorn gezeichnet, damit vordere die hinteren überdecken.
const BASKET_APPLES = [
  [128, 52, 40, 'a2'],
  [86, 66, 42, 'a0'], [126, 70, 42, 'a1'], [168, 66, 42, 'a0'],
  [52, 86, 44, 'a1'], [92, 90, 46, 'a2'], [134, 92, 46, 'a0'], [176, 88, 46, 'a2'], [212, 86, 44, 'a1'],
  [64, 104, 48, 'a0'], [158, 104, 50, 'a1'], [200, 102, 48, 'a0'],
  [112, 107, 52, 'rot'], // der spätere faulige Apfel: vorn und mittig, damit man ihn sofort findet
].sort((p, q) => p[1] - q[1]);

// Füllung unter den sichtbaren Äpfeln: viele kleinere Äpfel im Schatten, damit der Korb voll wirkt.
const FILL = { cx: 130, cy: 106, rx: 106, ry: 24 };
function shadedApples() {
  const out = [];
  for (let r = 0; r < 6; r++) {
    for (let x = 18 + (r % 2) * 14; x < 250; x += 28) out.push(apple(x, 84 + r * 9, 32, `a${(out.length * 5) % 3}`));
  }
  return out.join('');
}

function basket(w) {
  const single = $('[data-single]', w);
  const fruit = $('[data-basket]', w);
  single.innerHTML = apple(60, 62, 92, 'a1');
  const { weave, front } = wicker();
  fruit.innerHTML = `
    <ellipse class="basket-shadow" cx="130" cy="186" rx="104" ry="12"/>
    <ellipse class="basket-inside" cx="${RIM.cx}" cy="${RIM.cy}" rx="${RIM.rx}" ry="${RIM.ry}"/>
    <path class="wicker-rim" d="M${130 - RIM.rx} ${RIM.cy}A${RIM.rx} ${RIM.ry} 0 0 1 ${130 + RIM.rx} ${RIM.cy}"/>
    <clipPath id="basket-fill"><ellipse cx="${FILL.cx}" cy="${FILL.cy}" rx="${FILL.rx}" ry="${FILL.ry}"/></clipPath>
    <g clip-path="url(#basket-fill)">${shadedApples()}<ellipse class="basket-depth" cx="${FILL.cx}" cy="${FILL.cy}" rx="${FILL.rx}" ry="${FILL.ry}"/></g>
    ${BASKET_APPLES.map(([x, y, s, k]) => apple(x, y, s, k === 'rot' ? 'a1 will-rot' : k)).join('')}
    <path class="wicker" d="${front}"/>
    <path class="wicker-weave" d="${weave}"/>
    <path class="wicker-rim" d="M${130 + RIM.rx} ${RIM.cy}A${RIM.rx} ${RIM.ry} 0 0 1 ${130 - RIM.rx} ${RIM.cy}"/>`;
  const rotten = $('.will-rot', fruit);
  const btn = $('[data-crash]', w);
  let crashed = false;
  btn.addEventListener('click', () => {
    crashed = !crashed;
    single.querySelector('.apple').classList.toggle('rotten', crashed);
    rotten.classList.toggle('rotten', crashed);
    $('[data-single-value]', w).textContent = crashed ? '0 €' : '10.000 €';
    $('[data-basket-value]', w).textContent = crashed ? '9.992 €' : '10.000 €';
    // Ergebnis je Szenario direkt unter dem Betrag – über dem Button, damit man es nicht sucht
    $('[data-single-result]', w).innerHTML = crashed ? '<strong>−100&nbsp;%</strong> Dein einziger Apfel ist faulig. Das Geld ist weg.' : '';
    $('[data-basket-result]', w).innerHTML = crashed ? '<strong>nur −0,08&nbsp;%</strong> Die Firma war eine von rund 1.250. Ein fauliger Apfel fällt im Korb kaum auf.' : '';
    btn.textContent = crashed ? 'Nochmal von vorn' : 'Probier’s aus: Lass eine Firma pleitegehen\u00a0→';
    btn.classList.toggle('btn-primary', !crashed); // nach dem Klick zurückhaltend – die Aktion ist erledigt
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
      svgEl('text', { x: x(2.75) - 8, y: y(72) + 18, class: 'chart-halo' }, 'März 2020: −34 %'));
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
    const again = Object.assign(document.createElement('button'), { type: 'button', className: 'btn btn-block', textContent: 'Nochmal von vorn' });
    again.onclick = () => { draw(); step.hidden = false; result.textContent = ''; again.remove(); $('[data-choice]', w).focus(); };
    result.after(again); // als eigener Button unter dem Ergebnis, wie beim Obstkorb
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
  const fmt = (v) => `${v > 0 ? '+' : ''}${v.toLocaleString('de-DE', { minimumFractionDigits: 1 }).replace('-', '−')} %`; // echtes Minus
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
    const band = $('[data-band]', w).checked;
    const max = Math.max(band ? hi.total : 0, main.total, 1);
    const x = (yr) => P.l + (yr / v.years) * (W - P.l - P.r);
    const y = (val) => P.t + (1 - val / max) * (H - P.t - P.b);
    const area = (key) => `${x(0)},${y(0)} ${main.series.map((s) => `${x(s.year)},${y(s[key])}`).join(' ')} ${x(v.years)},${y(0)}`;
    const line = (plan) => plan.series.map((s) => `${x(s.year)},${y(s.total)}`).join(' ');

    svg.replaceChildren(
      svgEl('polygon', { points: area('total'), fill: 'var(--accent)' }),
      svgEl('polygon', { points: area('paidIn'), fill: 'var(--paid)' }),
      ...(band ? [
        svgEl('polyline', { points: line(lo), fill: 'none', stroke: 'var(--band)', 'stroke-opacity': .6, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }),
        svgEl('polyline', { points: line(hi), fill: 'none', stroke: 'var(--band)', 'stroke-opacity': .6, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }),
        // 9-%-Beschriftung weicht nach unten aus, wenn sie den Endbetrag überdecken würde
        svgEl('text', { x: W - P.r, y: Math.abs(y(hi.total) - y(main.total)) < 16 ? y(hi.total) + 14 : y(hi.total) - 5, 'text-anchor': 'end' }, `9 %: ${eur(hi.total)}`),
      ] : []),
      svgEl('circle', { cx: x(v.years), cy: y(main.total), r: 3.5, fill: 'var(--accent)', stroke: 'var(--surface)', 'stroke-width': 1.5 }),
      svgEl('text', { x: x(v.years) - 6, y: y(main.total) + 4, 'text-anchor': 'end', class: 'chart-strong' }, eur(main.total)),
      svgEl('text', { x: x(v.years) - 6, y: y(main.paidIn) + 12, 'text-anchor': 'end', class: 'chart-on-fill' }, eur(main.paidIn)),
      svgEl('text', { x: P.l, y: H - 5 }, 'heute'),
      svgEl('text', { x: W - P.r, y: H - 5, 'text-anchor': 'end' }, `in ${v.years} J.`),
    );

    svg.setAttribute('aria-label', `Nach ${v.years} Jahren: ${eur(main.total)}, davon ${eur(main.paidIn)} selbst eingezahlt. Spanne bei 4 bis 9 Prozent: ${eur(lo.total)} bis ${eur(hi.total)}.`);
    $('[data-headline]', w).textContent = `Aus ${eur(main.paidIn)} Einzahlung werden ca. ${eur(main.total)}.`;
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
  [...Object.values(calcInputs), $('[data-band]', w)].forEach((i) => i.addEventListener('input', calcRender));
  calcRender();
}

// --- Kapitel 6: Sorgen-Check ---------------------------------------------
function worries(w) {
  const cards = $$('.worry', w);
  const seen = new Set(); // einmal aufgedeckt zählt als angesehen, auch wenn wieder zugeklappt
  const aha = w.parentElement.querySelector('.aha'); // erscheint erst, wenn alle Sorgen angesehen sind
  if (aha) aha.hidden = true;
  const sync = () => {
    // Die Live-Region sagt auch an, dass das Fazit erschienen ist
    $('[data-worries-count]', w).textContent = `${seen.size} von ${cards.length} Sorgen angesehen${seen.size === cards.length ? ' – darunter steht das Fazit' : ''}`;
    $$('.worry-bar i', w).forEach((seg, i) => seg.classList.toggle('on', i < seen.size));
    const done = $('[data-worries-done]', w);
    if (seen.size === cards.length && done.hidden) { done.hidden = false; done.classList.add('rise'); }
    if (aha) aha.hidden = seen.size < cards.length;
  };
  cards.forEach((card, i) => {
    const btn = $('.worry-btn', card);
    const answer = $('.worry-a', card);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open);
      answer.hidden = !open;
      card.classList.toggle('open', open);
      if (open) { seen.add(i); card.classList.add('resolved'); answer.classList.remove('rise'); void answer.offsetWidth; answer.classList.add('rise'); }
      sync();
    });
  });
  sync();
}

// --- Kapitel 7: Flip-Karten----------------------------------------------
// Der Name der Karte bleibt die Frage; die Antwort wird erst nach dem Aufdecken als Beschreibung vorgelesen.
function flips() {
  $$('.flip').forEach((b, i) => {
    const back = $('.flip-back', b);
    back.id = `flip-back-${i + 1}`;
    b.setAttribute('aria-label', $('.flip-back-q', b).textContent);
    $('.flip-front', b).setAttribute('aria-hidden', 'true');
    back.setAttribute('aria-hidden', 'true');
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', on);
      if (on) b.setAttribute('aria-describedby', back.id); else b.removeAttribute('aria-describedby');
    });
  });
}

// --- Kapitel 9: Tabs -----------------------------------------------------
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
      const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabsEls.length - 1 }[e.key];
      if (k === undefined) return;
      e.preventDefault();
      const n = tabsEls[(k + tabsEls.length) % tabsEls.length];
      select(n); n.focus();
    });
  });
}

// --- Kapitel 10: AV-Zulagen-----------------------------------------------
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

const WIDGETS = { inflation, basket, crash, horizon, calc, worries, tabs, av };
// Diagramm-Text in fester Größe: --u = viewBox-Breite / gerenderte Breite (greift auch, sobald ein Kapitel sichtbar wird)
const chartScale = new ResizeObserver((entries) => entries.forEach((e) => {
  const vb = e.target.viewBox.baseVal.width;
  if (e.contentRect.width) e.target.style.setProperty('--u', (vb / e.contentRect.width).toFixed(3));
}));

export function initWidgets() {
  $$('svg.chart').forEach((svg) => chartScale.observe(svg));
  $$('[data-widget]').forEach((w) => WIDGETS[w.dataset.widget]?.(w));
  flips();
}
