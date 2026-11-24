// Counter transaksi & toast worldwide
let transactionCounterTarget = 9500; // default, bisa ditimpa dari Supabase (site_settings)

function runTransactionCounter() {
  const counter = document.getElementById('txCounterOnly');
  if (!counter) return;

  const target = transactionCounterTarget;
  const duration = 1800;
  const start = performance.now();

  counter.textContent = '0';

  function animate(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * target);

    counter.textContent = current.toLocaleString('id-ID') + '+';

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      counter.textContent = target.toLocaleString('id-ID') + '+';
    }
  }

  requestAnimationFrame(animate);
}

function startWorldwideToast() {
  const toast = document.getElementById('worldwideToast');
  if (!toast) return;

  const orders = [
    '🟢 New Order from 🇮🇳 India',
    '🟢 New Order from 🇻🇳 Vietnam',
    '🟢 New Order from 🇲🇾 Malaysia',
    '🟢 New Order from 🇹🇭 Thailand',
    '🟢 New Order from 🇸🇬 Singapore',
    '🟢 New Order from 🇰🇭 Cambodia',
    '🟢 New Order from 🇬🇧 England'
  ];

  let index = 0;
  toast.textContent = orders[index];

  if (window.worldwideToastInterval) clearInterval(window.worldwideToastInterval);

  window.worldwideToastInterval = setInterval(function () {
    index = (index + 1) % orders.length;
    toast.textContent = orders[index];
  }, 2800);
}

document.addEventListener('DOMContentLoaded', function () {
  const testiNav = document.querySelector('.header-nav a[data-view="testimoni"]');

  if (testiNav) {
    testiNav.addEventListener('click', function () {
      setTimeout(function () {
        runTransactionCounter();
        startWorldwideToast();
      }, 300);
    });
  }

  const oldSwitchView = window.switchView;
  if (typeof oldSwitchView === 'function') {
    window.switchView = function (view, clickedLink) {
      oldSwitchView(view, clickedLink);
      if (view === 'testimoni') {
        setTimeout(function () {
          runTransactionCounter();
          startWorldwideToast();
        }, 300);
      }
    };
  }
});
