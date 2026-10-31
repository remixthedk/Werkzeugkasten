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
| Rohr & Montage | **Wasserinhalt Rohr** | Liter je Meter und Gesamtinhalt aus dem Innen-Ø (Rohrauswahl wie bei der Dämmung oder Innen-Ø selbst eingeben) |
| Rohr & Montage | **Längenausdehnung** | Dehnung in mm aus Länge und Temperaturunterschied für Raxofix, Prestabo, Mapress Edelstahl und C-Stahl, Kupfer, Stahl; auch mit eigenem α |
| Rohr & Montage | **Gefälle** | Prozent, cm/m, 1 : n und Winkel ineinander umrechnen; Höhenunterschied bei gegebener Länge (und zurück). Keine Normwerte |
| Heizung | **Brennstoff in kWh** | Gas: m³ × Zustandszahl × Brennwert (und zurück), Öl, Pellets, Flüssiggas: Menge × Energiegehalt. Zustandszahl und Brennwert gibt der Anwender ein, es sind keine Richtwerte hinterlegt |
| Umrechnen | **Einheiten** | Druck (Pa, mbar, bar, mWS, psi …), Leistung (W, kW, kcal/h, BTU/h), Energie (J, kWh, kcal, BTU …), Durchfluss (l/s, l/min, m³/h …), Temperatur (°C, K, °F) |
| Heizung | **Leistung & Volumenstrom** | l/h aus kW und Spreizung, kW aus l/h und Spreizung, Spreizung aus kW und l/h (1,163 Wh/(kg·K), nur Wasser) |
| Heizung | **Heizkörper-Leistung** | Leistung bei anderen Vor- und Rücklauftemperaturen nach EN 442 (logarithmische Übertemperatur), Exponent n als Eingabe (Vorgabe 1,3) |
| Heizung | **Fußbodenheizung** | Rohrlänge aus Fläche und Verlegeabstand, Zu- und Rückleitung, Heizkreise bei vorgegebener Höchstlänge, Volumenstrom je Kreis. Nur Geometrie |
| Heizung | **Wärme & Wasser** | Startseite mit Fragen in großen Zeilen: Wasser erwärmen (Energie in kWh), Aufheizzeit, Gewicht von Wasser nach Temperatur, Wasser aus Erdgas, Stoffwerte (Wasser, Luft, Kupfer, Stahl). Mit mittlerer Wärmekapazität aus der Wassertabelle |
| Sanitär | **Dichtheitsprüfung** | Trinkwasser mit Luft oder Inertgas: Dichtheitsprüfung 150 mbar, Prüfzeit aus dem Leitungsvolumen (120 min bis 100 l, +20 min je angefangene 100 l), Belastungsprüfung höchstens 3 bar (bis DN 50) bzw. 1 bar (bis DN 100), 10 min. Nur Luft-Teil, keine Wasser- oder Gasprüfung |
| Lüftung & Klima | **Kältemittel-Druck** | R32 und R410A: Überdruck zu Sättigungstemperatur und umgekehrt, Tabelle −40 bis +70 °C. Bei R410A Tau- und Siedepunkt getrennt |
| Lüftung & Klima | **Überhitzung & Unterkühlung** | Aus Manometerdruck und Rohrtemperatur, R32 und R410A. Keine Sollwerte hinterlegt |
| Lüftung & Klima | **Filterklassen** | Tabelle der Eurovent-Spannen: RLT-Filter EN 779 (G3 bis F9) und ISO 16890 (ePM1, ePM2,5, ePM10). Keine Umrechnung |

Bereiche: Rohr & Montage, Heizung, Sanitär, Lüftung & Klima, Umrechnen. Ein Bereich ohne Modul wird nicht angezeigt.

### Qualitätsregel

Ein Modul wird nur gebaut, wenn jeder Wert aus mindestens zwei unabhängigen Quellen bestätigt ist und jede Formel auf einem zweiten Rechenweg gegengeprüft wurde. Bei Unklarheit wird das Modul nicht gebaut, sondern gemeldet. Vor jedem Bau wird die Modulliste einzeln freigegeben.

