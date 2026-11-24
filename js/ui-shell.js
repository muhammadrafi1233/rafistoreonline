// UI shell: panel menu & search (HP), navigasi bawah, "Lihat semua",
// label kartu produk (SALE/Habis), dan ikon koin SVG.
(function () {
  var header = document.getElementById('siteHeader');
  function isMobile() { return window.matchMedia('(max-width: 768px)').matches; }
  function tr2(key, vars, fb) { return (typeof window.t === 'function') ? window.t(key, vars) : fb; }

  /* ---------- Ikon koin (dipakai modal tutorial) ---------- */
  window.RH_COIN_SVG = '<svg class="rh-coin" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<circle cx="24" cy="24" r="21" fill="#F7B733" stroke="#C98A00" stroke-width="2.5"/>' +
    '<circle cx="24" cy="24" r="15" fill="#FFD978" stroke="#E0A010" stroke-width="2"/>' +
    '<path d="M24 15l2.47 6.1 6.56.46-5.04 4.24 1.59 6.39L24 28.7l-5.58 3.49 1.59-6.39-5.04-4.24 6.56-.46z" fill="#B77900"/></svg>';

  /* ---------- Header: panel menu, search, bayangan saat scroll ---------- */
  if (header) {
    var menuBtn = document.getElementById('headerMenuBtn');
    var closeBtn = document.getElementById('headerPanelClose');
    var scrim = document.getElementById('headerScrim');
    var searchToggle = document.getElementById('headerSearchToggle');
    var searchInput = document.getElementById('siteSearchInput');

    function setMenu(open) {
      header.classList.toggle('menu-open', open);
      if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = (open && isMobile()) ? 'hidden' : '';
      if (open && closeBtn) setTimeout(function () { closeBtn.focus(); }, 320);
    }
    function setSearch(open) {
      header.classList.toggle('search-open', open);
      if (searchToggle) searchToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && searchInput) setTimeout(function () { searchInput.focus(); }, 30);
      if (!open && typeof window.closeSearchResults === 'function') window.closeSearchResults();
    }
    if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!header.classList.contains('menu-open')); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); if (menuBtn) menuBtn.focus(); });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
    if (searchToggle) searchToggle.addEventListener('click', function () { setSearch(!header.classList.contains('search-open')); });

    // klik link nav di panel -> tutup panel (capture: routing.js menghentikan bubbling)
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.header-nav a')) setMenu(false);
    }, true);

    // setelah memilih hasil search, tutup bar search di HP
    var results = document.getElementById('siteSearchResults');
    if (results) results.addEventListener('click', function (e) {
      if (e.target.closest('.search-result-item') && isMobile()) setTimeout(function () { setSearch(false); }, 0);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (header.classList.contains('menu-open')) setMenu(false);
      else if (header.classList.contains('search-open') && isMobile()) setSearch(false);
    });
    window.addEventListener('resize', function () {
      if (!isMobile()) { setMenu(false); header.classList.remove('search-open'); }
    });
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 4); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Navigasi bawah (HP) ---------- */
  var bn = document.getElementById('bottomNav');
  if (bn) {
    bn.querySelectorAll('[data-bn-view]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var view = a.getAttribute('data-bn-view');
        var navLink = document.querySelector('.header-nav a[data-view="' + view + '"]');
        if (typeof window.switchView === 'function') window.switchView(view, navLink);
      });
    });
    // samakan item aktif dengan .header-nav a.current (diatur routing.js)
    var syncBn = function () {
      var cur = document.querySelector('.header-nav a.current');
      var view = cur ? cur.getAttribute('data-view') : 'katalog';
      bn.querySelectorAll('[data-bn-view]').forEach(function (a) {
        var on = a.getAttribute('data-bn-view') === view;
        a.classList.toggle('current', on);
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    };
    var nav = document.querySelector('.header-nav');
    if (nav) new MutationObserver(syncBn).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
    syncBn();
  }

  /* ---------- Kategori: keyboard + geser ke kartu aktif ---------- */
  document.addEventListener('keydown', function (e) {
    var card = e.target.closest && e.target.closest('.menu-card');
    if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); card.click(); }
  });

  var origShowCatalog = window.showCatalog;
  var katalogView = document.getElementById('view-katalog');
  if (typeof origShowCatalog === 'function') {
    window.showCatalog = function (id, card) {
      if (katalogView) katalogView.classList.remove('show-all');
      var r = origShowCatalog.apply(this, arguments);
      var active = document.querySelector('.menu-card.active');
      if (active && active.scrollIntoView) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      return r;
    };
  }

  /* ---------- "Lihat semua": tampilkan semua kategori sekaligus ---------- */
  window.showAllCatalog = function (skipHash) {
    if (!katalogView) return;
    katalogView.classList.add('show-all');
    document.querySelectorAll('.menu-card').forEach(function (c) { c.classList.remove('active'); });
    if (!skipHash && window.location.hash !== '#katalog-all') history.pushState(null, '', '#katalog-all');
    document.querySelectorAll('.catalog-section .card').forEach(function (card, i) {
      card.style.animationDelay = Math.min(i * 0.03, 0.4) + 's';
    });
  };
  function routeAll() { if (window.location.hash === '#katalog-all') window.showAllCatalog(true); }
  window.addEventListener('hashchange', routeAll);
  window.addEventListener('popstate', routeAll);
  routeAll();

  /* ---------- Label kartu produk: Habis / SALE / NEW / Terbatas ----------
     Hanya dari data yang ada:
       - stok habis / terbatas  -> dari kelas yang dipasang sinkron Supabase
       - Item Upgrade bertingkat -> hemat s/d X% dihitung dari bulkItemConfig
       - atribut opsional data-badge="NEW" atau "SALE" pada .card (isi manual)   */
  function bulkNameOf(card) {
    var btn = card.querySelector('button.btn');
    var m = btn && /openBulkItemForm\('((?:[^'\\]|\\.)*)'\)/.exec(btn.getAttribute('onclick') || '');
    return m ? m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\') : null;
  }
  function labelFor(card) {
    if (card.classList.contains('is-sold-out')) return { kind: 'sold', text: tr2('label.sold', null, 'Habis') };
    var manual = card.getAttribute('data-badge');
    if (manual) return { kind: /new/i.test(manual) ? 'new' : 'sale', text: manual };
    if (card.querySelector('.stock-badge.low-stock')) return { kind: 'limited', text: tr2('label.limited', null, 'Terbatas') };
    var name = bulkNameOf(card);
    if (name && typeof bulkItemConfig !== 'undefined' && bulkItemConfig[name]) {
      var cfg = bulkItemConfig[name];
      var pct = cfg.base ? Math.round((1 - Math.min(cfg.tier7, cfg.tier30) / cfg.base) * 100) : 0;
      if (pct > 0) return { kind: 'sale', text: tr2('label.save', { pct: pct }, 'Hemat s/d ' + pct + '%') };
    }
    return null;
  }
  function updateLabels() {
    document.querySelectorAll('.products .card').forEach(function (card) {
      var chip = card.querySelector('.card-label');
      if (!chip) return;
      var l = labelFor(card);
      if (!l) { if (!chip.hidden) chip.hidden = true; return; }
      if (chip.textContent !== l.text) chip.textContent = l.text;
      if (chip.getAttribute('data-kind') !== l.kind) chip.setAttribute('data-kind', l.kind);
      if (chip.hidden) chip.hidden = false;
    });
  }
  var labelTimer = null;
  function scheduleLabels() { clearTimeout(labelTimer); labelTimer = setTimeout(updateLabels, 60); }
  document.querySelectorAll('.products').forEach(function (grid) {
    new MutationObserver(scheduleLabels).observe(grid, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'onclick'] });
  });
  var origApply = window.applyCatalogTranslations;
  window.applyCatalogTranslations = function () {
    if (typeof origApply === 'function') origApply.apply(this, arguments);
    scheduleLabels();
  };
  updateLabels();

  /* ---------- Foto produk: coba tanpa referrer, lalu placeholder bila tetap gagal ---------- */
  var PH = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#efeadb"/><g fill="none" stroke="#b9b29a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><rect x="140" y="180" width="120" height="120" rx="18"/><path d="M140 270l35-35 30 30 20-20 35 35"/></g></svg>');
  function guardImg(img) {
    if (img.__guarded) return;
    img.__guarded = true;
    img.setAttribute('referrerpolicy', 'no-referrer');
    img.addEventListener('error', function () {
      if (img.src !== PH) { img.removeAttribute('srcset'); img.src = PH; }
    });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) img.dispatchEvent(new Event('error'));
  }
  document.querySelectorAll('.card-img-wrap img').forEach(function (img) {
    guardImg(img);
  });
})();

