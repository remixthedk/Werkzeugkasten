// Liste aller Module (Reihenfolge = Reihenfolge der Kacheln).
// Neues Modul: Eintrag hier + Dateien anlegen (siehe README, Abschnitt "Neues Modul").
// Der Service Worker liest diese Liste und legt alle Dateien für die Offline-Nutzung ab.
self.WK = self.WK || {};
self.WK.MODULES = [
  { id: 'filter',       files: ['js/data/filter.js', 'js/modules/filter.js'] },
  { id: 'daemmung',     files: ['js/data/rohre.js', 'js/data/daemmung.js', 'js/modules/daemmung.js'] },
  { id: 'rohrgroessen', files: ['js/data/rohre.js', 'js/modules/rohrgroessen.js'] },
  { id: 'passstuecke',  files: ['js/modules/passstuecke.js'] }
];
