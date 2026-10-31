// Umrechnungsfaktoren (nur Daten, keine Logik).
// f = Wert der Einheit in der Basiseinheit der Gruppe (Pa, W, J, m³/h). Temperatur: eigene Funktionen.
// Quellen und Prüfstand: README, Abschnitt "Prüfliste".
//   bar, kWh, kcal (IT), mmWS: genau definiert (NIST Guide to the SI, Anhang B.8)
//   BTU (IT) = 1055,056 J (NIST, gerundet auf 7 Stellen), psi = 6894,757 Pa (NIST und aus lbf / in² gerechnet)
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.einheiten = {
    gruppen: [
      {
        id: 'druck', name: 'Druck', start: { wert: '1', von: 'bar' },
        hinweis: 'mWS ist hier der genormte Wert: 1 mmWS = 9,80665 Pa, unabhängig von der Wassertemperatur. mbar und hPa sind dasselbe.',
        einheiten: [
          { id: 'Pa', label: 'Pa', f: 1 },
          { id: 'mbar', label: 'mbar (= hPa)', f: 100 },
          { id: 'kPa', label: 'kPa', f: 1000 },
          { id: 'bar', label: 'bar', f: 100000 },
          { id: 'MPa', label: 'MPa', f: 1000000 },
          { id: 'mmWS', label: 'mmWS', f: 9.80665 },
          { id: 'mWS', label: 'mWS', f: 9806.65 },
          { id: 'psi', label: 'psi', f: 6894.757 }
        ]
      },
      {
        id: 'leistung', name: 'Leistung', start: { wert: '1', von: 'kW' },
        hinweis: 'kcal und BTU nach International Table: 1 kcal = 4,1868 kJ, 1 BTU = 1055,056 J.',
        einheiten: [
          { id: 'W', label: 'W', f: 1 },
          { id: 'kW', label: 'kW', f: 1000 },
          { id: 'kcal/h', label: 'kcal/h', f: 4186.8 / 3600 },
          { id: 'BTU/h', label: 'BTU/h', f: 1055.056 / 3600 }
        ]
      },
      {
        id: 'energie', name: 'Energie', start: { wert: '1', von: 'kWh' },
        hinweis: 'kcal und BTU nach International Table: 1 kcal = 4,1868 kJ, 1 BTU = 1055,056 J.',
        einheiten: [
          { id: 'J', label: 'J', f: 1 },
          { id: 'kJ', label: 'kJ', f: 1000 },
          { id: 'MJ', label: 'MJ', f: 1000000 },
          { id: 'kWh', label: 'kWh', f: 3600000 },
          { id: 'kcal', label: 'kcal', f: 4186.8 },
          { id: 'BTU', label: 'BTU', f: 1055.056 }
        ]
      },
      {
        id: 'durchfluss', name: 'Durchfluss', start: { wert: '1', von: 'm3/h' },
        hinweis: 'Volumenstrom: reine Umrechnung von Volumen und Zeit, ohne Dichte.',
        einheiten: [
          { id: 'l/s', label: 'l/s', f: 3.6 },
          { id: 'l/min', label: 'l/min', f: 0.06 },
          { id: 'l/h', label: 'l/h', f: 0.001 },
          { id: 'm3/h', label: 'm³/h', f: 1 },
          { id: 'm3/s', label: 'm³/s', f: 3600 }
        ]
      },
      {
        id: 'temperatur', name: 'Temperatur', temperatur: true, start: { wert: '20', von: 'C' },
        hinweis: 'Das ist die Umrechnung einer Temperatur. Für Temperaturunterschiede gilt: 1 K = 1 °C = 1,8 °F.',
        einheiten: [
          { id: 'C', label: '°C', zuK: v => v + 273.15, vonK: k => k - 273.15 },
          { id: 'K', label: 'K', zuK: v => v, vonK: k => k },
          { id: 'F', label: '°F', zuK: v => (v - 32) * 5 / 9 + 273.15, vonK: k => (k - 273.15) * 9 / 5 + 32 }
        ]
      }
    ]
  };
})();
