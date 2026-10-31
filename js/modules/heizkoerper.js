// Modul: Heizkörperleistung bei anderen Temperaturen (EN 442, logarithmische Übertemperatur).
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Logarithmische Übertemperatur: ΔT = (tV − tR) / ln((tV − tL) / (tR − tL)). Gültig für tV >= tR > tL.
  function uebertemperatur(tv, tr, tl) {
    if (![tv, tr, tl].every(Number.isFinite) || !(tr > tl) || tv < tr) return null;
    if (tv - tr < 1e-9) return tv - tl;   // Grenzfall ohne Spreizung
    return (tv - tr) / Math.log((tv - tl) / (tr - tl));
  }
  // Leistung bei neuen Temperaturen: Φ = Φ0 × (ΔT / ΔT0)^n
  function leistung({ phi0, v0, r0, l0, v, r, l, n }) {
    const d0 = uebertemperatur(v0, r0, l0);
    const d = uebertemperatur(v, r, l);
    if (!(phi0 > 0) || !(n > 0) || d0 == null || d == null || !(d0 > 0) || !(d > 0)) return null;
    const faktor = Math.pow(d / d0, n);
    return { phi: phi0 * faktor, faktor, d0, d };
  }
  WK.calc.heizkoerper = { uebertemperatur, leistung };

  // ---- Oberfläche ----
  const NORM = [
    { value: '75/65/20', label: '75/65/20 °C (Norm, EN 442)', v: 75, r: 65, l: 20 },
    { value: '90/70/20', label: '90/70/20 °C', v: 90, r: 70, l: 20 },
    { value: '70/55/20', label: '70/55/20 °C', v: 70, r: 55, l: 20 },
    { value: '55/45/20', label: '55/45/20 °C', v: 55, r: 45, l: 20 }
  ];

  function render() {
    const { h, ui, fmt } = WK;
    const phi0 = ui.num('Leistung laut Katalog', { unit: 'W', value: '1000' });
    const norm = ui.select('Katalogleistung gilt bei', NORM.map(x => ({ value: x.value, label: x.label })), '75/65/20');
    const v = ui.num('Vorlauf', { unit: '°C', value: '55' });
    const r = ui.num('Rücklauf', { unit: '°C', value: '45' });
    const l = ui.num('Raumtemperatur', { unit: '°C', value: '20' });
    const n = ui.num('Heizkörperexponent n', { value: '1,3', hint: 'üblich 1,3; je Typ 1,27 bis 1,36. Genauer im Katalog des Herstellers' });
    const out = h('div');
    function update() {
      const nm = NORM.find(x => x.value === norm.get());
      const res = leistung({ phi0: phi0.get(), v0: nm.v, r0: nm.r, l0: nm.l, v: v.get(), r: r.get(), l: l.get(), n: n.get() });
      if (!res) { out.replaceChildren(ui.note('Alle Felder ausfüllen. Es muss gelten: Vorlauf ≥ Rücklauf > Raumtemperatur.', 'warn')); return; }
      out.replaceChildren(ui.result([
        { k: 'Leistung', v: fmt(res.phi, 0) + ' W', big: true },
        { k: 'Anteil der Katalogleistung', v: fmt(res.faktor * 100, 1) + ' %' },
        { k: 'Übertemperatur Katalog / neu', v: fmt(res.d0, 2) + ' / ' + fmt(res.d, 2) + ' K' }
      ]));
    }
    for (const f of [phi0, v, r, l, n]) f.input.addEventListener('input', update);
    norm.select.addEventListener('change', update);
    update();
    return h('div', {}, ui.panel('Katalogwert', phi0.el, norm.el), ui.panel('Neue Temperaturen', v.el, r.el, l.el, n.el),
      ui.panel('Ergebnis', out, ui.note('Richtwert. Der Exponent n ändert das Ergebnis bei kleinen Temperaturen um einige Prozent (bei 55/45 etwa 3 %). Für genaue Werte den Katalog oder Leistungsrechner des Herstellers nehmen.')));
  }

  WK.register({
    id: 'heizkoerper',
    bereich: 'heizung',
    hilfe: {
      wofuer: 'Rechnet aus, wie viel Leistung ein Heizkörper bei anderen Vor- und Rücklauftemperaturen abgibt, zum Beispiel bei einer Wärmepumpe mit 45/35 °C statt der Katalogleistung bei 75/65 °C.',
      schritte: [
        'Die Leistung aus dem Katalog in Watt eintragen und wählen, bei welchen Temperaturen sie gilt (meist 75/65/20 °C).',
        'Vorlauf, Rücklauf und Raumtemperatur eintragen, die du erreichen willst.',
        'Den Exponenten n aus dem Katalog eintragen. Ohne Angabe bleibt 1,3 stehen.',
        'Du siehst die Leistung in Watt und den Anteil der Katalogleistung.'
      ],
      beispiel: '1000 W bei 75/65/20 °C: bei 55/45/20 °C bleiben etwa 511 W, das sind 51 %. Bei 45/35/20 °C sind es nur noch etwa 297 W.',
      hinweis: 'Das Ergebnis ist ein Richtwert. Die Herstellerwerte bei den jeweiligen Temperaturen sind genauer.'
    },
    quelle: [
      'Formel: Φ = Φ_Norm × (ΔT ÷ ΔT_Norm)^n mit der logarithmischen Übertemperatur ΔT = (Vorlauf − Rücklauf) ÷ ln((Vorlauf − Raum) ÷ (Rücklauf − Raum)). Bei 75/65/20 °C sind das 49,83 K. SBZ Monteur und Caleffi nennen dieselbe Formel (EN 442).',
      'Beispiel von SBZ Monteur nachgerechnet: 1000 W bei 75/65/20 auf 55/45/20 mit n = 1,3 ergibt 511 W (SBZ nennt einmal "551 W", das ist ein Druckfehler). Vogel & Noot nennt n zwischen 1,274 und 1,357 je Typ und Temperatur.',
      'Der Exponent n steht nicht fest im Modul als Wert je Typ: Er ist ein Eingabefeld mit 1,3 als Vorgabe, weil er je Hersteller und Typ unterschiedlich ist.'
    ],
    stichworte: 'heizkörper leistung umrechnung vorlauftemperatur rücklauf niedertemperatur wärmepumpe exponent en 442 übertemperatur watt',
    frage: 'Wie viel Leistung hat mein Heizkörper bei anderen Temperaturen?',
    title: 'Heizkörper-Leistung',
    desc: 'Leistung bei anderen Temperaturen',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M8 8v8M12 8v8M16 8v8"/></svg>',
    render
  });
})();
