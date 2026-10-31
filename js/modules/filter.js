// Modul: Filterklassen (EN 779 und ISO 16890 nach Eurovent 4/23). Daten: js/data/filter.js
// Reine Tabelle, keine Umrechnung: Es gibt keine exakte Umrechnung zwischen den beiden Normen.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Logik (ohne DOM, testbar) ----
  // Zeile der Tabelle für eine alte Klasse
  function zeile(alt) {
    const d = WK.data.filter;
    const k = d.klassen.find(x => x.alt === alt);
    if (k) return { typ: 'epm', alt, werte: { epm1: k.epm1, epm25: k.epm25, epm10: k.epm10 } };
    if (d.grob.includes(alt)) return { typ: 'coarse', alt };
    return null;
  }
  WK.calc.filter = { zeile };

  // ---- Oberfläche ----
  const bereich = r => r[0] + '–' + r[1] + ' %';

  function render() {
    const { h, ui } = WK;
    const d = WK.data.filter;
    const out = h('div');

    const sel = ui.select('Klasse nach EN 779 (alt)',
      [...d.grob, ...d.klassen.map(k => k.alt)].map(a => ({ value: a, label: a })), 'F7');

    function update() {
      const r = zeile(sel.get());
      if (r.typ === 'coarse') {
        out.replaceChildren(
          ui.result([{ k: r.alt, v: 'ISO Coarse', big: true }]),
          ui.note('Grobfilter: ISO 16890 gibt hier einen Grobabscheidegrad an, keine ePM-Werte.'));
      } else {
        out.replaceChildren(ui.result([
          { k: r.alt + ' laut Eurovent-Tabelle', v: '', big: true },
          { k: 'ePM1', v: bereich(r.werte.epm1) },
          { k: 'ePM2,5', v: bereich(r.werte.epm25) },
          { k: 'ePM10', v: bereich(r.werte.epm10) }
        ]));
      }
    }
    sel.select.addEventListener('change', update);

    const tabelle = ui.table(['EN 779', 'ePM1', 'ePM2,5', 'ePM10'], [
      [d.grob.join(' / '), 'ISO Coarse', '–', '–'],
      ...d.klassen.map(k => [k.alt, bereich(k.epm1), bereich(k.epm25), bereich(k.epm10)])
    ]);

    const root = h('div', {},
      ui.panel(null, sel.el, out,
        ui.note('Keine exakte Umrechnung: Die Spannen zeigen, in welchem Bereich gemessene Abscheidegrade von Filtern der alten Klasse lagen. ' +
          'Welche ePM-Werte ein Filter wirklich hat, steht im Prüfbericht oder Datenblatt des Herstellers.')),
      ui.panel('Gesamttabelle', tabelle, ui.note('Quelle: ' + d.quelle + ' (Bandbreiten gemessener Abscheidegrade).')));
    update();
    return root;
  }

  WK.register({
    id: 'filter',
    bereich: 'lueftung',
    stichworte: 'f7 m5 m6 f8 f9 g4 epm ep m1 iso 16890 en 779 rlt luftfilter eurovent',
    hilfe: {
      wofuer: 'Dein alter Luftfilter hat eine Klasse wie F7 oder M6. Neue Filter werden nach ISO 16890 angegeben, zum Beispiel ePM1 60 %. Hier siehst du, in welchem Bereich die neuen Werte bei einer alten Klasse liegen.',
      schritte: [
        'Alte Klasse auswählen. Sie steht auf dem Filterrahmen oder dem Lieferschein.',
        'Darunter siehst du die ePM1-, ePM2,5- und ePM10-Spannen dazu.',
        'Ganz unten steht die Gesamttabelle aller Klassen zum Nachschauen.',
        'Beim Nachbestellen suchst du einen neuen Filter, dessen Prüfbericht in diesem Bereich liegt.'
      ],
      beispiel: 'Alter Filter F7: ePM1 40–65 %, ePM2,5 65–75 %, ePM10 80–90 %.',
      hinweis: 'Das ist keine genaue Umrechnung. Entscheidend ist das Datenblatt des Herstellers.'
    },
    quelle: [
      'Eurovent Recommendation 4/23-2022 (4. Ausgabe), Tabelle 5. Dieselben Spannen stehen in der 2. Ausgabe (2018) und beim EMW (Bezug auf Eurovent 4/23:2020).',
      'Eine exakte Umrechnung gibt es laut Eurovent und Systemair nicht. Einzelne Hersteller nennen leicht abweichende Spannen ohne Quelle, sie sind hier nicht übernommen.',
      'G3 und G4 sind ISO Coarse, dafür gibt es keine ePM-Werte.'
    ],
    frage: 'Wie gut filtert meine Filterklasse?',
    title: 'Filterklassen',
    desc: 'RLT-Filter: EN 779 und ISO 16890 im Vergleich',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>',
    render
  });
})();
