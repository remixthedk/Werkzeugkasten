// Grundgerüst: Modul-Registry, UI-Helfer, Routing, Offline (Service Worker).
(function () {
  'use strict';
  const WK = self.WK;
  WK.modules = [];
  WK.data = WK.data || {};
  WK.calc = WK.calc || {};
  WK.register = m => { WK.modules.push(m); };

  // ---- kleine Helfer -------------------------------------------------------
  const h = WK.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
    return el;
  };

  // Zahl aus Eingabe lesen (Komma oder Punkt) und deutsch ausgeben
  WK.parse = s => {
    const n = parseFloat(String(s).replace(/\s/g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  };
  WK.fmt = (n, digits = 1) => Number.isFinite(n)
    ? n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: digits })
    : '–';

  // ---- UI-Bausteine für die Module ----------------------------------------
  WK.ui = {
    num(label, o = {}) {
      const input = h('input', {
        type: 'text', inputmode: 'decimal', autocomplete: 'off', enterkeyhint: 'done',
        value: o.value ?? '', placeholder: o.placeholder ?? ''
      });
      const el = h('label', { class: 'field' },
        h('span', { class: 'lbl' }, label),
        h('span', { class: 'inp' }, input, o.unit ? h('span', { class: 'unit' }, o.unit) : null),
        o.hint ? h('small', { class: 'hint' }, o.hint) : null);
      return { el, input, get: () => WK.parse(input.value), set: v => { input.value = v; } };
    },
    select(label, options, value) {
      const select = h('select', {}, options.map(o => h('option', { value: o.value }, o.label)));
      if (value != null) select.value = value;
      const el = h('label', { class: 'field' },
        h('span', { class: 'lbl' }, label),
        h('span', { class: 'inp' }, select));
      return { el, select, get: () => select.value, set: v => { select.value = v; } };
    },
    tabs(items, onChange, start) {
      let cur = start ?? items[0].value;
      const btns = items.map(i => h('button', {
        type: 'button', class: 'tab' + (i.value === cur ? ' on' : ''), 'data-v': i.value,
        onclick: () => set(i.value)
      }, i.label));
      function set(v) {
        cur = v;
        btns.forEach(b => b.classList.toggle('on', b.dataset.v === v));
        onChange(v);
      }
      return { el: h('div', { class: 'tabs' }, btns), set, get: () => cur };
    },
    result(rows) {
      return h('dl', { class: 'result' }, rows.map(r =>
        h('div', { class: r.big ? 'row big' : 'row' }, h('dt', {}, r.k), h('dd', {}, r.v))));
    },
    note(text, kind) { return h('p', { class: 'note ' + (kind || '') }, text); },
    table(head, rows) {
      return h('div', { class: 'tbl' }, h('table', {},
        h('thead', {}, h('tr', {}, head.map(c => h('th', {}, c)))),
        h('tbody', {}, rows.map(r => h('tr', {}, r.map(c => h('td', {}, c)))))));
    },
    panel(title, ...kids) { return h('section', { class: 'panel' }, title ? h('h2', {}, title) : null, ...kids); },
    // Aufklappbare Beschreibung oben im Modul. x: { wofuer, schritte[], beispiel, hinweis }
    help(x) {
      if (!x) return null;
      return h('details', { class: 'help' },
        h('summary', {}, 'Wofür ist das und wie benutze ich es?'),
        h('div', { class: 'helpbody' },
          h('h3', {}, 'Wofür ist das?'),
          h('p', {}, x.wofuer),
          h('h3', {}, 'So benutzt du es'),
          h('ol', {}, x.schritte.map(s => h('li', {}, s))),
          x.beispiel ? [h('h3', {}, 'Beispiel'), h('p', {}, x.beispiel)] : null,
          x.hinweis ? h('p', { class: 'note' }, x.hinweis) : null));
    },
    // Aufklappbare Quellenangabe unten im Modul. lines: Liste von Absätzen
    quelle(lines) {
      if (!lines || !lines.length) return null;
      return h('details', { class: 'quelle' },
        h('summary', {}, 'Quelle und Prüfstand'),
        lines.map(l => h('p', {}, l)));
    }
  };

  // ---- Favoriten (nur auf diesem Gerät, im Browser gespeichert) -------------
  const FAV_KEY = 'wk-favoriten';
  let favs = [];
  try {
    const v = JSON.parse(localStorage.getItem(FAV_KEY));
    if (Array.isArray(v)) favs = v.filter(x => typeof x === 'string');
  } catch (e) { /* Speicher gesperrt: Favoriten gelten dann nur bis zum Neuladen */ }
  const istFav = id => favs.includes(id);
  function favUmschalten(id) {
    favs = istFav(id) ? favs.filter(x => x !== id) : [...favs, id];
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) { /* siehe oben */ }
  }
  const STERN = '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="FILL"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';
  const sternSvg = an => STERN.replace('FILL', an ? 'currentColor' : 'none');
  const favLabel = (m, an) => m.title + (an ? ': aus Favoriten entfernen' : ': zu Favoriten hinzufügen');
  function sternKnopf(m, nachher) {
    const an = istFav(m.id);
    return h('button', {
      type: 'button', class: 'star' + (an ? ' on' : ''), 'aria-pressed': an ? 'true' : 'false',
      'aria-label': favLabel(m, an), html: sternSvg(an),
      onclick: () => { favUmschalten(m.id); nachher(); }
    });
  }
  // Suche: Kleinschreibung, Umlaute und ae/oe/ue gleich behandeln ("daemmung" findet "Dämmung")
  const falte = s => String(s).toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ß/g, 'ss').replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');

  // ---- Module laden --------------------------------------------------------
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src + '?v=' + WK.VERSION;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Laden fehlgeschlagen: ' + src));
      document.head.append(s);
    });
  }

  async function loadAll() {
    const seen = new Set();
    const failed = [];
    for (const m of WK.MODULES) {
      try {
        for (const f of m.files) {
          if (seen.has(f)) continue;
          seen.add(f);
          await loadScript(f);
        }
      } catch (e) { failed.push(m.id); }
    }
    return failed;
  }

  // ---- Seiten --------------------------------------------------------------
  const view = document.getElementById('view');
  const title = document.getElementById('title');
  const back = document.getElementById('back');
  let failedModules = [];

  function home() {
    title.textContent = 'Werkzeugkasten';
    back.hidden = true;
    document.title = 'Werkzeugkasten';
    favKnopf(null);
    const suche = h('input', {
      type: 'search', class: 'search', placeholder: 'Modul suchen', autocomplete: 'off', 'aria-label': 'Modul suchen'
    });
    const liste = h('div');

    function zeichne() {
      const worte = falte(suche.value.trim()).split(/\s+/).filter(Boolean);
      const passt = m => {
        const text = falte([m.title, m.desc, m.stichworte || ''].join(' '));
        return worte.every(w => text.includes(w));
      };
      const kachel = m => h('div', { class: 'tile' },
        h('a', { class: 'card', href: '#/' + m.id },
          h('span', { class: 'ico', html: m.icon }),
          h('strong', {}, m.title),
          h('small', {}, m.desc)),
        sternKnopf(m, zeichne));
      const bereiche = WK.BEREICHE.map(b => ({ b, mods: WK.modules.filter(m => m.bereich === b.id) }));
      const ohne = WK.modules.filter(m => !WK.BEREICHE.some(b => b.id === m.bereich));
      if (ohne.length) bereiche.push({ b: { id: 'weitere', title: 'Weitere' }, mods: ohne });
      const favMods = favs.map(id => WK.modules.find(m => m.id === id)).filter(Boolean);
      const gruppen = [
        { b: { id: 'favoriten', title: 'Favoriten' }, mods: favMods },
        ...bereiche
      ].map(x => ({ b: x.b, mods: x.mods.filter(passt) })).filter(x => x.mods.length);
      // replaceChildren nimmt nur Elemente oder Text: kein null, keine Listen
      liste.replaceChildren(...(gruppen.length
        ? gruppen.map(x =>
          h('section', { class: 'bereich', 'data-bereich': x.b.id },
            h('h2', { class: 'sect' }, x.b.title),
            h('div', { class: 'grid' }, x.mods.map(kachel))))
        : [WK.ui.note('Keine Treffer.')]));
    }
    suche.addEventListener('input', zeichne);
    zeichne();

    view.replaceChildren(...[
      h('p', { class: 'lead' }, 'Rechner und Nachschlagetabellen für die Baustelle. Mit dem Stern markierst du Favoriten, sie stehen dann oben.'),
      suche,
      liste,
      failedModules.length
        ? WK.ui.note('Nicht geladen (offline und noch nicht zwischengespeichert): ' + failedModules.join(', '), 'warn')
        : null
    ].filter(Boolean));
  }

  // Stern oben rechts im Kopf, solange ein Modul offen ist
  const favBtn = document.getElementById('fav');
  function favKnopf(m) {
    if (!favBtn) return;
    if (!m) { favBtn.hidden = true; return; }
    const an = istFav(m.id);
    favBtn.hidden = false;
    favBtn.classList.toggle('on', an);
    favBtn.setAttribute('aria-pressed', an ? 'true' : 'false');
    favBtn.setAttribute('aria-label', favLabel(m, an));
    favBtn.innerHTML = sternSvg(an);
    favBtn.onclick = () => { favUmschalten(m.id); favKnopf(m); };
  }

  function modulePage(m) {
    title.textContent = m.title;
    back.hidden = false;
    favKnopf(m);
    document.title = m.title + ' – Werkzeugkasten';
    view.replaceChildren(...[WK.ui.help(m.hilfe), m.render(), WK.ui.quelle(m.quelle)].filter(Boolean));
  }

  function route() {
    const id = location.hash.replace(/^#\/?/, '');
    const m = WK.modules.find(x => x.id === id);
    if (m) modulePage(m); else home();
    window.scrollTo(0, 0);
  }

  // ---- Offline / Updates ---------------------------------------------------
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    // updateViaCache 'none': auch version.js (steckt im Service Worker) kommt immer frisch vom Server
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller && !document.querySelector('.banner')) {
            document.body.append(h('div', { class: 'banner' },
              'Neue Version geladen.',
              h('button', { type: 'button', onclick: () => location.reload() }, 'Neu laden')));
          }
        });
      });
      // Eine installierte App bleibt oft im Hintergrund offen: bei jeder Rückkehr nach einer neuen Version fragen
      let zuletzt = 0;
      const pruefe = () => {
        if (Date.now() - zuletzt < 30000) return;
        zuletzt = Date.now();
        reg.update().catch(() => { /* offline: nichts zu tun */ });
      };
      pruefe();
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pruefe(); });
    }).catch(() => { /* ohne https/localhost kein Offline-Modus */ });
  }

  // ---- Start ---------------------------------------------------------------
  document.getElementById('foot').textContent = 'Werkzeugkasten v' + WK.VERSION + ' · Richtwerte ohne Gewähr';
  loadAll().then(failed => {
    failedModules = failed;
    window.addEventListener('hashchange', route);
    route();
    registerServiceWorker();
  });
})();
