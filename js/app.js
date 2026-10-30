import config from '../config.js';
import { savingsPlan, buildSummaryText } from './calc.js';
import { initWidgets, getCalcValues, setCalcMonthly } from './widgets.js';

const KEY = 'wtetf:v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* privat/blockiert: Seite läuft ohne Fortschritt */ } };

const state = { answers: null, visited: [], steps: {}, ...load() };
state.consent ??= !!state.answers; // Wer den Check-in gemacht hat, hat den Hinweis schon bestätigt
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
    zeit: 'Keine Zeit? Perfekt – ETF-Sparen ist einmal kurz eingerichtet und kostet dich danach praktisch keine Zeit mehr. Die 3 Schritte warten am Ende auf dich.',
    geld: 'Zu wenig Geld? Schon 25 € im Monat machen einen Unterschied. Der Rechner in Kapitel 4 startet deshalb mit 25 €.',
    nichts: 'Du willst dein Wissen auffrischen? Sehr gut – blätter ruhig zügig durch. Auf der letzten Seite steht alles noch mal kompakt zusammengefasst.',
  },
  level: { depot: 'Du hast schon ein Depot – die Grundlagen in Kapitel 1 und 2 sind für dich optional.' },
  goal: {
    kinder: 'Weil du für deine Kinder sparen willst, gibt’s Kapitel 9 extra für dich.',
    rente: 'Für die Rente lohnen sich besonders Kapitel 10 bis 12 – das neue Altersvorsorgedepot, der Vergleich mit dem freien Depot und wo du es am besten abschließt.',
  },
};

// Ziele sind Mehrfachauswahl; ältere Speicherstände haben noch einen einzelnen Wert
const goalsOf = (a) => [].concat(a.goal ?? []);

function applyPersonalization(a) {
  if (!a) return;
  const goals = goalsOf(a);
  chapters.forEach((c) => delete c.dataset.optional);
  if (a.tour !== 'voll' && a.level === 'depot') [1, 2].forEach((i) => (chapters[i].dataset.optional = 'true'));
  if (a.tour !== 'voll' && !goals.includes('kinder')) $('#kapitel-9').dataset.optional = 'true';
  if (a.worry === 'geld') setCalcMonthly(25);

  const box = $('[data-personal]');
  const levelNote = a.tour === 'voll' ? 'Volle Tour: alle 12 Kapitel, nichts wird übersprungen.' : PERSONAL.level[a.level];
  box.replaceChildren(...[levelNote, ...goals.map((g) => PERSONAL.goal[g]), PERSONAL.worry[a.worry]]
    .filter(Boolean).map((t) => Object.assign(document.createElement('p'), { textContent: t })));
  box.hidden = false;
  // Persönlicher Hinweis steht oben im ersten Kapitel, das für diese Person nicht optional ist.
  const first = chapters.findIndex((c, i) => i > 0 && !isOptional(i));
  // Unter dem Einleitungssatz statt davor, damit die Kapitelüberschrift oben bleibt
  const lead = $('.lead', chapters[first]);
  if (lead) lead.after(box); else chapters[first].prepend(box);
  renderToc();
}

