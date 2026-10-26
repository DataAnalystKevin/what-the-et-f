# What the (ET)F? Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Statische, mobile-first Lern-Website, die ETF-Neulinge in 11 Kapiteln vom Check-in bis zur Depoteröffnung führt.

**Architecture:** Eine `index.html` mit allen Kapiteln als `<section>`, progressive enhancement durch ES-Module. Reine Rechenlogik in `js/calc.js` (mit `node --test` geprüft), DOM-Logik in `js/app.js` und `js/widgets.js`. Kein Build, keine Abhängigkeiten, Hosting über GitHub Pages.

**Tech Stack:** HTML, CSS (Custom Properties), Vanilla JS (ES-Module), SVG, Node ≥ 18 nur für Tests.

**Spec:** `docs/superpowers/specs/2026-10-26-what-the-etf-design.md`

## Global Constraints

- Keine externen Requests zur Laufzeit; Schriften in `fonts/` (Fraunces, Inter als woff2, OFL-Lizenz beilegen).
- Speicherung ausschließlich `localStorage`-Key `wtetf:v1`, jeder Zugriff in try/catch.
- Ab 360 px Breite ohne horizontales Scrollen; Touch-Ziele ≥ 44 px.
- Du-Form; Disclaimer-Kurzform im Footer jeder Seite: „Meine persönlichen Erfahrungen – keine Anlageberatung.“
- Zeitkritische Kapitel (7, 8, 9) tragen das Badge „Stand: Oktober 2026“.
- Fakten nur aus Spec §6, plus: Vanguard FTSE All-World TER 0,14 % (seit Sommer 2026); AV-Depot max. 6.840 €/Jahr/Vertrag, gefördert bis 1.800 €, Auszahlung frühestens 65 (oder früherer gesetzlicher Rentenbeginn), spätestens 70, 30 % Einmalentnahme, vorzeitige Entnahme → Zulagen zurück.
- Leere Links in `config.js` werden nicht gerendert.

## Review Focus

- Rechner mit Rate 0 €, Laufzeit 1 Jahr oder Rendite 0 % → endliche, plausible Werte statt NaN/Infinity (Test in Task 1).
- AV-Zulage genau an den Grenzen 119,99 / 120 / 360 / 1.800 / 6.840 € (Test in Task 1).
- `localStorage` blockiert (Safari privat) → Seite funktioniert, nur ohne Fortschritt (try/catch in Task 2).
- Sehr schmales Handy (360 px) mit langen deutschen Komposita („Sparerpauschbetrag“) → `hyphens: auto`, `lang="de"` (Task 2).
- `mailto:` mit Umlauten/Zeilenumbrüchen → `encodeURIComponent`, Body < 1.800 Zeichen (Test in Task 1 über `buildSummaryText`).

---

### Task 1: Rechenlogik

**Files:** Create `js/calc.js`, `js/calc.test.js`

**Interfaces – Produces:**
- `savingsPlan({monthly:number, years:number, ratePa:number, start?:number}) -> {total:number, paidIn:number, gains:number, series:{year:number,total:number,paidIn:number}[]}` – monatliche Einzahlung am Monatsende, Monatszins `(1+ratePa)^(1/12)-1`.
- `realValue(amount:number, years:number, inflationPa:number) -> number`
- `avSubsidy({annual:number, kids:number, under25:boolean}) -> {base:number, kids:number, starter:number, total:number, eligible:boolean}` – 0 unter 120 €; 50 % bis 360 €, 25 % von 360,01 bis 1.800 €; Kinder 1 € je 1 € Eigenbeitrag bis 300 € je Kind (anteilig darunter); Startbonus 200 € einmalig.
- `buildSummaryText({monthly, years, ratePa, total, paidIn}) -> string`

- [ ] Tests: `savingsPlan({monthly:200,years:20,ratePa:0.0702}).total` ≈ 101.900 (±300), `paidIn === 48000`; Rendite 0 → `total === paidIn`; Rate 0 → `total === 0`; `avSubsidy` an 119.99→0/not eligible, 120→60, 360→180, 1800→540, 6840→540; kids 2 bei 1800 → kids 600; kids 1 bei 150 → kids 150; `realValue(10000,20,0.02)` ≈ 6.730; `buildSummaryText` enthält „101.“ und ist < 1.800 Zeichen.
- [ ] `node --test js/` → FAIL, dann implementieren → PASS. Commit.

