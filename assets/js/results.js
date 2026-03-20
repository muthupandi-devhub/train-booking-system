/**
 * app.js
 * ─────────────────────────────────────────────────────────────
 *  index.html  → handleSearchSubmit()   (search form)
 *  results.html → initResultsPage()     (train list + filters)
 *
 *  Requires: data.js (loaded before this file)
 * ─────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  const page = detectPage();

  if (page === 'index')   initIndexPage();
  if (page === 'results') initResultsPage();
});


/* ══════════════════════════════════════════════════════════════
   PAGE DETECTION
══════════════════════════════════════════════════════════════ */
function detectPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === 'results.html') return 'results';
  return 'index';
}


/* ══════════════════════════════════════════════════════════════
   INDEX PAGE
══════════════════════════════════════════════════════════════ */
function initIndexPage() {
  /* Set today as default date */
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min   = today;
  }

  /* Quick-route chips */
  document.querySelectorAll('[data-route]').forEach(chip => {
    chip.addEventListener('click', () => {
      const [from, to] = chip.dataset.route.split('→').map(s => s.trim());
      const fromEl = document.getElementById('from');
      const toEl   = document.getElementById('to');
      if (fromEl) fromEl.value = from;
      if (toEl)   toEl.value   = to;
    });
  });

  /* Search button */
  const btn = document.getElementById('searchBtn');
  if (btn) btn.addEventListener('click', handleSearchSubmit);

  /* Enter key in inputs */
  ['from','to'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearchSubmit(); });
  });

  /* Dark toggle (data.js handles logic; just in case body-level class needed) */
  const darkBtn = document.getElementById('darkToggle');
  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }
}

function handleSearchSubmit() {
  const fromRaw = (document.getElementById('from')?.value || '').trim();
  const toRaw   = (document.getElementById('to')?.value   || '').trim();
  const dateEl  = document.querySelector('input[type="date"]');
  const date    = dateEl?.value || new Date().toISOString().split('T')[0];

  /* Validation ── both fields required */
  if (!fromRaw || !toRaw) {
    showToast('Please enter both From and To stations.', 'warn');
    if (!fromRaw) document.getElementById('from')?.focus();
    else           document.getElementById('to')?.focus();
    return;
  }

  /* Same station check */
  if (fromRaw.toLowerCase() === toRaw.toLowerCase()) {
    showToast('Origin and destination cannot be the same!', 'error');
    return;
  }

  /* Navigate to results with query params */
  const q = buildQuery({ from: fromRaw, to: toRaw, date });
  window.location.href = `results.html${q}`;
}


/* ══════════════════════════════════════════════════════════════
   RESULTS PAGE
══════════════════════════════════════════════════════════════ */
function initResultsPage() {
  /* Render search-summary bar */
  renderSearchSummary();

  /* Initial render */
  renderTrainList();

  /* Filter / sort listeners */
  const filterCls  = document.getElementById('filterClass');
  const sortSelect = document.getElementById('sortSelect');
  if (filterCls)  filterCls.addEventListener('change',  () => renderTrainList());
  if (sortSelect) sortSelect.addEventListener('change', () => renderTrainList());

  /* Dark toggle */
  const darkBtn = document.getElementById('darkToggle');
  if (darkBtn) darkBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

  /* Update resultCount on load */
  updateResultCount();
}

/* ── Search Summary Bar ─────────────────────────────────── */
function renderSearchSummary() {
  const rawFrom = getParam('from');
  const rawTo   = getParam('to');
  const date    = getParam('date');

  const fromCode = resolveCode(rawFrom);
  const toCode   = resolveCode(rawTo);
  const fromSt   = fromCode ? getStation(fromCode) : { city: rawFrom };
  const toSt     = toCode   ? getStation(toCode)   : { city: rawTo   };

  /* Update the static search-summary div in results.html */
  const el = document.querySelector('.search-summary');
  if (!el) return;

  el.innerHTML = `
    <div class="flex flex-wrap items-center gap-3 w-full">
      <span class="text-xl">🚆</span>
      <span class="font-bold text-white text-base">${fromSt.city}</span>
      <span class="text-orange-300 text-xl font-bold">➡️</span>
      <span class="font-bold text-white text-base">${toSt.city}</span>
      <span class="px-3 py-1 bg-orange-500/30 text-orange-200 text-sm rounded-full font-medium ml-1">
        ${formatDate(date)}
      </span>
      <a href="index.html"
         class="ml-auto px-3 py-1.5 bg-orange-500 hover:bg-orange-600
                text-white text-sm rounded-lg font-semibold transition-colors">
         Modify
      </a>
    </div>`;
}

/* ── Render Train Cards ─────────────────────────────────── */
function renderTrainList() {
  const rawFrom = getParam('from');
  const rawTo   = getParam('to');
  const date    = getParam('date');
  const cls     = document.getElementById('filterClass')?.value || '';
  const sortBy  = document.getElementById('sortSelect')?.value  || 'departure';

  const container = document.getElementById('trainList');
  if (!container) return;

  /* ── No input? show empty state immediately ── */
  if (!rawFrom || !rawTo) {
    container.innerHTML = buildNoTrainHTML(
      'Enter your route',
      'Please go back and enter both From and To stations.'
    );
    updateResultCount(0);
    return;
  }

  let trains = filterTrains(rawFrom, rawTo);

  /* Filter by class */
  if (cls) trains = trains.filter(t => t.classes.includes(cls));

  /* Sort */
  if (sortBy === 'departure') trains.sort((a, b) => a.departure.localeCompare(b.departure));
  if (sortBy === 'duration')  trains.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
  if (sortBy === 'price')     trains.sort((a, b) =>
    Math.min(...Object.values(a.price)) - Math.min(...Object.values(b.price)));
  if (sortBy === 'rating')    trains.sort((a, b) => b.rating - a.rating);

  updateResultCount(trains.length);

  /* ── No trains found ── */
  if (trains.length === 0) {
    const fromSt = getStation(resolveCode(rawFrom) || '') || { city: rawFrom };
    const toSt   = getStation(resolveCode(rawTo)   || '') || { city: rawTo };
    container.innerHTML = buildNoTrainHTML(
      'No Trains Found',
      `No direct trains found from <strong>${fromSt.city}</strong> to <strong>${toSt.city}</strong>
       on ${formatDate(date)}.<br>Try a different date or route.`
    );
    return;
  }

  /* ── Build cards ── */
  container.innerHTML = trains.map(train => buildTrainCard(train, date)).join('');
}

