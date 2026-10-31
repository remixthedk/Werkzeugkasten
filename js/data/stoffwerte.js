// Stoffwerte (nur Daten, keine Logik). Quellen und Prüfstand: README, Abschnitt "Prüfliste".
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.stoffwerte = {
    // Flüssiges Wasser bei 1 atm, Stützstellen alle 10 K (dazwischen wird linear gerechnet)
    // rho: Dichte in kg/m³ (engineeringtoolbox.com, Gegenprobe chemie.de)
    // cp: spezifische Wärmekapazität in kJ/(kg·K) (IAPWS-95-Tabelle, Gegenprobe chemie.de)
    wasser: {
      t:   [0,      10,     20,     30,     40,     50,     60,     70,     80,     90,     100],
      rho: [999.8,  999.7,  998.2,  995.65, 992.2,  988.0,  983.2,  977.8,  971.8,  965.3,  958.4],
      cp:  [4.2176, 4.1921, 4.1816, 4.1788, 4.1786, 4.1810, 4.1848, 4.1898, 4.1964, 4.2050, 4.2159]
    },
    // Trockene Luft bei 1013,25 hPa
    luft: { cp: 1.005, rho20: 1.204 },
    // Richtwerte, je Legierung leicht verschieden
    werkstoffe: [
      { name: 'Kupfer', c: 0.38 },
      { name: 'Stahl', c: 0.47 }
    ],
    // Wasser bei der Verbrennung von 1 m³ Erdgas (Normzustand), theoretischer Höchstwert in Litern
    gasWasserLiter: 1.6
  };
})();
