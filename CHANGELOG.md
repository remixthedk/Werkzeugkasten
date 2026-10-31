# Changelog

Alle Änderungen pro Version. Neueste oben. Die Versionsnummer steht in `js/version.js`.

## [1.19.0] – 2026-11-01

### Neu
- **Kachel Warmwasser** (Bereich Sanitär), fünf Fragen:
  - "Welche Temperatur hat mein Wasser, wenn ich warm und kalt mische?" Mischtemperatur und Gesamtmenge aus Warm- und Kaltwasser
  - "Wie viel Warmwasser brauche ich für eine bestimmte Temperatur?" Zum Beispiel 150 Liter Badewasser mit 38 °C: Liter Warmwasser, Liter Kaltwasser, Anteil
  - "Wie viele Liter Mischwasser gibt mein Warmwasserspeicher?" Aus Speicherinhalt, Speichertemperatur, Kaltwasser und gewünschter Temperatur an der Zapfstelle (Idealfall ohne Vermischung im Speicher)
  - "Wie viel Warmwasser schafft mein Durchlauferhitzer?" Wahlweise Liter pro Minute, nötige Leistung oder erreichbare Auslauftemperatur, mit optionalem Wirkungsgrad (Elektro 100 %)
  - "Ist meine Zirkulation warm genug?" Speichertemperatur am Austritt und Temperatur am Zirkulationsrücklauf eintragen: Ergebnis "In Ordnung" oder "Nicht in Ordnung" nach DVGW W 551 (Speicher ab 60 °C, Auskühlung höchstens 5 K), mit Hinweis, was bei Abweichung zu prüfen ist
- Zu allen fünf Fragen gibt es Erklärkästen "Was bedeutet das?" (Mischwasser, Idealfall, Temperaturanhebung, Wirkungsgrad, Auskühlung, Messen, Klein- und Großanlage)

### Geprüft
- Mischrechnung über die Energiebilanz (abgegebene = aufgenommene Wärme) und als Rundlauf aller drei Mischfragen. Durchlauferhitzer gegen die bestehende Rechnung in "Wärme & Wasser" (6 kW bei 20 K = 258 l/h) und als Rundlauf (Liter/min ↔ kW ↔ Auslauftemperatur)
- Zirkulation: 5 K Auskühlung in zwei Quellen (W-551-Auszug, haustechnikdialog.de), 60 °C am Speicher in zwei Quellen. Grenzfälle getestet (genau 5 K ist erlaubt, 59,9 °C nicht)
- Die Prüfwerte sind für Großanlagen (zum Beispiel Mehrfamilienhaus, Hotel) Anforderung, für Ein- und Zweifamilienhäuser (Kleinanlage) die Empfehlung. Das steht auch in der App. Es ersetzt keine Untersuchung auf Legionellen
- Tests: 168 Logik- und 57 Oberflächentests

### Nicht enthalten
- Warmwasserbedarf und Speichergröße (DIN 4708, kostenpflichtig), Legionellenuntersuchung, Höchstgrenze für Kaltwasser, Spülzeiten

## [1.18.0] – 2026-11-01

### Neu
- **Kachel Flächen & Volumen** (Bereich Umrechnen), zwei Fragen:
  - "Wie groß ist meine Fläche?" Rechteck, Kreis, Dreieck oder Trapez. Maße wahlweise in mm, cm oder m. Dazu ein Feld **Abzug** in m² für Fenster, Türen und Aussparungen. Ergebnis in m² (bei kleinen Flächen auch cm²) mit der Rechnung in einer Zeile
  - "Wie viel Inhalt hat mein Behälter oder Raum?" Quader oder Zylinder (Speicher, Fass, Rohr). Ergebnis in Liter und m³ und **Liter je cm Füllhöhe**
