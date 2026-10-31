// Erklärungen der Fachbegriffe ("Was bedeutet das?"), in einfachen ganzen Sätzen.
// Schlüssel: Modul-ID, bei Sammelkacheln "<Kachel>/<Frage>". Wird nur angezeigt, wenn es einen Eintrag gibt.
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};

  const INNEN = { b: 'Innendurchmesser', t: 'Das Maß innen im Rohr, durch das das Wasser fließt: Außendurchmesser minus zweimal die Wandstärke. Bei einem Rohr 22 × 1,5 sind das 19 mm.' };
  const KELVIN = { b: 'Kelvin (K)', t: 'Kelvin gibt einen Temperaturunterschied an. Ein Unterschied von 1 K ist genau so groß wie ein Unterschied von 1 °C. Von 10 °C auf 70 °C sind es also 60 K.' };
  const SPREIZUNG = { b: 'Spreizung', t: 'Der Temperaturunterschied zwischen Vorlauf (warmes Wasser zum Heizkörper) und Rücklauf (abgekühltes Wasser zurück zum Kessel). Bei 55 °C Vorlauf und 35 °C Rücklauf beträgt die Spreizung 20 K.' };
  const VOLUMENSTROM = { b: 'Volumenstrom', t: 'Wie viele Liter Wasser in einer Stunde durch die Leitung fließen, angegeben in l/h. Je mehr Leistung transportiert werden soll und je kleiner die Spreizung ist, desto mehr Wasser muss fließen.' };
  const UEBERDRUCK = { b: 'Überdruck (bar Ü)', t: 'Die Manometer an der Anlage zeigen den Überdruck, also den Druck über dem Luftdruck draußen. In Tabellen steht oft der absolute Druck. Die App rechnet das für dich um.' };
  const SAETT = { b: 'Sättigungstemperatur', t: 'Zu jedem Druck gehört bei einem Kältemittel eine feste Temperatur, bei der es verdampft oder wieder flüssig wird. Steigt der Druck, steigt auch diese Temperatur. Genau dieser Zusammenhang steht in der Tabelle dieser Kachel.' };
  const TYPENSCHILD = { b: 'Welches Kältemittel?', t: 'Das Kältemittel steht auf dem Typenschild der Anlage, zum Beispiel R32 oder R410A.' };

  WK.data.erklaerungen = {
    // ---- Rohr ----
    'rohr/rohrgroessen': [
      { b: 'Außendurchmesser und Wandstärke', t: 'Ein Rohr wird mit Außendurchmesser mal Wandstärke angegeben. Bei 22 × 1,5 ist das Rohr außen 22 mm dick und die Wand 1,5 mm stark.' },
      INNEN,
      { b: 'Nennweite (DN)', t: 'Die Nennweite ist eine ungefähre Größenangabe und muss nicht genau dem Durchmesser des Rohrs entsprechen. Sie dient zum Vergleichen von Rohren und Armaturen.' }
    ],
    'rohr/wasserinhalt': [
      INNEN,
      { b: 'Liter je Meter', t: 'Wie viel Wasser in einem Meter Rohr steckt. Daraus wird der Inhalt für die ganze Länge gerechnet, zum Beispiel für die Füllmenge einer Anlage.' }
    ],
    'rohr/ausdehnung': [
      { b: 'Längenausdehnung', t: 'Rohre werden länger, wenn sie warm werden, und kürzer, wenn sie abkühlen. Bleibt dafür kein Platz, entstehen Spannungen und Geräusche.' },
      { b: 'Temperaturunterschied', t: 'Entscheidend ist der Unterschied zwischen der Temperatur beim Einbau und der Temperatur im Betrieb. Wurde bei 10 °C eingebaut und läuft die Anlage mit 70 °C, sind es 60 K.' },
      KELVIN,
      { b: 'Ausdehnungskoeffizient α', t: 'Er sagt, um wie viele Millimeter sich ein Meter Rohr verlängert, wenn es um 1 K wärmer wird. Kunststoff-Verbundrohr dehnt sich stärker aus als Stahl.' }
    ],
    'rohr/daemmung': [
      { b: 'GEG', t: 'Das Gebäudeenergiegesetz schreibt vor, wie dick die Dämmung von Rohren für Heizung und Warmwasser mindestens sein muss, damit wenig Wärme verloren geht.' },
      { b: 'Einbausituation', t: 'Die Mindestdicke hängt davon ab, wo das Rohr liegt. "Normal" ist der Standardfall. Im Wand- oder Deckendurchbruch gilt die halbe Dicke, an der Außenluft die doppelte.' },
      { b: 'Wärmeleitfähigkeit λ', t: 'Die angezeigten Dicken gelten für einen Dämmstoff mit λ 0,035 W/(m·K). Den Wert findest du auf der Verpackung oder im Datenblatt des Dämmstoffs.' },
      INNEN
    ],
    // ---- Kältemittel ----
    'kaelte/druck': [SAETT, UEBERDRUCK, TYPENSCHILD,
      { b: 'Taupunkt und Siedepunkt (R410A)', t: 'R410A ist eine Mischung. Deshalb gibt es zwei Werte: den Taupunkt, an dem das Kältemittel gerade ganz gasförmig ist, und den Siedepunkt, an dem es gerade ganz flüssig ist. Der Unterschied ist mit etwa 0,1 K sehr klein. R32 hat nur einen Wert.' }],
    'kaelte/ueber': [
      { b: 'Überhitzung', t: 'Das Kältemittel verdampft im Verdampfer. Die Überhitzung sagt, wie viel wärmer das Gas am Ende der Saugleitung ist als die Temperatur, bei der es verdampft ist. Sie wird in Kelvin angegeben. Ist sie zu klein, kann noch flüssiges Kältemittel in den Verdichter gelangen. Ist sie zu groß, wird der Verdampfer nicht gut genutzt.' },
      { b: 'So gehst du vor', t: '1. Kältemittel wählen. 2. Druck am Manometer der Saugseite (Niederdruck) ablesen. 3. Temperatur mit dem Anlegefühler an der Saugleitung messen. Die App sucht die Verdampfungstemperatur zum Druck und zieht sie von deiner Messung ab.' },
      KELVIN, UEBERDRUCK, TYPENSCHILD
    ],
    'kaelte/unter': [
      { b: 'Unterkühlung', t: 'Im Verflüssiger wird das Gas wieder flüssig. Die Unterkühlung sagt, wie viel kälter die Flüssigkeit am Ausgang ist als die Temperatur, bei der sie flüssig geworden ist. Sie zeigt, dass das Kältemittel vollständig flüssig zum Expansionsventil kommt.' },
      { b: 'So gehst du vor', t: '1. Kältemittel wählen. 2. Druck am Manometer der Hochdruckseite ablesen. 3. Temperatur mit dem Anlegefühler an der Flüssigkeitsleitung messen. Die App sucht die Verflüssigungstemperatur zum Druck und zieht deine Messung davon ab.' },
      KELVIN, UEBERDRUCK, TYPENSCHILD
    ],
    // ---- Wärme & Wasser ----
    'waerme/erwaermen': [
      { b: 'Spezifische Wärmekapazität', t: 'Sie sagt, wie viel Energie 1 kg Wasser braucht, um 1 K wärmer zu werden. Bei Wasser sind das etwa 1,16 Wh. Die App nimmt den genauen Wert für deine Temperaturen.' },
      { b: 'kWh', t: 'Kilowattstunde: die Energiemenge, die eine Leistung von 1 kW in einer Stunde liefert.' }
    ],
    'waerme/zeit': [
      { b: 'Heizleistung', t: 'Die Leistung des Geräts in kW, zum Beispiel des Heizstabs oder des Kessels. Sie steht auf dem Typenschild. Die Rechnung gilt ohne Verluste, in der Praxis dauert es etwas länger.' }
    ],
    'waerme/fluss': [VOLUMENSTROM, SPREIZUNG, KELVIN,
      { b: 'Leistung', t: 'Die Wärmeleistung, die das Wasser zum Heizkörper, zum Heizkreis oder zur ganzen Anlage transportiert, in kW.' }],
    // ---- einzelne Kacheln ----
    passstuecke: [
      { b: 'Passstück', t: 'Ein Stück Rohr, das du genau auf Länge schneidest, um zwei Punkte zu verbinden. Bei einem Versatz verläuft das Rohr zwischen zwei Bögen schräg.' },
      { b: 'Z-Maß', t: 'Das Maß von der Mittelachse des Fittings bis zu der Stelle im Fitting, an der das Rohr anstößt. Das Rohr steckt also ein Stück im Fitting, und das ist im Z-Maß schon abgezogen.' },
      { b: 'Zuschnittlänge', t: 'Die Länge, auf die du das Rohr schneidest: Länge von Mitte zu Mitte minus Z-Maß am einen Ende minus Z-Maß am anderen Ende.' }
    ],
    gefaelle: [
      { b: 'Gefälle', t: 'Das Gefälle sagt, wie stark eine Leitung abfällt. 2 % bedeutet: auf 1 m Länge fällt das Rohr um 2 cm. 1 : 50 bedeutet dasselbe, auf 50 cm Länge fällt es 1 cm.' }
    ],
    heizkoerper: [
      { b: 'Katalogleistung', t: 'Die Leistung, die der Hersteller für den Heizkörper angibt. Sie gilt meist bei 75/65/20 °C: 75 °C Vorlauf, 65 °C Rücklauf und 20 °C Raumtemperatur.' },
      { b: 'Übertemperatur', t: 'Wie viel wärmer das Heizwasser im Mittel ist als der Raum. Je größer der Unterschied, desto mehr Wärme gibt der Heizkörper ab. Bei niedrigeren Vorlauftemperaturen sinkt die Leistung deshalb deutlich.' },
      { b: 'Exponent n', t: 'Er beschreibt, wie stark die Leistung mit der Übertemperatur sinkt. Üblich ist 1,3. Der genaue Wert steht im Katalog des Herstellers.' }
    ],
    fussbodenheizung: [
      { b: 'Verlegeabstand', t: 'Der Abstand von Rohrmitte zu Rohrmitte zwischen zwei Rohrbahnen im Fußboden. Üblich sind 10, 15 oder 20 cm. Je kleiner der Abstand, desto mehr Rohr liegt auf der Fläche.' },
      { b: 'Heizkreis', t: 'Eine durchgehende Rohrschleife vom Verteiler durch die Fläche und wieder zurück. Ist die Fläche zu groß für ein Rohr, braucht man mehrere Heizkreise.' },
      { b: 'Höchste Heizkreislänge', t: 'Wie lang ein Heizkreis höchstens sein darf, damit der Widerstand nicht zu groß wird. Das gibt der Rohrhersteller an.' },
      SPREIZUNG, VOLUMENSTROM,
      { b: 'W/m²', t: 'Die Wärmeleistung, die pro Quadratmeter Fußboden abgegeben werden soll. Der Wert kommt aus der Heizlastberechnung.' }
    ],
    dichtheit: [
      { b: 'Dichtheitsprüfung', t: 'Der erste Prüfschritt mit sehr niedrigem Druck. Er findet schon kleine Undichtigkeiten und wird gemacht, solange die Leitungen noch offen liegen.' },
      { b: 'Belastungsprüfung', t: 'Der zweite Prüfschritt mit höherem Druck. Er prüft, ob Rohre und Verbindungen halten. Er kommt erst, wenn die Dichtheitsprüfung bestanden ist.' },
      { b: 'Leitungsvolumen', t: 'Wie viel Liter in allen Rohren der Anlage zusammen stecken. Je mehr Volumen, desto länger muss der Druck gehalten werden. Den Inhalt je Rohr bekommst du in der Kachel Rohr.' },
      { b: 'Nennweite (DN)', t: 'Eine ungefähre Größenangabe für Rohre. DN 50 entspricht etwa einem 50 mm dicken Rohr. Wähle die größte Nennweite deiner Anlage.' },
      { b: 'mbar und bar', t: '1 bar sind 1000 mbar. Die Dichtheitsprüfung läuft also mit nur 0,15 bar, die Belastungsprüfung mit bis zu 3 bar.' }
    ],
    filter: [
      { b: 'Filterklasse', t: 'Sie sagt, wie fein ein Luftfilter ist. Früher galten die Klassen G und F nach EN 779 (zum Beispiel F7). Heute gilt ISO 16890 mit ePM1, ePM2,5 und ePM10.' },
      { b: 'ePM1, ePM2,5, ePM10', t: 'Der Wert sagt, wie gut der Filter Partikel bis 1, 2,5 oder 10 Mikrometer aus der Luft holt. Je höher der Prozentwert, desto besser. Die Tabelle zeigt Spannen, keine genauen Werte.' }
    ],
    brennstoffe: [
      { b: 'Zustandszahl', t: 'Sie rechnet das Gasvolumen vom Zähler auf das Volumen bei Normbedingungen um, weil Gas sich mit Druck und Temperatur ausdehnt. Sie liegt meist knapp unter 1 und steht auf der Gasrechnung.' },
      { b: 'Brennwert', t: 'Die Energie, die in 1 m³ Gas steckt, in kWh. Der Abrechnungsbrennwert unterscheidet sich je Versorger und steht auf der Gasrechnung.' },
      { b: 'kWh', t: 'Kilowattstunde: die Einheit, in der Energie abgerechnet wird.' }
    ],
    einheiten: [
      { b: 'bar, mbar, Pa', t: 'Einheiten für den Druck. 1 bar sind 1000 mbar und 100.000 Pa. Manometer zeigen meist bar oder mbar.' },
      { b: 'mWS', t: 'Meter Wassersäule: der Druck, den eine 1 m hohe Wassersäule unten ausübt. 10 mWS sind etwa 1 bar.' },
      { b: 'kW und BTU/h', t: 'Beides sind Einheiten für Leistung. Klimageräte werden oft in BTU/h angegeben. Die Kachel rechnet sie in kW um.' }
    ]
  };
})();
