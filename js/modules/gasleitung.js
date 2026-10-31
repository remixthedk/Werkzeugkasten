// Modul: Gasleitung. Welche Rohrgröße braucht eine Gas-Einzelzuleitung (Erdgas, Niederdruck hinter dem Regler)?
// Rechnet den Druckverlust je Rohrgröße aus (Rohrreibung nach Darcy-Weisbach) und nimmt die kleinste Größe, die in das Druckbudget passt.
// Nur bis 110 kW (Geltungsbereich des Diagrammverfahrens der TRGI). Daten: js/data/gasrohre.js, Stahl aus js/data/rohre.js.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Druckgefälle in Pa/m, Geschwindigkeit in m/s für ein Rohr mit Innen-Ø di (mm).
  function gefaelle({ kw, gas, di, k }) {
    const D = WK.data.gasrohre, g = D.gase[gas];
    if (!g || !(kw > 0) || !(di > 0)) return null;
    const rhoB = g.rhoN * D.betrieb;                         // Dichte im Betriebszustand
    const mDot = kw / g.hiN * g.rhoN / 3600;                 // Massenstrom in kg/s
    const d = di / 1000, A = Math.PI * d * d / 4;
    const v = mDot / rhoB / A;
    const re = rhoB * v * d / D.eta;
    let f;
    if (re < 2300) f = 64 / re;
    else { const t = Math.log10((k / 1000) / (3.7 * d) + 5.74 / Math.pow(re, 0.9)); f = 0.25 / (t * t); }
    return { pam: f / d * rhoB * v * v / 2, v, re };
  }

  // Liste der Rohre eines Werkstoffs mit Innen-Ø, aufsteigend
  function rohreVon(werkstoff) {
    const D = WK.data.gasrohre, w = D.werkstoffe.find(x => x.id === werkstoff);
    if (!w) return null;
    let rohre;
    if (w.aus) {
      const q = WK.data.rohre.werkstoffe.find(x => x.id === w.aus);
      rohre = q.rohre.filter(r => r.ad >= w.dnVon && r.ad <= w.dnBis).map(r => ({ bez: r.bez.split(' (')[0], ad: r.ad, wand: r.wand }));
    } else rohre = w.rohre.map(r => ({ bez: r.ad + ' x ' + String(r.wand).replace('.', ','), ad: r.ad, wand: r.wand }));
    return { w, rohre: rohre.map(r => ({ ...r, di: Math.round((r.ad - 2 * r.wand) * 100) / 100 })).sort((a, b) => a.di - b.di) };
  }

  // Bemessung: kleinste Größe, deren Rohr-Druckverlust ins Budget passt.
  function bemessung({ kw, gas, werkstoff, laenge, winkel, bauteile }) {
    const D = WK.data.gasrohre;
    if (!(kw > 0) || !(laenge >= 0) || !D.gase[gas]) return null;
    if (kw > D.grenzeKw) return { grossanlage: true };
    const r = rohreVon(werkstoff); if (!r) return null;
    const nw = winkel > 0 ? winkel : 0, bt = bauteile >= 0 ? bauteile : D.bauteileStandard;
    const lb = laenge + nw * r.w.winkel;                     // Berechnungslänge
    const budget = D.budgetPa - bt;                          // Pa, die für das Rohr bleiben
    const zeilen = r.rohre.map(x => {
      const g = gefaelle({ kw, gas, di: x.di, k: r.w.k });
      return { ...x, pam: g.pam, v: g.v, verlust: g.pam * lb, ok: g.pam * lb <= budget };
    });
    return { zeilen, empfehlung: zeilen.findIndex(z => z.ok), laengeBer: lb, budget, bauteile: bt, winkelZuschlag: r.w.winkel };
  }
  WK.calc.gasleitung = { gefaelle, rohreVon, bemessung };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const D = WK.data.gasrohre;
    const kw = ui.num('Leistung', { unit: 'kW', value: '24', hint: 'Summe der Nennbelastung aller Geräte an dieser Leitung, steht auf dem Typenschild.' });
    const gas = ui.select('Gasart', [{ value: 'H', label: 'Erdgas H (Standard im Nordwesten)' }, { value: 'L', label: 'Erdgas L' }], 'H');
    const wst = ui.select('Rohrwerkstoff', D.werkstoffe.map(w => ({ value: w.id, label: w.name })), 'kupfer');
    const len = ui.num('Rohrlänge, geschätzt', { unit: 'm', value: '15', hint: 'Gestreckte Länge vom Hausdruckregler oder Zähler bis zum Gerät. Eine Schätzung reicht.' });
    const wk = ui.num('Winkel und Bögen', { value: '6', hint: 'Anzahl, grob geschätzt. Jeder Winkel zählt wie ein Stück Rohr mehr.' });
    const bt = ui.num('Bauteile (Gasströmungswächter, Zähler, Armatur)', { unit: 'Pa', value: String(D.bauteileStandard), hint: 'Richtwert aus einem TRGI-Beispiel für 18 kW. Bei größerer Leistung die Werte aus den Datenblättern eintragen.' });
    const out = h('div');

    function update() {
      const r = bemessung({ kw: kw.get(), gas: gas.get(), werkstoff: wst.get(), laenge: len.get(), winkel: wk.get(), bauteile: bt.get() });
      if (!r) { out.replaceChildren(ui.note('Leistung und Rohrlänge eingeben.', 'warn')); return; }
      if (r.grossanlage) {
        out.replaceChildren(ui.note('Über ' + D.grenzeKw + ' kW rechnet diese Seite nicht. Das einfache Verfahren der TRGI gilt nur bis ' + D.grenzeKw + ' kW. Bei größeren Anlagen macht ein eingetragenes Vertragsinstallationsunternehmen die Rohrnetzberechnung nach TRGI. Anschlussdruck und Zählergröße legt der Netzbetreiber fest.', 'warn'));
        return;
      }
      const e = r.zeilen[r.empfehlung];
      const kopf = ['Rohr', 'Innen', 'Pa/m', 'Verlust', ''];
      const tabelle = ui.table(kopf, r.zeilen.map(z => [z.bez, fmt(z.di, 1), fmt(z.pam, 1), fmt(z.verlust, 0) + ' Pa', z.ok ? '✓' : '✗']));
      out.replaceChildren(...[
        e ? ui.result([
          { k: 'Kleinste passende Größe', v: e.bez, big: true },
          { k: 'Druckverlust im Rohr', v: fmt(e.verlust, 0) + ' von ' + fmt(r.budget, 0) + ' Pa' },
          { k: 'Strömung', v: fmt(e.v, 1) + ' m/s' },
          { k: 'Berechnungslänge', v: fmt(r.laengeBer, 1) + ' m' }
        ]) : ui.note('Keine Größe in dieser Liste reicht aus. Prüfe die Eingaben (Länge, Bauteile) oder lass die Leitung vom Fachbetrieb nach TRGI berechnen.', 'warn'),
        tabelle,
        ui.note('✓ = Druckverlust im Rohr bleibt unter ' + fmt(r.budget, 0) + ' Pa (300 Pa gesamt minus ' + fmt(r.bauteile, 0) + ' Pa für Bauteile). Winkel zählen mit ' + fmt(r.winkelZuschlag, 1) + ' m je Stück zur Länge.'),
        ui.note('Orientierung, kein Nachweis. Die Berechnung nach TRGI (Formblatt) macht das Vertragsinstallationsunternehmen. T-Stücke, Absperrungen und Höhenunterschied sind nicht erfasst. Gilt für Niederdruck hinter dem Hausdruckregler (23 mbar), nicht für Mittel- oder Hochdruck davor.')
      ].filter(Boolean));
    }
    for (const f of [kw, len, wk, bt]) f.input.addEventListener('input', update);
    for (const f of [gas, wst]) f.select.addEventListener('change', update);
    update();
    return h('div', {}, ui.panel(null, kw.el, gas.el, wst.el, len.el, wk.el, bt.el), ui.panel('Ergebnis', out));
  }

  WK.register({
    id: 'gasleitung',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Du suchst die Rohrgröße für eine Gasleitung zu einem Gerät und kennst die Leistung. Die App rechnet für jede Größe aus, wie viel Druck auf dem Weg verloren geht, und zeigt die kleinste Größe, bei der noch genug am Gerät ankommt. Sie gilt für Erdgas bis 110 kW hinter dem Hausdruckregler.',
      schritte: [
        'Leistung eintragen (bei mehreren Geräten die Summe) und die Gasart wählen.',
        'Rohrwerkstoff wählen: Kupfer (zum Beispiel Profipress G), Edelstahl (Mapress Edelstahl Gas) oder Stahlrohr.',
        'Rohrlänge schätzen und die Winkel zählen. Das muss nicht genau sein.',
        'Das Ergebnis zeigt die kleinste Größe. In der Tabelle siehst du alle Größen mit Haken oder Kreuz, und wie viel Druck verloren geht.'
      ],
      beispiel: '24 kW Erdgas H, Kupfer, 15 m und 6 Winkel: 22 x 1 reicht. Bei 18 x 1 geht zu viel Druck verloren.',
      hinweis: 'Das ist eine Orientierung. Verbindlich ist die Rohrnetzberechnung nach TRGI durch das Vertragsinstallationsunternehmen. Über 110 kW rechnet die Seite nicht.'
    },
    quelle: [
      'Druckbudget: Der Regler liefert 23 mbar, am Gerät sollen mindestens 20 mbar anliegen, also 3 mbar (300 Pa) für Leitung und Bauteile. SBZ Monteur (TRGI-Bemessung) und bubiza-Wiki, übereinstimmend. Das Diagrammverfahren der TRGI gilt für Einzelzuleitungen bis 110 kW (bubiza-Wiki).',
      'Bauteile: Gasströmungswächter 14 Pa, Zähler G 2,5 60 Pa und Geräteanschlussarmatur 45 Pa, zusammen etwa 120 Pa, aus einem TRGI-Rechenbeispiel für 18 kW (mh-software). Eine Quelle. Der Wert ist änderbar.',
      'Rechenweg: Druckverlust nach Darcy-Weisbach mit Rohrreibungszahl nach Swamee-Jain. Gegenprobe: Das TRGI-Beispiel (18 kW, Kupfer 18 mm, Erdgas L, Betriebsheizwert 8,6 kWh/m³) liest 9 Pa/m ab. Die Rechnung kommt bei 19 kW mit 18 x 1 auf 9,5 Pa/m, also etwas auf der sicheren Seite. Es ist eine einzige Gegenprobe.',
      'Gasdaten: Heizwert und Normdichte Erdgas H nach DEW21 und Stadtwerke Essen, Erdgas L nach DEW21 (eine Quelle). Der Betriebsfaktor 0,92 ist so gewählt, dass Erdgas L den TRGI-Wert 8,6 kWh/m³ ergibt. Viskosität 1,1e-5 Pa s ist eine Annahme für Methan.',
      'Kupfer (DVGW GW 392, Hauptabmessungen): DKI-Broschüre und eumet.de, übereinstimmend. Dickere Sonderwände (zum Beispiel 28 x 1,5) gibt es zusätzlich, sie hätten etwas mehr Druckverlust. Edelstahl: Geberit-Datenblatt Mapress Edelstahl, eine Quelle (bei einer Variante nennt ein Händler 22 x 1,5). Stahl: wie in den Rohrmaßen. Winkel: 0,3 m bei Kupfer und Edelstahl (zwei Quellen), 0,5 m bei Stahl (eine Quelle).',
      'Nicht enthalten: Mittel- und Hochdruck, Anlagen über 110 kW, Höhenunterschied, T-Stücke und Absperrungen, mehrere Geräte mit Gleichzeitigkeit, Kunststoff-Gasrohre.'
    ],
    stichworte: 'gas gasleitung erdgas rohr rohrgröße rohrgroesse dimensionierung kw leistung trgi niederdruck druckverlust kupfer edelstahl stahl zuleitung profipress mapress',
    frage: 'Wie groß muss meine Gasleitung sein?',
    title: 'Gasleitung',
    desc: 'Rohrgröße für Erdgas aus kW, Länge und Werkstoff (bis 110 kW)',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18M3 15h18"/><path d="M7 9v6M17 9v6"/><path d="M12 3c1 1.5 2 2.2 2 3.5a2 2 0 0 1-4 0C10 5.2 11 4.5 12 3z"/></svg>',
    render
  });
})();
