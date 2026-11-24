// Data, render & form testimoni (Google Sheets)
/* ================= TESTIMONI: DATA & RENDER ================= */

let testimonials = [
  { name: 'Dimas A.', tagRole: 'Pembeli Coin', product: 'Coin Hayday Level 40+', rating: 5, text: 'Proses cepat banget, coin masuk kurang dari 10 menit setelah bayar. Admin juga ramah balas chatnya.', avatarLetter: 'D', avatarColor: '#2f8f46' },
  { name: 'Rani S.', tagRole: 'Pembeli Akun', product: 'Akun Hayday Level 50', rating: 5, text: 'Akun sesuai deskripsi, level dan isinya lengkap. Udah 3x order di sini dan selalu aman.', avatarLetter: 'R', avatarColor: '#f7b733' },
  { name: 'Bayu P.', tagRole: 'Pembeli Item', product: 'Barn Item', rating: 5, text: 'Harga item paling murah dibanding toko lain yang aku bandingin. Barn item langsung kepasang.', avatarLetter: 'B', avatarColor: '#25d366' },
  { name: 'Sinta M.', tagRole: 'Pembeli Coin', product: 'Joki Coin Hayday', rating: 5, text: 'Order malam-malam masih dibalas dan diproses, gercep dan gak ribet. Recommended!', avatarLetter: 'S', avatarColor: '#d62976' },
  { name: 'Andre W.', tagRole: 'Pembeli Akun', product: 'Akun Hayday Sultan', rating: 5, text: 'Akun sultan yang aku beli beneran isinya lengkap, worth it buat yang males grinding dari awal.', avatarLetter: 'A', avatarColor: '#4f5bd5' },
  { name: 'Fira K.', tagRole: 'Pembeli Item', product: 'Land Expansion Item', rating: 4, text: 'Pelayanan bagus, cuma agak lama dibalas pas jam sibuk. Tapi tetap diproses sampai selesai.', avatarLetter: 'F', avatarColor: '#111111' }
];

const TESTI_STORAGE_KEY = 'rafiHaydayUserTestimonials';
// Link Web App Google Apps Script untuk menyimpan dan membaca testimoni
const GOOGLE_SHEETS_TESTI_URL = 'https://script.google.com/macros/s/AKfycbwVIHekqqwsrD9GMgX3kLhrqKWScsHfK22oZkT0kanHLdBJB77Vi9EDjKJ8yT8SEudlAA/exec';
const testiAvatarPalette = ['#2f8f46', '#f7b733', '#25d366', '#d62976', '#4f5bd5', '#fa7e1e', '#962fbf'];

function isGoogleSheetsReady() {
  return GOOGLE_SHEETS_TESTI_URL && GOOGLE_SHEETS_TESTI_URL !== 'MASUKKAN_LINK_WEB_APP_GOOGLE_SHEETS_DI_SINI';
}

