/* 墙绘彩绘报价方案 — 交互脚本 */
(function () {
  'use strict';

  /* ---------- 顶部导航：滚动后显示底色 ---------- */
  var nav = document.getElementById('topnav');
  var cover = document.querySelector('.cover');

  function onScroll() {
    var threshold = cover ? cover.offsetHeight - 80 : 400;
    if (window.scrollY > threshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 滚动进场动画 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 图片灯箱 ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var btnClose = document.getElementById('lbClose');
  var btnPrev = document.getElementById('lbPrev');
  var btnNext = document.getElementById('lbNext');

  // 收集所有画廊图片（按文档顺序）
  var galleryImgs = Array.prototype.slice.call(
    document.querySelectorAll('[data-gallery] .g-item img')
  );
  var currentIndex = -1;

  function openLightbox(index) {
    if (index < 0 || index >= galleryImgs.length) return;
    currentIndex = index;
    var img = galleryImgs[index];
    lbImg.src = img.src;
    lbImg.alt = img.alt || '案例大图';
    lbCap.textContent = (img.alt || '') + '　（' + (index + 1) + ' / ' + galleryImgs.length + '）';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function step(delta) {
    if (currentIndex < 0) return;
    var next = (currentIndex + delta + galleryImgs.length) % galleryImgs.length;
    openLightbox(next);
  }

  galleryImgs.forEach(function (img, index) {
    img.closest('.g-item').addEventListener('click', function () {
      openLightbox(index);
    });
  });

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
  btnNext.addEventListener('click', function (e) { e.stopPropagation(); step(1); });

  // 点击背景关闭
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // 键盘操作
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
})();
