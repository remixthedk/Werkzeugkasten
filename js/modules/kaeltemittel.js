// Modul: Kältemittel-Drucktabelle (R32, R410A). Daten: js/data/kaeltemittel.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Zwischen den 1-K-Stützstellen wird ln(p) linear in der Temperatur gerechnet (Sättigungsdruck steigt fast exponentiell).
  const D = () => WK.data.kaeltemittel;
  const stoff = id => D().stoffe.find(s => s.id === id) || null;
  const linie = (s, art) => (art === 'bubble' ? s.bubble : s.dew);
  const absAus = pUe => pUe + D().atm;
  const ueAus = pAbs => pAbs - D().atm;

  // Druck in bar absolut bei Temperatur t (°C). art: 'dew' (Taupunkt) oder 'bubble' (Siedepunkt). Außerhalb der Tabelle: null.
  function druckAbs(id, t, art) {
    const s = stoff(id);
    if (!s || !Number.isFinite(t) || t < D().tMin || t > D().tMax) return null;
    const a = linie(s, art);
    const i = Math.min(Math.floor(t - D().tMin), a.length - 2);
    const f = t - D().tMin - i;
    return Math.exp(Math.log(a[i]) * (1 - f) + Math.log(a[i + 1]) * f);
  }
  // Sättigungstemperatur in °C bei Druck pAbs (bar absolut). Außerhalb der Tabelle: null.
  function tempAus(id, pAbs, art) {
    const s = stoff(id);
    if (!s || !Number.isFinite(pAbs)) return null;
    const a = linie(s, art);
    if (pAbs < a[0] || pAbs > a[a.length - 1]) return null;
    let i = 0;
    while (i < a.length - 2 && pAbs > a[i + 1]) i++;
    const f = (Math.log(pAbs) - Math.log(a[i])) / (Math.log(a[i + 1]) - Math.log(a[i]));
    return D().tMin + i + f;
  }
  WK.calc.kaeltemittel = { druckAbs, tempAus, absAus, ueAus, stoff };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const opts = D().stoffe.map(s => ({ value: s.id, label: s.name }));
    const bar = (x, n = 2) => fmt(x, n) + ' bar';

    // Tab 1: Temperatur -> Druck
    const stoffA = ui.select('Kältemittel', opts, 'r32');
    const temp = ui.num('Sättigungstemperatur', { unit: '°C', value: '10' });
    const outA = h('div');
    function updA() {
      const id = stoffA.get(); const s = stoff(id); const t = temp.get();
      const tau = druckAbs(id, t, 'dew');
      if (tau == null) { outA.replaceChildren(ui.note('Temperatur zwischen ' + D().tMin + ' und ' + D().tMax + ' °C eingeben.', 'warn')); return; }
      const siede = druckAbs(id, t, 'bubble');
      const zeilen = s.glide ? [
        { k: 'Taupunkt (Verdampfer)', v: bar(ueAus(tau)) + ' Ü', big: true },
        { k: 'Siedepunkt (Verflüssiger)', v: bar(ueAus(siede)) + ' Ü', big: true },
        { k: 'absolut Tau / Siede', v: fmt(tau, 2) + ' / ' + fmt(siede, 2) + ' bar' }
      ] : [
        { k: 'Überdruck', v: bar(ueAus(tau)) + ' Ü', big: true },
        { k: 'absolut', v: bar(tau) }
      ];
      outA.replaceChildren(ui.result(zeilen));
    }
    stoffA.select.addEventListener('change', updA);
    temp.input.addEventListener('input', updA);

    // Tab 2: Druck -> Temperatur
    const stoffB = ui.select('Kältemittel', opts, 'r32');
    const druck = ui.num('Druck am Manometer', { unit: 'bar Ü', value: '8', hint: 'Überdruck, wie ihn das Monteurhilfe-Manometer zeigt' });
    const outB = h('div');
    function updB() {
      const id = stoffB.get(); const s = stoff(id); const p = druck.get();
      const tau = tempAus(id, absAus(p), 'dew');
      if (tau == null) { outB.replaceChildren(ui.note('Druck liegt außerhalb der Tabelle (' + fmt(ueAus(linie(s, 'dew')[0]), 1) + ' bis ' + fmt(ueAus(linie(s, 'dew')[linie(s, 'dew').length - 1]), 1) + ' bar Ü).', 'warn')); return; }
      const siede = tempAus(id, absAus(p), 'bubble');
      const zeilen = s.glide ? [
        { k: 'Taupunkt-Temperatur', v: fmt(tau, 1) + ' °C', big: true },
        { k: 'Siedepunkt-Temperatur', v: fmt(siede, 1) + ' °C', big: true }
      ] : [{ k: 'Sättigungstemperatur', v: fmt(tau, 1) + ' °C', big: true }];
      outB.replaceChildren(ui.result(zeilen));
    }
    stoffB.select.addEventListener('change', updB);
    druck.input.addEventListener('input', updB);

    // Tab 3: Tabelle in 5-K-Schritten
    const zeilenT = [];
    for (let t = D().tMin; t <= D().tMax; t += 5) {
      const r32 = druckAbs('r32', t, 'dew');
      zeilenT.push([String(t), fmt(ueAus(r32), 2),
        fmt(ueAus(druckAbs('r410a', t, 'dew')), 2), fmt(ueAus(druckAbs('r410a', t, 'bubble')), 2)]);
    }
    const tabelle = h('div', {}, ui.panel('Überdruck in bar', ui.table(['°C', 'R32', 'R410A Tau', 'R410A Siede'], zeilenT),
      ui.note('R32 ist ein Reinstoff: ein Druck je Temperatur. R410A hat einen kleinen Temperaturgleit: Tau (Dampf) gilt für die Überhitzung, Siede (Flüssigkeit) für die Unterkühlung.')));

    const boxA = h('div', {}, ui.panel(null, stoffA.el, temp.el), ui.panel('Druck', outA));
    const boxB = h('div', {}, ui.panel(null, stoffB.el, druck.el), ui.panel('Temperatur', outB));
    const boxen = { a: boxA, b: boxB, t: tabelle };
    const tabs = ui.tabs([
      { value: 'a', label: 'Temperatur bekannt' },
      { value: 'b', label: 'Druck bekannt' },
      { value: 't', label: 'Ganze Tabelle' }
    ], v => { for (const k of Object.keys(boxen)) boxen[k].hidden = k !== v; });
    boxB.hidden = true; tabelle.hidden = true;
    updA(); updB();
    return h('div', {}, tabs.el, boxA, boxB, tabelle,
      ui.note('Drücke sind Sättigungsdrücke von reinem Kältemittel. Barometerstand und Messfehler des Manometers sind nicht berücksichtigt (Überdruck = absolut − 1,01325 bar).'));
  }

  WK.register({
    id: 'kaeltemittel',
    bereich: 'lueftung',
    hilfe: {
      wofuer: 'Zeigt zu R32 und R410A, welcher Druck zu welcher Verdampfungs- oder Verflüssigungstemperatur gehört und umgekehrt. So prüfst du an den Manometern, ob die Anlage im Normalbereich läuft.',
      schritte: [
        '°C → Druck: Kältemittel wählen und die Temperatur eintippen. Du siehst den Überdruck, so wie ihn das Manometer anzeigt.',
        'Druck → °C: den Druck vom Manometer (bar Überdruck) eintippen. Du siehst die dazugehörige Sättigungstemperatur.',
        'Tabelle: alle Werte von −40 bis +70 °C in 5-K-Schritten zum Nachschlagen.',
        'Bei R410A gibt es zwei Werte: Taupunkt (Dampf, für die Überhitzung) und Siedepunkt (Flüssigkeit, für die Unterkühlung).'
      ],
      beispiel: 'R32 bei 10 °C Verdampfungstemperatur: 10,06 bar Überdruck (11,07 bar absolut). R410A bei 10 °C: Tau 9,83 bar Ü, Siede 9,87 bar Ü.',
      hinweis: 'Das sind reine Sättigungsdrücke. Welche Drücke deine Anlage haben soll, steht in der Anleitung des Geräteherstellers.'
    },
    quelle: [
      'Werte aus CoolProp 7 (Referenzzustandsgleichungen für R32 und R410A, Datenbasis wie NIST REFPROP). Zwischen den 1-K-Werten wird logarithmisch interpoliert.',
      'Gegenprobe an zwei unabhängigen Herstellertabellen: Arkema Forane (Datenbasis NIST REFPROP 10) und Chadwell Supply A2L-PT-Chart. Verglichen bei 0, 10, 20 und 37,8 °C: höchstens 0,04 % Abweichung, das ist Rundung der psig-Werte. Umrechnung: 1 psi = 0,0689476 bar, Normaldruck 1,01325 bar.',
      'R410A hat etwa 0,1 K Temperaturgleit (bei gleichem Druck 0,09 bis 0,12 K) zwischen Tau- und Siedepunkt; deshalb werden beide Werte gezeigt. Im Test mit eigenen Zwischenwerten (halbe Grad) stimmt die Interpolation auf 0,05 % mit CoolProp überein.'
    ],
    stichworte: 'kältemittel r32 r410a druck temperatur tabelle manometer sättigung verdampfung verflüssigung klima split wärmepumpe pt',
    title: 'Kältemittel-Druck',
    desc: 'R32 und R410A: Druck und Temperatur',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l4-5"/><path d="M6 16h1M17 16h1M12 8v1"/></svg>',
    render
  });
})();
