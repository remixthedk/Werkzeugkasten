// Liste aller Module (Reihenfolge = Reihenfolge der Kacheln).
// Neues Modul: Eintrag hier + Dateien anlegen (siehe README, Abschnitt "Neues Modul").
// Der Service Worker liest diese Liste und legt alle Dateien für die Offline-Nutzung ab.
self.WK = self.WK || {};

// Bereiche der Startseite (Reihenfolge = Reihenfolge auf der Startseite).
// Jedes Modul sagt in seiner Datei mit "bereich: '<id>'", wohin es gehört.
// Bereiche ohne Modul werden nicht angezeigt.
self.WK.BEREICHE = [
  { id: 'rohr',     title: 'Rohr & Montage' },
  { id: 'heizung',  title: 'Heizung' },
  { id: 'sanitaer', title: 'Sanitär' },
  { id: 'lueftung', title: 'Lüftung & Klima' },
  { id: 'allgemein', title: 'Umrechnen' }
];

self.WK.MODULES = [
  { id: 'filter',       files: ['js/data/filter.js', 'js/modules/filter.js'] },
  { id: 'daemmung',     files: ['js/data/rohre.js', 'js/data/daemmung.js', 'js/modules/daemmung.js'] },
  { id: 'rohrgroessen', files: ['js/data/rohre.js', 'js/modules/rohrgroessen.js'] },
  { id: 'passstuecke',  files: ['js/data/zmasse.js', 'js/modules/passstuecke.js'] },
  { id: 'wasserinhalt', files: ['js/data/rohre.js', 'js/modules/wasserinhalt.js'] },
  { id: 'ausdehnung',   files: ['js/data/ausdehnung.js', 'js/modules/ausdehnung.js'] },
  { id: 'gefaelle',     files: ['js/modules/gefaelle.js'] },
  { id: 'brennstoffe',  files: ['js/modules/brennstoffe.js'] },
  { id: 'waerme',       files: ['js/data/stoffwerte.js', 'js/modules/waerme.js'] },
  { id: 'volumenstrom', files: ['js/modules/volumenstrom.js'] },
  { id: 'heizkoerper',  files: ['js/modules/heizkoerper.js'] },
  { id: 'fussbodenheizung', files: ['js/modules/fussbodenheizung.js'] },
  { id: 'kaeltemittel', files: ['js/data/kaeltemittel.js', 'js/modules/kaeltemittel.js'] },
  { id: 'ueberhitzung', files: ['js/data/kaeltemittel.js', 'js/modules/kaeltemittel.js', 'js/modules/ueberhitzung.js'] },
  { id: 'dichtheit',    files: ['js/modules/dichtheit.js'] },
  { id: 'einheiten',    files: ['js/data/einheiten.js', 'js/modules/einheiten.js'] },
  { id: 'gruppen',      files: ['js/data/erklaerungen.js', 'js/gruppen.js'] }
];
