/**
 * data.js
 * ─────────────────────────────────────────────
 *  · All station & train master data
 *  · Helper functions used by app.js + booking.js
 *  · currentBooking state (saved in sessionStorage)
 * ─────────────────────────────────────────────
 */

/* ══════════════════════════════════════════
   1.  STATIONS
══════════════════════════════════════════ */
const STATIONS = {
  MAS : { code:'MAS', city:'Chennai Central',   state:'TN' },
  MSB : { code:'MSB', city:'Chennai Beach',     state:'TN' },
  MDU : { code:'MDU', city:'Madurai',           state:'TN' },
  CBE : { code:'CBE', city:'Coimbatore',        state:'TN' },
  TPJ : { code:'TPJ', city:'Trichy',            state:'TN' },
  SA  : { code:'SA',  city:'Salem',             state:'TN' },
  ED  : { code:'ED',  city:'Erode',             state:'TN' },
  TEN : { code:'TEN', city:'Tirunelveli',       state:'TN' },
  NCJ : { code:'NCJ', city:'Nagercoil',         state:'TN' },
  KPD : { code:'KPD', city:'Katpadi (Vellore)', state:'TN' },
  MTP : { code:'MTP', city:'Mettupalayam',      state:'TN' },
  UA  : { code:'UA',  city:'Udhagamandalam (Ooty)', state:'TN' },
  PY  : { code:'PY',  city:'Puducherry',        state:'TN' },
  TUT : { code:'TUT', city:'Thoothukudi',       state:'TN' },
};

/* Alias map — whatever the user types → station code */
const CITY_ALIAS = {
  'chennai'               : 'MAS',
  'chennai central'       : 'MAS',
  'madurai'               : 'MDU',
  'coimbatore'            : 'CBE',
  'trichy'                : 'TPJ',
  'tiruchirappalli'       : 'TPJ',
  'salem'                 : 'SA',
  'erode'                 : 'ED',
  'tirunelveli'           : 'TEN',
  'nagercoil'             : 'NCJ',
  'vellore'               : 'KPD',
  'katpadi'               : 'KPD',
  'mettupalayam'          : 'MTP',
  'ooty'                  : 'UA',
  'udhagamandalam'        : 'UA',
  'pondicherry'           : 'PY',
  'puducherry'            : 'PY',
  'thoothukudi'           : 'TUT',
  'tuticorin'             : 'TUT',
};

