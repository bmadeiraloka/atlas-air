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
updateRestCountdown();
setInterval(updateRestCountdown, 60000);

// ─── Live field updates ─────────────────────────────────────
function applyFieldUpdate(id, newValue, tagId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = newValue;
  el.classList.remove('card__meta-value--updated');
  void el.offsetWidth; // reflow to restart animation
  el.classList.add('card__meta-value--updated');
  el.addEventListener('animationend', () => el.classList.remove('card__meta-value--updated'), { once: true });
  if (tagId) {
    const tag = document.getElementById(tagId);
    if (tag) tag.style.display = 'inline-block';
  }
}

function triggerFlightUpdates() {
  applyFieldUpdate('plan-gate', 'B19', 'gate-tag');
}

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

  if (mode === 'rest') {
    updateRestCountdown();
  }

  if (mode === 'plan') {
    const card = document.getElementById('plan-ai-card');
    if (card) {
      card.style.display = 'none';
      clearTimeout(aiTimers.plan);
      aiTimers.plan = setTimeout(() => { card.style.display = 'block'; triggerFlightUpdates(); }, 2000);
    }
  }
}

modeBtns.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));

// Show AI card 2s after page load
setTimeout(() => {
  const card = document.getElementById('plan-ai-card');
  if (card && currentMode === 'plan') {
    card.style.display = 'block';
    triggerFlightUpdates();
  }
}, 2000);

// ─── Start duty ────────────────────────────────────────────
document.getElementById('start-duty-btn')?.addEventListener('click', () => {
  const btn = document.getElementById('start-duty-btn');
  btn.textContent = 'Starting…';
  btn.disabled = true;

  // Lock Rest tab while on duty
  document.getElementById('rest-tab')?.classList.add('locked');

  setTimeout(() => switchMode('flight'), 600);
});

// ─── Complete flight ────────────────────────────────────────
document.getElementById('complete-flight-btn')?.addEventListener('click', () => {
  const btn = document.getElementById('complete-flight-btn');
  btn.textContent = 'Completing…';
  btn.disabled = true;

  // Unlock Rest tab
  document.getElementById('rest-tab')?.classList.remove('locked');

  setTimeout(() => switchMode('rest'), 600);
});

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
  const cb      = document.getElementById('complete-bar');
  overlay.style.opacity    = '';
  overlay.style.transition = '';
  overlay.style.display    = 'flex';
  sv.style.display         = 'none';
  if (fc) fc.style.display = 'none';
  if (cb) cb.style.display = 'none';
}

document.getElementById('wakeup-cta')?.addEventListener('click', () => {
  const overlay = document.getElementById('wakeup-overlay');
  overlay.style.transition = 'opacity 0.4s';
  overlay.style.opacity    = '0';

  setTimeout(() => {
    overlay.style.display = 'none';
    const sv = document.getElementById('schedule-view');
    sv.style.display = 'flex';

    // Show complete bar and AI card with staggered delays
    clearTimeout(aiTimers.flight);
    aiTimers.flight = setTimeout(() => {
      const fc = document.getElementById('flight-ai-card');
      if (fc) fc.style.display = 'block';
    }, 2000);

    setTimeout(() => {
      const cb = document.getElementById('complete-bar');
      if (cb) cb.style.display = 'flex';
    }, 4000);
  }, 400);
});

// ─── Rest countdown ─────────────────────────────────────────
function updateRestCountdown() {
  const now = new Date();
  const restStart = new Date(); restStart.setHours(14, 15, 0, 0);
  const restEnd   = new Date(); restEnd.setHours(22,  0, 0, 0);
  const totalMs     = restEnd - restStart;
  const remainingMs = restEnd - now;
  const pct = Math.max(0, Math.min(100, ((now - restStart) / totalMs) * 100));

  const fill = document.getElementById('rest-progress-fill');
  if (fill) fill.style.width = `${pct.toFixed(1)}%`;

  const hero = document.getElementById('rest-hero-time');
  if (hero) {
    if (remainingMs <= 0) {
      hero.textContent = '0h 0m';
    } else {
      const h = Math.floor(remainingMs / 3600000);
      const m = Math.floor((remainingMs % 3600000) / 60000);
      hero.textContent = `${h}h ${m}m`;
    }
  }
}

document.getElementById('return-duty-btn')?.addEventListener('click', () => {
  const btn = document.getElementById('return-duty-btn');
  btn.textContent = 'Returning…';
  btn.disabled = true;
  setTimeout(() => switchMode('plan'), 600);
});

