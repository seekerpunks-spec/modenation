/* ==========================================================================
   MODÉNATION // CYBERPUNK FX
   Scanline sweep + glitch text + boot sequence + terminal typing
   ========================================================================== */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  // ----------------------------------------------------------------------
  // 1. SCANLINE SWEEP — a single bright line drops every few seconds
  // ----------------------------------------------------------------------
  function initScanlineSweep() {
    const sweep = document.createElement('div');
    sweep.style.cssText = `
      position: fixed;
      left: 0; right: 0;
      top: -10px;
      height: 3px;
      background: linear-gradient(180deg,
        transparent 0%,
        rgba(0, 240, 255, 0.85) 50%,
        transparent 100%);
      box-shadow: 0 0 12px rgba(0, 240, 255, 0.7);
      pointer-events: none;
      z-index: 9998;
      will-change: transform;
      opacity: 0;
    `;
    document.body.appendChild(sweep);

    function sweepOnce() {
      sweep.style.opacity = '1';
      sweep.animate(
        [
          { transform: 'translateY(0)' },
          { transform: `translateY(${window.innerHeight + 20}px)` }
        ],
        { duration: 2400, easing: 'cubic-bezier(0.5, 0, 0.5, 1)' }
      ).onfinish = () => {
        sweep.style.opacity = '0';
        const next = 4000 + Math.random() * 5000;
        setTimeout(sweepOnce, next);
      };
    }
    setTimeout(sweepOnce, 2000);
  }

  // ----------------------------------------------------------------------
  // 2. GLITCH TEXT — periodically glitch the brand name
  // ----------------------------------------------------------------------
  function initGlitchBrand() {
    const brand = document.querySelector('.brand span');
    if (!brand) return;
    const original = brand.textContent;
    const glitchChars = '!<>-_\\/[]{}—=+*^?#';

    function glitchOnce() {
      let iter = 0;
      const maxIter = 6;
      const interval = setInterval(() => {
        const result = original
          .split('')
          .map((ch, i) => {
            if (i < iter) return original[i];
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join('');
        brand.textContent = result;
        if (brand.querySelector('::after')) {
          // can't easily update pseudo - skip
        }
        if (iter >= original.length) {
          clearInterval(interval);
          brand.textContent = original;
        }
        iter += 1 / 2;
      }, 50);
    }
    setInterval(glitchOnce, 6000 + Math.random() * 4000);
  }

  // ----------------------------------------------------------------------
  // 3. TYPING EFFECT on hero-tag
  // ----------------------------------------------------------------------
  function initTypingTag() {
    const tag = document.querySelector('.hero-tag');
    if (!tag) return;
    const original = tag.textContent;
    tag.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      tag.textContent = original.slice(0, i);
      i++;
      if (i > original.length) {
        clearInterval(interval);
        // blinking cursor at end
        const cursor = document.createElement('span');
        cursor.textContent = '▍';
        cursor.style.cssText = 'animation: blink 1s infinite; margin-left: 4px;';
        tag.appendChild(cursor);
      }
    }, 40);
  }

  // ----------------------------------------------------------------------
  // 4. RANDOM "DATA CORRUPTION" flashes on stat values
  // ----------------------------------------------------------------------
  function initDataFlash() {
    const targets = document.querySelectorAll('.stat-card .label, .float-card .nm');
    if (!targets.length) return;

    setInterval(() => {
      const t = targets[Math.floor(Math.random() * targets.length)];
      const before = t.style.textShadow;
      t.style.transition = 'text-shadow 0.08s';
      t.style.textShadow = '0 0 12px #ff00aa, 0 0 20px #00f0ff';
      setTimeout(() => { t.style.textShadow = before; }, 120);
    }, 3500);
  }

  // ----------------------------------------------------------------------
  // 5. BOOT SEQUENCE in console
  // ----------------------------------------------------------------------
  function bootLog() {
    const style = 'color: #00f0ff; font-family: monospace; font-size: 12px;';
    const styleMagenta = 'color: #ff00aa; font-family: monospace; font-size: 12px;';
    console.log('%c╔══════════════════════════════════════════════╗', style);
    console.log('%c║  MODÉNATION // SYS_BOOT v2.077.cyberpunk     ║', style);
    console.log('%c╚══════════════════════════════════════════════╝', style);
    console.log('%c> Loading neural interface…  [OK]', styleMagenta);
    console.log('%c> Connecting to NET… [OK]', styleMagenta);
    console.log('%c> Operators online: 1,200+', styleMagenta);
    console.log('%c> Corporate clients: 850+', styleMagenta);
    console.log('%c> Welcome, choomba. Stay frosty.', 'color: #00ff9d; font-family: monospace; font-size: 12px; font-weight: bold;');
  }

  // ----------------------------------------------------------------------
  // 6. KONAMI CODE easter egg — toggle rainbow mode
  // ----------------------------------------------------------------------
  function initKonami() {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let buf = [];
    document.addEventListener('keydown', e => {
      buf.push(e.key);
      if (buf.length > seq.length) buf = buf.slice(-seq.length);
      if (buf.join(',').toLowerCase() === seq.join(',').toLowerCase()) {
        document.body.style.animation = 'hue 4s linear infinite';
        const s = document.createElement('style');
        s.textContent = '@keyframes hue { 0% { filter: hue-rotate(0); } 100% { filter: hue-rotate(360deg); } }';
        document.head.appendChild(s);
        console.log('%c>>> RAINBOW PROTOCOL ENGAGED <<<', 'color: #fcee0a; font-size: 16px; font-weight: bold;');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bootLog();
    initScanlineSweep();
    initTypingTag();
    initDataFlash();
    initKonami();
    // glitch brand is disruptive, skip for now
  });
})();
