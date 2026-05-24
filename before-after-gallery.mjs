const galleryItems = [
  { type: 'before', src: '/cosmetic dentistry 2before.webp', alt: 'Cosmetic dentistry before treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 700, height: 1479 },
  { type: 'after', src: '/cosmetic dentistry 2after.webp', alt: 'Cosmetic dentistry after treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 700, height: 967, imageClass: 'ba-img--glasses' },
  { type: 'single', src: '/cosmeticdentistry3.webp', alt: 'Cosmetic dentistry smile result at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 700, height: 700, imageClass: 'ba-img--stacked' },
  { type: 'single', src: '/cosmeticdentistry5.webp', alt: 'Cosmetic dentistry smile result at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 700, height: 579 },
  { type: 'before', src: '/cosmetic dentistry before 11.jpg', alt: 'Cosmetic dentistry before treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 587, height: 344 },
  { type: 'after', src: '/cosmetic dentistry 11 after.jpg', alt: 'Cosmetic dentistry after treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 279, height: 139 },
  { type: 'before', src: '/all on 4 before.jpg', alt: 'All-on-4 dental implant before treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 2640, height: 1616 },
  { type: 'after', src: '/all on 4 after.JPG', alt: 'All-on-4 dental implant after treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 396, height: 225 },
  { type: 'before', src: '/cosmetic killeen before.jpg', alt: 'Cosmetic dentistry before treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 1851, height: 800 },
  { type: 'after', src: '/cosmetic killeen after.jpg', alt: 'Cosmetic dentistry after treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 1164, height: 434 },
  { type: 'before', src: '/cosmetic killeen before 1.jpg', alt: 'Cosmetic dentistry before treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 1575, height: 956 },
  { type: 'after', src: '/cosmetic killeen after 1.jpg', alt: 'Cosmetic dentistry after treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 1083, height: 526 },
  { type: 'before', src: '/cosmetic before 1.jpg', alt: 'Cosmetic dentistry before treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 3556, height: 1796 },
  { type: 'after', src: '/cosmetic after 1.jpg', alt: 'Cosmetic dentistry after treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 4144, height: 2456 },
  { type: 'single', src: '/cosmeticdentistry6.webp', alt: 'Cosmetic dentistry smile result at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 700, height: 700 },
  { type: 'before', src: '/cosmeticdentistry7before.webp', alt: 'Cosmetic dentistry before treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 241, height: 127 },
  { type: 'after', src: '/cosmeticdentistry7after.webp', alt: 'Cosmetic dentistry after treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 232, height: 137 },
  { type: 'before', src: '/cosmeticdentistry9before.webp', alt: 'Cosmetic dentistry before treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 700, height: 381 },
  { type: 'after', src: '/cosmeticdentistry9after.webp', alt: 'Cosmetic dentistry after treatment at Elm Ridge Implant and Family Dentistry in Killeen, TX', width: 700, height: 426 },
];

const image = (item) => `<img src="${item.src}" alt="${item.alt}" class="ba-img ${item.imageClass || ''} transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" decoding="async" width="${item.width}" height="${item.height}" />`;

const card = (item) => {
  if (item.type === 'single') {
    return `<div class="ba-single-card w-[280px] shrink-0 overflow-hidden rounded-[24px] border border-teal-light bg-white group">${image(item)}</div>`;
  }

  const label = item.type === 'before' ? 'Before' : 'After';
  return `<div class="relative w-[280px] shrink-0 overflow-hidden rounded-[24px] border border-teal-light bg-white group"><span class="ba-label">${label}</span>${image(item)}</div>`;
};

export const beforeAfterStyles = `<style data-before-after-gallery>
  .ba-viewport{overflow-x:auto;overflow-y:hidden;cursor:grab;scrollbar-width:none;user-select:none}
  .ba-viewport::-webkit-scrollbar{display:none}
  .ba-viewport.is-dragging{cursor:grabbing}
  .ba-img{aspect-ratio:4/3;object-fit:cover;width:100%;height:100%;background:#fff;pointer-events:none}
  .ba-img--glasses{object-position:50% 72%}
  .ba-img--stacked{object-position:50% 62%}
  .ba-label{position:absolute;left:14px;top:14px;z-index:2;padding:5px 10px;border-radius:999px;background:rgba(44,62,62,.76);color:#fff;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;letter-spacing:.16em;line-height:1;text-transform:uppercase;pointer-events:none}
  .ba-pair-card,.ba-single-card{cursor:zoom-in}
  .ba-lightbox[hidden]{display:none}
  .ba-lightbox{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(44,62,62,.86)}
  .ba-lightbox__panel{width:min(1180px,100%);max-height:min(88vh,900px);overflow:auto;background:#fff;border:1px solid rgba(168,212,212,.7);box-shadow:0 24px 80px rgba(0,0,0,.28)}
  .ba-lightbox__header{display:flex;justify-content:flex-end;padding:12px;border-bottom:1px solid rgba(168,212,212,.55)}
  .ba-lightbox__close{width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(90,154,154,.4);color:#2C3E3E;font-size:24px;line-height:1;background:#fff}
  .ba-lightbox__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:rgba(168,212,212,.55)}
  .ba-lightbox--single .ba-lightbox__grid{grid-template-columns:1fr}
  .ba-lightbox--single .ba-lightbox__after{display:none}
  .ba-lightbox__item{background:#fff;padding:14px}
  .ba-lightbox__item p{margin-bottom:10px;color:#5A9A9A;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
  .ba-lightbox__item img{width:100%;max-height:72vh;object-fit:contain;background:#fff}
  body.ba-lightbox-open{overflow:hidden}
  .scroll-track{display:flex;min-width:max-content;will-change:scroll-position}
  @media (max-width:760px){.ba-lightbox{padding:12px}.ba-lightbox__grid{grid-template-columns:1fr}.ba-lightbox__item img{max-height:52vh}}
</style>`;

export function beforeAfterSection() {
  return `  <!-- SHARED BEFORE & AFTER GALLERY -->
  <section id="before-after" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <p class="font-body text-xs tracking-widest uppercase text-teal-dark mb-3">Real Patient Results</p>
      <h2 class="font-display text-4xl md:text-5xl font-light italic text-charcoal mb-14 leading-snug">Before &amp; After.</h2>
      <div id="ba-carousel" class="ba-viewport card-shadow rounded-[32px]" aria-label="Before and after smile gallery">
        <div id="ba-track" class="scroll-track flex gap-4 py-4 px-2">
          ${galleryItems.map(card).join('\n          ')}
        </div>
      </div>
    </div>
  </section>
  <!-- /SHARED BEFORE & AFTER GALLERY -->`;
}

export const beforeAfterLightbox = `  <div id="ba-lightbox" class="ba-lightbox" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-label="Before and after images">
    <div class="ba-lightbox__panel" role="document">
      <div class="ba-lightbox__header">
        <button type="button" id="ba-lightbox-close" class="ba-lightbox__close" aria-label="Close before and after images">&times;</button>
      </div>
      <div class="ba-lightbox__grid">
        <figure class="ba-lightbox__item">
          <p id="ba-lightbox-before-label">Before</p>
          <img id="ba-lightbox-before" src="" alt="" />
        </figure>
        <figure class="ba-lightbox__item ba-lightbox__after">
          <p id="ba-lightbox-after-label">After</p>
          <img id="ba-lightbox-after" src="" alt="" />
        </figure>
      </div>
    </div>
  </div>`;

export const beforeAfterScript = `<script data-before-after-gallery>
(() => {
  const carousel = document.getElementById('ba-carousel');
  const track = document.getElementById('ba-track');
  const lightbox = document.getElementById('ba-lightbox');
  const lightboxBefore = document.getElementById('ba-lightbox-before');
  const lightboxAfter = document.getElementById('ba-lightbox-after');
  const lightboxBeforeLabel = document.getElementById('ba-lightbox-before-label');
  const lightboxAfterLabel = document.getElementById('ba-lightbox-after-label');
  const lightboxClose = document.getElementById('ba-lightbox-close');
  if (!carousel || !track || track.dataset.baInitialized === 'true') return;
  track.dataset.baInitialized = 'true';
  track.innerHTML += track.innerHTML;
  let hovering = false, dragging = false, startX = 0, startScrollLeft = 0, scrollPosition = 0, maxDragDistance = 0, suppressPairClickUntil = 0, pendingPairCard = null;
  const speed = 0.675;
  const getCardRole = card => card?.querySelector('.ba-label')?.textContent.trim().toLowerCase();
  const getPairImages = card => {
    const role = getCardRole(card);
    if (!role) return null;
    const beforeCard = role === 'before' ? card : card.previousElementSibling;
    const afterCard = role === 'after' ? card : card.nextElementSibling;
    if (getCardRole(beforeCard) !== 'before' || getCardRole(afterCard) !== 'after') return null;
    const beforeImg = beforeCard.querySelector('img'), afterImg = afterCard.querySelector('img');
    if (!beforeImg || !afterImg) return null;
    return { beforeSrc: beforeImg.currentSrc || beforeImg.src, beforeAlt: beforeImg.alt, afterSrc: afterImg.currentSrc || afterImg.src, afterAlt: afterImg.alt };
  };
  const getSingleImage = card => {
    if (!card?.classList.contains('ba-single-card')) return null;
    const image = card.querySelector('img');
    return image ? { src: image.currentSrc || image.src, alt: image.alt || 'Before and after result image' } : null;
  };
  const openPairLightbox = pair => {
    if (!lightbox || !lightboxBefore || !lightboxAfter || !pair) return;
    lightbox.classList.remove('ba-lightbox--single');
    if (lightboxBeforeLabel) lightboxBeforeLabel.textContent = 'Before';
    if (lightboxAfterLabel) lightboxAfterLabel.textContent = 'After';
    lightboxBefore.src = pair.beforeSrc; lightboxBefore.alt = pair.beforeAlt || 'Before treatment image';
    lightboxAfter.src = pair.afterSrc; lightboxAfter.alt = pair.afterAlt || 'After treatment image';
    lightbox.hidden = false; lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ba-lightbox-open');
    lightboxClose?.focus();
  };
  const openSingleLightbox = item => {
    if (!lightbox || !lightboxBefore || !lightboxAfter || !item) return;
    lightbox.classList.add('ba-lightbox--single');
    if (lightboxBeforeLabel) lightboxBeforeLabel.textContent = 'Result';
    if (lightboxAfterLabel) lightboxAfterLabel.textContent = 'After';
    lightboxBefore.src = item.src; lightboxBefore.alt = item.alt;
    lightboxAfter.removeAttribute('src'); lightboxAfter.alt = '';
    lightbox.hidden = false; lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ba-lightbox-open');
    lightboxClose?.focus();
  };
  const openGalleryCard = card => openPairLightbox(getPairImages(card)) || openSingleLightbox(getSingleImage(card));
  const closePairLightbox = () => {
    if (!lightbox || !lightboxBefore || !lightboxAfter) return;
    lightbox.hidden = true; lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('ba-lightbox--single');
    document.body.classList.remove('ba-lightbox-open');
    lightboxBefore.removeAttribute('src'); lightboxAfter.removeAttribute('src');
  };
  track.querySelectorAll('.ba-label').forEach(label => {
    const card = label.parentElement;
    if (!getPairImages(card)) return;
    card.classList.add('ba-pair-card');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'View full before and after images');
  });
  track.querySelectorAll('.ba-single-card').forEach(card => {
    if (!getSingleImage(card)) return;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'View full before and after image');
  });
  const wrapScroll = () => {
    const midpoint = carousel.scrollWidth / 2;
    if (midpoint <= 0) return;
    if (scrollPosition >= midpoint) scrollPosition -= midpoint;
    else if (scrollPosition < 0) scrollPosition += midpoint;
    carousel.scrollLeft = scrollPosition;
  };
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateCarousel = () => {
    if (reduceMotion) return;
    if (!hovering && !dragging) { scrollPosition += speed; wrapScroll(); }
    requestAnimationFrame(animateCarousel);
  };
  carousel.addEventListener('mouseenter', () => { hovering = true; });
  carousel.addEventListener('mouseleave', () => { hovering = false; });
  carousel.addEventListener('pointerdown', event => {
    dragging = true; startX = event.clientX; maxDragDistance = 0; suppressPairClickUntil = 0;
    pendingPairCard = event.target.closest('.ba-pair-card, .ba-single-card');
    startScrollLeft = carousel.scrollLeft; scrollPosition = carousel.scrollLeft;
    carousel.classList.add('is-dragging'); carousel.setPointerCapture(event.pointerId);
  });
  carousel.addEventListener('pointermove', event => {
    if (!dragging) return;
    event.preventDefault(); maxDragDistance = Math.max(maxDragDistance, Math.abs(event.clientX - startX));
    scrollPosition = startScrollLeft - (event.clientX - startX); wrapScroll();
  });
  const stopDragging = event => {
    if (!dragging) return;
    dragging = false;
    if (maxDragDistance > 8) suppressPairClickUntil = Date.now() + 180;
    else if (pendingPairCard) { suppressPairClickUntil = Date.now() + 180; openGalleryCard(pendingPairCard); }
    pendingPairCard = null; scrollPosition = carousel.scrollLeft; carousel.classList.remove('is-dragging');
    if (carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
  };
  carousel.addEventListener('pointerup', stopDragging);
  carousel.addEventListener('pointercancel', stopDragging);
  track.addEventListener('click', event => {
    if (Date.now() < suppressPairClickUntil) return;
    const card = event.target.closest('.ba-pair-card, .ba-single-card');
    if (card) openGalleryCard(card);
  });
  track.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.ba-pair-card, .ba-single-card');
    if (!card) return;
    event.preventDefault(); openGalleryCard(card);
  });
  lightboxClose?.addEventListener('click', closePairLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closePairLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox && !lightbox.hidden) closePairLightbox(); });
  requestAnimationFrame(animateCarousel);
})();
</script>`;
