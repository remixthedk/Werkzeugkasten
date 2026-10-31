// Modul: Warmwasser (Sanitär). Mischwasser, Durchlauferhitzer, Zirkulations-Check.
// Startseite des Moduls: "Was willst du wissen?" mit großen Auswahlzeilen, danach nur die nötigen Felder.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Wasser: 1 Liter = 1 kg, c = 1,163 Wh/(kg·K) (gleicher Wert wie in "Wärme & Wasser")
  const C = 1.163;
  const fin = (...v) => v.every(Number.isFinite);
  const pos = (...v) => v.every(x => Number.isFinite(x) && x > 0);

  // Mischen: Warmwasser (Menge vw, Temperatur tw) und Kaltwasser (vk, tk) -> Mischtemperatur
  function mischen({ vw, tw, vk, tk }) {
    if (!pos(vw, vk) || !fin(tw, tk) || tw <= tk) return null;
    return { t: (vw * tw + vk * tk) / (vw + vk), v: vw + vk };
  }
  // Wie viel Warmwasser und Kaltwasser ergeben vGes Liter bei tZiel? (tk < tZiel <= tw)
  function warmanteil({ vGes, tZiel, tw, tk }) {
    if (!pos(vGes) || !fin(tZiel, tw, tk) || !(tk < tZiel && tZiel <= tw) || tw <= tk) return null;
    const vw = vGes * (tZiel - tk) / (tw - tk);
    return { vw, vk: vGes - vw, anteil: vw / vGes };
  }
  // Wie viel Mischwasser von tZiel gibt ein Speicher mit v Litern bei tw, wenn Kaltwasser tk zugemischt wird?
  function speicher({ v, tw, tk, tZiel }) {
    if (!pos(v) || !fin(tw, tk, tZiel) || !(tk < tZiel && tZiel <= tw)) return null;
    const vMisch = v * (tw - tk) / (tZiel - tk);
    return { vMisch, vKalt: vMisch - v };
  }
  // Durchlauferhitzer. kW = aufgenommene Leistung am Gerät, eta = Wirkungsgrad (0 bis 1), lmin = Liter je Minute
  // modus 'lmin': aus kW, tk, tz die Liter je Minute;  'kw': aus lmin, tk, tz die Leistung;  'tz': aus kW, lmin, tk die Auslauftemperatur
  function durchlauf({ modus, kW, lmin, tk, tz, eta = 1 }) {
    if (!fin(tk) || !(eta > 0 && eta <= 1)) return null;
    if (modus === 'lmin') {
      if (!pos(kW) || !fin(tz) || tz <= tk) return null;
      lmin = kW * eta * 1000 / (C * (tz - tk)) / 60;
    } else if (modus === 'kw') {
      if (!pos(lmin) || !fin(tz) || tz <= tk) return null;
      kW = lmin * 60 * C * (tz - tk) / 1000 / eta;
    } else if (modus === 'tz') {
      if (!pos(kW, lmin)) return null;
      tz = tk + kW * eta * 1000 / (C * lmin * 60);
    } else return null;
    return { kW, lmin, tk, tz, dT: tz - tk };
  }
  // Zirkulation nach DVGW W 551: Speicher mindestens 60 °C, Auskühlung (Austritt minus Rücklauf) höchstens 5 K
  const SPEICHER_MIN = 60, KUEHL_MAX = 5;
  function zirkulation({ tSpeicher, tRuecklauf }) {
    if (!fin(tSpeicher, tRuecklauf) || tRuecklauf > tSpeicher) return null;
    const auskuehlung = tSpeicher - tRuecklauf;
    const speicherOk = tSpeicher >= SPEICHER_MIN, auskuehlungOk = auskuehlung <= KUEHL_MAX;
    return { auskuehlung, speicherOk, auskuehlungOk, ok: speicherOk && auskuehlungOk };
  }
  WK.calc.warmwasser = { C, mischen, warmanteil, speicher, durchlauf, zirkulation, SPEICHER_MIN, KUEHL_MAX };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const TROPFEN = '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>';
  const FRAGEN = [
    { id: 'misch', frage: 'Welche Temperatur hat mein Wasser, wenn ich warm und kalt mische?', stichwort: 'Mischtemperatur', klein: 'Zum Beispiel Badewasser aus Warm- und Kaltwasser',
      icon: SVG(TROPFEN + '<path d="M9.5 14.5h5"/>') },
    { id: 'warm', frage: 'Wie viel Warmwasser brauche ich für eine bestimmte Temperatur?', stichwort: 'Warm- und Kaltwasser', klein: 'Zum Beispiel 150 Liter Badewasser mit 38 °C',
      icon: SVG(TROPFEN + '<path d="M12 11v6M9 14h6"/>') },
    { id: 'speicher', frage: 'Wie viele Liter Mischwasser gibt mein Warmwasserspeicher?', stichwort: 'Speicher, Duschwasser', klein: 'Zum Beispiel 300 Liter bei 60 °C, genutzt mit 40 °C',
      icon: SVG('<rect x="6" y="3" width="12" height="18" rx="3"/><path d="M6 9h12"/>') },
    { id: 'durchlauf', frage: 'Wie viel Warmwasser schafft mein Durchlauferhitzer?', stichwort: 'Durchlauferhitzer', klein: 'Liter pro Minute, Leistung oder Auslauftemperatur',
      icon: SVG('<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>') },
    { id: 'zirk', frage: 'Ist meine Zirkulation warm genug?', stichwort: 'Zirkulation, W 551', klein: 'Speichertemperatur und Auskühlung prüfen',
      icon: SVG('<path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 4v4h-4"/>') }
  ];
  const MODI = [
    { value: 'lmin', label: 'Wie viel Wasser pro Minute (Liter)' },
    { value: 'kw', label: 'Welche Leistung ich brauche (kW)' },
    { value: 'tz', label: 'Welche Auslauftemperatur ich erreiche' }
  ];

  function render() {
    const { h, ui, fmt } = WK;
    const S = { vw: '100', tw: '60', vk: '60', tk: '10', vGes: '150', tZiel: '38', tw2: '60', tk2: '10', v: '300', tw3: '60', tk3: '10', tz3: '40',
      kW: '21', lmin: '10', tk4: '10', tz4: '38', eta: '100', ts: '60', tr: '57', modus: 'lmin' };
    const root = h('div');
    const T = n => fmt(n, 1) + ' °C';
    const Lt = n => fmt(n, n >= 100 ? 0 : 1) + ' Liter';

    function zeigeMenu() {
      root.replaceChildren(
        h('p', { class: 'lead' }, 'Was willst du wissen?'),
        h('div', { class: 'wahl' }, FRAGEN.map(q => h('button', { type: 'button', onclick: () => zeigeFrage(q.id) },
          h('span', { class: 'ico', html: q.icon }),
          h('span', {}, h('span', { class: 'tag' }, q.stichwort), h('strong', {}, q.frage), h('small', {}, q.klein))))));
    }

    function zeigeFrage(id) {
      const q = FRAGEN.find(x => x.id === id);
      const out = h('div');
      const box = h('div');
      const zurueck = h('button', { type: 'button', class: 'zurueck', onclick: zeigeMenu }, '‹ Andere Frage');
      const begriffe = WK.ui.begriffe('warmwasser/' + id);
      const fehl = t => out.replaceChildren(ui.note(t, 'warn'));
      let ins = {};
      let modus = null;
      const feld = (label, key, unit, hint) => {
        const n = ui.num(label, { unit, hint, value: S[key] });
        n.input.addEventListener('input', () => { S[key] = n.input.value; update(); });
        return n;
      };
      // Felder je Frage: [Schlüssel in S, Beschriftung, Einheit, Hinweis]; der Name in ins ist der Rechenname
      const FELDER = {
        misch: () => [['vw', 'Warmwasser: Menge', 'l'], ['tw', 'Warmwasser: Temperatur', '°C'], ['vk', 'Kaltwasser: Menge', 'l'], ['tk', 'Kaltwasser: Temperatur', '°C']],
        warm: () => [['vGes', 'Gewünschte Gesamtmenge', 'l', 'Zum Beispiel eine Badewanne'], ['tZiel', 'Gewünschte Temperatur', '°C'], ['tw2', 'Warmwasser: Temperatur', '°C', 'Zum Beispiel am Speicher'], ['tk2', 'Kaltwasser: Temperatur', '°C']],
        speicher: () => [['v', 'Speicherinhalt', 'l'], ['tw3', 'Speichertemperatur', '°C'], ['tk3', 'Kaltwasser: Temperatur', '°C'], ['tz3', 'Gewünschte Temperatur an der Zapfstelle', '°C', 'Zum Beispiel 40 °C zum Duschen']],
        durchlauf: m => [
          ...(m === 'lmin' ? [['kW', 'Leistung des Geräts', 'kW', 'Steht auf dem Typenschild']] : m === 'kw' ? [['lmin', 'Wassermenge', 'l/min']] : [['kW', 'Leistung des Geräts', 'kW', 'Steht auf dem Typenschild'], ['lmin', 'Wassermenge', 'l/min']]),
          ['tk4', 'Kaltwasser: Temperatur', '°C'],
          ...(m === 'tz' ? [] : [['tz4', 'Gewünschte Auslauftemperatur', '°C', 'Zum Beispiel 38 °C zum Duschen']]),
          ['eta', 'Wirkungsgrad', '%', 'Elektrogeräte 100 %, bei Gasgeräten steht der Wert im Datenblatt']],
        zirk: () => [['ts', 'Speicher: Temperatur am Austritt', '°C', 'Am Warmwasserabgang des Speichers gemessen'], ['tr', 'Zirkulation: Temperatur am Rücklauf', '°C', 'Am Rücklaufrohr kurz vor dem Speicher gemessen']]
      };
      const NAME = { vw: 'vw', tw: 'tw', vk: 'vk', tk: 'tk', vGes: 'vGes', tZiel: 'tZiel', tw2: 'tw', tk2: 'tk', v: 'v', tw3: 'tw', tk3: 'tk', tz3: 'tZiel', kW: 'kW', lmin: 'lmin', tk4: 'tk', tz4: 'tz', eta: 'eta', ts: 'tSpeicher', tr: 'tRuecklauf' };
      const auswahl = id === 'durchlauf' ? ui.select('Was suchst du?', MODI, S.modus) : null;

      function baue() {
        modus = auswahl ? auswahl.get() : null;
        ins = {};
        const els = FELDER[id](modus).map(([key, label, unit, hint]) => { const n = feld(label, key, unit, hint); ins[NAME[key]] = n; return n.el; });
        box.replaceChildren(...els);
        update();
      }
      const w = k => (ins[k] ? ins[k].get() : undefined);

      function update() {
        if (id === 'misch') {
          const r = mischen({ vw: w('vw'), tw: w('tw'), vk: w('vk'), tk: w('tk') });
          if (!r) { fehl('Alle Werte eingeben. Die Mengen müssen größer als 0 sein, das warme Wasser muss wärmer sein als das kalte.'); return; }
          out.replaceChildren(ui.result([{ k: 'Mischtemperatur', v: T(r.t), big: true }, { k: 'Gesamtmenge', v: Lt(r.v) }]),
            ui.note('Rechnung: (' + fmt(w('vw'), 2) + ' × ' + fmt(w('tw'), 1) + ' + ' + fmt(w('vk'), 2) + ' × ' + fmt(w('tk'), 1) + ') ÷ ' + fmt(r.v, 2) + ' = ' + T(r.t) + '. Dichteunterschiede zwischen warmem und kaltem Wasser (bis etwa 2 %) sind nicht berücksichtigt.'));
        } else if (id === 'warm') {
          const r = warmanteil({ vGes: w('vGes'), tZiel: w('tZiel'), tw: w('tw'), tk: w('tk') });
          if (!r) { fehl('Alle Werte eingeben. Die gewünschte Temperatur muss über dem Kaltwasser und darf nicht über dem Warmwasser liegen.'); return; }
          out.replaceChildren(ui.result([{ k: 'Warmwasser', v: Lt(r.vw), big: true }, { k: 'Kaltwasser', v: Lt(r.vk) }, { k: 'Anteil Warmwasser', v: fmt(r.anteil * 100, 0) + ' %' }]),
            ui.note('Rechnung: Warmwasser = Gesamtmenge × (gewünscht − kalt) ÷ (warm − kalt) = ' + fmt(w('vGes'), 2) + ' × ' + fmt(w('tZiel') - w('tk'), 1) + ' ÷ ' + fmt(w('tw') - w('tk'), 1) + ' = ' + Lt(r.vw) + '.'));
        } else if (id === 'speicher') {
          const r = speicher({ v: w('v'), tw: w('tw'), tk: w('tk'), tZiel: w('tZiel') });
          if (!r) { fehl('Alle Werte eingeben. Die gewünschte Temperatur muss über dem Kaltwasser und darf nicht über der Speichertemperatur liegen.'); return; }
          out.replaceChildren(ui.result([{ k: 'Mischwasser aus dem Speicher', v: Lt(r.vMisch), big: true }, { k: 'Davon Kaltwasser, das du zumischst', v: Lt(r.vKalt) }]),
            ui.note('Das ist der Idealfall: Der ganze Speicher wird genutzt. In der Praxis kommt weniger heraus, weil sich das nachströmende Kaltwasser im Speicher beimischt und der Speicher auskühlt.'));
        } else if (id === 'durchlauf') {
          const r = durchlauf({ modus, kW: w('kW'), lmin: w('lmin'), tk: w('tk'), tz: w('tz'), eta: w('eta') / 100 });
          if (!r) { fehl(modus === 'tz' ? 'Leistung, Wassermenge und Kaltwasser-Temperatur eingeben. Wirkungsgrad zwischen 0 und 100 %.' : 'Alle Werte eingeben. Die Auslauftemperatur muss über dem Kaltwasser liegen, der Wirkungsgrad zwischen 0 und 100 %.'); return; }
          const rows = { lmin: [{ k: 'Wassermenge', v: fmt(r.lmin, 1) + ' l/min', big: true }, { k: 'Leistung', v: fmt(r.kW, 1) + ' kW' }, { k: 'Temperaturanhebung', v: fmt(r.dT, 1) + ' K' }],
            kw: [{ k: 'Nötige Leistung', v: fmt(r.kW, 1) + ' kW', big: true }, { k: 'Wassermenge', v: fmt(r.lmin, 1) + ' l/min' }, { k: 'Temperaturanhebung', v: fmt(r.dT, 1) + ' K' }],
            tz: [{ k: 'Auslauftemperatur', v: T(r.tz), big: true }, { k: 'Temperaturanhebung', v: fmt(r.dT, 1) + ' K' }, { k: 'Wassermenge', v: fmt(r.lmin, 1) + ' l/min' }] }[modus];
          out.replaceChildren(ui.result(rows),
            ui.note('Rechnung: Leistung × Wirkungsgrad = Liter je Minute × 60 × 1,163 Wh/(kg·K) × Temperaturanhebung ÷ 1000. Ein Liter Wasser wiegt 1 kg.'));
        } else {
          const r = zirkulation({ tSpeicher: w('tSpeicher'), tRuecklauf: w('tRuecklauf') });
          if (!r) { fehl('Beide Temperaturen eingeben. Der Rücklauf kann nicht wärmer sein als der Speicher.'); return; }
          const jn = ok => ok ? '✓ erfüllt' : '✗ nicht erfüllt';
          out.replaceChildren(ui.result([
            { k: 'Ergebnis', v: r.ok ? 'In Ordnung' : 'Nicht in Ordnung', big: true },
            { k: 'Auskühlung', v: fmt(r.auskuehlung, 1) + ' K' },
            { k: 'Speicher ab ' + SPEICHER_MIN + ' °C', v: jn(r.speicherOk) },
            { k: 'Auskühlung bis ' + KUEHL_MAX + ' K', v: jn(r.auskuehlungOk) }
          ]),
          ...(r.ok ? [] : [ui.note((r.speicherOk ? '' : 'Der Speicher ist kälter als ' + SPEICHER_MIN + ' °C. ') + (r.auskuehlungOk ? '' : 'Das Zirkulationswasser kühlt um mehr als ' + KUEHL_MAX + ' K ab: Pumpe, Volumenstrom, Dämmung und Abgleich der Zirkulationsstränge prüfen.'), 'warn')]),
          ui.note('Nach DVGW W 551 gelten 60 °C am Speicher und höchstens 5 K Auskühlung als Anforderung für Großanlagen (zum Beispiel Mehrfamilienhaus, Hotel). Ein- und Zweifamilienhäuser sind Kleinanlagen: Dort sind 60 °C die Empfehlung aus Hygienegründen. Das ersetzt keine Untersuchung nach Trinkwasserverordnung.'));
        }
      }

      if (auswahl) auswahl.select.addEventListener('change', () => { S.modus = auswahl.get(); baue(); });
      root.replaceChildren(...[zurueck, h('h2', { class: 'frage' }, q.frage), begriffe, ui.panel(null, ...(auswahl ? [auswahl.el] : []), box), ui.panel('Ergebnis', out)].filter(Boolean));
      baue();
    }

    zeigeMenu();
    return root;
  }

  WK.register({
    id: 'warmwasser',
    bereich: 'sanitaer',
    hilfe: {
      wofuer: 'Rechnungen rund ums Warmwasser: Mischtemperatur und Mischmengen, wie viel Duschwasser ein Speicher liefert, was ein Durchlauferhitzer schafft und ob die Zirkulation nach DVGW W 551 warm genug ist.',
      schritte: [
        'Oben tippst du auf die Frage, die du beantwortet haben willst.',
        'Du siehst nur die Felder, die dafür nötig sind. Unter manchen Feldern steht, wo du den Wert findest.',
        'Das Ergebnis steht groß darunter, mit der Rechnung in einer Zeile.',
        'Mit "Andere Frage" kommst du zurück zur Auswahl.'
      ],
      beispiel: '100 Liter mit 60 °C und 60 Liter mit 10 °C ergeben rund 41,3 °C. Ein 21-kW-Durchlauferhitzer schafft bei 10 auf 38 °C etwa 10,7 Liter pro Minute.',
      hinweis: 'Die Werte sind Idealwerte ohne Wärmeverluste. Die Zirkulationsprüfung ersetzt keine Untersuchung auf Legionellen.'
    },
    quelle: [
      'Mischen: Richmannsche Mischungsregel T = (V₁ · T₁ + V₂ · T₂) ÷ (V₁ + V₂), Dichteunterschiede nicht berücksichtigt. Im Test über die Energiebilanz (Wärmeabgabe des warmen = Wärmeaufnahme des kalten Wassers) und als Rundlauf der drei Mischfragen gegengeprüft.',
      'Durchlauferhitzer: Leistung = Liter/min × 60 × 1,163 Wh/(kg·K) × Temperaturanhebung ÷ 1000. Die Rechnung ist dieselbe wie in "Wärme & Wasser" (6 kW bei 20 K = 258 l/h) und im Test dagegen sowie als Rundlauf geprüft.',
      'Zirkulation: DVGW-Arbeitsblatt W 551, Auskühlung im Zirkulationssystem höchstens 5 K, Warmwasser am Trinkwassererwärmer mindestens 60 °C (W 551 im Auszug und haustechnikdialog.de). Für Großanlagen eine Anforderung, für Kleinanlagen (Ein- und Zweifamilienhäuser) die Empfehlung. Das Mindestmaß am Rücklauf (55 °C) ergibt sich daraus und ist hier nicht eigens geprüft.',
      'Nicht enthalten: Warmwasserbedarf und Speichergröße (DIN 4708, kostenpflichtig), Legionellenuntersuchung nach Trinkwasserverordnung, Höchstgrenze für Kaltwasser (nicht belegt).'
    ],
    stichworte: 'warmwasser mischwasser mischen mischtemperatur duschen dusche badewanne wanne speicher durchlauferhitzer zirkulation zirkulationspumpe legionellen w551 w 551 auskühlung kaltwasser',
    title: 'Warmwasser',
    desc: 'Mischwasser, Durchlauferhitzer, Zirkulation',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5h5"/></svg>',
    render
  });
})();