function renderToc() {
  $('ol', toc).replaceChildren(...chapters.map((c, i) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${c.id}`;
    a.innerHTML = `<span class="tick">${state.visited.includes(i) ? '✓' : c.classList.contains('outro') ? '→' : i}</span><span></span>${isOptional(i) ? '<span class="opt">optional</span>' : ''}`;
    a.children[1].textContent = c.dataset.title;
    if (i === current) a.setAttribute('aria-current', 'step');
    li.append(a);
    return li;
  }));
}

function renderProgress() {
  const n = chapters.length - 2; // Lektionen ohne Check-in und Abschlussseite
  const done = Math.min(current, n); // Position, nicht Anzahl besuchter Kapitel – geht beim Zurückblättern mit zurück
  const outro = current > n;
  const pts = ['0,9'];
  for (let k = 1; k <= done; k++) pts.push(`${(k / n) * 100},${(9 - (k / n) * 8 + (k % 2 ? 0.8 : -0.4)).toFixed(2)}`);
  $('.progress-line').setAttribute('points', pts.join(' '));
  $('.progress').setAttribute('aria-valuenow', Math.round((done / n) * 100));
  $('.progress').setAttribute('aria-valuetext', outro ? 'Alle Kapitel gelesen – nächste Schritte' : done ? `Kapitel ${done} von ${n}` : 'Check-in');
  $('[data-count]').textContent = outro ? 'fertig' : `${done}/${n}`;
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
  if (n < chapters.length) { next.textContent = 'Weiter\u00a0→'; next.append(Object.assign(document.createElement('small'), { textContent: chapters[n].dataset.title })); }
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

function go(i, { scroll = true, push = true, focus = true } = {}) {
  current = Math.max(0, Math.min(chapters.length - 1, i));
  chapters.forEach((c, k) => c.classList.toggle('active', k === current));
  // Ohne bestätigten Hinweis (z. B. geteilter Direktlink) erst den Disclaimer zeigen
  const gate = current > 0 && !state.consent;
  $('main').classList.toggle('needs-consent', gate);
  $('[data-consent]').hidden = !gate;
  if (!gate && !state.visited.includes(current)) state.visited.push(current);
  save();
  // Eintrag im Browserverlauf, damit die Zurück-Geste am Handy das vorige Kapitel zeigt statt die Seite zu verlassen.
  if (location.hash !== `#${chapters[current].id}`) history[push ? 'pushState' : 'replaceState'](null, '', `#${chapters[current].id}`);
  if (current === chapters.length - 1) renderSummary();
  // Auf der Abschlussseite steht die Ko-fi-Karte schon im Inhalt – im Footer dort nicht doppeln
  $('[data-kofi-foot]').hidden = !config.kofi || current === chapters.length - 1;
  renderPager(); renderToc(); renderProgress();
  if (gate) pager.hidden = true;
  if (scroll) window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  // Fokus auf die neue Überschrift, damit Tastatur und Screenreader mitkommen
  if (focus) (gate ? $('#consent-title') : $('h1, h2', chapters[current]))?.focus({ preventScroll: true });
}

function renderSummary() {
  const v = getCalcValues();
  const { total, paidIn } = savingsPlan(v);
  const text = buildSummaryText({ ...v, total, paidIn });
  $('[data-summary]').textContent = text;
  $('[data-mail]').href = `mailto:?subject=${encodeURIComponent('Meine ETF-Zusammenfassung – What the (ET)F?')}&body=${encodeURIComponent(`${text}\n\n${location.origin}${location.pathname}`)}`;
}

function initLinks() {
  if (config.kofi) { $$('[data-kofi-link]').forEach((a) => (a.href = config.kofi)); $('[data-kofi]').hidden = false; }
  $$('[data-stand]').forEach((b) => (b.textContent = `Stand: ${config.stand}`));
}

function initCheckin() {
  const form = $('#checkin');
  const steps = $$('[data-step]', form);
  const nav = $('.checkin-nav', form);
  const full = () => form.tour.value === 'voll';
  // Entscheidungsbaum: Bei voller Tour entfällt der Wissensstand (filtert nur Kapitel).
  const path = () => steps.filter((s) => !(s.dataset.step === 'level' && full()));
  let idx = 0;

  // Checkboxen kennen kein „mindestens eine“ – darum eigene Gültigkeit am ersten Feld
  const goals = $$('[name=goal]', form);
  const goalRequired = () => !full();
  const syncGoal = () => goals[0].setCustomValidity(goalRequired() && !goals.some((g) => g.checked) ? 'Bitte wähle mindestens eine Antwort' : '');
  const syncTour = () => {
    $$('[name=level], [name=worry]', form).forEach((r) => (r.required = !full()));
    $$('.opt-hint', form).forEach((h) => (h.hidden = !full()));
    syncGoal();
  };

  const render = () => {
    const list = path();
    idx = Math.max(0, Math.min(idx, list.length - 1));
    const cur = list[idx];
    steps.forEach((s) => (s.hidden = s !== cur));
    const info = $('[data-stepinfo]', form);
    info.hidden = cur.dataset.step === 'final';
    info.textContent = idx === 0 ? 'Frage 1' : `Frage ${idx + 1} von ${list.length - 1}`;
    const answered = !!$('input:checked', cur);
    const required = cur.dataset.step === 'goal' ? goalRequired() : !!$('input:required', cur);
    const optional = cur.tagName === 'FIELDSET' && !required;
    nav.hidden = false;
    $('[data-step-back]', nav).hidden = idx === 0;
    $('[data-step-skip]', nav).hidden = !(optional && !answered);
    $('[data-step-next]', nav).hidden = !(cur.tagName === 'FIELDSET' && answered);
  };
  const focusStep = () => $('legend, h2', path()[idx])?.focus({ preventScroll: true });
  const step = (d) => {
    form.classList.remove('tried'); // Rot nur direkt nach einem gescheiterten Start
    $('[data-error]', form).hidden = true;
    $('[data-error]', form).textContent = '';
    idx += d; render(); form.scrollIntoView({ block: 'nearest' }); focusStep();
  };
  // Automatisch weiter nur nach Tippen/Klicken – Pfeiltasten wählen in Ruhe aus
  let viaPointer = false;
  form.addEventListener('pointerdown', () => (viaPointer = true));
  form.addEventListener('keydown', () => (viaPointer = false));

  // Rot erst nach einem Startversuch mit fehlenden Pflichtangaben
  const err = $('[data-error]', form);
  const start = $('[type=submit]', form);
  // Start-Knopf zeigt ehrlich, ob der Haken fehlt (aria-disabled statt disabled, damit ein Tipp trotzdem erklärt)
  const syncStart = () => {
    const ok = form.disclaimer.checked;
    start.setAttribute('aria-disabled', String(!ok));
    $('.start-hint', form).hidden = ok;
  };
  const showErrors = () => {
    form.classList.add('tried');
    const valid = form.checkValidity();
    $$('input', form).forEach((i) => { if (i.validity.valid) { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); } else { i.setAttribute('aria-invalid', 'true'); i.setAttribute('aria-describedby', err.id); } });
    const open = $(':invalid', form);
    err.textContent = open?.name === 'disclaimer' ? 'Bitte setz noch den Haken bei „Verstanden“.' : 'Bitte wähle noch eine Antwort aus.';
    err.hidden = valid;
    return valid;
  };

  if (state.answers) {
    Object.entries(state.answers).forEach(([k, v]) => [].concat(v ?? []).forEach((val) => { const el = form.querySelector(`[name=${k}][value=${val}]`); if (el) el.checked = true; }));
    form.disclaimer.checked = true;
  }
  syncTour();
  syncStart();
  idx = state.answers ? path().length - 1 : 0;
  render();

  form.addEventListener('change', (e) => {
    if (e.target.name === 'tour') syncTour();
    syncStart();
    if (e.target.name === 'goal') syncGoal();
    if (form.classList.contains('tried')) showErrors();
    if (e.target.type === 'radio' && viaPointer) setTimeout(() => step(1), 220); // Antwort angetippt → nächste Frage
    else render();
  });
  $('[data-step-back]', nav).addEventListener('click', () => step(-1));
  $('[data-step-skip]', nav).addEventListener('click', () => step(1));
  $('[data-step-next]', nav).addEventListener('click', () => step(1));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!showErrors()) {
      const list = path();
      idx = list.findIndex((s) => $(':invalid', s));
      render();
      const cur = list[idx];
      cur.classList.remove('shake'); void cur.offsetWidth; cur.classList.add('shake');
      ($('input:invalid', cur) || $('legend, h2', cur))?.focus({ preventScroll: true }); // Fokus direkt auf die fehlende Angabe
      return;
    }
    const d = new FormData(form);
    const tour = d.get('tour');
    state.answers = { tour, level: tour === 'voll' ? null : d.get('level'), goal: d.getAll('goal'), worry: d.get('worry') };
    state.consent = true;
    applyPersonalization(state.answers);
    go(nextIndex(0, 1));
  });
}

