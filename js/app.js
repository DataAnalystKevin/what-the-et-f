import config from '../config.js';
import { savingsPlan, buildSummaryText } from './calc.js';
import { initWidgets, getCalcValues, setCalcMonthly } from './widgets.js';

const KEY = 'wtetf:v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* privat/blockiert: Seite läuft ohne Fortschritt */ } };

const state = { answers: null, visited: [], steps: {}, ...load() };
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const chapters = $$('.chapter');
const pager = $('.pager');
const toc = $('#toc');
const menuBtn = $('.menu-btn');
let current = 0;

const isOptional = (i) => chapters[i].dataset.optional === 'true';

const PERSONAL = {
  worry: {
    verlust: 'Du hast Sorge, Geld zu verlieren – völlig normal. Kapitel 3 („Und wenn’s crasht?“) ist genau für dich gemacht.',
    kompliziert: 'Klingt kompliziert? Versprochen: Am Ende ist es ein ETF und ein Sparplan. Kapitel 5 zeigt, wie einfach das ist.',
    zeit: 'Keine Zeit? Perfekt – ETF-Sparen kostet dich einmal eine Stunde und danach praktisch nichts mehr. Die 4 Schritte stehen in Kapitel 10.',
    geld: 'Zu wenig Geld? Schon 25 € im Monat machen einen Unterschied. Der Rechner in Kapitel 4 startet deshalb mit 25 €.',
  },
  level: { depot: 'Du hast schon ein Depot – die Grundlagen in Kapitel 1 und 2 sind für dich optional.' },
  goal: {
    kinder: 'Weil du für deine Kinder sparen willst, gibt’s Kapitel 8 extra für dich.',
    rente: 'Für die Rente lohnt sich besonders Kapitel 9 – das neue Altersvorsorgedepot.',
  },
};

function applyPersonalization(a) {
  if (!a) return;
  chapters.forEach((c) => delete c.dataset.optional);
  if (a.tour !== 'voll' && a.level === 'depot') [1, 2].forEach((i) => (chapters[i].dataset.optional = 'true'));
  if (a.tour !== 'voll' && a.goal !== 'kinder') chapters[8].dataset.optional = 'true';
  if (a.worry === 'geld') setCalcMonthly(25);

  const box = $('[data-personal]');
  const levelNote = a.tour === 'voll' ? 'Volle Tour gebucht: Du bekommst alle 10 Kapitel, nichts wird übersprungen.' : PERSONAL.level[a.level];
  box.replaceChildren(...[levelNote, PERSONAL.goal[a.goal], PERSONAL.worry[a.worry]]
    .filter(Boolean).map((t) => Object.assign(document.createElement('p'), { textContent: t })));
  box.hidden = false;
  // Persönlicher Hinweis steht oben im ersten Kapitel, das für diese Person nicht optional ist.
  const first = chapters.findIndex((c, i) => i > 0 && !isOptional(i));
  chapters[first].prepend(box);
  renderToc();
}

