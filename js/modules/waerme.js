// Modul: Wärme & Wasser. Daten: js/data/stoffwerte.js
// Startseite des Moduls: "Was willst du wissen?" mit großen Auswahlzeilen, danach nur die nötigen Felder.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Wert aus der Wassertabelle, zwischen den Stützstellen linear. Nur 0 bis 100 °C (flüssig).
  function wasserWert(spalte, t) {
    const W = WK.data.stoffwerte.wasser;
    if (!(t >= 0 && t <= 100)) return null;
    let i = Math.min(Math.floor(t / 10), W.t.length - 2);
    const f = (t - W.t[i]) / (W.t[i + 1] - W.t[i]);
    return W[spalte][i] + f * (W[spalte][i + 1] - W[spalte][i]);
  }
  const rhoWasser = t => wasserWert('rho', t);
  const cWasser = t => wasserWert('cp', t);

  // Mittlere spezifische Wärmekapazität zwischen zwei Temperaturen (Fläche unter der Tabellenlinie / Temperaturunterschied)
  function cMittel(t1, t2) {
    const a = Math.min(t1, t2), b = Math.max(t1, t2);
    if (!(a >= 0 && b <= 100 && b > a)) return null;
    const W = WK.data.stoffwerte.wasser;
    let summe = 0;
    for (let i = 0; i < W.t.length - 1; i++) {
      const x0 = Math.max(a, W.t[i]), x1 = Math.min(b, W.t[i + 1]);
      if (x1 > x0) summe += (cWasser(x0) + cWasser(x1)) / 2 * (x1 - x0);
    }
    return summe / (b - a);
  }

  // menge in kg oder Litern (Liter gelten bei der Starttemperatur t1). Ergebnis: Energie, die zum Erwärmen nötig ist
  // (negativ, wenn abgekühlt wird)
  function energie({ menge, einheit, t1, t2 }) {
    if (!(menge > 0) || !Number.isFinite(t1) || !Number.isFinite(t2)) return null;
    const c = cMittel(t1, t2);
    if (c == null) return null;
    const masse = einheit === 'l' ? menge * rhoWasser(t1) / 1000 : menge;
    const kJ = masse * c * (t2 - t1);
    return { masse, c, kJ, kWh: kJ / 3600, abkuehlen: t2 < t1 };
  }

  // Zeit in Minuten für eine Energie (kWh) bei einer Leistung (kW), ohne Verluste
  function zeit({ kWh, kW }) {
    if (!(kWh >= 0) || !(kW > 0)) return null;
    const min = Math.abs(kWh) / kW * 60;
    let h = Math.floor(min / 60), m = Math.round(min - h * 60);
    if (m === 60) { h += 1; m = 0; }
    return { minuten: min, h, m };
  }

  // Gewicht von Wasser bei einer Temperatur
  function gewicht({ liter, t }) {
    if (!(liter > 0)) return null;
    const rho = rhoWasser(t);
    if (rho == null) return null;
    return { kg: liter * rho / 1000, rho };
  }

  // Wasser aus der Verbrennung von Erdgas (theoretischer Höchstwert)
  function gasWasser({ m3 }) {
    if (!(m3 > 0)) return null;
    return { liter: m3 * WK.data.stoffwerte.gasWasserLiter };
  }
  WK.calc.waerme = { rhoWasser, cWasser, cMittel, energie, zeit, gewicht, gasWasser };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const FRAGEN = [
    { id: 'erwaermen', titel: 'Wasser erwärmen', frage: 'Wie viel Energie brauche ich, um Wasser zu erwärmen?', klein: 'Zum Beispiel von 60 auf 80 °C',
      icon: SVG('<path d="M12 3c3.5 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11z"/><path d="M12 12v5M9.5 14.5h5"/>') },
    { id: 'zeit', titel: 'Aufheizzeit', frage: 'Wie lange dauert das Aufheizen mit meiner Heizleistung?', klein: 'Mit der Leistung in kW',
      icon: SVG('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/>') },
    { id: 'gewicht', titel: 'Gewicht von Wasser', frage: 'Wie schwer ist mein Wasser?', klein: 'Warmes Wasser ist leichter als kaltes',
      icon: SVG('<path d="M6 8h12l2 12H4z"/><circle cx="12" cy="5" r="2"/>') },
    { id: 'fluss', titel: 'Volumenstrom', frage: 'Wie viel Wasser muss durch meine Heizung fließen?', klein: 'Volumenstrom aus Leistung und Spreizung',
      icon: SVG('<path d="M3 9h12M12 5l4 4-4 4"/><path d="M21 15H9M12 11l-4 4 4 4"/>') },
    { id: 'gas', titel: 'Wasser aus Gas', frage: 'Wie viel Wasser entsteht, wenn Gas verbrennt?', klein: 'Pro m³ Erdgas',
      icon: SVG('<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.2 1 2 2 2 0-3-1-5 1-8z"/>') },
    { id: 'stoffe', titel: 'Stoffwerte nachschlagen', frage: 'Welche Werte haben Wasser, Luft, Kupfer und Stahl?', klein: 'Wärmekapazität und Dichte zum Nachschlagen',
      icon: SVG('<path d="M5 4h14v16H5zM5 9h14M5 14h14M10 4v16"/>') }
  ];

  function render() {
    const { h, ui, fmt } = WK;
    const D = WK.data.stoffwerte;
    // Eingaben merken, damit die Temperatur beim Wechsel zwischen den Fragen erhalten bleibt
    const S = { menge: '100', einheit: 'kg', t1: '60', t2: '80', kw: '', liter: '500', tg: '60', m3: '' };
    const root = h('div');

    const feld = (label, key, o = {}) => {
      const f = ui.num(label, { value: S[key], ...o });
      return { f, bind: fn => f.input.addEventListener('input', () => { S[key] = f.input.value; fn(); }) };
    };
    const kommaZahl = n => String(n).replace('.', ',');

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
      const begriffe = WK.ui.begriffe('waerme/' + id);
      if (id === 'fluss') {   // das Modul "Leistung & Volumenstrom" steckt hier als Frage
        const vs = WK.modules.find(m => m.id === 'volumenstrom');
        root.replaceChildren(...[zurueck, h('h2', { class: 'frage' }, q.frage), begriffe, vs ? vs.render() : null].filter(Boolean));
        return;
      }

      if (id === 'erwaermen' || id === 'zeit') {
        const menge = feld('Wassermenge', 'menge');
        const einheit = ui.select('Einheit der Menge', [{ value: 'kg', label: 'Kilogramm (kg)' }, { value: 'l', label: 'Liter (l), gemessen bei der Starttemperatur' }], S.einheit);
        const t1 = feld('Von', 't1', { unit: '°C' });
        const t2 = feld('Auf', 't2', { unit: '°C' });
        const kw = id === 'zeit' ? feld('Heizleistung', 'kw', { unit: 'kW', placeholder: 'z. B. 6' }) : null;
        felder = [menge.f.el, einheit.el, t1.f.el, t2.f.el, ...(kw ? [kw.f.el] : [])];
        update = () => {
          const r = energie({ menge: menge.f.get(), einheit: einheit.get(), t1: t1.f.get(), t2: t2.f.get() });
          if (!r) {
            out.replaceChildren(ui.note(Number.isFinite(t1.f.get()) && Number.isFinite(t2.f.get()) && (t1.f.get() < 0 || t1.f.get() > 100 || t2.f.get() < 0 || t2.f.get() > 100)
              ? 'Temperaturen zwischen 0 und 100 °C eingeben (Wasser flüssig).' : 'Menge und beide Temperaturen eingeben (Temperaturen verschieden).', 'warn'));
            return;
          }
          const e = Math.abs(r.kWh);
          const rechnung = fmt(r.masse, 1) + ' kg × ' + fmt(r.c, 3) + ' kJ/(kg·K) × ' + fmt(Math.abs(t2.f.get() - t1.f.get()), 1) + ' K = ' + fmt(Math.abs(r.kJ), 0) + ' kJ = ' + fmt(e, 2) + ' kWh';
          const rows = [];
          if (id === 'zeit') {
            const z = zeit({ kWh: e, kW: kw.f.get() });
            if (z) rows.push({ k: 'Aufheizzeit', v: (z.h ? z.h + ' h ' : '') + z.m + ' min', big: true });
            rows.push({ k: r.abkuehlen ? 'Energie (frei werdend)' : 'Energie', v: fmt(e, 2) + ' kWh' });
            if (!z) rows.unshift({ k: 'Aufheizzeit', v: 'Heizleistung fehlt' });
          } else {
            rows.push({ k: r.abkuehlen ? 'Frei werdende Energie' : 'Energie', v: fmt(e, 2) + ' kWh', big: true });
            rows.push({ k: 'in kJ', v: fmt(Math.abs(r.kJ), 0) + ' kJ' });
          }
          if (einheit.get() === 'l') rows.push({ k: 'Gewicht der Menge', v: fmt(r.masse, 1) + ' kg' });
          out.replaceChildren(ui.result(rows), ui.note('Rechnung: ' + rechnung),
            ui.note('Ohne Verluste und Wirkungsgrad. Die Wärmekapazität ist der Mittelwert zwischen den beiden Temperaturen.'));
        };
        menge.bind(update); t1.bind(update); t2.bind(update); if (kw) kw.bind(update);
        einheit.select.addEventListener('change', () => { S.einheit = einheit.get(); update(); });
      } else if (id === 'gewicht') {
        const liter = feld('Wassermenge', 'liter', { unit: 'l' });
        const t = feld('Temperatur des Wassers', 'tg', { unit: '°C' });
        felder = [liter.f.el, t.f.el];
        update = () => {
          const r = gewicht({ liter: liter.f.get(), t: t.f.get() });
          if (!r) { out.replaceChildren(ui.note('Menge und Temperatur (0 bis 100 °C) eingeben.', 'warn')); return; }
          out.replaceChildren(ui.result([
            { k: 'Gewicht', v: fmt(r.kg, 1) + ' kg', big: true },
            { k: 'Dichte', v: fmt(r.rho, 1) + ' kg/m³' }
          ]), ui.note('Warmes Wasser ist leichter: 1 Liter wiegt bei 10 °C 0,9997 kg, bei 60 °C 0,9832 kg und bei 80 °C 0,9718 kg.'));
        };
        liter.bind(update); t.bind(update);
      } else if (id === 'gas') {
        const m3 = feld('Erdgasverbrauch', 'm3', { unit: 'm³', placeholder: 'z. B. 100' });
        felder = [m3.f.el];
        update = () => {
          const r = gasWasser({ m3: m3.f.get() });
          if (!r) { out.replaceChildren(ui.note('Gasmenge in m³ eingeben.')); return; }
          out.replaceChildren(ui.result([
            { k: 'Wasser, höchstens', v: fmt(r.liter, 1) + ' l', big: true },
            { k: 'Je m³ Erdgas', v: 'ca. ' + kommaZahl(D.gasWasserLiter) + ' l' }
          ]), ui.note('Theoretischer Höchstwert für Erdgas im Normzustand. Im Brennwertkessel kondensiert davon nur ein Teil, je nach Rücklauftemperatur.'));
        };
        m3.bind(update);
      }

      if (id === 'stoffe') {
        const W = D.wasser;
        const wasser = ui.table(['°C', 'Dichte kg/m³', 'c kJ/(kg·K)', 'c Wh/(kg·K)'],
          W.t.map((t, i) => [t, fmt(W.rho[i], 1), fmt(W.cp[i], 3), fmt(W.cp[i] / 3.6, 3)]));
        const sonst = ui.table(['Stoff', 'c kJ/(kg·K)', 'c Wh/(kg·K)'], [
          ['Luft (trocken)', fmt(D.luft.cp, 3), fmt(D.luft.cp / 3.6, 3)],
          ...D.werkstoffe.map(w => [w.name, fmt(w.c, 2), fmt(w.c / 3.6, 3)])
        ]);
        root.replaceChildren(...[zurueck, begriffe].filter(Boolean),
          ui.panel('Wasser (flüssig)', wasser, ui.note('c = spezifische Wärmekapazität. Faustwert: 1,163 Wh/(kg·K), also etwa 1,16 Wh je kg und Kelvin.')),
          ui.panel('Luft, Kupfer, Stahl', sonst,
            ui.result([
              { k: 'Dichte Luft bei 20 °C', v: fmt(D.luft.rho20, 3) + ' kg/m³' },
              { k: 'Luft je m³', v: fmt(D.luft.rho20 * D.luft.cp / 3.6, 3) + ' Wh/(m³·K)' }
            ]),
            ui.note('Kupfer und Stahl sind Richtwerte, je Legierung weichen sie leicht ab.')));
        return;
      }

      root.replaceChildren(...[zurueck, begriffe, ui.panel(q.titel, h('p', { class: 'lead' }, q.frage), ...felder),
        ui.panel('Ergebnis', out)].filter(Boolean));
      update();
    }

    zeigeMenu();
    return root;
  }

  WK.register({
    id: 'waerme',
    bereich: 'heizung',
    hilfe: {
      wofuer: 'Fragen rund um Wasser und Wärme: wie viel Energie das Aufheizen braucht, wie lange es dauert, wie schwer das Wasser ist, wie viel Wasser durch die Heizung fließen muss und wie viel Wasser beim Verbrennen von Gas entsteht. Dazu eine Tabelle mit Stoffwerten zum Nachschlagen.',
      schritte: [
        'Oben tippst du auf die Frage, die du beantwortet haben willst.',
        'Du siehst nur die Felder, die dafür nötig sind. Die Temperaturen bleiben beim Wechsel zwischen den Fragen erhalten.',
        'Das Ergebnis steht groß darunter, mit der Rechnung in einer Zeile.',
        'Mit "Andere Frage" kommst du zurück zur Auswahl.'
      ],
      beispiel: '100 kg Wasser von 60 auf 80 °C erwärmen: etwa 2,33 kWh. Mit 6 kW Heizleistung dauert das rund 23 Minuten.',
      hinweis: 'Gerechnet wird ohne Verluste und ohne Wirkungsgrad. Tatsächlich brauchst du etwas mehr Energie und Zeit.'
    },
    quelle: [
      'Dichte von Wasser (0 bis 100 °C): engineeringtoolbox.com. Gegenprobe chemie.de (Stoffdaten Wasser), die Werte stimmen bis auf 0,05 kg/m³ überein.',
      'Spezifische Wärmekapazität von Wasser: IAPWS-95-Tabelle (chem-casts.com). Gegenprobe chemie.de, Abweichung höchstens 0,25 % bei 0 °C, sonst unter 0,1 %. Gerechnet wird mit dem Mittelwert zwischen Start- und Zieltemperatur. Umrechnung: 1 Wh = 3,6 kJ.',
      'Luft: c = 1,005 kJ/(kg·K) (ISB-Tabellenwerte, chemie.de, Wikibooks). Dichte 1,204 kg/m³ bei 20 °C (chemie.de), mit der Gasgleichung gegengerechnet.',
      'Kupfer 0,38 und Stahl 0,47 kJ/(kg·K): chemie.de und Wikibooks (Kupfer 0,381, Stahl 0,477 bzw. 0,47), ISB 0,382 für Kupfer.',
      'Wasser aus Erdgas: etwa 1,6 l je m³ im Normzustand, aus der Verbrennungsgleichung (CH₄ + 2 O₂ → CO₂ + 2 H₂O) gerechnet und bestätigt durch den SBZ-Artikel mit 1,63 l.',
      'Nicht enthalten: Verdampfungs- und Schmelzwärme (die Quellen weichen ab), Edelstahl, Wärmeleitfähigkeit, Dichte von Stahl und Kupfer, Glykol-Gemische und Dämmstoffe (Werte hängen vom Produkt ab, nur aus dem Datenblatt).'
    ],
    stichworte: 'volumenstrom spreizung l/h durchfluss leistung heizkreis wärmekapazität spezifische wärme dichte gewicht wasser kondensat verbrennung aufheizen erwärmen energie kwh liter kg wärmemenge speicher luft kupfer stahl brennwert abgas',
    title: 'Wärme & Wasser',
    desc: 'Wasser erwärmen, Volumenstrom, Gewicht, Stoffwerte, Gas',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3.5 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11z"/><path d="M9 14a3 3 0 0 0 3 3"/></svg>',
    render
  });
})();
