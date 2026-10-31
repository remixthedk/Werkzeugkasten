// Daten für das Modul Gasleitung (Erdgas, Niederdruck hinter dem Hausdruckregler).
// Rohrmaße in mm. Innen-Ø wird gerechnet (Außen-Ø minus 2 x Wand). Stahl-Gewinderohr kommt aus js/data/rohre.js.
//
// Gasdaten (Normzustand):
//   Erdgas H: Heizwert Hi,n 10,3 kWh/m³ (DEW21 10,27 / Stadtwerke Essen 10,50 -> der niedrigere gerundete Wert), Normdichte 0,80 kg/m³ (DEW21 0,793 / Essen 0,802).
//   Erdgas L: Heizwert Hi,n 9,33 kWh/m³ und Normdichte 0,824 kg/m³ (DEW21, nur eine Quelle).
//   Betriebszustand-Faktor 0,92: Hi,B = 0,92 x Hi,n. Gewählt, weil Erdgas L damit 8,58 kWh/m³ ergibt, und das TRGI-Rechenbeispiel (mh-software) rechnet mit Hi,B = 8,6 kWh/m³ für Erdgas L.
//   Dynamische Viskosität 1,1e-5 Pa s (Annahme für Methan, etwa 15 °C).
//
// Rohre:
//   Kupfer (DVGW GW 392, Hauptabmessungen): DKI-Broschüre i.158 (Tabelle 1.2) und eumet.de, übereinstimmend. Sonderabmessungen mit dickerer Wand (28 x 1,5 / 35 x 1,5 / 42 x 1,5 / 54 x 2) gibt es zusätzlich.
//   Edelstahl (Mapress Edelstahl, Gas-Systemrohr 1.4401): Geberit-Datenblatt gedb_pro_103002. Eine Quelle. Ein Händler nennt für die Variante 1.4301 (CrNi) 22 x 1,5 statt 22 x 1,2.
//   Rauheit k: 0,0015 mm für gezogene Rohre (Kupfer, Edelstahl), 0,045 mm für Stahl. Bei diesen Durchmessern wirkt sich k wenig aus.
//   Zuschlag je Winkel (äquivalente Rohrlänge): 0,3 m bei Kupfer und Edelstahl (TRGI-Beispiel von mh-software: 6 Winkel a 0,3 m; SBZ Monteur: Kupferwinkel 22 x 1 etwa 0,3 m). 0,5 m je Bogen bei Stahl (eine Quelle: SBZ zur Flüssiggasrohrnetzberechnung).
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.gasrohre = {
    gase: {
      H: { name: 'Erdgas H', hiN: 10.3, rhoN: 0.80 },
      L: { name: 'Erdgas L', hiN: 9.33, rhoN: 0.824 }
    },
    betrieb: 0.92,
    eta: 1.1e-5,
    budgetPa: 300,       // zulässiger Druckverlust Regler bis Gerät (23 auf 20 mbar), SBZ Monteur und bubiza-Wiki
    bauteileStandard: 120, // Pa: Gasströmungswächter 14 + Zähler G 2,5 60 + Geräteanschlussarmatur 45 (TRGI-Beispiel, 18 kW)
    grenzeKw: 110,       // Diagrammverfahren der TRGI gilt für Einzelzuleitungen bis 110 kW
    werkstoffe: [
      { id: 'kupfer', name: 'Kupfer (Profipress G, Lötfittings)', k: 0.0015, winkel: 0.3,
        rohre: [{ ad: 15, wand: 1 }, { ad: 18, wand: 1 }, { ad: 22, wand: 1 }, { ad: 28, wand: 1 }, { ad: 35, wand: 1.2 }, { ad: 42, wand: 1.2 }, { ad: 54, wand: 1.5 }] },
      { id: 'edelstahl', name: 'Edelstahl (Mapress Edelstahl Gas, Sanpress Inox G)', k: 0.0015, winkel: 0.3,
        rohre: [{ ad: 15, wand: 1 }, { ad: 18, wand: 1 }, { ad: 22, wand: 1.2 }, { ad: 28, wand: 1.2 }, { ad: 35, wand: 1.5 }, { ad: 42, wand: 1.5 }, { ad: 54, wand: 1.5 }] },
      { id: 'stahl', name: 'Stahlrohr mit Gewinde', k: 0.045, winkel: 0.5, aus: 'stahl', dnVon: 21.3, dnBis: 76.1 }
    ]
  };
})();
