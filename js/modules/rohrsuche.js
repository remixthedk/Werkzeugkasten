// Modul: Rohrsuche. Rohr gemessen (Außen-Ø, Wandstärke) -> passende Rohre aus den hinterlegten Daten, oder Tabelle zum selbst Eingrenzen.
// Nur Stahlrohr (Gewinderohr, Siederohr nahtlos) und Verbundrohr. Kupfer, C-Stahl und Edelstahl sind genormt und stehen bei den Rohrmaßen.
// Daten: js/data/rohre.js (Rohre je System) und js/data/rohrsuche.js (Siederohr mit allen Wandstärken).
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Logik (ohne DOM, testbar) ----
  // Anzeigename je Verbund-System
  const NAMEN = { mehrschicht: 'Viega Raxofix / Sanfix Fosta', tigris: 'Wavin Tigris', teceflex: 'TECEflex', uponor: 'Uponor MLC / Uni Pipe PLUS', rautitan: 'Rehau Rautitan stabil', mepla: 'Geberit Mepla' };
  const rund = x => Math.round(x * 1000) / 1000;

  // Alle Rohre einer Art als Liste: { art, system, bez, ad, wand, di, dn, normal }
  function datensaetze(art) {
    const R = WK.data.rohre, Z = WK.data.rohrsuche;
    const liste = [];
    if (art === 'verbund') {
      for (const w of R.werkstoffe.filter(x => x.verbund)) {
        for (const r of w.rohre) liste.push({ art, system: NAMEN[w.id] || w.kurz, bez: r.bez, ad: r.ad, wand: r.wand, di: rund(r.ad - 2 * r.wand) });
      }
    } else if (art === 'stahl') {
      const g = R.werkstoffe.find(x => x.id === 'stahl');
      for (const r of g.rohre) liste.push({ art, system: 'Gewinderohr (DIN EN 10255)', bez: r.bez, ad: r.ad, wand: r.wand, di: rund(r.ad - 2 * r.wand), normal: true });
      for (const s of Z.siederohr) {
        for (const wand of s.waende) liste.push({ art, system: 'Siederohr nahtlos (DIN EN 10220)', bez: s.dn || '', ad: s.ad, wand, di: rund(s.ad - 2 * wand), dn: s.dn, normal: s.normal === wand });
      }
    }
    return liste;
  }
  const SYSTEME = art => [...new Set(datensaetze(art).map(r => r.system))];

  // Messgenauigkeit -> erlaubte Abweichung in mm
  const GENAUIGKEIT = { genau: { ad: 0.2, wand: 0.2 }, normal: { ad: 0.5, wand: 0.3 }, grob: { ad: 1, wand: 0.5 } };

  // Passende Rohre zu gemessenem Außen-Ø (und optional Wandstärke), die besten zuerst
  function suche({ art, ad, wand, genauigkeit }) {
    const tol = GENAUIGKEIT[genauigkeit || 'normal'];
    if (!tol || !(ad > 0)) return null;
    const hatWand = wand > 0;
    const treffer = [];
    for (const r of datensaetze(art)) {
      const dAd = Math.abs(r.ad - ad);
      if (dAd > tol.ad + 1e-9) continue;
      const dW = hatWand ? Math.abs(r.wand - wand) : 0;
      if (hatWand && dW > tol.wand + 1e-9) continue;
      treffer.push({ ...r, abstand: dAd + dW });
    }
    return treffer.sort((a, b) => a.abstand - b.abstand || a.ad - b.ad || a.wand - b.wand);
  }

  // Tabelle zum Eingrenzen: nach System und nach Außen-Ø +/- Spanne gefiltert, nach Außen-Ø und Wand sortiert
  function tabelle({ art, system, ad, spanne }) {
    let liste = datensaetze(art);
    if (system && system !== 'alle') liste = liste.filter(r => r.system === system);
    if (ad > 0 && spanne >= 0) liste = liste.filter(r => Math.abs(r.ad - ad) <= spanne + 1e-9);
    return liste.sort((a, b) => a.ad - b.ad || a.wand - b.wand || a.system.localeCompare(b.system));
  }
  WK.calc.rohrsuche = { datensaetze, systeme: SYSTEME, suche, tabelle, GENAUIGKEIT };

  // ---- Oberfläche ----
  const SVG = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const FRAGEN = [
    { id: 'stahl', frage: 'Welches Stahlrohr habe ich da?', stichwort: 'Stahlrohr erkennen', klein: 'Gewinderohr oder Siederohr, aus Außen-Ø und Wandstärke',
      icon: SVG('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5"/><path d="M12 4v3"/>') },
    { id: 'verbund', frage: 'Welches Verbundrohr habe ich da?', stichwort: 'Verbundrohr erkennen', klein: 'Kunststoffrohr mit Alu-Schicht: welcher Hersteller passt zu den Maßen',
      icon: SVG('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="4"/>') }
  ];
  const MAX = 60;

  function render() {
    const { h, ui, fmt } = WK;
    const root = h('div');

    function zeigeMenu() {
      root.replaceChildren(
        h('p', { class: 'lead' }, 'Was für ein Rohr ist es?'),
        h('div', { class: 'wahl' }, FRAGEN.map(q => h('button', { type: 'button', onclick: () => zeigeFrage(q.id) },
          h('span', { class: 'ico', html: q.icon }),
          h('span', {}, h('span', { class: 'tag' }, q.stichwort), h('strong', {}, q.frage), h('small', {}, q.klein))))),
        ui.note('Kupfer, C-Stahl (Prestabo, Mapress) und Edelstahl sind genormt und stehen bei den Rohrmaßen. Hier geht es um Rohre, die man nicht gleich erkennt.'));
    }

    // Kurze Tabellenzeile: Stahl = Rohrart, DN, Maße. Verbund = System (bei TECEflex mit Größenname), Maße.
    const KURZ = { 'Gewinderohr (DIN EN 10255)': 'Gewinderohr', 'Siederohr nahtlos (DIN EN 10220)': 'Siederohr', 'Viega Raxofix / Sanfix Fosta': 'Viega Raxofix, Sanfix', 'Uponor MLC / Uni Pipe PLUS': 'Uponor Uni Pipe', 'Rehau Rautitan stabil': 'Rehau Rautitan' };
    const z1 = x => x.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    const zeile = (r, art) => {
      const maße = [z1(r.ad), z1(r.wand) + (r.normal && r.system.startsWith('Siederohr') ? '*' : ''), z1(r.di)];
      if (art === 'stahl') return [KURZ[r.system] || r.system, r.dn || r.bez.split(' ')[0] + ' ' + (r.bez.split(' ')[1] || ''), ...maße];
      return [r.system === 'TECEflex' ? 'TECEflex ' + r.bez.split(' ')[0] : (KURZ[r.system] || r.system), ...maße];
    };
    const kopfFuer = art => art === 'stahl' ? ['Rohrart', 'DN', 'Außen', 'Wand', 'Innen'] : ['System', 'Außen', 'Wand', 'Innen'];
    const fuss = art => art === 'stahl' ? 'Maße in mm. Innen = Innendurchmesser. * = Normalwandstärke beim Siederohr.' : 'Maße in mm. Innen = Innendurchmesser, gerechnet aus Außen minus 2 × Wand.';

    function zeigeFrage(art) {
      const q = FRAGEN.find(x => x.id === art);
      const zurueck = h('button', { type: 'button', class: 'zurueck', onclick: zeigeMenu }, '‹ Andere Frage');
      const kopf = kopfFuer(art);

      // Tab 1: Messen
      const ad = ui.num('Außendurchmesser', { unit: 'mm', value: art === 'stahl' ? '60,3' : '20', hint: 'Mit dem Messschieber außen am Rohr messen, bei Verbundrohr ohne Dämmung.' });
      const wand = ui.num('Wandstärke (wenn bekannt)', { unit: 'mm', value: '', hint: 'An der Schnittkante messen. Leer lassen, wenn du sie nicht kennst.' });
      const gen = ui.select('Wie genau hast du gemessen?', [
        { value: 'genau', label: 'Sehr genau (Messschieber, ±0,2 mm)' },
        { value: 'normal', label: 'Normal (±0,5 mm)' },
        { value: 'grob', label: 'Grob (±1 mm)' }
      ], 'normal');
      const outM = h('div');
      function updateM() {
        const r = suche({ art, ad: ad.get(), wand: wand.get(), genauigkeit: gen.get() });
        if (!r) { outM.replaceChildren(ui.note('Außendurchmesser eingeben.', 'warn')); return; }
        if (!r.length) {
          outM.replaceChildren(ui.note('Kein hinterlegtes Rohr passt. Stell die Messgenauigkeit gröber ein, lass die Wandstärke weg oder schau in die Tabelle. Möglich ist auch, dass das Rohr nicht hinterlegt ist.', 'warn'));
          return;
        }
        const zeigen = r.slice(0, 15);
        outM.replaceChildren(...[
          ui.result([{ k: 'Treffer', v: String(r.length), big: true }]),
          ui.table(kopf, zeigen.map(x => zeile(x, art))),
          ui.note(fuss(art)),
          r.length > zeigen.length ? ui.note('Es werden die ' + zeigen.length + ' besten Treffer gezeigt. Gib die Wandstärke ein oder messe genauer, dann wird die Liste kürzer.') : null,
          ui.note('Das sind Vorschläge, kein Beweis. Auf dem Rohr steht meist der Hersteller oder das System aufgedruckt.')
        ].filter(Boolean));
      }
      ad.input.addEventListener('input', updateM); wand.input.addEventListener('input', updateM); gen.select.addEventListener('change', updateM);

      // Tab 2: Tabelle
      const sys = ui.select(art === 'stahl' ? 'Rohrart' : 'Hersteller und System', [{ value: 'alle', label: 'Alle' }, ...SYSTEME(art).map(s => ({ value: s, label: s }))], 'alle');
      const adT = ui.num('Außendurchmesser ungefähr (wenn bekannt)', { unit: 'mm', value: '', hint: 'Zum Beispiel 25 zeigt alles von 24 bis 26 mm. Leer lassen zeigt alle.' });
      const sp = ui.select('Spanne um diesen Wert', [
        { value: '0.5', label: '±0,5 mm' }, { value: '1', label: '±1 mm' }, { value: '2', label: '±2 mm' }, { value: '3', label: '±3 mm' }
      ], '1');
      const outT = h('div');
      function updateT() {
        const t = tabelle({ art, system: sys.get(), ad: adT.get(), spanne: Number(sp.get()) });
        if (!t.length) { outT.replaceChildren(ui.note('Nichts gefunden. Vergrößere die Spanne oder wähle „Alle“.', 'warn')); return; }
        const zeigen = t.slice(0, MAX);
        outT.replaceChildren(...[
          ui.result([{ k: 'Rohre in der Liste', v: String(t.length), big: true }]),
          ui.table(kopf, zeigen.map(x => zeile(x, art))),
          ui.note(fuss(art)),
          t.length > zeigen.length ? ui.note('Es werden die ersten ' + MAX + ' Zeilen gezeigt. Wähle ein System oder gib einen Außendurchmesser ein, dann wird die Liste kürzer.') : null
        ].filter(Boolean));
      }
      sys.select.addEventListener('change', updateT); adT.input.addEventListener('input', updateT); sp.select.addEventListener('change', updateT);

      const hinweis = art === 'verbund'
        ? ui.note('Hinterlegt sind Raxofix und Sanfix Fosta (Viega), Wavin Tigris und TECEflex mit allen Größen, bei Uponor, Rehau Rautitan stabil und Geberit Mepla nur einzelne Größen. Sanha und Prineto sind nicht hinterlegt.')
        : ui.note('Hinterlegt sind Gewinderohr (DN 6 bis 100) und Siederohr nahtlos bis DN 150, mit Zwischenmaßen. Geschweißte Stahlrohre haben bei gleichem Außen-Ø oft dünnere Wände und sind nicht hinterlegt.');
      const boxM = h('div', {}, ui.panel(null, ad.el, wand.el, gen.el), ui.panel(null, outM));
      const boxT = h('div', {}, ui.panel(null, sys.el, adT.el, sp.el), ui.panel(null, outT));
      boxT.hidden = true;
      const tabs = ui.tabs([{ value: 'messen', label: 'Messen' }, { value: 'tabelle', label: 'Tabelle' }], v => { boxM.hidden = v !== 'messen'; boxT.hidden = v !== 'tabelle'; });
      root.replaceChildren(zurueck, h('h2', { class: 'frage' }, q.frage), WK.ui.begriffe('rohrsuche/' + art), tabs.el, boxM, boxT, hinweis);
      updateM(); updateT();
      try { window.scrollTo(0, 0); } catch (e) { /* ohne Fenster egal */ }
    }

    zeigeMenu();
    return root;
  }

  WK.register({
    id: 'rohrsuche',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Du hast ein Rohr vor dir und weißt nicht, welches es ist. Hier misst du Außendurchmesser und Wandstärke, und die App zeigt, welche Stahl- oder Verbundrohre zu den Maßen passen. Oder du schaust in die Tabelle und grenzt selbst ein.',
      schritte: [
        'Tippe auf die Art des Rohrs: Stahlrohr oder Verbundrohr (Kunststoff mit Alu-Schicht, die man an der Schnittkante sieht).',
        'Messen: Außendurchmesser mit dem Messschieber messen und eintragen. Wenn du die Wandstärke an der Schnittkante messen kannst, trag sie auch ein, dann wird die Liste kürzer.',
        'Wähle, wie genau du gemessen hast. Die App lässt dann entsprechend viel Abweichung zu.',
        'Tabelle: Alle Rohre nach Außendurchmesser sortiert. Wähle ein System oder gib einen ungefähren Außendurchmesser ein.'
      ],
      beispiel: 'Stahlrohr mit 60,3 mm außen und 2,9 mm Wand: Siederohr nahtlos DN 50. Dasselbe Rohr mit 3,65 mm Wand ist ein Gewinderohr DN 50.',
      hinweis: 'Die Treffer sind Vorschläge. Gefunden wird nur, was in der App hinterlegt ist. Der Aufdruck auf dem Rohr nennt meist den Hersteller.'
    },
    quelle: [
      'Siederohr nahtlos, DIN EN 10220: Reihe der Außendurchmesser mit allen Wandstärken aus der Maße-und-Gewichte-Tabelle von rff. Die Wandstärken sind aus den Gewichten der Tabelle zurückgerechnet (kg/m = 0,02466 · s · (d − s)), die Außendurchmesser stimmen mit der Liste von Mannesmann überein. Normalwandstärke je Außen-Ø nach Sikla (Tabelle 17.2) und thyssenkrupp (nahtlose normalwandige Stahlrohre), beide übereinstimmend bis 168,3 mm. Bei 193,7 und 219,1 mm nennen sie verschiedene Normalwände, diese Größen sind nicht aufgenommen.',
      'Nennweiten (DN) nur dort, wo eine Quelle sie zuordnet (21,3 bis 168,3 mm in den elf Normalgrößen). Gewinderohr DIN EN 10255 wie im Modul Rohrmaße.',
      'Verbundrohr: Wavin Tigris nach Technischem Handbuch und Sortimentsübersicht von Wavin, TECEflex nach den Technischen Informationen von TECE (Ausgaben 2017 und 2024, gleicher Hersteller). Viega Raxofix wie im Modul Rohrmaße, das Viega-Rohr Sanfix Fosta hat laut Gebrauchsanleitung dieselben Maße. Uponor 16 x 2,0 und 20 x 2,25 (Herstellerangabe und Händlerangabe), Rehau Rautitan stabil 16,2 x 2,6 und 25 x 3,7 (zwei Quellen), Geberit Mepla 20 x 2,5 (zwei Händler).',
      'Nicht hinterlegt: geschweißte Stahlrohre nach EN 10220 (nur eine Quelle), Größen von Uponor, Rehau und Mepla mit nur einer Quelle, Sanha und Prineto (keine Maße gefunden). Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand.'
    ],
    stichworte: 'rohrsuche rohr erkennen messen messschieber außendurchmesser wandstärke siederohr gewinderohr stahlrohr verbundrohr hersteller welches rohr unbekannt tigris teceflex uponor rautitan mepla raxofix sanfix',
    title: 'Rohrsuche',
    desc: 'Rohr messen und erkennen: Stahl und Verbundrohr',
    icon: SVG('<circle cx="10" cy="10" r="6"/><path d="M15 15l5 5"/>'),
    render
  });
})();