function initShare() {
  const url = 'https://whattheetf.de/';
  const share = $('[data-share]');
  // Natives Teilen-Menü (vor allem am Handy) – nur anbieten, wo der Browser es kann
  if (navigator.share) {
    share.hidden = false;
    share.addEventListener('click', () => navigator.share({ title: 'What the (ET)F?', text: 'ETFs in 12 kurzen Kapiteln ehrlich erklärt', url }).catch(() => { /* abgebrochen */ }));
  }
  const note = $('[data-copy-note]');
  $('[data-copy-link]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); note.textContent = 'Link kopiert – du kannst ihn jetzt überall einfügen.'; }
    catch { note.textContent = `Kopieren hat nicht geklappt. Der Link lautet: ${url}`; }
  });
}

function initChecklist() {
  const boxes = $$('[data-checklist] input');
  const sync = (celebrate) => {
    const n = boxes.filter((b) => b.checked).length;
    $('[data-steps-count]').textContent = `${n} von ${boxes.length} erledigt`;
    const done = n === boxes.length;
    const depot = boxes[0].checked;
    // Schon Schritt 1 verdient Zuspruch – er ist der einzige, der Überwindung kostet
    const msg = done ? 'Geschafft. Ab jetzt arbeitet dein Geld für dich – und deine einzige Aufgabe ist, nichts zu tun.'
      : depot ? 'Stark – der schwierigste Schritt ist geschafft. Der Rest ist Routine und dauert zusammen keine halbe Stunde.' : '';
    const out = $('[data-steps-done]');
    const changed = out.textContent !== msg;
    out.textContent = msg;
    out.hidden = !msg;
    $('.steps-card').classList.toggle('complete', done);
    if (celebrate && changed && msg) { out.classList.remove('rise'); void out.offsetWidth; out.classList.add('rise'); }
  };
  boxes.forEach((cb) => {
    cb.checked = !!state.steps[cb.dataset.step];
    cb.addEventListener('change', () => { state.steps[cb.dataset.step] = cb.checked; save(); sync(true); });
  });
  sync(false);
}

