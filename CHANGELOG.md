# Changelog

Alle Änderungen pro Version. Neueste oben. Die Versionsnummer steht in `js/version.js`.

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
