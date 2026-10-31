// Modul: Gewicht von Rohr mit Wasser (für Schellen, Konsolen, Decken und Transport). Daten: js/data/rohre.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Dichte des Wassers in kg/l bei 10 °C und 60 °C (wie im Rohr-Check, Geberit-Tabellen)
  const WASSER_KG_L = { 10: 0.9997, 60: 0.9832 };
  // Dichte der Rohrwerkstoffe in g/cm³. Kupfer 8,94 (EN 1057), unlegierter Stahl 7,85. Nur diese zwei sind hinterlegt.
  const DICHTE = { kupfer: 8.94, stahl: 7.85 };

  // Gewicht des leeren Rohrs in kg/m aus Außendurchmesser und Wandstärke (mm). Fläche in mm² × 1 m × Dichte = g/m
  function rohrKgProM({ adMm, wandMm, werkstoff }) {
    const rho = DICHTE[werkstoff];
    if (!rho || !(adMm > 0) || !(wandMm > 0) || !(adMm - 2 * wandMm > 0)) return null;
    const flaeche = Math.PI / 4 * (adMm * adMm - Math.pow(adMm - 2 * wandMm, 2));   // mm²
    return flaeche * rho / 1000;
  }
  // Wasser im Rohr: Liter und kg je Meter aus dem Innendurchmesser (mm)
  function wasserProM({ idMm, temp }) {
    const rho = WASSER_KG_L[temp];
    if (!rho || !(idMm > 0)) return null;
    const l = Math.PI * idMm * idMm / 4 / 1000;
    return { l, kg: l * rho };
  }
  // Gesamt je Meter und über die Länge; rohrKg darf fehlen (dann nur Wasser)
  function gewicht({ idMm, temp, rohrKg, laenge }) {
    const w = wasserProM({ idMm, temp });
    if (!w) return null;
    const hatRohr = rohrKg > 0;
    const proM = w.kg + (hatRohr ? rohrKg : 0);
    const L = laenge > 0 ? laenge : null;
    return {
      wasserL: w.l, wasserKg: w.kg, rohrKg: hatRohr ? rohrKg : null, proM,
      gesamt: L ? { wasser: w.kg * L, rohr: hatRohr ? rohrKg * L : null, summe: proM * L } : null
    };
  }
  WK.calc.rohrgewicht = { rohrKgProM, wasserProM, gewicht, DICHTE, WASSER_KG_L };

  // ---- Oberfläche ----
  const kommaText = n => String(+n.toFixed(3)).replace('.', ',');
  const kommaText2 = n => String(+n.toFixed(2)).replace('.', ',');

  function render() {
    const { h, ui, fmt } = WK;
    const R = WK.data.rohre;

    const mat = ui.select('Rohrmaterial', [
      { value: 'manuell', label: 'Maße selbst eingeben' },
      ...R.werkstoffe.map(w => ({ value: w.id, label: w.name }))
    ], 'manuell');
    const groesse = ui.select('Größe', [{ value: '', label: 'bitte wählen' }], '');
    const wand = ui.num('Wandstärke Rohr', { unit: 'mm', value: '', hint: 'steht auf dem Rohr oder im Katalog' });
    const id = ui.num('Innendurchmesser Rohr', { unit: 'mm', value: '20', hint: 'Das Maß innen im Rohr' });
    const rohrKg = ui.num('Gewicht des leeren Rohrs', { unit: 'kg/m', value: '', hint: 'Aus dem Katalog oder Datenblatt. Bei Kupfer und Stahl wird es gerechnet.' });
    const temp = ui.select('Welches Wasser?', [
      { value: '10', label: 'Kaltwasser (gerechnet mit 10 °C)' },
      { value: '60', label: 'Warm- oder Heizungswasser (gerechnet mit 60 °C)' }
    ], '10');
    const laenge = ui.num('Länge der Leitung', { unit: 'm', value: '10' });
    const out = h('div');
    let rohrAuto = false;   // true, wenn das Rohrgewicht gerade aus den Maßen gerechnet wurde

    const werk = () => R.werkstoffe.find(w => w.id === mat.get());
    const rohrDef = () => { const w = werk(); return w && w.rohre.find(x => x.bez === groesse.get()); };

    function fuelleGroessen() {
      const w = werk();
      const opts = [{ value: '', label: 'bitte wählen' }];
      if (w) for (const r of w.rohre) {
        opts.push({ value: r.bez, label: w.nurAussen ? r.bez + ' mm' : r.bez + ' (Innen ' + fmt(r.ad - 2 * r.wand, 1) + ' mm)' });
      }
      groesse.select.replaceChildren(...opts.map(o => h('option', { value: o.value }, o.label)));
      groesse.set('');
    }
    // Rohrgewicht aus Material und Maßen rechnen (nur Kupfer und Stahl), sonst Feld leer lassen
    function setzeRohrgewicht() {
      const w = werk(), r = rohrDef();
      if (w && r && DICHTE[w.id]) {
        const s = w.nurAussen ? wand.get() : r.wand;
        const kg = rohrKgProM({ adMm: r.ad, wandMm: s, werkstoff: w.id });
        rohrKg.set(kg ? kommaText(kg) : ''); rohrAuto = !!kg;
      } else { rohrKg.set(''); rohrAuto = false; }
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
      const r = gewicht({ idMm: id.get(), temp: Number(temp.get()), rohrKg: rohrKg.get(), laenge: laenge.get() });
      if (!r) { out.replaceChildren(ui.note('Innendurchmesser eingeben.', 'warn')); return; }
      const rows = [{ k: r.rohrKg ? 'Rohr mit Wasser je Meter' : 'Wasser je Meter', v: fmt(r.proM, 2) + ' kg/m', big: true }];
      if (r.rohrKg) { rows.push({ k: 'davon Rohr', v: fmt(r.rohrKg, 2) + ' kg/m' }); }
      if (r.rohrKg) rows.push({ k: 'davon Wasser', v: fmt(r.wasserKg, 2) + ' kg/m (' + fmt(r.wasserL, 3) + ' l/m)' });
      if (r.gesamt) {
        rows.push({ k: 'Auf ' + fmt(laenge.get(), 1) + ' m insgesamt', v: fmt(r.gesamt.summe, 1) + ' kg' });
        if (r.gesamt.rohr != null) rows.push({ k: 'davon Rohr / Wasser', v: fmt(r.gesamt.rohr, 1) + ' / ' + fmt(r.gesamt.wasser, 1) + ' kg' });
      }
      out.replaceChildren(...[
        ui.result(rows),
        !r.rohrKg ? ui.note('Das Gewicht des leeren Rohrs fehlt. Trag es oben ein (Katalog oder Datenblatt), dann siehst du Rohr und Wasser zusammen.') : null,
        rohrAuto ? ui.note('Rohrgewicht aus den Maßen gerechnet. Echte Rohre weichen durch die Toleranz der Wandstärke etwas ab. Verzinkte Rohre sind durch die Zinkschicht leicht schwerer.') : null,
        ui.note('Nur Rohr und Wasser. Fittings, Dämmung, Schellen und Armaturen kommen dazu. Das Gewicht trägt keine Last der Befestigung, das gibt der Hersteller der Schellen vor.')
      ].filter(Boolean));
    }

    mat.select.addEventListener('change', () => { fuelleGroessen(); wand.set(''); setzeRohrgewicht(); update(); });
    groesse.select.addEventListener('change', () => {
      const w = werk(), r = rohrDef();
      wand.set('');
      if (r) id.set(r.wand ? kommaText2(r.ad - 2 * r.wand) : '');
      setzeRohrgewicht(); update();
    });
    wand.input.addEventListener('input', () => {
      const r = rohrDef();
      const a = r ? r.ad : NaN, s = wand.get();
      id.set(a > 0 && s > 0 && a - 2 * s > 0 ? kommaText2(a - 2 * s) : '');
      setzeRohrgewicht(); update();
    });
    // Innendurchmesser von Hand geändert: wieder ohne Rohrauswahl
    id.input.addEventListener('input', () => {
      if (mat.get() !== 'manuell') { mat.set('manuell'); fuelleGroessen(); wand.set(''); rohrKg.set(''); rohrAuto = false; }
      update();
    });
    rohrKg.input.addEventListener('input', () => { rohrAuto = false; update(); });
    laenge.input.addEventListener('input', update);
    temp.select.addEventListener('change', update);

    const root = h('div', {},
      ui.panel(null, mat.el, groesse.el, wand.el, id.el, rohrKg.el, temp.el, laenge.el),
      ui.panel('Ergebnis', out));
    update();
    return root;
  }

  WK.register({
    id: 'rohrgewicht',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Wie schwer ist ein Rohr mit Wasser? Wichtig für Schellen, Konsolen, Decken und Transport.',
      schritte: [
        'Rohrmaterial und Größe wählen. Der Innendurchmesser füllt sich von selbst. Bei Kupfer trägst du die Wandstärke ein.',
        'Bei Kupfer und Stahl-Gewinderohr wird das Gewicht des leeren Rohrs gerechnet. Bei allen anderen Rohren trägst du es aus dem Katalog oder Datenblatt ein, sonst siehst du nur das Wasser.',
        'Kaltwasser oder Warm- bzw. Heizungswasser wählen und die Länge der Leitung eintippen.',
        'Ergebnis: kg je Meter und kg auf der ganzen Länge, getrennt in Rohr und Wasser.'
      ],
      beispiel: 'Kupfer 22 × 1 mit 10 m Länge: Rohr 0,59 kg/m, Wasser 0,31 kg/m, zusammen 0,90 kg/m, also 9,0 kg.',
      hinweis: 'Nur Rohr und Wasser. Fittings, Dämmung, Schellen und Armaturen kommen dazu.'
    },
    quelle: [
      'Wasser: Innenfläche (π · d² ÷ 4) mal Dichte (0,9997 kg/l bei 10 °C, 0,9832 kg/l bei 60 °C, wie in den Geberit-Druckverlusttabellen).',
      'Rohrgewicht Kupfer (EN 1057, Dichte 8,94 g/cm³) und Stahl-Gewinderohr (EN 10255, Dichte 7,85 g/cm³): aus Außendurchmesser und Wand gerechnet. Gegenprobe mit der Sikla-Rohrtabelle: Kupfer 15 × 1 bis 54 × 2 stimmt auf höchstens 0,9 % (Rundung der Tabelle auf zwei Stellen, meist unter 0,35 %), Stahl DN 15 bis DN 100 auf höchstens 0,3 %. Die Dichte von Kupfer steht bei chemie.de mit 8,92 g/cm³ (0,2 % darunter).',
      'Nicht enthalten: Rohrgewicht für Raxofix, Prestabo und Mapress XL (keine bestätigte Herstellerangabe gefunden, Prestabo ist außen verzinkt und Mapress XL gibt es in zwei Werkstoffen). Dort trägst du das Gewicht aus dem Katalog selbst ein. Dämmung, Fittings und Schellen sind nicht eingerechnet.'
    ],
    stichworte: 'gewicht rohr wasser kg schellen befestigung konsole decke last transport kilogramm masse leitung',
    title: 'Rohrgewicht',
    desc: 'Gewicht von Rohr mit Wasser',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l2 12H4z"/><circle cx="12" cy="5" r="2"/></svg>',
    render
  });
})();
