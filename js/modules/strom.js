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
  // Ohmsches Gesetz: U = R · I, dazu P = U · I. gesucht: 'u', 'i' oder 'r'; die beiden anderen Werte werden gegeben.
  function ohm({ gesucht, u, i, r }) {
    const ok = x => x > 0 && Number.isFinite(x);
    let U, I, Rw;
    if (gesucht === 'u') { if (!ok(i) || !ok(r)) return null; I = i; Rw = r; U = Rw * I; }
    else if (gesucht === 'i') { if (!ok(u) || !ok(r)) return null; U = u; Rw = r; I = U / Rw; }
    else if (gesucht === 'r') { if (!ok(u) || !ok(i)) return null; U = u; I = i; Rw = U / I; }
    else return null;
    return { u: U, i: I, r: Rw, p: U * I };
  }
  // Trafo oder Netzteil: P_ein = P_aus ÷ η, Strom = Leistung ÷ Spannung auf jeder Seite (Leistungsfaktor 1).
  // seite: 'aus' (Leistung gilt für den Ausgang, zum Beispiel Typenschild Netzteil) oder 'ein' (Leistung gilt für den Eingang).
  // eta: Wirkungsgrad als Zahl 0 bis 1, null = ohne Verluste.
  function trafo({ u1, u2, p, seite, eta }) {
    const e = eta == null ? 1 : eta;
    if (!(u1 > 0 && u2 > 0 && p > 0) || !(e > 0 && e <= 1) || (seite !== 'aus' && seite !== 'ein')) return null;
    const pAus = seite === 'aus' ? p : p * e;
    const pEin = seite === 'aus' ? p / e : p;
    return { pEin, pAus, verlust: pEin - pAus, iEin: pEin / u1, iAus: pAus / u2, uebersetzung: u1 / u2 };
  }
  WK.calc.strom = { strom, leistung, ohm, trafo };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const FRAGEN = [
    { id: 'strom', frage: 'Wie viel Strom zieht mein Gerät?', stichwort: 'kW → Ampere', klein: 'Aus der Leistung in kW, zum Beispiel Heizstab oder Durchlauferhitzer',
      icon: SVG('<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>') },
    { id: 'leistung', frage: 'Wie viel Leistung hat mein Gerät bei diesem Strom?', stichwort: 'Ampere → kW', klein: 'Aus der Stromstärke in Ampere',
      icon: SVG('<path d="M4 19V9M10 19V5M16 19v-7M21 19H3"/>') },
    { id: 'ohm', frage: 'Wie hängen Spannung, Strom und Widerstand zusammen?', stichwort: 'Ohm', klein: 'Ohmsches Gesetz: U = R · I, zum Beispiel Heizstab nachmessen',
      icon: SVG('<path d="M3 12h4l2-5 3 10 2-5h7"/>') },
    { id: 'trafo', frage: 'Wie viel Strom fließt vor und hinter meinem Trafo oder Netzteil?', stichwort: 'Trafo, Netzteil', klein: 'Zum Beispiel 230 V auf 12 V bei 70 W',
      icon: SVG('<circle cx="9" cy="12" r="4"/><circle cx="15" cy="12" r="4"/><path d="M2 12h3M19 12h3"/>') }
  ];
  const NETZ = [
    { value: 'dreh', label: 'Drehstrom 400 V (3 Phasen)', u: '400' },
    { value: 'wechsel', label: 'Wechselstrom 230 V (1 Phase)', u: '230' }
  ];

  function render() {
    const { h, ui, fmt } = WK;
    const S = { netz: 'dreh', u: '400', cos: '1', kw: '21', a: '16', ohm: { gesucht: 'i', u: '230', i: '8,7', r: '26,5' }, trafo: { u1: '230', u2: '12', p: '70', eta: '', seite: 'aus' } };
    const root = h('div');
    const feld = (label, key, o = {}, store = S) => {
      const f = ui.num(label, { value: store[key], ...o });
      return { f, bind: fn => f.input.addEventListener('input', () => { store[key] = f.input.value; fn(); }) };
    };

    function zeigeMenu() {
      root.replaceChildren(
        h('p', { class: 'lead' }, 'Was willst du wissen?'),
        h('div', { class: 'wahl' }, FRAGEN.map(q => h('button', { type: 'button', onclick: () => zeigeFrage(q.id) },
          h('span', { class: 'ico', html: q.icon }),
          h('span', {}, q.stichwort ? h('span', { class: 'tag' }, q.stichwort) : null, h('strong', {}, q.frage), h('small', {}, q.klein))))));
    }

    function zeigeOhm(q) {
      const out = h('div');
      const zurueck = h('button', { type: 'button', class: 'zurueck', onclick: zeigeMenu }, '‹ Andere Frage');
      const begriffe = WK.ui.begriffe('strom/ohm');
      const O = S.ohm;
      const gesucht = ui.select('Was suchst du?', [
        { value: 'i', label: 'Den Strom (in Ampere)' },
        { value: 'u', label: 'Die Spannung (in Volt)' },
        { value: 'r', label: 'Den Widerstand (in Ohm)' }
      ], O.gesucht);
      const fu = feld('Spannung', 'u', { unit: 'V', hint: 'Zum Beispiel 230 V an der Steckdose' }, O);
      const fi = feld('Stromstärke', 'i', { unit: 'A', hint: 'Gemessen oder vom Typenschild' }, O);
      const fr = feld('Widerstand', 'r', { unit: 'Ω', hint: 'Mit dem Messgerät bei ausgeschaltetem Gerät gemessen' }, O);
      const update = () => {
        const g = gesucht.get();
        fu.f.el.hidden = g === 'u'; fi.f.el.hidden = g === 'i'; fr.f.el.hidden = g === 'r';
        const r = ohm({ gesucht: g, u: fu.f.get(), i: fi.f.get(), r: fr.f.get() });
        if (!r) { out.replaceChildren(ui.note('Die beiden anderen Werte eingeben, jeweils größer als 0.', 'warn')); return; }
        const rows = g === 'u' ? [{ k: 'Spannung', v: fmt(r.u, 1) + ' V', big: true }]
          : g === 'i' ? [{ k: 'Stromstärke', v: fmt(r.i, 2) + ' A', big: true }]
          : [{ k: 'Widerstand', v: fmt(r.r, 2) + ' Ω', big: true }];
        rows.push({ k: 'Leistung dabei', v: fmt(r.p, 0) + ' W (' + fmt(r.p / 1000, 2) + ' kW)' });
        const rechnung = g === 'u' ? fmt(r.r, 2) + ' Ω × ' + fmt(r.i, 2) + ' A = ' + fmt(r.u, 1) + ' V'
          : g === 'i' ? fmt(r.u, 1) + ' V ÷ ' + fmt(r.r, 2) + ' Ω = ' + fmt(r.i, 2) + ' A'
          : fmt(r.u, 1) + ' V ÷ ' + fmt(r.i, 2) + ' A = ' + fmt(r.r, 2) + ' Ω';
        out.replaceChildren(ui.result(rows), ui.note('Rechnung: ' + rechnung),
          ui.note('Das gilt für Heizwiderstände wie Heizstab oder Durchlauferhitzer, bei Drehstrom je Strang. Bei Motoren und Pumpen reicht es nicht, dort kommt der Leistungsfaktor dazu (Frage oben).'));
      };
      gesucht.select.addEventListener('change', () => { O.gesucht = gesucht.get(); update(); });
      fu.bind(update); fi.bind(update); fr.bind(update);
      root.replaceChildren(zurueck, h('h2', { class: 'frage' }, q.frage), begriffe, ui.panel(null, gesucht.el, fu.f.el, fi.f.el, fr.f.el), ui.panel('Ergebnis', out));
      update();
    }

    function zeigeTrafo(q) {
      const out = h('div');
      const zurueck = h('button', { type: 'button', class: 'zurueck', onclick: zeigeMenu }, '‹ Andere Frage');
      const begriffe = WK.ui.begriffe('strom/trafo');
      const T = S.trafo;
      const f1 = feld('Spannung am Eingang', 'u1', { unit: 'V', hint: 'Netzseite, an der Steckdose 230 V' }, T);
      const f2 = feld('Spannung am Ausgang', 'u2', { unit: 'V', hint: 'Steht auf dem Trafo oder Netzteil' }, T);
      const seite = ui.select('Die Leistung gilt für', [
        { value: 'aus', label: 'den Ausgang (Typenschild Netzteil)' },
        { value: 'ein', label: 'den Eingang (aufgenommene Leistung)' }
      ], T.seite);
      const fp = feld('Leistung', 'p', { unit: 'W', hint: 'Zum Beispiel 70 W' }, T);
      const fe = feld('Wirkungsgrad (nur wenn bekannt)', 'eta', { unit: '%', hint: 'Leer lassen: Die App rechnet ohne Verluste. Steht manchmal im Datenblatt.' }, T);
      const update = () => {
        const roh = fe.f.input.value.trim();
        const eta = roh === '' ? null : fe.f.get() / 100;
        if (eta != null && !(eta > 0 && eta <= 1)) { out.replaceChildren(ui.note('Wirkungsgrad zwischen 1 und 100 % eingeben, oder das Feld leer lassen.', 'warn')); return; }
        const u1 = f1.f.get(), u2 = f2.f.get(), p = fp.f.get();
        const r = trafo({ u1, u2, p, seite: seite.get(), eta });
        if (!r) { out.replaceChildren(ui.note('Beide Spannungen und die Leistung eingeben, jeweils größer als 0.', 'warn')); return; }
        const rows = [
          { k: 'Strom am Eingang (' + fmt(u1, 0) + ' V)', v: fmt(r.iEin, 2) + ' A', big: true },
          { k: 'Strom am Ausgang (' + fmt(u2, 0) + ' V)', v: fmt(r.iAus, 2) + ' A', big: true },
          { k: 'Leistung am Eingang', v: fmt(r.pEin, 1) + ' W' },
          { k: 'Leistung am Ausgang', v: fmt(r.pAus, 1) + ' W' }
        ];
        if (r.verlust > 0.0001) rows.push({ k: 'Verlust (Wärme)', v: fmt(r.verlust, 1) + ' W' });
        rows.push({ k: 'Spannung Eingang ÷ Ausgang', v: fmt(r.uebersetzung, 1) + ' : 1' });
        out.replaceChildren(ui.result(rows),
          ui.note('Rechnung: ' + fmt(r.pEin, 1) + ' W ÷ ' + fmt(u1, 0) + ' V = ' + fmt(r.iEin, 2) + ' A am Eingang, ' + fmt(r.pAus, 1) + ' W ÷ ' + fmt(u2, 0) + ' V = ' + fmt(r.iAus, 2) + ' A am Ausgang.'),
          ui.note('Der Trafo ändert die Spannung, nicht die Leistung. Auf der Seite mit der kleinen Spannung fließt der große Strom: Leitung und Absicherung dort darauf auslegen. Das legt die Elektrofachkraft fest.'));
      };
      seite.select.addEventListener('change', () => { T.seite = seite.get(); update(); });
      f1.bind(update); f2.bind(update); fp.bind(update); fe.bind(update);
      root.replaceChildren(zurueck, h('h2', { class: 'frage' }, q.frage), begriffe, ui.panel(null, f1.f.el, f2.f.el, seite.el, fp.f.el, fe.f.el), ui.panel('Ergebnis', out));
      update();
    }

    function zeigeFrage(id) {
      const q = FRAGEN.find(x => x.id === id);
      if (id === 'ohm') { zeigeOhm(q); return; }
      if (id === 'trafo') { zeigeTrafo(q); return; }
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
      wofuer: 'Rechnet zwischen Leistung in kW und Strom in Ampere, bei Drehstrom (400 V) und Wechselstrom (230 V). Dazu das Ohmsche Gesetz (Spannung, Strom, Widerstand) und der Strom vor und hinter einem Trafo oder Netzteil. Praktisch für Heizstab, Durchlauferhitzer, Pumpe oder Lüfter.',
      schritte: [
        'Oben tippst du auf die Frage, die du beantwortet haben willst.',
        'Wähle den Anschluss: Drehstrom 400 V oder Wechselstrom 230 V. Die Spannung füllt sich von selbst.',
        'Trag die Leistung (oder den Strom) ein. Den Leistungsfaktor lässt du bei 1, außer bei Motoren und Pumpen: Dort steht er auf dem Typenschild.',
        'Das Ergebnis steht groß darunter, mit der Rechnung in einer Zeile.'
      ],
      beispiel: 'Durchlauferhitzer 21 kW an 400 V Drehstrom: 30,3 A in jedem der drei Außenleiter. Ein Wasserkocher mit 2 kW an 230 V: 8,7 A. Ohm: Heizstab mit 26,5 Ω an 230 V zieht 8,7 A. Netzteil 230 V auf 12 V mit 70 W: 0,30 A am Eingang, 5,83 A am Ausgang.',
      hinweis: 'Sicherung und Kabelquerschnitt legt die Elektrofachkraft fest. Die App rechnet nur Leistung und Strom um.'
    },
    quelle: [
      'Formeln: Wechselstrom I = P ÷ (U · cos φ), Drehstrom I = P ÷ (√3 · U · cos φ). Drei Quellen stimmen überein: atek.de (15 kW, 400 V, cos φ 0,86 gleich 25,18 A), sanier.de (Wasserkocher 2000 W, 230 V gleich 8,7 A) und Omni Calculator (1492 W, 230 V, cos φ 0,85, Wirkungsgrad 95 % gleich 4,638 A im Drehstrom). Alle Beispiele sind im Test nachgerechnet.',
      'Ein Beispiel bei atek.de stimmt nicht mit der eigenen Formel überein (7,5 kW, 400 V, cos φ 0,85: Artikel 14 A, Formel 12,7 A). Die Formel ist maßgeblich, das Beispiel wurde nicht übernommen.',
      'Ohmsches Gesetz: U = R · I, I = U ÷ R, R = U ÷ I, Leistung P = U · I = I² · R = U² ÷ R (engineeringtoolbox.com, Rechenbeispiel 12 V an 18 Ω gleich 0,67 A und 8 W). Zweite Quelle redcrab-software.com (230 V, 4,5 A gleich 51,1 Ω). Zweiter Rechenweg im Test: Leistung aus U²/R, I²R und U·I stimmen überein, und 2 kW an 230 V gleich 26,45 Ω und 8,7 A wie bei sanier.de.',
      'Trafo: Leistung am Eingang = Leistung am Ausgang bei verlustfreiem Trafo, U₁ · I₁ = U₂ · I₂ (studyflix.de, lernhelfer.de). Wirkungsgrad η = P Ausgang ÷ P Eingang, also P Eingang = P Ausgang ÷ η (studyflix.de). Zweiter Rechenweg im Test: Strom über das Spannungsverhältnis, I₂ = I₁ · U₁ ÷ U₂ bei η = 1. Einen Standardwert für den Wirkungsgrad gibt die App nicht vor, er wird selbst eingetragen.',
      'Nicht enthalten: Sicherung, Kabelquerschnitt, Spannungsabfall, Anlaufstrom von Motoren, Scheinleistung (VA) bei Trafos und ein Vorgabewert für den Wirkungsgrad. Bei Motoren und Pumpen steht auf dem Typenschild oft die abgegebene Leistung, die aufgenommene ist höher.'
    ],
    stichworte: 'trafo transformator netzteil 12v 24v wirkungsgrad ohm widerstand volt spannung ohmsches gesetz strom ampere kw kilowatt watt drehstrom wechselstrom 400v 230v leistung heizstab durchlauferhitzer pumpe motor elektro cos phi sicherung anschlusswert stromstärke',
    title: 'Strom: kW ↔ Ampere',
    desc: 'Leistung und Strom, Ohmsches Gesetz, Trafo und Netzteil',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L5 14h6l-1 7 8-11h-6z"/></svg>',
    render
  });
})();
