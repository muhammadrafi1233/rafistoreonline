// Navigasi tab/katalog (switchView, showCatalog, mode mobile)
function switchView(view, clickedLink) {
  document.querySelectorAll('.view').forEach(function (v) {
    v.classList.remove('active');
  });
  document.getElementById('view-' + view).classList.add('active');

  document.querySelectorAll('.header-nav a').forEach(function (a) {
    a.classList.remove('current');
  });
  if (clickedLink) clickedLink.classList.add('current');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function isMobileView() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function showCatalog(id, clickedCard) {
  const sections = document.querySelectorAll('.catalog-section');
  sections.forEach(section => section.classList.remove('active'));

  const cards = document.querySelectorAll('.menu-card');
  cards.forEach(card => card.classList.remove('active'));

  const activeCatalogSection = document.getElementById(id);
  if (!activeCatalogSection) return;
  activeCatalogSection.classList.add('active');

  if (!clickedCard) {
    clickedCard = document.querySelector('.menu-card[onclick*="\'' + id + '\'"]');
  }
  if (clickedCard) clickedCard.classList.add('active');

  // Update URL supaya tiap katalog punya "halaman" / link sendiri (bisa di-bookmark, tombol back browser jalan)
  if (window.location.hash !== '#katalog-' + id) {
    history.pushState(null, '', '#katalog-' + id);
  }

  // Refresh animasi kartu katalog supaya terasa hidup setiap pindah kategori
  activeCatalogSection.querySelectorAll('.card').forEach(function (card, index) {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = '';
    card.style.animationDelay = (index * 0.06) + 's';
  });

  // Desain baru: kategori selalu terlihat (bisa digeser), jadi tidak ada lagi
  // mode "halaman khusus" di HP.
}

function backToMenuMobile() {
  document.querySelectorAll('.catalog-section').forEach(section => section.classList.remove('active'));
  document.querySelectorAll('.menu-card').forEach(card => card.classList.remove('active'));

  const menuGrid = document.querySelector('.menu-grid');
  const introTitle = document.querySelector('.container.view.active > .section-title');
  const introDesc = document.querySelector('.container.view.active > .section-desc');
  const backBtn = document.getElementById('mobileBackBtn');

  if (menuGrid) menuGrid.style.display = '';
  if (introTitle) introTitle.style.display = '';
  if (introDesc) introDesc.style.display = '';
  if (backBtn) backBtn.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
