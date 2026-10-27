// Reine Rechenfunktionen – kein DOM, damit sie mit `node --test js/` prüfbar bleiben.

export const eur = (n) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export function savingsPlan({ monthly, years, ratePa, start = 0 }) {
  const r = Math.pow(1 + ratePa, 1 / 12) - 1;
  let total = start;
  let paidIn = start;
  const series = [{ year: 0, total, paidIn }];
  for (let m = 1; m <= years * 12; m++) {
    total = total * (1 + r) + monthly; // Einzahlung am Monatsende
    paidIn += monthly;
    if (m % 12 === 0) series.push({ year: m / 12, total, paidIn });
  }
  return { total, paidIn, gains: total - paidIn, series };
}

export const realValue = (amount, years, inflationPa) => amount / Math.pow(1 + inflationPa, years);

// Altersvorsorgedepot ab 2027 (Stand Okt. 2026): 50 % bis 360 €, 25 % bis 1.800 €, Mindestbeitrag 120 €,
// Kinderzulage 1:1 bis 300 € je Kind, Startbonus 200 € einmalig unter 25.
export function avSubsidy({ annual, kids = 0, under25 = false }) {
  const eligible = annual >= 120;
  if (!eligible) return { base: 0, kids: 0, starter: 0, total: 0, eligible };
  const base = 0.5 * Math.min(annual, 360) + 0.25 * Math.max(0, Math.min(annual, 1800) - 360);
  const kidSum = kids * Math.min(annual, 300);
  const starter = under25 ? 200 : 0;
  return { base, kids: kidSum, starter, total: base + kidSum + starter, eligible };
}

export function buildSummaryText({ monthly, years, ratePa, total, paidIn }) {
  const pct = (ratePa * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 });
  return `What the (ET)F? – meine Zusammenfassung

DAS WICHTIGSTE
1. Inflation frisst Erspartes – Nichtstun kostet auch Geld.
2. Ein breiter Welt-ETF = tausende Firmen in einem Korb statt Wetten auf einzelne Aktien.
3. Crashs gehören dazu. Liegen lassen statt panisch verkaufen.
4. Zeit ist dein größter Hebel: Zinseszins wirkt erst spät, dann aber gewaltig.
5. Worauf achten: breit gestreut, günstig (niedrige TER), thesaurierend, großes Fondsvolumen.
6. Finger weg von: Market Timing, teuren Bankprodukten, Einzelaktien-Wetten, Themen-ETFs, teuren Finanz-Seminaren und Coachings.

MEINE RECHNUNG
${eur(monthly)} pro Monat, ${years} Jahre, ${pct} % pro Jahr
→ ca. ${eur(total)} (davon ${eur(paidIn)} selbst eingezahlt)
Nur eine Modellrechnung – echte Renditen schwanken.

MEINE NÄCHSTEN SCHRITTE
[ ] Depot bei einem günstigen Online-Broker eröffnen
[ ] Freistellungsauftrag einrichten
[ ] Sparplan auf einen breiten Welt-ETF anlegen
[ ] Laufen lassen und nicht ständig reinschauen
[ ] Weiterlernen, kostenlos: Finanzfluss auf YouTube

Wichtig: Das sind persönliche Erfahrungen, keine Anlageberatung.`;
}
