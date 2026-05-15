// =========================================================
// MODÉNATION - main.js
// =========================================================

// Auto-set active nav based on current page
(function setActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
})();

// Modal helpers
window.openModal = function (id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('show');
};
window.closeModal = function (id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('show');
};
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
});

// Toast utility
window.toast = function (msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 200;
      padding: 14px 22px; border-radius: 12px;
      background: var(--card); color: var(--text);
      border: 1px solid var(--border);
      box-shadow: 0 10px 30px rgba(0,0,0,.5);
      font-weight: 600; font-size: 14px;
      transform: translateY(20px); opacity: 0;
      transition: all .25s ease;
    `;
    document.body.appendChild(t);
  }
  t.style.borderColor = type === 'success' ? '#22c55e55' :
                        type === 'error'   ? '#ef444455' : 'var(--border)';
  t.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'error' ? 'exclamation-triangle-fill' : 'info-circle-fill'}" style="color:${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#38bdf8'}; margin-right:8px;"></i>${msg}`;
  requestAnimationFrame(() => {
    t.style.transform = 'translateY(0)'; t.style.opacity = '1';
  });
  clearTimeout(t._tm);
  t._tm = setTimeout(() => { t.style.transform = 'translateY(20px)'; t.style.opacity = '0'; }, 2800);
};

// Chip filters generic
document.querySelectorAll('[data-chip-group]').forEach(group => {
  group.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    if (chip.dataset.multi !== 'true') {
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    }
    chip.classList.toggle('active');
    const evt = new CustomEvent('chips:change', { detail: { active: [...group.querySelectorAll('.chip.active')].map(c => c.dataset.value) } });
    group.dispatchEvent(evt);
  });
});

// Simple search filter on cards
document.querySelectorAll('[data-search-input]').forEach(input => {
  const target = document.querySelector(input.dataset.searchInput);
  if (!target) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    target.querySelectorAll('[data-search-item]').forEach(item => {
      item.style.display = item.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  });
});

// Auth tabs
document.querySelectorAll('.auth-tabs').forEach(tabs => {
  tabs.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const panels = document.querySelectorAll('[data-auth-panel]');
    panels.forEach(p => p.classList.toggle('hidden', p.dataset.authPanel !== btn.dataset.tab));
  });
});

// Form fake submit handlers
document.querySelectorAll('form[data-fake]').forEach(f => {
  f.addEventListener('submit', e => {
    e.preventDefault();
    toast(f.dataset.fake || 'Action enregistrée avec succès !');
    if (f.dataset.reset === 'true') f.reset();
    if (f.dataset.closeModal) closeModal(f.dataset.closeModal);
  });
});
