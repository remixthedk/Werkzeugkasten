// Sammelkacheln: legt zusammengehörige Module unter einer Kachel mit großen Fragen zusammen.
// Die Module selbst bleiben unverändert (und über #/<id> erreichbar), ihre eigenen Kacheln sind versteckt.
(function () {
  'use strict';
  const WK = self.WK;
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';

  WK.gruppe({
    id: 'rohr',
    bereich: 'rohr',
    title: 'Rohr',
    desc: 'Maße, Wasser, Druckverlust, Heizungsrohr, Gewicht, Dehnung, Dämmung',
    icon: SVG('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>'),
    stichworte: 'rohr leitung',
    teilen: ['Rohrmaterial', 'Größe'],
    hilfe: {
      wofuer: 'Alles rund um das Rohr an einem Ort: Maße nachschlagen, Wasserinhalt, Fließgeschwindigkeit und Druckverlust, das passende Heizungsrohr zur Leistung, Gewicht mit Wasser, Längenausdehnung und die Dämmung nach GEG.',
      schritte: [
        'Tippe auf die Frage, die du beantwortet haben willst.',
        'Rohrmaterial und Größe wählst du nur einmal. Sie bleiben stehen, wenn du zwischen Wasserinhalt, Druckverlust, Gewicht und Dämmung wechselst, soweit das Material dort zur Auswahl steht.',
        'Mit „Andere Frage“ kommst du zurück zur Auswahl.'
      ],
      beispiel: 'Prestabo 22 × 1,5: Frage „Wie viel Wasser passt in mein Rohr?“ ergibt 0,284 Liter je Meter. Danach die Frage nach der Dämmung zeigt dasselbe Rohr schon eingestellt.',
      hinweis: 'Jede Frage hat oben ein Feld „Was bedeutet das?“ mit Erklärungen der Fachbegriffe.'
    },
    fragen: [
      { id: 'rohrgroessen', modul: 'rohrgroessen', frage: 'Welche Maße hat mein Rohr?', klein: 'Außen-, Innendurchmesser und Wandstärke nachschlagen' },
      { id: 'wasserinhalt', modul: 'wasserinhalt', frage: 'Wie viel Wasser passt in mein Rohr?', klein: 'Liter je Meter und für die ganze Länge' },
      { id: 'druckverlust', modul: 'druckverlust', frage: 'Reicht mein Rohr für die Wassermenge?', klein: 'Fließgeschwindigkeit und Druckverlust' },
      { id: 'heizrohr', modul: 'heizrohr', frage: 'Welches Rohr brauche ich für meine Heizleistung?', klein: 'Aus kW und Spreizung: Wassermenge, Geschwindigkeit, Druckgefälle' },
      { id: 'rohrgewicht', modul: 'rohrgewicht', frage: 'Wie schwer ist mein Rohr mit Wasser?', klein: 'Für Schellen, Decken und Transport' },
      { id: 'ausdehnung', modul: 'ausdehnung', frage: 'Wie stark dehnt sich mein Rohr, wenn es warm wird?', klein: 'Verlängerung in Millimetern' },
      { id: 'daemmung', modul: 'daemmung', frage: 'Wie dick muss die Dämmung an meinem Rohr sein?', klein: 'Mindestdicke nach Gebäudeenergiegesetz' }
    ]
  });

  WK.gruppe({
    id: 'kaelte',
    bereich: 'lueftung',
    title: 'Kältemittel',
    desc: 'Druck, Überhitzung und Unterkühlung (R32, R410A)',
    icon: SVG('<path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l4-5"/><path d="M6 16h1M17 16h1M12 8v1"/>'),
    stichworte: 'kältemittel klima split wärmepumpe',
    teilen: ['Kältemittel'],
    lead: 'Was willst du wissen? Jede Frage erklärt dir die Begriffe.',
    hilfe: {
      wofuer: 'Hilfe für Klimageräte und Wärmepumpen mit den Kältemitteln R32 und R410A: Welcher Druck passt zu welcher Temperatur, und wie hoch sind Überhitzung und Unterkühlung deiner Anlage.',
      schritte: [
        'Tippe auf die Frage, die du beantwortet haben willst. Oben steht eine Erklärung der Begriffe.',
        'Wähle das Kältemittel. Es steht auf dem Typenschild der Anlage.',
        'Trage den Druck vom Manometer und, wenn gefragt, die gemessene Rohrtemperatur ein.',
        'Das Ergebnis steht groß darunter. Sollwerte stehen in der Anleitung des Geräteherstellers.'
      ],
      beispiel: 'R32, Saugdruck 8 bar Überdruck, Saugleitung 15 °C: Die Überhitzung beträgt etwa 11,7 K.',
      hinweis: 'Das Kältemittel bleibt stehen, wenn du zur nächsten Frage wechselst.'
    },
    fragen: [
      { id: 'druck', modul: 'kaeltemittel', frage: 'Welcher Druck gehört zu welcher Temperatur?', klein: 'Tabelle für R32 und R410A' },
      { id: 'ueber', modul: 'ueberhitzung', tab: 0, frage: 'Wie viel Überhitzung hat meine Anlage auf der Saugseite?', klein: 'Aus Saugdruck und Rohrtemperatur', offen: true },
      { id: 'unter', modul: 'ueberhitzung', tab: 1, frage: 'Wie viel Unterkühlung hat meine Anlage auf der Flüssigkeitsseite?', klein: 'Aus Hochdruck und Rohrtemperatur', offen: true }
    ]
  });

  // Kacheln mit Registerleiste: jede Registerkarte wird zu einer Frage in ganzen Sätzen (Leiste ausgeblendet).
  // Die Sammelkachel hat eine eigene ID (k-...), das Modul bleibt über #/<id> erreichbar und seine Favoriten wandern auf die Kachel.
  const modul = id => WK.modules.find(m => m.id === id);
  const aus = (id, k, extra) => {
    const m = modul(id) || {};
    WK.gruppe(Object.assign({ id: 'k-' + id, bereich: m.bereich, title: m.title, desc: m.desc, icon: m.icon, stichworte: m.stichworte, hilfe: m.hilfe }, extra, k));
  };
  aus('passstuecke', { fragen: [
    { id: 'versatz', begriffe: 'passstuecke', modul: 'passstuecke', tab: 0, frage: 'Wie lang muss mein Passstück bei Versatz und Winkel sein?', klein: 'Zuschnittlänge aus Versatz, Winkel und Z-Maß' },
    { id: 'dreieck', begriffe: 'passstuecke', modul: 'passstuecke', tab: 1, frage: 'Wie lang muss mein Passstück bei Längs- und Quermaß sein?', klein: 'Zuschnittlänge aus den beiden Maßen am Bau' }
  ] });
  aus('gefaelle', { fragen: [
    { id: 'um', begriffe: 'gefaelle', modul: 'gefaelle', tab: 0, frage: 'Wie rechne ich mein Gefälle um?', klein: 'Prozent, cm je Meter, 1 : n und Winkel' },
    { id: 'hoehe', begriffe: 'gefaelle', modul: 'gefaelle', tab: 1, frage: 'Wie tief liegt mein Rohr am Ende?', klein: 'Höhenunterschied aus Länge und Gefälle' }
  ] });
  aus('brennstoffe', { fragen: [
    { id: 'gas', begriffe: 'brennstoffe', modul: 'brennstoffe', tab: 0, frage: 'Wie viele kWh sind meine Kubikmeter Erdgas?', klein: 'Mit Zustandszahl und Brennwert von der Rechnung, auch zurück' },
    { id: 'sonst', begriffe: 'brennstoffe', modul: 'brennstoffe', tab: 1, frage: 'Wie viele kWh stecken in Öl, Pellets oder Flüssiggas?', klein: 'Aus Menge und Energiegehalt' }
  ] });
  aus('einheiten', { fragen: [
    { id: 'druck', begriffe: 'einheiten', modul: 'einheiten', tab: 0, frage: 'Wie rechne ich einen Druck um?', klein: 'Pa, mbar, bar, mWS, psi und mehr' },
    { id: 'leistung', begriffe: 'einheiten', modul: 'einheiten', tab: 1, frage: 'Wie rechne ich eine Leistung um?', klein: 'W, kW, kcal/h, BTU/h' },
    { id: 'energie', begriffe: 'einheiten', modul: 'einheiten', tab: 2, frage: 'Wie rechne ich eine Energie um?', klein: 'J, kWh, kcal, BTU und mehr' },
    { id: 'durchfluss', begriffe: 'einheiten', modul: 'einheiten', tab: 3, frage: 'Wie rechne ich einen Durchfluss um?', klein: 'l/s, l/min, m³/h und mehr' },
    { id: 'temperatur', begriffe: 'einheiten', modul: 'einheiten', tab: 4, frage: 'Wie rechne ich eine Temperatur um?', klein: '°C, K, °F' }
  ] });

  // Leistung & Volumenstrom steckt als Frage in "Wärme & Wasser"
  const vs = WK.modules.find(m => m.id === 'volumenstrom');
  if (vs) { vs.versteckt = true; WK.ersatz.volumenstrom = 'waerme'; }
})();
