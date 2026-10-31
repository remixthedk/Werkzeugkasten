// Modul: Einheiten-Umrechner. Daten: js/data/einheiten.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Wert in Einheit "von" -> Liste aller Einheiten der Gruppe
  function umrechnen(gruppeId, wert, vonId) {
    const g = WK.data.einheiten.gruppen.find(x => x.id === gruppeId);
    if (!g || !Number.isFinite(wert)) return null;
    const von = g.einheiten.find(e => e.id === vonId);
    if (!von) return null;
    if (g.temperatur) {
      const k = von.zuK(wert);
      if (k < 0) return null;   // unter dem absoluten Nullpunkt
      return g.einheiten.map(e => ({ id: e.id, label: e.label, wert: e.vonK(k) }));
    }
    const basis = wert * von.f;
    return g.einheiten.map(e => ({ id: e.id, label: e.label, wert: basis / e.f }));
  }
  WK.calc.einheiten = { umrechnen };

  // ---- Oberfläche ----
  // 6 gültige Stellen, deutsch; sehr große und sehr kleine Werte in Exponentenschreibweise
  function zahl(n) {
    if (!Number.isFinite(n)) return '–';
    const r = Number(n.toPrecision(6));
    if (r === 0) return '0';
    const a = Math.abs(r);
    if (a >= 1e9 || a < 1e-4) return r.toExponential(3).replace('.', ',');
    return r.toLocaleString('de-DE', { maximumFractionDigits: 10 });
  }

  function render() {
    const { h, ui } = WK;
    const D = WK.data.einheiten;
    let gruppe = D.gruppen[0];

    const wert = ui.num('Wert', { value: gruppe.start.wert });
    const von = ui.select('Einheit', gruppe.einheiten.map(e => ({ value: e.id, label: e.label })), gruppe.start.von);
    const out = h('div');
    const info = h('div');

    function update() {
      const r = umrechnen(gruppe.id, wert.get(), von.get());
      if (!r) {
        out.replaceChildren(ui.note(Number.isFinite(wert.get()) ? 'Dieser Wert ist nicht möglich (unter dem absoluten Nullpunkt).' : 'Wert eingeben.', 'warn'));
        return;
      }
      out.replaceChildren(ui.table(['Einheit', 'Wert'], r.map(x => [x.label, zahl(x.wert)])));
    }
    function setzeGruppe(id) {
      gruppe = D.gruppen.find(g => g.id === id);
      von.select.replaceChildren(...gruppe.einheiten.map(e => h('option', { value: e.id }, e.label)));
      von.set(gruppe.start.von);
      wert.set(gruppe.start.wert);
      info.replaceChildren(ui.note(gruppe.hinweis));
      update();
    }

    const tabs = ui.tabs(D.gruppen.map(g => ({ value: g.id, label: g.name })), setzeGruppe);
    wert.input.addEventListener('input', update);
    von.select.addEventListener('change', update);

    const root = h('div', {}, tabs.el, ui.panel(null, wert.el, von.el), ui.panel('Umgerechnet', out, info));
    setzeGruppe(gruppe.id);
    return root;
  }

  WK.register({
    id: 'einheiten',
    bereich: 'allgemein',
    hilfe: {
      wofuer: 'Rechnet Druck, Leistung, Energie, Durchfluss und Temperatur in die anderen üblichen Einheiten um, zum Beispiel bar in mWS oder BTU/h in kW.',
      schritte: [
        'Oben die Größe wählen: Druck, Leistung, Energie, Durchfluss oder Temperatur.',
        'Den Wert eintippen und darunter die Einheit wählen, in der du ihn hast.',
        'In der Tabelle siehst du den Wert gleich in allen anderen Einheiten.'
      ],
      beispiel: 'Ein Klimagerät mit 12.000 BTU/h: Leistung, 12000, BTU/h. Ergebnis: 3,51685 kW, also etwa 3,5 kW.',
      hinweis: 'Die Tabelle zeigt 6 gültige Stellen. Das reicht für die Baustelle immer.'
    },
    quelle: [
      'bar (100.000 Pa), kWh (3,6 MJ), kcal (4,1868 kJ) und mmWS (9,80665 Pa) sind genau festgelegt: NIST Guide to the SI (Anhang B.8). mmWS zusätzlich bei chemie.de bestätigt.',
      'BTU (International Table): 1055,056 J, NIST Guide to the SI. Gegenprobe im MIT-Umrechnungsblatt (1055 J). psi: 6894,757 Pa, NIST, und selbst aus Pfund-Kraft und Zoll nachgerechnet.',
      'Durchfluss: reine Zeit- und Volumenfaktoren (1 l/s = 3,6 m³/h). Temperatur: 0 °C = 273,15 K = 32 °F, 100 °C = 212 °F.'
    ],
    stichworte: 'bar mbar pascal mws wassersäule psi kw kcal btu kwh mj liter l/min m3/h celsius fahrenheit kelvin druck leistung energie umrechnen einheit',
    title: 'Einheiten',
    desc: 'Druck, Leistung, Energie, Durchfluss, Temperatur umrechnen',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h14M14 4l4 4-4 4"/><path d="M20 16H6M10 12l-4 4 4 4"/></svg>',
    render
  });
})();
