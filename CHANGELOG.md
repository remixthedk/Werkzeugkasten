# Changelog

Alle Änderungen pro Version. Neueste oben. Die Versionsnummer steht in `js/version.js`.

## [1.9.0] – 2026-10-31

### Neu
- **Heizungsrohr** als siebte Frage in der Kachel Rohr: "Welches Rohr brauche ich für meine Heizleistung?" Aus kW und Spreizung kommen Wassermenge, der Innendurchmesser für eine gewünschte Geschwindigkeit (Vorgabe 0,5 m/s, änderbar), die kleinste passende Größe und eine Tabelle aller Größen mit Geschwindigkeit und Druckgefälle in Pa/m. Raxofix, Kupfer oder eigener Innendurchmesser. Keine Bewertung: Die Faustwerte stehen nur als Hinweis, weil die Quellen sich widersprechen und keine Norm nennen
- **Ohmsches Gesetz** als dritte Frage im Strom-Modul: Strom, Spannung oder Widerstand aus den beiden anderen Werten, dazu die Leistung

## [1.8.0] – 2026-10-31

Drei neue Rechner.

### Neu
- **Luftwechsel** in der Kachel Luftkanal (jetzt "Luftkanal & Luftwechsel"): Wie viel Luft muss die Lüftung fördern (Raumvolumen × Luftwechsel, auch in l/s)? Wie oft wird die Luft im Raum getauscht (aus m³/h und Raumvolumen, mit Tauschzeit)? Raumvolumen aus Fläche × Höhe oder direkt eingeben. Keine Richtwerte je Raumtyp, weil sich die Quellen widersprechen
- **Strom: kW ↔ Ampere** (Umrechnen): Wie viel Strom zieht mein Gerät? Wie viel Leistung hat es bei diesem Strom? Drehstrom 400 V oder Wechselstrom 230 V, cos φ einstellbar. Formeln mit drei Quellen bestätigt. Hinweis, dass Sicherung und Kabelquerschnitt die Elektrofachkraft festlegt
- **Rohrgewicht** als sechste Frage in der Kachel Rohr: Wie schwer ist mein Rohr mit Wasser? kg je Meter und auf der Länge, getrennt in Rohr und Wasser. Rohrgewicht für Kupfer und Stahl-Gewinderohr gerechnet (Gegenprobe Sikla-Tabelle, höchstens 0,9 %), bei anderen Rohren aus dem Katalog selbst eintragen
- "Was bedeutet das?" bei allen neuen Fragen

## [1.7.0] – 2026-10-31

### Neu
- **Rohr-Check** als fünfte Frage in der Kachel Rohr: "Reicht mein Rohr für die Wassermenge?" Aus Wassermenge (l/min), Rohr und Leitungslänge kommen Fließgeschwindigkeit, Druckverlust je Meter und Druckverlust auf der Strecke. Raxofix und Kupfer zur Auswahl, sonst Innendurchmesser selbst eingeben. Kaltwasser (10 °C) und Warm-/Heizungswasser (60 °C)
- Gegenprobe mit den Druckverlusttabellen von Geberit (Abweichung höchstens 0,2 % für Kupfer und Edelstahl, Kunststoff 0,1 bis 0,9 %). Stahlrohre sind nicht enthalten, weil für sie keine bestätigte Rauheit vorliegt
- Hinweis bei mehr als 2 m/s und bei mehr als 5 m/s, mit Quellenangabe

## [1.6.0] – 2026-10-31

Zwei neue Kacheln und ein klarerer Einbauort bei der Dämmung.

### Neu
- **Luftkanal** (Lüftung & Klima): Welcher runde Kanal ersetzt meinen eckigen? Wie groß muss ein eckiger Kanal sein, der meinen runden ersetzt? Wie schnell strömt die Luft im Kanal? Formel d = 1,3 · (a·b)^0,625 / (a+b)^0,25 (gleicher Druckverlust), mit zwei Quellen und eigener Gegenrechnung abgesichert (höchstens 0,5 % Abweichung)
- **Dreisatz & Prozent** (Umrechnen): Dreisatz (gerade und umgekehrt), Prozent von einem Wert, Anteil und Veränderung in Prozent, Preis mit Aufschlag oder Rabatt, Preis netto ↔ brutto. Preise immer mit zwei Nachkommastellen, Steuersatz selbst eintragen
- Beide mit Fragen in ganzen Sätzen, Hinweisen unter den Feldern und "Was bedeutet das?"

