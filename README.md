# Werkzeugkasten

Rechner und Umrechner für den SHK-Alltag, als App fürs Handy. Läuft komplett im Browser (PWA), braucht keinen Server und funktioniert nach dem ersten Laden auch ohne Netz.

Aktuelle Version: siehe `js/version.js` und [CHANGELOG.md](CHANGELOG.md).

## Module

Auf der Startseite sind die Module nach Bereichen sortiert. Jedes Modul hat oben eine aufklappbare Beschreibung ("Wofür ist das und wie benutze ich es?") mit Erklärung, Schritten und einem Beispiel.

| Bereich | Modul | Was es kann |
|---|---|---|
| Rohr & Montage | **Dämmung nach GEG** | Mindestdicke der Rohrdämmung nach Anlage 8 (Heizung/Warmwasser, Kälte/Kaltwasser, Sondersituationen), Umrechnung auf anderes λ |
| Rohr & Montage | **Rohrgrößen** | Zoll ↔ DN ↔ mm für Stahl, Kupfer, Edelstahl, Mehrschicht und Rohrgewinde, mit Suche; Zoll ↔ Millimeter-Umrechner |
| Rohr & Montage | **Passstücke** | Zuschnittlänge bei Versatz (45° und beliebige Winkel) mit Z-Maßen, auch aus Längs- und Quermaß |
| Lüftung & Klima | **Filter-Umrechner** | RLT-Filter alt ↔ neu: EN 779 (G3 bis F9) ↔ ISO 16890 (ePM1, ePM2,5, ePM10), in beide Richtungen, plus Gesamttabelle |

Bereiche: Rohr & Montage, Heizung, Sanitär, Lüftung & Klima. Ein Bereich ohne Modul wird nicht angezeigt.

Geplant (Reihenfolge): Kältemittel-Drucktabelle, Dichtheitsprüfung, danach Gas m³ → kWh, F-Gas, Heizkörper-Umrechnung, Fußbodenheizung, hydraulischer Abgleich, Füllwasser VDI 2035, Abwasser-Gefälle, Trinkwasserhygiene, Rohrdimensionierung, Längenausdehnung, Schellenabstände, Kanal rund ↔ eckig, Luftwechsel.

## Aufbau

```
index.html            Einstiegsseite
manifest.webmanifest  App-Angaben (Name, Icons) für die Installation
sw.js                 Service Worker (Offline-Cache)
css/style.css         Design (dunkel, wie die Handy-App vom Schwarzen Brett)
css/fonts.css         Einbindung der lokalen Schriften
fonts/                Barlow und Barlow Condensed (SIL Open Font License) mit Lizenz
js/version.js         Versionsnummer (einzige Stelle)
js/modulliste.js      Liste der Bereiche und aller Module
js/app.js             Grundgerüst: Startseite, Navigation, UI-Bausteine
js/data/*.js          Daten (Tabellen, Werte), getrennt von der Logik
js/modules/*.js       Ein Modul pro Datei: Rechenlogik und Oberfläche
icons/                App-Icons
```

Grundregel: Zahlen und Tabellen stehen in `js/data/`, die Rechnung steht im Modul. Werte ändern geht, ohne die Rechnung anzufassen.

## Neues Modul anlegen

1. Datei `js/modules/<name>.js` anlegen. Sie ruft am Ende `WK.register({ id, bereich, hilfe, title, desc, icon, render })` auf. `render()` gibt ein DOM-Element zurück. Als Vorlage taugt `js/modules/passstuecke.js`.
   - `bereich`: Kennung eines Bereichs aus `WK.BEREICHE` (`rohr`, `heizung`, `sanitaer`, `lueftung`). Ein neuer Bereich wird in `js/modulliste.js` ergänzt.
   - `hilfe` (**Pflicht**): die aufklappbare Beschreibung `{ wofuer, schritte: [...], beispiel, hinweis }`. Einfache Sprache, Fachbegriffe erklären, ein Beispiel mit echten Zahlen. Die App baut daraus die Karte oben im Modul.
