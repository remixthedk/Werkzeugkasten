// Modul: Fußbodenheizung. Nur Geometrie und Volumenstrom, keine Herstellerwerte.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Rohr im Raum = Fläche ÷ Verlegeabstand. Je Heizkreis kommt Hin- und Rückleitung zum Verteiler dazu (2 × Entfernung).
  // Volumenstrom je Kreis: l/h = Leistung (W) ÷ (1,163 × Spreizung)
  const C = 1.163;
  function fbh({ flaeche, va, entfernung, maxLaenge, wm2, spreizung }) {
    if (!(flaeche > 0) || !(va > 0)) return null;
    const e = Number.isFinite(entfernung) && entfernung > 0 ? entfernung : 0;
    const raum = flaeche / (va / 100);          // m Rohr in der Fläche
    const zu = 2 * e;                            // m Zu- und Rückleitung je Kreis
    const r = { raum, mProM2: raum / flaeche, zu, kreise: 1, laengeJeKreis: raum + zu, gesamt: raum + zu, passt: null, lh: null };
    if (Number.isFinite(maxLaenge) && maxLaenge > 0) {
      if (maxLaenge <= zu) return { ...r, fehler: 'maxzukurz' };
      const k = Math.ceil(raum / (maxLaenge - zu) - 1e-9);
      r.kreise = k;
      r.laengeJeKreis = raum / k + zu;
      r.gesamt = raum + k * zu;
      r.passt = k === 1;
    }
    if (wm2 > 0 && spreizung > 0) r.lh = (flaeche / r.kreise) * wm2 / (C * spreizung);
    return r;
  }
  WK.calc.fbh = { fbh };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const flaeche = ui.num('Fläche', { unit: 'm²', value: '20' });
    const va = ui.num('Verlegeabstand', { unit: 'cm', value: '15', hint: 'üblich 10, 15 oder 20 cm' });
    const ent = ui.num('Entfernung zum Verteiler', { unit: 'm', value: '5', hint: 'einfache Strecke, Hin- und Rückleitung werden dazugerechnet' });
    const max = ui.num('Höchste Heizkreislänge', { unit: 'm', value: '', placeholder: 'leer lassen = egal', hint: 'steht in den Unterlagen des Rohrherstellers' });
    const wm2 = ui.num('Heizleistung', { unit: 'W/m²', value: '', placeholder: 'z. B. 60', hint: 'nur für den Volumenstrom' });
    const k = ui.num('Spreizung', { unit: 'K', value: '5', hint: 'Vorlauf minus Rücklauf, nur für den Volumenstrom' });
    const out = h('div');
    function update() {
      const r = fbh({ flaeche: flaeche.get(), va: va.get(), entfernung: ent.get(), maxLaenge: max.get(), wm2: wm2.get(), spreizung: k.get() });
      if (!r) { out.replaceChildren(ui.note('Fläche und Verlegeabstand eingeben.', 'warn')); return; }
      if (r.fehler) { out.replaceChildren(ui.note('Die höchste Heizkreislänge ist kleiner als die Zuleitung. Entfernung oder Höchstlänge prüfen.', 'warn')); return; }
      const rows = [
        { k: 'Rohr in der Fläche', v: fmt(r.raum, 1) + ' m', big: true },
        { k: 'je m²', v: fmt(r.mProM2, 2) + ' m/m²' },
        { k: 'Zu- und Rückleitung je Kreis', v: fmt(r.zu, 1) + ' m' }
      ];
      if (r.passt === null) {
        rows.push({ k: 'Gesamt mit Zuleitung', v: fmt(r.gesamt, 1) + ' m', big: true });
      } else {
        rows.push({ k: 'Heizkreise', v: fmt(r.kreise, 0), big: true });
        rows.push({ k: 'Länge je Kreis', v: fmt(r.laengeJeKreis, 1) + ' m' });
        rows.push({ k: 'Rohr gesamt', v: fmt(r.gesamt, 1) + ' m' });
      }
      if (r.lh != null) rows.push({ k: 'Volumenstrom je Kreis', v: fmt(r.lh, 0) + ' l/h' });
      out.replaceChildren(...[ui.result(rows),
        r.passt === null ? ui.note('Wie viele Heizkreise du brauchst, siehst du, wenn du oben die höchste Heizkreislänge einträgst. Sie steht in den Unterlagen des Rohrherstellers.') : null,
        r.passt === false ? ui.note('Die Fläche passt nicht in einen Heizkreis. Gerechnet wird mit gleich großen Kreisen, jeder mit eigener Zu- und Rückleitung.') : null].filter(Boolean));
    }
    for (const f of [flaeche, va, ent, max, wm2, k]) f.input.addEventListener('input', update);
    update();
    return h('div', {}, ui.panel(null, flaeche.el, va.el, ent.el, max.el), ui.panel('Nur für den Volumenstrom', wm2.el, k.el),
      ui.panel('Ergebnis', out, ui.note('Nur Geometrie: ohne Zuschlag für Bögen, Randzonen und Verteileranbindung. Heizleistung, Verlegeabstand und Höchstlänge kommen aus deiner Planung und den Herstellerunterlagen.')));
  }

  WK.register({
    id: 'fussbodenheizung',
    bereich: 'heizung',
    hilfe: {
      wofuer: 'Rechnet aus Fläche und Verlegeabstand, wie viel Rohr du für die Fußbodenheizung brauchst, und verteilt es auf Heizkreise. Zusätzlich der Volumenstrom je Kreis.',
      schritte: [
        'Fläche in m², Verlegeabstand in cm und die einfache Entfernung zum Verteiler eintragen.',
        'Wenn du die höchste Heizkreislänge des Rohrherstellers kennst, trage sie ein. Dann siehst du, wie viele Kreise nötig sind.',
        'Für den Volumenstrom je Kreis noch die Heizleistung in W/m² und die Spreizung eintragen.'
      ],
      beispiel: '20 m² bei 15 cm Abstand: 133,3 m Rohr in der Fläche (6,67 m/m²). Bei 5 m Entfernung kommen 10 m Zu- und Rückleitung dazu. Mit höchstens 100 m je Kreis sind es 2 Kreise mit je 76,7 m.',
      hinweis: 'Es sind keine Herstellerwerte hinterlegt, auch nicht für die höchste Heizkreislänge. Sie hängt von Rohr und Hersteller ab.'
    },
    quelle: [
      'Reine Geometrie: Rohrlänge in der Fläche = Fläche ÷ Verlegeabstand, also 15 cm = 6,67 m/m² und 20 cm = 5 m/m². Gegenrechnung im Test: 100 ÷ Abstand in cm. Die Zahl der Kreise rundet immer auf.',
      'Volumenstrom je Kreis = Fläche je Kreis × W/m² ÷ (1,163 × Spreizung), dieselbe Formel wie im Modul Leistung & Volumenstrom (zwei Quellen, dort geprüft).',
      'Nicht enthalten: Heizleistung je Verlegeabstand und Vorlauftemperatur (DIN EN 1264), Druckverlust, höchste Heizkreislänge je Rohr. Die Angaben dazu hängen vom Hersteller ab (eine Beispielquelle nennt 100 bis 120 m für 16×2).'
    ],
    stichworte: 'fußbodenheizung fbh rohrlänge verlegeabstand heizkreis fläche verteiler flächenheizung rohr meter volumenstrom',
    frage: 'Wie viel Rohr und wie viele Heizkreise brauche ich für meine Fußbodenheizung?',
    title: 'Fußbodenheizung',
    desc: 'Rohrlänge, Heizkreise und Volumenstrom',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h13a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h13"/></svg>',
    render
  });
})();