Geplant (Reihenfolge, je Stufe erst nach Prüfung und Freigabe): Ausdehnungsvolumen (nur Teil), hydraulischer Abgleich, Füllwasser VDI 2035, Heizlast aus Verbrauch, Trinkwasserhygiene, Wasserhärte, Warmwasserbedarf, Kanal rund ↔ eckig, Luftwechsel, Klimagerät-Leistung, Kondensat, Biegemaße, Aufmaß.

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
   - `bereich`: Kennung eines Bereichs aus `WK.BEREICHE` (`rohr`, `heizung`, `sanitaer`, `lueftung`, `allgemein`). Ein neuer Bereich wird in `js/modulliste.js` ergänzt.
   - `quelle` (**Pflicht**): Liste von Absätzen für "Quelle und Prüfstand" unten im Modul (welche Quellen, was bestätigt ist, was bewusst fehlt).
   - `stichworte` (optional): Suchbegriffe für das Suchfeld auf der Startseite, zum Beispiel Alltagsnamen wie "isolierung".
   - `hilfe` (**Pflicht**): die aufklappbare Beschreibung `{ wofuer, schritte: [...], beispiel, hinweis }`. Einfache Sprache, Fachbegriffe erklären, ein Beispiel mit echten Zahlen. Die App baut daraus die Karte oben im Modul.
2. Falls Daten nötig sind: `js/data/<name>.js` anlegen.
3. In `js/modulliste.js` einen Eintrag mit `id` und allen Dateien ergänzen. Der Service Worker liest diese Liste, die Datei muss nirgends sonst eingetragen werden.
4. Hinweis beim Programmieren: Beim Befüllen von Elementen kein `null` an `replaceChildren` übergeben, sonst erscheint das Wort "null" auf der Seite. Leere Einträge vorher mit `.filter(Boolean)` entfernen.
5. Versionsnummer in `js/version.js` erhöhen und Eintrag im `CHANGELOG.md` ergänzen.

## Update ausliefern

