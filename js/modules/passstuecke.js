// Modul: Passstücke / Versatz (45° und andere Winkel)
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Versatz v (Querabstand der Rohrachsen) und Winkel -> Mittenlänge, Längsmaß, Zuschnitt
  function versatz({ v, winkel, z1 = 0, z2 = 0 }) {
    if (!(v > 0) || !(winkel > 0 && winkel <= 90)) return null;
    const a = winkel * Math.PI / 180;
    const l = v / Math.sin(a);
    const laengs = v * Math.cos(a) / Math.sin(a);
    return { l, laengs: Math.abs(laengs) < 1e-9 ? 0 : laengs, faktor: 1 / Math.sin(a), zuschnitt: l - z1 - z2, abzug: z1 + z2 };
  }

  // Längsmaß a und Querversatz v bekannt -> Mittenlänge und Winkel
  function dreieck({ a, v, z1 = 0, z2 = 0 }) {
    if (!(a >= 0) || !(v > 0)) return null;
    const l = Math.hypot(a, v);
    return { l, winkel: Math.atan2(v, a) * 180 / Math.PI, zuschnitt: l - z1 - z2, abzug: z1 + z2 };
  }
  WK.calc.passstuecke = { versatz, dreieck };

  // ---- Oberfläche ----
  const SKIZZE = '<svg class="skizze" viewBox="0 0 300 120" role="img" aria-label="Skizze Versatz">' +
    '<path d="M10 95H95L195 25H290" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M215 95V25" stroke="#f28c28" stroke-width="2" stroke-dasharray="4 4"/>' +
    '<path d="M95 95H215" stroke="#f28c28" stroke-width="2" stroke-dasharray="4 4"/>' +
    '<g fill="currentColor" font-size="13" font-family="system-ui,sans-serif">' +
    '<text x="222" y="64">V</text><text x="148" y="112">A (Längsmaß)</text>' +
    '<text x="132" y="52">L</text><text x="122" y="88">α</text></g></svg>';

  function render() {
    const { h, ui, fmt } = WK;
    const v = ui.num('Querversatz V (Mitte zu Mitte)', { unit: 'mm', value: '300' });
    const w = ui.num('Winkel α', { unit: '°', value: '45' });
    const a = ui.num('Längsmaß A', { unit: 'mm', value: '300' });
    const z1 = ui.num('Z-Maß Fitting 1', { unit: 'mm', value: '0', hint: 'aus dem Viega-Online-Katalog, Reiter "Z-Maße"' });
    const z2 = ui.num('Z-Maß Fitting 2', { unit: 'mm', value: '0' });
    const out = h('div');
    let mode = 'versatz';
    const boxW = h('div', {}, w.el);
    const boxA = h('div', {}, a.el);

    function update() {
      boxW.hidden = mode !== 'versatz';
      boxA.hidden = mode !== 'dreieck';
      const zz = { z1: z1.get() || 0, z2: z2.get() || 0 };
      let rows, warn = null;
      if (mode === 'versatz') {
        const r = versatz({ v: v.get(), winkel: w.get(), ...zz });
        if (!r) { out.replaceChildren(ui.note('Versatz größer 0 und Winkel zwischen 0 und 90° eingeben.', 'warn')); return; }
        rows = [
          { k: 'Zuschnittlänge', v: fmt(r.zuschnitt, 1) + ' mm', big: true },
          { k: 'Mittenlänge L', v: fmt(r.l, 1) + ' mm' },
          { k: 'Längsmaß A', v: fmt(r.laengs, 1) + ' mm' },
          { k: 'Faktor L / V', v: fmt(r.faktor, 4) },
          { k: 'Abzug Z-Maße', v: fmt(r.abzug, 1) + ' mm' }
        ];
        if (r.zuschnitt <= 0) warn = 'Zuschnitt ist null oder negativ: Z-Maße größer als die Mittenlänge.';
      } else {
        const r = dreieck({ a: a.get(), v: v.get(), ...zz });
        if (!r) { out.replaceChildren(ui.note('Längsmaß (0 oder größer) und Versatz größer 0 eingeben.', 'warn')); return; }
        rows = [
          { k: 'Zuschnittlänge', v: fmt(r.zuschnitt, 1) + ' mm', big: true },
          { k: 'Mittenlänge L', v: fmt(r.l, 1) + ' mm' },
          { k: 'Winkel α', v: fmt(r.winkel, 2) + ' °' },
          { k: 'Abzug Z-Maße', v: fmt(r.abzug, 1) + ' mm' }
        ];
        if (r.zuschnitt <= 0) warn = 'Zuschnitt ist null oder negativ: Z-Maße größer als die Mittenlänge.';
      }
      out.replaceChildren(...[ui.result(rows), warn ? ui.note(warn, 'warn') : null].filter(Boolean));
    }

    const tabs = ui.tabs([
      { value: 'versatz', label: 'Versatz + Winkel' },
      { value: 'dreieck', label: 'Längs + Quer' }
    ], m => { mode = m; update(); });
    for (const f of [v, w, a, z1, z2]) f.input.addEventListener('input', update);

    const root = h('div', {},
      tabs.el,
      ui.panel(null, h('div', { html: SKIZZE }), v.el, boxW, boxA, z1.el, z2.el),
      ui.panel('Ergebnis', out,
        ui.note('Bei 45° gilt: Mittenlänge = Versatz × 1,414.'),
        h('details', {}, h('summary', {}, 'Was ist das Z-Maß?'),
          h('p', {}, 'Das Z-Maß ist bei Viega der Abstand von der Mittelachse des Fittings bis zur Anschlagfläche im Fitting, also bis dorthin, wo das Rohr anstößt. ' +
            'Die Einstecktiefe ist darin schon enthalten. Die Zuschnittlänge ist Mittenlänge − Z-Maß 1 − Z-Maß 2.'),
          h('p', {}, 'Nicht verwechseln mit dem Maß L im Katalog: L reicht bis zum äußeren Ende des Fittings und wird nicht abgezogen. ' +
            'Das Z-Maß ist je Fitting und System verschieden (Profipress, Sanpress, Raxofix, Bogen 45° oder 90°). ' +
            'Den Wert findest du auf der Produktseite des Fittings im Viega-Online-Katalog im Reiter "Z-Maße".'))));
    update();
    return root;
  }

  WK.register({
    id: 'passstuecke',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Muss eine Leitung seitlich versetzt werden, setzt du zwei Bögen und ein schräges Rohrstück dazwischen. Hier rechnest du aus, wie lang dieses Rohrstück zugeschnitten werden muss.',
      schritte: [
        'Querversatz V eintippen: der seitliche Abstand zwischen den beiden Rohrmitten.',
        'Winkel eintippen. Bei 45°-Bögen sind das 45.',
        'Z-Maß der beiden Bögen eintragen: der Abstand von der Bogenmitte bis dorthin, wo das Rohr im Fitting anstößt. Es steht im Viega-Online-Katalog auf der Produktseite im Reiter "Z-Maße". Kennst du es nicht, lass 0 stehen, dann bekommst du nur die Länge von Mitte zu Mitte.',
        'Ergebnis: Die Zuschnittlänge sägst du ab. Die Mittenlänge L ist die Strecke von Bogenmitte zu Bogenmitte.',
        'Kennst du statt des Winkels das Längsmaß, wähle oben "Längs + Quer".'
      ],
      beispiel: 'Versatz 300 mm bei 45°: Mittenlänge 424 mm. Mit je 20 mm Z-Maß (angenommener Wert, nicht aus dem Katalog) sind das 424 − 20 − 20 = 384 mm Zuschnitt.',
      hinweis: 'Bei 45° gilt: Mittenlänge = Versatz × 1,414. Die Z-Maße bitte immer aus dem Katalog nehmen.'
    },
    quelle: [
      'Geometrie: Mittenlänge = Versatz ÷ sin(Winkel), Längsmaß und Dreieck nach Pythagoras. Geprüft mit Omni Calculator und eigener Gegenrechnung (300 mm bei 45° ergibt 424,26 mm).',
      'Z-Maß: Definition aus der Maßzeichnung im Viega-Online-Katalog (Profipress-Bogen 90°). Werte stehen nicht in der App, sie sind je Fitting verschieden und kommen aus dem Katalog.'
    ],
    stichworte: 'versatz bogen 45 grad winkel zuschnitt z-maß zmaß rohrlänge etage',
    title: 'Passstücke',
    desc: 'Zuschnitt bei Versatz: 45° und andere Winkel, Z-Maße',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h6l8-12h6"/></svg>',
    render
  });
})();