function openMenu() { toc.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); }
function closeMenu() { toc.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }

// Darstellung: automatisch (System), hell oder dunkel – lokal gemerkt
const THEMES = { auto: 'Automatisch', light: 'Hell', dark: 'Dunkel' };
function setTheme(t) {
  if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  try { t === 'auto' ? localStorage.removeItem('wtetf:theme') : localStorage.setItem('wtetf:theme', t); } catch { /* egal */ }
  $$('[name=theme]').forEach((r) => (r.checked = r.value === t));
  $('[data-theme-open]').textContent = `Darstellung: ${THEMES[t]}`;
}
function initTheme() {
  const cur = () => document.documentElement.dataset.theme || 'auto';
  setTheme(cur());
  $$('[name=theme]').forEach((r) => r.addEventListener('change', () => setTheme(r.value)));
  // Footer-Link öffnet das Menü bei der Darstellungswahl – eine Stelle, ein Verhalten
  $('[data-theme-open]').addEventListener('click', () => { openMenu(); $('[name=theme]:checked').focus(); });
}

function initChrome() {
  menuBtn.addEventListener('click', () => (toc.hidden ? (openMenu(), $('a', toc)?.focus()) : closeMenu()));
  toc.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  // Schließen bei Klick daneben oder wenn der Fokus das Menü verlässt
  document.addEventListener('pointerdown', (e) => { if (!toc.hidden && !toc.contains(e.target) && !menuBtn.contains(e.target) && !e.target.closest('[data-theme-open]')) closeMenu(); });
  toc.addEventListener('focusout', (e) => { if (e.relatedTarget && !toc.contains(e.relatedTarget) && e.relatedTarget !== menuBtn) closeMenu(); });
  // PDF enthält die Zusammenfassung immer, auch wenn sie zugeklappt ist
  const peek = $('[data-summary-peek]');
  let wasOpen = false;
  window.addEventListener('beforeprint', () => { wasOpen = peek.open; peek.open = true; });
  window.addEventListener('afterprint', () => { peek.open = wasOpen; });
  $('[data-jump]').addEventListener('click', (e) => {
    e.preventDefault();
    go(chapters.length - 1, { scroll: false, focus: false });
    $('#schritte').scrollIntoView({ block: 'start' });
    $('[data-steps-count]').setAttribute('tabindex', '-1');
    $('[data-steps-count]').focus({ preventScroll: true });
  });
  $('[data-consent-ok]').addEventListener('click', () => { state.consent = true; save(); go(current, { push: false }); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !toc.hidden) { closeMenu(); menuBtn.focus(); } });
  // Zurück geht immer genau ein Kapitel zurück; nur Weiter überspringt optionale Kapitel.
  $('[data-prev]').addEventListener('click', () => go(current - 1));
  $('[data-next]').addEventListener('click', () => go(nextIndex(current, 1)));
  $('[data-print]').addEventListener('click', () => window.print());
  $$('[data-reset]').forEach((b) => b.addEventListener('click', () => {
    if (!confirm('Fortschritt und Antworten auf diesem Gerät löschen?')) return;
    // Adresse ohne hashchange zurücksetzen – sonst speichert go() die alten Antworten vor dem Neuladen wieder
    history.replaceState(null, '', location.pathname);
    try { localStorage.removeItem(KEY); } catch { /* egal */ }
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
initShare();
initChrome();
initTheme();
applyPersonalization(state.answers);
const start = chapters.findIndex((c) => `#${c.id}` === location.hash);
go(start >= 0 ? start : 0, { scroll: false, push: false, focus: false });
