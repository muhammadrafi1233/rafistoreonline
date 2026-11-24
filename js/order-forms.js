// Form order: produk biasa, bulk, bahan, coin, akun custom
function openOrderForm(productName) {
  if (tutorialPopup) tutorialPopup.classList.remove('show');
  if (floatingHelp) floatingHelp.classList.add('show');

  selectedProduct.value = productName;
  selectedProductText.textContent = (typeof window.trProductName === 'function') ? window.trProductName(productName) : productName;
  orderQty.value = '';
  orderModal.classList.add('active');

  setTimeout(function () {
    orderQty.focus();
  }, 100);
}

function closeOrderForm() {
  orderModal.classList.remove('active');
}

const simpleProductConfig = {
  'Voucher Hayday': { price: 100000 }
};

function addOrderToCart(event) {
  event.preventDefault();

  const qty = parseInt(orderQty.value.trim(), 10);
  const product = selectedProduct.value.trim();

  if (!qty || qty < 1 || !product) {
    alert(tr('alert.qtyMin1', 'Jumlah pesanan wajib diisi minimal 1 ya.'));
    return;
  }

  const cfg = simpleProductConfig[product];

  const existingItem = cartItems.find(function (item) {
    return item.product === product;
  });

  if (existingItem) {
    existingItem.qty += qty;
    if (cfg) {
      existingItem._priceType = 'simple';
      existingItem._key = product;
      existingItem._qty = existingItem.qty;
      existingItem.subtotal = existingItem.qty * Number(cfg.price || 0);
    }
  } else if (cfg) {
    cartItems.push({
      product: product,
      qty: qty,
      subtotal: qty * Number(cfg.price || 0),
      _priceType: 'simple',
      _key: product,
      _qty: qty
    });
  } else {
    cartItems.push({ product: product, qty: qty });
  }

  const orderOriginBtn = event.submitter || event.target.querySelector('.order-submit-btn') || event.target;
  flyToCart(orderOriginBtn);

  saveCart();
  closeOrderForm();
  setTimeout(function () {
    alert(tr('alert.addedToCartFull', 'Produk berhasil masuk ke keranjang. Kamu bisa pilih produk lain atau checkout lewat tombol Keranjang.'));
  }, 650);
}

/* ============================================================
   FITUR HARGA BERTINGKAT: ITEM UPGRADE (BARN / SILO / LAND EXP)
   ============================================================ */
const bulkItemConfig = {
  'Barn Item': { base: 2500, tier7: 2300, tier30: 2000 },
  'Silo Item': { base: 3000, tier7: 2800, tier30: 2500 },
  'Land Expansion Item': { base: 3500, tier7: 3300, tier30: 3000 }
};

let currentBulkItem = null;
const bulkItemModal = document.getElementById('bulkItemModal');

function getBulkItemUnitPrice(productName, qty) {
  const cfg = bulkItemConfig[productName];
  if (!cfg) return 0;
  if (qty >= 30) return cfg.tier30;
  if (qty >= 7) return cfg.tier7;
  return cfg.base;
}

function openBulkItemForm(productName) {
  const cfg = bulkItemConfig[productName];
  if (!cfg) return;

  currentBulkItem = productName;
  document.getElementById('bulkItemProductText').textContent = (typeof window.trProductName === 'function') ? window.trProductName(productName) : productName;
  document.getElementById('bulkItemQty').value = '';

  const pctOff7 = Math.round((1 - cfg.tier7 / cfg.base) * 100);
  const pctOff30 = Math.round((1 - cfg.tier30 / cfg.base) * 100);

  document.getElementById('bulkItemTierBubbles').innerHTML =
    '<div class="tier-bubble" data-tier="base" onclick="selectBulkTier(\'base\')">' +
      '<span class="tier-bubble-range">1-6 set</span>' +
      '<span class="tier-bubble-price">' + formatRupiah(cfg.base) + '</span>' +
    '</div>' +
    '<div class="tier-bubble" data-tier="tier7" onclick="selectBulkTier(\'tier7\')">' +
      '<span class="tier-bubble-badge">-' + pctOff7 + '%</span>' +
      '<span class="tier-bubble-range">7-29 set</span>' +
      '<span class="tier-bubble-price">' + formatRupiah(cfg.tier7) + '</span>' +
    '</div>' +
    '<div class="tier-bubble" data-tier="tier30" onclick="selectBulkTier(\'tier30\')">' +
      '<span class="tier-bubble-badge">-' + pctOff30 + '%</span>' +
      '<span class="tier-bubble-range">30+ set</span>' +
      '<span class="tier-bubble-price">' + formatRupiah(cfg.tier30) + '</span>' +
    '</div>';

  updateBulkItemPreview();
  bulkItemModal.classList.add('active');

  setTimeout(function () {
    document.getElementById('bulkItemQty').focus();
  }, 100);
}

