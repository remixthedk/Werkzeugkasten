// Modul: Filterklassen (EN 779 und ISO 16890 nach Eurovent 4/23). Daten: js/data/filter.js
// Keine exakte Umrechnung (die gibt es nicht): alt -> neu zeigt die Spannen, neu -> alt zeigt die alten Klassen, deren Spanne den Wert enthält.
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
  // Neuer Filter nach ISO 16890: Fraktion ('coarse', 'epm1', 'epm25', 'epm10') und Prozentwert aus dem Namen (zum Beispiel ePM1 60 %)
  // -> alte Klassen, in deren Eurovent-Spanne der Wert liegt. ISO-Klassen gibt es erst ab 50 %, darunter ist der Filter ISO Coarse.
  function rueckwaerts({ fraktion, prozent }) {
    const d = WK.data.filter;
    if (fraktion === 'coarse') return { typ: 'coarse', alt: [...d.grob] };
    if (!['epm1', 'epm25', 'epm10'].includes(fraktion) || !(prozent >= 0 && prozent <= 100)) return null;
    if (prozent < 50) return { typ: 'unter50', alt: [] };
    return { typ: 'epm', alt: d.klassen.filter(k => prozent >= k[fraktion][0] && prozent <= k[fraktion][1]).map(k => k.alt) };
  }
  WK.calc.filter = { zeile, rueckwaerts };

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

    // Neuer Filter nach ISO 16890 -> alte Klasse
    const frak = ui.select('Dein Filter heißt', [
      { value: 'epm1', label: 'ePM1 …' }, { value: 'epm25', label: 'ePM2,5 …' }, { value: 'epm10', label: 'ePM10 …' }, { value: 'coarse', label: 'ISO Coarse' }
    ], 'epm1');
    const proz = ui.num('Prozentwert im Namen', { unit: '%', value: '60', hint: 'Zum Beispiel 60 bei ePM1 60 %. Steht auf dem Filterrahmen oder im Datenblatt.' });
    const outN = h('div');
    function updateN() {
      proz.el.hidden = frak.get() === 'coarse';
      const r = rueckwaerts({ fraktion: frak.get(), prozent: proz.get() });
      if (!r) { outN.replaceChildren(ui.note('Prozentwert zwischen 0 und 100 eingeben.', 'warn')); return; }
      if (r.typ === 'unter50') {
        outN.replaceChildren(ui.note('ISO-16890-Klassen gibt es erst ab 50 %. Gib den Wert aus dem Namen deines Filters ein (zum Beispiel 60 bei ePM1 60 %). Ein Filter mit weniger als 50 % ePM10 ist ISO Coarse.', 'warn'));
        return;
      }
      if (r.typ === 'coarse') {
        outN.replaceChildren(ui.result([{ k: 'Mögliche alte Klassen', v: r.alt.join(' oder '), big: true }]),
          ui.note('ISO Coarse sind Grobfilter. Die alten Klassen G3 und G4 gehören dazu.'));
        return;
      }
      outN.replaceChildren(...[
        ui.result([{ k: 'Mögliche alte Klassen', v: r.alt.length ? r.alt.join(' oder ') : 'keine', big: true }]),
        r.alt.length ? ui.note('Die Spannen der alten Klassen überlappen, deshalb sind oft zwei Klassen möglich. Zeigt der Name zwei Fraktionen, nimm die feinste (ePM1 vor ePM2,5 vor ePM10).')
          : ui.note('Dieser Wert liegt außerhalb der Spannen der alten Klassen. Ein Vergleich ist nicht möglich.', 'warn')
      ].filter(Boolean));
    }
    frak.select.addEventListener('change', updateN);
    proz.input.addEventListener('input', updateN);

    const tabelle = ui.table(['EN 779', 'ePM1', 'ePM2,5', 'ePM10'], [
      [d.grob.join(' / '), 'ISO Coarse', '–', '–'],
      ...d.klassen.map(k => [k.alt, bereich(k.epm1), bereich(k.epm25), bereich(k.epm10)])
    ]);

    const hinweis = ui.note('Keine exakte Umrechnung: Die Spannen zeigen, in welchem Bereich gemessene Abscheidegrade von Filtern der alten Klasse lagen. ' +
      'Welche ePM-Werte ein Filter wirklich hat, steht im Prüfbericht oder Datenblatt des Herstellers.');
    const boxAlt = h('div', {}, ui.panel(null, sel.el, out, hinweis));
    const boxNeu = h('div', {}, ui.panel(null, frak.el, proz.el), ui.panel('Ergebnis', outN, hinweis.cloneNode(true)));
    boxNeu.hidden = true;
    const tabs = ui.tabs([
      { value: 'alt', label: 'Alt → neu' },
      { value: 'neu', label: 'Neu → alt' }
    ], v => { boxAlt.hidden = v !== 'alt'; boxNeu.hidden = v !== 'neu'; });
    const root = h('div', {}, tabs.el, boxAlt, boxNeu,
      ui.panel('Gesamttabelle', tabelle, ui.note('Quelle: ' + d.quelle + ' (Bandbreiten gemessener Abscheidegrade).')));
    update(); updateN();
    return root;
  }

  WK.register({
    id: 'filter',
    bereich: 'lueftung',
    stichworte: 'f7 m5 m6 f8 f9 g4 epm ep m1 iso 16890 en 779 rlt luftfilter eurovent',
    hilfe: {
      wofuer: 'Dein alter Luftfilter hat eine Klasse wie F7 oder M6. Neue Filter werden nach ISO 16890 angegeben, zum Beispiel ePM1 60 %. Hier siehst du, in welchem Bereich die neuen Werte bei einer alten Klasse liegen, und welche alte Klasse zu einem neuen Filter passen kann.',
      schritte: [
        'Hast du einen alten Filter: die alte Klasse auswählen. Sie steht auf dem Filterrahmen oder dem Lieferschein. Darunter siehst du die ePM1-, ePM2,5- und ePM10-Spannen dazu.',
        'Hast du einen neuen Filter: Fraktion und Prozentwert aus dem Namen eintragen, zum Beispiel ePM1 und 60. Du siehst, welche alten Klassen dazu passen können.',
        'Ganz unten steht die Gesamttabelle aller Klassen zum Nachschauen.',
        'Beim Nachbestellen suchst du einen neuen Filter, dessen Prüfbericht in diesem Bereich liegt.'
      ],
      beispiel: 'Alter Filter F7: ePM1 40–65 %, ePM2,5 65–75 %, ePM10 80–90 %. Neuer Filter ePM1 60 %: passt zu F7. Neuer Filter ePM10 60 %: passt zu M5 oder M6.',
      hinweis: 'Das ist keine genaue Umrechnung. Entscheidend ist das Datenblatt des Herstellers.'
    },
    quelle: [
      'Eurovent Recommendation 4/23-2022 (4. Ausgabe), Tabelle 5. Dieselben Spannen stehen in der 2. Ausgabe (2018) und beim EMW (Bezug auf Eurovent 4/23:2020).',
      'Eine exakte Umrechnung gibt es laut Eurovent und Systemair nicht. Einzelne Hersteller nennen leicht abweichende Spannen ohne Quelle, sie sind hier nicht übernommen.',
      'G3 und G4 sind ISO Coarse, dafür gibt es keine ePM-Werte.',
      'Neu → alt: Es gibt keine eigene Tabelle. Die App prüft, in welche Eurovent-Spanne der Prozentwert fällt (Gegenprobe im Test: jeder Wert innerhalb einer Spanne liefert diese Klasse). ISO-Klassen gibt es erst ab 50 %, darunter ist ein Filter ISO Coarse: zwei Quellen (Camfil, FläktGroup). Dass der Prozentwert auf 5-%-Schritte abgerundet angegeben wird, steht nur bei Camfil, deshalb liegt der echte Wert bis zu 5 Punkte höher.'
    ],
    title: 'Filterklassen',
    desc: 'RLT-Filter: EN 779 und ISO 16890 im Vergleich',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>',
    render
  });
})();
