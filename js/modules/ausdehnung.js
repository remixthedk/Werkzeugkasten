// Modul: Längenausdehnung von Rohren. Daten: js/data/ausdehnung.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // alpha in mm/(m·K), laenge in m, t1/t2 in °C -> Längenänderung in mm (positiv = länger)
  function dehnung({ alpha, laenge, t1, t2 }) {
    if (!(alpha > 0) || !(laenge > 0) || !Number.isFinite(t1) || !Number.isFinite(t2)) return null;
    const dT = t2 - t1;
    return { dT, mm: alpha * laenge * dT };
  }
  WK.calc.ausdehnung = { dehnung };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const D = WK.data.ausdehnung;

    const mat = ui.select('Rohrmaterial', [
      ...D.werkstoffe.map(w => ({ value: w.id, label: w.name })),
      { value: 'eigen', label: 'Eigener Wert' }
    ], D.werkstoffe[0].id);
    const alphaFeld = ui.num('Ausdehnungskoeffizient α', { unit: 'mm/(m·K)', value: '' });
    const laenge = ui.num('Rohrlänge', { unit: 'm', value: '10' });
    const t1 = ui.num('Temperatur beim Einbau', { unit: '°C', value: '10' });
    const t2 = ui.num('Temperatur im Betrieb', { unit: '°C', value: '70' });
    const out = h('div');

    const alphaWert = () => mat.get() === 'eigen'
      ? alphaFeld.get()
      : (D.werkstoffe.find(w => w.id === mat.get()) || {}).alpha;

    function update() {
      alphaFeld.el.hidden = mat.get() !== 'eigen';
      const alpha = alphaWert();
      const r = dehnung({ alpha, laenge: laenge.get(), t1: t1.get(), t2: t2.get() });
      if (!r) { out.replaceChildren(ui.note('Alle Werte eingeben (Länge und α größer 0).', 'warn')); return; }
      const richtung = r.mm > 0 ? 'Verlängerung' : r.mm < 0 ? 'Verkürzung' : 'keine Änderung';
      out.replaceChildren(ui.result([
        { k: 'Längenänderung', v: fmt(Math.abs(r.mm), 1) + ' mm', big: true },
        { k: 'Richtung', v: richtung },
        { k: 'Temperaturunterschied', v: fmt(Math.abs(r.dT), 1) + ' K' },
        { k: 'α', v: fmt(alpha, 4) + ' mm/(m·K)' }
      ]));
    }
    for (const f of [alphaFeld, laenge, t1, t2]) f.input.addEventListener('input', update);
    mat.select.addEventListener('change', update);

    const root = h('div', {},
      ui.panel(null, mat.el, alphaFeld.el, laenge.el, t1.el, t2.el),
      ui.panel('Ergebnis', out,
        ui.note('Das ist die Dehnung einer frei beweglichen Leitung. Wie ein Dehnungsausgleich auszulegen ist, steht in den Herstellerunterlagen.')));
    update();
    return root;
  }

  WK.register({
    id: 'ausdehnung',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Rohre werden warm länger und kalt kürzer. Hier siehst du, um wie viel Millimeter sich eine Leitung bei einem Temperaturunterschied ändert.',
      schritte: [
        'Rohrmaterial wählen. Ist dein Material nicht dabei, nimm "Eigener Wert" und trage α aus dem Datenblatt ein.',
        'Rohrlänge in Metern eintippen.',
        'Die Temperatur beim Einbau und die höchste (oder niedrigste) Temperatur im Betrieb eintippen.',
        'Ergebnis: die Längenänderung in Millimetern und ob das Rohr länger oder kürzer wird.'
      ],
      beispiel: '20 m Raxofix, von 10 °C auf 60 °C: α 0,03 mm/(m·K) mal 20 m mal 50 K ergibt 30 mm. Das ist auch das Beispiel in der Viega-Anleitung.',
      hinweis: 'Gerechnet wird nur die freie Dehnung. Dämmung, Befestigung und Dehnungsausgleicher sind nicht berücksichtigt.'
    },
    quelle: [
      'Formel: ΔL = α · L · ΔT. Gegenprobe mit dem Viega-Beispiel: 20 m, 50 K, α 0,03 ergibt 30 mm.',
      'Raxofix 0,03 mm/(m·K): Viega-Gebrauchsanleitung Raxofix. Bestätigt durch das Nussbaum-Datenblatt zu Mehrschichtverbundrohr (ebenfalls 0,03, anderer Hersteller).',
      'Prestabo 0,012: Viega-Gebrauchsanleitung Prestabo (verzinkter Stahl). Stahl 0,012 außerdem bei BauNetz Wissen, Nussbaum und Geberit (Mapress C-Stahl, Heinze-Ausschreibungstext).',
      'Mapress Edelstahl 1.4401 0,0165: Geberit-Produktdaten und Nussbaum-Datenblatt, übereinstimmend.',
      'Kupfer 0,0166: Viega-Gebrauchsanleitung Profipress. BauNetz Wissen nennt 0,017 (gerundet).',
      'Stahl-Gewinderohr: gleicher Wert wie Stahl (0,012).'
    ],
    stichworte: 'dehnung wärmedehnung längenänderung ausdehnung temperatur dehnungsausgleich rohr länger kürzer alpha',
    title: 'Längenausdehnung',
    desc: 'Dehnung des Rohrs bei Temperaturänderung',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg>',
    render
  });
})();