function closeBulkItemForm() {
  bulkItemModal.classList.remove('active');
}

function selectBulkTier(tier) {
  let qty = 1;
  if (tier === 'tier7') qty = 7;
  else if (tier === 'tier30') qty = 30;

  document.getElementById('bulkItemQty').value = qty;
  updateBulkItemPreview();
}

function updateBulkItemPreview() {
  const qty = parseInt(document.getElementById('bulkItemQty').value, 10) || 0;
  const cfg = bulkItemConfig[currentBulkItem];
  const unitPrice = getBulkItemUnitPrice(currentBulkItem, qty);
  const total = qty * unitPrice;
  document.getElementById('bulkItemLiveTotal').textContent =
    formatRupiah(total) + (qty ? ' (' + formatRupiah(unitPrice) + '/set)' : '');

  let activeTier = 'base';
  if (qty >= 30) activeTier = 'tier30';
  else if (qty >= 7) activeTier = 'tier7';

  document.querySelectorAll('#bulkItemTierBubbles .tier-bubble').forEach(function (b) {
    b.classList.toggle('active', qty > 0 && b.getAttribute('data-tier') === activeTier);
  });

  const savingsEl = document.getElementById('bulkItemSavings');
  if (qty > 0 && activeTier !== 'base' && cfg) {
    const normalTotal = qty * cfg.base;
    const savings = normalTotal - total;
    savingsEl.style.display = 'block';
    savingsEl.textContent = '🔥 Hemat ' + formatRupiah(savings) + ' dibanding harga normal!';
  } else {
    savingsEl.style.display = 'none';
  }
}

function addBulkItemToCart(event) {
  event.preventDefault();

  const qty = parseInt(document.getElementById('bulkItemQty').value, 10);
  if (!qty || qty < 1) {
    alert(tr('alert.qtySetMin1', 'Jumlah set wajib diisi minimal 1 ya.'));
    return;
  }

  const cfg = bulkItemConfig[currentBulkItem];
  const unitPrice = getBulkItemUnitPrice(currentBulkItem, qty);
  const subtotal = qty * unitPrice;
  const isDiscounted = cfg && unitPrice < cfg.base;
  const discountLabel = isDiscounted ? ' 🔥Diskon' : '';

  cartItems.push({
    product: currentBulkItem + ' (' + qty + ' set x ' + formatRupiah(unitPrice) + ')' + discountLabel,
    qty: qty,
    subtotal: subtotal,
    _priceType: 'bulk',
    _key: currentBulkItem,
    _qty: qty
  });

  const activeTierBubble = document.querySelector('#bulkItemTierBubbles .tier-bubble.active');
  const bulkOriginBtn = activeTierBubble || event.submitter || event.target.querySelector('.order-submit-btn') || event.target;
  flyToCart(bulkOriginBtn);

  saveCart();
  closeBulkItemForm();
  setTimeout(function () {
    alert(isDiscounted ? tr('alert.addedToCartDiscount', 'Produk berhasil masuk ke keranjang dengan harga diskon!') : tr('alert.addedToCart', 'Produk berhasil masuk ke keranjang.'));
  }, 650);
}

/* ============================================================
   FITUR MULTI-ITEM: BAHAN (LAUT / MADU / TAMBANG / ALAT)
   ============================================================ */
const bahanMultiConfig = {
  'Bahan Susu': {
    minMultiple: 50,
    items: [
      { name: 'Krim', price: 2000 },
      { name: 'Mentega', price: 2000 },
      { name: 'Keju', price: 2000 },
      { name: 'Susu Kambing', price: 2000 }
    ]
  },
  'Bahan Gula': {
    minMultiple: 50,
    items: [
      { name: 'Gula Cokelat', price: 2000 },
      { name: 'Gula Putih', price: 2000 },
      { name: 'Syrup', price: 2000 }
    ]
  },
  'Bahan Laut': {
    minMultiple: 50,
    items: [
      { name: 'Ikan', price: 2500 },
      { name: 'Lobster', price: 3500 },
      { name: 'Bulu Bebek', price: 3500 }
    ]
  },
  'Bahan Madu': {
    minMultiple: 50,
    items: [
      { name: 'Sarang Madu', price: 2500 },
      { name: 'Madu', price: 3500 },
      { name: 'Lilin Lebah', price: 4000 }
    ]
  },
  'Bahan Tambang': {
    minMultiple: 50,
    items: [
      { name: 'Silver', price: 2500 },
      { name: 'Gold', price: 2500 },
      { name: 'Platinum', price: 2500 },
      { name: 'Besi', price: 2500 },
      { name: 'Baja', price: 2500 }
    ]
  },
  'Bahan Alat': {
    minMultiple: 50,
    items: [
      { name: 'Gergaji', price: 1000 },
      { name: 'Kapak', price: 1000 },
      { name: 'TNT', price: 1000 },
      { name: 'Dinamit', price: 1000 },
      { name: 'Sekop', price: 1000 },
      { name: 'Pickaxe', price: 3000 }
    ]
  }
};