/* ============================================================
   Header PC: susunan simetris, search ikon yang melebar,
   Admin dipindah ke footer, dan efek huruf pada logo.
   (HP tidak berubah: elemen dikembalikan ke tempat semula.)
   ============================================================ */
(function () {
  var header = document.getElementById('siteHeader');
  if (!header) return;
  var mq = window.matchMedia('(min-width: 769px)');
  var search = document.getElementById('siteSearch');
  var input = document.getElementById('siteSearchInput');
  var actions = header.querySelector('.site-header-actions');
  var cart = document.getElementById('headerCartBtn');
  var profileBtn = document.getElementById('siteProfileBtn');
  var adminWrap = profileBtn && profileBtn.closest('.header-action-wrap');
  var footer = document.querySelector('footer');

  var searchAnchor = null, adminAnchor = null, footerSlot = null;
  if (search) { searchAnchor = document.createComment('search'); search.parentNode.insertBefore(searchAnchor, search); }
  if (adminWrap) { adminAnchor = document.createComment('admin'); adminWrap.parentNode.insertBefore(adminAnchor, adminWrap); }
  if (footer && adminWrap) { footerSlot = document.createElement('div'); footerSlot.className = 'footer-admin'; footer.appendChild(footerSlot); }

  function layout() {
    if (mq.matches) {
      if (search && actions && cart && search.parentNode !== actions) actions.insertBefore(search, cart);
      if (adminWrap && footerSlot && adminWrap.parentNode !== footerSlot) footerSlot.appendChild(adminWrap);
    } else {
      if (search && searchAnchor.parentNode && search.parentNode === actions) searchAnchor.parentNode.insertBefore(search, searchAnchor.nextSibling);
      if (adminWrap && adminAnchor.parentNode && adminWrap.parentNode === footerSlot) adminAnchor.parentNode.insertBefore(adminWrap, adminAnchor.nextSibling);
      header.classList.remove('search-open');
    }
  }
  layout();
  if (mq.addEventListener) mq.addEventListener('change', layout); else if (mq.addListener) mq.addListener(layout);

  /* Search PC: klik ikon -> buka kolom; klik lagi (kosong) / klik di luar / Esc -> tutup */
  function openSearch() {
    header.classList.add('search-open');
    var b = document.getElementById('headerSearchToggle'); if (b) b.setAttribute('aria-expanded', 'true');
    setTimeout(function () { if (input) input.focus(); }, 60);
  }
  function closeSearch() {
    header.classList.remove('search-open');
    var b = document.getElementById('headerSearchToggle'); if (b) b.setAttribute('aria-expanded', 'false');
    if (typeof window.closeSearchResults === 'function') window.closeSearchResults();
  }
  if (search) {
    search.addEventListener('click', function (e) {
      if (!mq.matches) return;
      if (!e.target.closest('#siteSearchBtn')) return;
      var open = header.classList.contains('search-open');
      if (!open) { e.stopImmediatePropagation(); e.preventDefault(); openSearch(); }
      else if (!input.value.trim()) { e.stopImmediatePropagation(); e.preventDefault(); closeSearch(); }
    }, true);
    var results = document.getElementById('siteSearchResults');
    if (results) results.addEventListener('click', function (e) {
      if (mq.matches && e.target.closest('.search-result-item')) setTimeout(closeSearch, 0);
    });
  }
  document.addEventListener('click', function (e) {
    if (mq.matches && header.classList.contains('search-open') && search && !search.contains(e.target)) closeSearch();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mq.matches && header.classList.contains('search-open')) closeSearch();
  });

  /* Efek logo: tiap huruf muncul berurutan dari kotak R; diulang saat kursor di logo */
  var logo = header.querySelector('.site-logo');
  var lt = header.querySelector('.site-logo-text');
  if (logo && lt && !lt.querySelector('.lg-ch')) {
    var text = lt.textContent.trim();
    lt.setAttribute('aria-label', text);
    lt.textContent = '';
    text.split('').forEach(function (ch, i) {
      var sp = document.createElement('span');
      sp.className = 'lg-ch';
      sp.setAttribute('aria-hidden', 'true');
      sp.style.setProperty('--i', i);
      sp.textContent = ch === ' ' ? '\u00A0' : ch;
      lt.appendChild(sp);
    });
    requestAnimationFrame(function () { logo.classList.add('lg-play'); });
    logo.addEventListener('mouseenter', function () {
      logo.classList.remove('lg-play');
      void logo.offsetWidth;
      logo.classList.add('lg-play');
    });
  }
})();