- Dateien ins Repo, `js/version.js` hochzählen. Ohne neue Versionsnummer bleibt auf den Handys der alte Offline-Stand.
- Die App fragt beim Start und bei jeder Rückkehr aus dem Hintergrund (höchstens alle 30 Sekunden) nach einer neuen Version, auch `version.js` kommt immer frisch vom Server (`updateViaCache: 'none'`). Eine neue Version wird im Hintergrund geladen, dann erscheint der Hinweis "Neue Version geladen" mit Knopf zum Neuladen.
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
| Einheiten | bar (100.000 Pa), kWh (3,6 MJ), kcal IT (4,1868 kJ), mmWS (9,80665 Pa) | exakt definiert, bestätigt | NIST Guide to the SI (Anhang B.8); mmWS auch chemie.de |
| Einheiten | BTU IT = 1055,056 J, psi = 6894,757 Pa | NIST; Gegenprobe MIT-Umrechnungsblatt (1055 J), psi aus lbf und Zoll nachgerechnet | NIST, MIT |
| Einheiten | Durchfluss, Temperatur | reine Faktoren bzw. Definitionen (0 °C = 273,15 K = 32 °F), im Test geprüft | Definition |
| Wasserinhalt | Formel π·d²/4 × Länge | Gegenprobe Viega-Tabelle Prestabo: 7 von 8 Größen gleich auf zwei Stellen; 15×1,2: Viega 0,13, gerechnet 0,125 l/m (Rundung in der Viega-Tabelle). Mapress 88,9: 5,66 l/m wie in der Geberit-Ausschreibung | Viega Gebrauchsanleitung Prestabo, Heinze (Geberit) |
| Wasserinhalt | Raxofix | gerechnet, Viega nennt keinen Wert. Bei 25, 32, 63 mm bis etwa 4 % zu niedrig (Innen-Ø bis 0,4 mm größer), im Modul vermerkt | Viega, Händlerangaben |
| Längenausdehnung | Raxofix 0,03 mm/(m·K) | Viega-Gebrauchsanleitung (Beispiel 30 mm bei 20 m und 50 K im Test nachgerechnet); Nussbaum-Datenblatt Mehrschichtverbund ebenfalls 0,03 | Viega, Nussbaum |
| Längenausdehnung | Stahl / Prestabo / Mapress C-Stahl / Gewinderohr 0,012 | bestätigt in vier Quellen | Viega Prestabo, Heinze (Geberit), BauNetz Wissen, Nussbaum |
| Längenausdehnung | Mapress Edelstahl 1.4401 0,0165 | bestätigt | Geberit-Produktdaten, Nussbaum |
| Längenausdehnung | Kupfer 0,0166 | Viega-Gebrauchsanleitung; BauNetz Wissen nennt 0,017 (gerundet) | Viega Profipress, BauNetz Wissen |
| Gefälle | Prozent, cm/m, 1 : n, Winkel, Höhe | reine Geometrie, im Test gegengerechnet (2 % = 1 : 50 = 1,146°) | Rechnung |
| Brennstoffe | kWh = m³ × Zustandszahl × Brennwert | bestätigt, Beispiel Stadtwerke Walldorf (3.500 m³ → 38.111 kWh) nachgerechnet | DVGW G 685 laut Bonn-Netz, Stadtwerke Walldorf |
| Wärme & Wasser | Dichte Wasser 0 bis 100 °C (10-K-Stufen, dazwischen linear) | bestätigt in zwei Quellen, Abweichung höchstens 0,1 kg/m³, im Test gegengeprüft | engineeringtoolbox.com, chemie.de |
| Wärme & Wasser | Spezifische Wärmekapazität Wasser | IAPWS-95-Tabelle, Gegenprobe chemie.de: bei 0 °C 0,25 % Abweichung, sonst unter 0,1 %. Gerechnet mit dem Mittelwert zwischen Start- und Zieltemperatur. Faustformel 1,163 Wh/(kg·K) stimmt bei 60 bis 80 °C auf 0,1 % | chem-casts.com (IAPWS-95), chemie.de |
| Wärme & Wasser | Luft: c 1,005 kJ/(kg·K), Dichte 1,204 kg/m³ bei 20 °C | bestätigt (c in drei Quellen; Dichte chemie.de, mit Gasgleichung gegengerechnet) | ISB Bayern, chemie.de, Wikibooks |
| Wärme & Wasser | Kupfer 0,38 und Stahl 0,47 kJ/(kg·K) | bestätigt (0,381 / 0,382 bzw. 0,477 / 0,47), Richtwerte, je Legierung leicht verschieden | chemie.de, Wikibooks, ISB Bayern |
| Wärme & Wasser | Wasser aus Erdgas, etwa 1,6 l je m³ (Normzustand) | Verbrennungsgleichung nachgerechnet (1,6075 kg je m³ Methan) und SBZ-Artikel (1,63 l). Theoretischer Höchstwert | SBZ Monteur |
| Kältemittel-Druck | Sättigungsdruck R32 und R410A, −40 bis +70 °C (1-K-Stufen, dazwischen ln p linear) | CoolProp 7 (Referenzzustandsgleichungen). Gegenprobe an Arkema Forane (NIST REFPROP 10) und Chadwell Supply A2L-PT-Chart bei 0, 10, 20, 37,8 °C: höchstens 0,04 % Abweichung (Rundung der psig-Werte). Interpolation bei halben Grad und Rückrechnung Druck → Temperatur gegen CoolProp direkt im Test geprüft | Arkema Forane, Chadwell Supply, CoolProp |
| Kältemittel-Druck | Überdruck = absolut − 1,01325 bar; Taupunkt (Dampf) und Siedepunkt (Flüssigkeit) bei R410A getrennt | Definition; Gleit bei R410A 0,1 bis 0,2 K, beide Seiten in der Gegenprobe bestätigt | Chadwell (Flüssigkeits- und Dampfdruck), CoolProp |
| Überhitzung & Unterkühlung | Überhitzung = T − Taupunkt bei Saugdruck, Unterkühlung = Siedepunkt bei Hochdruck − T | Definition (Kältetechnik), zweiter Rechenweg im Test: Druck zu bekannter Sättigungstemperatur → Ergebnis genau die vorgegebene Differenz. Sollwerte absichtlich nicht hinterlegt | Rechnung, Kältemittel-Drucktabelle |
| Dichtheitsprüfung | Luft: 150 mbar, 120 min bis 100 l, +20 min je weitere 100 l; Belastung 3 bar bis DN 50, 1 bar DN 50 bis 100, 10 min | TECE und Conex Banninger (Quelle ZVSHK) stimmen überein, Beispiel 300 l = 160 min. Das Merkblatt (ZVSHK, Januar 2017, T82/1-1:2017-01, laut DIN aktuell) wurde nicht im Original eingesehen. Abweichende Zahlen bei Wavin (30 min, +10), einem älteren SBZ-Artikel (110 mbar) und Österreich (60 min) gelten als ältere oder andere Fassung | TECE, Conex Banninger, DIN-Eintrag, Wavin, SBZ Monteur, Geberit AT |
| Leistung & Volumenstrom | l/h = W × 0,86 ÷ K (= W ÷ (1,163 × K)) | zwei Quellen mit nachgerechneten Beispielen (10 kW/5 K = 1.720 l/h, 6 kW/10 K = 516 l/h, 1,2 kW/5 K = 206 l/h). Zweiter Weg mit c(T) und Dichte der Wassertabelle: höchstens 2 % Abweichung (Dichte), im Test | energiefluss24, SBZ Monteur |
| Heizkörper-Leistung | Φ = Φ_Norm × (ΔT ÷ ΔT_Norm)^n, logarithmische Übertemperatur, ΔT_Norm 49,83 K bei 75/65/20 | zwei Quellen für die Formel, SBZ-Beispiel 511 W nachgerechnet (SBZ nennt einmal 551 W, Druckfehler). n ist Eingabe (1,3), weil es je Typ und Hersteller 1,27 bis 1,36 gibt (Vogel & Noot). Richtwert, bei 55/45 etwa 3 % Einfluss von n | SBZ Monteur, Caleffi, Vogel & Noot |
| Fußbodenheizung | Rohrlänge = Fläche ÷ Verlegeabstand; Zuleitung 2 × Entfernung je Kreis; Kreise = aufgerundet | reine Geometrie, Gegenrechnung 100 ÷ Abstand in cm im Test. Volumenstrom wie im Modul Leistung & Volumenstrom. Höchste Heizkreislänge ist Eingabe, nicht hinterlegt (hängt vom Hersteller ab, Beispielquelle 100 bis 120 m) | Rechnung, hydraulischer-abgleich.de |

