// Modul: Rohr-Check (Fließgeschwindigkeit und Druckverlust in Wasserleitungen). Daten: js/data/rohre.js
// Rechnung: Darcy-Weisbach mit Colebrook, wie in den Druckverlusttabellen der Hersteller (Geberit).
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Wasserwerte: Dichte (kg/m³) und kinematische Viskosität (m²/s) bei 10 °C (Kaltwasser) und 60 °C (Warm-/Heizungswasser).
  // Dichten wie in den Geberit-Tabellen (999,7 / 983,2); Viskosität nach IAPWS, durch Abgleich mit den Geberit-Tabellen bestätigt.
  const WASSER = { 10: { rho: 999.7, nu: 1.306e-6 }, 60: { rho: 983.2, nu: 0.4745e-6 } };
  // Absolute Rauheit k in mm: Kupfer und Edelstahl 0,0015 (Geberit-Tabellen), Kunststoff und Verbundrohr 0,007
  // (aus der Geberit-Mepla-Tabelle zurückgerechnet, bei drei Größen auf 0,1 % bestätigt)
  const RAUHEIT = { glatt: 0.0015, kunststoff: 0.007 };

  // Reibungszahl λ nach Colebrook-White (turbulent) bzw. 64/Re (laminar, Re < 2300)
  function lambda(Re, d, kMm) {
    if (Re < 2300) return 64 / Re;
    const kd = kMm / 1000 / d;
    let f = 0.02;
    for (let i = 0; i < 100; i++) {
      const neu = Math.pow(-2 * Math.log10(kd / 3.7 + 2.51 / (Re * Math.sqrt(f))), -2);
      if (Math.abs(neu - f) < 1e-12) { f = neu; break; }
      f = neu;
    }
    return f;
  }

  // idMm: Innendurchmesser (mm), lMin: Wassermenge (l/min), temp: 10 oder 60, rauheit: 'glatt' oder 'kunststoff'
  // Ergebnis: Geschwindigkeit v (m/s), Druckgefälle R (mbar/m), Reynoldszahl
  function reibung({ idMm, lMin, temp, rauheit }) {
    const w = WASSER[temp], k = RAUHEIT[rauheit];
    if (!w || k == null || !(idMm > 0) || !(lMin > 0)) return null;
    const d = idMm / 1000;
    const q = lMin / 60000;                     // m³/s
    const v = q / (Math.PI * d * d / 4);
    const Re = v * d / w.nu;
    const lam = lambda(Re, d, k);
    const rPa = lam / d * w.rho * v * v / 2;    // Pa/m
    return { v, Re, lambda: lam, rMbar: rPa / 100, uebergang: Re >= 2300 && Re < 4000 };
  }
  // Druckverlust auf einer Strecke in mbar
  const verlust = (rMbar, laenge) => (laenge > 0 ? rMbar * laenge : null);
  WK.calc.druckverlust = { reibung, verlust, lambda, WASSER, RAUHEIT };

  // ---- Oberfläche ----
  const kommaText = n => String(+n.toFixed(2)).replace('.', ',');

  function render() {
    const { h, ui, fmt } = WK;
    const R = WK.data.rohre;
    const WERK = ['mehrschicht', 'kupfer'];
    const werke = R.werkstoffe.filter(w => WERK.includes(w.id));
    const rauheitVon = { mehrschicht: 'kunststoff', kupfer: 'glatt' };

    const mat = ui.select('Rohrmaterial', [
      { value: 'manuell', label: 'Innendurchmesser selbst eingeben' },
      ...werke.map(w => ({ value: w.id, label: w.name }))
    ], 'manuell');
    const groesse = ui.select('Größe', [{ value: '', label: 'bitte wählen' }], '');
    const wand = ui.num('Wandstärke Rohr', { unit: 'mm', value: '', hint: 'steht auf dem Rohr oder im Katalog' });
    const id = ui.num('Innendurchmesser Rohr', { unit: 'mm', value: '14,4', hint: 'Das Maß innen im Rohr' });
    const art = ui.select('Rohrart', [
      { value: 'kunststoff', label: 'Kunststoff oder Verbundrohr' },
      { value: 'glatt', label: 'Kupfer oder Edelstahl' }
    ], 'kunststoff');
    const menge = ui.num('Wassermenge', { unit: 'l/min', value: '18', hint: 'Steht im Datenblatt der Armatur oder des Geräts' });
    const temp = ui.select('Welches Wasser?', [
      { value: '10', label: 'Kaltwasser (gerechnet mit 10 °C)' },
      { value: '60', label: 'Warm- oder Heizungswasser (gerechnet mit 60 °C)' }
    ], '10');
    const laenge = ui.num('Länge der Leitung', { unit: 'm', value: '5', hint: 'Gesamte Rohrlänge bis zur Armatur' });
    const out = h('div');

    const werk = () => werke.find(w => w.id === mat.get());

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
      art.el.hidden = !!w;
      if (w && !groesse.get()) { out.replaceChildren(ui.note('Größe wählen.')); return; }
      if (w && w.nurAussen && !(id.get() > 0)) {
        out.replaceChildren(ui.note('Wandstärke eingeben. Der Innendurchmesser wird daraus gerechnet (Außen-Ø − 2 × Wand).', 'warn'));
        return;
      }
      const rauh = w ? rauheitVon[w.id] : art.get();
      const r = reibung({ idMm: id.get(), lMin: menge.get(), temp: Number(temp.get()), rauheit: rauh });
      if (!r) { out.replaceChildren(ui.note('Innendurchmesser und Wassermenge eingeben.', 'warn')); return; }
      const rows = [
        { k: 'Fließgeschwindigkeit', v: fmt(r.v, 2) + ' m/s', big: true },
        { k: 'Druckverlust je Meter', v: fmt(r.rMbar, 1) + ' mbar/m' }
      ];
      const mbar = verlust(r.rMbar, laenge.get());
      if (mbar != null) rows.push({ k: 'Druckverlust auf ' + fmt(laenge.get(), 1) + ' m', v: fmt(mbar / 1000, 2) + ' bar' + ' (' + fmt(mbar, 0) + ' mbar)' });
      out.replaceChildren(...[
        ui.result(rows),
        r.v > 5 ? ui.note('Über 5 m/s: höher als die Obergrenze für Verbrauchsleitungen.', 'warn')
          : r.v > 2 ? ui.note('Über 2 m/s: Für Hausanschlussleitungen nicht zulässig. Bei Verbrauchsleitungen sind je nach Armaturen bis 5 m/s möglich (DIN 1988-300, laut SBZ-Artikel).') : null,
        r.uebergang ? ui.note('Die Strömung liegt im Übergangsbereich (Re 2300 bis 4000), der Wert ist unsicherer.') : null,
        ui.note('Gerechnet wird nur das gerade Rohr. Bögen, Ventile, Zähler und die Armatur selbst kommen dazu. Es muss am Ende genug Fließdruck an der Armatur ankommen.'),
        w && w.id === 'mehrschicht'
          ? ui.note('Raxofix: Innendurchmesser aus Außen-Ø und Wand gerechnet. Real ist er bei 25, 32 und 63 mm bis 0,4 mm größer. Der Druckverlust liegt dann bis etwa 10 % niedriger, die Rechnung liegt auf der sicheren Seite.') : null
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
    for (const f of [menge, laenge]) f.input.addEventListener('input', update);
    for (const s of [temp, art]) s.select.addEventListener('change', update);

    const root = h('div', {},
      ui.panel(null, mat.el, groesse.el, wand.el, id.el, art.el, menge.el, temp.el, laenge.el),
      ui.panel('Ergebnis', out));
    update();
    return root;
  }

  WK.register({
    id: 'druckverlust',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Reicht mein Rohr für die Wassermenge? Du siehst, wie schnell das Wasser im Rohr fließt und wie viel Druck auf dem Weg verloren geht.',
      schritte: [
        'Rohrmaterial und Größe wählen (Raxofix oder Kupfer). Oder "Innendurchmesser selbst eingeben" lassen und das Maß innen im Rohr eintippen, dann noch die Rohrart wählen.',
        'Wassermenge in Litern pro Minute eintippen. Sie steht im Datenblatt der Armatur oder des Geräts.',
        'Kaltwasser oder Warm- bzw. Heizungswasser wählen und die Länge der Leitung eintippen.',
        'Ergebnis: Geschwindigkeit in m/s, Druckverlust je Meter und auf der ganzen Länge.'
      ],
      beispiel: 'Raxofix 20 × 2,8 (Innen 14,4 mm), 18 l/min Kaltwasser: 1,84 m/s und etwa 32 mbar je Meter, bei 5 m also etwa 0,16 bar.',
      hinweis: 'Bögen, Ventile, Zähler und die Armatur selbst sind nicht eingerechnet. Maßgeblich ist, ob am Ende genug Fließdruck an der Armatur ankommt.'
    },
    quelle: [
      'Rechenweg: Rohrreibung nach Darcy-Weisbach mit Colebrook-White, Wasser bei 10 °C (Dichte 999,7 kg/m³) und 60 °C (983,2 kg/m³). Gegenprobe mit den Druckverlusttabellen von Geberit (Mapress Edelstahl und Kupfer, Rauheit 0,0015 mm): Die Rechnung weicht bei vier geprüften Punkten (10 und 60 °C, Innen-Ø 16 bis 20 mm, 0,5 l/s) höchstens 0,2 % ab. Zweiter Rechenweg im Test: Swamee-Jain.',
      'Kunststoff und Verbundrohr (Raxofix): Rauheit 0,007 mm. Mit dieser Rauheit stimmt die Rechnung mit der Geberit-Mepla-Tabelle (Kaltwasser) bei Innen-Ø 11,5, 15 und 20 mm auf 0,1 % bis 0,9 % überein. Dass die Geberit-Mepla-Tabelle diese Rauheit nennt, ist nicht belegt, sie ist aus den Werten zurückgerechnet.',
      'Geschwindigkeitsgrenzen (Hausanschluss höchstens 2 m/s, Verbrauchsleitungen je nach Armaturen bis 5 m/s): ein Artikel (SBZ Monteur zu DIN 1988-300), die Norm selbst nicht eingesehen. Rohrmaße wie im Modul Rohrgrößen, Innen-Ø gerechnet.',
      'Nicht enthalten: Stahlrohre (Prestabo, Mapress XL, Gewinderohr), weil keine bestätigte Rauheit vorliegt. Einzelwiderstände (Bögen, Armaturen), Spitzendurchfluss nach DIN 1988-300 und andere Wassertemperaturen.'
    ],
    stichworte: 'druckverlust druckgefälle fließgeschwindigkeit geschwindigkeit wassermenge liter pro minute dusche regendusche rohr dimension durchmesser reicht trinkwasser wasserleitung mbar',
    title: 'Rohr-Check',
    desc: 'Geschwindigkeit und Druckverlust im Rohr',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h12M12 5l4 4-4 4"/><path d="M21 15H9M12 11l-4 4 4 4"/></svg>',
    render
  });
})();
