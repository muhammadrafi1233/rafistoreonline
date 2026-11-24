// Routing hash URL & perbaikan navigasi
(function () {
  function hideBlockingOverlays() {
    var popup = document.getElementById('waTutorialPopup');
    if (popup) {
      popup.classList.remove('show');
      popup.setAttribute('aria-hidden', 'true');
    }

    // Jangan sampai modal transparan menutup tombol menu atas
    document.querySelectorAll('.order-modal-overlay.active, .lightbox-overlay.active, .tut-modal-overlay.open').forEach(function (el) {
      el.classList.remove('active');
      el.classList.remove('open');
    });

    document.body.style.overflow = '';
  }

  function safeSwitchView(view, clickedLink, skipHash) {
    hideBlockingOverlays();

    document.querySelectorAll('.view').forEach(function (v) {
      v.classList.remove('active');
    });

    var target = document.getElementById('view-' + view);
    if (target) target.classList.add('active');

    document.querySelectorAll('.header-nav a').forEach(function (a) {
      a.classList.remove('current');
    });

    var link = clickedLink || document.querySelector('.header-nav a[data-view="' + view + '"]');
    if (link) link.classList.add('current');

    // Update URL supaya tiap tab (Katalog / Tutorial / Testimoni) punya "halaman" sendiri
    if (!skipHash && !(view === 'katalog' && window.location.hash.indexOf('#katalog-') === 0)) {
      history.pushState(null, '', '#' + view);
    }

    if (view === 'testimoni') {
      setTimeout(function () {
        if (typeof runTransactionCounter === 'function') runTransactionCounter();
        if (typeof startWorldwideToast === 'function') startWorldwideToast();
      }, 250);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Timpa fungsi lama supaya tidak bentrok dengan script lain
  window.switchView = safeSwitchView;

  function bindNavButtons() {
    document.querySelectorAll('.header-nav a[data-view]').forEach(function (link) {
      link.onclick = null;
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        safeSwitchView(link.getAttribute('data-view'), link);
      }, true);
    });

    // Tombol CTA testimoni di bawah katalog juga dibetulkan
    document.querySelectorAll('a').forEach(function (a) {
      var txt = (a.textContent || '').toLowerCase();
      if (txt.includes('lihat testimoni')) {
        a.onclick = null;
        a.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          var link = document.querySelector('.header-nav a[data-view="testimoni"]');
          safeSwitchView('testimoni', link);
        }, true);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindNavButtons);
  } else {
    bindNavButtons();
  }

  // Popup tutorial sengaja dibiarkan muncul saat website pertama kali dibuka.
  // Jangan auto-hide di sini, supaya notifikasi tutorial tidak langsung hilang.

  /* ===== ROUTING: baca URL hash supaya tiap katalog & tab jadi "halaman" sendiri ===== */
  function routeFromHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) return;

    if (hash.indexOf('katalog-') === 0) {
      var catalogId = hash.replace('katalog-', '');
      safeSwitchView('katalog', null, true);
      if (typeof showCatalog === 'function' && document.getElementById(catalogId)) {
        showCatalog(catalogId, null);
      }
    } else if (hash === 'katalog' || hash === 'tutorial' || hash === 'testimoni' || hash === 'kalkulator') {
      safeSwitchView(hash, null, true);
    }
  }

  window.addEventListener('popstate', routeFromHash);
  window.addEventListener('hashchange', routeFromHash);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', routeFromHash);
  } else {
    routeFromHash();
  }
})();