- **Kachel Dreieck & Bogen** (Bereich Umrechnen), drei Fragen:
  - "Wie lang ist die dritte Seite meines Dreiecks?" Rechtwinkliges Dreieck mit Skizze. Bekannt sein dürfen Längsmaß und Quermaß, Längsmaß und Schräge, Quermaß und Schräge oder eine Seite und der Winkel α. Ergebnis: alle drei Seiten und beide Winkel
  - "Wie lang ist mein Rohrbogen?" Bogenlänge aus Radius (Rohrmitte) und Winkel, oder Radius bzw. Winkel aus den beiden anderen Werten
  - "Wie groß ist der Umfang meines Rohrs?" Durchmesser in Umfang und zurück, zum Beispiel mit dem Maßband gemessen
- Zu allen fünf Fragen gibt es Erklärkästen "Was bedeutet das?" (Abzug, Höhe beim Trapez, Länge von Mitte zu Mitte, Radius der Rohrmitte und weitere)

### Geprüft
- Reine Schulmathematik, keine Normwerte. Im Test über einen zweiten Weg gegengeprüft: Kreisfläche aus Umfang × Radius ÷ 2, Trapez als Rechteck plus Dreieck, Zylinder in cm³ gegen Liter, Quader in dm³, Pythagoras gegen Sinus und Kosinus, Bogen als Anteil am Vollkreis, Rundlauf Umfang ↔ Durchmesser. Das Dreieck (400/300 = 500 mm bei 36,87°) stimmt mit der unabhängig gerechneten Passstück-Kachel überein
- Tests: 163 Logik- und 56 Oberflächentests

### Nicht enthalten
- Dachflächen mit Neigung, Verschnitt, Teilfüllung eines liegenden Zylinders, schiefwinklige Dreiecke, Biegezugabe und Rückfederung, Radien von Fittings

## [1.17.1] – 2026-10-31

### Behoben
- **Installation auf Android (Chrome):** Manche Handys zeigten "App schon installiert" und beim Antippen "App nicht gefunden", obwohl nie installiert wurde. Die App hat jetzt eine neue Kennung (`id` und `start_url` im Manifest zeigen auf `index.html`, wie bei der Stundenapp). Chrome behandelt sie damit als neue App und ignoriert den alten Eintrag. Nicht zusätzlich getestet auf einem echten Gerät, daher bitte Rückmeldung
- Hinweis: Nach dem Update Seite einmal neu laden bzw. Chrome schließen und neu öffnen, dann im Menü nach "App installieren" schauen

## [1.17.0] – 2026-10-31

### Neu
- **Ergebnis kopieren.** Unter jedem Ergebnis steht ein Knopf "Ergebnis kopieren". Er kopiert den Namen der Kachel, die sichtbaren Eingaben und das Ergebnis als Text, zum Beispiel für WhatsApp, Mail oder das Aufmaß. Versteckte Felder werden nicht mitkopiert. Bei der Rohrsuche (nur Trefferzahl) gibt es den Knopf nicht
- **Aufheizen (Wärme & Wasser):** Die Frage "Wie lange dauert das Aufheizen mit meiner Heizleistung?" kann jetzt auch die **nötige Heizleistung** für eine gewünschte Aufheizzeit rechnen (Auswahl "Was suchst du?") und nimmt einen optionalen **Wirkungsgrad** an. Gedacht für Warmwasserspeicher: Liter, von, auf, kW. Ohne Wirkungsgrad wird wie bisher ohne Verluste gerechnet. Auskühlverluste des Speichers sind nicht erfasst

### Geprüft
- Gegenprobe im Test: Leistung aus der Zeit und Zeit aus der Leistung sind umkehrbar (500 l von 10 auf 60 °C, 2 h, 90 %). Physik wie bisher (Dichte und Wärmekapazität von Wasser aus zwei Quellen)

## [1.16.0] – 2026-10-31

