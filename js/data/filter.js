// Daten für den Filter-Umrechner (nur Daten, keine Logik).
// Quelle: Eurovent Recommendation 4/23-2022 (4. Ausgabe), Tabelle 5.
// Bandbreiten der gemessenen durchschnittlichen Abscheidegrade in % je ISO-16890-Fraktion.
// Das ist ein Anhaltspunkt, keine exakte Umrechnung. Maßgeblich ist der Prüfbericht des Herstellers.
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.filter = {
    quelle: 'Eurovent 4/23-2022, Tabelle 5',
    grob: ['G3', 'G4'],            // landen in ISO Coarse, keine ePM-Werte
    klassen: [
      { alt: 'M5', epm1: [5, 35],  epm25: [10, 45], epm10: [40, 70] },
      { alt: 'M6', epm1: [10, 40], epm25: [20, 50], epm10: [60, 80] },
      { alt: 'F7', epm1: [40, 65], epm25: [65, 75], epm10: [80, 90] },
      { alt: 'F8', epm1: [65, 90], epm25: [75, 95], epm10: [90, 100] },
      { alt: 'F9', epm1: [80, 90], epm25: [85, 95], epm10: [90, 100] }
    ]
  };
})();
