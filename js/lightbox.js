// Lightbox gambar produk & tombol Escape
const imageLightbox = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openImageLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  imageLightbox.classList.add('active');
}

function closeImageLightbox() {
  imageLightbox.classList.remove('active');
}

imageLightbox.addEventListener('click', function (event) {
  if (event.target === imageLightbox) {
    closeImageLightbox();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeImageLightbox();
    closeOrderForm();
    closeCartModal();
    closeTestiForm();
    closeBulkItemForm();
    closeBahanMultiForm();
    closeCoinForm();
    closeAkunCustomForm();
  }
});
