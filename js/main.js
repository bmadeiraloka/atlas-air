// ─── Live clock ────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const t = `${h}:${m}`;
  const el = document.getElementById('live-time');
  const wu = document.getElementById('wakeup-time');
  if (el) el.textContent = t;
  if (wu) wu.textContent = t;
}
updateClock();
setInterval(updateClock, 10000);

// ─── Mode switcher ──────────────────────────────────────────
const modeBtns = document.querySelectorAll('.mode-btn');
let currentMode = 'plan';
let aiTimers = {};

function switchMode(mode) {
  currentMode = mode;
  modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  const target = document.getElementById(`screen-${mode}`);
  if (target) target.classList.add('active');

  if (mode === 'flight') {
    showWakeup();
    clearTimeout(aiTimers.flight);
  }

  if (mode === 'plan') {
    const card = document.getElementById('plan-ai-card');
    if (card) {
      card.style.display = 'none';
      clearTimeout(aiTimers.plan);
      aiTimers.plan = setTimeout(() => { card.style.display = 'block'; }, 2000);
    }
  }
}

modeBtns.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));

// Show AI card 2s after page load
setTimeout(() => {
  const card = document.getElementById('plan-ai-card');
  if (card && currentMode === 'plan') card.style.display = 'block';
}, 2000);

// ─── AI card dismiss ────────────────────────────────────────
document.getElementById('plan-ai-dismiss')?.addEventListener('click', () => {
  document.getElementById('plan-ai-card').style.display = 'none';
});

document.getElementById('flight-ai-dismiss')?.addEventListener('click', () => {
  document.getElementById('flight-ai-card').style.display = 'none';
});

// ─── Wake-up CTA ────────────────────────────────────────────
function showWakeup() {
  const overlay = document.getElementById('wakeup-overlay');
  const sv      = document.getElementById('schedule-view');
  const fc      = document.getElementById('flight-ai-card');
  overlay.style.opacity    = '';
  overlay.style.transition = '';
  overlay.style.display    = 'flex';
  sv.style.display         = 'none';
  if (fc) fc.style.display = 'none';
}

document.getElementById('wakeup-cta')?.addEventListener('click', () => {
  const overlay = document.getElementById('wakeup-overlay');
  overlay.style.transition = 'opacity 0.4s';
  overlay.style.opacity    = '0';

  setTimeout(() => {
    overlay.style.display = 'none';
    const sv = document.getElementById('schedule-view');
    sv.style.display = 'flex';

    clearTimeout(aiTimers.flight);
    aiTimers.flight = setTimeout(() => {
      const fc = document.getElementById('flight-ai-card');
      if (fc) fc.style.display = 'block';
    }, 2000);
  }, 400);
});

// ─── AI pill feedback ───────────────────────────────────────
document.querySelectorAll('.ai-pill').forEach(pill => {
  pill.addEventListener('click', function () {
    const original = this.textContent;
    this.textContent = 'Done ✓';
    this.style.opacity = '0.5';
    this.disabled = true;
    setTimeout(() => {
      this.textContent = original;
      this.style.opacity = '';
      this.disabled = false;
    }, 2000);
  });
});
