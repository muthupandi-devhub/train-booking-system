// BUTTONS //
var submit_button = document.getElementById("pay_but");
var cancel_button = document.getElementById("back_but");
var loader = document.getElementById("loader");

// COMMON //
var person_email = document.getElementById("person__email");
var person_phone = document.getElementById("person__phone");
var person_red_email = document.getElementById("person_red_email");
var person_red_phone = document.getElementById("person_red_phone");

// PASSENGER CONTAINERS //
var persons = [
  {
    container: document.getElementById("person_info_1"),
    name: document.getElementById("person_1_name"),
    age: document.getElementById("person_1_age"),
    gender: document.getElementById("person_1_gender"),
    red_name: document.getElementById("person_1_red_name"),
    red_age: document.getElementById("person_1_red_age"),
    red_gender: document.getElementById("person_1_red_gender"),
  },
  {
    container: document.getElementById("person_info_2"),
    name: document.getElementById("person_2_name"),
    age: document.getElementById("person_2_age"),
    gender: document.getElementById("person_2_gender"),
    red_name: document.getElementById("person_2_red_name"),
    red_age: document.getElementById("person_2_red_age"),
    red_gender: document.getElementById("person_2_red_gender"),
  },
  {
    container: document.getElementById("person_info_3"),
    name: document.getElementById("person_3_name"),
    age: document.getElementById("person_3_age"),
    gender: document.getElementById("person_3_gender"),
    red_name: document.getElementById("person_3_red_name"),
    red_age: document.getElementById("person_3_red_age"),
    red_gender: document.getElementById("person_3_red_gender"),
  },
  {
    container: document.getElementById("person_info_4"),
    name: document.getElementById("person_4_name"),
    age: document.getElementById("person_4_age"),
    gender: document.getElementById("person_4_gender"),
    red_name: document.getElementById("person_4_red_name"),
    red_age: document.getElementById("person_4_red_age"),
    red_gender: document.getElementById("person_4_red_gender"),
  },
  {
    container: document.getElementById("person_info_5"),
    name: document.getElementById("person_5_name"),
    age: document.getElementById("person_5_age"),
    gender: document.getElementById("person_5_gender"),
    red_name: document.getElementById("person_5_red_name"),
    red_age: document.getElementById("person_5_red_age"),
    red_gender: document.getElementById("person_5_red_gender"),
  },
  {
    container: document.getElementById("person_info_6"),
    name: document.getElementById("person_6_name"),
    age: document.getElementById("person_6_age"),
    gender: document.getElementById("person_6_gender"),
    red_name: document.getElementById("person_6_red_name"),
    red_age: document.getElementById("person_6_red_age"),
    red_gender: document.getElementById("person_6_red_gender"),
  },
];

// SUBMIT BUTTON //
if (submit_button) {
  submit_button.addEventListener("click", function (event) {
    event.preventDefault();

    let valid = true;

    //passanger//
    persons.forEach(function (p) {
      if (!p.container) return;

      // CHECK IF VISIBLE
      let display = window.getComputedStyle(p.container).display;

      if (display !== "none") {
        // NAME
        if (p.name.value.trim() === "") {
          p.red_name.style.color = "red";
          valid = false;
        } else {
          p.red_name.style.color = "";
        }

        // AGE
        if (p.age.value.trim() === "") {
          p.red_age.style.color = "red";
          valid = false;
        } else {
          p.red_age.style.color = "";
        }

        // GENDER
        if (p.gender.value === "") {
          p.red_gender.style.color = "red";
          valid = false;
        } else {
          p.red_gender.style.color = "";
        }
      }
    });

    // EMAIL
    if (person_email.value.trim() === "") {
      person_red_email.style.color = "red";
      valid = false;
    } else {
      person_red_email.style.color = "";
    }

    // PHONE
    if (person_phone.value.trim() === "") {
      person_red_phone.style.color = "red";
      valid = false;
    } else {
      person_red_phone.style.color = "";
    }

    // FINAL ACTION
    if (valid) {
      loader.classList.remove("hidden");

      setTimeout(function () {
        window.location.href = "payment.html";
      }, 1500);
    }
  });
}

// ─── CANCEL BUTTON ──────────────────────────────────────────────────────────
if (cancel_button) {
  cancel_button.addEventListener("click", function () {
    window.location.href = "index.html";
  });
}

// ─── DARK MODE ──────────────────────────────────────────────────────────────
var dark_btn = document.getElementById("darkToggle1");
var body1 = document.getElementById("body_1");
var body2 = document.getElementById("body_2");
var isDark = false;

