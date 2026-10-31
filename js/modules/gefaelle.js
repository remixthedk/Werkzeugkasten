// Modul: Gefälle (Abwasser u. a.) umrechnen. Reine Geometrie, keine Normwerte.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Gefälle in Prozent = Höhenunterschied / waagerechte Länge × 100 (1 % = 1 cm/m)
  const GRAD = Math.PI / 180;
  const alle = p => ({ prozent: p, cmProM: p, mmProM: p * 10, verhaeltnis: p > 0 ? 100 / p : null, grad: Math.atan(p / 100) / GRAD });
  function ausProzent(p) { return p > 0 ? alle(p) : null; }
  function ausVerhaeltnis(n) { return n > 0 ? alle(100 / n) : null; }
  function ausGrad(g) { return g > 0 && g < 90 ? alle(100 * Math.tan(g * GRAD)) : null; }
  // Höhenunterschied in cm bei Länge in m und Gefälle in %
  const hoehe = (laenge, prozent) => (laenge > 0 && prozent > 0 ? laenge * prozent : null);
  // Gefälle in % aus Höhenunterschied (cm) und Länge (m)
  const gefaelleAus = (hoeheCm, laenge) => (hoeheCm > 0 && laenge > 0 ? hoeheCm / laenge : null);
  WK.calc.gefaelle = { ausProzent, ausVerhaeltnis, ausGrad, hoehe, gefaelleAus };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;

    // Tab 1: Gefälle in andere Schreibweisen umrechnen
    const art = ui.select('Gefälle angegeben als', [
      { value: 'prozent', label: '% (gleich cm/m)' },
      { value: 'verh', label: '1 : n (zum Beispiel 1 : 50)' },
      { value: 'grad', label: 'Winkel in °' }
    ], 'prozent');
    const wert = ui.num('Wert', { value: '2' });
    const outU = h('div');
    function updateU() {
      const x = wert.get();
      const a = art.get();
      const r = a === 'prozent' ? ausProzent(x) : a === 'verh' ? ausVerhaeltnis(x) : ausGrad(x);
      if (!r) { outU.replaceChildren(ui.note(a === 'grad' ? 'Winkel zwischen 0 und 90° eingeben.' : 'Wert größer 0 eingeben.', 'warn')); return; }
      outU.replaceChildren(ui.result([
        { k: 'Prozent', v: fmt(r.prozent, 3) + ' %', big: true },
        { k: 'cm je Meter', v: fmt(r.cmProM, 3) + ' cm/m' },
        { k: 'mm je Meter', v: fmt(r.mmProM, 2) + ' mm/m' },
        { k: 'Verhältnis', v: '1 : ' + fmt(r.verhaeltnis, 2) },
        { k: 'Winkel', v: fmt(r.grad, 3) + ' °' }
      ]));
    }
    art.select.addEventListener('change', () => {
      wert.set(art.get() === 'verh' ? '50' : art.get() === 'grad' ? '1' : '2');
      updateU();
    });
    wert.input.addEventListener('input', updateU);

    // Tab 2: Höhenunterschied bei gegebener Länge
    const laenge = ui.num('Waagerechte Länge', { unit: 'm', value: '5' });
    const proz = ui.num('Gefälle', { unit: '%', value: '2', hint: '1 % = 1 cm je Meter' });
    const hoeheFeld = ui.num('Höhenunterschied', { unit: 'cm', value: '' });
    const outH = h('div');
    function ausGefaelle() {
      const r = hoehe(laenge.get(), proz.get());
      if (r != null) hoeheFeld.set(fmt(r, 2).replace(/\./g, '')); else hoeheFeld.set('');
      zeigeH(r != null);
    }
    function ausHoehe() {
      const r = gefaelleAus(hoeheFeld.get(), laenge.get());
      if (r != null) proz.set(fmt(r, 3).replace(/\./g, '')); else proz.set('');
      zeigeH(r != null);
    }
    function zeigeH(ok) {
      outH.replaceChildren(ok ? ui.note('Länge und Gefälle ergeben den Höhenunterschied. Oder gib Länge und Höhenunterschied ein, dann wird das Gefälle gerechnet.')
        : ui.note('Länge und Gefälle (oder Höhenunterschied) eingeben.', 'warn'));
    }
    laenge.input.addEventListener('input', () => { if (proz.get() > 0 || !(hoeheFeld.get() > 0)) ausGefaelle(); else ausHoehe(); });
    proz.input.addEventListener('input', ausGefaelle);
    hoeheFeld.input.addEventListener('input', ausHoehe);

    let box;
    const tabs = ui.tabs([
      { value: 'um', label: 'Umrechnen' },
      { value: 'hoehe', label: 'Höhe bei Länge' }
    ], v => { boxU.hidden = v !== 'um'; boxH.hidden = v !== 'hoehe'; });
    const boxU = h('div', {}, ui.panel(null, art.el, wert.el), ui.panel('Ergebnis', outU));
    const boxH = h('div', {}, ui.panel(null, laenge.el, proz.el, hoeheFeld.el, outH,
      ui.note('Gemessen wird die waagerechte Länge. Bei Gefällen bis 10 % ist das schräge Rohr weniger als 0,5 % länger.')));
    boxH.hidden = true;
    box = h('div', {}, tabs.el, boxU, boxH);
    updateU(); ausGefaelle();
    return box;
  }

  WK.register({
    id: 'gefaelle',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Gefälle gibt es als Prozent, als cm je Meter, als Verhältnis 1 : n oder als Winkel. Hier rechnest du alle ineinander um und bekommst den Höhenunterschied über eine Rohrlänge.',
      schritte: [
        'Gefälle umrechnen: die Schreibweise wählen, in der du das Gefälle hast, und den Wert eintippen. Du siehst alle anderen Schreibweisen.',
        'Höhe bei Länge: die waagerechte Länge und Gefälle in Prozent eintippen. Das Feld Höhenunterschied zeigt, wie viele Zentimeter das Rohr am Ende tiefer liegt.',
        'Kennst du Länge und Höhenunterschied, tippe beide ein. Das Gefälle wird dann gerechnet.'
      ],
      beispiel: '2 % sind 2 cm je Meter, 1 : 50 und etwa 1,15°. Bei 5 m Länge liegt das Rohrende 10 cm tiefer.',
      hinweis: 'Das Modul rechnet nur um. Welches Mindestgefälle eine Leitung braucht, steht in der Norm und ist hier nicht hinterlegt.'
    },
    quelle: [
      'Reine Geometrie: Gefälle in % = Höhe ÷ Länge × 100 (1 % = 1 cm/m), Verhältnis 1 : n mit n = 100 ÷ %, Winkel = arctan(% ÷ 100). Jeweils durch Gegenrechnung geprüft.',
      'Nicht enthalten: Mindestgefälle nach DIN 1986-100 und DIN EN 12056. Dazu fanden sich keine zwei unabhängigen Quellen, die Angaben zu Anschlussleitungen widersprechen sich.'
    ],
    stichworte: 'gefälle abwasser neigung prozent cm/m grad winkel hoehe höhenunterschied abfluss',
    title: 'Gefälle',
    desc: 'Prozent, cm/m, 1 : n, Winkel und Höhenunterschied',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l18 8M3 7v8h18"/></svg>',
    render
  });
})();
