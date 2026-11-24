// State keranjang, localStorage, animasi terbang ke keranjang
const orderModal = document.getElementById('orderModal');
const cartModal = document.getElementById('cartModal');
const selectedProduct = document.getElementById('selectedProduct');
const selectedProductText = document.getElementById('selectedProductText');
const orderQty = document.getElementById('orderQty');
const checkoutBuyerName = document.getElementById('checkoutBuyerName');
const cartCountBadge = document.getElementById('cartCountBadge');
const headerCartCountBadge = document.getElementById('headerCartCountBadge');
const cartItemsList = document.getElementById('cartItemsList');
const CART_STORAGE_KEY = 'rafiHaydayCartItems';

let cartItems = [];

try {
  const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  if (Array.isArray(savedCart)) cartItems = savedCart;
} catch (e) {
  console.error('Gagal memuat keranjang:', e);
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  updateCartCount();
}

function updateCartCount() {
  const totalQty = cartItems.reduce(function (acc, item) {
    return acc + Number(item.qty || 0);
  }, 0);
  if (cartCountBadge) {
    cartCountBadge.textContent = totalQty;
    cartCountBadge.classList.toggle('is-empty', totalQty === 0);
  }
  if (headerCartCountBadge) {
    headerCartCountBadge.textContent = totalQty;
    headerCartCountBadge.classList.toggle('is-empty', totalQty === 0);
  }
}

/* ============================================================
   ANIMASI TERBANG KE KERANJANG
   Membuat ikon 🛒 kecil yang terbang dari tombol yang diklik
   menuju tombol keranjang total di pojok layar.
   ============================================================ */
function flyToCart(originEl) {
  try {
    // Pilih tombol keranjang yang sedang tampil (navigasi bawah di HP, header di desktop)
    const cartBtn = [document.getElementById('cartFloatingBtn'), document.getElementById('headerCartBtn')]
      .find(function (el) { return el && el.getBoundingClientRect().width > 0; });
    if (!cartBtn) return;

    const originRect = (originEl && originEl.getBoundingClientRect)
      ? originEl.getBoundingClientRect()
      : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };

    const cartRect = cartBtn.getBoundingClientRect();

    const startX = originRect.left + originRect.width / 2;
    const startY = originRect.top + originRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const flyer = document.createElement('div');
    flyer.className = 'fly-to-cart-icon';
    flyer.textContent = '🛒';
    flyer.style.left = startX + 'px';
    flyer.style.top = startY + 'px';
    flyer.style.setProperty('--dx', (endX - startX) + 'px');
    flyer.style.setProperty('--dy', (endY - startY) + 'px');
    document.body.appendChild(flyer);

    // Paksa reflow supaya animasi CSS pasti jalan
    void flyer.offsetWidth;
    flyer.classList.add('fly-active');

    function cleanup() {
      flyer.remove();
      cartBtn.classList.add('cart-bump');
      if (cartCountBadge) cartCountBadge.classList.add('cart-badge-bump');
      setTimeout(function () {
        cartBtn.classList.remove('cart-bump');
        if (cartCountBadge) cartCountBadge.classList.remove('cart-badge-bump');
      }, 400);
    }

    flyer.addEventListener('animationend', cleanup, { once: true });
    // fallback kalau animationend tidak terpicu
    setTimeout(cleanup, 900);
  } catch (e) {
    console.error('flyToCart error:', e);
  }
}