### Geändert
- **Dämmung nach GEG:** Die Auswahl heißt jetzt "Einbauort". "Im Haus, auch Garage (Standard)" statt "Normal", "Im Freien, Außenwand (doppelt)" statt "An Außenluft grenzend". Unter der Auswahl steht ein Hinweis: Eine geschlossene, unbeheizte Garage zählt als Innenraum, die doppelte Dicke gilt nur im Freien. Das Gesetz nennt unbeheizte Räume nicht, deshalb steht in "Quelle und Prüfstand", dass es eine Auslegung ist, und der Hinweis, dass Frostschutz eine eigene Entscheidung ist. Die Mindestdicken sind unverändert

## [1.5.0] – 2026-10-31

Einfachere Bedienung für Einsteiger. Keine neuen Rechner, alle Rechnungen sind unverändert.

### Neu
- **Sammelkacheln:** Aus 16 Kacheln werden 11. **Rohr** (Maße, Wasserinhalt, Dehnung, Dämmung), **Kältemittel** (Druck, Überhitzung, Unterkühlung) und **Wärme & Wasser** (jetzt mit Volumenstrom). Sie öffnen mit großen Fragen in ganzen Sätzen, zum Beispiel "Wie viel Wasser passt in mein Rohr?"
- **"Was bedeutet das?":** Aufklappbare Erklärung der Fachbegriffe in jeder Frage und bei den Kacheln Passstücke, Gefälle, Heizkörper-Leistung, Fußbodenheizung, Dichtheitsprüfung, Filterklassen, Brennstoff und Einheiten. Bei Überhitzung und Unterkühlung ist sie von Anfang an offen
- Rohrmaterial, Größe und Kältemittel bleiben beim Wechsel zwischen den Fragen einer Sammelkachel stehen
- Eingabefelder mit Hinweis, wo der Wert zu finden ist (zum Beispiel "Niederdruckseite, meist das blaue Manometer")
- Favoriten der alten Einzelmodule wandern automatisch auf die Sammelkachel. Die Suche findet weiterhin alle alten Namen

### Geändert
- Registerkarten in Kältemittel-Druck ("Temperatur bekannt", "Druck bekannt", "Ganze Tabelle") und im Volumenstrom ("Wie viel Wasser?", "Wie viel Leistung?", "Welche Spreizung?")
- Kältemittel: Temperaturgleit von R410A heißt jetzt "etwa 0,1 K" (nachgerechnet: 0,09 bis 0,12 K bei gleichem Druck), vorher stand dort "0,1 bis 0,2 K"

## [1.4.0] – 2026-10-31

Drei neue Module im Bereich Heizung.

### Neu
- **Leistung & Volumenstrom:** Volumenstrom (l/h, l/min, m³/h) aus kW und Spreizung, und rückwärts Leistung oder Spreizung
- **Heizkörper-Leistung:** Leistung bei anderen Vor- und Rücklauftemperaturen (EN 442), Exponent n einstellbar
- **Fußbodenheizung:** Rohrlänge aus Fläche und Verlegeabstand, Heizkreise bei vorgegebener Höchstlänge, Volumenstrom je Kreis

### Behoben
- Überhitzung & Unterkühlung: Unter dem Ergebnis stand teilweise das Wort "null". Neuer Test prüft alle Module und Registerkarten darauf

### Bewusst nicht gebaut
- Ausdehnungsgefäß-Größe und Füllwasser nach VDI 2035 (siehe README)

## [1.3.0] – 2026-10-31

Drei neue Module für Klima und Trinkwasser.

### Neu
- **Kältemittel-Druck** (Lüftung & Klima): R32 und R410A. Temperatur → Überdruck, Druck → Temperatur, Tabelle von −40 bis +70 °C. Bei R410A getrennt nach Taupunkt (Dampf) und Siedepunkt (Flüssigkeit)
- **Überhitzung & Unterkühlung** (Lüftung & Klima): aus Manometerdruck und Rohrtemperatur, mit Warnung bei negativem Ergebnis. Keine Sollwerte
- **Dichtheitsprüfung** (neuer Bereich Sanitär): Prüfdruck und Prüfzeit für Trinkwasser mit Luft oder Inertgas nach ZVSHK-Merkblatt, Zeit nach Leitungsvolumen

### Bewusst nicht gebaut
- F-Gas (CO₂-Äquivalent, Prüfpflicht), Dichtheitsprüfung mit Wasser und Gas, weitere Kältemittel (siehe README)

## [1.2.2] – 2026-10-31

### Behoben
- Startseite: Die beiden Kachelspalten sind jetzt immer gleich breit. Vorher machte ein langes Wort ("Längenausdehnung") die linke Spalte breiter. Lange Kachelnamen werden bei Bedarf getrennt

## [1.2.1] – 2026-10-31