function renderToc() {
  $('ol', toc).replaceChildren(...chapters.map((c, i) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${c.id}`;
    a.innerHTML = `<span class="tick">${state.visited.includes(i) ? '✓' : i}</span><span></span>${isOptional(i) ? '<span class="opt">optional</span>' : ''}`;
    a.children[1].textContent = c.dataset.title;
    if (i === current) a.setAttribute('aria-current', 'step');
    li.append(a);
    return li;
  }));
}

function renderProgress() {
  const n = chapters.length - 1;
  const done = current; // Position, nicht Anzahl besuchter Kapitel – geht beim Zurückblättern mit zurück
  const pts = ['0,9'];
  for (let k = 1; k <= done; k++) pts.push(`${(k / n) * 100},${(9 - (k / n) * 8 + (k % 2 ? 0.8 : -0.4)).toFixed(2)}`);
  $('.progress-line').setAttribute('points', pts.join(' '));
  $('.progress').setAttribute('aria-valuenow', Math.round((done / n) * 100));
  $('[data-count]').textContent = `${done}/${n}`;
}

function nextIndex(from, dir) {
  let i = from + dir;
  while (i > 0 && i < chapters.length - 1 && isOptional(i)) i += dir;
  return i;
}

function renderPager() {
  pager.hidden = current === 0;
  const prev = $('[data-prev]', pager);
  const next = $('[data-next]', pager);
  prev.disabled = current === 0;
  const n = nextIndex(current, 1);
  next.hidden = n >= chapters.length;
  if (n < chapters.length) next.textContent = `Weiter: ${chapters[n].dataset.title} →`;
  $('.skip-link', pager)?.remove();
  if (n > current + 1) {
    const s = document.createElement('button');
    s.type = 'button';
    s.className = 'link-btn skip-link';
    s.textContent = `Optional für dich: ${chapters[current + 1].dataset.title} ansehen`;
    s.onclick = () => go(current + 1);
    pager.append(s);
  }
}

function go(i, { scroll = true, push = true } = {}) {
  current = Math.max(0, Math.min(chapters.length - 1, i));
  chapters.forEach((c, k) => c.classList.toggle('active', k === current));
  if (!state.visited.includes(current)) state.visited.push(current);
  save();
  // Eintrag im Browserverlauf, damit die Zurück-Geste am Handy das vorige Kapitel zeigt statt die Seite zu verlassen.
  if (location.hash !== `#${chapters[current].id}`) history[push ? 'pushState' : 'replaceState'](null, '', `#${chapters[current].id}`);
  if (current === chapters.length - 1) renderSummary();
  renderPager(); renderToc(); renderProgress();
  if (scroll) window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function renderSummary() {
  const v = getCalcValues();
  const { total, paidIn } = savingsPlan(v);
  const text = buildSummaryText({ ...v, total, paidIn });
  $('[data-summary]').textContent = text;
  $('[data-mail]').href = `mailto:?subject=${encodeURIComponent('Meine ETF-Zusammenfassung – What the (ET)F?')}&body=${encodeURIComponent(`${text}\n\n${location.origin}${location.pathname}`)}`;
}

function initLinks() {
  const list = config.brokers.filter((b) => b.url);
  if (list.length) {
    const wrap = $('[data-brokers]');
    wrap.innerHTML = '<p class="fineprint">Affiliate-Links: Wenn du darüber ein Depot eröffnest, bekomme ich ggf. eine kleine Prämie – für dich ändert sich nichts, oft gibt’s sogar einen Bonus.</p>';
    list.forEach((b) => {
      const a = Object.assign(document.createElement('a'), { className: 'broker', href: b.url, target: '_blank', rel: 'noopener sponsored' });
      a.innerHTML = '<strong></strong> <span>(Affiliate-Link)</span><small></small>';
      a.querySelector('strong').textContent = b.name;
      a.querySelector('small').textContent = b.text;
      wrap.append(a);
    });
    wrap.hidden = false;
  }
  if (config.kofi) { $('[data-kofi-link]').href = config.kofi; $('[data-kofi]').hidden = false; }
  $$('[data-stand]').forEach((b) => (b.textContent = `Stand: ${config.stand}`));
}

function initCheckin() {
  const form = $('#checkin');
  // Volle Tour: Wissensstand filtert nur Kapitel → ausblenden; Ziel/Sorge bleiben als freiwillige Tipps.
  const syncTour = () => {
    const full = form.tour.value === 'voll';
    $('[data-filter]', form).hidden = full;
    $$('[name=level], [name=goal], [name=worry]', form).forEach((r) => (r.required = !full));
    $$('.opt-hint', form).forEach((h) => (h.hidden = !full));
    syncButton();
  };
  // Ausgegraut, bis alle Pflichtangaben gemacht sind
  const syncButton = () => ($('button[type=submit]', form).disabled = !form.checkValidity());
  form.addEventListener('change', syncButton);
  if (state.answers) {
    Object.entries(state.answers).forEach(([k, v]) => { const el = v && form.querySelector(`[name=${k}][value=${v}]`); if (el) el.checked = true; });
    form.disclaimer.checked = true;
  }
  $$('[name=tour]', form).forEach((r) => r.addEventListener('change', syncTour));
  syncTour();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const tour = d.get('tour');
    state.answers = { tour, level: tour === 'voll' ? null : d.get('level'), goal: d.get('goal'), worry: d.get('worry') };
    applyPersonalization(state.answers);
    go(nextIndex(0, 1));
  });
}

function initChecklist() {
  $$('[data-checklist] input').forEach((cb) => {
    cb.checked = !!state.steps[cb.dataset.step];
    cb.addEventListener('change', () => { state.steps[cb.dataset.step] = cb.checked; save(); });
  });
}

function initChrome() {
  menuBtn.addEventListener('click', () => {
    const open = toc.hidden;
    toc.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open);
  });
  toc.addEventListener('click', (e) => { if (e.target.closest('a')) { toc.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !toc.hidden) { toc.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); } });
  // Zurück geht immer genau ein Kapitel zurück; nur Weiter überspringt optionale Kapitel.
  $('[data-prev]').addEventListener('click', () => go(current - 1));
  $('[data-next]').addEventListener('click', () => go(nextIndex(current, 1)));
  $('[data-print]').addEventListener('click', () => window.print());
  $$('[data-reset]').forEach((b) => b.addEventListener('click', () => {
    if (!confirm('Fortschritt und Antworten auf diesem Gerät löschen?')) return;
    try { localStorage.removeItem(KEY); } catch { /* egal */ }
    location.hash = '';
    location.reload();
  }));
  const fromHash = () => {
    const i = chapters.findIndex((c) => `#${c.id}` === location.hash);
    go(i >= 0 ? i : 0, { push: false });
  };
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('popstate', fromHash);
}

initWidgets();
initLinks();
initCheckin();
initChecklist();
initChrome();
applyPersonalization(state.answers);
const start = chapters.findIndex((c) => `#${c.id}` === location.hash);
go(start >= 0 ? start : 0, { scroll: false, push: false });
