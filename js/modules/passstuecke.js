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

  const kommaZahl = n => String(n).replace('.', ',');

  function render() {
    const { h, ui, fmt } = WK;
    const v = ui.num('Querversatz V (Mitte zu Mitte)', { unit: 'mm', value: '300' });
    const w = ui.num('Winkel α', { unit: '°', value: '45' });
    const a = ui.num('Längsmaß A', { unit: 'mm', value: '300' });
    // Fitting und Größe wählen setzt das Z-Maß für beide Fittings ein; die Felder bleiben von Hand änderbar
    const Z = WK.data.zmasse;
    const fit = ui.select('Fitting (für das Z-Maß)', [
      { value: 'selbst', label: 'Z-Maß selbst eingeben' },
      ...Z.fittings.map(f => ({ value: f.id, label: f.name }))
    ], 'selbst');
    const gr = ui.select('Größe (Rohr-Außendurchmesser)', [{ value: '', label: 'bitte wählen' }], '');
    const fitHinweis = h('div');
    const z1 = ui.num('Z-Maß Fitting 1', { unit: 'mm', value: '0', hint: 'Wird bei Fitting und Größe eingesetzt. Sonst aus dem Viega-Online-Katalog, Reiter "Z-Maße".' });
    const z2 = ui.num('Z-Maß Fitting 2', { unit: 'mm', value: '0', hint: 'Anderes Fitting am zweiten Ende? Wert hier ändern.' });
    const out = h('div');
    const aktFit = () => Z.fittings.find(f => f.id === fit.get());
    function fuelleGroessen() {
      const f = aktFit();
      const opts = [{ value: '', label: 'bitte wählen' },
        ...(f ? f.werte.map(x => ({ value: String(x.d), label: kommaZahl(x.d) + ' mm (Z = ' + x.z + ' mm)' })) : [])];
      gr.select.replaceChildren(...opts.map(o => h('option', { value: o.value }, o.label)));
      gr.set('');
      fitHinweis.replaceChildren(...(f && f.hinweis ? [ui.note(f.hinweis)] : []));
    }
    let mode = 'versatz';
    const boxW = h('div', {}, w.el);
    const boxA = h('div', {}, a.el);

    function update() {
      boxW.hidden = mode !== 'versatz';
      boxA.hidden = mode !== 'dreieck';
      gr.el.hidden = fit.get() === 'selbst';
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
    for (const f of [v, w, a]) f.input.addEventListener('input', update);
    fit.select.addEventListener('change', () => { fuelleGroessen(); update(); });
    gr.select.addEventListener('change', () => {
      const f = aktFit();
      const x = f && f.werte.find(e => String(e.d) === gr.get());
      if (x) { z1.set(String(x.z)); z2.set(String(x.z)); }
      update();
    });
    // Z-Maß von Hand geändert: die Auswahl passt dann nicht mehr, sie springt auf "selbst eingeben"
    for (const f of [z1, z2]) f.input.addEventListener('input', () => {
      if (fit.get() !== 'selbst') { fit.set('selbst'); fuelleGroessen(); }
      update();
    });

    const root = h('div', {},
      tabs.el,
      ui.panel(null, h('div', { html: SKIZZE }), v.el, boxW, boxA, fit.el, gr.el, fitHinweis, z1.el, z2.el),
      ui.panel('Ergebnis', out,
        ui.note('Bei 45° gilt: Mittenlänge = Versatz × 1,414.'),
        h('details', {}, h('summary', {}, 'Was ist das Z-Maß?'),
          h('p', {}, 'Das Z-Maß ist bei Viega der Abstand von der Mittelachse des Fittings bis zur Anschlagfläche im Fitting, also bis dorthin, wo das Rohr anstößt. ' +
            'Die Einstecktiefe ist darin schon enthalten. Die Zuschnittlänge ist Mittenlänge − Z-Maß 1 − Z-Maß 2.'),
          h('p', {}, 'Nicht verwechseln mit dem Maß L im Katalog: L reicht bis zum äußeren Ende des Fittings und wird nicht abgezogen. ' +
            'Gemessen wird entlang der Achse des jeweiligen Anschlusses. Das Z-Maß ist je Fitting und System verschieden. ' +
            'Hinterlegt sind die Profipress-Bögen (45° und 90°) und die Prestabo-XL-Bögen (45° und 90°). Bei anderen Fittings steht der Wert auf der Produktseite im Viega-Online-Katalog im Reiter "Z-Maße".'),
          h('p', {}, 'Bei den Bögen gibt es eine Vorgängerversion mit anderen Z-Maßen (im Katalog die Spalte Z*). Wähle sie nur, wenn du noch alte Bögen verbaust.'))));
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
        'Fitting wählen, zum Beispiel "Profipress Bogen 45°" oder "Prestabo XL Bogen 90°", und die Größe. Das Z-Maß wird für beide Bögen eingesetzt. Das Z-Maß ist der Abstand von der Bogenmitte bis dorthin, wo das Rohr im Fitting anstößt. Bei anderen Fittings gibst du es selbst ein (Viega-Online-Katalog, Reiter "Z-Maße"). Kennst du es nicht, lass 0 stehen, dann bekommst du nur die Länge von Mitte zu Mitte.',
        'Ergebnis: Die Zuschnittlänge sägst du ab. Die Mittenlänge L ist die Strecke von Bogenmitte zu Bogenmitte.',
        'Kennst du statt des Winkels das Längsmaß, wähle oben "Längs + Quer".'
      ],
      beispiel: 'Versatz 300 mm bei 45°, Profipress 22 mm mit zwei Bögen 45°: Mittenlänge 424 mm. Z-Maß je Bogen 11 mm, also 424,3 − 11 − 11 = 402,3 mm Zuschnitt.',
      hinweis: 'Bei 45° gilt: Mittenlänge = Versatz × 1,414. Bei Fittings, die nicht in der Liste stehen, das Z-Maß bitte aus dem Katalog nehmen.'
    },
    quelle: [
      'Geometrie: Mittenlänge = Versatz ÷ sin(Winkel), Längsmaß und Dreieck nach Pythagoras. Geprüft mit Omni Calculator und eigener Gegenrechnung (300 mm bei 45° ergibt 424,26 mm).',
      'Z-Maß: Definition aus der Maßzeichnung im Viega-Online-Katalog (Profipress-Bögen 45° und 90°, Reiter "Z-Maße").',
      'Z-Maße Profipress-Bogen 90° (Modell 2416): Viega-Katalogseite, zweimal unabhängig abgelesen (Seitenabruf und Handy-Ansicht), alle Werte gleich. Bogen 45° (Modell 2426): Viega-Katalog, Größen 22 bis 54 beim Viega-Händler ritzmarine.com bestätigt, Größe 12 im Viega-Datenblatt (tbs-online.de).',
      'Gegenprobe: Maß L minus Z-Maß ergibt je Größe bei beiden Bögen und in beiden Ausführungen denselben Wert (Einstecktiefe: 18, 22, 22, 23, 24, 26, 36, 40 mm). Nur durch diese Gegenprobe abgesichert: 45°-Bogen Größe 15 und 18 sowie alle Werte der Vorgängerversion beim 45°-Bogen.',
      'Z-Maße Prestabo XL Bogen 90° und 45° (64, 76,1, 88,9, 108 mm): Viega-Katalog (direkt vom Hersteller, zwei Maßtabellen). Gegenprobe: L minus Z ergibt bei beiden Bögen dieselben Werte (43, 50, 50, 60 mm). Gilt nur für Viega Prestabo XL, nicht für Geberit Mapress.'
    ],
    stichworte: 'versatz bogen 45 grad winkel zuschnitt z-maß zmaß rohrlänge etage',
    title: 'Passstücke',
    desc: 'Zuschnitt bei Versatz, Z-Maße Profipress- und Prestabo-XL-Bögen',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h6l8-12h6"/></svg>',
    render
  });
})();