### Neu
- **Wärme & Wasser** (Heizung): Startseite mit Fragen in großen Zeilen. Wasser erwärmen (Energie in kWh und kJ), Aufheizzeit bei gegebener Leistung, Gewicht von Wasser nach Temperatur (Liter in kg), Wasser aus Erdgas (etwa 1,6 l je m³), Stoffwerte zum Nachschlagen (Wasser nach Temperatur, Luft, Kupfer, Stahl). Die Temperaturen bleiben beim Wechsel zwischen den Fragen erhalten
- **Updates:** Die App fragt beim Start und bei jeder Rückkehr aus dem Hintergrund nach einer neuen Version, und `version.js` wird nicht mehr zwischengespeichert. Das Manifest hat eine feste App-Kennung (`id`)

### Bewusst nicht gebaut
- Verdampfungs- und Schmelzwärme, Edelstahl-Stoffwerte, Wärmeleitfähigkeit: fehlende oder widersprüchliche Quellen (siehe README)

## [1.2.0] – 2026-10-31

Fünf neue Module.

### Neu
- **Einheiten** (neuer Bereich "Umrechnen"): Druck, Leistung, Energie, Durchfluss, Temperatur
- **Wasserinhalt Rohr:** Liter je Meter und Gesamtinhalt, Rohrauswahl wie bei der Dämmung
- **Längenausdehnung:** Raxofix, Prestabo, Mapress Edelstahl und C-Stahl, Kupfer, Stahl, oder eigener Wert
- **Gefälle:** Prozent, cm/m, 1 : n, Winkel und Höhenunterschied
- **Brennstoff in kWh:** Gas (m³ × Zustandszahl × Brennwert) und Öl, Pellets, Flüssiggas (Menge × Energiegehalt). Zustandszahl und Brennwert gibt der Anwender ein

### Bewusst nicht gebaut
- Mindestgefälle für Abwasser: keine zwei unabhängigen Quellen, Angaben widersprechen sich (siehe README)
- Feste Brennwerte: schwanken je Versorger

### Hinweise zum Prüfstand
- Wasserinhalt Prestabo gegen die Viega-Tabelle geprüft: 7 von 8 Größen gleich, bei 15×1,2 nennt Viega 0,13 gegen gerechnete 0,125 l/m
- Wasserinhalt Raxofix ist gerechnet und kann bei 25, 32, 63 mm bis etwa 4 % zu niedrig sein (im Modul vermerkt)

## [1.1.4] – 2026-10-31

### Neu
- **Passstücke:** Z-Maße für Geberit Mapress Bogen 90° und 45° (88,9 und 108 mm, Edelstahl und C-Stahl)

### Geändert
- Prestabo XL Bogen 45°: Name ohne Zusatz, Hinweis zum Einschubende entfernt (Z-Maß gilt laut Anwender für Innen-Innen und Innen-Außen gleich)
- Prüfliste, Quelle und Hilfetext aktualisiert

## [1.1.3] – 2026-10-31

### Neu
- **Passstücke:** Z-Maße für Viega Prestabo XL (64, 76,1, 88,9, 108 mm): Bogen 90° und Bogen 45° (Pressmuffe + Einschubende, Z gilt für die Muffenseite, Hinweis in der App)
- Prüfliste, Quelle und Hilfetext aktualisiert

## [1.1.2] – 2026-10-31

Rohrauswahl nach den Systemen im Betrieb, Z-Maße für Profipress-Bögen.

### Neu
- **Passstücke:** Fitting und Größe wählen, das Z-Maß wird für beide Bögen eingesetzt. Hinterlegt: Profipress Bogen 45° und 90° (Größen 12 bis 54), jeweils aktuelle Ausführung und Vorgängerversion. Die Felder bleiben von Hand änderbar, zum Beispiel für ein anderes Fitting am zweiten Ende
- **Rohrauswahl (Dämmung und Rohrgrößen):** Viega Prestabo (15 bis 54, 64, 76,1) und Geberit Mapress XL (88,9 und 108) mit Wand und Innen-Ø
- Prüfliste und Quellen für die neuen Werte in README und im Modul

### Geändert
- Kupfer nur noch 12 bis 54 mm (Profipress), Wandstärke wird eingegeben
- Werkstoffreihenfolge: Raxofix, Prestabo, Mapress XL, Kupfer, Stahl-Gewinderohr, Rohrgewinde. Raxofix ist in den Rohrgrößen vorausgewählt
- Beispiel in der Beschreibung der Passstücke mit echten Z-Maßen (Profipress 22 mm, Bogen 45°: 402,3 mm)

### Entfernt
- Edelstahlrohr (Sanpress) aus der Rohrauswahl

## [1.1.1] – 2026-10-31

Prüfdurchgang der bestehenden Module, Favoriten, Suche, getrennte Rohrauswahl.

