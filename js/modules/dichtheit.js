// Modul: Dichtheitsprüfung Trinkwasser mit Luft oder Inertgas (Prüfdruck und Prüfzeit).
// Stand der Werte: ZVSHK-Merkblatt "Dichtheitsprüfungen von Trinkwasser-Installationen mit Druckluft, Inertgas oder Wasser", Ausgabe 01/2017.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  const DICHT_MBAR = 150;     // Dichtheitsprüfung
  const BASIS_MIN = 120;      // Prüfzeit bis 100 l
  const ZUSCHLAG_MIN = 20;    // je weitere (angefangene) 100 l
  const BELASTUNG_MIN = 10;   // Belastungsprüfung
  // Dichtheitsprüfung: Prüfzeit in Minuten für das Leitungsvolumen in Litern
  function dichtheit(liter) {
    if (!(liter > 0)) return null;
    const extra = liter > 100 ? Math.ceil((liter - 100) / 100) : 0;
    return { mbar: DICHT_MBAR, minuten: BASIS_MIN + ZUSCHLAG_MIN * extra };
  }
  // Belastungsprüfung: Höchstdruck nach größter Nennweite (bis DN 50: 3 bar, über DN 50 bis DN 100: 1 bar)
  function belastung(dn) {
    if (!(dn > 0) || dn > 100) return null;
    return { bar: dn <= 50 ? 3 : 1, minuten: BELASTUNG_MIN };
  }
  WK.calc.dichtheit = { dichtheit, belastung };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const liter = ui.num('Leitungsvolumen', { unit: 'l', value: '60', hint: 'Inhalt aller Leitungen der Anlage. Je Rohr im Modul Wasserinhalt ausrechnen und addieren.' });
    const dn = ui.select('Größte Nennweite', [
      { value: '50', label: 'bis DN 50' },
      { value: '100', label: 'über DN 50 bis DN 100' }
    ], '50');
    const out = h('div');
    const zeit = m => fmt(m, 0) + ' min' + (m >= 60 ? ' (' + fmt(m / 60, 2) + ' h)' : '');
    function update() {
      const d = dichtheit(liter.get());
      if (!d) { out.replaceChildren(ui.note('Leitungsvolumen in Litern eingeben.', 'warn')); return; }
      const b = belastung(Number(dn.get()));
      out.replaceChildren(
        ui.result([
          { k: '1. Dichtheitsprüfung', v: fmt(d.mbar, 0) + ' mbar', big: true },
          { k: 'Prüfzeit', v: zeit(d.minuten), big: true },
          { k: '2. Belastung, höchstens', v: fmt(b.bar, 0) + ' bar', big: true },
          { k: 'Prüfzeit', v: zeit(b.minuten) }
        ]),
        ui.note('Dichtheitsprüfung zuerst, solange die Leitungen noch offen liegen; Anzeigegenauigkeit des Manometers 1 mbar. Danach die Belastungsprüfung, Manometer mindestens 0,1 bar genau. Es darf kein Druckabfall auftreten.'),
        ui.note('Die Prüfzeit beginnt erst nach dem Temperaturausgleich (etwa 15 min). Gerechnet wird je angefangene 100 l über 100 l hinaus.'));
    }
    liter.input.addEventListener('input', update);
    dn.select.addEventListener('change', update);
    update();
    return h('div', {}, ui.panel(null, liter.el, dn.el), ui.panel('Prüfung mit Luft oder Inertgas', out),
      ui.note('Nur der Luft-Teil ist hinterlegt. Die Prüfung mit Wasser und die Gasprüfung sind bewusst nicht enthalten.'));
  }

  WK.register({
    id: 'dichtheit',
    bereich: 'sanitaer',
    hilfe: {
      wofuer: 'Zeigt Prüfdruck und Prüfzeit für die Dichtheitsprüfung einer Trinkwasser-Installation mit ölfreier Luft oder Inertgas. Die Zeit hängt vom Leitungsvolumen ab.',
      schritte: [
        'Das Leitungsvolumen der Anlage in Litern eintippen. Den Inhalt je Rohr bekommst du im Modul Wasserinhalt, dann addierst du alles.',
        'Die größte Nennweite der Anlage wählen: bis DN 50 oder darüber bis DN 100.',
        'Du siehst zuerst den Prüfdruck und die Prüfzeit der Dichtheitsprüfung, danach den Höchstdruck der Belastungsprüfung.',
        'Prüfzeit erst starten, wenn Temperatur und Druck sich eingependelt haben.'
      ],
      beispiel: '160 l Leitungsvolumen bis DN 50: Dichtheitsprüfung 150 mbar, 140 min. Danach Belastungsprüfung mit höchstens 3 bar für 10 min.',
      hinweis: 'Das Protokoll der Anlage und die Vorgaben des Rohrherstellers gelten zuerst. Hier steht nur der Stand des ZVSHK-Merkblatts.'
    },
    quelle: [
      'Dichtheitsprüfung 150 mbar, mindestens 120 min bis 100 l Leitungsvolumen, +20 min je weitere 100 l. Belastungsprüfung höchstens 3 bar bis DN 50, 1 bar über DN 50 bis DN 100, 10 min. Übereinstimmend bei TECE und bei Conex Banninger (dort mit "Quelle: ZVSHK" gekennzeichnet, Beispiel 300 l = 160 min).',
      'Aktuelles Merkblatt: ZVSHK, Ausgabe Januar 2017 (T82/1-1:2017-01, laut DIN-Eintrag aktuell). Das Original ist kostenpflichtig und wurde nicht eingesehen.',
      'Ältere und andere Angaben weichen ab (Wavin: 30 min + 10 min je 100 l; ältere Fassung: 110 mbar; Österreich ÖN B 2531: 60 min). Sie gelten hier nicht. "Je angefangene 100 l" ist die vorsichtige Lesart, die längere Zeit.',
      'Nicht enthalten: Prüfung mit Wasser (die Quellen nennen uneinheitliche Zeiten und Drücke) und Gasleitungen.'
    ],
    stichworte: 'dichtheitsprüfung druckprobe trinkwasser luft inertgas prüfdruck prüfzeit belastungsprüfung zvshk 150 mbar leitungsvolumen',
    title: 'Dichtheitsprüfung',
    desc: 'Trinkwasser mit Luft: Prüfdruck und Prüfzeit',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 13l3-4"/><path d="M9 3h6"/></svg>',
    render
  });
})();
