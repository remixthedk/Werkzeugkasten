// Rohrgewinde (nur Daten, keine Logik). Quellen und Prüfstand: README, Abschnitt "Prüfliste".
// Gilt für die Rohrgewinde G (zylindrisch, DIN EN ISO 228-1), Rp (zylindrisch, innen) und R (kegelig, außen), alle mit Whitworth-Profil 55°.
// zoll: Größenbezeichnung, ad: Gewinde-Außendurchmesser in mm (bei R an der Bezugsebene), kern: Kerndurchmesser in mm,
// gaenge: Gänge je Zoll (25,4 mm), dn: Nennweite des Gewinderohrs (null = keine genormte DN).
// ad: REMS Gewindetabellen und Pressol (ISO 228) stimmen überein. kern: Pressol (ISO 228), Gegenprobe: kern = ad - 2 · 0,640327 · Steigung.
(function () {
  'use strict';
  const WK = self.WK;
  WK.data = WK.data || {};
  WK.data.gewinde = {
    groessen: [
      { zoll: '1/8',   dn: 6,    ad: 9.728,   kern: 8.566,   gaenge: 28 },
      { zoll: '1/4',   dn: 8,    ad: 13.157,  kern: 11.445,  gaenge: 19 },
      { zoll: '3/8',   dn: 10,   ad: 16.662,  kern: 14.950,  gaenge: 19 },
      { zoll: '1/2',   dn: 15,   ad: 20.955,  kern: 18.631,  gaenge: 14 },
      { zoll: '3/4',   dn: 20,   ad: 26.441,  kern: 24.117,  gaenge: 14 },
      { zoll: '1',     dn: 25,   ad: 33.249,  kern: 30.291,  gaenge: 11 },
      { zoll: '1 1/4', dn: 32,   ad: 41.910,  kern: 38.952,  gaenge: 11 },
      { zoll: '1 1/2', dn: 40,   ad: 47.803,  kern: 44.845,  gaenge: 11 },
      { zoll: '2',     dn: 50,   ad: 59.614,  kern: 56.656,  gaenge: 11 },
      { zoll: '2 1/2', dn: 65,   ad: 75.184,  kern: 72.226,  gaenge: 11 },
      { zoll: '3',     dn: 80,   ad: 87.884,  kern: 84.926,  gaenge: 11 },
      { zoll: '3 1/2', dn: null, ad: 100.330, kern: 97.372,  gaenge: 11 },
      { zoll: '4',     dn: 100,  ad: 113.030, kern: 110.072, gaenge: 11 }
    ],
    zollMm: 25.4,
    tiefeFaktor: 0.640327   // Gewindetiefe h = 0,640327 · Steigung (Whitworth-Rohrgewinde)
  };
})();
