# What the (ET)F? – Design-Spec

Stand: 26.10.2026 · Autor: Kevin Wöhler (mit Claude)

## 1. Ziel

Eine Website, die Kevin ETF-Neulingen per Link „an die Hand gibt“, statt der langen Info-Mail.
Sie nimmt die Angst vor dem Aktienmarkt, erklärt die Grundlagen spielerisch und endet mit konkreten nächsten Schritten.

**Erfolg heißt:** Ein Neuling ohne Vorwissen versteht in ca. 20–30 Minuten am Handy, warum breit gestreute, günstige ETFs langfristig sinnvoll sind, was ihn bei einem Crash erwartet und wie er ein Depot eröffnet – ohne sich erschlagen zu fühlen.

**Ton:** seriös, aber wie die Empfehlung eines Freundes. Du-Form. Kein Verkaufston.

## 2. Harte Anforderungen

- **Mobile-first:** Die meisten Leser kommen über einen Messenger-Link am Handy. Alles muss ab 360 px Breite einwandfrei lesbar und bedienbar sein (Touch-Ziele ≥ 44 px, keine horizontale Scrollleiste, Slider per Daumen bedienbar).
- **Keine personenbezogenen Daten der Leser:** kein Backend, kein Tracking, keine Cookies, keine externen Requests (Schriften selbst gehostet). Fortschritt und Quiz-Antworten nur im `localStorage`, mit Button „Alles zurücksetzen“.
- **Disclaimer:** „Das sind meine persönlichen Erfahrungen, keine Anlageberatung.“ – ausführlich im Check-in (mit „Verstanden“-Bestätigung) und kurz im Footer jeder Seite.
- **Impressum** (§ 5 DDG, § 18 Abs. 2 MStV, Haftungsausschluss) analog zu wasdutunkannst.de mit Kevins Angaben, und eine **Datenschutzerklärung** passend zu dieser Seite (GitHub Pages als Hoster mit Server-Logs, localStorage, keine Cookies, externe Links zu Ko-fi/Brokern).
- **Affiliate-Kennzeichnung:** Referral-Links sichtbar als Affiliate-Link markiert („Ich bekomme ggf. eine Prämie, für dich ändert sich nichts“).
- **Fakten gesichert:** Alle Zahlen stammen aus dem Faktencheck (Abschnitt 6). Zeitkritische Inhalte tragen ein „Stand: Oktober 2026“-Badge.

## 3. Story / Kapitel

Reise Angst → Verstehen → Handeln. Jedes Kapitel beantwortet eine Frage, dauert 2–3 Minuten und hat genau ein interaktives Element.

| # | Kapitel | Interaktiv | Sichtbarkeit |
|---|---------|------------|--------------|
| 0 | **Check-in**: Wissensstand, Ziel, größte Sorge + Disclaimer | 3 Antwort-Karten-Fragen | immer |
| 1 | **Warum überhaupt?** – Inflation frisst das Sparbuch | Slider: Kaufkraft von 10.000 € über X Jahre bei Sparbuch vs. ETF | immer |
| 2 | **Was ist ein ETF?** – Obstkorb statt einzelner Apfel | Einzelaktie (Wirecard-artig) fällt aus → im Korb nur 1 von ~1.250 | „Kenne ich schon“ → optional |
| 3 | **Und wenn's crasht?** – Corona 2020 | Crash-Simulator: März 2020, Panik-Verkauf vs. Liegen lassen → Ergebnis Ende 2020 | immer; bei Sorge „Geld verlieren“ hervorgehoben |
| 4 | **Die Magie: Zinseszins** | ETF-Sparrechner: Rate, Laufzeit, Rendite → Diagramm Einzahlungen vs. Kursgewinne, Bandbreite pessimistisch/optimistisch | immer |
| 5 | **Welcher ETF?** – 4 Kriterien (breit, günstig, thesaurierend, groß) + „So mache ich es“ | Kriterien-Checkliste zum Aufklappen | immer |
| 6 | **Die Fallen** – Market Timing, Bankberater, Einzelaktien, Themen-ETFs, teure Kurse | Flip-Karten | immer |
| 7 | **Steuern in einfach** – Freistellungsauftrag, Sparerpauschbetrag, Vorabpauschale | – (kurz, Beispiel) | optional |
| 8 | **Für die Kinder** – Kinderdepot vs. eigenes Depot, Hinweis Frühstart-Rente (geplant) | Vergleich zum Umschalten | nur bei Ziel „Kinder“, sonst optional |
| 9 | **Das neue Altersvorsorgedepot (ab 2027)** | Zulagen-Rechner: Monatsbeitrag + Kinderzahl + unter 25 → Zulagen pro Jahr | immer |
| 10 | **Los geht's** – 4-Schritte-Checkliste, Broker-Links, Finanzfluss-Tipp, Ko-fi, Zusammenfassung | Checkliste zum Abhaken; Zusammenfassung per Mail/PDF | immer |

