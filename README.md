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


## Unterstützer eintragen
In `index.html` im Abschnitt **Unsere Unterstützer** weitere Namen ergänzen:

```html
<span class="supporter-pill">Familie Muster</span>
```

Anonyme Spender können so erscheinen:

```html
<span class="supporter-pill anonymous">Anonym</span>
```

Bitte Namen nur veröffentlichen, wenn die Person damit einverstanden ist.

## Firmenlogos / Sponsoren
Logo-Datei in `assets/` ablegen, zum Beispiel `assets/firma-muster.png`.

Dann einen Platzhalter in `index.html` ersetzen durch:

```html
<a class="sponsor-card" href="https://www.firma-muster.ch" target="_blank" rel="noopener">
  <img src="assets/firma-muster.png" alt="Logo Firma Muster">
  <span>Firma Muster</span>
</a>
```

Für Logos funktionieren PNG oder SVG mit transparentem Hintergrund besonders gut.
