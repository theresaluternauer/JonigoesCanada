# Joni Hockey Crowdfunding

Eine einfache statische Crowdfunding-/Sponsoring-Webseite für GitHub Pages.

## Dateien
- `index.html` – Inhalt der Webseite
- `styles.css` – Gestaltung
- `script.js` – Spendenziel und aktueller Spendenstand
- `assets/` – später Bilder, Video-Thumbnail und TWINT-QR-Code ablegen

## Spendenstand ändern
In `script.js`:

```js
const ziel = 5000;
const gesammelt = 2350;
```

Nur `gesammelt` anpassen und danach committen/pushen.

## Eigene Bilder einsetzen
Beispiel:

```html
<img src="assets/joni-spiel.jpg" alt="Joni beim Hockeyspiel">
```

## Video
Empfohlen: YouTube/Vimeo einbetten. Alternativ kann eine MP4-Datei im `assets`-Ordner verwendet werden.

## TWINT QR
Lege den QR-Code z. B. unter `assets/twint-qr.png` ab und ersetze den Platzhalter in `index.html` durch:

```html
<img src="assets/twint-qr.png" alt="TWINT QR-Code">
```

## GitHub Pages
Repository auf GitHub erstellen, Dateien hochladen/committen und unter
Settings → Pages → Deploy from a branch aktivieren.
