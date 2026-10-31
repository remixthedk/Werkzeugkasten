# Werkzeugkasten

Rechner und Umrechner für den SHK-Alltag, als App fürs Handy. Läuft komplett im Browser (PWA), braucht keinen Server und funktioniert nach dem ersten Laden auch ohne Netz.

Aktuelle Version: siehe `js/version.js` und [CHANGELOG.md](CHANGELOG.md).

## Module

Auf der Startseite sind die Module nach Bereichen sortiert. Oben gibt es ein Suchfeld, und mit dem Stern auf jeder Kachel (und im Kopf eines geöffneten Moduls) markierst du Favoriten. Sie stehen dann ganz oben. Favoriten werden nur auf dem jeweiligen Gerät im Browser gespeichert.

Jedes Modul hat oben eine aufklappbare Beschreibung ("Wofür ist das und wie benutze ich es?") und unten eine aufklappbare Quellenangabe ("Quelle und Prüfstand").

| Bereich | Modul | Was es kann |
|---|---|---|
| Rohr & Montage | **Dämmung nach GEG** | Mindestdicke der Rohrdämmung nach Anlage 8 (Heizung/Warmwasser, Kälte/Kaltwasser, Sondersituationen). Rohrauswahl erst Material, dann Größe (Viega Raxofix, Viega Prestabo, Geberit Mapress XL, Kupfer, Stahl-Gewinderohr) |
| Rohr & Montage | **Rohrgrößen** | Außen-Ø, Wand und Innen-Ø für Raxofix, Prestabo, Mapress XL, Kupfer, Stahl-Gewinderohr und Rohrgewinde, mit Suche; Zoll ↔ Millimeter-Umrechner |
| Rohr & Montage | **Passstücke** | Zuschnittlänge bei Versatz (45° und beliebige Winkel). Z-Maß: Fitting und Größe wählen (Profipress, Prestabo XL und Mapress, Bogen 45° und 90°), Wert wird eingesetzt; sonst selbst eingeben. Auch aus Längs- und Quermaß |
| Lüftung & Klima | **Filterklassen** | Tabelle der Eurovent-Spannen: RLT-Filter EN 779 (G3 bis F9) und ISO 16890 (ePM1, ePM2,5, ePM10). Keine Umrechnung |

Bereiche: Rohr & Montage, Heizung, Sanitär, Lüftung & Klima. Ein Bereich ohne Modul wird nicht angezeigt.

### Qualitätsregel

Ein Modul wird nur gebaut, wenn jeder Wert aus mindestens zwei unabhängigen Quellen bestätigt ist und jede Formel auf einem zweiten Rechenweg gegengeprüft wurde. Bei Unklarheit wird das Modul nicht gebaut, sondern gemeldet. Vor jedem Bau wird die Modulliste einzeln freigegeben.

Geplant (Reihenfolge, je Stufe erst nach Prüfung und Freigabe): Einheiten-Umrechner, Wasserinhalt Rohr, Längenausdehnung, Abwasser-Gefälle, Gas/Brennstoffe in kWh, Kältemittel-Drucktabelle, F-Gas, Dichtheitsprüfung, Ausdehnungsgefäß, Leistung ↔ Volumenstrom, Heizkörper-Umrechnung, Fußbodenheizung, hydraulischer Abgleich, Füllwasser VDI 2035, Heizlast aus Verbrauch, Trinkwasserhygiene, Wasserhärte, Warmwasserbedarf, Kanal rund ↔ eckig, Luftwechsel, Klimagerät-Leistung, Kondensat, Biegemaße, Aufmaß.

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

