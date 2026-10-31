// Modul: Strom und Leistung (kW ↔ Ampere) bei Wechselstrom und Drehstrom. Reine Rechnung, keine Tabellen.
// Startseite des Moduls: "Was willst du wissen?" mit großen Auswahlzeilen, danach nur die nötigen Felder.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Wechselstrom (1 Phase): P = U · I · cos φ        Drehstrom (3 Phasen): P = √3 · U · I · cos φ
  // U ist bei Drehstrom die Spannung zwischen zwei Außenleitern (400 V), I der Strom in jedem Außenleiter.
  const faktor = typ => (typ === 'dreh' ? Math.sqrt(3) : 1);
  const gueltig = (u, cos) => u > 0 && cos > 0 && cos <= 1;

  // Strom in A aus Wirkleistung in kW
  function strom({ kw, typ, u, cos }) {
    if (!(kw > 0) || !gueltig(u, cos)) return null;
    const a = kw * 1000 / (faktor(typ) * u * cos);
    return { a, kva: kw / cos };
  }
  // Wirkleistung in kW aus Strom in A
  function leistung({ a, typ, u, cos }) {
    if (!(a > 0) || !gueltig(u, cos)) return null;
    const kw = faktor(typ) * u * a * cos / 1000;
    return { kw, kva: kw / cos };
  }
  WK.calc.strom = { strom, leistung };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const FRAGEN = [
    { id: 'strom', frage: 'Wie viel Strom zieht mein Gerät?', klein: 'Aus der Leistung in kW, zum Beispiel Heizstab oder Durchlauferhitzer',
      icon: SVG('<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>') },
    { id: 'leistung', frage: 'Wie viel Leistung hat mein Gerät bei diesem Strom?', klein: 'Aus der Stromstärke in Ampere',
      icon: SVG('<path d="M4 19V9M10 19V5M16 19v-7M21 19H3"/>') }
  ];
  const NETZ = [
    { value: 'dreh', label: 'Drehstrom 400 V (3 Phasen)', u: '400' },
    { value: 'wechsel', label: 'Wechselstrom 230 V (1 Phase)', u: '230' }
  ];

  function render() {
    const { h, ui, fmt } = WK;
    const S = { netz: 'dreh', u: '400', cos: '1', kw: '21', a: '16' };
    const root = h('div');
    const feld = (label, key, o = {}) => {
      const f = ui.num(label, { value: S[key], ...o });
      return { f, bind: fn => f.input.addEventListener('input', () => { S[key] = f.input.value; fn(); }) };
    };

    function zeigeMenu() {
      root.replaceChildren(
        h('p', { class: 'lead' }, 'Was willst du wissen?'),
        h('div', { class: 'wahl' }, FRAGEN.map(q => h('button', { type: 'button', onclick: () => zeigeFrage(q.id) },
          h('span', { class: 'ico', html: q.icon }),
          h('span', {}, h('strong', {}, q.frage), h('small', {}, q.klein))))));
    }

    function zeigeFrage(id) {
      const q = FRAGEN.find(x => x.id === id);
      const out = h('div');
      const zurueck = h('button', { type: 'button', class: 'zurueck', onclick: zeigeMenu }, '‹ Andere Frage');
      const begriffe = WK.ui.begriffe('strom/' + id);

      const netz = ui.select('Welcher Anschluss?', NETZ.map(n => ({ value: n.value, label: n.label })), S.netz);
      const u = feld('Spannung', 'u', { unit: 'V', hint: 'Drehstrom meist 400 V, Steckdose 230 V' });
      const cos = feld('Leistungsfaktor cos φ', 'cos', { hint: 'Heizstab und Durchlauferhitzer: 1. Motoren und Pumpen: steht auf dem Typenschild' });
      const wert = id === 'strom'
        ? feld('Leistung des Geräts', 'kw', { unit: 'kW', hint: 'Steht auf dem Typenschild. Bei Motoren die aufgenommene Leistung nehmen.' })
        : feld('Stromstärke', 'a', { unit: 'A', hint: 'Gemessen oder vom Typenschild, je Außenleiter' });
      const felder = [netz.el, u.f.el, cos.f.el, wert.f.el];

      const update = () => {
        const typ = netz.get();
        const c = cos.f.get();
        const r = id === 'strom'
          ? strom({ kw: wert.f.get(), typ, u: u.f.get(), cos: c })
          : leistung({ a: wert.f.get(), typ, u: u.f.get(), cos: c });
        if (!r) { out.replaceChildren(ui.note('Alle Werte eingeben. Der Leistungsfaktor liegt zwischen 0 und 1.', 'warn')); return; }
        const dreh = typ === 'dreh';
        const rows = id === 'strom'
          ? [{ k: dreh ? 'Strom je Außenleiter' : 'Strom', v: fmt(r.a, 1) + ' A', big: true }]
          : [{ k: 'Leistung', v: fmt(r.kw, 2) + ' kW', big: true }];
        if (c < 1) rows.push({ k: 'Scheinleistung', v: fmt(r.kva, 2) + ' kVA' });
        const rechnung = id === 'strom'
          ? fmt(wert.f.get() * 1000, 0) + ' W ÷ (' + (dreh ? '√3 × ' : '') + fmt(u.f.get(), 0) + ' V' + (c < 1 ? ' × ' + fmt(c, 2) : '') + ') = ' + fmt(r.a, 2) + ' A'
          : (dreh ? '√3 × ' : '') + fmt(u.f.get(), 0) + ' V × ' + fmt(wert.f.get(), 1) + ' A' + (c < 1 ? ' × ' + fmt(c, 2) : '') + ' = ' + fmt(r.kw * 1000, 0) + ' W';
        out.replaceChildren(ui.result(rows), ui.note('Rechnung: ' + rechnung),
          ui.note('Welche Sicherung und welchen Kabelquerschnitt das Gerät braucht, legt die Elektrofachkraft fest. Das hängt von Verlegeart, Länge und Vorschriften ab.'));
      };
      netz.select.addEventListener('change', () => {
        S.netz = netz.get();
        const n = NETZ.find(x => x.value === S.netz);
        S.u = n.u; u.f.set(n.u);
        update();
      });
      u.bind(update); cos.bind(update); wert.bind(update);

      root.replaceChildren(...[zurueck, h('h2', { class: 'frage' }, q.frage), begriffe, ui.panel(null, ...felder), ui.panel('Ergebnis', out)].filter(Boolean));
      update();
    }

    zeigeMenu();
    return root;
  }

  WK.register({
    id: 'strom',
    bereich: 'allgemein',
    hilfe: {
      wofuer: 'Rechnet zwischen Leistung in kW und Strom in Ampere, bei Drehstrom (400 V) und Wechselstrom (230 V). Praktisch für Heizstab, Durchlauferhitzer, Pumpe oder Lüfter.',
      schritte: [
        'Oben tippst du auf die Frage, die du beantwortet haben willst.',
        'Wähle den Anschluss: Drehstrom 400 V oder Wechselstrom 230 V. Die Spannung füllt sich von selbst.',
        'Trag die Leistung (oder den Strom) ein. Den Leistungsfaktor lässt du bei 1, außer bei Motoren und Pumpen: Dort steht er auf dem Typenschild.',
        'Das Ergebnis steht groß darunter, mit der Rechnung in einer Zeile.'
      ],
      beispiel: 'Durchlauferhitzer 21 kW an 400 V Drehstrom: 30,3 A in jedem der drei Außenleiter. Ein Wasserkocher mit 2 kW an 230 V: 8,7 A.',
      hinweis: 'Sicherung und Kabelquerschnitt legt die Elektrofachkraft fest. Die App rechnet nur Leistung und Strom um.'
    },
    quelle: [
      'Formeln: Wechselstrom I = P ÷ (U · cos φ), Drehstrom I = P ÷ (√3 · U · cos φ). Drei Quellen stimmen überein: atek.de (15 kW, 400 V, cos φ 0,86 gleich 25,18 A), sanier.de (Wasserkocher 2000 W, 230 V gleich 8,7 A) und Omni Calculator (1492 W, 230 V, cos φ 0,85, Wirkungsgrad 95 % gleich 4,638 A im Drehstrom). Alle Beispiele sind im Test nachgerechnet.',
      'Ein Beispiel bei atek.de stimmt nicht mit der eigenen Formel überein (7,5 kW, 400 V, cos φ 0,85: Artikel 14 A, Formel 12,7 A). Die Formel ist maßgeblich, das Beispiel wurde nicht übernommen.',
      'Nicht enthalten: Sicherung, Kabelquerschnitt, Spannungsabfall, Anlaufstrom von Motoren und Wirkungsgrad. Bei Motoren und Pumpen steht auf dem Typenschild oft die abgegebene Leistung, die aufgenommene ist höher.'
    ],
    stichworte: 'strom ampere kw kilowatt watt drehstrom wechselstrom 400v 230v leistung heizstab durchlauferhitzer pumpe motor elektro cos phi sicherung anschlusswert stromstärke',
    title: 'Strom: kW ↔ Ampere',
    desc: 'Leistung und Stromstärke umrechnen',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L5 14h6l-1 7 8-11h-6z"/></svg>',
    render
  });
})();