**Quiz-Logik (Check-in):**
- Wissensstand: „Nie gehört“ / „Grob bekannt“ / „Habe schon ein Depot“ → bei „Depot“ werden Kap. 1–2 als „überspringbar“ markiert.
- Ziel: „Altersvorsorge“ / „Für meine Kinder“ / „Einfach Vermögen aufbauen“ → steuert Kap. 8.
- Sorge: „Geld verlieren“ / „Zu kompliziert“ / „Keine Zeit“ / „Zu wenig Geld“ → je ein persönlicher Satz in der Einleitung, der auf das passende Kapitel verweist (z. B. „Zu wenig Geld“ → Rechner startet mit 25 €).
- Keine Inhalte werden versteckt; optionale Kapitel bleiben erreichbar.

**Abschluss:** „Der beste Zeitpunkt war gestern, der zweitbeste ist heute.“

## 4. Zusammenfassung zum Mitnehmen (Kap. 10)

Eine kompakte Zusammenfassung (Kernaussagen, die eigenen Rechner-Werte, 4-Schritte-Checkliste, Links) – ohne Server:

- **Per Mail:** `mailto:`-Link mit vorausgefülltem Betreff und Text. Der Leser trägt seine eigene Adresse ein und schickt sie sich selbst über seine Mail-App. Kein Mailserver nötig, keine Daten an uns.
- **Als PDF:** Button „Als PDF speichern“ → `window.print()` mit eigenem Druck-Stylesheet, das nur die Zusammenfassung zeigt. Auf iOS/Android über „Drucken → Als PDF sichern/teilen“; der Button-Hinweis erklärt das kurz.

## 5. Technik

Statisch, ohne Framework, ohne Build-Schritt, ohne npm-Abhängigkeiten. Hosting: GitHub Pages aus `main` (Root).

```
index.html          Check-in + alle Kapitel als <section>
impressum.html
datenschutz.html
css/style.css       Tokens, Hell/Dunkel, Mobile-first, Druck-Stylesheet
js/app.js           Navigation, Fortschritt, Quiz-Logik, localStorage, Zusammenfassung
js/calc.js          reine Rechenfunktionen (Sparplan, Bandbreite, Inflation, AV-Zulagen)
js/calc.test.js     node --test, keine Pakete
js/widgets.js       Slider, Crash-Simulator, Flip-Karten, SVG-Diagramme
config.js           Ko-fi-URL, Referral-Links (Platzhalter), Stand-Datum
fonts/              Fraunces + Inter (woff2, selbst gehostet)
og-image.png        Vorschaubild für Messenger
```

