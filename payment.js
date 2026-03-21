// 

function _saveToBooking(data) {
  try {
    var b = JSON.parse(sessionStorage.getItem('tn_current_booking')) || {};
    for (var k in data) b[k] = data[k];
    sessionStorage.setItem('tn_current_booking', JSON.stringify(b));
  } catch (e) {}
}



  // BOOKING PAGE — elements
var submit_button    = document.getElementById('pay_but');
var cancel_button    = document.getElementById('back_but');
var loader           = document.getElementById('loader');
var person_email     = document.getElementById('person__email');
var person_phone     = document.getElementById('person__phone');
var person_red_email = document.getElementById('person_red_email');
var person_red_phone = document.getElementById('person_red_phone');

var persons = [
  { n:1, c:document.getElementById('person_info_1'),
    name:document.getElementById('person_1_name'), age:document.getElementById('person_1_age'),
    gender:document.getElementById('person_1_gender'), rn:document.getElementById('person_1_red_name'),
    ra:document.getElementById('person_1_red_age'),    rg:document.getElementById('person_1_red_gender') },
  { n:2, c:document.getElementById('person_info_2'),
    name:document.getElementById('person_2_name'), age:document.getElementById('person_2_age'),
    gender:document.getElementById('person_2_gender'), rn:document.getElementById('person_2_red_name'),
    ra:document.getElementById('person_2_red_age'),    rg:document.getElementById('person_2_red_gender') },
  { n:3, c:document.getElementById('person_info_3'),
    name:document.getElementById('person_3_name'), age:document.getElementById('person_3_age'),
    gender:document.getElementById('person_3_gender'), rn:document.getElementById('person_3_red_name'),
    ra:document.getElementById('person_3_red_age'),    rg:document.getElementById('person_3_red_gender') },
  { n:4, c:document.getElementById('person_info_4'),
    name:document.getElementById('person_4_name'), age:document.getElementById('person_4_age'),
    gender:document.getElementById('person_4_gender'), rn:document.getElementById('person_4_red_name'),
    ra:document.getElementById('person_4_red_age'),    rg:document.getElementById('person_4_red_gender') },
  { n:5, c:document.getElementById('person_info_5'),
    name:document.getElementById('person_5_name'), age:document.getElementById('person_5_age'),
    gender:document.getElementById('person_5_gender'), rn:document.getElementById('person_5_red_name'),
    ra:document.getElementById('person_5_red_age'),    rg:document.getElementById('person_5_red_gender') },
  { n:6, c:document.getElementById('person_info_6'),
    name:document.getElementById('person_6_name'), age:document.getElementById('person_6_age'),
    gender:document.getElementById('person_6_gender'), rn:document.getElementById('person_6_red_name'),
    ra:document.getElementById('person_6_red_age'),    rg:document.getElementById('person_6_red_gender') }
];



  // SUBMIT (booking.html → payment.html)

if (submit_button) {
  submit_button.addEventListener('click', function (e) {
    e.preventDefault();
    var valid      = true;
    var passengers = [];

    persons.forEach(function (p) {
      if (!p.c) return;
      if (window.getComputedStyle(p.c).display === 'none') return; /* skip hidden */

      var nameVal   = p.name   ? p.name.value.trim()   : '';
      var ageVal    = p.age    ? p.age.value.trim()     : '';
      var genderVal = p.gender ? p.gender.value         : '';

      if (!nameVal)                             { if (p.rn) p.rn.style.color = 'red'; valid = false; }
      else                                      { if (p.rn) p.rn.style.color = ''; }
      if (!ageVal)                              { if (p.ra) p.ra.style.color = 'red'; valid = false; }
      else                                      { if (p.ra) p.ra.style.color = ''; }
      if (!genderVal || genderVal === '')       { if (p.rg) p.rg.style.color = 'red'; valid = false; }
      else                                      { if (p.rg) p.rg.style.color = ''; }

      passengers.push({ name: nameVal, age: ageVal, gender: genderVal });
    });

    if (person_email && !person_email.value.trim()) {
      if (person_red_email) person_red_email.style.color = 'red'; valid = false;
    } else if (person_red_email) person_red_email.style.color = '';

    if (person_phone && !person_phone.value.trim()) {
      if (person_red_phone) person_red_phone.style.color = 'red'; valid = false;
    } else if (person_red_phone) person_red_phone.style.color = '';

    if (!valid) return;

 //Save passenger + contact data
    _saveToBooking({
      passengers: passengers,
      email : person_email ? person_email.value.trim() : '',
      phone : person_phone ? person_phone.value.trim() : ''
    });

    if (loader) loader.classList.remove('hidden');
    setTimeout(function () { window.location.href = 'payment.html'; }, 1500);
  });
}

  //Back button — go back in history 