2. Falls Daten nötig sind: `js/data/<name>.js` anlegen.
3. In `js/modulliste.js` einen Eintrag mit `id` und allen Dateien ergänzen. Der Service Worker liest diese Liste, die Datei muss nirgends sonst eingetragen werden.
4. Hinweis beim Programmieren: Beim Befüllen von Elementen kein `null` an `replaceChildren` übergeben, sonst erscheint das Wort "null" auf der Seite. Leere Einträge vorher mit `.filter(Boolean)` entfernen.
5. Versionsnummer in `js/version.js` erhöhen und Eintrag im `CHANGELOG.md` ergänzen.

## Update ausliefern

- Dateien ins Repo, `js/version.js` hochzählen. Ohne neue Versionsnummer bleibt auf den Handys der alte Offline-Stand.
- Beim nächsten Start mit Netz lädt die App die neue Version im Hintergrund und zeigt einen Hinweis "Neue Version geladen" mit Knopf zum Neuladen.
- Mehrere Änderungen zu einem Update bündeln, ein Eintrag im Changelog.

## Veröffentlichen mit GitHub Pages

1. Repo muss öffentlich sein (kostenloses Pages).
2. Im Repo **Settings → Pages**: Source "Deploy from a branch", Branch `main`, Ordner `/ (root)`.
3. Nach kurzer Wartezeit ist die App unter `https://<benutzer>.github.io/<repo>/` erreichbar.
4. Am Handy im Browser öffnen und "Zum Startbildschirm hinzufügen" bzw. "App installieren" wählen.

Lokal testen: im Projektordner `python3 -m http.server 8000`, dann `http://localhost:8000` öffnen. (Der Offline-Modus braucht https oder localhost.)

## Datenquellen und Grenzen

Alle Werte sind Richtwerte für die Praxis und ersetzen keine Planung, keinen Prüfbericht und keine Herstellerangabe.

- **Dämmung:** Anlage 8 GEG (Mindestdicken bei λ = 0,035 W/(m·K)), Fassung laut [lxgesetze.de](https://lxgesetze.de/gmodg/AL-8), zuletzt geändert 23.07.2026, sowie [gesetze-im-internet.de](https://www.gesetze-im-internet.de/geg/anlage_8.html). Kälte/Kaltwasser: 9 mm bis 22 mm, 19 mm darüber. Das Gesetz nennt kein Umrechnungsverfahren für andere λ-Werte ("anerkannte Regeln der Technik"). Die App rechnet nach gleichem Wärmedurchgang je Meter (Zylinderformel). Bei halbierten oder verdoppelten Werten wird zuerst der Tabellenwert angepasst und dann umgerechnet. Der Gesetzestext nennt den "Innendurchmesser" der Leitung, die App fragt deshalb den Rohr-Innendurchmesser ab.
- **Filter:** [Eurovent Recommendation 4/23-2022](https://www.eurovent.eu/wp-content/uploads/eurovent-rec-4-23-selection-of-en-iso-16890-rated-air-filter-classes-fourth-edition-2022-de-web.pdf), Tabelle 5 (Bandbreiten gemessener Abscheidegrade). Eine exakte Umrechnung zwischen EN 779 und ISO 16890 gibt es nicht. G3/G4 sind ISO Coarse, dafür gibt es keine ePM-Werte.
- **Rohrgrößen:** gängige Normmaße (DIN EN 10255, DIN EN 1057, DIN EN 10312, ISO 7-1). Wandstärken bei Mehrschichtrohr hängen vom Hersteller ab und sind deshalb nicht hinterlegt.
- **Passstücke:** reine Geometrie. Z-Maße kommen aus dem Herstellerkatalog.
- **Schrift:** Barlow und Barlow Condensed, SIL Open Font License, Lizenztext in `fonts/LICENSE-Barlow.txt`.