### Neu
- **Kachel Gasleitung** (Bereich Rohr): "Wie groß muss meine Gasleitung sein?" Eingabe Leistung in kW, Gasart (H oder L), Rohrwerkstoff (Kupfer, Edelstahl, Stahl mit Gewinde), geschätzte Rohrlänge, Anzahl Winkel und der Druckverlust der Bauteile (voreingestellt 120 Pa). Ergebnis: kleinste passende Größe, Druckverlust im Rohr, Strömung und eine Tabelle aller Größen mit Haken und Kreuz. Gilt für Erdgas bis 110 kW hinter dem Hausdruckregler (Niederdruck). Über 110 kW zeigt die App nur den Hinweis auf die Berechnung durch das Vertragsinstallationsunternehmen
- **Brennstoff in kWh: Gasart H oder L.** Der Brennwert ist vorbelegt (H 11,5, L 9,8 kWh/m³) und lässt sich überschreiben. Solange der Richtwert steht, weist die Seite darauf hin

### Geprüft
- Gasleitung: Druckbudget 300 Pa (zwei Quellen). Gegenprobe der Rechnung am TRGI-Beispiel: 19 kW, Erdgas L, Kupfer 18 x 1: TRGI liest 9 Pa/m ab, die App rechnet 9,5 Pa/m. Zweites Beispiel: 18 kW auf 20,3 m, Kupfer 18, Verlust 176 Pa (TRGI-Beispiel etwa 183 Pa). Es gibt nur diese Gegenproben
- Kupfer-Maße nach DVGW GW 392 in zwei Quellen (DKI, eumet). Edelstahl nur Geberit-Datenblatt. Gasdaten Erdgas H in zwei Quellen, Erdgas L in einer. Bauteil-Druckverluste aus einem TRGI-Beispiel

### Nicht enthalten
- Mittel- und Hochdruck, Anlagen über 110 kW, Höhenunterschied, T-Stücke und Absperrungen, mehrere Geräte mit Gleichzeitigkeit, Kunststoff-Gasrohre

## [1.15.0] – 2026-10-31

### Neu
- **Kachel Rohrsuche** (Bereich Rohr): "Welches Rohr habe ich da?" Erst wählen, ob Stahlrohr oder Verbundrohr (Kupfer, C-Stahl und Edelstahl sind genormt und stehen bei den Rohrmaßen). Dann zwei Wege:
  - **Messen:** Außendurchmesser eintragen, Wandstärke optional, Messgenauigkeit wählen (±0,2 / ±0,5 / ±1 mm). Die App zeigt die passenden Rohre, die besten zuerst, mit Hersteller oder System, Außen-Ø, Wand und Innen-Ø
  - **Tabelle:** alle Rohre der gewählten Art nach Außendurchmesser sortiert. Filter nach Hersteller/System und nach ungefährem Außen-Ø mit Spanne (±0,5 bis ±3 mm), beide kombinierbar
- **Stahl-Siederohr** (nahtlos, DIN EN 10220) mit Zwischenmaßen: 34 Außendurchmesser von 21,3 bis 168,3 mm mit allen Wandstärken, Normalwand je DN markiert (*). In der Rohrsuche und als Werkstoff "Stahlrohr, nahtlos (Siederohr)" in Rohrgrößen, Wasserinhalt, Dämmung und Rohrgewicht
- **Verbundrohre:** Wavin Tigris (16 bis 75), TECEflex (14 bis 63, mit Größenname und Außen-Ø), Uponor (16×2,0 und 20×2,25), Rehau Rautitan stabil (16,2×2,6 und 25×3,7), Geberit Mepla (20×2,5). Viega Sanfix Fosta hat laut Viega dieselben Maße wie Raxofix und steht im Raxofix-Werkstoff
- Neue Erklärungen "Was bedeutet das?" für beide Fragen