if (!isGoogleSheetsReady()) {
  try {
    const savedTesti = JSON.parse(localStorage.getItem(TESTI_STORAGE_KEY) || '[]');
    if (Array.isArray(savedTesti)) {
      testimonials = testimonials.concat(savedTesti);
    }
  } catch (e) {
    console.error('Gagal memuat testimoni tersimpan:', e);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatRupiah(num) {
  const n = Math.round(Number(num) || 0);
  return 'Rp' + n.toLocaleString('id-ID');
}

function starsString(rating) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function loadTestimonialsFromGoogleSheets() {
  if (!isGoogleSheetsReady()) return;

  const callbackName = 'loadGoogleTestimonialsCallback_' + Date.now();
  const script = document.createElement('script');

  window[callbackName] = function (response) {
    try {
      if (response && response.status === 'success' && Array.isArray(response.testimonials)) {
        const approvedTestimonials = response.testimonials.map(function (t, index) {
          const name = (t.name || '').trim();
          return {
            name: name,
            tagRole: 'Pembeli',
            product: (t.product || '').trim(),
            rating: parseInt(t.rating || '5', 10) || 5,
            text: (t.text || '').trim(),
            avatarLetter: name ? name.charAt(0).toUpperCase() : 'R',
            avatarColor: testiAvatarPalette[index % testiAvatarPalette.length]
          };
        }).filter(function (t) {
          return t.name && t.product && t.text;
        });

        if (approvedTestimonials.length) {
          testimonials = testimonials.concat(approvedTestimonials);
          renderTestimonials();
        }
      }
    } catch (error) {
      console.error('Gagal memuat testimoni dari Google Sheets:', error);
    } finally {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }
  };

  script.onerror = function () {
    console.error('Gagal menghubungkan website ke Google Sheets. Cek deployment Web App dan izin aksesnya.');
    delete window[callbackName];
  };

  script.src = GOOGLE_SHEETS_TESTI_URL + '?action=list&callback=' + callbackName + '&t=' + Date.now();
  document.body.appendChild(script);
}

function renderTestimonials() {
  const grid = document.getElementById('testiGrid');
  if (!grid) return;

  let html = '<div class="testi-card testi-add-card" onclick="openTestiForm()">' +
    '<div class="testi-add-icon">+</div>' +
    '<p>' + tr('testi.addYours', 'Tambah Testimoni Kamu') + '</p>' +
    '</div>';

  testimonials.slice().reverse().forEach(function (t) {
    html += '<div class="testi-card">' +
      '<div class="testi-head">' +
      '<div class="testi-avatar" style="background:' + t.avatarColor + ';">' + escapeHtml(t.avatarLetter) + '</div>' +
      '<div class="testi-name">' + escapeHtml(t.name) + '<small>' + escapeHtml(t.tagRole) + '</small></div>' +
      '</div>' +
      '<div class="testi-stars">' + starsString(t.rating) + '</div>' +
      '<p class="testi-text">' + escapeHtml(t.text) + '</p>' +
      '<span class="testi-tag">' + escapeHtml(t.product) + '</span>' +
      '</div>';
  });

  grid.innerHTML = html;

  const total = testimonials.length;
  const sum = testimonials.reduce(function (acc, t) { return acc + t.rating; }, 0);
  const avg = total ? (sum / total) : 0;

  const scoreEl = document.getElementById('ratingScore');
  const countEl = document.getElementById('ratingCount');
  if (scoreEl) scoreEl.textContent = avg.toFixed(1);
  if (countEl) countEl.textContent = total;

  const counts = [0, 0, 0, 0, 0];
  testimonials.forEach(function (t) {
    const r = Math.max(1, Math.min(5, Math.round(t.rating)));
    counts[r - 1]++;
  });

  // Update stat-stars
  const starsEl = document.getElementById('statStars');
  if (starsEl) starsEl.textContent = starsString(Math.round(avg));

  // Update sbar distribusi secara dinamis
  const order = [5, 4, 3, 2, 1];
  const pctIds = ['pct5', 'pct4', 'pct3', 'pct2', 'pct1'];
  const fills = document.querySelectorAll('.sbar-fill');
  order.forEach(function (starVal, idx) {
    const c = counts[starVal - 1];
    const pct = total ? Math.round((c / total) * 100) : 0;
    if (fills[idx]) {
      fills[idx].setAttribute('data-pct', pct);
      setTimeout(function () { if (fills[idx]) fills[idx].style.width = pct + '%'; }, 120);
    }
    const pctEl = document.getElementById(pctIds[idx]);
    if (pctEl) pctEl.textContent = pct + '%';
  });
}

renderTestimonials();
loadTestimonialsFromGoogleSheets();

/* ================= TESTIMONI: FORM TAMBAH ================= */

const testiModal = document.getElementById('testiModal');
const testiStarPicker = document.getElementById('testiStarPicker');
const testiRatingInput = document.getElementById('testiRating');

if (testiStarPicker) {
  const starEls = testiStarPicker.querySelectorAll('span');
  starEls.forEach(function (starEl) {
    starEl.addEventListener('click', function () {
      const val = parseInt(starEl.getAttribute('data-value'), 10);
      testiRatingInput.value = val;
      starEls.forEach(function (s) {
        s.classList.toggle('selected', parseInt(s.getAttribute('data-value'), 10) <= val);
      });
    });
  });
}

function resetTestiStarPicker() {
  if (testiRatingInput) testiRatingInput.value = '0';
  if (testiStarPicker) {
    testiStarPicker.querySelectorAll('span').forEach(function (s) {
      s.classList.remove('selected');
    });
  }
}

function openTestiForm() {
  if (tutorialPopup) tutorialPopup.classList.remove('show');
  if (floatingHelp) floatingHelp.classList.add('show');

  document.getElementById('testiName').value = '';
  document.getElementById('testiProduct').value = '';
  document.getElementById('testiText').value = '';
  resetTestiStarPicker();

  testiModal.classList.add('active');

  setTimeout(function () {
    document.getElementById('testiName').focus();
  }, 100);
}

function closeTestiForm() {
  testiModal.classList.remove('active');
}

testiModal.addEventListener('click', function (event) {
  if (event.target === testiModal) {
    closeTestiForm();
  }
});

function sendTestimoniToGoogleSheets(testiData) {
  if (!GOOGLE_SHEETS_TESTI_URL || GOOGLE_SHEETS_TESTI_URL === 'https://script.google.com/macros/s/AKfycbzEu2imhs2iEV6FUSPcycEwTP7LSSFoclO6OwvD5k0frBRxhzFTiHRxv7iGpDz6yzGgxQ/exec') {
    console.warn('Link Google Sheets belum diisi. Testimoni hanya tersimpan di browser ini.');
    return;
  }

  fetch(GOOGLE_SHEETS_TESTI_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      tanggal: new Date().toLocaleString('id-ID'),
      nama: testiData.name,
      produk: testiData.product,
      rating: testiData.rating,
      ulasan: testiData.text
    })
  }).catch(function (error) {
    console.error('Gagal mengirim testimoni ke Google Sheets:', error);
  });
}

