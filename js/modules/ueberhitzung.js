// Modul: Überhitzung und Unterkühlung. Nutzt die Drucktabelle aus js/modules/kaeltemittel.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Überhitzung = Temperatur Saugleitung - Taupunkt-Temperatur beim Saugdruck
  // Unterkühlung = Siedepunkt-Temperatur beim Hochdruck - Temperatur Flüssigkeitsleitung
  // pUe: Druck in bar Überdruck, t: gemessene Temperatur in °C
  function sat(stoffId, pUe, art) {
    const K = WK.calc.kaeltemittel;
    if (!Number.isFinite(pUe)) return null;
    return K.tempAus(stoffId, K.absAus(pUe), art);
  }
  function ueberhitzung({ stoff, pUe, t }) {
    const ts = sat(stoff, pUe, 'dew');
    if (ts == null || !Number.isFinite(t)) return null;
    return { tSat: ts, k: t - ts };
  }
  function unterkuehlung({ stoff, pUe, t }) {
    const ts = sat(stoff, pUe, 'bubble');
    if (ts == null || !Number.isFinite(t)) return null;
    return { tSat: ts, k: ts - t };
  }
  WK.calc.ueberhitzung = { ueberhitzung, unterkuehlung };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const stoff = ui.select('Kältemittel', WK.data.kaeltemittel.stoffe.map(s => ({ value: s.id, label: s.name })), 'r32');

    function tab(f, pLabel, tLabel, satLabel, kLabel, pStart, tStart, pHint, tHint) {
      const p = ui.num(pLabel, { unit: 'bar Ü', value: pStart, hint: pHint });
      const t = ui.num(tLabel, { unit: '°C', value: tStart, hint: tHint });
      const out = h('div');
      function upd() {
        const r = f({ stoff: stoff.get(), pUe: p.get(), t: t.get() });
        if (!r) { out.replaceChildren(ui.note('Druck (bar Überdruck) und Temperatur eintragen. Der Druck muss im Bereich der Tabelle liegen.', 'warn')); return; }
        const rows = [
          { k: satLabel, v: fmt(r.tSat, 1) + ' °C' },
          { k: kLabel, v: fmt(r.k, 1) + ' K', big: true }
        ];
        out.replaceChildren(...[ui.result(rows),
          r.k < 0 ? ui.note('Negativer Wert: die Messung stimmt nicht (Fühler, Druck oder Kältemittel prüfen).', 'warn') : null].filter(Boolean));
      }
      p.input.addEventListener('input', upd);
      t.input.addEventListener('input', upd);
      stoff.select.addEventListener('change', upd);
      upd();
      return h('div', {}, ui.panel(null, p.el, t.el), ui.panel('Ergebnis', out));
    }

    const boxU = tab(ueberhitzung, 'Saugdruck (Niederdruck)', 'Temperatur der Saugleitung', 'Taupunkt bei diesem Druck', 'Überhitzung',
      '8', '15', 'Niederdruckseite, meist das blaue Manometer', 'Anlegefühler an der Saugleitung (bei Split-Geräten das dickere Rohr)');
    const boxK = tab(unterkuehlung, 'Hochdruck', 'Temperatur der Flüssigkeitsleitung', 'Siedepunkt bei diesem Druck', 'Unterkühlung',
      '25', '35', 'Hochdruckseite, meist das rote Manometer', 'Anlegefühler an der Flüssigkeitsleitung (bei Split-Geräten das dünnere Rohr)');
    boxK.hidden = true;
    const tabs = ui.tabs([
      { value: 'u', label: 'Überhitzung' },
      { value: 'k', label: 'Unterkühlung' }
    ], v => { boxU.hidden = v !== 'u'; boxK.hidden = v !== 'k'; });
    return h('div', {}, ui.panel(null, stoff.el), tabs.el, boxU, boxK,
      ui.note('Es sind keine Sollwerte hinterlegt. Wie viel Überhitzung und Unterkühlung die Anlage haben soll, steht in der Anleitung des Herstellers.'));
  }

  WK.register({
    id: 'ueberhitzung',
    bereich: 'lueftung',
    hilfe: {
      wofuer: 'Rechnet aus Manometerdruck und gemessener Rohrtemperatur die Überhitzung (Saugseite) und die Unterkühlung (Flüssigkeitsseite) aus. Beides zeigt, ob die Anlage richtig gefüllt ist.',
      schritte: [
        'Kältemittel wählen (R32 oder R410A).',
        'Überhitzung: Saugdruck vom Niederdruck-Manometer und die Rohrtemperatur an der Saugleitung eintragen.',
        'Unterkühlung: Hochdruck vom Hochdruck-Manometer und die Rohrtemperatur an der Flüssigkeitsleitung eintragen.',
        'Das Ergebnis in Kelvin (K) vergleichst du mit der Anleitung des Geräteherstellers.'
      ],
      beispiel: 'R32, Saugdruck 8,0 bar Ü, Saugleitung 15 °C: Taupunkt bei etwa 3,3 °C, Überhitzung etwa 11,7 K.',
      hinweis: 'Das Modul rechnet nur. Sollwerte stehen nicht drin, weil sie je Gerät unterschiedlich sind.'
    },
    quelle: [
      'Überhitzung = gemessene Temperatur − Taupunkt-Temperatur beim Saugdruck. Unterkühlung = Siedepunkt-Temperatur beim Hochdruck − gemessene Temperatur. Beide Definitionen sind allgemeiner Stand der Kältetechnik.',
      'Die Sättigungstemperaturen kommen aus der Kältemittel-Drucktabelle (zwei Quellen, siehe dort). Zweiter Rechenweg im Test: Die Rückrechnung Druck → Temperatur → Druck führt auf den Ausgangsdruck zurück.'
    ],
    stichworte: 'überhitzung unterkühlung kältemittel r32 r410a saugdruck hochdruck klima split wärmepumpe füllmenge kelvin',
    title: 'Überhitzung & Unterkühlung',
    desc: 'Aus Druck und Rohrtemperatur, R32 und R410A',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/></svg>',
    render
  });
})();
