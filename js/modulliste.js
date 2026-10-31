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
  { id: 'lueftung', title: 'Lüftung & Klima' }
];

self.WK.MODULES = [
  { id: 'filter',       files: ['js/data/filter.js', 'js/modules/filter.js'] },
  { id: 'daemmung',     files: ['js/data/rohre.js', 'js/data/daemmung.js', 'js/modules/daemmung.js'] },
  { id: 'rohrgroessen', files: ['js/data/rohre.js', 'js/modules/rohrgroessen.js'] },
  { id: 'passstuecke',  files: ['js/modules/passstuecke.js'] }
];
