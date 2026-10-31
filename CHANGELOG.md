# Changelog

Alle Änderungen pro Version. Neueste oben. Die Versionsnummer steht in `js/version.js`.

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
