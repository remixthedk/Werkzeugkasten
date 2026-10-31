# Changelog

Alle Änderungen pro Version. Neueste oben. Die Versionsnummer steht in `js/version.js`.

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
