// Modul: Dreisatz & Prozent. Reine Rechenregeln (Schulmathematik), keine Tabellen oder Normwerte.
// Startseite des Moduls: "Was willst du wissen?" mit großen Auswahlzeilen, danach nur die nötigen Felder.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Dreisatz: a gehört zu b. Neue Menge c gehört zu x.
  // gerade (je mehr, desto mehr): x = b · c / a      umgekehrt (je mehr, desto weniger): x = a · b / c
  function dreisatz({ a, b, c, umgekehrt }) {
    if (![a, b, c].every(Number.isFinite)) return null;
    if (umgekehrt) return c > 0 && a > 0 ? { x: a * b / c } : null;
    return a > 0 ? { x: b * c / a } : null;
  }
  // Prozentwert: p % von G
  function prozentwert({ g, p }) {
    if (![g, p].every(Number.isFinite)) return null;
    return { w: g * p / 100 };
  }
  // Anteil: A sind wie viel % von B?   Veränderung: von A auf B sind wie viel % mehr (oder weniger)?
  function prozentsatz({ a, b, modus }) {
    if (![a, b].every(Number.isFinite)) return null;
    if (modus === 'aenderung') return a !== 0 ? { p: (b - a) / a * 100 } : null;
    return b !== 0 ? { p: a / b * 100 } : null;
  }
  // Preis mit Aufschlag (art 'auf') oder Rabatt (art 'ab')
  function aufschlag({ g, p, art }) {
    if (![g, p].every(Number.isFinite)) return null;
    const diff = g * p / 100;
    if (art === 'ab') return p <= 100 ? { ergebnis: g - diff, diff } : null;
    return { ergebnis: g + diff, diff };
  }
  // Mehrwertsteuer: art 'netto' (Betrag ist ohne MwSt) oder 'brutto' (Betrag ist mit MwSt)
  function mwst({ betrag, satz, art }) {
    if (![betrag, satz].every(Number.isFinite) || satz < 0) return null;
    const netto = art === 'brutto' ? betrag / (1 + satz / 100) : betrag;
    const brutto = art === 'brutto' ? betrag : betrag * (1 + satz / 100);
    return { netto, brutto, steuer: brutto - netto };
  }
  WK.calc.rechnen = { dreisatz, prozentwert, prozentsatz, aufschlag, mwst };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const FRAGEN = [
    { id: 'dreisatz', frage: 'Wie viel ist es bei einer anderen Menge?', stichwort: 'Dreisatz', klein: 'Dreisatz, zum Beispiel: 3 Stück kosten 12 €, was kosten 5?',
      icon: SVG('<path d="M4 7h6M4 12h6M4 17h6"/><path d="M14 7h6M14 12h6"/><path d="M17 15v4M15 17h4"/>') },
    { id: 'prozent', frage: 'Wie viel sind … Prozent von einem Wert?', stichwort: 'Prozent von', klein: 'Zum Beispiel 15 % von 250',
      icon: SVG('<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>') },
    { id: 'anteil', frage: 'Wie viel Prozent sind das?', stichwort: 'Prozentanteil', klein: 'Anteil oder Veränderung, zum Beispiel Aufschlag von EK auf VK',
      icon: SVG('<path d="M12 3v9h9"/><circle cx="12" cy="12" r="9"/>') },
    { id: 'aufschlag', frage: 'Wie hoch ist ein Preis mit Aufschlag oder Rabatt?', stichwort: 'Aufschlag, Rabatt', klein: 'Zum Beispiel 100 € plus 12 % Aufschlag',
      icon: SVG('<path d="M12 5v14M5 12h14"/>') },
    { id: 'mwst', frage: 'Wie hoch ist ein Preis mit oder ohne Mehrwertsteuer?', stichwort: 'Mehrwertsteuer', klein: 'Netto in brutto und zurück',
      icon: SVG('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>') }
  ];

  function render() {
    const { h, ui, fmt } = WK;
    const S = { a: '3', b: '12', c: '5', art: 'gerade', g: '250', p: '15', a2: '30', b2: '120', modus: 'anteil',
      g2: '100', p2: '12', art2: 'auf', betrag: '100', satz: '19', art3: 'netto' };
    const root = h('div');
    const feld = (label, key, o = {}) => {
      const f = ui.num(label, { value: S[key], ...o });
      return { f, bind: fn => f.input.addEventListener('input', () => { S[key] = f.input.value; fn(); }) };
    };
    const eur = n => Number.isFinite(n) ? n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '–';   // Preise immer mit 2 Nachkommastellen

    function zeigeMenu() {
      root.replaceChildren(
        h('p', { class: 'lead' }, 'Was willst du wissen?'),
        h('div', { class: 'wahl' }, FRAGEN.map(q => h('button', { type: 'button', onclick: () => zeigeFrage(q.id) },
          h('span', { class: 'ico', html: q.icon }),
          h('span', {}, q.stichwort ? h('span', { class: 'tag' }, q.stichwort) : null, h('strong', {}, q.frage), h('small', {}, q.klein))))));
    }

    function zeigeFrage(id) {
      const q = FRAGEN.find(x => x.id === id);
      const out = h('div');
      const zurueck = h('button', { type: 'button', class: 'zurueck', onclick: zeigeMenu }, '‹ Andere Frage');
      let felder = [], update = () => {};
      const begriffe = WK.ui.begriffe('rechnen/' + id);
      const fehl = t => out.replaceChildren(ui.note(t, 'warn'));

      if (id === 'dreisatz') {
        const a = feld('Bekannte Menge', 'a', { hint: 'Zum Beispiel 3 Stück' });
        const b = feld('Dazu gehört', 'b', { hint: 'Zum Beispiel 12 €' });
        const c = feld('Neue Menge', 'c', { hint: 'Zum Beispiel 5 Stück' });
        const art = ui.select('Wie hängen die Werte zusammen?', [
          { value: 'gerade', label: 'Je mehr Menge, desto mehr (Stückzahl und Preis)' },
          { value: 'umgekehrt', label: 'Je mehr Menge, desto weniger (Monteure und Zeit)' }
        ], S.art);
        felder = [a.f.el, b.f.el, c.f.el, art.el];
        update = () => {
          const um = art.get() === 'umgekehrt';
          const r = dreisatz({ a: a.f.get(), b: b.f.get(), c: c.f.get(), umgekehrt: um });
          if (!r) { fehl('Alle drei Werte eingeben. Bekannte und neue Menge müssen größer als 0 sein.'); return; }
          out.replaceChildren(ui.result([{ k: 'Ergebnis', v: fmt(r.x, 3), big: true }]),
            ui.note('Rechnung: ' + (um ? fmt(a.f.get(), 3) + ' × ' + fmt(b.f.get(), 3) + ' ÷ ' + fmt(c.f.get(), 3)
              : fmt(b.f.get(), 3) + ' × ' + fmt(c.f.get(), 3) + ' ÷ ' + fmt(a.f.get(), 3)) + ' = ' + fmt(r.x, 3)));
        };
        a.bind(update); b.bind(update); c.bind(update);
        art.select.addEventListener('change', () => { S.art = art.get(); update(); });
      } else if (id === 'prozent') {
        const g = feld('Grundwert', 'g', { hint: 'Der Wert, von dem du die Prozente nimmst' });
        const p = feld('Prozentsatz', 'p', { unit: '%' });
        felder = [g.f.el, p.f.el];
        update = () => {
          const r = prozentwert({ g: g.f.get(), p: p.f.get() });
          if (!r) { fehl('Grundwert und Prozentsatz eingeben.'); return; }
          out.replaceChildren(ui.result([{ k: fmt(p.f.get(), 2) + ' % von ' + fmt(g.f.get(), 2), v: fmt(r.w, 3), big: true }]),
            ui.note('Rechnung: ' + fmt(g.f.get(), 2) + ' × ' + fmt(p.f.get(), 2) + ' ÷ 100 = ' + fmt(r.w, 3)));
        };
        g.bind(update); p.bind(update);
      } else if (id === 'anteil') {
        const modus = ui.select('Was willst du wissen?', [
          { value: 'anteil', label: 'Wie viel Prozent ist A von B? (Anteil)' },
          { value: 'aenderung', label: 'Um wie viel Prozent ist B höher als A? (Veränderung)' }
        ], S.modus);
        const a = feld('A', 'a2', { hint: 'Bei der Veränderung: der Wert vorher, zum Beispiel Einkaufspreis' });
        const b = feld('B', 'b2', { hint: 'Bei der Veränderung: der Wert nachher, zum Beispiel Verkaufspreis' });
        felder = [modus.el, a.f.el, b.f.el];
        update = () => {
          const m = modus.get();
          const r = prozentsatz({ a: a.f.get(), b: b.f.get(), modus: m });
          if (!r) { fehl(m === 'aenderung' ? 'A (nicht 0) und B eingeben.' : 'A und B (nicht 0) eingeben.'); return; }
          const label = m === 'aenderung' ? (r.p >= 0 ? 'Höher um' : 'Niedriger um') : 'Anteil';
          out.replaceChildren(ui.result([{ k: label, v: fmt(Math.abs(r.p), 2) + ' %', big: true }]),
            ui.note('Rechnung: ' + (m === 'aenderung' ? '(' + fmt(b.f.get(), 2) + ' − ' + fmt(a.f.get(), 2) + ') ÷ ' + fmt(a.f.get(), 2) + ' × 100'
              : fmt(a.f.get(), 2) + ' ÷ ' + fmt(b.f.get(), 2) + ' × 100') + ' = ' + fmt(r.p, 2) + ' %'));
        };
        a.bind(update); b.bind(update);
        modus.select.addEventListener('change', () => { S.modus = modus.get(); update(); });
      } else if (id === 'aufschlag') {
        const art = ui.select('Aufschlag oder Rabatt?', [{ value: 'auf', label: 'Aufschlag (Preis wird höher)' }, { value: 'ab', label: 'Rabatt (Preis wird niedriger)' }], S.art2);
        const g = feld('Preis oder Wert', 'g2', { hint: 'Der Ausgangswert' });
        const p = feld('Prozentsatz', 'p2', { unit: '%' });
        felder = [art.el, g.f.el, p.f.el];
        update = () => {
          const r = aufschlag({ g: g.f.get(), p: p.f.get(), art: art.get() });
          if (!r) { fehl('Wert und Prozentsatz eingeben (Rabatt höchstens 100 %).'); return; }
          out.replaceChildren(ui.result([
            { k: art.get() === 'ab' ? 'Neuer Wert nach Rabatt' : 'Neuer Wert mit Aufschlag', v: eur(r.ergebnis), big: true },
            { k: art.get() === 'ab' ? 'Rabatt in Zahlen' : 'Aufschlag in Zahlen', v: eur(r.diff) }
          ]), ui.note('Rechnung: ' + fmt(g.f.get(), 2) + (art.get() === 'ab' ? ' − ' : ' + ') + fmt(g.f.get(), 2) + ' × ' + fmt(p.f.get(), 2) + ' ÷ 100 = ' + eur(r.ergebnis)));
        };
        g.bind(update); p.bind(update);
        art.select.addEventListener('change', () => { S.art2 = art.get(); update(); });
      } else {
        const art = ui.select('Welchen Preis kennst du?', [{ value: 'netto', label: 'Netto (ohne Mehrwertsteuer)' }, { value: 'brutto', label: 'Brutto (mit Mehrwertsteuer)' }], S.art3);
        const betrag = feld('Betrag', 'betrag');
        const satz = feld('Steuersatz', 'satz', { unit: '%', hint: 'Prüfe den Satz, der für deine Rechnung gilt' });
        felder = [art.el, betrag.f.el, satz.f.el];
        update = () => {
          const r = mwst({ betrag: betrag.f.get(), satz: satz.f.get(), art: art.get() });
          if (!r) { fehl('Betrag und Steuersatz eingeben.'); return; }
          out.replaceChildren(ui.result([
            { k: art.get() === 'netto' ? 'Brutto (mit MwSt)' : 'Netto (ohne MwSt)', v: eur(art.get() === 'netto' ? r.brutto : r.netto), big: true },
            { k: 'Mehrwertsteuer', v: eur(r.steuer) },
            { k: 'Netto', v: eur(r.netto) },
            { k: 'Brutto', v: eur(r.brutto) }
          ]), ui.note('Brutto = Netto × (1 + Steuersatz ÷ 100). Der Steuersatz wird nicht vorgegeben, du trägst ihn selbst ein.'));
        };
        betrag.bind(update); satz.bind(update);
        art.select.addEventListener('change', () => { S.art3 = art.get(); update(); });
      }

      root.replaceChildren(...[zurueck, h('h2', { class: 'frage' }, q.frage), begriffe, ui.panel(null, ...felder), ui.panel('Ergebnis', out)].filter(Boolean));
      update();
    }

    zeigeMenu();
    return root;
  }

  WK.register({
    id: 'rechnen',
    bereich: 'allgemein',
    hilfe: {
      wofuer: 'Einfache Rechnungen für den Alltag: Dreisatz, Prozent, Aufschlag und Rabatt, Mehrwertsteuer.',
      schritte: [
        'Oben tippst du auf die Frage, die du beantwortet haben willst.',
        'Du siehst nur die Felder, die dafür nötig sind. Unter jedem Feld steht, was gemeint ist.',
        'Das Ergebnis steht groß darunter, mit der Rechnung in einer Zeile.',
        'Mit "Andere Frage" kommst du zurück zur Auswahl.'
      ],
      beispiel: '3 Stück kosten 12 €: 5 Stück kosten 20 €. 100 € plus 12 % Aufschlag sind 112 €.',
      hinweis: 'Gerundet wird nur bei der Anzeige. Der Steuersatz ist nicht festgelegt, trag den Satz ein, der für deine Rechnung gilt.'
    },
    quelle: [
      'Dreisatz und Prozentrechnung sind reine Rechenregeln (Grundwert, Prozentwert, Prozentsatz), keine Normwerte. Jede Rechnung wird in den Tests mit der Umkehrrechnung geprüft.',
      'Nicht enthalten: Steuerberatung, Skonto und Kalkulation mit Zuschlägen auf mehreren Stufen. Der Steuersatz wird nicht vorgegeben.'
    ],
    stichworte: 'prozentanteil dreisatz prozent prozentrechnung aufschlag rabatt skonto mehrwertsteuer mwst netto brutto marge kalkulation einkauf verkauf anteil',
    title: 'Dreisatz & Prozent',
    desc: 'Dreisatz, Prozent, Aufschlag, MwSt',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg>',
    render
  });
})();
