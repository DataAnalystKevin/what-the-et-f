---
name: What the (ET)F?
description: Ein ruhiger, warmer Finanzleitfaden im Ton eines vertrauenswürdigen Freundes – eine Serifenschrift, ein grüner Akzent, flache Karten auf Papier.
colors:
  paper: "#FBF8F3"
  surface: "#FFFFFF"
  ink: "#1F2421"
  muted: "#5B635E"
  line: "#E4DED3"
  moss: "#1E6B4F"
  moss-soft: "#DCEBE3"
  moss-fill: "#1E6B4F"
  on-moss: "#FFFFFF"
  brick: "#B4413C"
  brick-soft: "#F7E5E3"
  sage-paid: "#A8C7B6"
  night-paper: "#151916"
  night-surface: "#1D2320"
  night-tile: "#262D29"
  night-ink: "#ECEAE4"
  night-muted: "#A3ABA6"
  night-line: "#2E3631"
  night-moss: "#5FBF94"
  night-moss-soft: "#1F3A2F"
  night-moss-fill: "#469873"
  night-on-moss: "#0E1311"
  night-brick: "#E3807A"
  night-brick-soft: "#3A2423"
  night-sage-paid: "#3D5E4F"
typography:
  display:
    fontFamily: "Literata, Charter, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.5rem, 11vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Literata, Charter, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.9rem, 7vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Literata, Charter, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Literata, Charter, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: "Literata, Charter, 'Iowan Old Style', Georgia, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Literata, Charter, 'Iowan Old Style', Georgia, serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  base: "6px"
  tab: "4px"
  round: "50%"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.moss-fill}"
    textColor: "{colors.on-moss}"
    rounded: "{rounded.base}"
    padding: "10px 20px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "10px 20px"
    height: "48px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "18px 16px"
  choice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "14px 16px"
    height: "48px"
  choice-selected:
    backgroundColor: "{colors.moss-soft}"
    textColor: "{colors.ink}"
  pill:
    backgroundColor: "{colors.moss-soft}"
    textColor: "{colors.moss}"
    rounded: "{rounded.base}"
    padding: "4px 10px"
  callout:
    backgroundColor: "{colors.moss-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "14px 18px"
  flip-back:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.on-moss}"
    rounded: "{rounded.base}"
    padding: "18px"
---

# Design System: What the (ET)F?

## Overview

**Creative North Star: "Der Brief vom Freund"**

Die Seite liest sich wie ein gut gesetzter, persönlicher Brief auf warmem Papier: eine einzelne Spalte, eine Serifenschrift, eine Farbe, die etwas bedeutet. Sie erklärt Geldanlage für Menschen, die Angst davor haben, und darf deshalb nirgends nach Bank, Broker oder Verkaufsgespräch aussehen. Ruhe ist das Gestaltungsmittel: wenig gleichzeitig sichtbar, wenig gefüllte Flächen, nichts, das drängt.

Die Dichte ist niedrig und lesefreundlich (680px Spalte, 17px Fließtext, Zeilenhöhe 1,65). Interaktive Bausteine (Rechner, Umdrehkarten, Sorgen-Check) sind flach, hell und tragen ihre Wirkung durch Inhalt und kleine, ruhige Übergänge statt durch Effekte. Dunkelmodus ist ein gleichwertiger Zwilling, kein Nachgedanke: dasselbe Grün, nur auf Nachtpapier.

Visuell abgelehnt (vom Nutzer bestätigt): Fraunces und Inter als „vibe-coded“ Standardschriften, verspielte oder lässige Schriftschnitte, laute Fintech-Anmutung. Typografie bleibt ernst und ruhig, eine Familie.

**Key Characteristics:**
- Eine Familie (Literata, variabel mit optischer Größe) für alles, auch Zahlen und Beschriftungen.
- Ein Akzent: Moosgrün. Es markiert „das ist wichtig / das ist gut / hier geht es weiter“.
- Flache Karten mit feiner Linie auf Papier; Schatten nur beim aufgeklappten Menü.
- Eine einzige Eckenform (6px) für Karten, Buttons, Pillen und Felder.
- Hell und Dunkel gleichberechtigt; System-Einstellung wird respektiert, manuell überschreibbar.
- Gefüllte Flächen sind knapp: gefüllt bleibt nur der eine Weiter-/Hauptschritt.

## Colors

Warmes Papier, tintiges Schwarzgrün, ein beruhigendes Moosgrün. Rot und Blau erscheinen nur als Datenfarben und für Fehler.

