// Modul: Flächen & Volumen. Reine Geometrie (Schulmathematik), keine Tabellen oder Normwerte.
// Startseite des Moduls: "Was willst du wissen?" mit großen Auswahlzeilen, danach nur die nötigen Felder.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar). Alle Längen in Metern, Flächen in m², Volumen in m³ ----
  const EIN = { mm: 0.001, cm: 0.01, m: 1 };
  const ok = (...v) => v.every(x => Number.isFinite(x) && x > 0);

  // Fläche. Formen: rechteck (a, b), kreis (d), dreieck (a = Grundseite, h = Höhe), trapez (a, c = parallele Seiten, h = Abstand)
  function flaeche({ form, a, b, c, h, d, abzug = 0 }) {
    let A;
    if (form === 'rechteck') { if (!ok(a, b)) return null; A = a * b; }
    else if (form === 'kreis') { if (!ok(d)) return null; A = Math.PI * d * d / 4; }
    else if (form === 'dreieck') { if (!ok(a, h)) return null; A = a * h / 2; }
    else if (form === 'trapez') { if (!ok(a, c, h)) return null; A = (a + c) / 2 * h; }
    else return null;
    if (!(abzug >= 0)) return null;
    return { brutto: A, abzug, netto: A - abzug };
  }

  // Volumen. Formen: quader (a, b, h), zylinder (d, h). Je cm Füllhöhe: Grundfläche in m² × 10 = Liter
  function volumen({ form, a, b, h, d }) {
    let grund;
    if (form === 'quader') { if (!ok(a, b, h)) return null; grund = a * b; }
    else if (form === 'zylinder') { if (!ok(d, h)) return null; grund = Math.PI * d * d / 4; }
    else return null;
    const m3 = grund * h;
    return { grund, m3, liter: m3 * 1000, literProCm: grund * 10 };
  }
  WK.calc.flaechen = { flaeche, volumen, EIN };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const FRAGEN = [
    { id: 'flaeche', frage: 'Wie groß ist meine Fläche?', stichwort: 'Fläche', klein: 'Rechteck, Kreis, Dreieck, Trapez, mit Abzug für Fenster und Türen',
      icon: SVG('<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 12h16M12 5v14"/>') },
    { id: 'volumen', frage: 'Wie viel Inhalt hat mein Behälter oder Raum?', stichwort: 'Volumen', klein: 'Quader und Zylinder in Liter und m³',
      icon: SVG('<path d="M5 8c0-2 3-3 7-3s7 1 7 3-3 3-7 3-7-1-7-3z"/><path d="M5 8v9c0 2 3 3 7 3s7-1 7-3V8"/>') }
  ];
  // Formen und ihre Felder: k = Schlüssel in der Rechnung, v = Beispielwert
  const FORMEN = {
    flaeche: { label: 'Welche Form hat die Fläche?', einheit: 'm', formen: [
      { value: 'rechteck', label: 'Rechteck (Länge × Breite)', felder: [{ k: 'a', label: 'Länge', v: '4' }, { k: 'b', label: 'Breite', v: '2,5' }] },
      { value: 'kreis', label: 'Kreis (Durchmesser)', felder: [{ k: 'd', label: 'Durchmesser', v: '1,2' }] },
      { value: 'dreieck', label: 'Dreieck (Grundseite × Höhe)', felder: [
        { k: 'a', label: 'Grundseite', v: '3' },
        { k: 'h', label: 'Höhe', v: '2', hint: 'Senkrecht von der Grundseite bis zur Spitze, nicht die schräge Seite' }] },
      { value: 'trapez', label: 'Trapez (zwei parallele Seiten)', felder: [
        { k: 'a', label: 'Obere Seite', v: '2' },
        { k: 'c', label: 'Untere Seite', v: '4' },
        { k: 'h', label: 'Höhe', v: '2,5', hint: 'Abstand der beiden parallelen Seiten, nicht die schräge Seite' }] }
    ] },
    volumen: { label: 'Welche Form hat der Körper?', einheit: 'cm', formen: [
      { value: 'quader', label: 'Quader (Länge × Breite × Höhe)', felder: [
        { k: 'a', label: 'Länge', v: '100' }, { k: 'b', label: 'Breite', v: '50' }, { k: 'h', label: 'Höhe', v: '40' }] },
      { value: 'zylinder', label: 'Zylinder (Behälter, Speicher, Rohr)', felder: [
        { k: 'd', label: 'Durchmesser', v: '60', hint: 'Für den Inhalt die Innenmaße nehmen' },
        { k: 'h', label: 'Höhe', v: '150', hint: 'Beim liegenden Zylinder die Länge' }] }
    ] }
  };

  function render() {
    const { h, ui, fmt } = WK;
    const S = {};   // Eingaben, bleiben beim Wechsel von Form und Einheit erhalten
    const root = h('div');
    // Anzeige: je kleiner der Wert, desto mehr Nachkommastellen
    const Z = n => fmt(n, n >= 100 ? 1 : n >= 1 ? 2 : n >= 0.01 ? 4 : 6);

    function zeigeMenu() {
      root.replaceChildren(
        h('p', { class: 'lead' }, 'Was willst du wissen?'),
        h('div', { class: 'wahl' }, FRAGEN.map(q => h('button', { type: 'button', onclick: () => zeigeFrage(q.id) },
          h('span', { class: 'ico', html: q.icon }),
          h('span', {}, h('span', { class: 'tag' }, q.stichwort), h('strong', {}, q.frage), h('small', {}, q.klein))))));
    }

    function zeigeFrage(id) {
      const q = FRAGEN.find(x => x.id === id);
      const cfg = FORMEN[id];
      const out = h('div');
      const box = h('div');
      const zurueck = h('button', { type: 'button', class: 'zurueck', onclick: zeigeMenu }, '‹ Andere Frage');
      const begriffe = WK.ui.begriffe('flaechen/' + id);
      const form = ui.select(cfg.label, cfg.formen.map(f => ({ value: f.value, label: f.label })), S[id + '.form'] || cfg.formen[0].value);
      const einheit = ui.select('Maße in', [
        { value: 'mm', label: 'Millimeter (mm)' }, { value: 'cm', label: 'Zentimeter (cm)' }, { value: 'm', label: 'Meter (m)' }
      ], S[id + '.u'] || cfg.einheit);
      let ins = {};
      const fehl = t => out.replaceChildren(ui.note(t, 'warn'));

      function baue() {
        const f = cfg.formen.find(x => x.value === form.get());
        const u = einheit.get();
        ins = {};
        const els = f.felder.map(fd => {
          const key = id + '.' + f.value + '.' + fd.k;
          const n = ui.num(fd.label, { unit: u, hint: fd.hint, value: S[key] ?? fd.v });
          n.input.addEventListener('input', () => { S[key] = n.input.value; update(); });
          ins[fd.k] = n;
          return n.el;
        });
        if (id === 'flaeche') {
          const n = ui.num('Abzug (Fenster, Türen, Aussparungen)', { unit: 'm²', value: S.abzug ?? '0', hint: 'Fläche in m², zum Beispiel 1,2 × 2,1 für eine Tür. Leer oder 0, wenn nichts abgezogen wird' });
          n.input.addEventListener('input', () => { S.abzug = n.input.value; update(); });
          ins.abzug = n;
          els.push(n.el);
        }
        box.replaceChildren(...els);
        update();
      }

      function update() {
        const f = form.get();
        const u = EIN[einheit.get()];
        const w = k => (ins[k] ? ins[k].get() * u : undefined);   // in Meter
        const m = k => fmt(w(k), 4);
        if (id === 'flaeche') {
          const leer = ins.abzug.input.value.trim() === '';
          const abzug = leer ? 0 : ins.abzug.get();
          if (!Number.isFinite(abzug) || abzug < 0) { fehl('Abzug als Zahl in m² eingeben, oder leer lassen.'); return; }
          const r = flaeche({ form: f, a: w('a'), b: w('b'), c: w('c'), h: w('h'), d: w('d'), abzug });
          if (!r) { fehl('Alle Maße eingeben. Sie müssen größer als 0 sein.'); return; }
          if (r.netto <= 0) { fehl('Der Abzug ist so groß wie die Fläche oder größer.'); return; }
          const calc = { rechteck: m('a') + ' × ' + m('b'), kreis: 'π × ' + m('d') + '² ÷ 4', dreieck: m('a') + ' × ' + m('h') + ' ÷ 2', trapez: '(' + m('a') + ' + ' + m('c') + ') ÷ 2 × ' + m('h') }[f];
          const rows = r.abzug > 0
            ? [{ k: 'Fläche nach Abzug', v: Z(r.netto) + ' m²', big: true }, { k: 'Gesamtfläche', v: Z(r.brutto) + ' m²' }, { k: 'Abzug', v: Z(r.abzug) + ' m²' }]
            : [{ k: 'Fläche', v: Z(r.brutto) + ' m²', big: true }];
          if (r.netto < 1) rows.push({ k: 'In Quadratzentimetern', v: fmt(r.netto * 10000, 1) + ' cm²' });
          out.replaceChildren(ui.result(rows), ui.note('Rechnung in Metern: ' + calc + ' = ' + Z(r.brutto) + ' m²' + (r.abzug > 0 ? ', abzüglich ' + Z(r.abzug) + ' m²' : '')));
        } else {
          const r = volumen({ form: f, a: w('a'), b: w('b'), h: w('h'), d: w('d') });
          if (!r) { fehl('Alle Maße eingeben. Sie müssen größer als 0 sein.'); return; }
          const calc = f === 'quader' ? m('a') + ' × ' + m('b') + ' × ' + m('h') : 'π × ' + m('d') + '² ÷ 4 × ' + m('h');
          out.replaceChildren(ui.result([
            { k: 'Inhalt', v: fmt(r.liter, r.liter >= 100 ? 1 : 2) + ' Liter', big: true },
            { k: 'In Kubikmetern', v: Z(r.m3) + ' m³' },
            { k: f === 'quader' ? 'Je cm Füllhöhe' : 'Je cm Füllhöhe (stehend)', v: fmt(r.literProCm, 2) + ' Liter' }
          ]), ui.note('Rechnung in Metern: ' + calc + ' = ' + Z(r.m3) + ' m³. 1 m³ sind 1000 Liter.'));
        }
      }

      form.select.addEventListener('change', () => { S[id + '.form'] = form.get(); baue(); });
      einheit.select.addEventListener('change', () => { S[id + '.u'] = einheit.get(); baue(); });
      root.replaceChildren(...[zurueck, h('h2', { class: 'frage' }, q.frage), begriffe, ui.panel(null, form.el, einheit.el, box), ui.panel('Ergebnis', out)].filter(Boolean));
      baue();
    }

    zeigeMenu();
    return root;
  }

  WK.register({
    id: 'flaechen',
    bereich: 'allgemein',
    hilfe: {
      wofuer: 'Flächen und Inhalte ausrechnen: Wandfläche mit Abzug für Fenster und Türen, Fläche von Kreis, Dreieck und Trapez, Inhalt von Behältern, Speichern und Räumen in Liter und Kubikmeter.',
      schritte: [
        'Oben tippst du auf die Frage, die du beantwortet haben willst.',
        'Wähle die Form und die Einheit, in der du gemessen hast (mm, cm oder m).',
        'Trage die Maße ein. Bei Wandflächen kannst du Fenster und Türen als Abzug in m² angeben.',
        'Das Ergebnis steht groß darunter, mit der Rechnung in einer Zeile.'
      ],
      beispiel: 'Wand 4 m × 2,5 m ergibt 10 m². Ein Zylinder mit 60 cm Durchmesser und 150 cm Höhe fasst etwa 424 Liter.',
      hinweis: 'Gerechnet wird nur die reine Form. Verschnitt, Dachneigung und Teilfüllungen von liegenden Behältern sind nicht enthalten.'
    },
    quelle: [
      'Reine Geometrie (Schulmathematik): Rechteck a · b, Kreis π · d² ÷ 4, Dreieck a · h ÷ 2, Trapez (a + c) ÷ 2 · h, Quader a · b · h, Zylinder π · d² ÷ 4 · h. 1 m³ = 1000 Liter. Jede Rechnung wird im Test über einen zweiten Weg geprüft (zum Beispiel Kreisfläche aus Umfang × Radius ÷ 2, Trapez als Rechteck plus zwei Dreiecke, Zylinder in cm³ gegen Liter).',
      'Nicht enthalten: Dachflächen mit Neigung, Verschnitt, Teilfüllung eines liegenden Zylinders, Kugel und Kegel.'
    ],
    stichworte: 'fläche flächen quadratmeter m2 m² volumen inhalt liter kubikmeter m3 m³ behälter speicher raum wand abzug fenster kreis trapez dreieck zylinder quader rauminhalt',
    title: 'Flächen & Volumen',
    desc: 'Fläche, Inhalt in Liter und m³',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 12h16M12 5v14"/></svg>',
    render
  });
})();