1. Datei `js/modules/<name>.js` anlegen. Sie ruft am Ende `WK.register({ id, bereich, hilfe, quelle, stichworte, title, desc, icon, render })` auf. `render()` gibt ein DOM-Element zurück. Als Vorlage taugt `js/modules/passstuecke.js`.
   - `bereich`: Kennung eines Bereichs aus `WK.BEREICHE` (`rohr`, `heizung`, `sanitaer`, `lueftung`). Ein neuer Bereich wird in `js/modulliste.js` ergänzt.
   - `quelle` (**Pflicht**): Liste von Absätzen für "Quelle und Prüfstand" unten im Modul (welche Quellen, was bestätigt ist, was bewusst fehlt).
   - `stichworte` (optional): Suchbegriffe für das Suchfeld auf der Startseite, zum Beispiel Alltagsnamen wie "isolierung".
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

## Prüfliste (Stand 31.10.2026)

Alle Werte sind Richtwerte für die Praxis und ersetzen keine Planung, keinen Prüfbericht und keine Herstellerangabe.

| Modul | Wert | Prüfstand | Quellen |
|---|---|---|---|
| Dämmung | Mindestdicken 20 / 30 / = Innen-Ø / 100 mm, ½ bei Durchbruch und Nutzertrennung, 6 mm Fußboden, ×2 Außenluft, Kälte 9 / 19 mm | bestätigt, gleiche Werte in allen Fassungen | Anlage 8 GEG: gesetze-im-internet.de, buzer.de, lxgesetze.de |
| Dämmung | Bezug auf Innendurchmesser | bestätigt | Gesetzestext Anlage 8 |
| Rohrgrößen | Stahl EN 10255 mittelschwer, DN 6 bis 100 | bestätigt (Wandstärken je nach Quelle auf 0,05 mm anders gerundet) | Sikla, zickwolff.de, Wikipedia |
| Rohrgrößen | Rohrgewinde ISO 7-1, Außen-Ø | bestätigt | REMS, Wikipedia |
| Rohrgrößen | Zoll in mm (25,4) | exakt | Definition |
| Rohrgrößen | Raxofix 16×2,2 bis 63×4,5 | bestätigt (Viega-Anleitung, Prospekt für 20×2,8, Händlerdaten). Innen-Ø gerechnet; Wasserinhalt laut Händler weicht bei 25, 32, 63 mm um bis zu 0,4 mm im Innen-Ø ab, im Modul vermerkt | Viega Gebrauchsanleitung Raxofix, Viega Prospekt, lemu.dk |
| Rohrgrößen | Prestabo 15×1,2 bis 54×1,5, 64×2,0, 76,1×2,0 | bestätigt (Viega-Katalog Modell 1103 und Prestabo-XL-Anleitung; Modell 1104, Händler und Geberit-C-Stahl mit gleichen Maßen). 12×1,2 nicht aufgenommen (nur eine Quelle). Nicht für Trinkwasser | Viega-Katalog, lemu.dk, hts24, bels, ahlsell, thyssenkrupp-Werkstoffhandbuch |
| Rohrgrößen | Mapress XL 88,9×2,0 und 108×2,0 (Edelstahl und C-Stahl) | bestätigt | Heinze (Geberit), pdod.de, thyssenkrupp-Werkstoffhandbuch |
| Rohrgrößen | Kupfer Außen-Ø 12 bis 54 | bestätigt, Wandstärke bewusst nicht hinterlegt | Sikla, Viega |
| Filter | Spannen M5 bis F9 | Tabelle bestätigt (gleich in drei Ausgaben, aber eine Primärquelle), deshalb nur Tabelle ohne Umrechnung | Eurovent 4/23 (2018, 2022), EMW |
| Passstücke | Geometrie | bestätigt, zweiter Rechenweg | Omni Calculator, eigene Gegenrechnung |
| Passstücke | Z-Maß-Definition (Mittelachse bis Rohranschlag im Fitting, Einstecktiefe enthalten) | bestätigt anhand der Viega-Maßzeichnungen (Profipress-Bogen 45° und 90°) | Viega-Online-Katalog |
| Passstücke | Z-Maße Profipress-Bogen 90° (Modell 2416), d 12 bis 54 | bestätigt: Katalogseite zweimal unabhängig abgelesen (Seitenabruf und Handy-Ansicht), gleiche Werte | Viega-Online-Katalog |
| Passstücke | Z-Maße Profipress-Bogen 45° (Modell 2426), d 12 bis 54 | d 22 bis 54 beim Viega-Händler bestätigt, d 12 im Viega-Datenblatt. d 15 und 18 nur Katalog plus Gegenprobe | Viega-Online-Katalog, ritzmarine.com, tbs-online.de |
| Passstücke | Z-Maße Vorgängerversion beider Bögen (Spalte Z*) | 90° mit Seitenabruf bestätigt, 45° nur Katalog plus Gegenprobe | Viega-Online-Katalog |
| Passstücke | Z-Maße Prestabo XL Bogen 90° und 45°, d 64, 76,1, 88,9, 108 | Herstellertabellen von Viega (vom Anwender geliefert). Gegenprobe: L − Z (90°) = L1 − Z (45°) = 43 / 50 / 50 / 60 mm. Keine zweite unabhängige Quelle gefunden (Händler nennen keine Z-Maße) | Viega-Katalog |
| Passstücke | Z-Maße Mapress Bogen 90° und 45°, d 88,9 und 108 | Geberit-Produktdaten (Herstellerauszug, cm in mm umgerechnet). Gegenprobe: L − Z bei 90° und 45° gleich (60 / 75 mm) und in allen 11 Größen der Tabelle. Edelstahl und C-Stahl laut Anwender gleich | Geberit Produktdaten (Edelstahl-Bogen, 31.10.2026) |
| Passstücke | Gegenprobe | L − Z (Einstecktiefe) je Größe in allen vier Tabellen gleich: 18, 22, 22, 23, 24, 26, 36, 40 mm (d 12 bis 54), im Test geprüft | Rechnung |

