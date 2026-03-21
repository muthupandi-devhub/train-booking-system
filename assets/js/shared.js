
//  Session helpers
function getBooking() {
  try { return JSON.parse(sessionStorage.getItem('tn_current_booking')) || null; }
  catch (e) { return null; }
}

function updateBooking(extra) {
  try {
    var b = getBooking() || {};
    for (var k in extra) b[k] = extra[k];
    sessionStorage.setItem('tn_current_booking', JSON.stringify(b));
  } catch (e) {}
}

var _ST = {
  MAS:'Chennai Central', MSB:'Chennai Beach', MDU:'Madurai',
  CBE:'Coimbatore', TPJ:'Trichy', SA:'Salem', ED:'Erode',
  TEN:'Tirunelveli', NCJ:'Nagercoil', KPD:'Katpadi (Vellore)',
  MTP:'Mettupalayam', UA:'Udhagamandalam (Ooty)', PY:'Puducherry', TUT:'Thoothukudi'
};
function _city(code) { return _ST[code] || code || '—'; }

function _fmtDate(ds) {
  if (!ds) return '';
  try {
    return new Date(ds + 'T00:00:00').toLocaleDateString('en-IN',
      { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  } catch(e) { return ds; }
}

function _set(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}



//   BOOKING PAGE

function _initBookingPage() {
  var b = getBooking();
  if (!b || !b.train) return;

  var train = b.train;
  var cls   = b.cls   || 'SL';
  var seats = b.seats || [];
  var coach = b.coach || 'S1';
  var count = seats.length > 0 ? seats.length : 1;
  var price = (train.price && train.price[cls]) ? train.price[cls] : 0;
  var base  = price * count;
  var gst   = Math.round(base * 0.05);
  var total = base + gst;


  for (var i = 1; i <= 6; i++) {
    var form = document.getElementById('person_info_' + i);
    if (form) form.style.display = (i <= count) ? 'block' : 'none';
  }

  for (var j = 0; j < count; j++) {
    var formEl  = document.getElementById('person_info_' + (j + 1));
    if (!formEl) continue;
    var infoH4s = formEl.querySelectorAll('.info_container h4');
    if (infoH4s[1]) {
      infoH4s[1].textContent = 'Seat ' + (seats[j] || '—') + ' | ' + cls;
    }

    if (infoH4s[0]) {
      infoH4s[0].textContent = 'Passenger ' + (j + 1) + ' of ' + count;
    }
  }

  _set('td_train_name',  train.name + '  (#' + train.number + ')');
  _set('td_route',       _city(train.from) + '  →  ' + _city(train.to));
  _set('td_to',          _city(train.to));
  _set('td_class',       cls);
  _set('td_seats_info',  coach + ' / ' + (seats.length ? seats.join(', ') : count + ' seat(s)'));
  _set('td_price',       '₹' + price);
  _set('td_passengers',  count);
  _set('td_gst',         '₹' + gst);
  _set('td_total',       '₹' + total.toLocaleString('en-IN'));

  _set('td_date', _fmtDate(b.date));

  updateBooking({ passengerCount: count, totalFare: total });
}



 //  PAYMENT PAGE

function _initPaymentPage() {
  var b = getBooking();
  if (!b || !b.train) return;

  var train = b.train;
  var cls   = b.cls   || 'SL';
  var seats = b.seats || [];
  var coach = b.coach || 'S1';
  var count = b.passengerCount || seats.length || 1;
  var price = (train.price && train.price[cls]) ? train.price[cls] : 0;
  var base  = price * count;
  var gst   = Math.round(base * 0.05);
  var total = b.totalFare || (base + gst);

  var nameEl = document.getElementById('pay_train_name');
  if (nameEl) nameEl.textContent = '🚆  ' + train.name + '  (#' + train.number + ')';

  var routeEl = document.getElementById('pay_route');
  if (routeEl) routeEl.textContent = _city(train.from) + '  →  ' + _city(train.to);

  var passEl = document.getElementById('pay_passengers');
  if (passEl) {
    passEl.innerHTML =
      'Passengers: <strong>' + count + '</strong>'
      + ' &nbsp;|&nbsp; Class: <strong>' + cls + '</strong>'
      + ' &nbsp;|&nbsp; Seats: <strong>'
      + (seats.length ? coach + ' / ' + seats.join(', ') : count + ' seat(s)') + '</strong>';
  }

  var taxEl = document.getElementById('pay_tax_note');
  if (taxEl) taxEl.textContent = count + ' × ₹' + price + '  +  GST ₹' + gst;

  var totalEl = document.getElementById('pay_total');
  if (totalEl) totalEl.textContent = '₹ ' + total.toLocaleString('en-IN');

  _set('pay_date', _fmtDate(b.date));

  updateBooking({ totalFare: total });
}



//   TICKET PAGE

function _initTicketPage() {
  var b = getBooking();
  if (!b || !b.train) return;

  var train      = b.train;
  var cls        = b.cls        || 'SL';
  var seats      = b.seats      || [];
  var coach      = b.coach      || 'S1';
  var count      = b.passengerCount || seats.length || 1;
  var price      = (train.price && train.price[cls]) ? train.price[cls] : 0;
  var base       = price * count;
  var gst        = Math.round(base * 0.05);
  var total      = b.totalFare || (base + gst);
  var passengers = b.passengers || [];

  // PNR — generate once, persist
  var pnr = b.pnr;
  if (!pnr) {
    pnr = 'TN' + Math.floor(1000000000 + Math.random() * 9000000000);
    updateBooking({ pnr: pnr });
  }

  // Static fields
  _set('pnr_display',    pnr);
  _set('tkt_train_name', '🚆  ' + train.name + '  (#' + train.number + ')');
  _set('tkt_from',       _city(train.from));
  _set('tkt_to',         _city(train.to));
  _set('tkt_dep_time',   train.departure);
  _set('tkt_arr_time',   train.arrival);
  _set('tkt_date',       _fmtDate(b.date));
  _set('tkt_class',      cls);
  _set('tkt_seats',      coach + ' / ' + (seats.join(', ') || count + ' seat(s)'));
  _set('tkt_total',      '₹ ' + total.toLocaleString('en-IN'));

  // Passenger table
  var tbody = document.getElementById('passenger_table_body');
  if (!tbody) return;

  var rows = '';
  for (var i = 0; i < count; i++) {
    var p = passengers[i] || {};
    rows +=
      '<tr>'
      + '<td class="py-1 px-2 border border-blue-100">' + (i + 1)                  + '</td>'
      + '<td class="py-1 px-2 border border-blue-100">' + (p.name   || 'Passenger ' + (i+1)) + '</td>'
      + '<td class="py-1 px-2 border border-blue-100">' + (p.age    || '—')        + '</td>'
      + '<td class="py-1 px-2 border border-blue-100">' + (p.gender || '—')        + '</td>'
      + '<td class="py-1 px-2 border border-blue-100">' + coach + '/' + (seats[i] || '—') + '</td>'
      + '</tr>';
  }
  tbody.innerHTML = rows;
}

document.addEventListener('DOMContentLoaded', function () {
  var page = window.location.pathname.split('/').pop() || '';
  if (page === 'booking.html') _initBookingPage();
  if (page === 'payment.html') _initPaymentPage();
  if (page === 'ticket.html')  _initTicketPage();
});