// Banner promo (slider) di bawah header.
// ============================================================================
//  KONFIGURASI BANNER — EDIT DI SINI SAJA
//  Tiap objek = satu slide. Tambah/hapus objek untuk menambah/mengurangi banner.
//
//   product       : nama produk persis seperti di katalog (mis. 'Barn Item')
//   orderType     : form yang dibuka tombol "Beli Sekarang"
//                   'bulk' (Item Upgrade) | 'bahan' | 'coin' | 'simple' | 'akun'
//   qty           : (khusus 'bulk') jumlah set yang langsung terisi di form
//   tag / title   : teks per bahasa { id, en }
//   image         : URL foto set upgrade  <-- GANTI dengan foto banner kamu
//   originalPrice : harga asli (dicoret). null = dihitung otomatis dari harga katalog
//                   (jumlah set x harga normal). Boleh juga diisi angka/teks manual.
//   promoPrice    : harga setelah potongan. null = dihitung otomatis dari harga
//                   bertingkat (jumlah set x harga tier). Boleh diisi manual.
//   theme         : 'green' | 'yellow' | 'cream'
//
//  Harga otomatis ikut berubah kalau harga diubah lewat dashboard admin.
// ============================================================================
window.PROMO_BANNERS = [
  {
    id: 'barn-30',
    product: 'Barn Item',
    orderType: 'bulk',
    qty: 30,
    tag: { id: 'Promo Paket 30 Set', en: '30-Set Bundle Deal' },
    title: { id: 'Upgrade Lumbung x30 Set', en: 'Barn Upgrade x30 Sets' },
    image: 'https://i.imgur.com/uhqbIRO.png', // PLACEHOLDER: ganti dengan foto set 30
    originalPrice: null, // otomatis
    promoPrice: null, // otomatis
    theme: 'green'
  },
  {
    id: 'silo-30',
    product: 'Silo Item',
    orderType: 'bulk',
    qty: 30,
    tag: { id: 'Promo Paket 30 Set', en: '30-Set Bundle Deal' },
    title: { id: 'Upgrade Silo x30 Set', en: 'Silo Upgrade x30 Sets' },
    image: 'https://i.imgur.com/8CT41mi.png', // PLACEHOLDER: ganti dengan foto set 30
    originalPrice: null, // otomatis
    promoPrice: null, // otomatis
    theme: 'yellow'
  },
  {
    id: 'land-30',
    product: 'Land Expansion Item',
    orderType: 'bulk',
    qty: 30,
    tag: { id: 'Promo Paket 30 Set', en: '30-Set Bundle Deal' },
    title: { id: 'Upgrade Lahan x30 Set', en: 'Land Upgrade x30 Sets' },
    image: 'https://i.imgur.com/s34drq6.png', // PLACEHOLDER: ganti dengan foto set 30
    originalPrice: null, // otomatis
    promoPrice: null, // otomatis
    theme: 'cream'
  }
];

