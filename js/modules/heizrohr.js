// Modul: Welches Rohr brauche ich für meine Heizleistung? (kW + Spreizung -> Wassermenge -> Geschwindigkeit und Druckgefälle je Rohrgröße)
// Rechnet mit den Modulen Leistung & Volumenstrom (WK.calc.volumenstrom) und Rohr-Check (WK.calc.druckverlust). Daten: js/data/rohre.js
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Rechenlogik (ohne DOM, testbar) ----
  // Innen-Ø in mm, bei dem das Wasser genau mit vMs (m/s) strömt: d = √(4 · V̇ ÷ (π · v))
  function minInnenMm({ lh, vMs }) {
    if (!(lh > 0) || !(vMs > 0)) return null;
    const q = lh / 1000 / 3600;                  // m³/s
    return Math.sqrt(4 * q / (Math.PI * vMs)) * 1000;
  }
  // Heizungswasser 60 °C. eintraege: [{ bez, idMm }], rauheit: 'glatt' | 'kunststoff'
  // Ergebnis: Wassermenge und je Größe Geschwindigkeit (m/s) und Druckgefälle (Pa/m)
  function tabelle({ kw, k, eintraege, rauheit }) {
    const lh = WK.calc.volumenstrom.volumenstrom({ kw, k });
    if (lh == null) return null;
    const zeilen = [];
    for (const e of eintraege) {
      const r = WK.calc.druckverlust.reibung({ idMm: e.idMm, lMin: lh / 60, temp: 60, rauheit });
      if (r) zeilen.push({ bez: e.bez, idMm: e.idMm, v: r.v, rPa: r.rMbar * 100, uebergang: r.uebergang });
    }
    return { lh, lMin: lh / 60, zeilen };
  }
  // Kleinste Größe (Liste aufsteigend), bei der die Geschwindigkeit höchstens vMs beträgt
  function kleinste(zeilen, vMs) {
    if (!(vMs > 0)) return null;
    return zeilen.filter(z => z.v <= vMs).sort((a, b) => a.idMm - b.idMm)[0] || null;
  }
  WK.calc.heizrohr = { minInnenMm, tabelle, kleinste };

  // ---- Oberfläche ----
  // Übliche Wandstärken Kupferrohr (EN 1057) für Heizung und Sanitär, Außen-Ø -> Wand in mm
  const KUPFER_WAND = { 15: 1, 18: 1, 22: 1, 28: 1.5, 35: 1.5, 42: 1.5, 54: 2 };

  function render() {
    const { h, ui, fmt } = WK;
    const R = WK.data.rohre;
    const kw = ui.num('Heizleistung', { unit: 'kW', value: '20', hint: 'Die Leistung, die durch dieses Rohr fließen soll' });
    const k = ui.num('Spreizung', { unit: 'K', value: '20', hint: 'Vorlauf minus Rücklauf, zum Beispiel 55 − 35 = 20' });
    const mat = ui.select('Rohrmaterial', [
      { value: 'mehrschicht', label: 'Mehrschicht (Viega Raxofix)' },
      { value: 'kupfer', label: 'Kupferrohr (Profipress)' },
      { value: 'manuell', label: 'Innendurchmesser selbst eingeben' }
    ], 'mehrschicht');
    const id = ui.num('Innendurchmesser Rohr', { unit: 'mm', value: '20', hint: 'Das Maß innen im Rohr' });
    const art = ui.select('Rohrart', [
      { value: 'kunststoff', label: 'Kunststoff oder Verbundrohr' },
      { value: 'glatt', label: 'Kupfer oder Edelstahl' }
    ], 'glatt');
    const ziel = ui.num('Gewünschte Geschwindigkeit', { unit: 'm/s', value: '0,5', hint: 'Höchstens so schnell soll das Wasser sein. 0,5 ist ein Faustwert, siehe Hinweis unten.' });
    const out = h('div');

    function eintraege() {
      const m = mat.get();
      if (m === 'manuell') return { liste: [{ bez: 'Dein Rohr', idMm: id.get() }], rauheit: art.get(), name: null };
      const w = R.werkstoffe.find(x => x.id === m);
      // Kupfer: übliche Wandstärke je Größe (Sikla-Rohrtabelle). Größe 12 fehlt, dafür liegt keine bestätigte Wandstärke vor.
      const liste = m === 'kupfer'
        ? w.rohre.filter(r => KUPFER_WAND[r.ad]).map(r => ({ bez: r.bez + ' × ' + String(KUPFER_WAND[r.ad]).replace('.', ','), idMm: r.ad - 2 * KUPFER_WAND[r.ad] }))
        : w.rohre.map(r => ({ bez: r.bez, idMm: r.ad - 2 * r.wand }));
      return { liste, rauheit: m === 'mehrschicht' ? 'kunststoff' : 'glatt', name: w.kurz };
    }

    function update() {
      const m = mat.get();
      id.el.hidden = m !== 'manuell';
      art.el.hidden = m !== 'manuell';
      const e = eintraege();
      const t = tabelle({ kw: kw.get(), k: k.get(), eintraege: e.liste, rauheit: e.rauheit });
      if (!t || !t.zeilen.length) { out.replaceChildren(ui.note('Heizleistung, Spreizung' + (m === 'manuell' ? ' und Innendurchmesser' : '') + ' eingeben.', 'warn')); return; }
      const rows = [
        { k: 'Wassermenge', v: fmt(t.lh, 0) + ' l/h', big: true },
        { k: 'je Minute', v: fmt(t.lMin, 1) + ' l/min' }
      ];
      const vz = ziel.get();
      const dMin = minInnenMm({ lh: t.lh, vMs: vz });
      if (dMin != null) rows.push({ k: 'Innen-Ø für ' + fmt(vz, 2) + ' m/s', v: fmt(dMin, 1) + ' mm' });
      let kl = null;
      if (m !== 'manuell') {
        kl = kleinste(t.zeilen, vz);
        rows.push({ k: 'Kleinste Größe bis ' + fmt(vz, 2) + ' m/s', v: kl ? kl.bez + ' (' + fmt(kl.v, 2) + ' m/s)' : 'keine in der Liste' });
      }
      const tab = ui.table(['Größe', 'Innen mm', 'm/s', 'Pa/m'],
        t.zeilen.map(z => [z.bez, fmt(z.idMm, 1), fmt(z.v, 2), fmt(z.rPa, 0)]));
      out.replaceChildren(...[
        ui.result(rows),
        tab,
        t.zeilen.some(z => z.uebergang) ? ui.note('Bei einzelnen Größen liegt die Strömung im Übergangsbereich (Re 2300 bis 4000), der Wert ist dort unsicherer.') : null,
        m === 'kupfer' ? ui.note('Gerechnet mit der üblichen Wandstärke je Größe (15 bis 22 mm: 1 mm, 28 bis 42 mm: 1,5 mm, 54 mm: 2 mm). Bei anderer Wandstärke "Innendurchmesser selbst eingeben" wählen. Größe 12 mm fehlt.') : null,
        m === 'mehrschicht' ? ui.note('Raxofix: Innendurchmesser aus Außen-Ø und Wand gerechnet. Real ist er bei 25, 32 und 63 mm bis 0,4 mm größer. Der Druckverlust liegt dann bis etwa 10 % niedriger, die Rechnung liegt auf der sicheren Seite.') : null,
        ui.note('Faustwert aus Fachartikeln: im Wohnbau bis etwa 0,5 m/s und 100 bis 150 Pa/m. Eine Norm dazu ist nicht belegt, und die Quellen weichen ab (je nach Leitung 0,3 bis 1,5 m/s). Maßgeblich sind die Tabelle des Herstellers und die Planung.'),
        ui.note('Gerechnet mit Heizungswasser bei 60 °C, nur das gerade Rohr. Bögen, Ventile, Heizkörper und der Wärmeerzeuger kommen dazu.')
      ].filter(Boolean));
    }

    mat.select.addEventListener('change', update);
    for (const f of [kw, k, id, ziel]) f.input.addEventListener('input', update);
    art.select.addEventListener('change', update);

    const root = h('div', {},
      ui.panel(null, kw.el, k.el, mat.el, id.el, art.el, ziel.el),
      ui.panel('Ergebnis', out));
    update();
    return root;
  }

  WK.register({
    id: 'heizrohr',
    bereich: 'rohr',
    hilfe: {
      wofuer: 'Welches Rohr brauche ich für meine Heizleistung? Aus kW und Spreizung rechnet die App die Wassermenge und zeigt für jede Rohrgröße, wie schnell das Wasser fließt und wie viel Druck je Meter verloren geht.',
      schritte: [
        'Heizleistung in kW und Spreizung in K eintragen (Vorlauf minus Rücklauf).',
        'Rohrmaterial wählen, oder "Innendurchmesser selbst eingeben" für ein anderes Rohr.',
        'Unten steht die Wassermenge und eine Tabelle mit allen Größen. Die Zeile "Kleinste Größe" zeigt, welche Größe deine gewünschte Geschwindigkeit noch einhält.',
        'Die gewünschte Geschwindigkeit kannst du ändern. Die Vorgabe 0,5 m/s ist ein Faustwert.'
      ],
      beispiel: '20 kW bei 20 K Spreizung: 860 l/h. Für höchstens 1 m/s reichen etwa 17,4 mm Innendurchmesser, bei 0,5 m/s sind es etwa 24,7 mm.',
      hinweis: 'Die App bewertet die Rohre nicht. Du siehst die Werte und entscheidest mit Herstellertabelle und Planung.'
    },
    quelle: [
      'Wassermenge: V̇ = Q ÷ (1,163 · ΔT), wie im Modul Leistung & Volumenstrom (1 l Wasser = 1 kg). Innen-Ø für eine Geschwindigkeit: d = √(4 · V̇ ÷ (π · v)), reine Geometrie. Beispiel 20 kW, 20 K, 1 m/s: 17,4 mm, von Hand nachgerechnet.',
      'Geschwindigkeit und Druckgefälle je Größe: wie im Rohr-Check (Darcy-Weisbach mit Colebrook, Wasser 60 °C, Gegenprobe mit Geberit-Tabellen). Zusätzliche Gegenprobe mit einem SBZ-Beispiel bei 997 kg/h: 28er Rohr dort etwa 150 bis 160 Pa/m und 0,57 bis 0,59 m/s (hier bei Innen-Ø 24,5 bis 25 mm: 148 bis 163 Pa/m, 0,56 bis 0,59 m/s), 35er Rohr dort 45 bis 50 Pa/m und 0,35 m/s (hier bei Innen-Ø 32 mm: 46 Pa/m, 0,34 m/s).',
      'Faustwerte (nur Hinweis, keine Bewertung): SBZ Monteur nennt höchstens 0,5 m/s und 100 bis 150 Pa/m im Wohnungsbau. Baunetzwissen nennt 0,3 bis 1,5 m/s in Hauptverteilleitungen, 0,5 m/s an Heizkörperanschlüssen, 50 bis 100 Pa/m (große Anlagen bis 200) und an anderer Stelle 0,2 bis 0,5 m/s im Wohnbereich. Alle ohne Normangabe, deshalb hat die App keine Ampel.',
      'Nicht enthalten: Stahlrohre (Prestabo, Mapress XL, Gewinderohr), weil keine bestätigte Rauheit vorliegt. Kupfer: übliche Wandstärke je Größe aus der Sikla-Rohrtabelle (15 bis 22 × 1, 28 bis 42 × 1,5, 54 × 2), Größe 12 mm ohne bestätigte Wandstärke weggelassen. Einzelwiderstände, Heizkörper, hydraulischer Abgleich.'
    ],
    stichworte: 'heizung rohr dimension durchmesser kw spreizung wassermenge geschwindigkeit druckgefälle pa/m heizleistung mindestdurchmesser verteilleitung heizkörperanbindung',
    title: 'Heizungsrohr',
    desc: 'Rohrgröße aus kW und Spreizung',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h18M3 16h18"/><path d="M8 8v8M16 8v8"/></svg>',
    render
  });
})();
