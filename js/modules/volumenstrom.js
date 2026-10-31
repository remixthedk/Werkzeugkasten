// Modul: Leistung <-> Volumenstrom bei Wasser (Heizung). Faustformel: 1 l Wasser = 1 kg, c = 1,163 Wh/(kg·K).
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Q [W] = V [l/h] × 1,163 × ΔT [K]  (gleichwertig: V [l/h] = Q [W] × 0,86 / ΔT)
  const C = 1.163;
  const pos = x => Number.isFinite(x) && x > 0;
  const volumenstrom = ({ kw, k }) => (pos(kw) && pos(k) ? kw * 1000 / (C * k) : null);     // l/h
  const leistung = ({ lh, k }) => (pos(lh) && pos(k) ? lh * C * k / 1000 : null);          // kW
  const spreizung = ({ kw, lh }) => (pos(kw) && pos(lh) ? kw * 1000 / (C * lh) : null);     // K
  WK.calc.volumenstrom = { volumenstrom, leistung, spreizung, C };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;

    function tab(felder, rechne, zeige) {
      const out = h('div');
      function upd() {
        const r = rechne(...felder.map(f => f.get()));
        out.replaceChildren(r == null ? ui.note('Alle Felder mit Werten größer 0 füllen.', 'warn') : ui.result(zeige(r)));
      }
      for (const f of felder) f.input.addEventListener('input', upd);
      upd();
      return h('div', {}, ui.panel(null, ...felder.map(f => f.el)), ui.panel('Ergebnis', out));
    }

    const boxV = tab(
      [ui.num('Leistung', { unit: 'kW', value: '6' }), ui.num('Spreizung (Vorlauf − Rücklauf)', { unit: 'K', value: '20' })],
      (kw, k) => volumenstrom({ kw, k }),
      lh => [
        { k: 'Volumenstrom', v: fmt(lh, 0) + ' l/h', big: true },
        { k: 'je Minute', v: fmt(lh / 60, 2) + ' l/min' },
        { k: 'je Stunde', v: fmt(lh / 1000, 3) + ' m³/h' }
      ]);
    const boxL = tab(
      [ui.num('Volumenstrom', { unit: 'l/h', value: '500' }), ui.num('Spreizung (Vorlauf − Rücklauf)', { unit: 'K', value: '10' })],
      (lh, k) => leistung({ lh, k }),
      kw => [
        { k: 'Leistung', v: fmt(kw, 2) + ' kW', big: true },
        { k: 'in Watt', v: fmt(kw * 1000, 0) + ' W' }
      ]);
    const boxS = tab(
      [ui.num('Leistung', { unit: 'kW', value: '6' }), ui.num('Volumenstrom', { unit: 'l/h', value: '600' })],
      (kw, lh) => spreizung({ kw, lh }),
      k => [{ k: 'Spreizung', v: fmt(k, 1) + ' K', big: true }]);

    const boxen = { v: boxV, l: boxL, s: boxS };
    const tabs = ui.tabs([
      { value: 'v', label: 'Volumenstrom' },
      { value: 'l', label: 'Leistung' },
      { value: 's', label: 'Spreizung' }
    ], v => { for (const k of Object.keys(boxen)) boxen[k].hidden = k !== v; });
    boxL.hidden = true; boxS.hidden = true;
    return h('div', {}, tabs.el, boxV, boxL, boxS,
      ui.note('Gerechnet mit 1 l Wasser = 1 kg und c = 1,163 Wh/(kg·K). Bei 60 °C ist das Wasser etwa 1,7 % leichter, der Volumenstrom also entsprechend größer. Für Glykol-Gemische gilt die Rechnung nicht.'));
  }

  WK.register({
    id: 'volumenstrom',
    bereich: 'heizung',
    hilfe: {
      wofuer: 'Rechnet aus Heizleistung und Temperaturspreizung den Volumenstrom des Heizwassers aus. Auch rückwärts: Leistung aus Volumenstrom und Spreizung, oder die Spreizung aus Leistung und Volumenstrom.',
      schritte: [
        'Oben wählen, was du wissen willst: Volumenstrom, Leistung oder Spreizung.',
        'Die beiden anderen Werte eintippen. Die Spreizung ist Vorlauf minus Rücklauf in Kelvin (K).',
        'Das Ergebnis siehst du gleich darunter, der Volumenstrom auch in l/min und m³/h.'
      ],
      beispiel: 'Ein Heizkreis mit 6 kW und 20 K Spreizung braucht etwa 258 l/h, das sind 4,3 l/min. Mit 10 kW und 5 K Spreizung sind es 1.720 l/h.',
      hinweis: 'Nur für Wasser. Der Wert gilt für den Heizkörper, den Kreis oder die ganze Anlage, je nachdem welche Leistung du einträgst.'
    },
    quelle: [
      'Volumenstrom V in l/h = Leistung Q in W × 0,86 ÷ Spreizung ΔT in K. Das ist gleichwertig mit Q ÷ (1,163 × ΔT). Zwei Quellen stimmen überein: energiefluss24 (10 kW bei 5 K = 1.720 l/h) und SBZ Monteur (6 kW bei 10 K = 516 l/h). Beide Beispiele sind im Test nachgerechnet.',
      '1,163 Wh/(kg·K) entspricht 4,186 kJ/(kg·K) (Wasser, 1 kWh = 3,6 MJ). Zweiter Rechenweg im Test: Rechnung mit c(T) und Dichte aus der Wassertabelle der App (Modul Wärme & Wasser) weicht bei 40 bis 60 °C um höchstens 2 % ab, das ist die Dichte.'
    ],
    stichworte: 'volumenstrom leistung spreizung kw l/h durchfluss heizkreis heizkörper massenstrom delta t pumpe wärmepumpe',
    title: 'Leistung & Volumenstrom',
    desc: 'Aus kW und Spreizung die l/h (und zurück)',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h12M12 5l4 4-4 4"/><path d="M21 15H9M12 11l-4 4 4 4"/></svg>',
    render
  });
})();