### Primary
- **Moosgrün** (#1E6B4F, dunkel #5FBF94): Links, aktive Zustände, Häkchen, Zahlen in Reglern, positive Balken und Diagrammlinien, Fokusring, Auswahlfarbe. Die gefüllte Variante (`moss-fill`, dunkel #469873) dient nur Buttons und aktiven Tabs, damit Weiß/Schwarz darauf Kontrast hält.
- **Salbeigrün** (#DCEBE3, dunkel #1F3A2F): Hintergrund für ausgewählte Antworten, „Aha“-Kästen, Pillen, gelöste Sorgen und persönliche Hinweise.

### Secondary
- **Ziegelrot** (#B4413C, dunkel #E3807A): Fehlermeldungen, „verloren/weg“-Zustände im Aktienkorb, Gefahren-Button. Nie dekorativ. Weicher Grund: #F7E5E3.
- **Helles Salbei** (#A8C7B6, dunkel #3D5E4F): ausschließlich „selbst eingezahlt“ in Diagrammen, in Helligkeit vom dunkleren grünen Gewinn getrennt. Beschriftung darauf in Tinte (#1F2421, dunkel #ECEAE4).

### Neutral
- **Papier** (#FBF8F3, dunkel #151916): Seitenhintergrund und Zahlenkacheln (im Dunkeln hebt sich die Kachel auf #262D29).
- **Karte** (#FFFFFF, dunkel #1D2320): Karten, Widgets, Eingabeflächen.
- **Tinte** (#1F2421, dunkel #ECEAE4): Text, Umrandung der Outline-Buttons, Kontrastband im Diagramm.
- **Gedämpftes Grau-Grün** (#5B635E, dunkel #A3ABA6): Sekundärtext, Labels, Kleingedrucktes. Alle Text-Paare erreichen mindestens 5,4:1.
- **Haarlinie** (#E4DED3, dunkel #2E3631): Kartenränder, Trennlinien, leere Fortschrittsspur.

### Named Rules
**The One Moss Rule.** Moosgrün ist die einzige Akzentfarbe. Es trägt Bedeutung (wichtig, gut, weiter), nie Dekoration; alles andere Farbige ist Daten oder Fehler.

**The Twin Rule.** Jedes Token existiert in Hell und Dunkel mit dokumentiertem Kontrast. Neue Farben kommen nur als Paar.

**The Never-Color-Alone Rule.** Vorteil, Fehler und Fortschritt tragen zusätzlich ein Zeichen (✓, !, ≈) oder Text, nie nur Farbe.

## Typography

**Display Font:** Literata (mit Charter, Iowan Old Style, Georgia, serif)
**Body Font:** Literata (dieselbe Familie)
**Label/Mono Font:** Literata, mit tabellarischen Lining-Ziffern für Zahlen

**Character:** Eine freundlich-ernste Lesesans-Serif mit optischer Größe: im Fließtext offen und warm, in Überschriften straffer. Gewicht und Größe schaffen Hierarchie, nicht Schriftwechsel.

### Hierarchy
- **Display** (700, clamp 2.5–4rem, 1.1): Seitentitel pro Kapitel; Hervorhebung in `<em>` kursiv und Moosgrün.
- **Headline** (700, clamp 1.9–2.75rem, 1.1): Kapitelüberschriften.
- **Title** (700, 1.375rem, 1.3): Fragen, Widget-Titel, Umdrehkarten-Vorderseiten, Anbieter-Namen.
- **Body** (400, 1.0625rem, 1.65): Fließtext, Silbentrennung automatisch, Zeilenlänge durch 680px-Spalte begrenzt.
- **Small** (400, 0.9375rem): Bedienelemente, Sekundärtext, Vergleichstabelle.
- **Label** (600, 0.8125rem): Badges, Meta-Zeilen, Legenden, Kleingedrucktes (max. 65ch).

### Named Rules
**The One Family Rule.** Keine zweite Schrift, keine Gewichtsspielereien: 400, 600, 700, kursiv für Betonung.

**The Numbers Align Rule.** Alles mit Zahlen nutzt `tabular-nums lining-nums`; Beträge springen nicht.

**The No-Hyphen-On-Display Rule.** Überschriften, Ergebnissätze, Karten-Fronten, Zahlenwerte und Buttons trennen nie; Fließtext trennt erst ab langen Wörtern (8/4/4).

## Layout

Eine einzige zentrierte Spalte, 680px max, 16px Seitenrand; Kopfzeile (648px) klebt oben mit Logo, Fortschrittslinie und Menü. Inhalt ist in Kapitel unterteilt, mit JavaScript wird jeweils nur eines angezeigt und per Pager (zurück/weiter) geblättert; ohne JavaScript stehen alle untereinander.

Rhythmus: 8/10/12/16/24/32px, Karten und Widgets mit 24px Abstand außen, innen 18×16px (ab 720px 24px). Zwei-Spalten-Raster nur dort, wo es hilft (Anbieterkarten, Umdrehkarten ab 720px, Zahlenkacheln als 3er-Raster). Die Vergleichstabelle klappt unter 560px zu Kriterium über zwei Spalten um. Ziel-Mindesthöhen: 44px für Tipp-Ziele, 48px für Buttons und Antworten.

### Named Rules
**The One Column Rule.** Nichts bricht aus der 680px-Spalte aus, kein Seitenleisten-Layout, kein Hero-Raster.

**The Thumb Rule.** Jedes tippbare Element ist mindestens 44px hoch.

## Elevation & Depth

Flach und tonal. Tiefe entsteht durch Papier (#FBF8F3) gegen weiße Karte mit 1px Haarlinie, im Dunkeln durch Nachtpapier gegen leicht hellere Karte. Der einzige Schatten gehört dem aufgeklappten Menü, das über der Seite schwebt.

### Shadow Vocabulary
- **Menü-Schwebe** (`box-shadow: 0 12px 32px rgb(0 0 0 / .12)`): nur für das Überlagerungs-Menü.
- **Fehler-Ring** (`box-shadow: 0 0 0 2px var(--danger)`): markiert unbeantwortete Pflichtfragen, erst nach dem Startversuch.

### Named Rules
**The Flat-By-Default Rule.** Karten haben keinen Schatten. Zustand zeigt sich über Randfarbe (Haarlinie → Moos) und Hintergrund (Karte → Salbei), nicht über Höhe.

## Shapes

Eine Eckenform: 6px für Karten, Buttons, Pillen, Antworten und Eingaben. Tabs im Segment-Schalter haben 4px, weil sie in einem 6px-Behälter liegen, und schmale Balken und Legendenfarben (Sorgen-Balken, Diagramm-Schlüssel) 3px, damit sie nicht zur Kapsel werden. Datenpunkte sind Kreise (50%). Ränder sind 1px (Karten) oder 1,5px (Buttons, Antworten, Anbieterkarten). Gestrichelte Ränder markieren Notizen. Keine Pfeil-Ecken, keine Kapseln, keine Verläufe.

### Named Rules
**The One Radius Rule.** Eine neue Komponente erbt `--radius: 6px`; sie erfindet keinen eigenen Radius.

## Components

### Buttons
- **Shape:** 6px, mind. 48px hoch, 1,5px Rand, Schrift 1rem/600 (6px)
- **Primary:** Moos gefüllt (#1E6B4F) mit weißem Text, 10×20px Innenabstand. Pro Ansicht höchstens ein gefüllter Button – der Weiter-Schritt.
- **Outline (Standard):** transparent, 1,5px Tintenrand. In Widgets und Sorgen-Karten stattdessen Moos-Rand mit Moos-Text; in gelösten Karten gedämpft.
- **Danger:** Ziegelrotrand und -text, ungefüllt.
- **Hover / Focus / Active:** Kein Hover-Farbwechsel; `:active` skaliert auf .98; Fokus ist ein 3px Moos-Ring mit 2px Abstand. Deaktiviert: 45% Deckkraft.
- **Link-Button:** gedämpft, unterstrichen, ohne Rahmen.

### Chips / Pillen
- **Style:** Salbeigrund, Moos-Text, 6px, 4×10px, 13px/600. Nur Orientierung („für dich“, Kategorie), nie Aktion.

### Cards / Widgets
- **Corner Style:** 6px
- **Background:** weiße Karte (dunkel #1D2320)
- **Shadow Strategy:** keiner (siehe Elevation)
- **Border:** 1px Haarlinie; „eigene“ Karte Moosrand; Notiz gestrichelt
- **Internal Padding:** 18×16px, ab 720px 24px; Ergebniszeilen fett, Zahlenkacheln (3er-Raster, Papierfarbe) darunter

### Inputs / Fields
- **Antwortwahl (Choice):** ganze Zeile 48px, 1,5px Haarlinienrand auf Karte; gewählt = Moosrand + Salbeigrund + Gewicht 600; natives Radio unsichtbar, Fokus-Ring auf dem Feld.
- **Regler:** nativ, Moos als Akzent, 44px Tippfläche, Wert in Moos mit Tabellenziffern.
- **Checkbox:** 22px, Moos-Akzent, Zeile mind. 44px.
- **Error:** erst nach Startversuch: 2px Ziegel-Ring, rosa Grund, Hinweis „Bitte wähle eine Antwort“ unter der Frage.

### Navigation
- **Kopfzeile:** klebend, Papier zu 88% mit 8px Weichzeichner, Haarlinie unten. Logo „What the (ET)F?“ mit „ET“ in Moos; mittig dünne Fortschrittslinie (Moos, 2,2px) mit Zähler „3/10“; rechts Menü-Button (44px, Outline).
- **Menü:** Karte mit Schwebe-Schatten, oben die einzige gefüllte Verknüpfung „Direkt zu den 3 Schritten“, darunter Kapitelliste mit Häkchen, Darstellungs-Auswahl (Automatisch/Hell/Dunkel als Segment).
- **Pager:** Linie oben, zurück/weiter nebeneinander; „Weiter“ gefüllt, Titel des nächsten Kapitels klein darunter.

### Umdrehkarte (Signature)
Eine Frage vorne in Titelgröße auf Karte mit kräftiger Haarlinie, mind. 120px hoch; Tippen dreht sie 0,5s um die Y-Achse. Die Rückseite ist eine Karte mit Moosrand, zeigt die Frage klein oben und darunter die Antwort in 15px. Hinweise „Aufdecken ↻“ und „Zurückdrehen ↻“. Für Screenreader bleibt der Name die Frage (`aria-expanded`), die Antwort kommt als Beschreibung.

### Sorgen-Karte (Signature)
Eine Frage als Title, offen mit Salbei hinterlegt; Antwort erscheint mit „rise“-Animation; gelöst = Moosrand und gedämpfter Button. Die ehrliche Sorge („Realistisch“) bleibt neutral, nur ≈ statt ✓, kein grüner Triumph. Oben klebt ein 5-Segment-Balken als Zähler.

### Anbieterkarte
Neutrale Karte mit Name in Title-Größe, Art in Label, Beschreibung nur wo nötig, „Zur Seite →“ in Moos. Kein Werbe- oder Affiliate-Ton. Hover und Fokus färben nur den Rand moosgrün.

### Schritte-Liste
Drei abhakbare Zeilen in einer Karte, getrennt durch Haarlinien, gruppiert nach „Heute“ und „Danach, in Ruhe“; darunter „Und dann“ mit zwei Hinweisen ohne Checkbox (Laufen lassen, Weiterlernen), die nicht mitzählen; erledigt = gedämpfter Text; vollständig = Karte wird Salbei, kurze „rise“-Zeile.

## Do's and Don'ts

### Do:
- **Do** Moosgrün (#1E6B4F) sparsam einsetzen: Links, Häkchen, gewählter Zustand, ein Hauptbutton.
- **Do** jede neue Fläche als Karte mit 1px Haarlinie (#E4DED3) auf Papier bauen, 6px Radius, ohne Schatten.
- **Do** Zahlen mit `tabular-nums lining-nums` setzen und Beträge mit geschütztem Leerzeichen vor „€“.
- **Do** jedes Farbsignal mit Zeichen oder Text verdoppeln (✓, !, ≈).
- **Do** jede Farbe als Hell/Dunkel-Paar anlegen und Kontrast ≥ 4,5:1 prüfen.
- **Do** Ziele auf mindestens 44px Höhe bringen, Buttons auf 48px.
- **Do** Bewegung kurz und leise halten (0,15–0,6s) und unter `prefers-reduced-motion` ganz abschalten.

### Don't:
- **Don't** Fraunces, Inter oder verspielte/lässige Schriftschnitte einführen. Schriftwechsel nur nach gerenderter Probe und Freigabe durch Kevin.
- **Don't** mehr als einen gefüllten Button pro Ansicht setzen; Neben-Aktionen sind Outline oder Link.
- **Don't** Schatten, Verläufe, Glas oder bunte Akzentflächen zu Karten hinzufügen.
- **Don't** Rot als Warnschmuck verwenden; es bleibt Fehler und „weg“.
- **Don't** die Ehrliche-Sorge-Karte grün als „erledigt“ feiern.
- **Don't** Anbieter mit Werbesprache, Rabattbannern oder Affiliate-Hinweisen aufmachen.
- **Don't** Überschriften, Ergebnissätze, Karten-Fronten und Buttons trennen lassen.
- **Don't** die Spalte verbreitern oder ein Mehrspalten-Hero einbauen.
