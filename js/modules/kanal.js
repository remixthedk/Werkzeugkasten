// Modul: Luftkanal rund <-> eckig. Reine Rechnung, keine Tabellen.
// Startseite des Moduls: "Was willst du wissen?" mit großen Auswahlzeilen, danach nur die nötigen Felder.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Gleichwertiger Durchmesser (gleicher Volumenstrom, gleicher Druckverlust je Meter):
  // d = 1,3 · (a·b)^0,625 / (a+b)^0,25   (Huebscher, ASHRAE). a, b und d in derselben Einheit (hier mm).
  const deq = (a, b) => 1.3 * Math.pow(a * b, 0.625) / Math.pow(a + b, 0.25);

  // Eckiger Kanal a × b (mm) -> gleichwertiger runder Kanal
  function eckigZuRund({ a, b }) {
    if (!(a > 0) || !(b > 0)) return null;
    const d = deq(a, b);
    const flEckig = a * b, flRund = Math.PI * d * d / 4;
    return {
      d, verhaeltnis: Math.max(a, b) / Math.min(a, b),
      flEckigCm2: flEckig / 100, flRundCm2: flRund / 100
    };
  }

  // Runder Kanal d (mm) und eine Seite a (mm) -> andere Seite b (mm), sodass der eckige Kanal gleichwertig ist.
  // deq wächst mit b immer weiter; gesucht wird das b mit deq(a, b) = d (Halbierungsverfahren).
  function rundZuEckig({ d, a }) {
    if (!(d > 0) || !(a > 0)) return null;
    let lo = 0, hi = Math.max(d, a) * 100;
    for (let i = 0; i < 200; i++) {
      const m = (lo + hi) / 2;
      if (deq(a, m) < d) lo = m; else hi = m;
    }
    const b = (lo + hi) / 2;
    return { b, verhaeltnis: Math.max(a, b) / Math.min(a, b), flEckigCm2: a * b / 100, flRundCm2: Math.PI * d * d / 400 };
  }

  // Luftgeschwindigkeit: v = Volumenstrom / Querschnitt. q in m³/h, Maße in mm. Ergebnis in m/s.
  function geschwindigkeit({ q, form, d, a, b }) {
    if (!(q > 0)) return null;
    let A;   // m²
    if (form === 'rund') { if (!(d > 0)) return null; A = Math.PI * d * d / 4 / 1e6; }
    else { if (!(a > 0) || !(b > 0)) return null; A = a * b / 1e6; }
    return { v: q / 3600 / A, A, ls: q / 3.6 };
  }
  WK.calc.kanal = { deq, eckigZuRund, rundZuEckig, geschwindigkeit };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const FRAGEN = [
    { id: 'rund', frage: 'Welcher runde Kanal ersetzt meinen eckigen Kanal?', klein: 'Zum Beispiel 300 × 200 mm',
      icon: SVG('<circle cx="12" cy="12" r="8"/><path d="M8 8h8v8H8z"/>') },
    { id: 'eckig', frage: 'Wie groß muss ein eckiger Kanal sein, der meinen runden ersetzt?', klein: 'Du gibst eine Seite vor',
      icon: SVG('<rect x="4" y="7" width="16" height="10" rx="1"/><circle cx="12" cy="12" r="3"/>') },
    { id: 'tempo', frage: 'Wie schnell strömt die Luft in meinem Kanal?', klein: 'Aus Luftmenge und Kanalgröße',
      icon: SVG('<path d="M3 9h12M12 5l4 4-4 4"/><path d="M21 15H9M12 11l-4 4 4 4"/>') }
  ];

  function render() {
    const { h, ui, fmt } = WK;
    const S = { a: '300', b: '200', d: '315', a2: '200', q: '500', form: 'rund', dv: '200', av: '300', bv: '200' };
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
      let felder = [], update = () => {};
      const begriffe = WK.ui.begriffe('kanal/' + id);

      if (id === 'rund') {
        const a = feld('Breite', 'a', { unit: 'mm', hint: 'Eine Seite des eckigen Kanals' });
        const b = feld('Höhe', 'b', { unit: 'mm', hint: 'Die andere Seite' });
        felder = [a.f.el, b.f.el];
        update = () => {
          const r = eckigZuRund({ a: a.f.get(), b: b.f.get() });
          if (!r) { out.replaceChildren(ui.note('Breite und Höhe in mm eingeben.', 'warn')); return; }
          out.replaceChildren(...[
            ui.result([
              { k: 'Rund, Durchmesser', v: fmt(r.d, 0) + ' mm', big: true },
              { k: 'genau gerechnet', v: fmt(r.d, 1) + ' mm' },
              { k: 'Seitenverhältnis', v: fmt(r.verhaeltnis, 1) + ' : 1' },
              { k: 'Querschnitt eckig / rund', v: fmt(r.flEckigCm2, 0) + ' / ' + fmt(r.flRundCm2, 0) + ' cm²' }
            ]),
            ui.note('Runde Kanäle gibt es nur in Normstufen. Nimm die nächstgrößere Größe, wenn der Druckverlust nicht höher werden soll.'),
            r.verhaeltnis > 8 ? ui.note('Das Seitenverhältnis ist größer als 8 : 1. Dafür ist die Formel nicht geprüft, bitte vorsichtig verwenden.', 'warn') : null
          ].filter(Boolean));
        };
        a.bind(update); b.bind(update);
      } else if (id === 'eckig') {
        const d = feld('Durchmesser des runden Kanals', 'd', { unit: 'mm' });
        const a = feld('Eine Seite des eckigen Kanals', 'a2', { unit: 'mm', hint: 'Meist ist die Höhe vorgegeben, zum Beispiel durch die Decke' });
        felder = [d.f.el, a.f.el];
        update = () => {
          const r = rundZuEckig({ d: d.f.get(), a: a.f.get() });
          if (!r) { out.replaceChildren(ui.note('Durchmesser und eine Seite in mm eingeben.', 'warn')); return; }
          out.replaceChildren(...[
            ui.result([
              { k: 'Andere Seite', v: fmt(r.b, 0) + ' mm', big: true },
              { k: 'Eckiger Kanal', v: fmt(a.f.get(), 0) + ' × ' + fmt(r.b, 0) + ' mm' },
              { k: 'Seitenverhältnis', v: fmt(r.verhaeltnis, 1) + ' : 1' },
              { k: 'Querschnitt eckig / rund', v: fmt(r.flEckigCm2, 0) + ' / ' + fmt(r.flRundCm2, 0) + ' cm²' }
            ]),
            ui.note('Rechne die Seite auf ein lieferbares Maß auf, damit der Druckverlust nicht höher wird.'),
            r.verhaeltnis > 8 ? ui.note('Das Seitenverhältnis ist größer als 8 : 1. Dafür ist die Formel nicht geprüft, bitte vorsichtig verwenden.', 'warn') : null
          ].filter(Boolean));
        };
        d.bind(update); a.bind(update);
      } else {
        const q2 = feld('Luftmenge', 'q', { unit: 'm³/h', hint: 'Steht im Lüftungskonzept oder auf dem Gerät' });
        const form = ui.select('Form des Kanals', [{ value: 'rund', label: 'Rund' }, { value: 'eckig', label: 'Eckig' }], S.form);
        const dv = feld('Durchmesser', 'dv', { unit: 'mm' });
        const av = feld('Breite', 'av', { unit: 'mm' });
        const bv = feld('Höhe', 'bv', { unit: 'mm' });
        const sichtbar = () => { const rund = form.get() === 'rund'; dv.f.el.hidden = !rund; av.f.el.hidden = rund; bv.f.el.hidden = rund; };
        felder = [q2.f.el, form.el, dv.f.el, av.f.el, bv.f.el];
        update = () => {
          sichtbar();
          const r = geschwindigkeit({ q: q2.f.get(), form: form.get(), d: dv.f.get(), a: av.f.get(), b: bv.f.get() });
          if (!r) { out.replaceChildren(ui.note('Luftmenge und Kanalmaße eingeben.', 'warn')); return; }
          out.replaceChildren(
            ui.result([
              { k: 'Luftgeschwindigkeit', v: fmt(r.v, 2) + ' m/s', big: true },
              { k: 'Luftmenge', v: fmt(r.ls, 1) + ' l/s' },
              { k: 'Querschnitt', v: fmt(r.A * 10000, 0) + ' cm²' }
            ]),
            ui.note('Rechnung: ' + fmt(q2.f.get(), 0) + ' m³/h ÷ 3600 ÷ ' + fmt(r.A, 4) + ' m² = ' + fmt(r.v, 2) + ' m/s. Zulässige Geschwindigkeiten hängen vom Einsatz ab (Lärm, Druckverlust) und stehen in der Planung.'));
        };
        q2.bind(update); dv.bind(update); av.bind(update); bv.bind(update);
        form.select.addEventListener('change', () => { S.form = form.get(); update(); });
      }

      root.replaceChildren(...[zurueck, h('h2', { class: 'frage' }, q.frage), begriffe, ui.panel(null, ...felder), ui.panel('Ergebnis', out)].filter(Boolean));
      update();
    }

    zeigeMenu();
    return root;
  }

  WK.register({
    id: 'kanal',
    bereich: 'lueftung',
    hilfe: {
      wofuer: 'Rechnet Luftkanäle um: welcher runde Kanal einen eckigen ersetzt, welcher eckige einen runden, und wie schnell die Luft im Kanal strömt.',
      schritte: [
        'Oben tippst du auf die Frage, die du beantwortet haben willst.',
        'Du siehst nur die Felder, die dafür nötig sind. Alle Maße gibst du in Millimetern ein.',
        'Das Ergebnis steht groß darunter.',
        'Mit "Andere Frage" kommst du zurück zur Auswahl.'
      ],
      beispiel: 'Eckiger Kanal 300 × 500 mm: der gleichwertige runde Kanal hat etwa 420 mm Durchmesser. 500 m³/h in einem runden Kanal mit 200 mm: etwa 4,4 m/s.',
      hinweis: 'Gleichwertig heißt: gleiche Luftmenge und gleicher Druckverlust je Meter. Die Querschnittsfläche ist dabei nicht gleich. Runde Kanäle gibt es nur in Normstufen.'
    },
    quelle: [
      'Gleichwertiger Durchmesser d = 1,3 · (a·b)^0,625 / (a+b)^0,25: engineeringtoolbox.com (nach Huebscher) und die ASHRAE-Quelle (Handbook Fundamentals, Kapitel 21, laut hvacpy). Beide nennen dieselbe Formel. Beispiel 300 × 500 mm gleich 420 mm.',
      'Gegenprobe: mit Darcy-Weisbach und Colebrook (Luft 20 °C, Rauheit 0,15 mm) für gleichen Volumenstrom und gleichen Druckverlust nachgerechnet. Die Formel weicht bei Seitenverhältnissen von 1,5 : 1 bis 8 : 1 höchstens 0,5 % ab.',
      'Luftgeschwindigkeit: v = Volumenstrom / Querschnittsfläche, reine Geometrie.',
      'Nicht enthalten: Normgrößen der runden Kanäle, zulässige Geschwindigkeiten und Druckverlust je Meter (hängen von Norm, Einsatz und Rauheit ab), flache Ovalrohre.'
    ],
    stichworte: 'lüftung lüftungskanal wickelfalz spiro rechteckkanal rund eckig äquivalent gleichwertiger durchmesser querschnitt luftgeschwindigkeit volumenstrom luft m³/h rechteck',
    title: 'Luftkanal',
    desc: 'Rund ↔ eckig, Luftgeschwindigkeit',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="12" height="10" rx="1"/><circle cx="18" cy="12" r="3.5"/></svg>',
    render
  });
})();
