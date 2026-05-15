/* ==========================================================================
   Modénation — Premium GSAP animations module
   Requires: gsap 3.12.5 + ScrollTrigger (loaded from CDN before this file)
   ========================================================================== */
(function () {
  'use strict';

  // --- Bail-out guards ----------------------------------------------------
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  if (typeof gsap === 'undefined') {
    console.warn('[animations] GSAP is not loaded. Skipping animations.');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const isTouch =
    'ontouchstart' in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

  // Helpers
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initHeroEntrance();
    initFloatingCards();
    initCountUp();
    initScrollReveal();
    initRowStaggers();
    initXpBars();
    initButtonMicroInteractions();
    initMagneticButtons();
    initSmoothScroll();
    initCursorGlow();

    if (typeof ScrollTrigger !== 'undefined') {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }

  // ------------------------------------------------------------------------
  // 1. Hero entrance — only when a .hero-text exists (effectively index.html)
  // ------------------------------------------------------------------------
  function initHeroEntrance() {
    const hero = $('.hero-text');
    if (!hero) return;

    const h1 = $('h1', hero);
    if (h1) {
      // Split the headline into "lines" using <br> as separator so the visual
      // line break is preserved and each line animates individually.
      const rawHTML = h1.innerHTML;
      const parts = rawHTML.split(/<br\s*\/?>/i);
      h1.innerHTML = parts
        .map(
          (p) =>
            `<span class="anim-line" style="display:block;overflow:hidden;">` +
              `<span class="anim-line-inner" style="display:inline-block;will-change:transform,opacity;">${p}</span>` +
            `</span>`
        )
        .join('');

      gsap.from(h1.querySelectorAll('.anim-line-inner'), {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.1,
      });
    }

    const ctas = $('.hero-ctas', hero);
    if (ctas) {
      gsap.from(ctas, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.5,
      });
    }

    const stats = $('.hero-stats', hero);
    if (stats) {
      gsap.from(stats, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.7,
      });
    }
  }

  // ------------------------------------------------------------------------
  // 2. Floating cards entrance
  // ------------------------------------------------------------------------
  function initFloatingCards() {
    const tl = $('.float-card.tl');
    const bl = $('.float-card.bl');
    const targets = [];
    if (tl) targets.push({ el: tl, fromY: -20 });
    if (bl) targets.push({ el: bl, fromY: 20 });
    if (!targets.length) return;

    targets.forEach((t, i) => {
      gsap.from(t.el, {
        opacity: 0,
        scale: 0.9,
        y: t.fromY,
        duration: 0.9,
        ease: 'back.out(1.4)',
        delay: 0.8 + i * 0.2,
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Count-up animation for hero stat numbers
  // ------------------------------------------------------------------------
  function initCountUp() {
    const targets = $$('.hero-stat b');
    if (!targets.length || typeof ScrollTrigger === 'undefined') return;

    targets.forEach((el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/([\d.,]+)/);
      if (!match) return;
      const numericString = match[1].replace(/[.,\s]/g, '');
      const target = parseInt(numericString, 10);
      if (!Number.isFinite(target)) return;

      const suffix = raw.replace(match[1], '').trim(); // typically "+"
      const counter = { v: 0 };
      el.textContent = '0' + (suffix ? suffix : '');

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            v: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              const formatted = Math.round(counter.v).toLocaleString('en-US');
              el.textContent = formatted + (suffix ? suffix : '');
            },
          });
        },
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Generic scroll reveal for sections / cards / dashboards
  // ------------------------------------------------------------------------
  function initScrollReveal() {
    if (typeof ScrollTrigger === 'undefined') return;
    const selectors = 'section, .card, .stat-card, .dashboard-card';

    // Group siblings by parent so we can stagger items entering together.
    const elements = $$(selectors).filter((el) => {
      // Skip hero — it has its own entrance animation.
      return !el.classList.contains('hero');
    });

    const groups = new Map();
    elements.forEach((el) => {
      const parent = el.parentElement || document.body;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    groups.forEach((items) => {
      items.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    });
  }

  // ------------------------------------------------------------------------
  // 5. Stagger animation for .mod-row / .offer-row inside cards
  // ------------------------------------------------------------------------
  function initRowStaggers() {
    if (typeof ScrollTrigger === 'undefined') return;

    const cards = $$('.card, .dashboard-card');
    cards.forEach((card) => {
      const rows = $$('.mod-row, .offer-row', card);
      if (!rows.length) return;

      gsap.fromTo(
        rows,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          delay: 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });
  }

  // ------------------------------------------------------------------------
  // 6. XP bar fill animation
  // ------------------------------------------------------------------------
  function initXpBars() {
    if (typeof ScrollTrigger === 'undefined') return;

    const bars = $$('.xp-bar > span');
    bars.forEach((bar) => {
      const targetWidth = bar.style.width || getComputedStyle(bar).width;
      if (!targetWidth) return;
      bar.style.width = '0';

      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(bar, {
            width: targetWidth,
            duration: 1.2,
            ease: 'power2.out',
          });
        },
      });
    });
  }

  // ------------------------------------------------------------------------
  // 7. Button micro-interactions
  // ------------------------------------------------------------------------
  function initButtonMicroInteractions() {
    const buttons = $$('.btn');
    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.03, y: -2, duration: 0.25, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, y: 0, duration: 0.25, ease: 'power2.out' });
      });
      btn.addEventListener('mousedown', () => {
        gsap.to(btn, { scale: 0.97, duration: 0.1, ease: 'power2.out' });
      });
      btn.addEventListener('mouseup', () => {
        gsap.to(btn, { scale: 1.03, duration: 0.15, ease: 'power2.out' });
      });
    });
  }

  // ------------------------------------------------------------------------
  // 8. Magnetic effect for primary CTA buttons
  // ------------------------------------------------------------------------
  function initMagneticButtons() {
    if (isTouch) return;
    const magnets = $$('.btn-cyan, .btn-primary.btn-lg');
    const MAX = 8;

    magnets.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        const x = Math.max(-MAX, Math.min(MAX, (relX / rect.width) * MAX * 2));
        const y = Math.max(-MAX, Math.min(MAX, (relY / rect.height) * MAX * 2));
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
      });
    });
  }

  // ------------------------------------------------------------------------
  // 9. Smooth scroll for in-page anchors
  // ------------------------------------------------------------------------
  function initSmoothScroll() {
    const links = $$('a[href^="#"]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      link.addEventListener('click', (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ------------------------------------------------------------------------
  // 11. Cursor glow follower (desktop only)
  // ------------------------------------------------------------------------
  function initCursorGlow() {
    if (isTouch) return;
    if (window.innerWidth <= 980) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    Object.assign(glow.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0) 70%)',
      filter: 'blur(20px)',
      pointerEvents: 'none',
      zIndex: '1',
      mixBlendMode: 'screen',
      transform: 'translate(-9999px, -9999px)',
      transition: 'opacity 0.3s ease',
      opacity: '0',
      willChange: 'transform',
    });
    document.body.appendChild(glow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    const halfSize = 150;
    const lerp = 0.12;
    let visible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        glow.style.opacity = '1';
      }
    });

    window.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) {
        visible = false;
        glow.style.opacity = '0';
      }
    });

    function tick() {
      curX += (mouseX - curX) * lerp;
      curY += (mouseY - curY) * lerp;
      glow.style.transform = `translate(${curX - halfSize}px, ${curY - halfSize}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