### Task 2: Grundgerüst, Design-Tokens, Navigation, Fortschritt, Quiz

**Files:** Create `index.html`, `css/style.css`, `js/app.js`, `config.js`, `fonts/*`

- Header mit Logo „What the (<span>ET</span>)F?“, Fortschrittsleiste, Kapitelübersicht (Drawer).
- Kapitel 0 Check-in: 3 Fragen als Radio-Karten + Disclaimer-Checkbox „Verstanden“; Start-Button erst danach aktiv.
- `app.js`: `state = {answers, done:Set, disclaimer}`; `applyPersonalization(answers)` setzt `data-optional` auf Kap. 1–2 (bei „Depot“) und Kap. 8 (ohne „Kinder“), schreibt Sorge-Satz; Weiter/Zurück, `#kapitel-n`, „Alles zurücksetzen“.
- Tokens: `--bg #FBF8F3`, `--ink #1F2421`, `--accent #1E6B4F`, `--danger #B4413C`; Dark-Mode via `prefers-color-scheme`.
- [ ] Im Browser bei 375 px: Quiz durchklicken, Reload behält Stand, Reset leert. Commit.

### Task 3: Kapitel 1–6 mit Widgets

**Files:** Create `js/widgets.js`; Modify `index.html`

- Kap. 1 Inflations-Slider (`realValue`), Kap. 2 Obstkorb (1 Apfel „fällt aus“ → −0,08 % statt −100 %), Kap. 3 Crash-Simulator (Daten: Index 100 → 66 am 24.03.2020 → 104 Ende 2020; Panik verkaufen = 66, halten = 104), Kap. 4 Sparrechner mit SVG-Flächendiagramm + Bandbreite 4 %/9 %, Kap. 5 Kriterien + „So mache ich es“ (A2PKXG 0,14 %, A0RPWH 0,20 %), Kap. 6 Flip-Karten.
- [ ] Browser 375 px + Desktop: alle Widgets bedienbar, keine Konsolenfehler. Commit.

### Task 4: Kapitel 7–10, Zusammenfassung, Druck

**Files:** Modify `index.html`, `js/widgets.js`, `css/style.css`

- Kap. 7 Steuern, Kap. 8 Kinder (Umschalter Option 1/2, Frühstart-Rente „geplant“), Kap. 9 AV-Depot (Zulagen-Rechner via `avSubsidy`, Vergleichstabelle), Kap. 10 Checkliste, Broker-/Ko-fi-Links aus `config.js` mit Affiliate-Hinweis, Finanzfluss.
- Zusammenfassung: `mailto:?subject=…&body=…` aus `buildSummaryText`; „Als PDF speichern“ → `window.print()`, `@media print` zeigt nur `#zusammenfassung`.
- [ ] Browser: Mail-Link öffnet korrekt kodiert, Druckvorschau zeigt nur Zusammenfassung. Commit.

### Task 5: Impressum, Datenschutz, OG-Bild, README

**Files:** Create `impressum.html`, `datenschutz.html`, `og-image.png`, `README.md`, `.nojekyll`

- Impressum: §5 DDG (Kevin Wöhler, Erlenweg 4, 39291 Hohenwarthe), Kontakt kevin.woehler@gmail.com, §18 Abs. 2 MStV, Haftung Inhalte/Links, Urheberrecht, Hinweis keine Anlageberatung.
- Datenschutz: Verantwortlicher, Hosting GitHub Pages (Server-Logs/IP, Art. 6 Abs. 1 lit. f, Drittland USA/DPF), localStorage (kein Cookie, nur lokal, löschbar), keine Analytics, externe Links, mailto, Betroffenenrechte, Beschwerderecht.
- [ ] Links aus Footer funktionieren. Commit, push, GitHub Pages aktivieren.
