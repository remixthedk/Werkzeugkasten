// Modul: Dämmung nach GEG, Anlage 8. Daten: js/data/daemmung.js, js/data/rohre.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // p: { medium: 'warm'|'kalt', situation, id (Rohr-Innen-Ø mm), ad (Rohr-Außen-Ø mm, optional), lambda }
  function berechne(p) {
    const D = WK.data.daemmung;
    const ref = D.lambdaRef;
    const lam = p.lambda == null || Number.isNaN(p.lambda) ? ref : p.lambda;
    if (!(p.id > 0)) return { fehler: 'Innendurchmesser eingeben.' };
    if (!(lam > 0)) return { fehler: 'Wärmeleitfähigkeit muss größer als 0 sein.' };

    let d0, zeile;
    if (p.medium === 'kalt') {
      const z = D.kalt.find(r => p.id <= r.bis);
      d0 = z.dicke; zeile = z.ref;
    } else {
      const z = D.warm.find(r => p.id <= r.bis);
      d0 = z.dicke === 'ID' ? p.id : z.dicke;
      zeile = z.ref;
      const s = D.situationen.find(x => x.id === p.situation) || D.situationen[0];
      if (s.fix != null) { d0 = s.fix; zeile = s.ref; }
      else if (s.faktor !== 1) { d0 = d0 * s.faktor; zeile += ' + ' + s.ref; }
    }

    const res = { d0, zeile, lambda: lam, d: d0, dRund: Math.ceil(d0 - 1e-9), aussen: null, hinweis: null };
    if (Math.abs(lam - ref) > 1e-9) {
      if (p.ad > 0) {
        // gleicher Wärmedurchgang je Meter (Zylinderformel)
        res.d = (p.ad / 2) * (Math.pow(1 + 2 * d0 / p.ad, lam / ref) - 1);
        res.dRund = Math.ceil(res.d - 1e-9);
      } else {
        res.d = null; res.dRund = null;
        res.hinweis = 'Für die Umrechnung auf ein anderes λ wird der Außendurchmesser des Rohres gebraucht.';
      }
    }
    if (res.dRund != null && p.ad > 0) res.aussen = p.ad + 2 * res.dRund;
    return res;
  }
  WK.calc.daemmung = { berechne };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const D = WK.data.daemmung;
    const R = WK.data.rohre;

    const medium = ui.select('Medium', [
      { value: 'warm', label: 'Heizung / Warmwasser' },
      { value: 'kalt', label: 'Kälte / Kaltwasser (RLT, Klimakälte)' }
    ], 'warm');
    const sit = ui.select('Einbausituation', D.situationen.map(s => ({ value: s.id, label: s.label })), 'normal');

    const vor = [{ value: '', label: 'manuell eingeben' }];
    for (const w of R.werkstoffe) for (const r of w.rohre) {
      if (r.wand) vor.push({ value: w.id + '|' + r.bez, label: w.kurz + ' ' + r.bez + ' (Innen ' + fmt(r.ad - 2 * r.wand, 1) + ' mm)' });
    }
    const pre = ui.select('Rohr aus Liste (optional)', vor, '');
    const id = ui.num('Innendurchmesser Rohr', { unit: 'mm', value: '20' });
    const ad = ui.num('Außendurchmesser Rohr', { unit: 'mm', value: '22', hint: 'nur für andere Wärmeleitfähigkeit nötig' });
    const lam = ui.num('Wärmeleitfähigkeit Dämmstoff λ', { unit: 'W/(m·K)', value: '0,035' });
    const out = h('div');

    function update() {
      sit.el.hidden = medium.get() !== 'warm';
      const r = berechne({ medium: medium.get(), situation: sit.get(), id: id.get(), ad: ad.get(), lambda: lam.get() });
      if (r.fehler) { out.replaceChildren(ui.note(r.fehler, 'warn')); return; }
      const rows = [{ k: 'Tabellenwert bei λ 0,035', v: fmt(r.d0, 1) + ' mm' }];
      if (r.d != null) {
        rows.unshift({ k: 'Mindestdicke bei λ ' + fmt(r.lambda, 3), v: fmt(r.dRund, 0) + ' mm', big: true });
        if (Math.abs(r.d - r.d0) > 1e-9) rows.push({ k: 'rechnerisch', v: fmt(r.d, 1) + ' mm' });
        if (r.aussen) rows.push({ k: 'Außen-Ø mit Dämmung', v: fmt(r.aussen, 0) + ' mm' });
      }
      rows.push({ k: 'Fundstelle', v: 'Anlage 8 ' + r.zeile });
      out.replaceChildren(...[ui.result(rows), r.hinweis ? ui.note(r.hinweis, 'warn') : null].filter(Boolean));
    }

    pre.select.addEventListener('change', () => {
      const [wid, bez] = pre.get().split('|');
      const rohr = pre.get() && R.werkstoffe.find(w => w.id === wid).rohre.find(x => x.bez === bez);
      if (rohr) { ad.set(String(rohr.ad).replace('.', ',')); id.set(String(+(rohr.ad - 2 * rohr.wand).toFixed(2)).replace('.', ',')); }
      update();
    });
    for (const f of [id, ad]) f.input.addEventListener('input', () => { pre.set(''); update(); });
    lam.input.addEventListener('input', update);
    medium.select.addEventListener('change', update);
    sit.select.addEventListener('change', update);

    const root = h('div', {},
      ui.panel(null, medium.el, sit.el, pre.el, id.el, ad.el, lam.el),
      ui.panel('Ergebnis', out,
        ui.note('Maßgeblich ist laut Gesetz der Innendurchmesser der Leitung. ' +
          'Die Umrechnung auf ein anderes λ erfolgt nach gleichem Wärmedurchgang je Meter (Zylinderformel); ' +
          'das Gesetz verweist dafür auf die anerkannten Regeln der Technik. Bei Halbierung/Verdopplung wird zuerst der Tabellenwert geändert und dann umgerechnet.'),
        h('details', {}, h('summary', {}, 'Ausnahmen (Anlage 8 Nr. 1 b, c)'),
          h('p', {}, 'Keine Dämmpflicht nach Tabelle bei Leitungen in beheizten Räumen oder Bauteilen zwischen beheizten Räumen eines Nutzers, wenn die Wärmeabgabe über frei liegende Absperreinrichtungen regelbar ist. ' +
            'Ebenso bei Warmwasser-Stichleitungen bis 3 Liter Wasserinhalt in beheizten Räumen, ohne Zirkulation und ohne elektrische Begleitheizung.')),
        h('details', {}, h('summary', {}, 'Gleichwertige Begrenzung (Nr. 4)'),
          h('p', {}, 'Die Mindestdicken dürfen vermindert werden, wenn eine gleichwertige Begrenzung der Wärmeabgabe nachgewiesen wird, auch bei anderen Dämmanordnungen und unter Berücksichtigung der Dämmwirkung der Rohrwände.'))));
    update();
    return root;
  }

  WK.register({
    id: 'daemmung',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Das Gebäudeenergiegesetz (GEG) schreibt vor, wie dick Rohre gedämmt sein müssen. Hier siehst du die Mindestdicke für dein Rohr. Hat dein Dämmstoff eine andere Wärmeleitfähigkeit (λ), wird die Dicke dafür umgerechnet.',
      schritte: [
        'Medium wählen: Heizung / Warmwasser oder Kälte / Kaltwasser.',
        'Bei Heizung / Warmwasser die Einbausituation wählen. "Normal" ist der Standardfall. Im Wand- oder Deckendurchbruch gilt die halbe Dicke, an der Außenluft die doppelte.',
        'Rohr aus der Liste wählen oder den Innendurchmesser selbst eintippen. Der Innendurchmesser ist das Maß innen im Rohr, nicht außen.',
        'Nur wenn dein Dämmstoff nicht λ 0,035 hat: den λ-Wert vom Datenblatt des Dämmstoffs eintragen und den Außendurchmesser des Rohres angeben.',
        'Ergebnis: die Mindestdicke in Millimetern, auf volle Millimeter aufgerundet.'
      ],
      beispiel: 'Heizungsrohr Kupfer 22 × 1, Innendurchmesser 20 mm, Standardfall: Tabellenwert 20 mm bei λ 0,035. Dein Dämmstoff hat λ 0,040: Ergebnis 25 mm.',
      hinweis: 'Ausnahmen, zum Beispiel kurze Stichleitungen, stehen weiter unten in der Ergebniskarte. Maßgeblich ist immer der Gesetzestext.'
    },
    title: 'Dämmung nach GEG',
    desc: 'Mindestdicke Rohrdämmung, Umrechnung auf anderes λ',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/></svg>',
    render
  });
})();