// ─── Upcoming flights toggle ────────────────────────────────
document.querySelectorAll('.toggle-btn[data-upcoming]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn[data-upcoming]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.upcoming;
    document.getElementById('upcoming-week').style.display  = view === 'week'  ? 'block' : 'none';
    document.getElementById('upcoming-month').style.display = view === 'month' ? 'block' : 'none';
  });
});

// ─── AI floating panel ──────────────────────────────────────
const aiFloatBtn   = document.getElementById('ai-float-btn');
const aiPanel      = document.getElementById('ai-panel');
const aiPanelClose = document.getElementById('ai-panel-close');
const aiMsgs       = document.getElementById('ai-panel-msgs');
const aiInput      = document.getElementById('ai-panel-input');
const aiSendBtn    = document.getElementById('ai-panel-send');

function toggleAiPanel(forceOpen) {
  const open = forceOpen !== undefined ? forceOpen : !aiPanel.classList.contains('open');
  aiPanel.classList.toggle('open', open);
  aiFloatBtn.classList.toggle('open', open);
  if (open) aiInput.focus();
}

aiFloatBtn.addEventListener('click', () => toggleAiPanel());
aiPanelClose.addEventListener('click', () => toggleAiPanel(false));

const aiKnowledge = [
  { keys: ['gate'],                       reply: 'Your gate was updated to B19 about 2 hours ago — 11-minute walk from the crew lounge. Recommend departing by 06:38 to board on time.' },
  { keys: ['weather', 'wind', 'vis'],     reply: 'JFK right now: 34°F, overcast, wind 12 kt NW, vis 10 sm. LAX on arrival: 72°F and clear. No weather holds expected on either end.' },
  { keys: ['turbulence', 'bump', 'rough'],reply: 'Turbulence reported at FL360 over Nevada. Three of your last five JFK–LAX runs deviated via FL340. Dispatch has already pre-approved that alternate.' },
  { keys: ['delay', 'on time', 'status', 'late'], reply: 'AA 204 is currently on time. Pushback 07:00, wheels up 07:15. No ATC delays on the corridor right now.' },
  { keys: ['load', 'passenger', 'pax'],   reply: '187 passengers confirmed — 86% load factor out of 218 seats. Cabin crew has the full manifest loaded.' },
  { keys: ['crew'],                        reply: 'All 6 crew members are checked in and ready. F/O R. Chen confirmed at 04:15. Full cabin manifest is loaded.' },
  { keys: ['fuel', 'aircraft', 'plane'],  reply: "You're on a B767-300 today. Fuel load confirmed by ground crew and aligns with the FL380 preferred routing from dispatch." },
  { keys: ['route', 'altitude', 'fl'],    reply: 'Dispatch recommends FL380. Given the turbulence at FL360 over Nevada, FL340 is pre-approved and has been effective on your last three westbound runs.' },
  { keys: ['report', 'check-in', 'report time'], reply: 'Report time is 06:00. Gate B19 closes 06:50. You\'re currently on track.' },
  { keys: ['duration', 'how long', 'flight time'], reply: 'Block time for AA 204 is 5h 47m. Scheduled arrival LAX 13:02 local.' },
];

function getAiReply(text) {
  const q = text.toLowerCase();
  for (const item of aiKnowledge) {
    if (item.keys.some(k => q.includes(k))) return item.reply;
  }
  return "I can help with your gate, weather, flight status, crew, turbulence, route, or anything else about AA 204 today. What would you like to know?";
}

function appendMsg(text, who) {
  const wrap = document.createElement('div');
  wrap.className = `ai-msg ai-msg--${who}`;
  const p = document.createElement('p');
  p.className = 'ai-msg__text';
  p.textContent = text;
  wrap.appendChild(p);
  aiMsgs.appendChild(wrap);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
  return wrap;
}

function sendMessage() {
  const text = aiInput.value.trim();
  if (!text) return;
  aiInput.value = '';
  appendMsg(text, 'user');
  const typing = appendMsg('Thinking…', 'ai');
  typing.classList.add('ai-msg--typing');
  setTimeout(() => {
    typing.remove();
    appendMsg(getAiReply(text), 'ai');
  }, 700 + Math.random() * 500);
}

aiSendBtn.addEventListener('click', sendMessage);
aiInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
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