- **Navigation:** Kapitel als Abschnitte einer Seite; Fortschrittsleiste (wächst wie ein Chart), „Weiter“/„Zurück“, Kapitelübersicht. Deep-Links per `#kapitel-n`.
- **Diagramme:** handgeschriebenes SVG, keine Chart-Bibliothek.
- **Barrierefreiheit:** semantisches HTML, Fokus sichtbar, Kontraste AA, `prefers-reduced-motion` respektiert, Slider mit Labels und Wertausgabe.
- **Ohne JS:** Inhalte bleiben lesbar (progressive enhancement); nur Interaktives fehlt.
- **Platzhalter:** Ko-fi und Referral-Links in `config.js`, klar markiert; leere Links werden nicht angezeigt.

## 6. Faktenbasis (geprüft Oktober 2026)

- Globale Aktien 1900–2024: **5,2 % p. a. real**, 9,7 % nominal (UBS Global Investment Returns Yearbook 2025). Rechner-Standard: 7 % nominal, Bandbreite 4–9 %.
- Beispiel: 200 €/Monat, 20 J., 7,02 % → ≈ 101.900 €, davon 48.000 € eingezahlt.
- Corona: MSCI World ca. −34 % bis 24.03.2020, alter Höchststand noch 2020 zurück.
- iShares Core MSCI World (A0RPWH, IE00B4L5Y983): TER 0,20 %, ca. 1.250 Positionen, thesaurierend.
- Vanguard FTSE All-World Acc (A2PKXG, IE00BK5BQT80): ca. 3.700+ Positionen, thesaurierend; **TER vor Veröffentlichung gegen Vanguard-Factsheet prüfen** (Quellen: 0,19 % / 0,14 %).
- Sparerpauschbetrag 1.000 € / 2.000 € (Paare); Basiszins 2026: 3,20 %; Vorabpauschale = Wert Jahresanfang × Basiszins × 0,7 (gedeckelt durch Wertzuwachs).
- Kinderdepot: eigener Grundfreibetrag + Sparerpauschbetrag; Achtung Familienversicherung bei hohen Erträgen; Schenkungsfreibetrag 400.000 € je Elternteil/Kind alle 10 Jahre.
- Altersvorsorgedepot: Start 01.01.2027 (Altersvorsorgereformgesetz). Grundzulage 50 % auf die ersten 360 €/Jahr + 25 % bis 1.800 € (max. 540 €), Mindestbeitrag 120 €/Jahr, Kinderzulage bis 300 €/Kind, Startbonus 200 € unter 25. Ansparphase steuerfrei, Auszahlung versteuert, Geld bis zur Rente gebunden. **Beitragsobergrenze (6.840 €?) vor Veröffentlichung gegen Gesetzestext prüfen.**
- Frühstart-Rente: 10 €/Monat für Kinder 6–18, Bundestag 16.10.2026, Bundesrat ausstehend → als „geplant“ kennzeichnen.
- Korrekturen ggü. der Mail: iShares MSCI ACWI enthält keine Small Caps (erst „IMI“); mehrere Welt-ETFs = Überschneidung statt mehr Streuung (nicht „Klumpenrisiko“).

## 7. Look

Ruhig-redaktionell (Magazin, nicht Finanz-App). Warmes Off-White, dunkle Tinte, ein Akzent Tiefgrün; Rot nur im Crash-Simulator. Dunkelmodus automatisch. Fraunces (Überschriften) + Inter (Text). Logo: „What the (**ET**)F?“ mit farbigem „ET“. Spielerisch durch Interaktion und Sprache, nicht durch Deko.

## 8. Testen

- `node --test js/` prüft Rechenlogik gegen bekannte Werte (Sparplan-Beispiel, Zulagen-Stufen inkl. Grenzen 120/360/1.800 €, Inflation).
- Manuell im Browser: 375 px und Desktop, Hell/Dunkel, Quiz-Pfade (Kinder/kein Kinder, Depot vorhanden), Zusammenfassung per Mail/PDF, Reset, Seite ohne JS.

## 9. Nicht im Umfang

Kein Backend, keine Accounts, kein Newsletter, keine Mehrsprachigkeit, keine Live-Kursdaten, keine Analytics, kein eigener Mailversand.