if (dark_btn) {
  dark_btn.addEventListener("click", function () {
    isDark = !isDark;

    if (isDark) {
      if (body1) body1.style.backgroundImage = "url(image-b/ChatGPT Image Mar 19, 2026, 07_45_19 PM.png)";
      if (body2) body2.style.backgroundImage = "url(image-b/s2.jpg)";
      document.documentElement.classList.add("dark");
      dark_btn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      if (body1) body1.style.backgroundImage = "url(image-b/s2.png)";
      if (body2) body2.style.backgroundImage = "url(image-b/ChatGPT Image Mar 19, 2026, 07_45_19 PM.png)";
      document.documentElement.classList.remove("dark");
      dark_btn.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });
}

// ─── PAYMENT OPTIONS (payment.html only) ────────────────────────────────────
var credit_but = document.getElementById("credit_but");
var upi_but = document.getElementById("upi_but");
var net_banking_but = document.getElementById("net_banking_but");
var credit_card_section = document.getElementById("credit_card");
var upi_num = document.getElementById("upi_num");
var net_banking_section = document.getElementById("net_banking");
//credit_card
if (credit_but) {
  credit_but.addEventListener("click", function () {
    credit_card_section.style.display = "block";
    upi_num.style.display = "none";
    net_banking_section.style.display = "none";
  });
}
//upi_pin
if (upi_but) {
  upi_but.addEventListener("click", function () {
    credit_card_section.style.display = "none";
    upi_num.style.display = "flex";
    net_banking_section.style.display = "none";
  });
}
//net_banking
if (net_banking_but) {
  net_banking_but.addEventListener("click", function () {
    credit_card_section.style.display = "none";
    upi_num.style.display = "none";
    net_banking_section.style.display = "flex";
  });
}


var payButtons = document.querySelectorAll("button");

payButtons.forEach(function (btn) {
  if (btn.textContent.trim() === "PAY") {
    btn.addEventListener("click", function () {

      var allInputs = [];
      [credit_card_section, upi_num, net_banking_section].forEach(function (section) {
        if (section && section.style.display !== "none") {
          var inputs = section.querySelectorAll("input");
          inputs.forEach(function (input) {
            allInputs.push(input);
          });
        }
      });

      var valid = true;

      allInputs.forEach(function (input) {
        if (input.value.trim() === "") {
          input.style.border = "2px solid red";
          valid = false;
        } else {
          input.style.border = "";
        }
      });

      if (valid) {
        var payLoader = document.createElement("div");
        payLoader.style.cssText =
          "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:999;";
        payLoader.innerHTML =
          '<div style="width:60px;height:60px;border:4px solid #f97316;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>' +
          '<style>@keyframes spin{to{transform:rotate(360deg);}}</style>';
        document.body.appendChild(payLoader);

        setTimeout(function () {
          window.location.href = "ticket.html";
        }, 1800);
      }
    });
  }
});

//VERIFY OTP BUTTON 

var verifyOtpBtn = document.querySelector("#credit_card button");

if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", function () {
    var otpInput = document.querySelector('#credit_card input[placeholder="OTP"]');
    if (!otpInput || otpInput.value.trim() === "") {
      otpInput.style.borderBottom = "2px solid red";
      alert("Please enter the OTP first.");
    } else {
      otpInput.style.borderBottom = "";
      verifyOtpBtn.textContent = "✔ Verified";
      verifyOtpBtn.style.backgroundColor = "#22c55e";
      verifyOtpBtn.style.color = "white";
      verifyOtpBtn.disabled = true;
    }
  });
}





//final ticket page 

  // ── Generate random PNR ──────────────────────────────────────────────────
  var pnr = "TN" + Math.floor(1000000000 + Math.random() * 9000000000);
  var pnr_display = document.getElementById("pnr_display");
  if (pnr_display) pnr_display.textContent = pnr;
 


  // ── Dark mode 
  var dark_btn = document.getElementById("darkToggle1");
  var body2 = document.getElementById("body_2");
  var isDark = false;
 
  if (dark_btn) {
    dark_btn.addEventListener("click", function () {
      isDark = !isDark;
      if (isDark) {
        if (body2) body2.style.backgroundImage = "url(image-b/s1.jpg)";
        document.documentElement.classList.add("dark");
        dark_btn.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        if (body2) body2.style.backgroundImage = "url(image-b/s2.png)";
        document.documentElement.classList.remove("dark");
        dark_btn.innerHTML = '<i class="fas fa-moon"></i>';
      }
    });
  }
 
  // ── Download button ──────────────────────────────────────────────────────
  var download_but = document.getElementById("download_but");
  if (download_but) {
    download_but.addEventListener("click", function () {
      window.print();
    });
  }
 
  // ── Share button ─────────────────────────────────────────────────────────
  var share_but = document.getElementById("share_but");
  if (share_but) {
    share_but.addEventListener("click", function () {
      if (navigator.share) {
        navigator.share({
          title: "BookTrain e-Ticket",
          text: "My train ticket | PNR: " + pnr,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText("BookTrain e-Ticket | PNR: " + pnr + " | " + window.location.href);
        share_but.textContent = "✅ Link Copied!";
        setTimeout(function () {
          share_but.textContent = "📤 Share Ticket";
        }, 2000);
      }
    });
  }