let currentBahanCategory = null;
const bahanMultiModal = document.getElementById('bahanMultiModal');

function openBahanMultiForm(categoryName) {
  const cfg = bahanMultiConfig[categoryName];
  if (!cfg) {
    alert('Katalog ini belum tersedia, hubungi admin ya.');
    return;
  }

  currentBahanCategory = categoryName;
  document.getElementById('bahanMultiTitle').textContent = (typeof window.trProductName === 'function') ? window.trProductName(categoryName) : categoryName;
  document.getElementById('bahanMultiInfo').innerHTML =
    'Minimal beli <strong>' + cfg.minMultiple + ' pcs</strong> untuk tiap item yang dipilih. Total otomatis menyesuaikan jumlah pcs (tidak bisa digabung/mix antar item).';

  let rowsHtml = '';
  cfg.items.forEach(function (it, idx) {
    rowsHtml += '<div class="bahan-row">' +
      '<div>' +
      '<div class="bahan-row-name">' + escapeHtml(it.name) + '</div>' +
      '<div class="bahan-row-price">' + formatRupiah(it.price) + '</div>' +
      '</div>' +
      '<input type="number" class="bahan-row-qty-input" id="bahanQty_' + idx + '" min="0" step="' + cfg.minMultiple + '" placeholder="0" oninput="updateBahanMultiPreview()" />' +
      '</div>';
  });
  document.getElementById('bahanMultiRows').innerHTML = rowsHtml;

  updateBahanMultiPreview();
  bahanMultiModal.classList.add('active');
}

function closeBahanMultiForm() {
  bahanMultiModal.classList.remove('active');
}

function updateBahanMultiPreview() {
  const cfg = bahanMultiConfig[currentBahanCategory];
  if (!cfg) return;

  let total = 0;
  cfg.items.forEach(function (it, idx) {
    const el = document.getElementById('bahanQty_' + idx);
    const qty = parseInt(el && el.value, 10) || 0;
    total += (qty / 100) * it.price;
  });

  document.getElementById('bahanMultiLiveTotal').textContent = formatRupiah(total);
}

function getBahanPriceOrigin(idx) {
  try {
    const rows = document.querySelectorAll('#bahanMultiRows .bahan-row');
    const row = rows[idx];
    if (!row) return null;
    return row.querySelector('.bahan-row-price') || row;
  } catch (e) {
    return null;
  }
}

function addBahanMultiToCart(event) {
  const cfg = bahanMultiConfig[currentBahanCategory];
  if (!cfg) return;

  const chosen = [];
  let invalid = false;

  cfg.items.forEach(function (it, idx) {
    const el = document.getElementById('bahanQty_' + idx);
    const qty = parseInt(el && el.value, 10) || 0;
    if (qty > 0) {
      if (cfg.minMultiple > 1 && qty < cfg.minMultiple) {
        invalid = true;
      }
      chosen.push({ name: it.name, qty: qty, price: it.price, idx: idx });
    }
  });

  if (invalid) {
    alert(tr('alert.bahanMinMultiple', 'Jumlah tiap item yang dipilih minimal ' + cfg.minMultiple + ' pcs ya.', { min: cfg.minMultiple }));
    return;
  }

  if (!chosen.length) {
    alert(tr('alert.pickOneItem', 'Pilih minimal 1 item dulu ya.'));
    return;
  }

  chosen.forEach(function (c) {
    cartItems.push({
      product: currentBahanCategory + ' - ' + c.name,
      qty: c.qty + ' pcs',
      subtotal: (c.qty / 100) * c.price,
      _priceType: 'bahan',
      _key: currentBahanCategory,
      _itemName: c.name,
      _qty: c.qty
    });
  });

  flyToCart(getBahanPriceOrigin(chosen[0].idx) || (event && event.currentTarget) || (event && event.target));

  saveCart();
  closeBahanMultiForm();
  setTimeout(function () {
    alert(tr('alert.addedToCart', 'Produk berhasil masuk ke keranjang.'));
  }, 650);
}

/* ============================================================
   FITUR COIN HAYDAY: JUMLAH KELIPATAN + JASA
   ============================================================ */
const coinConfig = {
  'Coin Hayday Level 25-39': { unitStep: 500000, unitPrice: 10000, jasaPerStep: 2000, maxAmount: 10000000 },
  'Coin Hayday Level 40+': { unitStep: 1000000, unitPrice: 9000, jasaPerStep: 2000, maxAmount: 10000000 }
};

