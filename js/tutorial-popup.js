// Popup tutorial pembuka
const tutorialPopup = document.getElementById('waTutorialPopup');
const floatingHelp = document.getElementById('waFloatingHelp');

function showTutorialPopup() {
  if (!tutorialPopup) return;
  tutorialPopup.classList.add('show');
  tutorialPopup.setAttribute('aria-hidden', 'false');
  if (floatingHelp) floatingHelp.classList.remove('show');
}

// Catatan: pemicu otomatis "tampilkan saat pertama buka" SENGAJA tidak
// diletakkan di sini lagi. Sebelumnya ada 2 timer terpisah (di sini dan
// di script "FIX POPUP TUTORIAL" di bawah) yang sama-sama menampilkan
// popup ini pada waktu yang berbeda, jadi popup bisa muncul lagi
// walau baru saja ditutup. Sekarang cuma 1 timer yang mengatur itu
// (lihat initTutorialPopup di script "FIX POPUP TUTORIAL").

function closeTutorialPopup() {
  if (tutorialPopup) {
    tutorialPopup.classList.remove('show');
    tutorialPopup.setAttribute('aria-hidden', 'true');
  }
  if (floatingHelp) floatingHelp.classList.add('show');
}

function openTutorialPopup() {
  showTutorialPopup();
}

function goToTutorialFromPopup() {
  const tutorialNav = document.querySelector('.header-nav a[data-view="tutorial"]');
  switchView('tutorial', tutorialNav);

  setTimeout(function () {
    closeTutorialPopup();
  }, 350);
}
