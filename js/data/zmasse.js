// Z-Maße für Passstücke (nur Daten, keine Logik). Alle Maße in mm.
// Quelle: Viega-Online-Katalog, Produktseite, Reiter "Z-Maße".
//   z = Abstand von der Mittelachse des Fittings bis zur Anschlagfläche im Fitting (Einstecktiefe enthalten)
//   l = Maß bis zum äußeren Fittingende (wird nicht abgezogen, dient nur der Gegenprobe: l - z = Einstecktiefe)
// "Vorgängerversion" = die in der Spalte Z*/L* geführten Werte der älteren Fittingausführung.
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.zmasse = {
    fittings: [
      {
        id: 'b45', name: 'Profipress Bogen 45°',
        werte: [
          { d: 12, z: 6,  l: 24 },
          { d: 15, z: 7,  l: 29 },
          { d: 18, z: 7,  l: 29 },
          { d: 22, z: 11, l: 34 },
          { d: 28, z: 12, l: 36 },
          { d: 35, z: 15, l: 41 },
          { d: 42, z: 17, l: 53 },
          { d: 54, z: 22, l: 62 }
        ]
      },
      {
        id: 'b90', name: 'Profipress Bogen 90°',
        werte: [
          { d: 12, z: 14, l: 32 },
          { d: 15, z: 16, l: 38 },
          { d: 18, z: 18, l: 40 },
          { d: 22, z: 26, l: 49 },
          { d: 28, z: 31, l: 55 },
          { d: 35, z: 33, l: 59 },
          { d: 42, z: 33, l: 69 },
          { d: 54, z: 55, l: 95 }
        ]
      },
      {
        id: 'b45v', name: 'Profipress Bogen 45° (Vorgängerversion)',
        werte: [
          { d: 15, z: 8,  l: 30 },
          { d: 18, z: 9,  l: 31 },
          { d: 22, z: 9,  l: 32 },
          { d: 28, z: 14, l: 38 },
          { d: 35, z: 17, l: 43 },
          { d: 42, z: 21, l: 57 },
          { d: 54, z: 27, l: 67 }
        ]
      },
      {
        id: 'b90v', name: 'Profipress Bogen 90° (Vorgängerversion)',
        werte: [
          { d: 15, z: 18, l: 40 },
          { d: 18, z: 22, l: 44 },
          { d: 22, z: 19, l: 42 },
          { d: 28, z: 34, l: 58 },
          { d: 35, z: 42, l: 68 },
          { d: 42, z: 50, l: 86 },
          { d: 54, z: 65, l: 105 }
        ]
      }
    ]
  };
})();
