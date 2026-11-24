// Carousel & modal tutorial
/* ===== TUTORIAL CAROUSEL ===== */
(function () {
  var tutCurrent = 0;
  var tutTotal = 6;
  var tutDragging = false;
  var tutStartX = 0;
  var tutDeltaX = 0;

  var captions = [
    'Buka tab <strong>Katalog</strong> di menu atas halaman untuk mulai belanja.',
    'Pilih kategori produk: <strong>Item</strong>, <strong>Coin</strong>, atau <strong>Akun Hayday</strong>.',
    'Klik <strong>Tambah ke Keranjang</strong> lalu masukkan jumlah pesanan kamu.',
    'Buka keranjang di pojok kiri bawah, isi nama, lalu klik <strong>Checkout via WhatsApp</strong>.',
    'Tunggu admin balas via WhatsApp untuk konfirmasi stok dan total harga.',
    'Lakukan pembayaran — pesanan langsung diproses setelah admin konfirmasi. <strong>Selesai! 🎉</strong>'
  ];

  function tutUpdateUI() {
    var track = document.getElementById('tutCarouselTrack');
    if (track) track.style.transform = 'translateX(-' + (tutCurrent * 100) + '%)';

    var dots = document.querySelectorAll('.tut-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === tutCurrent);
    });

    var capEl = document.getElementById('tutCaption');
    if (capEl) {
      capEl.style.opacity = '0';
      setTimeout(function () {
        capEl.innerHTML = captions[tutCurrent] || '';
        capEl.style.opacity = '1';
      }, 180);
    }
  }

  window.tutSlide = function (dir) {
    tutCurrent = (tutCurrent + dir + tutTotal) % tutTotal;
    tutUpdateUI();
  };

  window.tutGoTo = function (idx) {
    tutCurrent = idx;
    tutUpdateUI();
  };

  // Touch / swipe support
  var carousel = document.getElementById('tutCarousel');
  if (carousel) {
    carousel.addEventListener('touchstart', function (e) {
      tutStartX = e.touches[0].clientX;
      tutDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchmove', function (e) {
      if (!tutDragging) return;
      tutDeltaX = e.touches[0].clientX - tutStartX;
    }, { passive: true });

    carousel.addEventListener('touchend', function () {
      if (Math.abs(tutDeltaX) > 40) {
        tutSlide(tutDeltaX < 0 ? 1 : -1);
      }
      tutDragging = false;
      tutDeltaX = 0;
    });
  }

  // Auto-advance setiap 4 detik saat view tutorial aktif
  var tutAutoInterval = null;
  var origSwitchView = window.switchView;
  window.switchView = function (view, link) {
    origSwitchView(view, link);
    if (view === 'tutorial') {
      tutAutoInterval = setInterval(function () {
        tutSlide(1);
      }, 4000);
    } else {
      if (tutAutoInterval) { clearInterval(tutAutoInterval); tutAutoInterval = null; }
    }
  };

  // Stop auto saat user interaksi manual
  ['tutPrev', 'tutNext'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function () {
        if (tutAutoInterval) { clearInterval(tutAutoInterval); tutAutoInterval = null; }
      });
    }
  });
})();

