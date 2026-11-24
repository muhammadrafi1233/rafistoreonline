// Bahasa ID/EN (switcher & terjemahan UI)
(function () {
  var LANG_KEY = 'rafiHaydaySiteLang';
  var SUPPORTED_LANGS = ['id', 'en'];

  var translations = {
    id: {
      'header.menuAria': 'Buka menu',
      'header.menuTitle': 'Menu',
      'header.closeMenuAria': 'Tutup menu',
      'header.searchAria': 'Cari produk',
      'header.wishlistLabel': 'Wishlist',
      'header.adminLabel': 'Admin',
      'bnav.tutorial': 'Tutorial',
      'bnav.testimoni': 'Testimoni',
      'catalog.seeAll': 'Lihat semua',
      'promo.aria': 'Promo',
      'promo.buyNow': 'Beli Sekarang',
      'promo.slide': 'Banner {n}',
      'promo.prev': 'Sebelumnya',
      'promo.next': 'Berikutnya',
      'label.save': 'Hemat s/d {pct}%',
      'label.sold': 'Habis',
      'label.limited': 'Terbatas',
      'header.tagline': '✨ Jual Kebutuhan Hay Day Lengkap & Murah! ✨',
      'header.searchPlaceholder': 'Cari produk...',
      'search.notFound': 'Produk tidak ditemukan untuk "{q}"',
      'header.wishlistTitle': 'Wishlist Kamu',
      'header.wishlistEmpty': 'Belum ada produk di wishlist kamu.',
      'header.profilePlaceholder': 'Fitur akun sedang disiapkan. Order tetap lewat WhatsApp seperti biasa 🙌',
      'nav.katalog': 'Katalog',
      'nav.tutorial': 'Tutorial Beli',
      'nav.testimoni': 'Testimoni Pembeli',
      'nav.kalkulator': 'Kalkulator',
      'calc.title': 'Kalkulator Barn & Silo',
      'calc.sub': 'Hitung material upgrade dari kapasitas sekarang ke target.',
      'calc.cur': 'Kapasitas sekarang',
      'calc.tgt': 'Kapasitas target',
      'calc.valid': 'Kapasitas valid: 50–1000 naik per 25, lalu di atas 1000 naik per 50.',
      'welcome.title': 'Selamat Datang di RAFI HAYDAY',
      'welcome.desc': 'Sebelum mulai berbelanja, lihat tutorial singkat agar proses order lebih mudah.',
      'welcome.btnTutorial': 'Lihat Tutorial',
      'welcome.btnUnderstand': 'Sudah Mengerti',
      'help.aria': 'Buka tutorial',
      'cart.title': 'Keranjang Belanja',
      'cart.buyerNameLabel': 'Nama Pembeli',
      'cart.buyerNamePlaceholder': 'Contoh: Rafi',
      'cart.checkoutBtn': 'Checkout Semua via WhatsApp',
      'cart.smallNote': 'Item keranjang otomatis dikirim ke WhatsApp admin.',
      'cart.empty': 'Keranjang masih kosong. Pilih produk dulu dari katalog ya.',
      'cart.qtyPrefix': 'Jumlah: ',
      'cart.needConfirm': '*Ada item perlu konfirmasi admin.',
      'cart.pcsUnit': 'pcs',
      'catalog.addToCartBtn': 'Tambah ke Keranjang',
      'common.addToCartTitle': 'Tambah ke Keranjang',
      'common.addToCartBtnModal': 'Masukkan ke Keranjang',
      'common.outOfStock': 'Stok Habis',
      'order.qtyLabel': 'Jumlah Pesanan',
      'order.smallNote': 'Produk akan masuk ke keranjang dulu. Kamu bisa pilih produk lain, lalu checkout semua sekaligus lewat WhatsApp.',
      'bulk.qtyLabel': 'Jumlah Set',
      'alert.qtyMin1': 'Jumlah wajib diisi minimal 1 ya.',
      'alert.addedToCart': 'Produk berhasil masuk ke keranjang.',
      'alert.addedToCartFull': 'Produk berhasil masuk ke keranjang. Kamu bisa pilih produk lain atau checkout lewat tombol Keranjang.',
      'alert.addedToCartDiscount': 'Produk berhasil masuk ke keranjang dengan harga diskon!',
      'alert.buyerNameRequired': 'Nama pembeli wajib diisi ya.',
      'alert.cartEmpty': 'Keranjang masih kosong. Pilih produk dulu ya.',
      'alert.qtySetMin1': 'Jumlah set wajib diisi minimal 1 ya.',
      'alert.bahanMinMultiple': 'Jumlah tiap item yang dipilih minimal {min} pcs ya.',
      'alert.bahanInvalid': 'Jumlah item belum sesuai minimal/kelipatannya.',
      'alert.pickOneItem': 'Pilih minimal 1 item dulu ya.',
      'alert.pickCoinAmount': 'Pilih jumlah coin dulu ya.',
      'alert.allFieldsRequired': 'Semua field wajib diisi ya.',
      'alert.testiFieldsRequired': 'Semua field wajib diisi, termasuk rating bintangnya ya.',
      'alert.testiThanksSheets': 'Terima kasih! Testimoni kamu sudah dikirim ke admin dan akan dicek dulu sebelum ditampilkan.',
      'alert.testiThanksLocal': 'Terima kasih! Link Google Sheets belum diisi, jadi testimoni baru tersimpan di browser ini dulu.',
      'aria.decreaseQty': 'Kurangi jumlah',
      'aria.increaseQty': 'Tambah jumlah',
      'aria.removeItem': 'Hapus item',
      'common.total': 'Total',
      'common.close': 'Tutup',
      'nav.backToMenu': '← Kembali ke Menu',
      'catalog.title': 'Katalog',
      'catalog.desc': 'Klik salah satu menu, lalu pilih katalog yang mau kamu order.',
      'menu.item.title': 'Item Upgrade',
      'menu.item.desc': 'Item upgrade barn, silo, dan perluasan farm.',
      'menu.bahanalat.title': 'Bahan & Alat',
      'menu.bahanalat.desc': 'Bahan dasar, hasil panen, dan alat kebutuhan farm.',
      'menu.voucher.title': 'Voucher',
      'menu.voucher.desc': 'Paket voucher Hayday untuk kebutuhan dekorasi dan item khusus.',
      'menu.coin.title': 'Coin Hayday',
      'menu.coin.desc': 'Katalog coin Hayday dengan pilihan paket berbeda.',
      'menu.akun.title': 'Akun Hayday',
      'menu.akun.desc': 'Katalog akun Hayday yang tersedia untuk dibeli.',
      'section.item.title': 'Item Upgrade',
      'section.bahanalat.title': 'Bahan & Alat',
      'section.bahanalat.desc': 'Minimal pembelian Bahan & Alat mulai dari 50 pcs per item.',
      'section.voucher.title': 'Voucher Hayday',
      'section.voucher.desc': 'Satu katalog voucher Hayday untuk kebutuhan dekorasi dan item khusus.',
      'section.coin.title': 'Coin Hayday',
      'section.coin.desc': 'Pilih jumlah coin sesuai kebutuhan (kelipatan sampai 10 juta). Ada juga opsi jasa kalau mau dibantu proses.',
      'section.akun.title': 'Akun Hayday',
      'testi.ctaText': 'Masih ragu? Lihat langsung pengalaman pembeli lain 👇',
      'testi.ctaLink': '⭐ Lihat Testimoni Pembeli',
      'testi.desc': 'Sudah banyak order dari berbagai negara untuk item, coin, dan akun Hay Day.',
      'testi.sub': 'Order item, coin, dan akun Hay Day sudah diproses untuk pembeli dari berbagai negara.',
      'testi.igBtn': '📸 Lihat Bukti Order di Instagram',
      'testi.addYours': 'Tambah Testimoni Kamu',
      'testi.formTitle': 'Tulis Testimoni',
      'testi.nameLabel': 'Nama Kamu',
      'testi.productLabel': 'Produk yang Dibeli',
      'testi.ratingLabel': 'Rating',
      'testi.ratingHint': 'Klik bintang untuk kasih rating',
      'testi.textLabel': 'Testimoni Kamu',
      'testi.textPlaceholder': 'Ceritakan pengalaman belanja kamu',
      'testi.submitBtn': 'Kirim Testimoni',
      'testi.newBuyerTag': 'Pembeli Baru',
      'tutorial.title': '📋 Tutorial Cara Beli',
      'tutorial.desc': 'Pilih tipe tutorial di bawah untuk melihat panduan lengkapnya.',
      'tutorial.upgradeLine1': 'Tutorial',
      'tutorial.upgradeLine2': 'Alat Upgrade',
      'tutorial.upgradeSub': 'Paket Lumbung · Silo · Lahan',
      'tutorial.coinLine1': 'Tutorial',
      'tutorial.coinLine2': 'Koin',
      'tutorial.coinSub': 'Coin Hayday Level 25+',
      'tutorial.pressToView': 'Tekan untuk lihat ▶',
      'tutorial.ctaTitle': 'Sudah paham cara ordernya?',
      'tutorial.ctaDesc': 'Langsung pilih produk dan checkout sekarang — admin siap melayani!',
      'tutorial.ctaOrderBtn': '☎ Order via WhatsApp',
      'tutorial.ctaCatalogBtn': '🛒 Ke Katalog',
      'tutorial.tabVideo': '🎬 Video',
      'tutorial.tabSteps': '📋 Langkah',
      'tutorial.askAdmin': '☎ Tanya Admin Langsung',
      'order.qtyPlaceholder': 'Contoh: 2',
      'order.selectedLabel': 'Produk dipilih:',
      'bulk.qtyPlaceholder': 'Contoh: 10',
      'coin.qtyLabel': 'Jumlah Coin',
      'coin.jasaLabel': 'Pakai Jasa (dikerjakan admin)',
      'akun.categoryLabel': 'Kategori dipilih:',
      'akun.nameLabel': 'Nama Kamu',
      'akun.budgetLabel': 'Budget Kamu (Rp)',
      'akun.budgetPlaceholder': 'Contoh: 150000',
      'akun.specLabel': 'Spesifikasi yang Diinginkan',
      'akun.specPlaceholder': 'Contoh: Level tinggi, gudang penuh, dekorasi lengkap',
      'akun.submitBtn': 'Kirim Request ke Admin',
      'akun.note': 'Request ini langsung dikirim ke WhatsApp admin, nanti dicarikan akun sesuai budget dan spek kamu.',
      'akun.requestPrefix': 'Request ',
      'cart.floatingLabel': 'Keranjang',
      'stock.loading': 'Stok: memuat...',
      'stock.outOfStock': '❌ Stok Habis',
      'stock.low': '⚠️ Stok terbatas: {n}',
      'stock.inStock': '✅ Stok: {n}',
      'stock.outOfStockBtn': 'Stok Habis',
      'footer.text': '© Jual item, coin, dan akun Hay Day dengan proses cepat, mudah, dan amanah. Klik WhatsApp untuk cek stok dan langsung order..',
      'tutorial.videoClickLabel': 'Klik untuk putar video tutorial',
      'akun.requestBtn': 'Request Sesuai Budget',
      'common.namePlaceholder': 'Contoh: Rafi',
      'testi.productPlaceholder': 'Contoh: Coin Hayday Level 40+'
    },
    en: {
      'header.menuAria': 'Open menu',
      'header.menuTitle': 'Menu',
      'header.closeMenuAria': 'Close menu',
      'header.searchAria': 'Search products',
      'header.wishlistLabel': 'Wishlist',
      'header.adminLabel': 'Admin',
      'bnav.tutorial': 'Guide',
      'bnav.testimoni': 'Reviews',
      'catalog.seeAll': 'See all',
      'promo.aria': 'Promotions',
      'promo.buyNow': 'Buy Now',
      'promo.slide': 'Banner {n}',
      'promo.prev': 'Previous',
      'promo.next': 'Next',
      'label.save': 'Save up to {pct}%',
      'label.sold': 'Sold out',
      'label.limited': 'Limited',
      'header.tagline': '✨ All Your Hay Day Needs, Complete & Affordable! ✨',
      'header.searchPlaceholder': 'Search products...',
      'search.notFound': 'No products found for "{q}"',
      'header.wishlistTitle': 'Your Wishlist',
      'header.wishlistEmpty': 'No products in your wishlist yet.',
      'header.profilePlaceholder': "Account features are coming soon. Orders still go through WhatsApp as usual 🙌",
      'nav.katalog': 'Catalog',
      'nav.tutorial': 'How to Order',
      'nav.testimoni': 'Buyer Reviews',
      'nav.kalkulator': 'Calculator',
      'calc.title': 'Barn & Silo Calculator',
      'calc.sub': 'Calculate upgrade materials from your current capacity to your target.',
      'calc.cur': 'Current capacity',
      'calc.tgt': 'Target capacity',
      'calc.valid': 'Valid capacity: 50–1000 in steps of 25, then above 1000 in steps of 50.',
      'welcome.title': 'Welcome to RAFI HAYDAY',
      'welcome.desc': 'Before you start shopping, check out this quick tutorial to make ordering easier.',
      'welcome.btnTutorial': 'View Tutorial',
      'welcome.btnUnderstand': 'Got It',
      'help.aria': 'Open tutorial',
      'cart.title': 'Shopping Cart',
      'cart.buyerNameLabel': 'Buyer Name',
      'cart.buyerNamePlaceholder': 'e.g. Rafi',
      'cart.checkoutBtn': 'Checkout via WhatsApp',
      'cart.smallNote': 'Cart items are sent automatically to the admin via WhatsApp.',
      'cart.empty': 'Your cart is empty. Pick a product from the catalog first.',
      'cart.qtyPrefix': 'Qty: ',
      'cart.needConfirm': '*Some items need admin confirmation.',
      'cart.pcsUnit': 'pcs',
      'catalog.addToCartBtn': 'Add to Cart',
      'common.addToCartTitle': 'Add to Cart',
      'common.addToCartBtnModal': 'Add to Cart',
      'common.outOfStock': 'Out of Stock',
      'order.qtyLabel': 'Order Quantity',
      'order.smallNote': 'The product will be added to your cart first. You can pick more products, then check out everything at once via WhatsApp.',
      'bulk.qtyLabel': 'Number of Sets',
      'alert.qtyMin1': 'Quantity must be at least 1.',
      'alert.addedToCart': 'Product added to cart.',
      'alert.addedToCartFull': 'Product added to cart. You can pick more products or check out via the Cart button.',
      'alert.addedToCartDiscount': 'Product added to cart at a discounted price!',
      'alert.buyerNameRequired': 'Buyer name is required.',
      'alert.cartEmpty': 'Your cart is empty. Please pick a product first.',
      'alert.qtySetMin1': 'Number of sets must be at least 1.',
      'alert.bahanMinMultiple': 'Each selected item quantity must be at least {min} pcs.',
      'alert.bahanInvalid': 'The item quantity doesn\u2019t match the minimum/multiple required.',
      'alert.pickOneItem': 'Please pick at least 1 item first.',
      'alert.pickCoinAmount': 'Please pick a coin amount first.',
      'alert.allFieldsRequired': 'All fields are required.',
      'alert.testiFieldsRequired': 'All fields are required, including the star rating.',
      'alert.testiThanksSheets': 'Thank you! Your review has been sent to the admin and will be checked before it appears.',
      'alert.testiThanksLocal': 'Thank you! The Google Sheets link isn\u2019t set up yet, so your review is saved in this browser for now.',
      'aria.decreaseQty': 'Decrease quantity',
      'aria.increaseQty': 'Increase quantity',
      'aria.removeItem': 'Remove item',
      'common.total': 'Total',
      'common.close': 'Close',
      'nav.backToMenu': '← Back to Menu',
      'catalog.title': 'Catalog',
      'catalog.desc': 'Click a menu, then pick the catalog you want to order from.',
      'menu.item.title': 'Item Upgrade',
      'menu.item.desc': 'Upgrade items for barn, silo, and farm expansion.',
      'menu.bahanalat.title': 'Materials & Tools',
      'menu.bahanalat.desc': 'Base materials, harvests, and tools for your farm.',
      'menu.voucher.title': 'Voucher',
      'menu.voucher.desc': 'Hayday voucher packages for decorations and special items.',
      'menu.coin.title': 'Coin Hayday',
      'menu.coin.desc': 'Hayday coin catalog with different package options.',
      'menu.akun.title': 'Hayday Account',
      'menu.akun.desc': 'Hayday accounts available for purchase.',
      'section.item.title': 'Item Upgrade',
      'section.bahanalat.title': 'Materials & Tools',
      'section.bahanalat.desc': 'Minimum purchase for Materials & Tools starts at 50 pcs per item.',
      'section.voucher.title': 'Hayday Voucher',
      'section.voucher.desc': 'One Hayday voucher catalog for decorations and special items.',
      'section.coin.title': 'Coin Hayday',
      'section.coin.desc': 'Pick a coin amount to suit your needs (multiples up to 10 million). A processing service option is also available.',
      'section.akun.title': 'Hayday Account',
      'testi.ctaText': 'Still not sure? See other buyers\u2019 experiences directly 👇',
      'testi.ctaLink': '⭐ See Buyer Reviews',
      'testi.desc': 'Already many orders from various countries for items, coins, and Hay Day accounts.',
      'testi.sub': 'Orders for items, coins, and Hay Day accounts have been processed for buyers from various countries.',
      'testi.igBtn': '📸 See Order Proof on Instagram',
      'testi.addYours': 'Add Your Review',
      'testi.formTitle': 'Write a Review',
      'testi.nameLabel': 'Your Name',
      'testi.productLabel': 'Product Purchased',
      'testi.ratingLabel': 'Rating',
      'testi.ratingHint': 'Click a star to give a rating',
      'testi.textLabel': 'Your Review',
      'testi.textPlaceholder': 'Tell us about your shopping experience',
      'testi.submitBtn': 'Submit Review',
      'testi.newBuyerTag': 'New Buyer',
      'tutorial.title': '📋 How to Order Tutorial',
      'tutorial.desc': 'Pick a tutorial type below to see the full guide.',
      'tutorial.upgradeLine1': 'Upgrade Tool',
      'tutorial.upgradeLine2': 'Tutorial',
      'tutorial.upgradeSub': 'Barn · Silo · Land Item',
      'tutorial.coinLine1': 'Coin',
      'tutorial.coinLine2': 'Tutorial',
      'tutorial.coinSub': 'Coin Hayday Level 25+',
      'tutorial.pressToView': 'Tap to view ▶',
      'tutorial.ctaTitle': 'Already know how to order?',
      'tutorial.ctaDesc': 'Pick a product and check out right now — the admin is ready to help!',
      'tutorial.ctaOrderBtn': '☎ Order via WhatsApp',
      'tutorial.ctaCatalogBtn': '🛒 Go to Catalog',
      'tutorial.tabVideo': '🎬 Video',
      'tutorial.tabSteps': '📋 Steps',
      'tutorial.askAdmin': '☎ Ask the Admin Directly',
      'order.qtyPlaceholder': 'e.g. 2',
      'order.selectedLabel': 'Selected product:',
      'bulk.qtyPlaceholder': 'e.g. 10',
      'coin.qtyLabel': 'Coin Amount',
      'coin.jasaLabel': 'Use Service (handled by admin)',
      'akun.categoryLabel': 'Selected category:',
      'akun.nameLabel': 'Your Name',
      'akun.budgetLabel': 'Your Budget (Rp)',
      'akun.budgetPlaceholder': 'e.g. 150000',
      'akun.specLabel': 'Desired Specifications',
      'akun.specPlaceholder': 'e.g. High level, full warehouse, complete decorations',
      'akun.submitBtn': 'Send Request to Admin',
      'akun.note': 'This request is sent directly to the admin\u2019s WhatsApp, and an account matching your budget and specs will be arranged.',
      'akun.requestPrefix': 'Request ',
      'cart.floatingLabel': 'Cart',
      'stock.loading': 'Stock: loading...',
      'stock.outOfStock': '❌ Out of Stock',
      'stock.low': '⚠️ Limited stock: {n}',
      'stock.inStock': '✅ In stock: {n}',
      'stock.outOfStockBtn': 'Out of Stock',
      'footer.text': '© Selling Hay Day items, coins, and accounts with a fast, easy, and trustworthy process. Click WhatsApp to check stock and order right away.',
      'tutorial.videoClickLabel': 'Click to play the tutorial video',
      'akun.requestBtn': 'Request by Budget',
      'common.namePlaceholder': 'e.g. Rafi',
      'testi.productPlaceholder': 'e.g. Coin Hayday Level 40+'
    }
  };

  function getCurrentLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    return null;
  }

  function detectDefaultLang() {
    var nav = ((navigator.language || navigator.userLanguage || '') + '').toLowerCase();
    if (nav.indexOf('id') === 0) return 'id';
    if (nav.indexOf('en') === 0) return 'en';
    return 'id';
  }

  window.currentSiteLang = getCurrentLang() || detectDefaultLang();

  function t(key, vars) {
    var lang = window.currentSiteLang || 'id';
    var dict = translations[lang] || translations.id;
    var str = key;
    if (dict && Object.prototype.hasOwnProperty.call(dict, key)) str = dict[key];
    else if (translations.id && Object.prototype.hasOwnProperty.call(translations.id, key)) str = translations.id[key];
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return str;
  }
  window.t = t;
  window.getSiteLang = function () { return window.currentSiteLang || 'id'; };

  function applyLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = 'id';
    window.currentSiteLang = lang;

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', t(key));
    });

    var flagEl = document.getElementById('langSwitcherFlag');
    var codeEl = document.getElementById('langSwitcherCode');
    if (flagEl) flagEl.textContent = lang === 'en' ? '🇬🇧' : '🇮🇩';
    if (codeEl) codeEl.textContent = lang.toUpperCase();

    document.querySelectorAll('.lang-option').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Render ulang konten keranjang (dibuat lewat JS) supaya ikut berganti bahasa
    if (typeof window.renderCart === 'function') {
      try { window.renderCart(); } catch (e) {}
    }

    // Terjemahkan nama/deskripsi produk katalog (statis maupun hasil sync Supabase)
    if (typeof window.applyCatalogTranslations === 'function') {
      try { window.applyCatalogTranslations(); } catch (e) {}
    }
  }
  window.applyLanguage = applyLanguage;

  function initLangSwitcher() {
    var btn = document.getElementById('langSwitcherBtn');
    var menu = document.getElementById('langSwitcherMenu');

    if (btn && menu) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.querySelectorAll('.lang-option').forEach(function (opt) {
        opt.addEventListener('click', function () {
          applyLanguage(opt.getAttribute('data-lang'));
          menu.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', function (e) {
        if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== btn) {
          menu.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    applyLanguage(window.currentSiteLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangSwitcher);
  } else {
    initLangSwitcher();
  }
})();
