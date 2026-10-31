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
    'rohr/druckverlust': [
      { b: 'Druckverlust', t: 'Wasser, das durch ein Rohr fließt, verliert durch Reibung Druck. Je mehr Wasser und je dünner das Rohr, desto mehr. Angegeben in mbar je Meter. 1000 mbar sind 1 bar.' },
      { b: 'Fließgeschwindigkeit', t: 'Wie schnell das Wasser im Rohr strömt, in m/s. Schnelles Wasser macht Geräusche und verliert viel Druck.' },
      { b: 'Fließdruck', t: 'Der Druck, der an der Armatur ansteht, während Wasser fließt. Er ist kleiner als der Ruhedruck, weil unterwegs Druck verloren geht. Er muss mindestens so hoch sein wie der Mindestfließdruck im Datenblatt der Armatur.' },
      { b: 'Wassermenge', t: 'Wie viel Wasser pro Minute durch die Leitung fließt, in l/min. Sie steht im Datenblatt der Armatur oder des Geräts.' },
      INNEN
    ],
    'rohr/heizrohr': [
      SPREIZUNG,
      VOLUMENSTROM,
      { b: 'Geschwindigkeit', t: 'Wie schnell das Wasser im Rohr strömt, in m/s. Je kleiner das Rohr bei gleicher Wassermenge, desto schneller. Zu schnelles Wasser macht Geräusche und kostet Pumpenleistung.' },
      { b: 'Pa/m', t: 'Der Druck, den das Wasser auf einem Meter Rohr durch Reibung verliert. 100 Pa sind 1 mbar. Die Pumpe muss diesen Druck über die ganze Leitung aufbringen.' },
      INNEN
    ],
    'rohr/rohrgewicht': [
      { b: 'Rohr mit Wasser', t: 'Ein gefülltes Rohr wiegt mehr als ein leeres. Für Schellen, Konsolen und Decken zählt das Gewicht von Rohr und Wasser zusammen. Warmes Wasser ist etwas leichter als kaltes.' },
      { b: 'kg je Meter', t: 'Wie viele Kilogramm ein Meter Rohr wiegt. Für die ganze Leitung rechnest du kg je Meter mal Länge.' },
      INNEN
    ],
    'rohr/ausdehnung': [
      { b: 'Längenausdehnung', t: 'Rohre werden länger, wenn sie warm werden, und kürzer, wenn sie abkühlen. Bleibt dafür kein Platz, entstehen Spannungen und Geräusche.' },
      { b: 'Temperaturunterschied', t: 'Entscheidend ist der Unterschied zwischen der Temperatur beim Einbau und der Temperatur im Betrieb. Wurde bei 10 °C eingebaut und läuft die Anlage mit 70 °C, sind es 60 K.' },
      KELVIN,
      { b: 'Ausdehnungskoeffizient α', t: 'Er sagt, um wie viele Millimeter sich ein Meter Rohr verlängert, wenn es um 1 K wärmer wird. Kunststoff-Verbundrohr dehnt sich stärker aus als Stahl.' }
    ],
    'rohr/daemmung': [
      { b: 'GEG', t: 'Das Gebäudeenergiegesetz schreibt vor, wie dick die Dämmung von Rohren für Heizung und Warmwasser mindestens sein muss, damit wenig Wärme verloren geht.' },
      { b: 'Einbausituation', t: 'Die Mindestdicke hängt davon ab, wo das Rohr liegt. "Im Haus" ist der Standardfall, auch im unbeheizten Keller oder in der geschlossenen Garage. Im Wand- oder Deckendurchbruch, bei Leitungskreuzungen sowie an Verbindungsstellen und Verteilern gilt die halbe Dicke, im Freien (Außenwand, Hof, offener Carport) die doppelte. Frostschutz ist eine eigene Entscheidung, das Gesetz regelt nur die Mindestdämmung.' },
      { b: 'Wärmeleitfähigkeit λ', t: 'Die angezeigten Dicken gelten für einen Dämmstoff mit λ 0,035 W/(m·K). Den Wert findest du auf der Verpackung oder im Datenblatt des Dämmstoffs.' },
      INNEN
    ],
    // ---- Kältemittel ----
    'kaelte/druck': [SAETT, UEBERDRUCK, TYPENSCHILD,
      { b: 'Taupunkt und Siedepunkt (R410A)', t: 'R410A ist eine Mischung. Deshalb gibt es zwei Werte: den Taupunkt, an dem das Kältemittel gerade ganz gasförmig ist, und den Siedepunkt, an dem es gerade ganz flüssig ist. Der Unterschied ist mit etwa 0,1 K sehr klein. R32 hat nur einen Wert.' }],
    'kaelte/ueber': [
      { b: 'Überhitzung', t: 'Das Kältemittel verdampft im Verdampfer. Die Überhitzung sagt, wie viel wärmer das Gas am Ende der Saugleitung ist als die Temperatur, bei der es verdampft ist. Sie wird in Kelvin angegeben. Ist sie zu klein, kann noch flüssiges Kältemittel in den Verdichter gelangen. Ist sie zu groß, wird der Verdampfer nicht gut genutzt.' },
      { b: 'So gehst du vor', t: '1. Kältemittel wählen. 2. Druck am Manometer der Saugseite (Niederdruck) ablesen. 3. Temperatur mit dem Anlegefühler an der Saugleitung messen. Die App sucht die Verdampfungstemperatur zum Druck und zieht sie von deiner Messung ab.' },
      KELVIN, UEBERDRUCK, TYPENSCHILD,
      { b: 'Taupunkt', t: 'Die Temperatur, bei der das Kältemittel bei diesem Druck gerade ganz gasförmig ist. Dein Messwert an der Saugleitung minus dieser Temperatur ergibt die Überhitzung.' }
    ],
    'kaelte/unter': [
      { b: 'Unterkühlung', t: 'Im Verflüssiger wird das Gas wieder flüssig. Die Unterkühlung sagt, wie viel kälter die Flüssigkeit am Ausgang ist als die Temperatur, bei der sie flüssig geworden ist. Sie zeigt, dass das Kältemittel vollständig flüssig zum Expansionsventil kommt.' },
      { b: 'So gehst du vor', t: '1. Kältemittel wählen. 2. Druck am Manometer der Hochdruckseite ablesen. 3. Temperatur mit dem Anlegefühler an der Flüssigkeitsleitung messen. Die App sucht die Verflüssigungstemperatur zum Druck und zieht deine Messung davon ab.' },
      KELVIN, UEBERDRUCK, TYPENSCHILD,
      { b: 'Siedepunkt', t: 'Die Temperatur, bei der das Kältemittel bei diesem Druck gerade ganz flüssig ist. Diese Temperatur minus deinem Messwert an der Flüssigkeitsleitung ergibt die Unterkühlung.' }
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
    gasleitung: [
      { b: 'Nennbelastung', t: 'Die Leistung, die ein Gasgerät höchstens aufnimmt. Sie steht auf dem Typenschild in kW. Bei mehreren Geräten an einer Leitung zählt die Summe.' },
      { b: 'Niederdruck und Hausdruckregler', t: 'Hinter dem Hausdruckregler liegen etwa 23 mbar an. Diese Seite rechnet nur für diesen Bereich. Der Druck davor (Mitteldruck oder Hochdruck am Hausanschluss) ist nicht erfasst.' },
      { b: 'Druckverlust in Pa', t: 'Durch die Reibung im Rohr verliert das Gas Druck. Vom Regler bis zum Gerät dürfen es höchstens 3 mbar sein, das sind 300 Pa. Ein Teil davon geht schon für Zähler, Gasströmungswächter und Armatur ab.' },
      { b: 'Berechnungslänge', t: 'Die gestreckte Rohrlänge plus ein Zuschlag je Winkel. Ein Winkel bremst das Gas wie ein Stück Rohr mehr, bei Kupfer etwa 0,3 m.' },
      { b: 'Gasart H und L', t: 'Erdgas H hat mehr Energie je Kubikmeter als Erdgas L. Bei gleicher Leistung muss von L-Gas mehr Volumen durch das Rohr, deshalb verliert es mehr Druck.' }
    ],
    'rohrsuche/stahl': [
      { b: 'Gewinderohr', t: 'Stahlrohr nach DIN EN 10255, an dem man Gewinde schneiden kann. Es hat zu jeder Nennweite (DN) eine feste Wandstärke.' },
      { b: 'Siederohr', t: 'Nahtloses Stahlrohr nach DIN EN 10220. Es gibt viele Außendurchmesser (auch Zwischenmaße wie 54 oder 57 mm) und zu jedem mehrere Wandstärken. Die dickere Wand erkennst du am Gewicht und an der Schnittkante.' },
      { b: 'Nennweite DN', t: 'Nur ein Name für die Größe, nicht das gemessene Maß. Ein Rohr DN 50 hat 60,3 mm Außendurchmesser.' },
      { b: 'Normalwand', t: 'Die Wandstärke, die zu einem Außendurchmesser normalerweise gehört. Es gibt auch dickere und dünnere Rohre mit demselben Außendurchmesser.' },
      { b: 'Außendurchmesser messen', t: 'Mit dem Messschieber an einer sauberen, unbeschädigten Stelle. Zweimal quer zueinander messen. Rost und Farbe machen das Maß etwas größer.' }
    ],
    'rohrsuche/verbund': [
      { b: 'Verbundrohr', t: 'Ein Rohr aus mehreren Schichten: Kunststoff innen und außen, dazwischen eine dünne Alu-Schicht. Man sieht sie an der Schnittkante als silbernen Ring.' },
      { b: 'Wandstärke', t: 'Die Dicke der Rohrwand ohne Dämmung oder Schutzrohr. Bei gleichem Außendurchmesser haben die Hersteller verschiedene Wandstärken. Daran unterscheidest du sie.' },
      { b: 'Größe und Außendurchmesser', t: 'Die Größe auf der Packung ist nicht immer das gemessene Maß. Bei TECE heißt ein Rohr „16“, es misst aber 17 mm außen.' },
      { b: 'Aufdruck', t: 'Auf dem Rohr steht meist Hersteller, Größe und Wandstärke aufgedruckt. Das ist sicherer als jede Messung.' }
    ],
    fehlercodes: [
      { b: 'Fehlercode', t: 'Eine Zahl oder ein Buchstabe mit Zahl am Display, zum Beispiel F28. Die Heizung sagt damit, was sie gestoppt hat. Was der Code bedeutet, legt der Hersteller fest, und er ist bei jedem Hersteller und oft bei jedem Gerät anders.' },
      { b: 'Gerätename', t: 'Steht auf dem Typenschild, zum Beispiel „ecoTEC plus“ oder „CGB-2“. Ohne den Namen findet die Suche auch Anleitungen anderer Geräte, bei denen derselbe Code etwas anderes heißt.' },
      { b: 'Wartungs- und Montageanleitung', t: 'Das Heft für die Fachkraft. Dort steht die Fehlerliste mit Ursache und Maßnahme. Die Bedienungsanleitung für den Betreiber nennt meist nur wenige Codes.' }
    ],
    dichtheit: [
      { b: 'Dichtheitsprüfung', t: 'Der erste Prüfschritt mit sehr niedrigem Druck. Er findet schon kleine Undichtigkeiten und wird gemacht, solange die Leitungen noch offen liegen.' },
      { b: 'Belastungsprüfung', t: 'Der zweite Prüfschritt mit höherem Druck. Er prüft, ob Rohre und Verbindungen halten. Er kommt erst, wenn die Dichtheitsprüfung bestanden ist.' },
      { b: 'Leitungsvolumen', t: 'Wie viel Liter in allen Rohren der Anlage zusammen stecken. Je mehr Volumen, desto länger muss der Druck gehalten werden. Den Inhalt je Rohr bekommst du in der Kachel Rohr.' },
      { b: 'Nennweite (DN)', t: 'Eine ungefähre Größenangabe für Rohre. DN 50 entspricht etwa einem 50 mm dicken Rohr. Wähle die größte Nennweite deiner Anlage.' },
      { b: 'mbar und bar', t: '1 bar sind 1000 mbar. Die Dichtheitsprüfung läuft also mit nur 0,15 bar, die Belastungsprüfung mit bis zu 3 bar.' }
    ],
    filter: [
      { b: 'ISO 16890 (ePM)', t: 'Die neue Norm für Luftfilter. Der Name nennt die feinste Partikelgröße, die der Filter zu mindestens 50 % abscheidet, und den Prozentwert dazu: ePM1 60 % holt mindestens 60 % der Partikel bis 1 Mikrometer aus der Luft. Filter, die in keiner Größe 50 % erreichen, heißen ISO Coarse (Grobfilter).' },
      { b: 'Filterklasse', t: 'Sie sagt, wie fein ein Luftfilter ist. Früher galten die Klassen G und F nach EN 779 (zum Beispiel F7). Heute gilt ISO 16890 mit ePM1, ePM2,5 und ePM10.' },
      { b: 'ePM1, ePM2,5, ePM10', t: 'Der Wert sagt, wie gut der Filter Partikel bis 1, 2,5 oder 10 Mikrometer aus der Luft holt. Je höher der Prozentwert, desto besser. Die Tabelle zeigt Spannen, keine genauen Werte.' }
    ],
    brennstoffe: [
      { b: 'Zustandszahl', t: 'Sie rechnet das Gasvolumen vom Zähler auf das Volumen bei Normbedingungen um, weil Gas sich mit Druck und Temperatur ausdehnt. Sie liegt meist knapp unter 1 und steht auf der Gasrechnung.' },
      { b: 'Brennwert', t: 'Die Energie, die in 1 m³ Gas steckt, in kWh. Der Abrechnungsbrennwert unterscheidet sich je Versorger und steht auf der Gasrechnung.' },
      { b: 'kWh', t: 'Kilowattstunde: die Einheit, in der Energie abgerechnet wird.' }
    ],
    // ---- Luftkanal ----
    'kanal/rund': [
      { b: 'Gleichwertiger Durchmesser', t: 'Ein runder und ein eckiger Kanal sind gleichwertig, wenn bei gleicher Luftmenge gleich viel Druck verloren geht. Der Querschnitt ist dabei nicht gleich groß: Der runde Kanal hat etwas weniger Querschnittsfläche als der eckige, weil die Luft im eckigen Kanal mehr Reibung hat.' },
      { b: 'Seitenverhältnis', t: 'Das Verhältnis der langen zur kurzen Seite. Ein Kanal 300 × 200 mm hat 1,5 : 1. Je flacher der Kanal, desto mehr Reibung hat die Luft.' },
      { b: 'Querschnitt', t: 'Die Fläche, durch die die Luft strömt, in cm². Bei gleichem Druckverlust braucht der runde Kanal etwas weniger Fläche als der eckige.' }
    ],
    'kanal/eckig': [
      { b: 'Gleichwertiger Durchmesser', t: 'Ein runder und ein eckiger Kanal sind gleichwertig, wenn bei gleicher Luftmenge gleich viel Druck verloren geht. Der Querschnitt ist dabei nicht gleich groß.' },
      { b: 'Eine Seite vorgeben', t: 'Ein eckiger Kanal hat zwei Seiten. Eine davon gibst du vor, meist die Höhe, weil sie durch die Decke oder den Einbauort begrenzt ist. Die App rechnet die andere aus.' },
      { b: 'Querschnitt', t: 'Die Fläche, durch die die Luft strömt, in cm². Bei gleichem Druckverlust braucht der runde Kanal etwas weniger Fläche als der eckige.' }
    ],
    'kanal/tempo': [
      { b: 'Luftmenge (Volumenstrom)', t: 'Wie viel Luft in einer Stunde durch den Kanal strömt, in m³/h. Sie steht im Lüftungskonzept oder auf dem Gerät. 1 m³/h sind etwa 0,28 l/s.' },
      { b: 'Luftgeschwindigkeit', t: 'Wie schnell die Luft im Kanal strömt, in m/s. Bei hoher Geschwindigkeit werden Strömungsgeräusche und Druckverlust größer.' }
    ],
    'kanal/menge': [
      { b: 'Luftwechsel', t: 'Wie oft pro Stunde die Luft in einem Raum rechnerisch einmal komplett ersetzt wird. Bei einem Luftwechsel von 2 je Stunde fördert die Lüftung pro Stunde doppelt so viel Luft, wie in den Raum passt.' },
      { b: 'Raumvolumen', t: 'Wie viel Luft in den Raum passt: Grundfläche mal Raumhöhe, in m³. Ein Raum mit 20 m² und 2,5 m Höhe hat 50 m³.' },
      { b: 'Luftmenge', t: 'Wie viel Luft in einer Stunde gefördert wird, in m³/h. 1 m³/h sind etwa 0,28 l/s.' }
    ],
    'kanal/wechsel': [
      { b: 'Luftwechsel', t: 'Wie oft pro Stunde die Luft in einem Raum rechnerisch einmal komplett ersetzt wird: Luftmenge geteilt durch Raumvolumen. In der Praxis vermischt sich die Luft, deshalb ist es eine Rechengröße.' },
      { b: 'Raumvolumen', t: 'Wie viel Luft in den Raum passt: Grundfläche mal Raumhöhe, in m³.' }
    ],
    // ---- Strom ----
    // ---- Einheiten und Brennstoff: je Frage eigene Erklärung ----
    'k-einheiten/druck': [
      { b: 'bar, mbar, Pa', t: 'Einheiten für den Druck. 1 bar sind 1000 mbar und 100.000 Pa. Manometer zeigen meist bar oder mbar.' },
      { b: 'mWS', t: 'Meter Wassersäule: der Druck, den eine 1 m hohe Wassersäule unten ausübt. 10 mWS sind etwa 1 bar.' }
    ],
    'k-einheiten/leistung': [
      { b: 'kW und BTU/h', t: 'Beides sind Einheiten für Leistung. Heizgeräte werden in kW angegeben, Klimageräte oft in BTU/h. Die Tabelle zeigt alle Einheiten auf einmal.' },
      { b: 'kcal/h', t: 'Eine ältere Einheit für Leistung. 860 kcal/h sind etwa 1 kW.' }
    ],
    'k-einheiten/energie': [
      { b: 'kWh', t: 'Kilowattstunde: die Einheit, in der Energie abgerechnet wird. 1 kWh sind 3,6 MJ.' },
      { b: 'kcal und BTU', t: 'Ältere beziehungsweise amerikanische Einheiten für Energie. 1 kWh sind etwa 860 kcal.' }
    ],
    'k-einheiten/durchfluss': [
      { b: 'l/s, l/min, m³/h', t: 'Wie viel Wasser oder Luft in einer bestimmten Zeit durch die Leitung fließt. 1 m³/h sind etwa 16,7 l/min und 0,28 l/s.' }
    ],
    'k-einheiten/temperatur': [
      { b: 'Kelvin (K)', t: 'Die Skala der Physik: 0 °C sind 273,15 K. Für Temperaturunterschiede (zum Beispiel die Spreizung) gilt: 1 K ist genau so groß wie 1 °C.' },
      { b: '°F', t: 'Fahrenheit, in den USA üblich. 20 °C sind 68 °F.' }
    ],
    'k-brennstoffe/gas': [
      { b: 'Zustandszahl', t: 'Sie rechnet das Gasvolumen vom Zähler auf das Volumen bei Normbedingungen um, weil Gas sich mit Druck und Temperatur ausdehnt. Sie liegt meist knapp unter 1 und steht auf der Gasrechnung.' },
      { b: 'Brennwert', t: 'Die Energie, die in 1 m³ Gas steckt, in kWh. Der Abrechnungsbrennwert unterscheidet sich je Versorger und steht auf der Gasrechnung.' },
      { b: 'kWh', t: 'Kilowattstunde: die Einheit, in der Energie abgerechnet wird.' }
    ],
    'k-brennstoffe/sonst': [
      { b: 'Energiegehalt', t: 'Wie viel Energie in einem Liter oder Kilogramm Brennstoff steckt, in kWh. Er steht auf dem Lieferschein oder im Datenblatt und unterscheidet sich je Brennstoff und Lieferung.' },
      { b: 'Heizwert und Brennwert', t: 'Der Brennwert enthält zusätzlich die Wärme aus dem Wasserdampf der Abgase, der Heizwert nicht. Nimm den Wert, der auf deinem Lieferschein steht.' },
      { b: 'kWh', t: 'Kilowattstunde: die Einheit, in der Energie abgerechnet wird.' }
    ],
    // ---- Wärme & Wasser, übrige Fragen ----
    'waerme/gewicht': [
      { b: 'Dichte', t: 'Wie schwer ein Liter Wasser ist. Kaltes Wasser wiegt etwas mehr als warmes: 1 Liter bei 10 °C 0,9997 kg, bei 60 °C 0,9832 kg.' }
    ],
    'waerme/gas': [
      { b: 'Kondenswasser', t: 'Bei der Verbrennung von Erdgas entsteht Wasserdampf. Im Brennwertkessel kondensiert ein Teil davon zu Wasser, das abgeleitet werden muss.' }
    ],
    'waerme/stoffe': [
      { b: 'Wärmekapazität c', t: 'Wie viel Energie 1 kg eines Stoffs braucht, um 1 K wärmer zu werden. Je höher c, desto mehr Energie speichert der Stoff. Wasser speichert viel, Kupfer wenig.' },
      { b: 'Dichte', t: 'Wie schwer ein Kubikmeter des Stoffs ist, in kg/m³.' }
    ],
    'strom/strom': [
      { b: 'Drehstrom und Wechselstrom', t: 'Drehstrom hat drei Außenleiter (400 V zwischen zwei Leitern), Wechselstrom aus der normalen Steckdose einen (230 V). Bei Drehstrom verteilt sich die Leistung auf drei Leiter, der Strom je Leiter ist deshalb kleiner.' },
      { b: 'Leistungsfaktor cos φ', t: 'Er sagt, wie viel von der aufgenommenen Leistung wirklich genutzt wird. Heizstäbe und Durchlauferhitzer haben 1. Bei Motoren und Pumpen liegt er darunter und steht auf dem Typenschild. Je kleiner er ist, desto mehr Strom fließt bei gleicher Leistung.' },
      { b: 'Typenschild bei Motoren', t: 'Auf Motoren und Pumpen steht oft die abgegebene Leistung. Die aufgenommene Leistung ist höher, weil der Motor selbst Verluste hat. Besser ist der Strom vom Typenschild.' }
    ],
    'strom/ohm': [
      { b: 'Ohmsches Gesetz', t: 'Spannung, Strom und Widerstand hängen zusammen: Spannung = Widerstand mal Strom. Kennst du zwei der drei Werte, ergibt sich der dritte.' },
      { b: 'Widerstand (Ω)', t: 'Wie stark ein Bauteil den Strom bremst, angegeben in Ohm. Ein Heizstab ist im Kern ein Widerstand. Du kannst ihn mit dem Messgerät bei ausgeschaltetem Gerät messen.' },
      { b: 'Leistung', t: 'Spannung mal Strom ergibt die Leistung in Watt. Die App zeigt sie dazu an.' }
    ],
    'strom/trafo': [
      { b: 'Trafo und Netzteil', t: 'Sie wandeln eine Spannung in eine andere um, zum Beispiel 230 V in 12 V. Die Leistung bleibt dabei gleich, abzüglich der Verluste. Weil Leistung = Spannung mal Strom ist, fließt bei kleiner Spannung ein großer Strom.' },
      { b: 'Wirkungsgrad', t: 'Wie viel von der aufgenommenen Leistung am Ausgang ankommt. Der Rest wird zu Wärme. Bei 85 % kommen von 100 W am Eingang 85 W am Ausgang an. Ohne Angabe rechnet die App ohne Verluste.' },
      { b: 'Eingang und Ausgang', t: 'Der Eingang hängt am Netz (230 V), der Ausgang versorgt das Gerät (zum Beispiel 12 V). Auf dem Typenschild eines Netzteils steht meist die Leistung am Ausgang.' }
    ],
    'strom/leistung': [
      { b: 'Drehstrom und Wechselstrom', t: 'Drehstrom hat drei Außenleiter (400 V zwischen zwei Leitern), Wechselstrom aus der normalen Steckdose einen (230 V). Der Strom wird je Außenleiter angegeben.' },
      { b: 'Leistungsfaktor cos φ', t: 'Er sagt, wie viel von der aufgenommenen Leistung wirklich genutzt wird. Heizstäbe und Durchlauferhitzer haben 1. Bei Motoren und Pumpen steht er auf dem Typenschild.' }
    ],
    // ---- Dreisatz & Prozent ----
    'rechnen/dreisatz': [
      { b: 'Je mehr, desto mehr', t: 'Wenn mit der Menge auch der andere Wert steigt. 3 Stück kosten 12 €, dann kosten 5 Stück 20 €.' },
      { b: 'Je mehr, desto weniger', t: 'Wenn der andere Wert sinkt, wenn die Menge steigt. 2 Monteure brauchen 6 Stunden, dann brauchen 3 Monteure 4 Stunden.' }
    ],
    'rechnen/prozent': [
      { b: 'Grundwert und Prozentsatz', t: 'Der Grundwert ist der Wert, von dem du die Prozente nimmst (100 %). Der Prozentsatz sagt, wie viele Hundertstel davon gemeint sind. 15 % von 250 sind 37,5.' }
    ],
    'rechnen/anteil': [
      { b: 'Anteil', t: 'Wie viel Prozent ein Wert von einem anderen ist. 30 von 120 sind 25 %.' },
      { b: 'Veränderung', t: 'Um wie viel Prozent ein Wert höher oder niedriger ist als vorher. Von 100 auf 112 sind es 12 % mehr.' },
      { b: 'Aufschlag und Marge', t: 'Ein Aufschlag wird vom Einkaufspreis gerechnet. Bezieht man den Gewinn auf den Verkaufspreis, heißt das Marge, und die ist immer kleiner als der Aufschlag. Hier rechnest du mit der Veränderung von Einkauf auf Verkauf.' }
    ],
    'rechnen/aufschlag': [
      { b: 'Aufschlag und Rabatt', t: 'Beim Aufschlag wird der Prozentwert auf den Preis addiert, beim Rabatt abgezogen. 100 € plus 12 % sind 112 €. 100 € minus 12 % sind 88 €.' }
    ],
    'rechnen/mwst': [
      { b: 'Netto und Brutto', t: 'Netto ist der Preis ohne Mehrwertsteuer, brutto der Preis mit Mehrwertsteuer. Brutto = Netto × (1 + Steuersatz ÷ 100). Zurück rechnest du, indem du durch diesen Faktor teilst, nicht indem du die Prozente abziehst.' }
    ],
    einheiten: [
      { b: 'bar, mbar, Pa', t: 'Einheiten für den Druck. 1 bar sind 1000 mbar und 100.000 Pa. Manometer zeigen meist bar oder mbar.' },
      { b: 'mWS', t: 'Meter Wassersäule: der Druck, den eine 1 m hohe Wassersäule unten ausübt. 10 mWS sind etwa 1 bar.' },
      { b: 'kW und BTU/h', t: 'Beides sind Einheiten für Leistung. Klimageräte werden oft in BTU/h angegeben. Die Kachel rechnet sie in kW um.' }
    ]
  };
})();
