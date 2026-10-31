// Längenausdehnungskoeffizienten α in mm/(m·K) (nur Daten, keine Logik).
// Quellen und Prüfstand: README, Abschnitt "Prüfliste".
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.ausdehnung = {
    werkstoffe: [
      { id: 'raxofix',   name: 'Raxofix (Mehrschichtverbund)',  alpha: 0.03 },
      { id: 'prestabo',  name: 'Prestabo (Stahl, verzinkt)',    alpha: 0.012 },
      { id: 'mapress-e', name: 'Mapress Edelstahl',             alpha: 0.0165 },
      { id: 'mapress-c', name: 'Mapress C-Stahl',               alpha: 0.012 },
      { id: 'kupfer',    name: 'Kupfer (Profipress)',           alpha: 0.0166 },
      { id: 'stahl',     name: 'Stahl-Gewinderohr',             alpha: 0.012 }
    ]
  };
})();
