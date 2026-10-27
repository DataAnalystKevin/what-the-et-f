# What the (ET)F?

ETFs in 11 kurzen Kapiteln – spielerisch erklärt für Neulinge. Statische Website, kein Tracking, keine Abhängigkeiten.

**Live:** https://whattheetf.de/

## Anpassen

- **Links (Ko-fi, Broker-Referrals), Stand-Datum:** `config.js` – leere URLs werden nicht angezeigt.
- **Texte:** `index.html`, Rechtstexte in `impressum.html` und `datenschutz.html`.
- **Zahlen zum Gesetz (AV-Zulagen):** `js/calc.js` → `avSubsidy`.

## Lokal ansehen & testen

```bash
npx http-server . -p 8765
```

```bash
node --test js/
```

Zeitkritische Fakten (TER, Steuern, Altersvorsorgedepot, Frühstart-Rente) haben den Stand Oktober 2026 und sollten regelmäßig geprüft werden.