/* ===== TUTORIAL MODAL JS ===== */
var tutData = {
  upgrade: {
    emoji: '\uD83E\uDDF0',
    title: 'Tutorial Alat Upgrade',
    subtitle: 'Paket Lumbung · Paket Silo · Paket Lahan',
    headerClass: 'upgrade-header',
    stepClass: 'upgrade-step',
    videoLabel: 'Klik untuk putar video Tutorial Alat Upgrade',
    videoNote: 'Video cara beli Item Upgrade (Paket Lumbung, Silo, Lahan) step by step.',
    videoId: 'AXeYLas5iQk',
    slides: [
      { emoji: '\uD83D\uDED2', bg: 'linear-gradient(135deg,#e8f8ee,#a8e6be)', step: 'Langkah 1', caption: 'Buka tab Katalog di menu atas halaman' },
      { emoji: '\uD83E\uDDF0', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', step: 'Langkah 2', caption: 'Pilih kategori Item Upgrade — Paket Lumbung, Silo, atau Lahan' },
      { emoji: '\u2795',       bg: 'linear-gradient(135deg,#fff8e1,#ffecb3)', step: 'Langkah 3', caption: 'Klik Tambah ke Keranjang, isi jumlah set yang diinginkan' },
      { emoji: '\uD83D\uDECD', bg: 'linear-gradient(135deg,#fce4ec,#f8bbd0)', step: 'Langkah 4', caption: 'Buka keranjang dan klik Checkout, isi nama pembeli' },
      { emoji: '\uD83D\uDCAC', bg: 'linear-gradient(135deg,#ede7f6,#d1c4e9)', step: 'Langkah 5', caption: 'Kirim via WhatsApp, tunggu konfirmasi stok dan harga' },
      { emoji: '\u2705',       bg: 'linear-gradient(135deg,#e8f5e9,#a5d6a7)', step: 'Langkah 6', caption: 'Bayar dan pesananmu diproses, selesai!' }
    ],
    steps: [
      { emoji: '\uD83D\uDED2', title: 'Buka Tab Katalog',      desc: 'Klik menu Katalog di bagian atas halaman untuk melihat semua produk.' },
      { emoji: '\uD83E\uDDF0', title: 'Pilih Item Upgrade',    desc: 'Pilih kategori Item Upgrade, ada Paket Lumbung, Paket Silo, atau Paket Lahan.' },
      { emoji: '\u2795',       title: 'Tambah ke Keranjang',   desc: 'Klik Tambah ke Keranjang, isi jumlah set yang diinginkan, lalu klik Tambah.' },
      { emoji: '\uD83D\uDECD', title: 'Buka Keranjang',        desc: 'Klik tombol keranjang di pojok kiri bawah layar untuk melihat pesananmu.' },
      { emoji: '\uD83D\uDCDD', title: 'Isi Nama & Checkout',   desc: 'Isi nama pembeli lalu tekan Checkout via WhatsApp, pesanan dikirim ke admin.' },
      { emoji: '\uD83D\uDCAC', title: 'Konfirmasi Admin',      desc: 'Tunggu admin konfirmasi stok dan total harga via WhatsApp.' },
      { emoji: '\u2705',       title: 'Bayar & Selesai!',      desc: 'Lakukan pembayaran, pesananmu diproses setelah lunas.' }
    ]
  },
  coin: {
    emoji: '\uD83E\uDE99',
    title: 'Tutorial Koin Hayday',
    subtitle: 'Coin Level 25-39 & Level 40+',
    headerClass: 'coin-header',
    stepClass: 'coin-step',
    videoLabel: 'Klik untuk putar video Tutorial Koin Hayday',
    videoNote: 'Video cara beli Coin Hayday (Level 25+ dan 40+) step by step.',
    videoId: 'bL3y6-3nsXE',
    slides: [
      { emoji: '\uD83C\uDFDA', bg: 'linear-gradient(135deg,#fffbea,#fff0b3)', step: 'Langkah 1', caption: 'Siapkan lumbung kalian hingga kosong 200' },
      { emoji: '\uD83C\uDFF7', bg: 'linear-gradient(135deg,#fff3cd,#ffe066)', step: 'Langkah 2', caption: 'Copy tagar kalian dan kirimkan ke Rafi Hayday' },
      { emoji: '\uD83D\uDC65', bg: 'linear-gradient(135deg,#fff8e1,#ffecb3)', step: 'Langkah 3', caption: 'Setelah diterima, kunjungi farm Rafi Hayday tersebut' },
      { emoji: '\uD83D\uDED2', bg: 'linear-gradient(135deg,#fce4ec,#f8bbd0)', step: 'Langkah 4', caption: 'Beli itemnya sampai habis' },
      { emoji: '\uD83C\uDF3E', bg: 'linear-gradient(135deg,#ede7f6,#d1c4e9)', step: 'Langkah 5', caption: 'Setelah itu, kembali ke kebun sendiri' },
      { emoji: '\uD83D\uDCB0', bg: 'linear-gradient(135deg,#e8f5e9,#a5d6a7)', step: 'Langkah 6', caption: 'Jual semua yang sudah dibeli dengan harga max tanpa diiklankan' },
      { emoji: '\u26A0',       bg: 'linear-gradient(135deg,#fff0f0,#ffcdd2)', step: 'Langkah 7', caption: 'Apabila diiklankan akan terkena denda' },
      { emoji: '\u2705',       bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', step: 'Langkah 8', caption: 'Balik lagi hingga coin mencapai tujuan' }
    ],
    steps: [
      { emoji: '\uD83C\uDFDA', title: 'Siapkan Lumbung',     desc: 'Siapkan lumbung kalian hingga kosong 200.' },
      { emoji: '\uD83C\uDFF7', title: 'Copy Tagar',          desc: 'Copy tagar kalian dan kirimkan ke Rafi Hayday.' },
      { emoji: '\uD83D\uDC65', title: 'Kunjungi Farm',       desc: 'Setelah diterima, kunjungi farm Rafi Hayday tersebut.' },
      { emoji: '\uD83D\uDED2', title: 'Beli Item',           desc: 'Lalu beli itemnya sampai habis.' },
      { emoji: '\uD83C\uDF3E', title: 'Kembali ke Kebun',    desc: 'Setelah itu, kembali ke kebun sendiri.' },
      { emoji: '\uD83D\uDCB0', title: 'Jual Harga Max',      desc: 'Jual semua yang sudah dibeli dengan harga max tanpa diiklankan.' },
      { emoji: '\u26A0',       title: 'Jangan Diiklankan',    desc: 'Apabila diiklankan akan terkena denda.' },
      { emoji: '\u2705',       title: 'Ulangi Sampai Tujuan', desc: 'Setelah dijual semua, balik lagi hingga coin mencapai tujuan.' }
    ]
  }
};

var _activeTutType = null;

function openTutModal(type) {
  var data = tutData[type];
  if (!data) return;
  _activeTutType = type;

  var header = document.getElementById('tutModalHeader');
  header.className = 'tut-modal-header ' + data.headerClass;
  var tutIconEl = document.getElementById('tutModalIcon');
  if (type === 'coin' && window.RH_COIN_SVG) tutIconEl.innerHTML = window.RH_COIN_SVG;
  else tutIconEl.textContent = data.emoji;
  document.getElementById('tutModalTitle').textContent = data.title;
  document.getElementById('tutModalSubtitle').textContent = data.subtitle;

  var videoWrap = document.getElementById('tutModalVideoWrap');
  videoWrap.innerHTML = '<div class="tut-modal-video-placeholder" id="tutModalVideoPlaceholder" onclick="loadModalVideo()"><div class="tut-modal-play-btn">&#9654;</div><span id="tutModalVideoLabel"></span></div>';
  document.getElementById('tutModalVideoLabel').textContent = data.videoLabel;
  document.getElementById('tutModalVideoNote').textContent = data.videoNote;

  var stepsEl = document.getElementById('tutModalSteps');
  stepsEl.innerHTML = '';
  data.steps.forEach(function(step, i) {
    var item = document.createElement('div');
    item.className = 'tut-modal-step-item ' + data.stepClass;
    item.innerHTML =
      '<div class="tut-modal-step-num">' + (i + 1) + '</div>' +
      '<div class="tut-modal-step-content">' +
        '<span class="tut-modal-step-emoji">' + step.emoji + '</span>' +
        '<strong>' + step.title + '</strong>' +
        '<span>' + step.desc + '</span>' +
      '</div>';
    stepsEl.appendChild(item);
  });

  switchTutTab('video');
  document.getElementById('tutModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function switchTutTab(tab) {
  var panels = { video: 'tutPanelVideo', steps: 'tutPanelSteps' };
  var tabs   = { video: 'tutTabVideo',   steps: 'tutTabSteps'   };
  Object.keys(panels).forEach(function(k) {
    document.getElementById(panels[k]).style.display = (k === tab) ? '' : 'none';
    document.getElementById(tabs[k]).classList.toggle('active', k === tab);
  });
}

function loadModalVideo() {
  var data = tutData[_activeTutType];
  if (!data || !data.videoId) return;
  var wrap = document.getElementById('tutModalVideoWrap');
  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube-nocookie.com/embed/' + data.videoId + '?autoplay=1&rel=0&modestbranding=1';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.title = data.title;
  wrap.innerHTML = '';
  wrap.appendChild(iframe);
}

function closeTutModal(e) {
  if (e && e.target !== document.getElementById('tutModalOverlay')) return;
  closeTutModalDirect();
}

function closeTutModalDirect() {
  document.getElementById('tutModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  _activeTutType = null;
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeTutModalDirect();
});