function submitTestimoni(event) {
  event.preventDefault();

  const name = document.getElementById('testiName').value.trim();
  const product = document.getElementById('testiProduct').value.trim();
  const text = document.getElementById('testiText').value.trim();
  const rating = parseInt(document.getElementById('testiRating').value, 10);

  if (!name || !product || !text || !rating) {
    alert(tr('alert.testiFieldsRequired', 'Semua field wajib diisi, termasuk rating bintangnya ya.'));
    return;
  }

  const newTesti = {
    name: name,
    tagRole: tr('testi.newBuyerTag', 'Pembeli Baru'),
    product: product,
    rating: rating,
    text: text,
    avatarLetter: name.charAt(0).toUpperCase(),
    avatarColor: testiAvatarPalette[testimonials.length % testiAvatarPalette.length]
  };

  if (isGoogleSheetsReady()) {
    sendTestimoniToGoogleSheets(newTesti);
    alert(tr('alert.testiThanksSheets', 'Terima kasih! Testimoni kamu sudah dikirim ke admin dan akan dicek dulu sebelum ditampilkan.'));
  } else {
    testimonials.push(newTesti);
    renderTestimonials();

    try {
      const savedTesti = JSON.parse(localStorage.getItem(TESTI_STORAGE_KEY) || '[]');
      savedTesti.push(newTesti);
      localStorage.setItem(TESTI_STORAGE_KEY, JSON.stringify(savedTesti));
    } catch (e) {
      console.error('Gagal menyimpan testimoni:', e);
    }

    alert(tr('alert.testiThanksLocal', 'Terima kasih! Link Google Sheets belum diisi, jadi testimoni baru tersimpan di browser ini dulu.'));
  }

  closeTestiForm();
}
