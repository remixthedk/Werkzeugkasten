// Daten für die Rohrsuche (nur Daten, keine Logik). Alle Maße in mm.
// Siederohr nahtlos nach DIN EN 10220 (früher DIN 2448): Außendurchmesser mit den dazu möglichen Wandstärken.
// Quelle der Reihen: rff-Maße-und-Gewichte-Tabelle EN 10220 (Wandstärken aus den Gewichten der Tabelle zurückgerechnet, Gegenprobe kg/m = 0,02466 · s · (d − s)).
// normal: Normalwandstärke, bestätigt durch Sikla (Tabelle 17.2) und thyssenkrupp (nahtlose normalwandige Stahlrohre). Nur bis 168,3 mm (DN 150):
// bei 193,7 und 219,1 mm nennen beide Quellen verschiedene Normalwände, deshalb nicht aufgenommen.
// dn: Nennweite nur dort, wo sie sicher belegt ist.
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.rohrsuche = {
    siederohr: [
      { ad: 21.3, waende: [2, 2.3, 2.6, 2.9, 3.2, 3.6, 4, 4.5, 5], dn: 'DN 15', normal: 2 },
      { ad: 22, waende: [2, 2.3, 2.6, 2.9, 3.2, 3.6, 4, 4.5, 5] },
      { ad: 25, waende: [2, 2.3, 2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3] },
      { ad: 25.4, waende: [2, 2.3, 2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3] },
      { ad: 26.9, waende: [2, 2.3, 2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8], dn: 'DN 20', normal: 2.3 },
      { ad: 31.8, waende: [2.3, 2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8] },
      { ad: 32, waende: [2.3, 2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8] },
      { ad: 33.7, waende: [2.3, 2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8], dn: 'DN 25', normal: 2.6 },
      { ad: 35, waende: [2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8] },
      { ad: 38, waende: [2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 40, waende: [2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 42.4, waende: [2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10], dn: 'DN 32', normal: 2.6 },
      { ad: 44.5, waende: [2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 48.3, waende: [2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10], dn: 'DN 40', normal: 2.6 },
      { ad: 51, waende: [2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 54, waende: [2.6, 2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 57, waende: [2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 60.3, waende: [2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10], dn: 'DN 50', normal: 2.9 },
      { ad: 63.5, waende: [2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 70, waende: [2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 73, waende: [2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 76.1, waende: [2.9, 3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10], dn: 'DN 65', normal: 2.9 },
      { ad: 82.5, waende: [3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 88.9, waende: [3.2, 3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10], dn: 'DN 80', normal: 3.2 },
      { ad: 101.6, waende: [3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 108, waende: [3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 114.3, waende: [3.6, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10], dn: 'DN 100', normal: 3.6 },
      { ad: 127, waende: [4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 133, waende: [4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 139.7, waende: [4, 4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10], dn: 'DN 125', normal: 4 },
      { ad: 141.3, waende: [4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 152.4, waende: [4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 159, waende: [4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10] },
      { ad: 168.3, waende: [4.5, 5, 5.6, 6.3, 7.1, 8, 8.8, 10], dn: 'DN 150', normal: 4.5 }
    ]
  };
})();
