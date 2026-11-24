// Search header & wishlist
/* ============================================================
   HEADER SEARCH — mencari langsung di data produk (.card) yang
   SUDAH ADA di halaman, tidak membuat data produk baru/duplikat.
   Satu komponen ini dipakai untuk desktop & mobile (search bar
   yang sama, cuma posisinya dipindah lewat CSS/flex order).
   ============================================================ */
(function () {
  var searchInput = document.getElementById('siteSearchInput');
  var searchResults = document.getElementById('siteSearchResults');
  var searchWrap = document.getElementById('siteSearch');
  if (!searchInput || !searchResults || !searchWrap) return;

  function getAllProductCards() {
    return Array.prototype.slice.call(document.querySelectorAll('#view-katalog .products .card'));
  }

  function openSearchResults() {
    searchResults.classList.add('open');
    searchInput.setAttribute('aria-expanded', 'true');
  }

  function closeSearchResults() {
    searchResults.classList.remove('open');
    searchInput.setAttribute('aria-expanded', 'false');
  }
  window.closeSearchResults = closeSearchResults;

  function renderSearchResults(rawQuery) {
    var query = (rawQuery || '').trim();
    var q = query.toLowerCase();
    searchResults.innerHTML = '';

    if (!q) {
      closeSearchResults();
      return;
    }

    var matches = getAllProductCards().filter(function (card) {
      var nameEl = card.querySelector('h2');
      var descEl = card.querySelector('.desc');
      var slug = (card.getAttribute('data-product-slug') || '').toLowerCase();
      var texts = [
        nameEl ? nameEl.textContent.toLowerCase() : '',
        descEl ? descEl.textContent.toLowerCase() : ''
      ];
      // Ikut cocokkan dengan versi ID & EN dari peta terjemahan, supaya
      // pencarian tetap ketemu produknya walau lagi tampil di bahasa lain.
      var entry = (window.productI18n || {})[card.getAttribute('data-product-slug')];
      if (entry) {
        if (entry.name) {
          if (entry.name.id) texts.push(entry.name.id.toLowerCase());
          if (entry.name.en) texts.push(entry.name.en.toLowerCase());
        }
        if (entry.desc) {
          if (entry.desc.id) texts.push(entry.desc.id.toLowerCase());
          if (entry.desc.en) texts.push(entry.desc.en.toLowerCase());
        }
      }
      return texts.some(function (t) { return t.indexOf(q) !== -1; }) ||
        slug.indexOf(q.replace(/\s+/g, '-')) !== -1;
    }).slice(0, 8);

    if (matches.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'search-empty-state';
      empty.textContent = (typeof window.t === 'function') ? window.t('search.notFound', { q: query }) : 'Produk tidak ditemukan untuk "' + query + '"';
      searchResults.appendChild(empty);
      openSearchResults();
      return;
    }

    matches.forEach(function (card) {
      var nameEl = card.querySelector('h2');
      var priceEl = card.querySelector('.price');
      var imgEl = card.querySelector('img');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-result-item';
      btn.setAttribute('role', 'option');

      var thumb = document.createElement('img');
      thumb.className = 'search-result-thumb';
      thumb.src = imgEl ? imgEl.src : '';
      thumb.alt = '';

      var info = document.createElement('div');
      info.className = 'search-result-info';

      var nameSpan = document.createElement('span');
      nameSpan.className = 'search-result-name';
      nameSpan.textContent = nameEl ? nameEl.textContent : '';

      var priceSpan = document.createElement('span');
      priceSpan.className = 'search-result-price';
      priceSpan.textContent = priceEl ? priceEl.textContent : '';

      info.appendChild(nameSpan);
      info.appendChild(priceSpan);
      btn.appendChild(thumb);
      btn.appendChild(info);

      btn.addEventListener('click', function () {
        goToSearchResultCard(card);
      });

      searchResults.appendChild(btn);
    });

    openSearchResults();
  }

  function goToSearchResultCard(card) {
    var section = card.closest('.catalog-section');
    var katalogLink = document.getElementById('navKatalogLink');
    if (typeof switchView === 'function' && katalogLink) switchView('katalog', katalogLink);
    if (section && typeof showCatalog === 'function') showCatalog(section.id);

    setTimeout(function () {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('search-highlight');
      setTimeout(function () { card.classList.remove('search-highlight'); }, 1600);
    }, 260);

    closeSearchResults();
    searchInput.value = '';
  }

  window.runHeaderSearch = function () {
    renderSearchResults(searchInput.value);
    searchInput.focus();
  };

  searchInput.addEventListener('input', function () {
    renderSearchResults(searchInput.value);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var first = searchResults.querySelector('.search-result-item');
      if (first) first.click();
    } else if (e.key === 'Escape') {
      closeSearchResults();
      searchInput.blur();
    }
  });

  document.addEventListener('click', function (e) {
    if (!searchWrap.contains(e.target)) closeSearchResults();
  });
})();