### Neu
- **Favoriten:** Stern auf jeder Kachel und im Kopf eines geöffneten Moduls. Favoriten stehen oben auf der Startseite und bleiben auf dem Gerät gespeichert
- **Suchfeld** auf der Startseite (findet auch Alltagsbegriffe und "daemmung" für Dämmung)
- **Quelle und Prüfstand** unten in jedem Modul (aufklappbar)
- **Dämmung:** Rohrauswahl erst Material, dann Größe. Bei Kupfer und Edelstahl wird die Wandstärke eingegeben, der Innendurchmesser daraus gerechnet
- **Viega Raxofix** als Mehrschichtrohr (16×2,2 bis 63×4,5)
- README: Qualitätsregel, Prüfliste mit Quellen, Liste der bewusst nicht gebauten Funktionen

### Geändert
- **Filter-Umrechner wird zur Tabelle "Filterklassen":** nur noch die Eurovent-Spannen, keine Umrechnung alt ↔ neu (es gibt keine exakte Umrechnung)
- **Dämmung:** Umrechnung auf anderes λ ausgeblendet, weil das Gesetz kein Verfahren nennt und die Formel nicht belegt ist. Die Werte gelten für λ 0,035
- **Rohrgrößen:** Kupfer und Edelstahl zeigen nur noch den Außendurchmesser (Edelstahl mit DN), weil die Wandstärken je Ausführung verschieden sind
- **Passstücke:** Z-Maß nach der Viega-Maßzeichnung erklärt (Fittingmitte bis Anschlagfläche im Fitting, Einstecktiefe enthalten), mit Hinweis auf den Viega-Online-Katalog
- Tabellenköpfe nicht mehr in Großbuchstaben (richtig: ePM1 statt EPM1)

### Entfernt
- Allgemeine Mehrschichtrohr-Liste (Größen waren nur von Geberit, Hersteller unterscheiden sich)
- Wandstärken bei Kupfer (28×1 und 28×1,5 existieren beide) und Edelstahl (keine zweite Quelle)

## [1.1.0] – 2026-10-31

Neues Design, Bereiche und Beschreibungen.

### Neu
- **Bereiche auf der Startseite:** Rohr & Montage, Heizung, Sanitär, Lüftung & Klima. Bereiche ohne Modul werden ausgeblendet. Jedes Modul sagt in seiner Datei mit `bereich`, wohin es gehört; die Liste der Bereiche steht in `js/modulliste.js`
- **Aufklappbare Beschreibung in jedem Modul** ("Wofür ist das und wie benutze ich es?"): Wofür, So benutzt du es, Beispiel, Hinweis. Standardmäßig zugeklappt, oben im Modul. Pflicht für jedes neue Modul (Feld `hilfe`)
- Design wie die Handy-App vom Schwarzen Brett: dunkel, orange Akzent, große Bedienflächen, Umschalter und Karten im gleichen Stil
- Schrift Barlow und Barlow Condensed, lokal im Ordner `fonts/` (SIL Open Font License, Lizenz liegt bei) und im Offline-Cache

### Geändert
- Hell/Dunkel-Automatik entfällt, die App ist durchgehend dunkel (wie das Brett)
- App-Icon, Statusleistenfarbe und Manifest in Dunkel mit orangem Akzent
- Skizze bei den Passstücken in der neuen Akzentfarbe

### Behoben
- Auf der Startseite und unter den Ergebnissen bei Dämmung und Passstücken wurde manchmal das Wort "null" angezeigt (leere Elemente wurden als Text eingefügt)

## [1.0.0] – 2026-10-30

Erste Version.

### Neu
- Grundgerüst als PWA: Startseite mit Kacheln, Navigation, helles und dunkles Design, Offline-Betrieb über Service Worker, Hinweis bei neuer Version
- Modulsystem: ein Modul pro Datei, Daten getrennt von der Logik, Modulliste in `js/modulliste.js`
- Modul **Filter-Umrechner**: EN 779 ↔ ISO 16890 in beide Richtungen, Gesamttabelle (Quelle Eurovent 4/23-2022)
- Modul **Dämmung nach GEG**: Mindestdicke nach Anlage 8 für Heizung/Warmwasser und Kälte/Kaltwasser, Einbausituationen (Durchbruch, verschiedene Nutzer, Fußboden, Außenluft), Umrechnung auf anderes λ, Rohrauswahl aus Liste
- Modul **Rohrgrößen**: Stahl, Kupfer, Edelstahl, Mehrschicht, Rohrgewinde mit Suche; Zoll ↔ Millimeter
- Modul **Passstücke**: Zuschnitt bei Versatz mit beliebigem Winkel und Z-Maßen, Berechnung auch aus Längs- und Quermaß
- README mit Aufbau, Anleitung für neue Module, Update-Ablauf und Datenquellen
