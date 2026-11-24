// Render keranjang & kirim pesanan ke WhatsApp
/* ============================================================
   ANTI MANIPULASI HARGA
   Sebelum keranjang ditampilkan / dikirim ke WhatsApp, harga
   tiap item dihitung ULANG dari harga asli produk (bukan dari
   angka yang tersimpan di keranjang). Jadi kalau ada yang
   coba ubah angka lewat localStorage/console browser, harga
   yang muncul & terkirim ke WA tetap harga yang benar.
   ============================================================ */
function recomputeCartSubtotal(item) {
  if (!item || !item._priceType) return null;
  try {
    if (item._priceType === 'bulk') {
      const cfg = bulkItemConfig[item._key];
      if (!cfg) return null;
      const qty = Number(item._qty) || 0;
      const unitPrice = getBulkItemUnitPrice(item._key, qty);
      return qty * unitPrice;
    }
    if (item._priceType === 'bahan') {
      const cfg = bahanMultiConfig[item._key];
      if (!cfg) return null;
      const found = cfg.items.find(function (it) { return it.name === item._itemName; });
      if (!found) return null;
      const unit = Number(found.priceUnitQty || 100);
      const qty = Number(item._qty) || 0;
      return (qty / unit) * Number(found.price || 0);
    }
    if (item._priceType === 'coin') {
      const pricing = getCoinPricing(item._key, Number(item._amount) || 0, !!item._useJasa);
      return pricing.total;
    }
    if (item._priceType === 'simple') {
      const cfg = simpleProductConfig[item._key];
      if (!cfg) return null;
      const qty = Number(item._qty) || 0;
      return qty * Number(cfg.price || 0);
    }
  } catch (e) {
    console.error('recomputeCartSubtotal error:', e);
  }
  return null;
}

function sanitizeCartPrices() {
  let changed = false;
  cartItems.forEach(function (item) {
    const correct = recomputeCartSubtotal(item);
    if (typeof correct === 'number' && !isNaN(correct) && item.subtotal !== correct) {
      item.subtotal = correct;
      changed = true;
    }
  });
  if (changed) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Gagal menyimpan keranjang setelah validasi harga:', e);
    }
  }
}

function tr(key, fallback, vars) {
  return (typeof window.t === 'function') ? window.t(key, vars) : fallback;
}

function renderCart() {
  sanitizeCartPrices();
  if (!cartItemsList) return;

  if (!cartItems.length) {
    cartItemsList.innerHTML = '<div class="cart-empty">' + tr('cart.empty', 'Keranjang masih kosong. Pilih produk dulu dari katalog ya.') + '</div>';
    renderCartTotal(0, false, 0);
    return;
  }

  let html = '';
  let grandTotal = 0;
  let totalQty = 0;
  let hasUnpriced = false;

  cartItems.forEach(function (item, index) {
    const hasPrice = typeof item.subtotal === 'number';
    if (hasPrice) {
      grandTotal += item.subtotal;
    } else {
      hasUnpriced = true;
    }

    const qtyNum = typeof item.qty === 'number' ? item.qty : (parseInt(item.qty, 10) || 0);
    totalQty += qtyNum;

    html += '<div class="cart-item">' +
      '<div>' +
      '<div class="cart-item-name">' + escapeHtml(item.product) + '</div>' +
      '<div class="cart-item-qty">' + tr('cart.qtyPrefix', 'Jumlah: ') + item.qty + (hasPrice ? '<span class="cart-item-subtotal">' + formatRupiah(item.subtotal) + '</span>' : '') + '</div>' +
      '</div>' +
      '<div class="cart-item-actions">' +
      (hasPrice ? '' :
        '<button type="button" class="cart-mini-btn" onclick="changeCartQty(' + index + ', -1)" aria-label="' + tr('aria.decreaseQty', 'Kurangi jumlah') + '">−</button>' +
        '<button type="button" class="cart-mini-btn" onclick="changeCartQty(' + index + ', 1)" aria-label="' + tr('aria.increaseQty', 'Tambah jumlah') + '">+</button>') +
      '<button type="button" class="cart-remove-btn" onclick="removeCartItem(' + index + ')" aria-label="' + tr('aria.removeItem', 'Hapus item') + '">🗑</button>' +
      '</div>' +
      '</div>';
  });

  cartItemsList.innerHTML = html;
  renderCartTotal(grandTotal, hasUnpriced, totalQty);
}

