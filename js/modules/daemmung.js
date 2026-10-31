// Modul: Dämmung nach GEG, Anlage 8. Daten: js/data/daemmung.js, js/data/rohre.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // p: { medium: 'warm'|'kalt', situation, id (Rohr-Innen-Ø mm), ad (Rohr-Außen-Ø mm, optional), lambda }
  // Hinweis: Die Umrechnung auf ein anderes λ (lambda != 0,035) ist in der Oberfläche bewusst abgeschaltet,
  // weil das Gesetz kein Verfahren nennt und die Formel nicht belegt ist (siehe README, Prüfliste).
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
        // gleicher Wärmedurchgang je Meter (Zylinderformel), nicht belegt, nicht in der Oberfläche
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
  const kommaText = n => String(+n.toFixed(2)).replace('.', ',');

  function render() {
    const { h, ui, fmt } = WK;
    const D = WK.data.daemmung;
    const R = WK.data.rohre;

    const medium = ui.select('Medium', [
      { value: 'warm', label: 'Heizung / Warmwasser' },
      { value: 'kalt', label: 'Kälte / Kaltwasser (RLT, Klimakälte)' }
    ], 'warm');
    const sit = ui.select('Einbausituation', D.situationen.map(s => ({ value: s.id, label: s.label })), 'normal');

    // Rohrauswahl in zwei Schritten: erst Material, dann Größe
    const mat = ui.select('Rohrmaterial', [
      { value: 'manuell', label: 'Maße selbst eingeben' },
      ...R.werkstoffe.map(w => ({ value: w.id, label: w.name }))
    ], 'manuell');
    const groesse = ui.select('Größe', [{ value: '', label: 'bitte wählen' }], '');
    const wand = ui.num('Wandstärke Rohr', { unit: 'mm', value: '', hint: 'steht auf dem Rohr oder im Katalog' });
    const id = ui.num('Innendurchmesser Rohr', { unit: 'mm', value: '20' });
    const ad = ui.num('Außendurchmesser Rohr (optional)', { unit: 'mm', value: '22', hint: 'nur für die Angabe "Außen-Ø mit Dämmung"' });
    const out = h('div');

    const werk = () => R.werkstoffe.find(w => w.id === mat.get());

    function fuelleGroessen() {
      const w = werk();
      const opts = [{ value: '', label: 'bitte wählen' }];
      if (w) for (const r of w.rohre) {
        const label = w.nurAussen
          ? r.bez + ' mm' + (r.dn ? ' (' + r.dn + ')' : '')
          : r.bez + ' (Innen ' + fmt(r.ad - 2 * r.wand, 1) + ' mm)';
        opts.push({ value: r.bez, label });
      }
      groesse.select.replaceChildren(...opts.map(o => h('option', { value: o.value }, o.label)));
      groesse.set('');
    }

    function update() {
      const w = werk();
      sit.el.hidden = medium.get() !== 'warm';
      groesse.el.hidden = !w;
      wand.el.hidden = !(w && w.nurAussen && groesse.get());
      if (w && !groesse.get()) { out.replaceChildren(ui.note('Größe wählen.')); return; }
      if (w && w.nurAussen && !(id.get() > 0)) {
        out.replaceChildren(ui.note('Wandstärke eingeben. Der Innendurchmesser wird daraus gerechnet (Außen-Ø − 2 × Wand).', 'warn'));
        return;
      }
      const r = berechne({ medium: medium.get(), situation: sit.get(), id: id.get(), ad: ad.get() });
      if (r.fehler) { out.replaceChildren(ui.note(r.fehler, 'warn')); return; }
      const rows = [{ k: 'Mindestdicke bei λ 0,035', v: fmt(r.dRund, 0) + ' mm', big: true }];
      if (Math.abs(r.d0 - r.dRund) > 1e-9) rows.push({ k: 'Tabellenwert genau', v: fmt(r.d0, 1) + ' mm' });
      if (r.aussen) rows.push({ k: 'Außen-Ø mit Dämmung', v: fmt(r.aussen, 0) + ' mm' });
      rows.push({ k: 'Fundstelle', v: 'Anlage 8 ' + r.zeile });
      out.replaceChildren(...[
        ui.result(rows),
        w && w.id === 'mehrschicht' ? ui.note('Raxofix: Der Innendurchmesser ist gerechnet (Außen-Ø − 2 × Wand). Real ist er bei 25, 32 und 63 mm bis zu 0,4 mm größer.') : null
      ].filter(Boolean));
    }

    mat.select.addEventListener('change', () => {
      fuelleGroessen();
      wand.set('');
      update();
    });
    groesse.select.addEventListener('change', () => {
      const w = werk();
      const rohr = w && w.rohre.find(x => x.bez === groesse.get());
      wand.set('');
      if (rohr) {
        ad.set(kommaText(rohr.ad));
        id.set(rohr.wand ? kommaText(rohr.ad - 2 * rohr.wand) : '');
      }
      update();
    });
    wand.input.addEventListener('input', () => {
      const a = ad.get(), s = wand.get();
      id.set(a > 0 && s > 0 && a - 2 * s > 0 ? kommaText(a - 2 * s) : '');
      update();
    });
    // Wer Innen- oder Außendurchmesser von Hand ändert, arbeitet wieder ohne Rohrauswahl
    for (const f of [id, ad]) f.input.addEventListener('input', () => {
      if (mat.get() !== 'manuell') { mat.set('manuell'); fuelleGroessen(); wand.set(''); }
      update();
    });
    medium.select.addEventListener('change', update);
    sit.select.addEventListener('change', update);

    const root = h('div', {},
      ui.panel(null, medium.el, sit.el, mat.el, groesse.el, wand.el, id.el, ad.el),
      ui.panel('Ergebnis', out,
        ui.note('Maßgeblich ist laut Gesetz der Innendurchmesser der Leitung. Die Werte gelten für Dämmstoffe mit λ = 0,035 W/(m·K). ' +
          'Hat dein Dämmstoff ein anderes λ, muss die Dicke umgerechnet werden. Das Gesetz nennt dafür kein festes Verfahren ' +
          '("anerkannte Regeln der Technik"), deshalb rechnet die App das nicht selbst.'),
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
    stichworte: 'isolierung isolieren dämmung rohrdämmung geg mindestdicke gebäudeenergiegesetz',
    hilfe: {
      wofuer: 'Das Gebäudeenergiegesetz (GEG) schreibt vor, wie dick Rohre gedämmt sein müssen. Hier siehst du die Mindestdicke für dein Rohr.',
      schritte: [
        'Medium wählen: Heizung / Warmwasser oder Kälte / Kaltwasser.',
        'Bei Heizung / Warmwasser die Einbausituation wählen. "Normal" ist der Standardfall. Im Wand- oder Deckendurchbruch gilt die halbe Dicke, an der Außenluft die doppelte.',
        'Rohrmaterial wählen, danach die Größe. Bei Stahl und Raxofix füllt sich der Innendurchmesser von selbst. Bei Kupfer und Edelstahl trägst du die Wandstärke ein, der Innendurchmesser wird daraus gerechnet.',
        'Oder bei "Maße selbst eingeben" den Innendurchmesser direkt eintippen. Das ist das Maß innen im Rohr, nicht außen.',
        'Ergebnis: die Mindestdicke in Millimetern, auf volle Millimeter aufgerundet.'
      ],
      beispiel: 'Heizungsrohr Kupfer 22 mm mit 1 mm Wand: Innendurchmesser 20 mm, Standardfall. Ergebnis: 20 mm Dämmung.',
      hinweis: 'Die Werte gelten für Dämmstoffe mit λ 0,035. Ausnahmen, zum Beispiel kurze Stichleitungen, stehen weiter unten in der Ergebniskarte. Maßgeblich ist immer der Gesetzestext.'
    },
    quelle: [
      'Mindestdicken: Anlage 8 GEG. Gleiche Werte in gesetze-im-internet.de, buzer.de und lxgesetze.de (geprüft Oktober 2026). Die Tabelle bezieht sich auf den Innendurchmesser.',
      'Rohrmaße Stahl: DIN EN 10255 mittelschwer, geprüft in drei Quellen (Sikla, zickwolff.de, Wikipedia). Raxofix: Viega Gebrauchsanleitung und Prospekt, Händlerdaten zum Wasserinhalt.',
      'Nicht enthalten: Umrechnung auf anderes λ. Das Gesetz nennt kein Verfahren, eine belegte Formel liegt nicht vor.'
    ],
    title: 'Dämmung nach GEG',
    desc: 'Mindestdicke der Rohrdämmung nach Anlage 8',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/></svg>',
    render
  });
})();
