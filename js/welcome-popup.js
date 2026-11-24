// Popup sambutan & bubble bantuan tutorial
/* ===== FIX POPUP TUTORIAL: jangan langsung hilang + bubble ? aktif ===== */
(function () {
  var WELCOME_SEEN_KEY = 'rafiHaydayWelcomePopupSeen';

  function getPopup() {
    return document.getElementById('waTutorialPopup');
  }

  function getHelp() {
    return document.getElementById('waFloatingHelp');
  }

  function markWelcomeSeen() {
    // Pakai sessionStorage (bukan localStorage): tanda "sudah dilihat" hanya
    // berlaku selama tab/web masih terbuka. Begitu web ditutup lalu dibuka
    // lagi, tanda ini hilang dan popup muncul lagi.
    try {
      sessionStorage.setItem(WELCOME_SEEN_KEY, '1');
    } catch (e) {
      // sessionStorage tidak tersedia (mis. mode privat) - abaikan saja,
      // popup akan tetap muncul lagi di kunjungan berikutnya.
    }
  }

  function hasSeenWelcome() {
    try {
      return sessionStorage.getItem(WELCOME_SEEN_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  window.showTutorialPopup = function () {
    var popup = getPopup();
    var help = getHelp();
    if (!popup) return;

    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');

    if (help) {
      help.classList.remove('show');
    }
  };

  window.openTutorialPopup = function () {
    window.showTutorialPopup();
  };

  window.closeTutorialPopup = function () {
    var popup = getPopup();
    var help = getHelp();

    if (popup) {
      popup.classList.remove('show');
      popup.setAttribute('aria-hidden', 'true');
    }

    if (help) {
      help.classList.add('show');
    }

    markWelcomeSeen();
  };

  window.goToTutorialFromPopup = function () {
    var tutorialNav = document.querySelector('.header-nav a[data-view="tutorial"]');

    if (typeof window.switchView === 'function') {
      window.switchView('tutorial', tutorialNav);
    } else {
      document.querySelectorAll('.view').forEach(function (v) {
        v.classList.remove('active');
      });

      var tutorialView = document.getElementById('view-tutorial');
      if (tutorialView) tutorialView.classList.add('active');

      document.querySelectorAll('.header-nav a').forEach(function (a) {
        a.classList.remove('current');
      });
      if (tutorialNav) tutorialNav.classList.add('current');
    }

    markWelcomeSeen();

    setTimeout(function () {
      window.closeTutorialPopup();

      var target = document.getElementById('view-tutorial');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 250);
  };

  function initTutorialPopup() {
    var popup = getPopup();
    var help = getHelp();

    if (!popup) return;

    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');

    if (help) {
      help.classList.remove('show');
    }

    // Tampilkan otomatis saat web pertama kali dibuka. Kalau sudah ditutup
    // dalam sesi ini, cukup tombol "?" mengambang yang bisa dipakai untuk
    // membuka tutorial lagi secara manual. Web ditutup lalu dibuka lagi =
    // popup muncul lagi.
    if (hasSeenWelcome()) {
      if (help) help.classList.add('show');
      return;
    }

    setTimeout(function () {
      window.showTutorialPopup();
    }, 650);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTutorialPopup);
  } else {
    initTutorialPopup();
  }
})();
