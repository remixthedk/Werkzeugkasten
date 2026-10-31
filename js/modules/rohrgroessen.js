// Modul: Rohrgrößen (Zoll / DN / mm). Daten: js/data/rohre.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // "1 1/4", "3/4", "1,5", 2" -> Zoll als Zahl
  function parseZoll(s) {
    const parts = String(s).replace(/["”″']/g, '').trim().replace(',', '.').split(/\s+/).filter(Boolean);
    if (!parts.length) return NaN;
    let sum = 0;
    for (const p of parts) {
      if (p.includes('/')) {
        const [a, b] = p.split('/').map(Number);
        if (!(b > 0) || !Number.isFinite(a)) return NaN;
        sum += a / b;
      } else {
        const n = Number(p);
        if (!Number.isFinite(n)) return NaN;
        sum += n;
      }
    }
    return sum;
  }
  const zollZuMm = zoll => zoll * 25.4;

  // mm -> Zoll, dezimal und als Bruch auf 1/16 gerundet
  function mmZuZoll(mm) {
    const zoll = mm / 25.4;
    let n = Math.round(zoll * 16), den = 16;
    const ganz = Math.floor(n / 16);
    let rest = n - ganz * 16;
    while (rest > 0 && rest % 2 === 0) { rest /= 2; den /= 2; }
    const bruch = rest ? rest + '/' + den : '';
    return { zoll, bruch: (ganz ? ganz : '') + (ganz && bruch ? ' ' : '') + (bruch || (ganz ? '' : '0')) };
  }
  WK.calc.rohrgroessen = { parseZoll, zollZuMm, mmZuZoll };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const R = WK.data.rohre;

    const sel = ui.select('Werkstoff', [
      ...R.werkstoffe.map(w => ({ value: w.id, label: w.name })),
      { value: 'gewinde', label: 'Rohrgewinde R / Rp (Gewinde-Außen-Ø)' }
    ], R.werkstoffe[0].id);
    const q = h('input', { type: 'search', class: 'search', placeholder: 'Suchen, z. B. 28, 1/2, DN 25', autocomplete: 'off' });
    const tab = h('div');
    const info = h('div');

    const norm = s => String(s).toLowerCase().replace(/,/g, '.');
    function draw() {
      const nd = norm(q.value.trim());
      let head, rows, text;
      if (sel.get() === 'gewinde') {
        head = ['Gewinde', 'DN', 'Außen-Ø'];
        rows = R.gewinde.map(g => [g.zoll, g.dn, fmt(g.ad, 3) + ' mm']);
        text = 'Außendurchmesser des Gewindes (R/Rp nach ISO 7-1). Das Rohr selbst hat den Außen-Ø aus der Stahlrohr-Tabelle.';
      } else {
        const w = R.werkstoffe.find(x => x.id === sel.get());
        head = ['Größe', 'Außen-Ø', 'Wand', 'Innen-Ø'];
        rows = w.rohre.map(r => [
          r.bez, fmt(r.ad, 1), r.wand ? fmt(r.wand, 2) : '–', r.wand ? fmt(r.ad - 2 * r.wand, 1) : '–'
        ]);
        text = w.norm + (w.rohre.some(r => !r.wand) ? '. Wandstärke je Hersteller unterschiedlich, deshalb kein Innen-Ø.' : '. Maße in mm, Richtwerte.');
      }
      if (nd) rows = rows.filter(r => norm(r.join(' ')).includes(nd));
      tab.replaceChildren(rows.length ? ui.table(head, rows) : ui.note('Keine Treffer.'));
      info.replaceChildren(ui.note(text));
    }
    sel.select.addEventListener('change', draw);
    q.addEventListener('input', draw);

    // Zoll <-> mm
    const zin = ui.num('Zoll (z. B. 1 1/4 oder 0,75)', { value: '1/2' });
    const min = ui.num('Millimeter', { value: '' });
    const zout = h('div');
    function zoll2mm() {
      const z = parseZoll(zin.input.value);
      zout.replaceChildren(Number.isFinite(z) && z > 0
        ? ui.result([{ k: 'Zoll → mm', v: fmt(zollZuMm(z), 2) + ' mm', big: true }])
        : ui.note('Zoll-Wert nicht lesbar.', 'warn'));
    }
    function mm2zoll() {
      const m = min.get();
      if (!(m > 0)) { zout.replaceChildren(ui.note('Millimeter-Wert eingeben.', 'warn')); return; }
      const r = mmZuZoll(m);
      zout.replaceChildren(ui.result([
        { k: 'mm → Zoll', v: fmt(r.zoll, 3) + '"', big: true },
        { k: 'Bruch (auf 1/16)', v: '≈ ' + r.bruch + '"' }
      ]));
    }
    zin.input.addEventListener('input', () => { min.set(''); zoll2mm(); });
    min.input.addEventListener('input', () => { zin.set(''); mm2zoll(); });

    const root = h('div', {},
      ui.panel('Rohrgrößen', sel.el, q, tab, info),
      ui.panel('Zoll ↔ Millimeter', zin.el, min.el, zout,
        ui.note('Zoll ist hier das exakte Maß (1" = 25,4 mm). Bei Gewinderohren ist der Nenn-Zoll nur eine Bezeichnung, nicht der Außendurchmesser.')));
    draw(); zoll2mm();
    return root;
  }

  WK.register({
    id: 'rohrgroessen',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Rohrmaße nachschlagen: Welchen Außen- und Innendurchmesser hat DN 25, oder ein Kupferrohr 28 × 1,5? Dazu gibt es einen Umrechner von Zoll in Millimeter und zurück.',
      schritte: [
        'Werkstoff wählen: Stahl, Kupfer, Edelstahl, Mehrschicht oder Rohrgewinde.',
        'In der Liste nachschauen oder oben im Suchfeld tippen, zum Beispiel 28 oder DN 25.',
        'Die Spalten zeigen Außendurchmesser, Wandstärke und Innendurchmesser in Millimetern.',
        'Zoll in Millimeter: unten den Zollwert eintippen, zum Beispiel 1 1/4 oder 0,75. Oder Millimeter eintippen und den Zollwert ablesen.'
      ],
      beispiel: 'Stahlrohr DN 25 (1 Zoll): Außendurchmesser 33,7 mm, Wand 3,25 mm, Innendurchmesser 27,2 mm. Und 1 1/4 Zoll sind 31,75 mm.',
      hinweis: 'Beim Gewinde ist der Zollwert nur der Name: Ein 1/2-Zoll-Gewinde hat 20,955 mm Außendurchmesser, nicht 12,7 mm.'
    },
    title: 'Rohrgrößen',
    desc: 'Zoll ↔ DN ↔ mm, Außen- und Innen-Ø je Werkstoff',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/></svg>',
    render
  });
})();