/* ============================================================
   HEADER WISHLIST — panel sederhana berbasis localStorage.
   Catatan: website ini sebelumnya belum punya sistem wishlist,
   jadi ini komponen baru yang ringan (bukan backend baru),
   disiapkan agar bisa disambungkan ke tombol "Tambah ke Wishlist"
   pada kartu produk kapan saja lewat window.addToWishlist(nama).
   ============================================================ */
var profilePanelEl = null;
(function () {
  var WISHLIST_KEY = 'rafiHaydayWishlist';
  var wishlistBtn = document.getElementById('wishlistBtn');
  var wishlistPanel = document.getElementById('wishlistPanel');
  var wishlistPanelBody = document.getElementById('wishlistPanelBody');
  var wishlistBadge = document.getElementById('wishlistCountBadge');
  if (!wishlistBtn || !wishlistPanel) return;

  var wishlistItems = [];
  try {
    var saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    if (Array.isArray(saved)) wishlistItems = saved;
  } catch (e) {
    console.error('Gagal memuat wishlist:', e);
  }

  function renderWishlist() {
    if (wishlistBadge) {
      if (wishlistItems.length > 0) {
        wishlistBadge.style.display = 'flex';
        wishlistBadge.textContent = wishlistItems.length;
      } else {
        wishlistBadge.style.display = 'none';
      }
    }
    if (!wishlistPanelBody) return;
    wishlistPanelBody.innerHTML = '';
    if (wishlistItems.length === 0) {
      var empty = document.createElement('div');
      empty.textContent = 'Belum ada produk di wishlist kamu.';
      wishlistPanelBody.appendChild(empty);
      return;
    }
    wishlistItems.forEach(function (name) {
      var row = document.createElement('div');
      row.style.padding = '5px 0';
      row.textContent = '♥ ' + name;
      wishlistPanelBody.appendChild(row);
    });
  }

  window.addToWishlist = function (name) {
    if (!name || wishlistItems.indexOf(name) !== -1) return;
    wishlistItems.push(name);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
    renderWishlist();
  };

  window.toggleWishlistPanel = function () {
    wishlistPanel.classList.toggle('open');
    wishlistBtn.setAttribute('aria-expanded', wishlistPanel.classList.contains('open') ? 'true' : 'false');
    if (profilePanelEl) profilePanelEl.classList.remove('open');
  };

  document.addEventListener('click', function (e) {
    if (wishlistPanel.classList.contains('open') &&
      !wishlistPanel.contains(e.target) && !wishlistBtn.contains(e.target)) {
      wishlistPanel.classList.remove('open');
      wishlistBtn.setAttribute('aria-expanded', 'false');
    }
  });

  renderWishlist();
})();

/* ============================================================
   HEADER PROFILE — logo ini sekarang jadi pintu masuk Admin.
   ============================================================ */
(function () {
  var profileBtn = document.getElementById('siteProfileBtn');
  if (!profileBtn) return;

  profileBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    openAdminPanel();
  });
})();