let currentCoinProduct = null;
const coinModal = document.getElementById('coinModal');

function getCoinPricing(productName, amount, useJasa) {
  const cfg = coinConfig[productName];
  if (!cfg || !amount) return { base: 0, jasa: 0, total: 0 };
  const steps = amount / cfg.unitStep;
  const base = steps * cfg.unitPrice;
  const jasa = useJasa ? steps * cfg.jasaPerStep : 0;
  return { base: base, jasa: jasa, total: base + jasa };
}

function openCoinForm(productName) {
  const cfg = coinConfig[productName];
  if (!cfg) return;

  currentCoinProduct = productName;
  document.getElementById('coinModalTitle').textContent = (typeof window.trProductName === 'function') ? window.trProductName(productName) : productName;
  document.getElementById('coinJasaCheckbox').checked = false;

  let optionsHtml = '';
  for (let amount = cfg.unitStep; amount <= cfg.maxAmount; amount += cfg.unitStep) {
    optionsHtml += '<option value="' + amount + '">' + amount.toLocaleString('id-ID') + ' Coin</option>';
  }
  document.getElementById('coinAmountSelect').innerHTML = optionsHtml;

  updateCoinPreview();
  coinModal.classList.add('active');
}

function closeCoinForm() {
  coinModal.classList.remove('active');
}

function updateCoinPreview() {
  const amount = parseInt(document.getElementById('coinAmountSelect').value, 10) || 0;
  const useJasa = document.getElementById('coinJasaCheckbox').checked;
  const pricing = getCoinPricing(currentCoinProduct, amount, useJasa);
  document.getElementById('coinLiveTotal').textContent = formatRupiah(pricing.total) +
    (useJasa ? ' (termasuk jasa ' + formatRupiah(pricing.jasa) + ')' : '');
}

function addCoinToCart(event) {
  const amount = parseInt(document.getElementById('coinAmountSelect').value, 10) || 0;
  const useJasa = document.getElementById('coinJasaCheckbox').checked;

  if (!amount) {
    alert(tr('alert.pickCoinAmount', 'Pilih jumlah coin dulu ya.'));
    return;
  }

  const pricing = getCoinPricing(currentCoinProduct, amount, useJasa);
  const amountLabel = amount.toLocaleString('id-ID');

  cartItems.push({
    product: currentCoinProduct + ' - ' + amountLabel + ' Coin' + (useJasa ? ' + Jasa' : ''),
    qty: 1,
    subtotal: pricing.total,
    _priceType: 'coin',
    _key: currentCoinProduct,
    _amount: amount,
    _useJasa: useJasa
  });

  flyToCart(document.getElementById('coinLiveTotal') || (event && event.currentTarget) || (event && event.target));

  saveCart();
  closeCoinForm();
  setTimeout(function () {
    alert(tr('alert.addedToCart', 'Produk berhasil masuk ke keranjang.'));
  }, 650);
}

/* ============================================================
   FITUR AKUN HAYDAY: REQUEST SESUAI BUDGET & SPEK
   ============================================================ */
let currentAkunProduct = null;
const akunCustomModal = document.getElementById('akunCustomModal');

function openAkunCustomForm(productName) {
  currentAkunProduct = productName;
  const displayName = (typeof window.trProductName === 'function') ? window.trProductName(productName) : productName;
  document.getElementById('akunCustomProductText').textContent = displayName;
  document.getElementById('akunCustomTitle').textContent = tr('akun.requestPrefix', 'Request ') + displayName;
  document.getElementById('akunCustomName').value = '';
  document.getElementById('akunCustomBudget').value = '';
  document.getElementById('akunCustomSpec').value = '';
  akunCustomModal.classList.add('active');

  setTimeout(function () {
    document.getElementById('akunCustomName').focus();
  }, 100);
}

function closeAkunCustomForm() {
  akunCustomModal.classList.remove('active');
}

function submitAkunCustom(event) {
  event.preventDefault();

  const name = document.getElementById('akunCustomName').value.trim();
  const budget = document.getElementById('akunCustomBudget').value.trim();
  const spec = document.getElementById('akunCustomSpec').value.trim();

  if (!name || !budget || !spec) {
    alert(tr('alert.allFieldsRequired', 'Semua field wajib diisi ya.'));
    return;
  }

  const message = 'Halo RAFI HAYDAY, saya mau request ' + currentAkunProduct + '.\n\n' +
    'Nama: ' + name + '\n' +
    'Budget: ' + formatRupiah(parseInt(budget, 10)) + '\n' +
    'Spek yang diinginkan: ' + spec;

  window.open('https://wa.me/6281912164977?text=' + encodeURIComponent(message), '_blank');
  closeAkunCustomForm();
}