### Geprüft
- Siederohr: Außen-Ø doppelt (rff, Mannesmann), Normalwand doppelt (Sikla, thyssenkrupp) bis DN 150. Wandreihe aus einer Quelle (rff), Gegenprobe: Gewicht je m = 0,02466 · s · (d − s) stimmt mit der Tabelle
- Verbundrohre: nur Größen mit mindestens zwei Quellen aufgenommen. Innen-Ø gerechnet

### Nicht aufgenommen (Quelle fehlt)
- Geschweißte Stahlrohre, Siederohr über DN 150 (193,7 und 219,1 mm: Quellen widersprechen sich), Sanha, Prineto, weitere Größen von Uponor, Rautitan und Mepla (nur eine Quelle)

## [1.14.0] – 2026-10-31

### Neu
- **Kachel Fehlercodes** (Bereich Heizung): Die Frage "Wo finde ich die Fehlercodes für meine Heizung?" führt zu den Unterlagen von Viessmann, Wolf, Vaillant, Remeha und Brötje. Je Hersteller gibt es, wo vorhanden, die offizielle Seite (Viessmann: Fehlercode-Tabelle, Wolf: Downloads für Profis, Brötje: Produktdokumentation, Remeha: Technischer Support) und eine Suche nur auf den Seiten des Herstellers. Mit dem Gerätenamen vom Typenschild sucht sie genau dieses Gerät. Dazu ein Hinweis auf die App Störcode
- Die Links öffnen im Browser und brauchen Internet. Es gibt bewusst keine eigenen Fehlercodes in der App
- Neue Erklärung "Was bedeutet das?" (Fehlercode, Gerätename, Wartungsanleitung)

### Geändert
- Auswahlzeilen (`.wahl`) können jetzt auch Links sein (Style für `a`)

## [1.13.0] – 2026-10-31

### Neu
- **Strom: Trafo und Netzteil.** Vierte Frage "Wie viel Strom fließt vor und hinter meinem Trafo oder Netzteil?": Spannung Eingang und Ausgang, Leistung (für Ausgang oder Eingang wählbar) und optional der Wirkungsgrad. Ergebnis: Strom auf beiden Seiten, Leistung auf beiden Seiten, Verlust und Spannungsverhältnis. Beispiel 230 V auf 12 V mit 70 W: 0,3 A am Eingang, 5,83 A am Ausgang. Der Wirkungsgrad wird von Hand eingetragen, ohne Eintrag wird ohne Verluste gerechnet
- **Stichwörter an jeder Frage.** Über jedem Fragesatz steht ein kleines Stichwort (zum Beispiel ROHRISOLIEREN, DRUCKVERLUST, OHM) für alle, die nicht den ganzen Satz lesen wollen. Gilt für alle Auswahlseiten (Rohr, Kältemittel, Wärme & Wasser, Strom, Luftkanal, Dreisatz & Prozent und die Sammelkacheln). Die Stichwörter werden auch von der Suche gefunden

### Geprüft
- Trafo: Formeln mit zwei Quellen (studyflix.de, lernhelfer.de). Gegenprobe im Test: U₁·I₁ = U₂·I₂ und Wirkungsgrad aus P Ausgang ÷ P Eingang. Kein Vorgabewert für den Wirkungsgrad, weil dafür keine belegten Werte vorliegen

## [1.12.0] – 2026-10-31

### Neu
- **Filterklassen: Neu → alt.** Neue Filter nach ISO 16890 (zum Beispiel ePM1 60 %) zeigen, zu welchen alten Klassen (G3 bis F9) sie passen können. Dafür wird der Prozentwert gegen die Eurovent-Spannen geprüft. Weil sich die Spannen überlappen, sind oft zwei Klassen möglich. Unter 50 % gibt es keine ISO-Klasse (ISO Coarse), die App weist darauf hin
- Filterklassen ist jetzt eine Sammelkachel (`k-filter`) mit zwei Fragen: "Wie gut filtert meine alte Filterklasse?" und "Welcher alten Klasse entspricht mein neuer Filter?". Favoriten wandern automatisch
- Neue Erklärung "ISO 16890 (ePM)" in der Box "Was bedeutet das?"