/* ══════════════════════════════════════════
   2.  TRAIN DATABASE  (17 TN routes)
══════════════════════════════════════════ */
const TRAINS = [
  /* ── Chennai ↔ Madurai ──────────────────── */
  {
    id:'TN001', number:'12635', name:'Vaigai SF Express',
    from:'MAS', to:'MDU',
    departure:'12:10', arrival:'20:05', duration:'7h 55m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A'],
    price:{ SL:285, '3A':545, '2A':785 },
    totalSeats:{ SL:120, '3A':64, '2A':46 },
    bookedSeats:{ SL:45, '3A':20, '2A':10 },
    rating:4.2, type:'Superfast',
    amenities:['Pantry','Charging','Wifi'],
  },
  {
    id:'TN002', number:'12637', name:'Pandian SF Express',
    nameTA:'பாண்டியன் விரைவு எக்ஸ்பிரஸ்',
    from:'MAS', to:'MDU',
    departure:'21:00', arrival:'05:30', duration:'8h 30m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A','1A'],
    price:{ SL:310, '3A':585, '2A':845, '1A':1450 },
    totalSeats:{ SL:180, '3A':96, '2A':46, '1A':18 },
    bookedSeats:{ SL:120, '3A':60, '2A':20, '1A':5 },
    rating:4.5, type:'Superfast',
    amenities:['Pantry','Charging','Wifi','Blanket'],
  },
  {
    id:'TN003', number:'22631', name:'Ananthapuri Express',
    nameTA:'அனந்தபுரி எக்ஸ்பிரஸ்',
    from:'MAS', to:'MDU',
    departure:'07:15', arrival:'15:40', duration:'8h 25m',
    daysOfWeek:[0,1,3,5],
    classes:['SL','3A','2A','1A'],
    price:{ SL:295, '3A':560, '2A':810, '1A':1390 },
    totalSeats:{ SL:180, '3A':96, '2A':46, '1A':18 },
    bookedSeats:{ SL:60, '3A':30, '2A':10, '1A':2 },
    rating:4.1, type:'Express',
    amenities:['Pantry','Charging'],
  },

  /* ── Chennai ↔ Coimbatore ───────────────── */
  {
    id:'TN004', number:'12673', name:'Cheran SF Express',
    nameTA:'சேரன் விரைவு எக்ஸ்பிரஸ்',
    from:'MAS', to:'CBE',
    departure:'22:00', arrival:'06:45', duration:'8h 45m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A','1A'],
    price:{ SL:340, '3A':640, '2A':935, '1A':1580 },
    totalSeats:{ SL:180, '3A':96, '2A':46, '1A':18 },
    bookedSeats:{ SL:150, '3A':75, '2A':35, '1A':10 },
    rating:4.6, type:'Superfast',
    amenities:['Pantry','Charging','Wifi','Blanket'],
  },
  {
    id:'TN005', number:'12675', name:'Kovai SF Express',
    nameTA:'கோவை விரைவு எக்ஸ்பிரஸ்',
    from:'MAS', to:'CBE',
    departure:'15:05', arrival:'23:30', duration:'8h 25m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['CC','2S'],
    price:{ CC:620, '2S':205 },
    totalSeats:{ CC:280, '2S':420 },
    bookedSeats:{ CC:120, '2S':200 },
    rating:4.3, type:'Superfast',
    amenities:['Pantry','Charging'],
  },
  {
    id:'TN006', number:'11013', name:'Coimbatore Mail',
    nameTA:'கோயம்புத்தூர் மெயில்',
    from:'MAS', to:'CBE',
    departure:'21:30', arrival:'08:00', duration:'10h 30m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A','1A'],
    price:{ SL:315, '3A':600, '2A':875, '1A':1490 },
    totalSeats:{ SL:180, '3A':64, '2A':46, '1A':18 },
    bookedSeats:{ SL:80, '3A':30, '2A':12, '1A':3 },
    rating:4.0, type:'Express',
    amenities:['Charging','Blanket'],
  },

  /* ── Chennai ↔ Trichy ───────────────────── */
  {
    id:'TN007', number:'12165', name:'Cauvery SF Express',
    nameTA:'காவேரி விரைவு எக்ஸ்பிரஸ்',
    from:'MAS', to:'TPJ',
    departure:'08:10', arrival:'14:05', duration:'5h 55m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A'],
    price:{ SL:220, '3A':415, '2A':605 },
    totalSeats:{ SL:120, '3A':64, '2A':46 },
    bookedSeats:{ SL:40, '3A':15, '2A':8 },
    rating:4.1, type:'Superfast',
    amenities:['Charging','Wifi'],
  },
  {
    id:'TN008', number:'12155', name:'Pallavan SF Express',
    nameTA:'பல்லவன் விரைவு எக்ஸ்பிரஸ்',
    from:'MAS', to:'TPJ',
    departure:'06:10', arrival:'11:40', duration:'5h 30m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['CC','2S'],
    price:{ CC:430, '2S':155 },
    totalSeats:{ CC:280, '2S':420 },
    bookedSeats:{ CC:100, '2S':180 },
    rating:4.0, type:'Superfast',
    amenities:['Charging'],
  },

  /* ── Chennai ↔ Salem ────────────────────── */
  {
    id:'TN009', number:'12243', name:'Shatabdi Express (Salem)',
    nameTA:'சேலம் சதாப்தி எக்ஸ்பிரஸ்',
    from:'MAS', to:'SA',
    departure:'06:00', arrival:'10:30', duration:'4h 30m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['CC','EC'],
    price:{ CC:720, EC:1350 },
    totalSeats:{ CC:280, EC:56 },
    bookedSeats:{ CC:130, EC:20 },
    rating:4.7, type:'Shatabdi',
    amenities:['Meals','Charging','Wifi'],
  },

  /* ── Chennai ↔ Tirunelveli / Nagercoil ─── */
  {
    id:'TN010', number:'12661', name:'Nellai SF Express',
    nameTA:'நெல்லை விரைவு எக்ஸ்பிரஸ்',
    from:'MAS', to:'TEN',
    departure:'19:00', arrival:'06:30', duration:'11h 30m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A','1A'],
    price:{ SL:420, '3A':790, '2A':1150, '1A':1970 },
    totalSeats:{ SL:180, '3A':96, '2A':46, '1A':18 },
    bookedSeats:{ SL:100, '3A':50, '2A':22, '1A':8 },
    rating:4.3, type:'Superfast',
    amenities:['Pantry','Charging','Blanket'],
  },
  {
    id:'TN011', number:'16731', name:'Pothigai Express',
    nameTA:'பொதிகை எக்ஸ்பிரஸ்',
    from:'MAS', to:'NCJ',
    departure:'20:30', arrival:'09:45', duration:'13h 15m',
    daysOfWeek:[0,2,4,6],
    classes:['SL','3A','2A'],
    price:{ SL:450, '3A':855, '2A':1240 },
    totalSeats:{ SL:180, '3A':64, '2A':46 },
    bookedSeats:{ SL:70, '3A':25, '2A':10 },
    rating:4.0, type:'Express',
    amenities:['Pantry','Charging'],
  },

  /* ── Chennai ↔ Ooty (Nilgiri Mountain) ─── */
  {
    id:'TN012', number:'11071', name:'Nilgiri Mountain Railway',
    nameTA:'நீலகிரி மலை ரயில்',
    from:'MTP', to:'UA',
    departure:'07:10', arrival:'12:00', duration:'4h 50m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['2S'],
    price:{ '2S':290 },
    totalSeats:{ '2S':120 },
    bookedSeats:{ '2S':40 },
    rating:4.9, type:'Passenger',
    amenities:[],
  },

  /* ── Chennai ↔ Puducherry ───────────────── */
  {
    id:'TN013', number:'16115', name:'Puducherry Express',
    nameTA:'புதுச்சேரி எக்ஸ்பிரஸ்',
    from:'MAS', to:'PY',
    departure:'10:40', arrival:'13:55', duration:'3h 15m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A','CC'],
    price:{ SL:125, '3A':310, '2A':430, CC:360 },
    totalSeats:{ SL:120, '3A':64, '2A':46, CC:280 },
    bookedSeats:{ SL:20, '3A':8, '2A':4, CC:60 },
    rating:4.0, type:'Express',
    amenities:['Charging'],
  },

  /* ── Madurai ↔ Coimbatore ───────────────── */
  {
    id:'TN014', number:'12238', name:'Madurai – CBE Intercity',
    nameTA:'மதுரை – கோவை இன்டர்சிட்டி',
    from:'MDU', to:'CBE',
    departure:'06:05', arrival:'11:45', duration:'5h 40m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','CC'],
    price:{ SL:190, '3A':360, CC:470 },
    totalSeats:{ SL:120, '3A':64, CC:280 },
    bookedSeats:{ SL:30, '3A':12, CC:80 },
    rating:3.9, type:'Express',
    amenities:['Charging'],
  },

  /* ── Coimbatore ↔ Chennai (reverse) ─────── */
  {
    id:'TN015', number:'12674', name:'Cheran SF Express (Return)',
    nameTA:'சேரன் திரும்ப ரயில்',
    from:'CBE', to:'MAS',
    departure:'21:30', arrival:'06:15', duration:'8h 45m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A','1A'],
    price:{ SL:340, '3A':640, '2A':935, '1A':1580 },
    totalSeats:{ SL:180, '3A':96, '2A':46, '1A':18 },
    bookedSeats:{ SL:90, '3A':40, '2A':18, '1A':6 },
    rating:4.5, type:'Superfast',
    amenities:['Pantry','Charging','Wifi','Blanket'],
  },

  /* ── Madurai ↔ Chennai (reverse) ─────────── */
  {
    id:'TN016', number:'12636', name:'Vaigai SF Express (Return)',
    nameTA:'வைகை திரும்ப ரயில்',
    from:'MDU', to:'MAS',
    departure:'05:40', arrival:'13:25', duration:'7h 45m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A'],
    price:{ SL:285, '3A':545, '2A':785 },
    totalSeats:{ SL:120, '3A':64, '2A':46 },
    bookedSeats:{ SL:50, '3A':22, '2A':12 },
    rating:4.2, type:'Superfast',
    amenities:['Pantry','Charging','Wifi'],
  },

  /* ── Chennai ↔ Erode ────────────────────── */
  {
    id:'TN017', number:'11082', name:'Podhigai Express',
    nameTA:'பொதிகை எக்ஸ்பிரஸ்',
    from:'MAS', to:'ED',
    departure:'19:45', arrival:'04:50', duration:'9h 05m',
    daysOfWeek:[0,1,2,3,4,5,6],
    classes:['SL','3A','2A'],
    price:{ SL:300, '3A':570, '2A':825 },
    totalSeats:{ SL:180, '3A':64, '2A':46 },
    bookedSeats:{ SL:60, '3A':22, '2A':9 },
    rating:3.8, type:'Express',
    amenities:['Charging'],
  },
];