if (cancel_button) {
  cancel_button.addEventListener('click', function () { window.history.back(); });
}



  // PAYMENT OPTIONS  (payment.html)

var credit_but          = document.getElementById('credit_but');
var upi_but             = document.getElementById('upi_but');
var net_banking_but     = document.getElementById('net_banking_but');
var credit_card_section = document.getElementById('credit_card');
var upi_num_section     = document.getElementById('upi_num');
var net_banking_section = document.getElementById('net_banking');

function _hidePaySections() {
  if (credit_card_section)  credit_card_section.style.display  = 'none';
  if (upi_num_section)      upi_num_section.style.display      = 'none';
  if (net_banking_section)  net_banking_section.style.display  = 'none';
}

if (credit_but)      credit_but.addEventListener('click',      function () { _hidePaySections(); if (credit_card_section)  credit_card_section.style.display  = 'block'; });
if (upi_but)         upi_but.addEventListener('click',         function () { _hidePaySections(); if (upi_num_section)      upi_num_section.style.display      = 'flex';  });
if (net_banking_but) net_banking_but.addEventListener('click', function () { _hidePaySections(); if (net_banking_section)  net_banking_section.style.display  = 'flex';  });



 //  PAY BUTTONS  (payment.html)
document.querySelectorAll('button').forEach(function (btn) {
  if (btn.textContent.trim() !== 'PAY') return;

  btn.addEventListener('click', function () {
    var section = null;
    [credit_card_section, upi_num_section, net_banking_section].forEach(function (s) {
      if (s && s.style.display !== 'none') section = s;
    });

    if (!section) {
      alert('Please choose a payment method first.');
      return;
    }

    var inputs = section.querySelectorAll('input');
    var valid  = true;
    inputs.forEach(function (inp) {
      if (!inp.value.trim()) { inp.style.border = '2px solid red'; valid = false; }
      else                   { inp.style.border = ''; }
    });
    if (!valid) return;

  // Full-screen spinner 
    var overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,.5);'
      + 'display:flex;align-items:center;justify-content:center;z-index:9999;';
    overlay.innerHTML =
      '<div style="width:60px;height:60px;border:4px solid #f97316;'
      + 'border-top-color:transparent;border-radius:50%;animation:_pspin .8s linear infinite;"></div>'
      + '<style>@keyframes _pspin{to{transform:rotate(360deg);}}</style>';
    document.body.appendChild(overlay);

    setTimeout(function () { window.location.href = 'ticket.html'; }, 1800);
  });
});

//   VERIFY OTP  (credit card panel)
var verifyBtn = document.querySelector('#credit_card button');
if (verifyBtn) {
  verifyBtn.addEventListener('click', function () {
    var otpInp = document.querySelector('#credit_card input[placeholder="OTP"]');
    if (!otpInp || !otpInp.value.trim()) {
      if (otpInp) otpInp.style.borderBottom = '2px solid red';
      alert('Please enter the OTP first.');
    } else {
      if (otpInp) otpInp.style.borderBottom = '';
      verifyBtn.textContent           = '✔ Verified';
      verifyBtn.style.backgroundColor = '#22c55e';
      verifyBtn.style.color           = 'white';
      verifyBtn.disabled              = true;
    }
  });
}


/* ══════════════════════════════════════════
   TICKET PAGE  (ticket.html)
   Download + Share + Dark mode toggle
══════════════════════════════════════════ */
var downloadBtn = document.getElementById('download_but');
if (downloadBtn) downloadBtn.addEventListener('click', function () { window.print(); });

var shareBtn = document.getElementById('share_but');
if (shareBtn) {
  shareBtn.addEventListener('click', function () {
    var pnrEl = document.getElementById('pnr_display');
    var pnr   = pnrEl ? pnrEl.textContent : 'N/A';
    if (navigator.share) {
      navigator.share({ title:'BookTrain e-Ticket', text:'My ticket | PNR: ' + pnr, url: window.location.href });
    } else {
      navigator.clipboard.writeText('BookTrain e-Ticket | PNR: ' + pnr + ' | ' + window.location.href);
      shareBtn.textContent = '✅ Link Copied!';
      setTimeout(function () { shareBtn.textContent = '📤 Share Ticket'; }, 2000);
    }
  });
}