/* No-trains-found template */
function buildNoTrainHTML(title, message) {
  return `
    <div class="no-train-container" style="padding:3rem 1rem;text-align:center">
      <div class="icon" style="font-size:4rem;margin-bottom:1rem">🚆</div>
      <h3 class="font-bold text-xl text-gray-700 dark:text-gray-200 mb-2">${title}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">${message}</p>
      <a href="index.html"
         class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl
                font-semibold transition-colors inline-block">
        ← Back to Search
      </a>
    </div>`;
}

/* Result count badge */
function updateResultCount(count) {
  const el = document.getElementById('resultCount');
  if (!el) return;
  if (count === undefined) {
    const from = getParam('from');
    const to   = getParam('to');
    const cls  = document.getElementById('filterClass')?.value || '';
    let trains = filterTrains(from, to);
    if (cls) trains = trains.filter(t => t.classes.includes(cls));
    count = trains.length;
  }
  el.textContent = `${count} train(s) found`;
}

/* Parse "7h 55m" → minutes */
function parseDuration(str) {
  const m = str.match(/(\d+)h\s*(\d+)m/);
  return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 0;
}


/* ── Train Card HTML ────────────────────────────────────── */
function buildTrainCard(train, date) {
  const classButtons = train.classes.map(cls => {
    const avail = getAvailableCount(train, cls);
    const badge = availabilityBadge(avail);
    return `
      <button onclick="selectTrainClass('${train.id}','${cls}','${date}')"
        class="flex flex-col items-center p-2 border-2 border-transparent
               hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20
               rounded-xl transition-all duration-200 cursor-pointer min-w-[80px]">
        <span class="text-xs font-bold text-orange-700 dark:text-orange-300">${cls}</span>
        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">₹${train.price[cls]}</span>
        <div class="mt-1">${badge}</div>
      </button>`;
  }).join('');

  const amenityIcons = { 'Pantry':'🍛','Charging':'🔌','Wifi':'📶','Blanket':'🛏','Meals':'🍱' };
  const amenities = (train.amenities || []).map(a =>
    `<span class="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded
                  text-gray-600 dark:text-gray-300">${amenityIcons[a] || '•'} ${a}</span>`
  ).join('');

  const typeColor = TRAIN_TYPE_COLORS[train.type] || 'bg-gray-100 text-gray-700';
  const dayDots   = DAYS_SHORT.map((d, i) => `
    <span title="${d}"
      class="w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium
             ${train.daysOfWeek.includes(i)
               ? 'bg-orange-500 text-white'
               : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}">${d[0]}</span>`
  ).join('');

  return `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md
                border border-gray-100 dark:border-gray-700 overflow-hidden
                transition-all duration-300 hover:-translate-y-0.5 mx-4 md:mx-auto max-w-3xl">
      <div class="p-4 pb-3">
        <!-- Header -->
        <div class="flex items-start justify-between gap-2 mb-3">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-bold text-gray-900 dark:text-white text-base">${train.name}</h3>
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full ${typeColor}">${train.type}</span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              #${train.number} · <span class="text-amber-500">★ ${train.rating}</span>
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400">from</p>
            <p class="text-orange-600 dark:text-orange-400 font-bold text-lg">
              ₹${Math.min(...Object.values(train.price))}
            </p>
          </div>
        </div>

        <!-- Time strip -->
        <div class="flex items-center gap-3">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${train.departure}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">${getStation(train.from).city}</p>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <p class="text-xs text-gray-400 mb-1">${train.duration}</p>
            <div class="w-full flex items-center gap-1">
              <div class="h-0.5 flex-1 bg-gradient-to-r from-orange-300 to-orange-500 rounded"></div>
              <span class="text-orange-500 text-xs">🚆</span>
              <div class="h-0.5 flex-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded"></div>
            </div>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${train.arrival}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">${getStation(train.to).city}</p>
          </div>
        </div>

        <!-- Days + Amenities -->
        <div class="flex items-center gap-2 mt-3 flex-wrap">
          ${dayDots}
          ${amenities ? `<span class="text-gray-300 mx-1">|</span>${amenities}` : ''}
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-dashed border-gray-200 dark:border-gray-700"></div>

      <!-- Class selection -->
      <div class="p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
          Select Class &amp; Book
        </p>
        <div class="flex gap-2 flex-wrap">${classButtons}</div>
      </div>
    </div>`;
}


/* ── Select a class → go to seat.html ──────────────────── */
function selectTrainClass(trainId, cls, date) {
  const train = getTrainById(trainId);
  if (!train) return;

  const avail = getAvailableCount(train, cls);
  if (avail <= 0) {
    showToast('No seats available in this class! Try another class.', 'error');
    return;
  }

  /* Save booking context to sessionStorage */
  setCurrentBooking({ train, cls, date, step: 'seat' });

  window.location.href = 'seat.html';
}