/* ══════════════════════════════════════════
   3.  CONSTANTS
══════════════════════════════════════════ */
const DAYS_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MAX_SEATS    = 6;   // max seats per booking

const CLASS_NAMES = {
  'SL':'Sleeper (SL)', '3A':'AC 3 Tier (3A)',
  '2A':'AC 2 Tier (2A)', '1A':'First AC (1A)',
  'CC':'AC Chair Car (CC)', 'EC':'Executive Chair (EC)',
  '2S':'Second Sitting (2S)',
};

const CLASS_ICONS = {
  'SL':'🛏️','3A':'❄️','2A':'❄️❄️','1A':'👑',
  'CC':'💺','EC':'✨','2S':'🪑',
};

const TRAIN_TYPE_COLORS = {
  'Rajdhani' :'bg-blue-100 text-blue-700',
  'Shatabdi' :'bg-purple-100 text-purple-700',
  'Duronto'  :'bg-red-100 text-red-700',
  'Superfast':'bg-orange-100 text-orange-700',
  'Express'  :'bg-green-100 text-green-700',
  'Passenger':'bg-gray-100 text-gray-700',
};


/* ══════════════════════════════════════════
   4.  LOOKUP HELPERS
══════════════════════════════════════════ */

/** Resolve any city name / code string → station code */
function resolveCode(input) {
  if (!input) return null;
  const s = input.trim().toLowerCase();
  // direct code match
  if (STATIONS[s.toUpperCase()]) return s.toUpperCase();
  // alias map
  return CITY_ALIAS[s] || null;
}

