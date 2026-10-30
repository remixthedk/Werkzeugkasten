// Modul: Filter-Umrechner (EN 779 <-> ISO 16890). Daten: js/data/filter.js
(function () {
  'use strict';
  const WK = self.WK;
  const FRAKTIONEN = { epm1: 'ePM1', epm25: 'ePM2,5', epm10: 'ePM10' };

  // ---- Rechenlogik (ohne DOM, testbar) ----
  function altZuNeu(alt) {
    const d = WK.data.filter;
    const k = d.klassen.find(x => x.alt === alt);
    if (k) return { typ: 'epm', alt, werte: { epm1: k.epm1, epm25: k.epm25, epm10: k.epm10 } };
    if (d.grob.includes(alt)) return { typ: 'coarse', alt };
    return null;
  }

  // Alle alten Klassen, deren Bandbreite den Wert (in %) für die gewählte Fraktion enthält
  function neuZuAlt(fraktion, prozent) {
    const d = WK.data.filter;
    if (!(fraktion in FRAKTIONEN) || !(prozent >= 0 && prozent <= 100)) return null;
    return d.klassen.filter(k => prozent >= k[fraktion][0] && prozent <= k[fraktion][1]).map(k => k.alt);
  }
  WK.calc.filter = { altZuNeu, neuZuAlt };

  // ---- Oberfläche ----
  const bereich = r => r[0] + '–' + r[1] + ' %';
  const HINWEIS = 'Richtwerte, keine exakte Umrechnung (EN 779 misst bei 0,4 µm, ISO 16890 nach Partikelgrößen). ' +
    'Welche ePM-Gruppe auf dem Filter steht, entscheidet der Prüfbericht des Herstellers (bei F7 z. B. ePM1 oder ePM2,5).';

  function render() {
    const { h, ui } = WK;
    const d = WK.data.filter;
    const out = h('div');

    const selAlt = ui.select('Alte Klasse (EN 779)',
      [...d.grob, ...d.klassen.map(k => k.alt)].map(a => ({ value: a, label: a })), 'F7');
    const selFr = ui.select('Neue Messgröße (ISO 16890)',
      Object.entries(FRAKTIONEN).map(([v, l]) => ({ value: v, label: l })), 'epm1');
    const pct = ui.num('Abscheidegrad', { unit: '%', value: '60' });
    const boxAlt = h('div', {}, selAlt.el);
    const boxNeu = h('div', {}, selFr.el, pct.el);
    let mode = 'alt';

    function update() {
      boxAlt.hidden = mode !== 'alt';
      boxNeu.hidden = mode !== 'neu';
      if (mode === 'alt') {
        const r = altZuNeu(selAlt.get());
        if (r.typ === 'coarse') {
          out.replaceChildren(
            ui.result([{ k: r.alt + ' entspricht', v: 'ISO Coarse', big: true }]),
            ui.note('Grobfilter: ISO 16890 gibt hier einen Grobabscheidegrad an, keine ePM-Werte.'));
        } else {
          out.replaceChildren(
            ui.result([
              { k: r.alt + ' entspricht ca.', v: '', big: true },
              { k: 'ePM1', v: bereich(r.werte.epm1) },
              { k: 'ePM2,5', v: bereich(r.werte.epm25) },
              { k: 'ePM10', v: bereich(r.werte.epm10) }
            ]));
        }
      } else {
        const p = pct.get();
        const hits = neuZuAlt(selFr.get(), p);
        if (hits === null) {
          out.replaceChildren(ui.note('Bitte einen Wert zwischen 0 und 100 % eingeben.', 'warn'));
        } else if (!hits.length) {
          out.replaceChildren(ui.note('Kein Treffer: Der Wert liegt außerhalb der Bandbreiten der Tabelle (M5 bis F9).', 'warn'));
        } else {
          const fr = selFr.get();
          out.replaceChildren(ui.result([
            { k: 'Passt zu (EN 779)', v: hits.join(', '), big: true },
            ...hits.map(a => ({ k: a + ' · ' + FRAKTIONEN[fr], v: bereich(d.klassen.find(k => k.alt === a)[fr]) }))
          ]));
        }
      }
    }

    const tabs = ui.tabs([{ value: 'alt', label: 'Alt → Neu' }, { value: 'neu', label: 'Neu → Alt' }],
      v => { mode = v; update(); });
    selAlt.select.addEventListener('change', update);
    selFr.select.addEventListener('change', update);
    pct.input.addEventListener('input', update);

    const tabelle = ui.table(['EN 779', 'ePM1', 'ePM2,5', 'ePM10'], [
      [d.grob.join(' / '), 'ISO Coarse', '–', '–'],
      ...d.klassen.map(k => [k.alt, bereich(k.epm1), bereich(k.epm25), bereich(k.epm10)])
    ]);

    const root = h('div', {},
      tabs.el,
      ui.panel(null, boxAlt, boxNeu, out, ui.note(HINWEIS)),
      ui.panel('Gesamttabelle', tabelle, ui.note('Quelle: ' + d.quelle + ' (Bandbreiten gemessener Abscheidegrade).')));
    update();
    return root;
  }

  WK.register({
    id: 'filter',
    title: 'Filter-Umrechner',
    desc: 'RLT-Filter: F7, M5 & Co. alt ↔ ISO 16890 (ePM)',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>',
    render
  });
})();
