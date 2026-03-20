/**
 * seat.js
 * ─────────────────────────────────────────────────────────────
 *  seat.html  → seat grid, coach switching, max-6-seat limit,
 *               real-time price calculation per class
 *
 * 
 * ─────────────────────────────────────────────────────────────
 */

/* ── State ──────────────────────────────────────────────── */
let selectedSeats   = [];   // array of seat numbers (strings)
let currentCoach    = 'S1'; // active coach tab

/* Coaches & their booked-seat patterns (random-ish but stable per trainId) */
const COACHES = ['S1','S2','S3','S4'];

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Only run on seat.html — not on index/results pages */
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage !== 'seat.html') return;

  const booking = getCurrentBooking();

  if (!booking || !booking.train) {
    /* Nothing in session → silently redirect back, no toast */
    window.location.href = 'index.html';
    return;
  }

  populateJourneyInfo(booking);
  renderSeatLayout(booking);
  updateSeatSummary();
});


/* ══════════════════════════════════════════════════════════════
   JOURNEY INFO BAR  (top gradient card)
══════════════════════════════════════════════════════════════ */
function populateJourneyInfo(booking) {
  const { train, cls, date } = booking;
  const el = document.getElementById('seatJourneyInfo');
  if (!el) return;

  const fromSt = getStation(train.from);
  const toSt   = getStation(train.to);
  const avail  = getAvailableCount(train, cls);
  const price  = train.price[cls] || 0;

  el.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-3 text-white mb-1">
          <div class="text-center">
            <p class="text-xl font-bold">${train.departure}</p>
            <p class="text-indigo-200 text-xs">${fromSt.city}</p>
          </div>
          <div class="flex-1 text-center">
            <p class="text-xs text-indigo-300">${train.duration}</p>
            <div class="flex items-center gap-1 mt-1">
              <div class="h-px flex-1 bg-indigo-400"></div>
              <span class="text-base">🚆</span>
              <div class="h-px flex-1 bg-indigo-400"></div>
            </div>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold">${train.arrival}</p>
            <p class="text-indigo-200 text-xs">${toSt.city}</p>
          </div>
        </div>
        <p class="text-indigo-200 text-xs">${train.name} · #${train.number}</p>
      </div>
      <div class="text-right">
        <p class="text-white font-bold text-lg">${CLASS_NAMES[cls] || cls}</p>
        <p class="text-indigo-200 text-sm">₹${price} / seat</p>
        <p class="text-xs mt-1 ${avail <= 10 ? 'text-amber-300' : 'text-emerald-300'}">
          ${avail} seats available
        </p>
        <p class="text-indigo-200 text-xs">${formatDate(date)}</p>
      </div>
    </div>`;
}


/* ══════════════════════════════════════════════════════════════
   SEAT LAYOUT RENDERER
══════════════════════════════════════════════════════════════ */
function renderSeatLayout(booking) {
  const { train, cls } = booking;
  const grid = document.getElementById('seatGrid');
  if (!grid) return;

  /* How many total seats in this coach for the class */
  const totalPerCoach = Math.ceil((train.totalSeats[cls] || 60) / COACHES.length);
  const bookedPerCoach= Math.ceil((train.bookedSeats[cls] || 0) / COACHES.length);

  /* Generate a stable set of booked seat indices using train id + coach as seed */
  const bookedSet = generateBookedSet(train.id + currentCoach, bookedPerCoach, totalPerCoach);

  /* Update available-count label */
  const countEl = document.getElementById('coachAvailCount');
  if (countEl) {
    const avail = totalPerCoach - bookedSet.size;
    countEl.textContent = `${avail} seats available in this coach`;
  }

  /* Build seat rows: 8 berths per bay (berth layout: L U M — aisle — SL SU) */
  const BERTH_LABELS = ['LB','MB','UB','SL','SU']; // Lower, Mid, Upper, Side-Lower, Side-Upper
  const rows = [];
  let seatNum = 1;
  const baseNum = COACHES.indexOf(currentCoach) * totalPerCoach + 1;

  /* Simple grid: 2 columns × N rows */
  const seatsPerRow = 4;
  const numRows = Math.ceil(totalPerCoach / seatsPerRow);

  grid.innerHTML = '';

  /* Bay header */
  for (let row = 0; row < numRows; row++) {
    const bayDiv = document.createElement('div');
    bayDiv.className = 'mb-3';

    const bayHeader = document.createElement('p');
    bayHeader.className = 'text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium';
    bayHeader.textContent = `Bay ${row + 1}`;
    bayDiv.appendChild(bayHeader);

    const seatRow = document.createElement('div');
    seatRow.className = 'grid grid-cols-4 gap-2';

    for (let col = 0; col < seatsPerRow; col++) {
      const absIdx = row * seatsPerRow + col;
      if (absIdx >= totalPerCoach) break;

      const sNum     = baseNum + absIdx;
      const sLabel   = String(sNum);
      const berth    = BERTH_LABELS[col % BERTH_LABELS.length];
      const isBooked = bookedSet.has(absIdx);
      const isSelected = selectedSeats.includes(sLabel);

      const btn = document.createElement('button');
      btn.id    = `seat_${sLabel}`;
      btn.title = `Seat ${sLabel} (${berth})`;
      btn.disabled = isBooked;
      btn.onclick  = () => toggleSeat(sLabel, booking);

      let classes = `relative flex flex-col items-center justify-center
                     w-full aspect-square rounded-lg border-2 text-xs font-bold
                     transition-all duration-150 select-none `;

      if (isBooked) {
        classes += `bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800
                    text-red-400 opacity-50 cursor-not-allowed`;
        btn.innerHTML = `<span>${sLabel}</span><span class="text-[9px] font-normal opacity-70">Booked</span>`;
      } else if (isSelected) {
        classes += `bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-200
                    dark:shadow-indigo-900 scale-105`;
        btn.innerHTML = `<span>${sLabel}</span><span class="text-[9px] font-normal opacity-80">${berth}</span>`;
      } else {
        classes += `bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700
                    text-emerald-700 dark:text-emerald-300 hover:border-indigo-400 hover:bg-indigo-50
                    dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300`;
        btn.innerHTML = `<span>${sLabel}</span><span class="text-[9px] font-normal opacity-70">${berth}</span>`;
      }

      btn.className = classes;
      seatRow.appendChild(btn);
    }

    bayDiv.appendChild(seatRow);
    grid.appendChild(bayDiv);
  }
}

/* ══════════════════════════════════════════════════════════════
   TOGGLE SEAT
══════════════════════════════════════════════════════════════ */
function toggleSeat(seatLabel, booking) {
  const idx = selectedSeats.indexOf(seatLabel);

  if (idx === -1) {
    /* ADD seat */
    if (selectedSeats.length >= MAX_SEATS) {
      showToast(`Maximum ${MAX_SEATS} seats allowed per booking!`, 'warn');
      /* Shake the button */
      const btn = document.getElementById(`seat_${seatLabel}`);
      if (btn) {
        btn.classList.add('animate-bounce');
        setTimeout(() => btn.classList.remove('animate-bounce'), 600);
      }
      return;
    }
    selectedSeats.push(seatLabel);
  } else {
    /* REMOVE seat */
    selectedSeats.splice(idx, 1);
  }

  /* Re-render just the affected button instead of full grid */
  const btn = document.getElementById(`seat_${seatLabel}`);
  if (btn) {
    const BERTH_LABELS = ['LB','MB','UB','SL','SU'];
    const num   = parseInt(seatLabel);
    const coachBase = (COACHES.indexOf(currentCoach)) * Math.ceil((booking.train.totalSeats[booking.cls] || 60) / COACHES.length) + 1;
    const col   = (num - coachBase) % 4;
    const berth = BERTH_LABELS[col % BERTH_LABELS.length];
    const isNowSelected = selectedSeats.includes(seatLabel);

    if (isNowSelected) {
      btn.className = `relative flex flex-col items-center justify-center
                       w-full aspect-square rounded-lg border-2 text-xs font-bold
                       transition-all duration-150 select-none
                       bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-200
                       dark:shadow-indigo-900 scale-105`;
    } else {
      btn.className = `relative flex flex-col items-center justify-center
                       w-full aspect-square rounded-lg border-2 text-xs font-bold
                       transition-all duration-150 select-none
                       bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700
                       text-emerald-700 dark:text-emerald-300 hover:border-indigo-400 hover:bg-indigo-50
                       dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300`;
    }
    btn.innerHTML = `<span>${seatLabel}</span>
                     <span class="text-[9px] font-normal opacity-70">${berth}</span>`;
  }

  updateSeatSummary();
}


/* ══════════════════════════════════════════════════════════════
   BOTTOM SUMMARY BAR
══════════════════════════════════════════════════════════════ */
function updateSeatSummary() {
  const booking  = getCurrentBooking();
  const countEl  = document.getElementById('selectedCount');
  const totalEl  = document.getElementById('selectedTotal');
  const listEl   = document.getElementById('selectedList');
  const procBtn  = document.getElementById('proceedBtn');

  const count = selectedSeats.length;
  const price = booking ? (booking.train.price[booking.cls] || 0) : 0;
  const total = count * price;

  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  if (listEl)  listEl.textContent  = count > 0 ? `Seats: ${selectedSeats.join(', ')}` : 'No seats selected';

  if (procBtn) procBtn.disabled = count === 0;
}


/* ══════════════════════════════════════════════════════════════
   COACH SWITCHER  (called from seat.html inline script)
══════════════════════════════════════════════════════════════ */
function selectCoach(coach) {
  currentCoach  = coach;
  selectedSeats = [];   // reset selection when changing coach

  /* Update active coach button */
  document.querySelectorAll('[id^="coachBtn_"]').forEach(btn => {
    btn.className = `px-4 py-1.5 rounded-full border-2 border-gray-200 dark:border-gray-600
      bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
      text-sm font-bold whitespace-nowrap hover:border-indigo-400 transition-colors`;
  });
  const active = document.getElementById(`coachBtn_${coach}`);
  if (active) {
    active.className = `px-4 py-1.5 rounded-full border-2 border-indigo-500 bg-indigo-600
      text-white text-sm font-bold whitespace-nowrap transition-colors`;
  }

  /* Update label */
  const lbl = document.getElementById('coachLabel');
  if (lbl) lbl.textContent = `Coach ${coach}`;

  /* Re-render */
  const booking = getCurrentBooking();
  if (booking) {
    renderSeatLayout(booking);
    updateSeatSummary();
  }
}


/* ══════════════════════════════════════════════════════════════
   PROCEED BUTTON  (seat.html → next step / passenger page)
══════════════════════════════════════════════════════════════ */
function proceedFromSeat() {
  if (selectedSeats.length === 0) {
    showToast('Please select at least 1 seat.', 'warn');
    return;
  }

  const booking = getCurrentBooking();
  if (!booking) return;

  /* Update booking with selected seats */
  setCurrentBooking({
    ...booking,
    seats  : selectedSeats,
    coach  : currentCoach,
    step   : 'passenger',
    total  : selectedSeats.length * (booking.train.price[booking.cls] || 0),
  });

  /* Go to passenger details page (adjust href to your actual page) */
  window.location.href = 'booking.html';
}


/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

/**
 * Generate a deterministic "random" set of booked seat indices.
 * Same seed → same result every render (no flickering).
 */
function generateBookedSet(seed, count, total) {
  const set = new Set();
  let hash  = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  let attempts = 0;
  while (set.size < Math.min(count, total) && attempts < total * 3) {
    hash  = ((hash * 1664525) + 1013904223) | 0;
    const idx = Math.abs(hash) % total;
    set.add(idx);
    attempts++;
  }
  return set;
}