function getStation(code) {
  return STATIONS[code] || { code, city: code, state: '' };
}

function getTrainById(id) {
  return TRAINS.find(t => t.id === id) || null;
}

/** Filter trains matching from→to (bidirectional lookup) */
function filterTrains(rawFrom, rawTo) {
  const from = resolveCode(rawFrom);
  const to   = resolveCode(rawTo);
  if (!from || !to) return [];
  return TRAINS.filter(t => t.from === from && t.to === to);
}

/** Seats remaining in a class */
function getAvailableCount(train, cls) {
  const total  = (train.totalSeats  || {})[cls] || 0;
  const booked = (train.bookedSeats || {})[cls] || 0;
  return Math.max(0, total - booked);
}

/** Availability badge HTML */
function availabilityBadge(avail) {
  if (avail <= 0)
    return `<span class="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40
                         text-red-600 dark:text-red-400 rounded-full font-semibold">WL</span>`;
  if (avail <= 10)
    return `<span class="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40
                         text-amber-700 dark:text-amber-300 rounded-full font-semibold">AVL ${avail}</span>`;
  return `<span class="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40
                       text-emerald-700 dark:text-emerald-300 rounded-full font-semibold">AVL ${avail}</span>`;
}

/** Format date string */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
}


/* ══════════════════════════════════════════
   5.  CURRENT BOOKING (sessionStorage)
══════════════════════════════════════════ */
const BOOKING_KEY = 'tn_current_booking';

function setCurrentBooking(data) {
  sessionStorage.setItem(BOOKING_KEY, JSON.stringify(data));
}

function getCurrentBooking() {
  try { return JSON.parse(sessionStorage.getItem(BOOKING_KEY)); }
  catch { return null; }
}

function clearCurrentBooking() {
  sessionStorage.removeItem(BOOKING_KEY);
}


/* ══════════════════════════════════════════
   6.  URL PARAM HELPERS
══════════════════════════════════════════ */
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || '';
}

function buildQuery(params) {
  return '?' + new URLSearchParams(params).toString();
}


/* ══════════════════════════════════════════
   7.  TOAST NOTIFICATION
══════════════════════════════════════════ */
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed top-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }
  const colors = {
    info   : 'bg-indigo-600 text-white',
    success: 'bg-emerald-600 text-white',
    error  : 'bg-red-600 text-white',
    warn   : 'bg-amber-500 text-white',
  };
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium
                     ${colors[type] || colors.info} transition-all duration-300`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}


/* ══════════════════════════════════════════
   8.  DARK MODE (shared)
══════════════════════════════════════════ */
(function initDark() {
  const saved = localStorage.getItem('tn_dark');
  if (saved === 'true') document.documentElement.classList.add('dark');

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('darkToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('tn_dark', document.documentElement.classList.contains('dark'));
    });
  });
})();
