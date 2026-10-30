// Rohrdaten (nur Daten, keine Logik). Alle Maße in mm.
// Richtwerte nach gängigen Normen; Wandstärken können je Hersteller und Serie abweichen.
// wand: null = herstellerabhängig, dann kein Innendurchmesser berechenbar.
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.rohre = {
    werkstoffe: [
      {
        id: 'stahl', name: 'Stahlrohr, Gewinde (mittelschwer)', kurz: 'Stahl', norm: 'DIN EN 10255',
        rohre: [
          { bez: 'DN 6 (1/8")',    ad: 10.2,  wand: 2.0 },
          { bez: 'DN 8 (1/4")',    ad: 13.5,  wand: 2.35 },
          { bez: 'DN 10 (3/8")',   ad: 17.2,  wand: 2.35 },
          { bez: 'DN 15 (1/2")',   ad: 21.3,  wand: 2.65 },
          { bez: 'DN 20 (3/4")',   ad: 26.9,  wand: 2.65 },
          { bez: 'DN 25 (1")',     ad: 33.7,  wand: 3.25 },
          { bez: 'DN 32 (1 1/4")', ad: 42.4,  wand: 3.25 },
          { bez: 'DN 40 (1 1/2")', ad: 48.3,  wand: 3.25 },
          { bez: 'DN 50 (2")',     ad: 60.3,  wand: 3.65 },
          { bez: 'DN 65 (2 1/2")', ad: 76.1,  wand: 3.65 },
          { bez: 'DN 80 (3")',     ad: 88.9,  wand: 4.05 },
          { bez: 'DN 100 (4")',    ad: 114.3, wand: 4.5 }
        ]
      },
      {
        id: 'kupfer', name: 'Kupferrohr', kurz: 'Kupfer', norm: 'DIN EN 1057',
        rohre: [
          { bez: '12 x 1',    ad: 12,   wand: 1 },
          { bez: '15 x 1',    ad: 15,   wand: 1 },
          { bez: '18 x 1',    ad: 18,   wand: 1 },
          { bez: '22 x 1',    ad: 22,   wand: 1 },
          { bez: '28 x 1,5',  ad: 28,   wand: 1.5 },
          { bez: '35 x 1,5',  ad: 35,   wand: 1.5 },
          { bez: '42 x 1,5',  ad: 42,   wand: 1.5 },
          { bez: '54 x 2',    ad: 54,   wand: 2 },
          { bez: '64 x 2',    ad: 64,   wand: 2 },
          { bez: '76,1 x 2',  ad: 76.1, wand: 2 },
          { bez: '88,9 x 2',  ad: 88.9, wand: 2 },
          { bez: '108 x 2,5', ad: 108,  wand: 2.5 }
        ]
      },
      {
        id: 'edelstahl', name: 'Edelstahlrohr (Pressverbindung)', kurz: 'Edelstahl', norm: 'DIN EN 10312',
        rohre: [
          { bez: '15 x 1',    ad: 15,   wand: 1 },
          { bez: '18 x 1',    ad: 18,   wand: 1 },
          { bez: '22 x 1,2',  ad: 22,   wand: 1.2 },
          { bez: '28 x 1,2',  ad: 28,   wand: 1.2 },
          { bez: '35 x 1,5',  ad: 35,   wand: 1.5 },
          { bez: '42 x 1,5',  ad: 42,   wand: 1.5 },
          { bez: '54 x 1,5',  ad: 54,   wand: 1.5 },
          { bez: '76,1 x 2',  ad: 76.1, wand: 2 },
          { bez: '88,9 x 2',  ad: 88.9, wand: 2 },
          { bez: '108 x 2',   ad: 108,  wand: 2 }
        ]
      },
      {
        id: 'mehrschicht', name: 'Mehrschichtverbundrohr (Außen-Ø)', kurz: 'Mehrschicht', norm: 'herstellerabhängig',
        rohre: [
          { bez: '16', ad: 16, wand: null },
          { bez: '20', ad: 20, wand: null },
          { bez: '26', ad: 26, wand: null },
          { bez: '32', ad: 32, wand: null },
          { bez: '40', ad: 40, wand: null },
          { bez: '50', ad: 50, wand: null },
          { bez: '63', ad: 63, wand: null }
        ]
      }
    ],
    // Rohrgewinde (R / Rp), Gewinde-Außendurchmesser nach ISO 7-1 / EN 10226
    gewinde: [
      { zoll: '1/8"',   dn: 'DN 6',   ad: 9.728 },
      { zoll: '1/4"',   dn: 'DN 8',   ad: 13.157 },
      { zoll: '3/8"',   dn: 'DN 10',  ad: 16.662 },
      { zoll: '1/2"',   dn: 'DN 15',  ad: 20.955 },
      { zoll: '3/4"',   dn: 'DN 20',  ad: 26.441 },
      { zoll: '1"',     dn: 'DN 25',  ad: 33.249 },
      { zoll: '1 1/4"', dn: 'DN 32',  ad: 41.910 },
      { zoll: '1 1/2"', dn: 'DN 40',  ad: 47.803 },
      { zoll: '2"',     dn: 'DN 50',  ad: 59.614 },
      { zoll: '2 1/2"', dn: 'DN 65',  ad: 75.184 },
      { zoll: '3"',     dn: 'DN 80',  ad: 87.884 },
      { zoll: '4"',     dn: 'DN 100', ad: 113.030 }
    ]
  };
})();
