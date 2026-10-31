// Rohrdaten (nur Daten, keine Logik). Alle Maße in mm.
// Quellen und Prüfstand: README, Abschnitt "Prüfliste". Auswahl nach den Systemen im Betrieb (Raxofix, Prestabo, Mapress XL, Kupfer/Profipress).
// nurAussen: true = Wandstärke ist je Hersteller/Serie unterschiedlich und deshalb nicht hinterlegt.
//   Der Innen-Ø wird dann aus der selbst eingegebenen Wandstärke gerechnet (Dämmung) oder gar nicht angezeigt.
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.rohre = {
    werkstoffe: [
      {
        id: 'mehrschicht', verbund: true, name: 'Mehrschicht (Viega Raxofix)', kurz: 'Raxofix', norm: 'Viega Raxofix und Sanfix Fosta, PE-Xc/Al/PE-Xc',
        hinweis: 'Viega Raxofix (Gebrauchsanleitung Viega). Das Viega-Rohr Sanfix Fosta hat laut Gebrauchsanleitung dieselben Maße (16 bis 63 mm). Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand. Nach Händlerangaben zum Wasserinhalt ist der Innen-Ø bei 25, 32 und 63 mm bis zu 0,4 mm größer, bitte bei Bedarf nachmessen.',
        rohre: [
          { bez: '16 x 2,2', ad: 16, wand: 2.2 },
          { bez: '20 x 2,8', ad: 20, wand: 2.8 },
          { bez: '25 x 2,7', ad: 25, wand: 2.7 },
          { bez: '32 x 3,2', ad: 32, wand: 3.2 },
          { bez: '40 x 3,5', ad: 40, wand: 3.5 },
          { bez: '50 x 4,0', ad: 50, wand: 4.0 },
          { bez: '63 x 4,5', ad: 63, wand: 4.5 }
        ]
      },
      {
        id: 'tigris', verbund: true, name: 'Mehrschicht (Wavin Tigris)', kurz: 'Tigris', norm: 'Wavin Tigris, PE-Xc/Al/HDPE (75 mm: PE-RT/Al/HDPE)',
        hinweis: 'Wavin Tigris Mehrschicht-Verbundrohr weiß (Technisches Handbuch und Sortimentsübersicht von Wavin). Fittingreihen K5/M5 bis 40 mm, K1/M1 ab 50 mm. Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand.',
        rohre: [
          { bez: '16 x 2,0',  ad: 16, wand: 2.0 },
          { bez: '20 x 2,25', ad: 20, wand: 2.25 },
          { bez: '25 x 2,5',  ad: 25, wand: 2.5 },
          { bez: '32 x 3,0',  ad: 32, wand: 3.0 },
          { bez: '40 x 4,0',  ad: 40, wand: 4.0 },
          { bez: '50 x 4,5',  ad: 50, wand: 4.5 },
          { bez: '63 x 6,0',  ad: 63, wand: 6.0 },
          { bez: '75 x 7,5',  ad: 75, wand: 7.5 }
        ]
      },
      {
        id: 'teceflex', verbund: true, name: 'Mehrschicht (TECEflex)', kurz: 'TECEflex', norm: 'TECEflex Verbundrohr, PE-Xc/Al/PE-RT',
        hinweis: 'TECEflex Verbundrohr (Technische Information TECE, Ausgaben 2017 und 2024). Die Größe heißt bei TECE 14 bis 63 und ist nicht der Außen-Ø: zum Beispiel Größe 16 hat 17 mm außen. Innen-Ø nach TECE-Angabe.',
        rohre: [
          { bez: '14 (15 x 2,6)',  ad: 15, wand: 2.6 },
          { bez: '16 (17 x 2,75)', ad: 17, wand: 2.75 },
          { bez: '20 (21 x 3,45)', ad: 21, wand: 3.45 },
          { bez: '25 (26 x 4,0)',  ad: 26, wand: 4.0 },
          { bez: '32 (32 x 4,0)',  ad: 32, wand: 4.0 },
          { bez: '40 (40 x 4,0)',  ad: 40, wand: 4.0 },
          { bez: '50 (50 x 4,5)',  ad: 50, wand: 4.5 },
          { bez: '63 (63 x 6,0)',  ad: 63, wand: 6.0 }
        ]
      },
      {
        id: 'uponor', verbund: true, name: 'Mehrschicht (Uponor MLC / Uni Pipe PLUS)', kurz: 'Uponor MLC', norm: 'Uponor MLC und Uni Pipe PLUS, Mehrschichtverbund',
        hinweis: 'Nur die Größen, die in Herstellerangabe und Händlerangabe übereinstimmen (16 x 2,0 und 20 x 2,25). Weitere Größen (25 bis 75 mm) sind nicht hinterlegt, sie fehlen mangels zweiter Quelle. Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand.',
        rohre: [
          { bez: '16 x 2,0',  ad: 16, wand: 2.0 },
          { bez: '20 x 2,25', ad: 20, wand: 2.25 }
        ]
      },
      {
        id: 'rautitan', verbund: true, name: 'Mehrschicht (Rehau Rautitan stabil)', kurz: 'Rautitan stabil', norm: 'Rehau Rautitan stabil, PE-X/Al/PE-RT',
        hinweis: 'Nur die Größen, die in zwei Quellen übereinstimmen (16,2 x 2,6 und 25 x 3,7). Weitere Größen sind nicht hinterlegt. Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand.',
        rohre: [
          { bez: '16,2 x 2,6', ad: 16.2, wand: 2.6 },
          { bez: '25 x 3,7',   ad: 25,   wand: 3.7 }
        ]
      },
      {
        id: 'mepla', verbund: true, name: 'Mehrschicht (Geberit Mepla)', kurz: 'Mepla', norm: 'Geberit Mepla, PE-RT II/Al/PE-RT II',
        hinweis: 'Nur 20 x 2,5, das in zwei Quellen übereinstimmt (Händler pdod und onninen). Die Rohrgrößen 16, 20, 26, 32, 40, 50, 63 und 75 gibt es laut Geberit, ihre Wandstärken sind nicht hinterlegt (nur eine Quelle). Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand.',
        rohre: [
          { bez: '20 x 2,5', ad: 20, wand: 2.5 }
        ]
      },
      {
        id: 'prestabo', name: 'Stahl (Viega Prestabo)', kurz: 'Prestabo', norm: 'Viega Prestabo, Stahl unlegiert, außen verzinkt',
        hinweis: 'Viega Prestabo (Katalog Modell 1103) und Prestabo XL ab 64 mm. Nur für Heizung, Kälte und Druckluft, nicht für Trinkwasser. Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand.',
        rohre: [
          { bez: '15 x 1,2',   ad: 15,   wand: 1.2 },
          { bez: '18 x 1,2',   ad: 18,   wand: 1.2 },
          { bez: '22 x 1,5',   ad: 22,   wand: 1.5 },
          { bez: '28 x 1,5',   ad: 28,   wand: 1.5 },
          { bez: '35 x 1,5',   ad: 35,   wand: 1.5 },
          { bez: '42 x 1,5',   ad: 42,   wand: 1.5 },
          { bez: '54 x 1,5',   ad: 54,   wand: 1.5 },
          { bez: '64 x 2,0',   ad: 64,   wand: 2.0 },
          { bez: '76,1 x 2,0', ad: 76.1, wand: 2.0 }
        ]
      },
      {
        id: 'mapress', name: 'Geberit Mapress XL (88,9 und 108)', kurz: 'Mapress XL', norm: 'Geberit Mapress XL, Edelstahl und C-Stahl',
        hinweis: 'Geberit Mapress, Edelstahl und C-Stahl haben bei 88,9 und 108 mm die gleiche Wandstärke (2,0 mm). Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand.',
        rohre: [
          { bez: '88,9 x 2,0', ad: 88.9, wand: 2.0 },
          { bez: '108 x 2,0',  ad: 108,  wand: 2.0 }
        ]
      },
      {
        id: 'kupfer', name: 'Kupferrohr (Profipress)', kurz: 'Kupfer', norm: 'DIN EN 1057', nurAussen: true,
        hinweis: 'DIN EN 1057. Es gibt je Außendurchmesser mehrere Wandstärken, deshalb ist keine hinterlegt. Die Wandstärke steht auf dem Rohr oder im Katalog.',
        rohre: [
          { bez: '12', ad: 12 },
          { bez: '15', ad: 15 },
          { bez: '18', ad: 18 },
          { bez: '22', ad: 22 },
          { bez: '28', ad: 28 },
          { bez: '35', ad: 35 },
          { bez: '42', ad: 42 },
          { bez: '54', ad: 54 }
        ]
      },
      {
        id: 'stahl', name: 'Stahlrohr, Gewinde (mittelschwer)', kurz: 'Gewinderohr', norm: 'DIN EN 10255',
        hinweis: 'DIN EN 10255, Reihe mittelschwer. Maße in mm. Wandstärken sind gerundet (zum Beispiel 2,35 oder 2,3 je nach Quelle).',
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
        id: 'siederohr', name: 'Stahlrohr, nahtlos (Siederohr)', kurz: 'Siederohr', norm: 'DIN EN 10220 (früher DIN 2448)',
        hinweis: 'DIN EN 10220, nahtlos, Normalwandstärke je Außen-Ø (Sikla und thyssenkrupp stimmen überein). Zwischenmaße und andere Wandstärken stehen in der Rohrsuche. Maße in mm, Innen-Ø gerechnet aus Außen-Ø minus 2 × Wand.',
        rohre: [
          { bez: 'DN 15 (21,3 x 2,0)',   ad: 21.3,  wand: 2.0 },
          { bez: 'DN 20 (26,9 x 2,3)',   ad: 26.9,  wand: 2.3 },
          { bez: 'DN 25 (33,7 x 2,6)',   ad: 33.7,  wand: 2.6 },
          { bez: 'DN 32 (42,4 x 2,6)',   ad: 42.4,  wand: 2.6 },
          { bez: 'DN 40 (48,3 x 2,6)',   ad: 48.3,  wand: 2.6 },
          { bez: 'DN 50 (60,3 x 2,9)',   ad: 60.3,  wand: 2.9 },
          { bez: 'DN 65 (76,1 x 2,9)',   ad: 76.1,  wand: 2.9 },
          { bez: 'DN 80 (88,9 x 3,2)',   ad: 88.9,  wand: 3.2 },
          { bez: 'DN 100 (114,3 x 3,6)', ad: 114.3, wand: 3.6 },
          { bez: 'DN 125 (139,7 x 4,0)', ad: 139.7, wand: 4.0 },
          { bez: 'DN 150 (168,3 x 4,5)', ad: 168.3, wand: 4.5 }
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