(function () {
  var section = document.getElementById('promoBanner');
  var track = document.getElementById('promoTrack');
  var dotsWrap = document.getElementById('promoDots');
  var banners = window.PROMO_BANNERS || [];
  if (!section || !track || !banners.length) return;

  var FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#dfe9df"/>' +
    '<text x="200" y="158" font-family="Arial" font-size="22" font-weight="700" fill="#5d6b62" text-anchor="middle">FOTO SET</text></svg>');

  function lang() { return (typeof window.getSiteLang === 'function') ? window.getSiteLang() : 'id'; }
  function tx(obj) { return (obj && (obj[lang()] || obj.id)) || ''; }
  function tt(key, vars, fallback) { return (typeof window.t === 'function') ? window.t(key, vars) : fallback; }
  function price(v) {
    if (typeof v === 'number') return (typeof formatRupiah === 'function') ? formatRupiah(v) : 'Rp' + v.toLocaleString('id-ID');
    return String(v == null ? '' : v);
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  // Harga otomatis dari konfigurasi katalog (bulkItemConfig) bila tidak diisi manual
  function priceOf(b, which) {
    var manual = which === 'orig' ? b.originalPrice : b.promoPrice;
    if (manual != null && manual !== '') return price(manual);
    try {
      if (b.orderType === 'bulk' && b.qty && typeof bulkItemConfig !== 'undefined' && bulkItemConfig[b.product]) {
        var cfg = bulkItemConfig[b.product];
        return price(which === 'orig' ? b.qty * cfg.base : b.qty * getBulkItemUnitPrice(b.product, b.qty));
      }
    } catch (e) {}
    return '';
  }

  var index = 0;
  var slides = [];
  var dots = [];
  var timer = null;
  var paused = false;

  function build() {
    track.innerHTML = '';
    dotsWrap.innerHTML = '';
    slides = []; dots = [];

    banners.forEach(function (b, i) {
      var el = document.createElement('article');
      el.className = 'promo-slide';
      el.setAttribute('data-theme', b.theme || 'green');
      el.setAttribute('role', 'group');
      el.setAttribute('aria-roledescription', 'slide');
      el.innerHTML =
        '<div class="promo-copy">' +
          '<span class="promo-tag" data-f="tag"></span>' +
          '<h3 class="promo-title" data-f="title"></h3>' +
          '<div class="promo-prices"><span class="promo-old" data-f="old"></span><strong class="promo-new" data-f="new"></strong></div>' +
          '<button type="button" class="promo-btn" data-f="buy"></button>' +
        '</div>' +
        '<div class="promo-media"><img alt="" loading="' + (i === 0 ? 'eager' : 'lazy') + '"></div>';
      var img = el.querySelector('img');
      img.src = b.image || FALLBACK_IMG;
      img.onerror = function () { img.onerror = null; img.src = FALLBACK_IMG; };
      el.querySelector('[data-f="buy"]').addEventListener('click', function () { openOrder(b); });
      track.appendChild(el);
      slides.push(el);

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'promo-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function () { goTo(i, true); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    if (banners.length < 2) dotsWrap.style.display = 'none';
    refreshText();
    section.hidden = false;
  }

  // Isi/ulang teks sesuai bahasa aktif (tanpa membangun ulang slider)
  function refreshText() {
    banners.forEach(function (b, i) {
      var el = slides[i];
      if (!el) return;
      var title = tx(b.title);
      el.querySelector('[data-f="tag"]').textContent = tx(b.tag);
      el.querySelector('[data-f="title"]').textContent = title;
      el.querySelector('[data-f="old"]').textContent = priceOf(b, 'orig');
      el.querySelector('[data-f="new"]').textContent = priceOf(b, 'promo');
      el.querySelector('[data-f="buy"]').textContent = tt('promo.buyNow', null, 'Beli Sekarang');
      el.querySelector('img').alt = title;
      el.setAttribute('aria-label', (i + 1) + ' / ' + banners.length);
      if (dots[i]) dots[i].setAttribute('aria-label', tt('promo.slide', { n: i + 1 }, 'Banner ' + (i + 1)));
    });
  }

  // Tombol "Beli Sekarang" -> buka form order produk terkait
  function openOrder(b) {
    var p = b.product;
    try {
      switch (b.orderType) {
        case 'bulk':
          openBulkItemForm(p);
          if (b.qty) {
            document.getElementById('bulkItemQty').value = b.qty;
            updateBulkItemPreview();
          }
          break;
        case 'bahan': openBahanMultiForm(p); break;
        case 'coin': openCoinForm(p); break;
        case 'akun': openAkunCustomForm(p); break;
        default: openOrderForm(p);
      }
    } catch (e) { console.error('Banner promo: gagal membuka form order', e); }
  }

  // Animasi geser halus (ease-out ala iOS) lewat requestAnimationFrame
  var anim = null;
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
  function animateTo(x) {
    cancelAnimationFrame(anim);
    var from = track.scrollLeft, dist = x - from;
    if (Math.abs(dist) < 1 || reduce) { track.scrollLeft = x; return; }
    var dur = 700, t0 = null;
    track.style.scrollSnapType = 'none';
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      track.scrollLeft = from + dist * easeOut(p);
      if (p < 1) anim = requestAnimationFrame(step);
      else track.style.scrollSnapType = '';
    }
    anim = requestAnimationFrame(step);
  }
  function goTo(i, user) {
    index = (i + slides.length) % slides.length;
    animateTo(slides[index].offsetLeft - track.offsetLeft);
    markActive();
    if (user) restart();
  }

  function markActive() {
    dots.forEach(function (d, k) { d.classList.toggle('active', k === index); });
  }

  var scrollTick = null;
  track.addEventListener('scroll', function () {
    clearTimeout(scrollTick);
    scrollTick = setTimeout(function () {
      var best = 0, dist = Infinity;
      slides.forEach(function (s, k) {
        var d = Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (d < dist) { dist = d; best = k; }
      });
      index = best;
      markActive();
    }, 60);
  }, { passive: true });


  // Geser manual: sentuh (HP) sudah native; di desktop pakai drag mouse
  (function () {
    var down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('touchstart', function () { cancelAnimationFrame(anim); track.style.scrollSnapType = ''; }, { passive: true });
    track.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      cancelAnimationFrame(anim);
      track.style.scrollSnapType = 'none';
      track.classList.add('dragging');
    });
    window.addEventListener('mousemove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('mouseup', function (e) {
      if (!down) return;
      down = false;
      track.classList.remove('dragging');
      var dx = e.clientX - startX;
      var next = index;
      if (dx < -50) next = index + 1; else if (dx > 50) next = index - 1;
      track.style.scrollSnapType = '';
      goTo(next, true);
    });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
  })();

  // Autoplay (berhenti saat disentuh/di-hover/tab tidak aktif / reduced-motion)
  var reduce = false; // banner tetap bergerak otomatis walau animasi sistem dimatikan
  function restart() {
    clearInterval(timer);
    if (slides.length < 2) return;
    timer = setInterval(function () {
      if (!paused && !document.hidden) goTo(index + 1, false);
    }, 3000);
  }
  ['touchstart'].forEach(function (ev) {
    section.addEventListener(ev, function () { paused = true; }, { passive: true });
  });
  ['touchend', 'touchcancel'].forEach(function (ev) {
    section.addEventListener(ev, function () { paused = false; }, { passive: true });
  });

  build();
  restart();

  // Ikut berganti bahasa (applyLanguage memanggil applyCatalogTranslations)
  var origApply = window.applyCatalogTranslations;
  window.applyCatalogTranslations = function () {
    if (typeof origApply === 'function') origApply.apply(this, arguments);
    refreshText();
  };
  window.refreshPromoBanner = refreshText;
})();
