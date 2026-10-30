/* ==========================================================================
   TRUMAN TATTOO, landing page: animazioni allo scorrimento
   Nessuna libreria esterna.
   ========================================================================== */
(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- 1. Elementi che compaiono quando entrano nello schermo ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  const hero = $('.hero');

  /* ---------- 2. Effetti legati allo scorrimento ---------- */
  const bar = $('.progress');
  const rails = $$('.rail');
  const parallaxImgs = $$('[data-parallax]');
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - vh;

    // barra colorata in alto
    if (bar) bar.style.setProperty('--p', maxScroll > 0 ? (y / maxScroll).toFixed(4) : 0);

    if (reduce) return;

    // hero: il logo si inclina e rimpicciolisce mentre scorri
    if (hero) {
      const hp = clamp(y / (hero.offsetHeight * 0.85), 0, 1);
      hero.style.setProperty('--hp', hp.toFixed(3));
    }
    // foto con parallasse
    parallaxImgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh;       // da -1 a 1
      img.style.transform = `translate3d(0, ${(c * -9).toFixed(2)}%, 0)`;
    });

    // galleria: le due file si muovono in direzioni opposte
    rails.forEach((rail) => {
      const holder = rail.parentElement;
      const r = holder.getBoundingClientRect();
      const overflow = rail.scrollWidth - holder.clientWidth;
      if (overflow <= 0) return;
      const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      const dir = Number(rail.dataset.dir) || -1;
      const x = dir < 0 ? -overflow * p : -overflow * (1 - p);
      rail.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
})();
