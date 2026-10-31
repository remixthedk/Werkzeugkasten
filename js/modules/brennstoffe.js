// Modul: Brennstoffe in kWh. Keine festen Brennwerte: Zustandszahl und Brennwert gibt der Anwender ein.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Gas: kWh = m³ × Zustandszahl × Brennwert (DVGW G 685). Andere Brennstoffe: kWh = Menge × kWh je Einheit.
  function gasKwh({ m3, z, brennwert }) {
    if (!(m3 >= 0) || !(z > 0) || !(brennwert > 0)) return null;
    return m3 * z * brennwert;
  }
  function gasM3({ kwh, z, brennwert }) {
    if (!(kwh >= 0) || !(z > 0) || !(brennwert > 0)) return null;
    return kwh / (z * brennwert);
  }
  function brennstoffKwh({ menge, kwhProEinheit }) {
    if (!(menge >= 0) || !(kwhProEinheit > 0)) return null;
    return menge * kwhProEinheit;
  }
  function brennstoffMenge({ kwh, kwhProEinheit }) {
    if (!(kwh >= 0) || !(kwhProEinheit > 0)) return null;
    return kwh / kwhProEinheit;
  }
  WK.calc.brennstoffe = { gasKwh, gasM3, brennstoffKwh, brennstoffMenge };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;

    // Zwei-Wege-Rechner: Menge <-> kWh. faktor() liefert den Umrechnungsfaktor (kWh je Mengeneinheit) oder NaN.
    function rechner(mengeLabel, mengeUnit, faktorFelder, faktor, faktorText) {
      const menge = ui.num(mengeLabel, { unit: mengeUnit, value: '' });
      const kwh = ui.num('Energie', { unit: 'kWh', value: '' });
      const out = h('div');
      let zuletzt = 'menge';
      function update() {
        const f = faktor();
        if (!(f > 0)) { out.replaceChildren(ui.note(faktorText, 'warn')); return; }
        if (zuletzt === 'menge') {
          const m = menge.get();
          if (!(m >= 0)) { kwh.set(''); out.replaceChildren(ui.note('Menge eingeben.')); return; }
          kwh.set(fmt(m * f, 2).replace(/\./g, ''));
        } else {
          const k = kwh.get();
          if (!(k >= 0)) { menge.set(''); out.replaceChildren(ui.note('Energie eingeben.')); return; }
          menge.set(fmt(k / f, 3).replace(/\./g, ''));
        }
        out.replaceChildren(ui.result([
          { k: 'Faktor', v: fmt(f, 4) + ' kWh je ' + mengeUnit },
          { k: 'Energie', v: fmt(kwh.get(), 1) + ' kWh', big: true }
        ]));
      }
      menge.input.addEventListener('input', () => { zuletzt = 'menge'; update(); });
      kwh.input.addEventListener('input', () => { zuletzt = 'kwh'; update(); });
      for (const f of faktorFelder) f.input.addEventListener('input', update);
      return { felder: [menge.el, ...faktorFelder.map(f => f.el), kwh.el], out, update };
    }

    // Erdgas
    const z = ui.num('Zustandszahl', { placeholder: 'z. B. 0,96', hint: 'steht auf der Gasrechnung' });
    const bw = ui.num('Abrechnungsbrennwert', { unit: 'kWh/m³', placeholder: 'z. B. 11,3', hint: 'steht auf der Gasrechnung' });
    const gas = rechner('Gasverbrauch', 'm³', [z, bw], () => z.get() * bw.get(),
      'Zustandszahl und Brennwert aus der Gasrechnung eintragen.');

    // Öl, Pellets, Flüssiggas
    const einheit = ui.select('Brennstoff', [
      { value: 'l', label: 'Heizöl (Liter)' },
      { value: 'kg', label: 'Pellets oder Flüssiggas (kg)' },
      { value: 'm3', label: 'Anderer Brennstoff (m³ oder Raummeter)' }
    ], 'l');
    const kwhPro = ui.num('Energiegehalt', { unit: 'kWh je l', placeholder: 'aus dem Datenblatt', hint: 'Heizwert oder Brennwert laut Lieferschein oder Datenblatt' });
    const unit = () => ({ l: 'l', kg: 'kg', m3: 'm³' }[einheit.get()]);
    let sonstige = rechner('Menge', unit(), [kwhPro], () => kwhPro.get(),
      'Energiegehalt je Einheit eintragen (Datenblatt oder Lieferschein).');

    const boxGas = h('div', {}, ui.panel(null, ...gas.felder), ui.panel('Ergebnis', gas.out,
      ui.note('Gerechnet wird m³ × Zustandszahl × Brennwert. Die Zahlen stehen auf der Abrechnung deines Gasversorgers.')));
    const feldHost = h('div');
    const outHost = h('div');
    const boxSonst = h('div', {}, ui.panel(null, einheit.el, feldHost), ui.panel('Ergebnis', outHost,
      ui.note('Es sind keine festen Werte hinterlegt: Der Energiegehalt unterscheidet sich je Brennstoff und Lieferung.')));
    function baueSonst() {
      // Rechner neu aufbauen, wenn sich die Einheit ändert (Beschriftung ändert sich)
      kwhPro.el.querySelector('.unit').textContent = 'kWh je ' + unit();
      sonstige = rechner('Menge', unit(), [kwhPro], () => kwhPro.get(),
        'Energiegehalt je Einheit eintragen (Datenblatt oder Lieferschein).');
      feldHost.replaceChildren(...sonstige.felder);
      outHost.replaceChildren(sonstige.out);
      sonstige.update();
    }
    einheit.select.addEventListener('change', baueSonst);
    baueSonst();
    boxSonst.hidden = true;

    const tabs = ui.tabs([
      { value: 'gas', label: 'Erdgas' },
      { value: 'sonst', label: 'Öl, Pellets, Flüssiggas' }
    ], v => { boxGas.hidden = v !== 'gas'; boxSonst.hidden = v !== 'sonst'; });
    gas.update();
    return h('div', {}, tabs.el, boxGas, boxSonst);
  }

  WK.register({
    id: 'brennstoffe',
    bereich: 'heizung',
    hilfe: {
      wofuer: 'Rechnet den Verbrauch in kWh um, zum Beispiel Kubikmeter Gas oder Liter Heizöl. Zustandszahl und Brennwert trägst du selbst ein, denn sie unterscheiden sich je Versorger.',
      schritte: [
        'Erdgas: Zustandszahl und Abrechnungsbrennwert von der Gasrechnung eintragen, dann den Verbrauch in m³. Du siehst die kWh. Oder die kWh eintippen und die m³ ablesen.',
        'Öl, Pellets, Flüssiggas: den Brennstoff wählen, den Energiegehalt je Einheit aus Lieferschein oder Datenblatt eintragen, dann die Menge.',
        'Beide Felder sind verbunden: Wenn du die kWh eintippst, wird die Menge gerechnet.'
      ],
      beispiel: '3.500 m³ Gas mit Zustandszahl 0,9592 und Brennwert 11,352 kWh/m³: 3.500 × 0,9592 × 11,352 = 38.111 kWh.',
      hinweis: 'Für die Abrechnung zählt der Abrechnungsbrennwert von der Rechnung. Fest eingebaute Richtwerte gibt es absichtlich nicht.'
    },
    quelle: [
      'Formel Gas: Gasmenge × Zustandszahl × Brennwert nach DVGW G 685. Gleich bei Bonn-Netz und den Stadtwerken Walldorf; das Beispiel stammt von den Stadtwerken Walldorf (38.111 kWh) und ist nachgerechnet.',
      'Öl, Pellets, Flüssiggas: Menge × Energiegehalt je Einheit. Der Wert kommt vom Anwender, es sind keine Richtwerte hinterlegt.'
    ],
    stichworte: 'gas erdgas kubikmeter m3 kwh öl heizöl liter pellets flüssiggas brennwert heizwert zustandszahl verbrauch',
    title: 'Brennstoff in kWh',
    desc: 'Gas m³, Öl, Pellets in kWh umrechnen',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.2 1 2 2 2 0-3-1-5 1-8z"/></svg>',
    render
  });
})();