### Bewusst nicht gebaut oder entfernt

- **Umrechnung auf anderes λ (Dämmung):** Das Gesetz nennt kein Verfahren ("anerkannte Regeln der Technik"). Die Formel (Zylinderformel) weicht von Herstellertabellen (Uponor, λ 0,040) um bis zu 1 mm ab. Die Rechenfunktion liegt noch in `js/modules/daemmung.js`, die Oberfläche zeigt sie nicht. Einschalten erst mit einer belegten Quelle.
- **Filter-Umrechnung alt ↔ neu:** Es gibt keine exakte Umrechnung (Eurovent, Systemair). Hersteller nennen abweichende Spannen ohne Quelle.
- **Wandstärken Kupfer:** je Außendurchmesser mehrere Ausführungen (EN 1057: zum Beispiel 28×1 und 28×1,5). Der Anwender gibt die Wandstärke selbst ein. Zu Profipress gibt es kein Rohr von Viega, nur Fittings.
- **Edelstahlrohr (Sanpress) und Prestabo 12×1,2:** nicht aufgenommen (Sanpress wird im Betrieb nicht genutzt, bei 12×1,2 gibt es nur eine Quelle).
- **Mehrschichtrohr allgemein:** Größen unterscheiden sich je Hersteller (Uponor, Geberit, Viega). Hinterlegt ist nur Viega Raxofix.
- **Z-Maße anderer Fittings** (T-Stücke, Muffen, Bögen anderer Winkel, Prestabo, Raxofix, Mapress): je Fitting und System verschieden. Hinterlegt sind nur die Bögen 45° und 90° von Profipress, Prestabo XL und Mapress (88,9 und 108). Die Z-Maße sind laut Anwender bei Innen-Innen und Innen-Außen gleich. Weitere kommen nach Einzelprüfung (Katalogseite, Reiter "Z-Maße").
- **Mindestgefälle Abwasser (DIN 1986-100, DIN EN 12056, DIN EN 752):** nicht gebaut. Gefunden wurden nur Artikel desselben Verlags (SBZ), und beide nennen für Anschlussleitungen unterschiedliche Werte (unbelüftet 1 cm/m bzw. gar nicht aufgeführt). Die Normen selbst sind kostenpflichtig. Das Modul Gefälle rechnet deshalb nur um.
- **Feste Richtwerte für Brennwerte (Gas, Öl, Pellets, Flüssiggas):** nicht hinterlegt. Die Werte schwanken je Versorger und Lieferung, deshalb trägt der Anwender sie aus der Rechnung oder dem Datenblatt ein.
- **Wasserinhalt Raxofix aus Herstellerangabe:** Viega nennt keinen Wert in der Gebrauchsanleitung, deshalb gerechnet mit Hinweis.
- **Verdampfungs- und Schmelzwärme von Wasser:** nicht aufgenommen. Die Quellen weichen ab (Schmelzwärme 332,5 bis 334 kJ/kg), eine zweite Bestätigung für 2257 kJ/kg fehlt.
- **Stoffwerte Edelstahl, Dichte von Stahl und Kupfer, Wärmeleitfähigkeit:** nicht aufgenommen (fehlende oder nur eine Quelle). Glykol-Gemische und Dämmstoffe: Werte hängen vom Produkt ab, nur aus dem Datenblatt.
- **Praktische Kondensatmenge im Brennwertkessel:** nicht hinterlegt (hängt von der Rücklauftemperatur ab, die einzige Quelle ist ein KI-generierter Ratgeber).
- **F-Gas: CO₂-Äquivalent und Prüfpflicht:** nicht gebaut (vom Anwender abgelehnt; die GWP-Werte hängen von der Fassung der EU-Verordnung 2024/573 ab und müssten im Verordnungstext geprüft werden).
- **Dichtheitsprüfung mit Wasser:** nicht gebaut. Die Quellen nennen uneinheitliche Zeiten und Drücke (11 bar mit 30 min bei Conex, andere Staffelung bei TECE, 3 bar mit 10 min bei Wavin). Gasleitungen sind ausgeschlossen.
- **Sollwerte für Überhitzung und Unterkühlung:** nicht hinterlegt, sie hängen vom Gerät ab (Herstelleranleitung).
- **Weitere Kältemittel (R290, R454B …):** nicht aufgenommen, im Betrieb nur R32 und R410A.
- **Ausdehnungsgefäß (Gefäßgröße):** nicht gebaut. Die Ausdehnungstabelle (2,22 % bei 70 °C, 2,81 % bei 80 °C, 3,47 % bei 90 °C) stimmt bei Viessmann und Watts überein, weicht aber bei 30 bis 50 °C bis 0,26 Prozentpunkte von der Wasserphysik ab. Die Wasservorlage zwischen 12 und 18 l ist ungeklärt, die Formel für den höchsten Fülldruck widerspricht sich, die l/kW-Werte stammen aus einer Quelle. Möglich bliebe nur ein reiner Rechner für das Ausdehnungsvolumen (50 bis 90 °C).
- **Füllwasser VDI 2035 (Ausgabe 2021):** nicht gebaut. Die Härte-Tabelle ist in den Quellen nicht sauber lesbar (SYR-Tabelle durcheinander, Reflex nennt die Grenzwerte nicht). Das Original wird gebraucht.
- **Heizkörperexponent je Typ:** nicht hinterlegt (je Hersteller und Typ 1,27 bis 1,36), deshalb Eingabefeld mit 1,3.
- **Höchste Heizkreislänge, Heizleistung je Verlegeabstand (DIN EN 1264):** nicht hinterlegt, Herstellerwerte.
- Vorläufig als nicht belegbar eingeschätzt (vor einem Bau neu zu prüfen): Schellenabstände (herstellerabhängig), Voreinstellwerte beim hydraulischen Abgleich (Ventilkennlinien), Flansch-Anzugsmomente (Dichtung und Schmierung), Rohrdimensionierung nach DIN 1988-300 (kostenpflichtige Norm).

## Schrift

Barlow und Barlow Condensed, SIL Open Font License, Lizenztext in `fonts/LICENSE-Barlow.txt`.
