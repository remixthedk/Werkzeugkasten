// Daten für den Dämmungsrechner (nur Daten, keine Logik).
// Quelle: Anlage 8 GEG (Gebäudeenergiegesetz), Fassung laut lxgesetze.de, zuletzt geändert 23.07.2026.
// Alle Dicken in mm, bezogen auf lambda = 0,035 W/(m·K).
// Beim Aktualisieren der Werte auch CHANGELOG und README (Datenquellen) anpassen.
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.daemmung = {
    lambdaRef: 0.035,
    // Heizung / Warmwasser (Anlage 8 Nr. 1 a): Innendurchmesser der Leitung -> Mindestdicke
    // dicke 'ID' bedeutet: gleich dem Innendurchmesser
    warm: [
      { bis: 22,       dicke: 20,   ref: 'Nr. 1 a) aa)' },
      { bis: 35,       dicke: 30,   ref: 'Nr. 1 a) bb)' },
      { bis: 100,      dicke: 'ID', ref: 'Nr. 1 a) cc)' },
      { bis: Infinity, dicke: 100,  ref: 'Nr. 1 a) dd)' }
    ],
    // Kälteverteilungs- und Kaltwasserleitungen von RLT-/Klimakältesystemen (Anlage 8 Nr. 2)
    kalt: [
      { bis: 22,       dicke: 9,  ref: 'Nr. 2 a)' },
      { bis: Infinity, dicke: 19, ref: 'Nr. 2 b)' }
    ],
    // Einbausituation bei Heizung / Warmwasser
    situationen: [
      { id: 'normal',  label: 'Normal (Standardfall)', faktor: 1 },
      { id: 'durch',   label: 'Wand-/Deckendurchbruch, Kreuzung, Verbindung, Verteiler (½)', faktor: 0.5, ref: 'Nr. 1 a) ee)' },
      { id: 'nutzer',  label: 'Bauteil zwischen beheizten Räumen verschiedener Nutzer (½)', faktor: 0.5, ref: 'Nr. 1 a) ff)' },
      { id: 'boden',   label: 'Wie vorher, im Fußbodenaufbau (6 mm)', fix: 6, ref: 'Nr. 1 a) gg)' },
      { id: 'aussen',  label: 'An Außenluft grenzend (doppelt)', faktor: 2, ref: 'Nr. 1 a) hh)' }
    ]
  };
})();