### Bewusst nicht gebaut oder entfernt

- **Umrechnung auf anderes λ (Dämmung):** Das Gesetz nennt kein Verfahren ("anerkannte Regeln der Technik"). Die Formel (Zylinderformel) weicht von Herstellertabellen (Uponor, λ 0,040) um bis zu 1 mm ab. Die Rechenfunktion liegt noch in `js/modules/daemmung.js`, die Oberfläche zeigt sie nicht. Einschalten erst mit einer belegten Quelle.
- **Filter-Umrechnung alt ↔ neu:** Es gibt keine exakte Umrechnung (Eurovent, Systemair). Hersteller nennen abweichende Spannen ohne Quelle.
- **Wandstärken Kupfer:** je Außendurchmesser mehrere Ausführungen (EN 1057: zum Beispiel 28×1 und 28×1,5). Der Anwender gibt die Wandstärke selbst ein. Zu Profipress gibt es kein Rohr von Viega, nur Fittings.
- **Edelstahlrohr (Sanpress) und Prestabo 12×1,2:** nicht aufgenommen (Sanpress wird im Betrieb nicht genutzt, bei 12×1,2 gibt es nur eine Quelle).
- **Mehrschichtrohr allgemein:** Größen unterscheiden sich je Hersteller (Uponor, Geberit, Viega). Hinterlegt ist nur Viega Raxofix.
- **Z-Maße anderer Fittings** (T-Stücke, Muffen, Bögen anderer Winkel, Prestabo, Raxofix, Mapress): je Fitting und System verschieden. Hinterlegt sind nur die Bögen 45° und 90° von Profipress, Prestabo XL und Mapress (88,9 und 108). Die Z-Maße sind laut Anwender bei Innen-Innen und Innen-Außen gleich. Weitere kommen nach Einzelprüfung (Katalogseite, Reiter "Z-Maße").
- Vorläufig als nicht belegbar eingeschätzt (vor einem Bau neu zu prüfen): Schellenabstände (herstellerabhängig), Voreinstellwerte beim hydraulischen Abgleich (Ventilkennlinien), Flansch-Anzugsmomente (Dichtung und Schmierung), Rohrdimensionierung nach DIN 1988-300 (kostenpflichtige Norm).

## Schrift

Barlow und Barlow Condensed, SIL Open Font License, Lizenztext in `fonts/LICENSE-Barlow.txt`.
