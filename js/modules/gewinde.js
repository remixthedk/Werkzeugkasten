// Modul: Gewinde erkennen. Gemessenen Durchmesser (und optional die Gänge je Zoll) -> Zoll-Größe und DN des Rohrgewindes.
// Nur Rohrgewinde G, Rp, R (Whitworth 55°). Metrische und amerikanische Gewinde (NPT) sind nicht enthalten.
// Daten: js/data/gewinde.js (Gewindemaße), js/data/rohre.js (Außen-Ø des Gewinderohrs zur DN)
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Logik (ohne DOM, testbar) ----
  const steigung = g => WK.data.gewinde.zollMm / g.gaenge;
  // Außen-Ø des Gewinderohrs (DIN EN 10255) zur Nennweite, falls hinterlegt
  function rohrAd(dn) {
    if (!dn) return null;
    const st = WK.data.rohre.werkstoffe.find(w => w.id === 'stahl');
    const r = st && st.rohre.find(x => x.bez.startsWith('DN ' + dn + ' ('));
    return r ? r.ad : null;
  }
  // Erlaubte Abweichung in mm
  const GENAUIGKEIT = { genau: 0.5, grob: 1.5 };

  // mass: gemessener Durchmesser in mm.
  // wo: 'gross' (größtes Maß: Außengewinde über die Spitzen, Innengewinde im Gewindegrund), 'klein' (kleinstes Maß: Innengewinde zwischen den Spitzen,
  //     Außengewinde im Gewindegrund) oder 'egal' (beides prüfen).
  // gaenge: gezählte Gänge auf 25,4 mm (optional). Erlaubt sind +/- 1 Gang.
  // Ergebnis: { treffer: [{ g, an: 'ad'|'kern', abstand }], naechste: g, ohneGaenge: Anzahl Treffer ohne Gängeprüfung }
  function suche({ mass, wo = 'egal', gaenge, genauigkeit = 'grob' }) {
    const tol = GENAUIGKEIT[genauigkeit];
    if (!(mass > 0) || !tol) return null;
    const alle = [];
    for (const g of WK.data.gewinde.groessen) {
      const kand = [];
      if (wo !== 'klein') kand.push({ an: 'ad', abstand: Math.abs(mass - g.ad) });
      if (wo !== 'gross') kand.push({ an: 'kern', abstand: Math.abs(mass - g.kern) });
      kand.sort((a, b) => a.abstand - b.abstand);
      alle.push({ g, an: kand[0].an, abstand: kand[0].abstand });
    }
    const imMass = alle.filter(x => x.abstand <= tol).sort((a, b) => a.abstand - b.abstand);
    const hatGaenge = Number.isFinite(gaenge) && gaenge > 0;
    const treffer = hatGaenge ? imMass.filter(x => Math.abs(x.g.gaenge - gaenge) <= 1) : imMass;
    const naechste = alle.slice().sort((a, b) => a.abstand - b.abstand)[0];
    return { treffer, naechste, ohneGaenge: hatGaenge ? imMass.length : treffer.length };
  }
  WK.calc.gewinde = { suche, steigung, rohrAd, GENAUIGKEIT };

  // ---- Oberfläche ----
  function render() {
    const { h, ui, fmt } = WK;
    const D = WK.data.gewinde;
    const mm = (n, d = 2) => fmt(n, d) + ' mm';
    const dn = g => (g.dn ? 'DN ' + g.dn : '–');

    const mass = ui.num('Gemessener Durchmesser', { unit: 'mm', value: '75' });
    const wo = ui.select('Wo genau hast du gemessen?', [
      { value: 'egal', label: 'Weiß ich nicht oder grob gemessen' },
      { value: 'aussen', label: 'Außengewinde: außen über die Gewindespitzen' },
      { value: 'innen-spitzen', label: 'Innengewinde: innen zwischen den Gewindespitzen (enge Stelle)' },
      { value: 'innen-grund', label: 'Innengewinde: innen von Gewindegrund zu Gewindegrund (weite Stelle)' },
      { value: 'aussen-grund', label: 'Außengewinde: außen im Gewindegrund' }
    ], 'egal');
    const WO = { egal: 'egal', aussen: 'gross', 'innen-grund': 'gross', 'innen-spitzen': 'klein', 'aussen-grund': 'klein' };
    const gaenge = ui.num('Gewindegänge auf 25,4 mm (optional)', { value: '', hint: 'Gänge auf einem Zoll Länge zählen. Rohrgewinde hat 28, 19, 14 oder 11 Gänge' });
    const gen = ui.select('Wie genau hast du gemessen?', [
      { value: 'grob', label: 'Grob, Maßband (± 1,5 mm)' },
      { value: 'genau', label: 'Genau, Messschieber (± 0,5 mm)' }
    ], 'grob');
    const out = h('div');

    function update() {
      const r = suche({ mass: mass.get(), wo: WO[wo.get()], gaenge: gaenge.input.value.trim() === '' ? NaN : gaenge.get(), genauigkeit: gen.get() });
      if (!r) { out.replaceChildren(ui.note('Durchmesser in mm eingeben.', 'warn')); return; }
      if (!r.treffer.length) {
        const n = r.naechste;
        const gaengeSchuld = r.ohneGaenge > 0;
        out.replaceChildren(ui.note(gaengeSchuld
          ? 'Der Durchmesser passt, aber nicht zur Gängezahl. Zähle noch einmal auf 25,4 mm nach. Mit ' + fmt(gaenge.get(), 0) + ' Gängen je Zoll ist es kein Rohrgewinde (G, Rp, R). Dann ist es vielleicht ein metrisches Gewinde.'
          : 'Kein Rohrgewinde passt zu ' + mm(mass.get(), 1) + '. Am nächsten kommt ' + n.g.zoll + ' Zoll (Außen-Ø ' + mm(n.g.ad) + ', Kern-Ø ' + mm(n.g.kern) + '). Misst du genau, wähle „Messschieber“ oder prüfe, ob es ein metrisches Gewinde ist.', 'warn'));
        return;
      }
      const b = r.treffer[0], g = b.g, ra = rohrAd(g.dn);
      const zeilen = [
        { k: 'Gewinde', v: g.zoll + ' Zoll', big: true },
        { k: 'Nennweite Gewinderohr', v: dn(g) },
        ...(ra ? [{ k: 'Außen-Ø des Rohrs', v: mm(ra, 1) }] : []),
        { k: 'Gewinde-Außen-Ø', v: mm(g.ad) },
        { k: 'Kern-Ø', v: mm(g.kern) },
        { k: 'Gänge je Zoll', v: g.gaenge + ' (Steigung ' + mm(steigung(g)) + ')' },
        { k: 'Abstand zum Messwert', v: mm(b.abstand) + (WO[wo.get()] === 'egal' ? (b.an === 'ad' ? ' (zum Außen-Ø)' : ' (zum Kern-Ø)') : '') }
      ];
      const kids = [ui.result(zeilen)];
      if (r.treffer.length > 1) {
        kids.push(h('h3', {}, 'Weitere mögliche Größen'));
        kids.push(ui.table(['Zoll', 'DN', 'Außen-Ø', 'Kern-Ø', 'Gänge'], r.treffer.slice(1).map(x => [x.g.zoll, dn(x.g), fmt(x.g.ad, 2), fmt(x.g.kern, 2), String(x.g.gaenge)])));
        kids.push(ui.note('Es passen mehrere Größen. Zähle die Gewindegänge auf 25,4 mm, dann ist meist nur noch eine übrig. Wenn die Gänge nicht reichen, miss genauer.'));
      } else if (r.ohneGaenge > 1) {
        kids.push(ui.note('Ohne die Gängezahl würden noch weitere Größen passen. Mit ' + fmt(gaenge.get(), 0) + ' Gängen je Zoll bleibt nur diese.'));
      }
      kids.push(ui.note('Gilt für die Rohrgewinde G, Rp und R (Whitworth 55°). Ob zylindrisch oder kegelig, sagt das Maß nicht. Kegelige Außengewinde (R) sind am Rohrende etwas dünner und werden nach hinten dicker, das Maß gilt an der Bezugsebene. Metrische und amerikanische Gewinde (NPT) sind nicht enthalten.'));
      out.replaceChildren(...kids);
    }
    for (const f of [mass, gaenge]) f.input.addEventListener('input', update);
    for (const s of [wo, gen]) s.select.addEventListener('change', update);

    const tab = ui.table(['Zoll', 'DN', 'Außen-Ø', 'Kern-Ø', 'Gänge'], D.groessen.map(g => [g.zoll, dn(g), fmt(g.ad, 2), fmt(g.kern, 2), String(g.gaenge)]));
    const boxS = h('div', {}, ui.panel(null, mass.el, wo.el, ui.note('Tipp: Misst du ein Innengewinde mit dem Messschieber von innen, berühren die Backen die Gewindespitzen. Du bekommst dann das kleinste Maß (enge Stelle). Das größte Maß findest du nur im Gewindegrund.'), gaenge.el, gen.el), ui.panel('Ergebnis', out));
    const boxT = h('div', {}, ui.panel('Rohrgewinde (G, Rp, R)', tab,
      ui.note('Maße in mm. Außen-Ø = größter Durchmesser des Gewindes, Kern-Ø = kleinster. Gänge je Zoll (25,4 mm). Die DN gilt für das Gewinderohr (DIN EN 10255), bei 3 1/2 Zoll gibt es keine genormte DN.')));
    boxT.hidden = true;
    const tabs = ui.tabs([{ value: 's', label: 'Gewinde erkennen' }, { value: 't', label: 'Tabelle' }], v => { boxS.hidden = v !== 's'; boxT.hidden = v !== 't'; });
    update();
    return h('div', {}, tabs.el, boxS, boxT);
  }

  WK.register({
    id: 'gewinde',
    bereich: 'rohr',
    versteckt: true,   // steckt als Frage in "Rohr & Gewinde erkennen" (Rohrsuche), die Seite #/gewinde geht weiter
    frage: 'Welche Größe hat mein Rohrgewinde?',
    hilfe: {
      wofuer: 'Du hast ein Gewinde gemessen und willst wissen, wie groß es in Zoll ist und zu welcher Nennweite (DN) es gehört. Gilt für die üblichen Rohrgewinde bei Gewinderohr, Fittings, Armaturen und Flanschen mit Gewinde.',
      schritte: [
        'Miss den Durchmesser des Gewindes mit Messschieber oder Maßband und trag ihn in mm ein. Außengewinde: außen über die Spitzen. Innengewinde: quer durch die Öffnung.',
        'Sag genau, wo du gemessen hast: außen über die Spitzen, innen zwischen den Spitzen oder im Gewindegrund. Weißt du es nicht, lass „Weiß ich nicht“ stehen. Die App prüft dann beides.',
        'Zähle, wenn du kannst, die Gewindegänge auf 25,4 mm und trag sie ein. Damit werden knappe Fälle eindeutig.',
        'Das Ergebnis zeigt Zoll, DN, die Maße des Gewindes und wie weit dein Messwert davon entfernt ist.'
      ],
      beispiel: 'Innengewinde etwa 75 mm: 2 1/2 Zoll, DN 65, Gewinde-Außen-Ø 75,18 mm, 11 Gänge je Zoll.',
      hinweis: 'Nur Rohrgewinde (G, Rp, R). Bei metrischen oder amerikanischen Gewinden (NPT) passt die Zahl der Gänge nicht, die App sagt es dir dann.'
    },
    quelle: [
      'Gewinde-Außendurchmesser und Gänge je Zoll der Rohrgewinde 1/8 bis 4 Zoll: REMS Gewindetabellen (R und G) und Pressol (DIN/ISO 228) stimmen überein, 3 1/2 Zoll zusätzlich in engineeringtoolbox.com. Kerndurchmesser: Pressol (ISO 228), im Test über Kern-Ø = Außen-Ø − 2 · 0,640327 · Steigung gegengeprüft. Engineeringtoolbox nennt abweichende Kerndurchmesser, sie werden nicht verwendet.',
      'Nennweite (DN) und Außen-Ø des Gewinderohrs: aus den hinterlegten Rohrdaten (DIN EN 10255).',
      'Nicht enthalten: 5 und 6 Zoll (nur in einer Quelle), seltene Zwischengrößen wie 5/8, 7/8, 1 1/8, 1 3/8, 1 3/4, 2 1/4 und 2 3/4 Zoll, metrische und amerikanische Gewinde (NPT), Unterscheidung zylindrisch und kegelig.'
    ],
    stichworte: 'gewinde rohrgewinde zoll dn nennweite innengewinde außengewinde aussengewinde muffe nippel whitworth bsp g rp r gänge steigung durchmesser messen erkennen',
    title: 'Gewinde erkennen',
    desc: 'Rohrgewinde messen: Zoll und DN',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8M8 8h8M8 12h8M8 16h8M8 20h8"/><path d="M6 3v18M18 3v18"/></svg>',
    render
  });
})();
