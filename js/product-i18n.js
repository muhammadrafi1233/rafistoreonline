// Terjemahan nama/deskripsi produk
(function () {
  // Peta terjemahan per slug produk. Kalau admin menambah produk baru
  // lewat panel admin, cukup tambahkan entrinya di sini supaya ikut
  // punya versi Inggris — kalau tidak ada di peta ini, teks dari
  // Supabase (Bahasa Indonesia) akan tetap tampil apa adanya.
  var productI18n = {
    'barn-item': {
      name: { id: 'Paket Lumbung', en: 'Barn Item' },
      desc: { id: 'Item untuk kebutuhan upgrade barn Hayday. Harga terbaik untuk pembelian 30+ set.', en: 'Item for Hay Day barn upgrades. Best price for purchases of 30+ sets.' }
    },
    'silo-item': {
      name: { id: 'Paket Silo', en: 'Silo Item' },
      desc: { id: 'Item untuk kebutuhan upgrade silo Hayday. Harga terbaik untuk pembelian 30+ set.', en: 'Item for Hay Day silo upgrades. Best price for purchases of 30+ sets.' }
    },
    'land-expansion-item': {
      name: { id: 'Paket Lahan', en: 'Land Expansion Item' },
      desc: { id: 'Item untuk perluasan lahan farm Hayday. Harga terbaik untuk pembelian 30+ set.', en: 'Item for Hay Day farm land expansion. Best price for purchases of 30+ sets.' }
    },
    'bahan-susu': {
      name: { id: 'Bahan Susu', en: 'Dairy Materials' },
      desc: { id: 'Pilih per item: Krim, Mentega, Keju, Susu Kambing. Minimal pembelian 50 pcs per item.', en: 'Choose per item: Cream, Butter, Cheese, Goat Milk. Minimum purchase 50 pcs per item.' }
    },
    'bahan-gula': {
      name: { id: 'Bahan Gula', en: 'Sugar Materials' },
      desc: { id: 'Pilih per item: Gula Cokelat, Gula Putih, Syrup. Minimal pembelian 50 pcs per item.', en: 'Choose per item: Brown Sugar, White Sugar, Syrup. Minimum purchase 50 pcs per item.' }
    },
    'bahan-laut': {
      name: { id: 'Bahan Laut', en: 'Seafood Materials' },
      desc: { id: 'Pilih per item: Ikan, Lobster, Bulu Bebek. Minimal pembelian 50 pcs per item.', en: 'Choose per item: Fish, Lobster, Duck Feather. Minimum purchase 50 pcs per item.' }
    },
    'bahan-madu': {
      name: { id: 'Bahan Madu', en: 'Honey Materials' },
      desc: { id: 'Pilih per item: Sarang Madu, Madu, Lilin Lebah. Minimal pembelian 50 pcs per item.', en: 'Choose per item: Honeycomb, Honey, Beeswax. Minimum purchase 50 pcs per item.' }
    },
    'bahan-tambang': {
      name: { id: 'Bahan Tambang', en: 'Mining Materials' },
      desc: { id: 'Pilih per item: Silver, Gold, Platinum, Besi, Baja. Minimal pembelian 50 pcs per item, tidak bisa dicampur.', en: 'Choose per item: Silver, Gold, Platinum, Iron, Steel. Minimum purchase 50 pcs per item, cannot be mixed.' }
    },
    'bahan-alat': {
      name: { id: 'Bahan Alat', en: 'Tool Materials' },
      desc: { id: 'Pilih per item: Gergaji, Kapak, TNT, Dinamit, Sekop (Rp1.000), Pickaxe (Rp3.000). Minimal pembelian 50 pcs per item.', en: 'Choose per item: Saw, Axe, TNT, Dynamite, Shovel (Rp1,000), Pickaxe (Rp3,000). Minimum purchase 50 pcs per item.' }
    },
    'voucher-1000-pcs-hayday': {
      name: { id: 'Voucher 1000 Pcs Hayday', en: 'Voucher 1000 Pcs Hayday' },
      desc: { id: 'Cocok untuk kebutuhan hewan dan dekorasi Hayday. Praktis dalam satu paket, tinggal order dan langsung diproses..', en: 'Great for animal and decoration needs in Hay Day. All in one convenient package \u2014 just order and it\u2019s processed right away.' }
    },
    'coin-hayday-level-40-plus': {
      name: { id: 'Coin Hayday Level 40+', en: 'Coin Hayday Level 40+' },
      desc: { id: 'Untuk player level 40 ke atas. Kelipatan 1 juta, bisa sampai 10 juta coin.', en: 'For players level 40 and above. Sold in multiples of 1 million, up to 10 million coins.' }
    },
    'coin-hayday-level-25-39': {
      name: { id: 'Coin Hayday Level 25-39', en: 'Coin Hayday Level 25-39' },
      desc: { id: 'Untuk player level 25-39. Kelipatan 500 ribu, bisa sampai 10 juta coin.', en: 'For players level 25-39. Sold in multiples of 500 thousand, up to 10 million coins.' }
    },
    'akun-player-hayday': {
      name: { id: 'Akun Player Hayday', en: 'Hayday Player Account' },
      desc: { id: 'Akun player Hayday, bisa disesuaikan dengan budget dan spek yang kamu mau.', en: 'Hay Day player account, can be customized to your budget and specs.' }
    },
    'akun-gudang-hayday': {
      name: { id: 'Akun Gudang Hayday', en: 'Hayday Warehouse Account' },
      desc: { id: 'Akun gudang Hayday, bisa disesuaikan dengan budget dan spek yang kamu mau.', en: 'Hay Day warehouse account, can be customized to your budget and specs.' }
    }
  };
  window.productI18n = productI18n;

  // Cari entri terjemahan berdasarkan nama produk (Bahasa Indonesia atau Inggris),
  // dipakai untuk menerjemahkan judul modal yang isinya nama produk (mis. "Request Barn Item").
  function findProductEntry(name) {
    if (!name) return null;
    var clean = String(name).trim();
    for (var slug in productI18n) {
      var entry = productI18n[slug];
      if (entry.name.id === clean || entry.name.en === clean) return entry;
    }
    return null;
  }

  // Terjemahkan nama produk untuk ditampilkan di judul modal, dsb.
  // Kalau produknya tidak ada di peta (mis. produk baru dari admin), nama asli dikembalikan apa adanya.
  window.trProductName = function (name) {
    var lang = (typeof window.getSiteLang === 'function') ? window.getSiteLang() : 'id';
    var entry = findProductEntry(name);
    if (!entry) return name;
    return entry.name[lang] || entry.name.id || name;
  };

  // Terapkan terjemahan ke semua kartu produk di katalog (baik teks statis
  // dari HTML maupun yang baru di-load/di-update dari Supabase).
  window.applyCatalogTranslations = function () {
    var lang = (typeof window.getSiteLang === 'function') ? window.getSiteLang() : 'id';
    document.querySelectorAll('.card[data-product-slug]').forEach(function (card) {
      var slug = card.getAttribute('data-product-slug');
      var entry = productI18n[slug];
      if (!entry) return;
      var h = card.querySelector('h2');
      var d = card.querySelector('.desc');
      if (h && entry.name) h.textContent = entry.name[lang] || entry.name.id;
      if (d && entry.desc) d.textContent = entry.desc[lang] || entry.desc.id;
    });
  };
})();
