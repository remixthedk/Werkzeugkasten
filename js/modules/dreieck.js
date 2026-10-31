// Modul: Dreieck & Bogen. Reine Geometrie (Schulmathematik), keine Tabellen oder Normwerte.
// Startseite des Moduls: "Was willst du wissen?" mit großen Auswahlzeilen, danach nur die nötigen Felder.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar). Längen in beliebiger gleicher Einheit, Winkel in Grad ----
  const RAD = Math.PI / 180;
  const ok = (...v) => v.every(x => Number.isFinite(x) && x > 0);

  // Rechtwinkliges Dreieck mit Längsmaß a (waagerecht), Quermaß b (senkrecht), Schräge c und Winkel α (zwischen a und c).
  // modus nennt die beiden bekannten Werte x und y: ab, ac, bc (zwei Seiten) oder aw, bw, cw (Seite und Winkel α)
  function dreieck({ modus, x, y }) {
    if (!ok(x, y)) return null;
    let a, b, c, al;
    if (modus === 'ab') { a = x; b = y; c = Math.hypot(a, b); al = Math.atan2(b, a) / RAD; }
    else if (modus === 'ac') { if (y <= x) return null; a = x; c = y; b = Math.sqrt(c * c - a * a); al = Math.atan2(b, a) / RAD; }
    else if (modus === 'bc') { if (y <= x) return null; b = x; c = y; a = Math.sqrt(c * c - b * b); al = Math.atan2(b, a) / RAD; }
    else if (['aw', 'bw', 'cw'].includes(modus)) {
      if (y >= 90) return null;
      al = y;
      if (modus === 'aw') { a = x; b = a * Math.tan(al * RAD); c = a / Math.cos(al * RAD); }
      else if (modus === 'bw') { b = x; a = b / Math.tan(al * RAD); c = b / Math.sin(al * RAD); }
      else { c = x; a = c * Math.cos(al * RAD); b = c * Math.sin(al * RAD); }
    } else return null;
    return { a, b, c, alpha: al, beta: 90 - al };
  }

  // Bogen: Länge = Radius × Winkel × π ÷ 180 (Radius der Rohrmitte).
  // modus 'laenge': x = Radius, y = Winkel;  'radius': x = Bogenlänge, y = Winkel;  'winkel': x = Bogenlänge, y = Radius
  function bogen({ modus, x, y }) {
    if (!ok(x, y)) return null;
    let r, w, l;
    if (modus === 'laenge') { r = x; w = y; l = r * w * RAD; }
    else if (modus === 'radius') { l = x; w = y; r = l / (w * RAD); }
    else if (modus === 'winkel') { l = x; r = y; w = l / r / RAD; }
    else return null;
    if (w > 360) return null;
    return { laenge: l, radius: r, winkel: w };
  }

  // Kreis: Umfang = π × Durchmesser. modus 'd2u' (x = Durchmesser) oder 'u2d' (x = Umfang)
  function umfang({ modus, x }) {
    if (!ok(x)) return null;
    if (modus === 'd2u') return { d: x, u: Math.PI * x, r: x / 2 };
    if (modus === 'u2d') return { d: x / Math.PI, u: x, r: x / Math.PI / 2 };
    return null;
  }
  WK.calc.dreieck = { dreieck, bogen, umfang };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const FRAGEN = [
    { id: 'pytha', frage: 'Wie lang ist die dritte Seite meines Dreiecks?', stichwort: 'Dreieck, Winkel', klein: 'Aus zwei Angaben: Längsmaß, Quermaß, Schräge oder Winkel',
      icon: SVG('<path d="M4 19h16V6z"/><path d="M16 19v-3h4"/>') },
    { id: 'bogen', frage: 'Wie lang ist mein Rohrbogen?', stichwort: 'Bogenlänge', klein: 'Aus Radius und Winkel, auch zurück',
      icon: SVG('<path d="M5 19a14 14 0 0 1 14-14"/><path d="M5 19h6M19 5v6"/>') },
    { id: 'umfang', frage: 'Wie groß ist der Umfang meines Rohrs?', stichwort: 'Umfang, Durchmesser', klein: 'Durchmesser in Umfang und zurück, zum Beispiel mit dem Maßband',
      icon: SVG('<circle cx="12" cy="12" r="8"/><path d="M4 12h16"/>') }
  ];
  const SKIZZE = '<svg class="skizze" viewBox="0 0 340 130" role="img" aria-label="Rechtwinkliges Dreieck mit Längsmaß a, Quermaß b und Schräge c">' +
    '<path d="M30 105H250V25Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M236 105V91H250" fill="none" stroke="#f28c28" stroke-width="2"/>' +
    '<g fill="currentColor" font-size="13" font-family="system-ui,sans-serif">' +
    '<text x="105" y="124">a (Längsmaß)</text><text x="258" y="68">b (Quermaß)</text>' +
    '<text x="68" y="62">c (Schräge)</text><text x="62" y="100">α</text></g></svg>';
  const MODI = [
    { value: 'ab', label: 'Längsmaß a und Quermaß b', x: ['Längsmaß a', '400'], y: ['Quermaß b', '300'], gesucht: 'c' },
    { value: 'ac', label: 'Längsmaß a und Schräge c', x: ['Längsmaß a', '400'], y: ['Schräge c', '500'], gesucht: 'b', hint: 'Die Schräge ist immer die längste Seite' },
    { value: 'bc', label: 'Quermaß b und Schräge c', x: ['Quermaß b', '300'], y: ['Schräge c', '500'], gesucht: 'a', hint: 'Die Schräge ist immer die längste Seite' },
    { value: 'aw', label: 'Längsmaß a und Winkel α', x: ['Längsmaß a', '400'], y: ['Winkel α', '45'], gesucht: 'c', winkel: true },
    { value: 'bw', label: 'Quermaß b und Winkel α', x: ['Quermaß b', '300'], y: ['Winkel α', '30'], gesucht: 'c', winkel: true },
    { value: 'cw', label: 'Schräge c und Winkel α', x: ['Schräge c', '500'], y: ['Winkel α', '45'], gesucht: 'a', winkel: true }
  ];
  const BOGEN = [
    { value: 'laenge', label: 'Die Länge des Bogens', x: ['Radius', '300', 'Radius der Rohrmitte, nicht innen oder außen'], y: ['Winkel', '90'], ziel: 'Bogenlänge' },
    { value: 'radius', label: 'Den Radius des Bogens', x: ['Bogenlänge', '471', 'Gemessen an der Rohrmitte'], y: ['Winkel', '90'], ziel: 'Radius' },
    { value: 'winkel', label: 'Den Winkel des Bogens', x: ['Bogenlänge', '471', 'Gemessen an der Rohrmitte'], y: ['Radius', '300', 'Radius der Rohrmitte'], ziel: 'Winkel' }
  ];

  function render() {
    const { h, ui, fmt } = WK;
    const S = {};   // Eingaben, bleiben beim Wechsel von Auswahl und Einheit erhalten
    const root = h('div');

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
      const begriffe = WK.ui.begriffe('dreieck/' + id);
      const fehl = t => out.replaceChildren(ui.note(t, 'warn'));
      const einheit = ui.select('Maße in', [
        { value: 'mm', label: 'Millimeter (mm)' }, { value: 'cm', label: 'Zentimeter (cm)' }, { value: 'm', label: 'Meter (m)' }
      ], S.u || 'mm');
      const liste = id === 'pytha' ? MODI : id === 'bogen' ? BOGEN : null;
      const wahl = liste ? ui.select(id === 'pytha' ? 'Was kennst du?' : 'Was willst du wissen?', liste.map(m => ({ value: m.value, label: m.label })), S[id + '.modus'] || liste[0].value)
        : ui.select('Was kennst du?', [{ value: 'd2u', label: 'Den Durchmesser' }, { value: 'u2d', label: 'Den Umfang (zum Beispiel mit dem Maßband gemessen)' }], S[id + '.modus'] || 'd2u');
      let ins = [];
      const U = () => einheit.get();
      const L = n => fmt(n, n >= 100 ? 1 : 2);   // Längen
      const W = n => fmt(n, 2) + ' °';

      function baue() {
        const mo = wahl.get();
        const felder = id === 'umfang'
          ? [mo === 'd2u' ? ['Durchmesser', '28'] : ['Umfang', '88']]
          : (() => { const m = liste.find(x => x.value === mo); return [m.x, m.y]; })();
        const hints = id === 'umfang' ? [mo === 'd2u' ? 'Außendurchmesser des Rohrs' : 'Maßband eng um das Rohr gelegt, Außenumfang']
          : id === 'bogen' ? [liste.find(x => x.value === mo).x[2], mo === 'winkel' ? liste.find(x => x.value === mo).y[2] : undefined]
          : [undefined, liste.find(x => x.value === mo).hint];
        const m0 = liste && liste.find(x => x.value === mo);
        ins = felder.map((f, i) => {
          const istWinkel = (id === 'pytha' && m0.winkel && i === 1) || (id === 'bogen' && ((mo !== 'winkel' && i === 1)));
          const key = id + '.' + mo + '.' + i;
          const n = ui.num(f[0], { unit: istWinkel ? '°' : U(), hint: hints[i], value: S[key] ?? f[1] });
          n.input.addEventListener('input', () => { S[key] = n.input.value; update(); });
          return n;
        });
        box.replaceChildren(...ins.map(n => n.el));
        update();
      }

      function update() {
        const mo = wahl.get();
        const u = U();
        const [x, y] = [ins[0].get(), ins[1] ? ins[1].get() : undefined];
        if (id === 'pytha') {
          const m = MODI.find(k => k.value === mo);
          const r = dreieck({ modus: mo, x, y });
          if (!r) { fehl(m.winkel ? 'Seite größer als 0 und Winkel zwischen 0 und 90° eingeben.' : m.gesucht === 'c' ? 'Beide Maße eingeben, sie müssen größer als 0 sein.' : 'Beide Maße eingeben. Die Schräge muss länger sein als die andere Seite.'); return; }
          const namen = { a: 'Längsmaß a', b: 'Quermaß b', c: 'Schräge c' };
          const rest = ['a', 'b', 'c'].filter(k => k !== m.gesucht);
          out.replaceChildren(ui.result([
            { k: namen[m.gesucht], v: L(r[m.gesucht]) + ' ' + u, big: true },
            ...rest.map(k => ({ k: namen[k], v: L(r[k]) + ' ' + u })),
            { k: 'Winkel α (a zu c)', v: W(r.alpha) },
            { k: 'Winkel β (b zu c)', v: W(r.beta) }
          ]), ui.note('Gilt nur bei einem rechten Winkel (90°) zwischen Längsmaß und Quermaß. Satz des Pythagoras: a² + b² = c². Das ist die Länge von Mitte zu Mitte, für das Passstück noch die Z-Maße abziehen.'));
        } else if (id === 'bogen') {
          const m = BOGEN.find(k => k.value === mo);
          const r = bogen({ modus: mo, x, y });
          if (!r) { fehl(mo === 'winkel' ? 'Bogenlänge und Radius eingeben. Der Bogen darf nicht länger als ein Vollkreis sein.' : 'Beide Werte eingeben. Der Winkel muss zwischen 0 und 360° liegen.'); return; }
          const rows = { laenge: [{ k: 'Bogenlänge', v: L(r.laenge) + ' ' + u, big: true }, { k: 'Radius', v: L(r.radius) + ' ' + u }, { k: 'Winkel', v: W(r.winkel) }],
            radius: [{ k: 'Radius', v: L(r.radius) + ' ' + u, big: true }, { k: 'Bogenlänge', v: L(r.laenge) + ' ' + u }, { k: 'Winkel', v: W(r.winkel) }],
            winkel: [{ k: 'Winkel', v: W(r.winkel), big: true }, { k: 'Bogenlänge', v: L(r.laenge) + ' ' + u }, { k: 'Radius', v: L(r.radius) + ' ' + u }] }[mo];
          out.replaceChildren(ui.result(rows), ui.note('Bogenlänge = Radius × Winkel × π ÷ 180. Gerechnet an der Rohrmitte. Ein Viertelkreis (90°) ist rund das 1,57-fache des Radius lang.'));
        } else {
          const r = umfang({ modus: mo, x });
          if (!r) { fehl(mo === 'd2u' ? 'Durchmesser größer als 0 eingeben.' : 'Umfang größer als 0 eingeben.'); return; }
          out.replaceChildren(ui.result(mo === 'd2u'
            ? [{ k: 'Umfang', v: L(r.u) + ' ' + u, big: true }, { k: 'Durchmesser', v: L(r.d) + ' ' + u }, { k: 'Radius', v: L(r.r) + ' ' + u }]
            : [{ k: 'Durchmesser', v: fmt(r.d, 2) + ' ' + u, big: true }, { k: 'Umfang', v: L(r.u) + ' ' + u }, { k: 'Radius', v: fmt(r.r, 2) + ' ' + u }]),
          ui.note('Umfang = π × Durchmesser, mit π = 3,14159. Beim Maßband zählt der Außenumfang, die Wandstärke des Maßbands spielt keine Rolle.'));
        }
      }

      wahl.select.addEventListener('change', () => { S[id + '.modus'] = wahl.get(); baue(); });
      einheit.select.addEventListener('change', () => { S.u = einheit.get(); baue(); });
      root.replaceChildren(...[zurueck, h('h2', { class: 'frage' }, q.frage), begriffe,
        id === 'pytha' ? h('div', { html: SKIZZE }) : null,
        ui.panel(null, wahl.el, einheit.el, box), ui.panel('Ergebnis', out)].filter(Boolean));
      baue();
    }

    zeigeMenu();
    return root;
  }

  WK.register({
    id: 'dreieck',
    bereich: 'allgemein',
    hilfe: {
      wofuer: 'Rechnungen am rechtwinkligen Dreieck (Längsmaß, Quermaß, Schräge, Winkel), die Länge eines Rohrbogens aus Radius und Winkel und der Umfang eines Rohrs, zum Beispiel mit dem Maßband gemessen.',
      schritte: [
        'Oben tippst du auf die Frage, die du beantwortet haben willst.',
        'Wähle, was du kennst, und die Einheit, in der du gemessen hast.',
        'Trage die Werte ein. Beim Dreieck zeigt die Skizze, was Längsmaß, Quermaß, Schräge und Winkel α sind.',
        'Das Ergebnis steht groß darunter, die übrigen Werte stehen dabei.'
      ],
      beispiel: 'Längsmaß 400 mm und Quermaß 300 mm ergeben eine Schräge von 500 mm bei 36,87°. Ein Bogen mit Radius 300 mm und 90° ist 471 mm lang.',
      hinweis: 'Das Dreieck muss einen rechten Winkel haben. Beim Bogen zählt der Radius der Rohrmitte. Biegezugabe und Rückfederung sind nicht enthalten.'
    },
    quelle: [
      'Reine Geometrie (Schulmathematik): Pythagoras a² + b² = c², Winkel über Tangens, Sinus und Kosinus, Bogenlänge = Radius × Winkel × π ÷ 180, Umfang = π × Durchmesser. Jede Rechnung wird im Test über einen zweiten Weg geprüft (zum Beispiel Pythagoras gegen Sinus und Kosinus, Bogen als Anteil am Vollkreis 2 · π · r).',
      'Nicht enthalten: schiefwinklige Dreiecke, Biegezugabe und Rückfederung beim Biegen, Radien von Fittings und Bögen nach Herstellerangabe.'
    ],
    stichworte: 'dreieck pythagoras winkel schräge diagonale längsmaß quermaß bogen bogenlänge radius umfang durchmesser pi kreis rohrbogen sinus kosinus tangens maßband',
    title: 'Dreieck & Bogen',
    desc: 'Pythagoras, Winkel, Bogenlänge, Umfang',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16V6z"/><path d="M16 19v-3h4"/></svg>',
    render
  });
})();