### Geprüft
- 50-%-Schwelle: zwei Quellen (Camfil, FläktGroup). Abrundung auf 5-%-Schritte: nur Camfil, deshalb nur als Hinweis. Gegenprobe im Test: jeder Wert innerhalb einer Spanne liefert diese Klasse

## [1.11.0] – 2026-10-31

Bedienung und Verständlichkeit nach einer Prüfung aller Bildschirme. Keine Rechnung hat sich geändert.

### Geändert
- **Passstücke:** Ohne Z-Maß zeigt das große Ergebnis "Länge Mitte zu Mitte" und einen Hinweis, dass die Zuschnittlänge noch fehlt. Vorher stand dort "Zuschnittlänge" mit dem Wert Mitte zu Mitte
- **Erklärungen passen zur Frage:** Einheiten (je Druck, Leistung, Energie, Durchfluss, Temperatur eigene Erklärung) und Brennstoff (Gas und Öl/Pellets getrennt). Neu bei Wärme & Wasser (Gewicht, Wasser aus Gas, Stoffwerte), Taupunkt und Siedepunkt bei Überhitzung und Unterkühlung, Querschnitt beim Luftkanal
- **Rohr-Check:** Die Frage heißt jetzt "Wie viel Druck geht in meinem Rohr verloren?", weil die App kein Urteil "reicht" fällt
- **Gefälle:** "Wie tief liegt mein Rohr am Ende?" hat eine eigene Ergebnis-Box
- **Fußbodenheizung:** Hinweis, dass die Zahl der Heizkreise erst mit eingetragener Höchstlänge erscheint
- **Aufheizzeit:** Fehlt die Heizleistung, steht in der Zeile "Aufheizzeit" der Hinweis "Heizleistung fehlt"
- **Dämmung:** Einbauort "Im Fußbodenaufbau, zwischen Räumen verschiedener Nutzer (6 mm)" statt "Wie vorher …", Erklärung ergänzt (Kreuzungen, Verbindungen, Verteiler)
- **Dichtheitsprüfung:** Verweis auf die Kachel Rohr statt auf das frühere "Modul Wasserinhalt"
- **Rohr-Check und Heizungsrohr:** Hinweis bei eigenem Innendurchmesser, dass verzinkter Stahl (zum Beispiel Prestabo) rauer ist und die Rechnung dafür nicht gilt
- **Eingabefelder:** Beim Antippen wird der Wert markiert, auf der Startseite steht, dass die Felder Beispielwerte enthalten
- Kleinigkeiten: "Faktor Mittenlänge ÷ Versatz" statt "Faktor L / V", Rohrgewicht ohne doppelte Wasserzeile, Passstücke mit nur einer Z-Maß-Erklärung

## [1.10.0] – 2026-10-31

Alle Kacheln arbeiten jetzt mit Fragen in ganzen Sätzen. Keine Rechnung hat sich geändert.

### Geändert
- **Passstücke, Gefälle, Brennstoff in kWh, Einheiten:** Statt Registerkarten öffnen sie mit Fragen, zum Beispiel "Wie lang muss mein Passstück bei Versatz und Winkel sein?", "Wie tief liegt mein Rohr am Ende?", "Wie viele kWh sind meine Kubikmeter Erdgas?", "Wie rechne ich einen Druck um?". Favoriten dieser Kacheln bleiben erhalten
- **Heizkörper-Leistung, Fußbodenheizung, Dichtheitsprüfung, Filterklassen:** Die Frage steht als Überschrift oben ("Wie viel Leistung hat mein Heizkörper bei anderen Temperaturen?"), "Was bedeutet das?" direkt darunter
- Hilfetexte von Passstücke, Gefälle und Einheiten ohne Verweis auf die frühere Registerleiste

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
