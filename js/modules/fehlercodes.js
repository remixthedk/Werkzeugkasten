// Modul: Fehlercodes. Keine eigenen Codes (die hängen am Gerät und am Softwarestand), nur Wege zu den Herstellerunterlagen.
// Adressen und Suchbegriffe stehen oben in der Liste und lassen sich dort leicht ändern.
(function () {
  'use strict';
  const WK = self.WK;

  // ---- Daten ----
  // seiten: offizielle Herstellerseiten (nur Adressen, die geprüft wurden). suche: Domains für die Suche nur auf Herstellerseiten.
  const HERSTELLER = [
    { id: 'viessmann', name: 'Viessmann', suche: ['viessmann.de'],
      seiten: [{ titel: 'Fehlercode-Tabelle ansehen', klein: 'Für Vitodens 200-W, 300-W, 222-W, 222-F und 333-F', url: 'https://www.viessmann.de/de/wissen/wartung-und-reparatur/fehlercodes.html' }] },
    { id: 'wolf', name: 'Wolf', suche: ['wolf.eu'],
      seiten: [{ titel: 'Download-Bereich für Profis öffnen', klein: 'Anleitungen im Downloadcenter, dazu das PDF „Fehlercodes Heizung“ unter Sonstige Downloads', url: 'https://www.wolf.eu/de-de/professional/downloads/shk' }] },
    { id: 'vaillant', name: 'Vaillant', suche: ['vaillant.de', 'kontakt.vaillant.de'], seiten: [] },
    { id: 'remeha', name: 'Remeha', suche: ['remeha.de', 'mediacdn.remeha.de'],
      seiten: [{ titel: 'Technischer Support für Fachpartner', klein: 'Seite von Remeha', url: 'https://www.remeha.de/fachpartner/technischer-support' }] },
    { id: 'broetje', name: 'Brötje', suche: ['broetje.de'],
      seiten: [{ titel: 'Produktdokumentation öffnen', klein: 'Datenbank: nach Produktkategorie, Serie und Modell suchen', url: 'https://www.broetje.de/service/produktdokumentation' }] }
  ];
  const STOERCODE = { titel: 'Störcode für Fachbetriebe', klein: 'Über 240.000 Codes von 106 Herstellern. Die Datenbank ist ein Abo, die App ist kostenlos.', url: 'https://apps.apple.com/de/app/st%C3%B6rcode/id1373134632' };

  // Suchadresse: Fehlercodes in Anleitungen, nur auf den Seiten des Herstellers (Google-Suche mit site:)
  function suchUrl(domains, geraet) {
    const orte = domains.map(d => 'site:' + d).join(' OR ');
    const q = (geraet ? geraet + ' ' : '') + 'Fehlercodes Wartungsanleitung ' + (domains.length > 1 ? '(' + orte + ')' : orte);
    return 'https://www.google.com/search?q=' + encodeURIComponent(q);
  }
  WK.calc.fehlercodes = { suchUrl, HERSTELLER };

  // ---- Oberfläche ----
  function render() {
    const { h, ui } = WK;
    const geraet = ui.num('Gerät (nur für die Suche)', { value: '', placeholder: 'zum Beispiel ecoTEC plus, Tzerra, CGB-2' });
    geraet.input.setAttribute('inputmode', 'text');
    geraet.input.setAttribute('autocapitalize', 'none');
    geraet.el.querySelector('.hint')?.remove();
    geraet.el.append(h('small', { class: 'hint' }, 'Den Gerätenamen findest du auf dem Typenschild. Leer lassen geht auch.'));

    const link = (titel, klein, url, tag) => h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' },
      h('span', {}, tag ? h('span', { class: 'tag' }, tag) : null, h('strong', {}, titel), klein ? h('small', {}, klein) : null));

    const suchen = [];
    const blocks = HERSTELLER.map(x => {
      const suche = link('Anleitung suchen', 'Sucht Fehlercodes nur auf den Seiten von ' + x.name, suchUrl(x.suche, ''), 'Suche');
      suchen.push({ x, el: suche });
      return ui.panel(x.name, h('div', { class: 'wahl' },
        ...x.seiten.map(s => link(s.titel, s.klein, s.url, 'Herstellerseite')),
        suche));
    });
    function aktualisiere() {
      const g = geraet.input.value.trim();
      for (const { x, el } of suchen) el.setAttribute('href', suchUrl(x.suche, g));
    }
    geraet.input.addEventListener('input', aktualisiere);

    return h('div', {},
      ui.panel(null, geraet.el),
      ...blocks,
      ui.panel('Für Fachbetriebe', h('div', { class: 'wahl' }, link(STOERCODE.titel, STOERCODE.klein, STOERCODE.url, 'App'))),
      ui.note('Die Links öffnen Internetseiten, dafür brauchst du Empfang. Maßnahmen an Gasgeräten nur durch Fachkräfte, es gelten die Angaben des Herstellers für dein Gerät und seinen Softwarestand.'));
  }

  WK.register({
    id: 'fehlercodes',
    bereich: 'heizung',
    hilfe: {
      wofuer: 'Eine Heizung zeigt einen Fehlercode, und du suchst, was er bedeutet. Die Codes hängen am Gerät und am Softwarestand, deshalb steht hier keine eigene Liste, sondern der kürzeste Weg zu den Unterlagen des Herstellers.',
      schritte: [
        'Hersteller suchen und auf „Herstellerseite“ tippen, wo es eine gibt. Dort steht eine Tabelle oder die Produktdokumentation.',
        'Alternativ auf „Anleitung suchen“ tippen. Die Suche findet Anleitungen mit Fehlercodes nur auf den Seiten dieses Herstellers.',
        'Trage oben den Gerätenamen vom Typenschild ein, dann sucht die Suche genau dein Gerät.',
        'Gib in der Anleitung den Code ein, der am Display steht, und lies Ursache und Maßnahme.'
      ],
      beispiel: 'Wolf CGB-2 zeigt einen Fehler: Gerät „CGB-2“ eintragen, bei Wolf auf „Anleitung suchen“ tippen und in der Montage- oder Wartungsanleitung die Fehlerliste öffnen.',
      hinweis: 'Alles Weitere regelt der Hersteller. Maßnahmen an Gasgeräten sind Sache der Fachkraft.'
    },
    quelle: [
      'Adressen aus den Seiten der Hersteller: Viessmann (Fehlercode-Tabelle), Wolf (Downloads für Profis), Brötje (Produktdokumentation), Remeha (Technischer Support). Geprüft am 31.10.2026 über die Suche. Geöffnet und gelesen wurden die Seiten von Viessmann, Wolf und Brötje. Die Remeha-Seite ließ sich nicht öffnen, sie kam aber in der Suche vor.',
      'Vaillant: Es wurde keine feste Seite für Anleitungen gefunden, deshalb nur die Suche auf vaillant.de und kontakt.vaillant.de. Dort liegen die Anleitungen je Gerät.',
      'Störcode (Kohl Beratung IT): Angaben zum Umfang aus der Beschreibung im App Store. Die Datenbank im Netz ist ein kostenpflichtiges Abo für angemeldete Fachbetriebe.',
      'Nicht enthalten: eigene Fehlercodes. Sie hängen am Gerätetyp und am Softwarestand, und die Herstellertabellen sind urheberrechtlich geschützt. Adressen von Herstellern können sich ändern, die Suche bleibt dann der Weg.'
    ],
    stichworte: 'fehlercode fehlercodes störung stoerung fehler heizung therme kessel display anleitung wartung viessmann wolf vaillant remeha brötje broetje störcode stoercode',
    frage: 'Wo finde ich die Fehlercodes für meine Heizung?',
    title: 'Fehlercodes',
    desc: 'Viessmann, Wolf, Vaillant, Remeha, Brötje: Wege zu den Unterlagen',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/></svg>',
    render
  });
})();