function renderCartTotal(grandTotal, hasUnpriced, totalQty) {
  const box = document.getElementById('cartGrandTotal');
  if (!box) return;

  if (!cartItems.length) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  box.innerHTML = '<span class="cgt-pill">📦 ' + totalQty.toLocaleString('id-ID') + ' ' + tr('cart.pcsUnit', 'pcs') + '</span>' +
    '<div class="cgt-row"><span>' + tr('common.total', 'Total') + '</span><span class="cgt-price">' + formatRupiah(grandTotal) + '</span></div>' +
    (hasUnpriced ? '<small>' + tr('cart.needConfirm', '*Ada item perlu konfirmasi admin.') + '</small>' : '');
}

function openCartModal() {
  renderCart();
  if (checkoutBuyerName) checkoutBuyerName.value = '';
  cartModal.classList.add('active');
}

function closeCartModal() {
  cartModal.classList.remove('active');
}

function changeCartQty(index, amount) {
  if (!cartItems[index]) return;
  cartItems[index].qty += amount;
  if (cartItems[index].qty <= 0) {
    cartItems.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function removeCartItem(index) {
  cartItems.splice(index, 1);
  saveCart();
  renderCart();
}

function sendCartToWhatsApp(event) {
  event.preventDefault();

  sanitizeCartPrices();

  const name = checkoutBuyerName.value.trim();
  if (!name) {
    alert(tr('alert.buyerNameRequired', 'Nama pembeli wajib diisi ya.'));
    return;
  }

  if (!cartItems.length) {
    alert(tr('alert.cartEmpty', 'Keranjang masih kosong. Pilih produk dulu ya.'));
    return;
  }

  let grandTotal = 0;
  let totalQty = 0;
  let hasUnpriced = false;
  const groupedOrders = {};

  cartItems.forEach(function (item) {
    const hasPrice = typeof item.subtotal === 'number';
    if (hasPrice) {
      grandTotal += item.subtotal;
    } else {
      hasUnpriced = true;
    }

    const qtyNum = typeof item.qty === 'number' ? item.qty : (parseInt(item.qty, 10) || 0);
    totalQty += qtyNum;

    let category = 'Pesanan Lainnya';
    let itemName = item.product;

    if (item.product.indexOf(' - ') !== -1) {
      const productParts = item.product.split(' - ');
      category = productParts[0];
      itemName = productParts.slice(1).join(' - ');
    }

    if (!groupedOrders[category]) groupedOrders[category] = [];
    groupedOrders[category].push({
      name: itemName,
      qty: item.qty,
      hasPrice: hasPrice,
      subtotal: item.subtotal
    });
  });

  const orderList = Object.keys(groupedOrders).map(function (category) {
    const items = groupedOrders[category].map(function (item, index) {
      return (index + 1) + '. ' + item.name + ' ' + item.qty;
    }).join('\n');
    return category + ':\n' + items;
  }).join('\n\n');

  const totalLine = 'Total pcs: ' + totalQty.toLocaleString('id-ID') + ' pcs\n' +
    'Total sementara: ' + formatRupiah(grandTotal) +
    (hasUnpriced ? ' (+ ada item yang perlu konfirmasi harga admin)' : '');

  const message = `Halooo min, aku ${name}.\n\nAku mau order:\n\n${orderList}\n\n${totalLine}\n\nTolong dibantu cek stok dan totalnya ya min.`;
  const whatsappUrl = 'https://wa.me/6281912164977?text=' + encodeURIComponent(message);

  window.open(whatsappUrl, '_blank');
  cartItems = [];
  saveCart();
  closeCartModal();
}

orderModal.addEventListener('click', function (event) {
  if (event.target === orderModal) {
    closeOrderForm();
  }
});

cartModal.addEventListener('click', function (event) {
  if (event.target === cartModal) {
    closeCartModal();
  }
});

bulkItemModal.addEventListener('click', function (event) {
  if (event.target === bulkItemModal) {
    closeBulkItemForm();
  }
});

bahanMultiModal.addEventListener('click', function (event) {
  if (event.target === bahanMultiModal) {
    closeBahanMultiForm();
  }
});

coinModal.addEventListener('click', function (event) {
  if (event.target === coinModal) {
    closeCoinForm();
  }
});

akunCustomModal.addEventListener('click', function (event) {
  if (event.target === akunCustomModal) {
    closeAkunCustomForm();
  }
});

updateCartCount();
