// Modul: Wasserinhalt von Rohren. Daten: js/data/rohre.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // id: Innendurchmesser in mm, laenge: Rohrlänge in m
  // Fläche (mm²) × 1 m = Fläche × 1000 mm³ = Fläche / 1000 Liter
  function inhalt({ id, laenge }) {
    if (!(id > 0)) return null;
    const proM = Math.PI * id * id / 4 / 1000;
    return { proM, gesamt: laenge > 0 ? proM * laenge : null };
  }
  WK.calc.wasserinhalt = { inhalt };

  // ---- Oberfläche ----
  const kommaText = n => String(+n.toFixed(2)).replace('.', ',');

  function render() {
    const { h, ui, fmt } = WK;
    const R = WK.data.rohre;

    const mat = ui.select('Rohrmaterial', [
      { value: 'manuell', label: 'Innendurchmesser selbst eingeben' },
      ...R.werkstoffe.map(w => ({ value: w.id, label: w.name }))
    ], 'manuell');
    const groesse = ui.select('Größe', [{ value: '', label: 'bitte wählen' }], '');
    const wand = ui.num('Wandstärke Rohr', { unit: 'mm', value: '', hint: 'steht auf dem Rohr oder im Katalog' });
    const id = ui.num('Innendurchmesser Rohr', { unit: 'mm', value: '20' });
    const laenge = ui.num('Rohrlänge', { unit: 'm', value: '10' });
    const out = h('div');

    const werk = () => R.werkstoffe.find(w => w.id === mat.get());

    function fuelleGroessen() {
      const w = werk();
      const opts = [{ value: '', label: 'bitte wählen' }];
      if (w) for (const r of w.rohre) {
        opts.push({ value: r.bez, label: w.nurAussen ? r.bez + ' mm' : r.bez + ' (Innen ' + fmt(r.ad - 2 * r.wand, 1) + ' mm)' });
      }
      groesse.select.replaceChildren(...opts.map(o => h('option', { value: o.value }, o.label)));
      groesse.set('');
    }

    function update() {
      const w = werk();
      groesse.el.hidden = !w;
      wand.el.hidden = !(w && w.nurAussen && groesse.get());
      if (w && !groesse.get()) { out.replaceChildren(ui.note('Größe wählen.')); return; }
      if (w && w.nurAussen && !(id.get() > 0)) {
        out.replaceChildren(ui.note('Wandstärke eingeben. Der Innendurchmesser wird daraus gerechnet (Außen-Ø − 2 × Wand).', 'warn'));
        return;
      }
      const r = inhalt({ id: id.get(), laenge: laenge.get() });
      if (!r) { out.replaceChildren(ui.note('Innendurchmesser eingeben.', 'warn')); return; }
      const rows = [{ k: 'Wasserinhalt je Meter', v: fmt(r.proM, 3) + ' l/m', big: true }];
      if (r.gesamt != null) rows.push({ k: 'Gesamtinhalt', v: fmt(r.gesamt, 2) + ' l' });
      out.replaceChildren(...[
        ui.result(rows),
        w && w.id === 'mehrschicht'
          ? ui.note('Raxofix: gerechnet aus Außen-Ø und Wand. Real ist der Innendurchmesser bei 25, 32 und 63 mm bis zu 0,4 mm größer, der Inhalt dann bis etwa 4 % höher.') : null,
        !laenge.get() || !(laenge.get() > 0) ? ui.note('Mit der Rohrlänge bekommst du auch den Gesamtinhalt.') : null
      ].filter(Boolean));
    }

    mat.select.addEventListener('change', () => { fuelleGroessen(); wand.set(''); update(); });
    groesse.select.addEventListener('change', () => {
      const w = werk();
      const rohr = w && w.rohre.find(x => x.bez === groesse.get());
      wand.set('');
      if (rohr) id.set(rohr.wand ? kommaText(rohr.ad - 2 * rohr.wand) : '');
      update();
    });
    wand.input.addEventListener('input', () => {
      const w = werk();
      const rohr = w && w.rohre.find(x => x.bez === groesse.get());
      const a = rohr ? rohr.ad : NaN, s = wand.get();
      id.set(a > 0 && s > 0 && a - 2 * s > 0 ? kommaText(a - 2 * s) : '');
      update();
    });
    // Innendurchmesser von Hand geändert: wieder ohne Rohrauswahl
    id.input.addEventListener('input', () => {
      if (mat.get() !== 'manuell') { mat.set('manuell'); fuelleGroessen(); wand.set(''); }
      update();
    });
    laenge.input.addEventListener('input', update);

    const root = h('div', {},
      ui.panel(null, mat.el, groesse.el, wand.el, id.el, laenge.el),
      ui.panel('Ergebnis', out));
    update();
    return root;
  }

  WK.register({
    id: 'wasserinhalt',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Wie viel Wasser passt in ein Rohr? Wichtig für die Füllmenge einer Anlage oder zum Abschätzen, wie viel Wasser beim Entleeren kommt.',
      schritte: [
        'Rohrmaterial und Größe wählen (Raxofix, Prestabo, Mapress XL, Kupfer oder Stahl-Gewinderohr). Der Innendurchmesser füllt sich von selbst. Bei Kupfer trägst du die Wandstärke ein.',
        'Oder oben "Innendurchmesser selbst eingeben" lassen und das Maß innen im Rohr eintippen.',
        'Rohrlänge in Metern eintippen.',
        'Ergebnis: Liter je Meter und Liter für die ganze Länge.'
      ],
      beispiel: 'Prestabo 22 × 1,5 mit 10 m Länge: Innendurchmesser 19 mm, 0,284 Liter je Meter, also 2,84 Liter insgesamt.',
      hinweis: 'Gerechnet wird nur das Rohr, nicht Fittings, Heizkörper oder Speicher.'
    },
    quelle: [
      'Formel: Innenfläche (π · d² ÷ 4) mal Länge. Gegengeprobt mit der Viega-Wasserinhaltstabelle für Prestabo (12 bis 54 mm): Die Rechnung stimmt in sieben von acht Größen auf zwei Stellen genau. Nur bei 15 × 1,2 nennt Viega 0,13 l/m, gerechnet sind 0,125 l/m (Rundung in der Viega-Tabelle).',
      'Rohrmaße (Raxofix, Prestabo, Mapress XL, Stahl-Gewinderohr): wie im Modul Rohrgrößen, mit Quellen dort. Innen-Ø jeweils gerechnet.',
      'Raxofix: Viega nennt in der Gebrauchsanleitung keinen Wasserinhalt. Der Wert ist gerechnet und kann bei 25, 32 und 63 mm bis etwa 4 % zu niedrig sein.'
    ],
    stichworte: 'wasser liter füllmenge inhalt volumen l/m rohr füllen entleeren',
    title: 'Wasserinhalt Rohr',
    desc: 'Liter je Meter und Gesamtinhalt eines Rohrs',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3.5 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11z"/></svg>',
    render
  });
})();
