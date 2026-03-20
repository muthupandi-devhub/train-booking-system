
    (function() {
      // ----- simple router (simulate pages) -----
      const path = window.location.pathname.split('/').pop() || 'index.html';
      const pages = {
        'index.html': 'homePage',
        'results.html': 'resultsPage',
        'pnr.html': 'pnrPage',
        'booking.html': 'bookingPage',
        'ticket.html': 'ticketPage',
        'history.html': 'historyPage'
      };
      document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
      let pageId = pages[path];
      if (pageId && document.getElementById(pageId)) {
        document.getElementById(pageId).style.display = 'block';
      } else {
        document.getElementById('homePage').style.display = 'block';
      }

      // ----- dark mode toggle -----
      const toggle = document.getElementById('darkToggle');
      if (toggle) {
        toggle.addEventListener('click', () => {
          document.body.classList.toggle('dark');
        });
      }

      // ----- slider manual controls -----
      const slidesContainer = document.querySelector('.slides');
      const slides = document.querySelectorAll('.slide');
      if (slidesContainer && slides.length) {
        let slideIndex = 0;
        const totalSlides = slides.length;
        const nextBtn = document.getElementById('slideNext');
        const prevBtn = document.getElementById('slidePrev');

        function showSlide(index) {
          slideIndex = (index + totalSlides) % totalSlides;
          slidesContainer.style.transform = `translateX(-${slideIndex * 25}%)`;
          slidesContainer.style.animation = 'none';
        }

        if (nextBtn) nextBtn.addEventListener('click', () => showSlide(slideIndex + 1));
        if (prevBtn) prevBtn.addEventListener('click', () => showSlide(slideIndex - 1));
      }

      // ----- search button redirect -----
      const searchBtn = document.getElementById('searchBtn');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          window.location.href = 'results.html';
        });
      }

      // ----- logo link stays on index -----
      const logo = document.getElementById('logo-link');
      if (logo) {
        logo.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'index.html';
        });
      }
    })();

      /* ── Dark mode toggle ── */
    document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('tn_dark') === 'true') {
        document.body.classList.add('dark');
    }

    const toggle = document.getElementById('darkToggle');

    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('tn_dark', document.body.classList.contains('dark'));
        });
    }
});
    


  /* ── Override booking.js populateJourneyInfo to use our HTML ── */
  window._origPopulateJourneyInfo = null;
  document.addEventListener('DOMContentLoaded', () => {
    const booking = typeof getCurrentBooking === 'function' ? getCurrentBooking() : null;
    if (!booking || !booking.train) return;

    const { train, cls, date } = booking;
    const fromSt = typeof getStation === 'function' ? getStation(train.from) : { city: train.from };
    const toSt   = typeof getStation === 'function' ? getStation(train.to)   : { city: train.to   };
    const avail  = typeof getAvailableCount === 'function' ? getAvailableCount(train, cls) : '—';
    const price  = train.price?.[cls] || 0;
    const clsName = (typeof CLASS_NAMES !== 'undefined' ? CLASS_NAMES[cls] : null) || cls;

    const el = document.getElementById('journeyCard');
    if (!el) return;

    el.innerHTML = `
      <!-- Rail decoration already in ::before -->
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px">

        <!-- Time / route strip -->
        <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:200px">
          <div style="text-align:center">
            <div class="j-time">${train.departure}</div>
            <div class="j-city">${fromSt.city}</div>
          </div>

          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div class="j-duration">${train.duration}</div>
            <div style="display:flex;align-items:center;gap:4px;width:100%">
              <div class="j-line"></div>
              <span style="font-size:18px">🚆</span>
              <div class="j-line"></div>
            </div>
          </div>

          <div style="text-align:center">
            <div class="j-time">${train.arrival}</div>
            <div class="j-city">${toSt.city}</div>
          </div>
        </div>

        <!-- Right meta -->
        <div style="text-align:right;flex-shrink:0">
          <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end;margin-bottom:4px">
            <span class="j-class-badge">${clsName}</span>
            <span class="j-avail ${avail <= 10 ? 'amber' : 'green'}">
              ${avail} avail
            </span>
          </div>
          <div class="j-price">₹${price} <span>/ seat</span></div>
          <div style="font-size:11px;color:rgba(255,255,255,.5);margin-top:2px">
            ${typeof formatDate === 'function' ? formatDate(date) : date}
          </div>
        </div>
      </div>

      <!-- Bottom meta row -->
      <div class="j-meta">
        <div class="j-name">🚆 ${train.name} &nbsp;·&nbsp; #${train.number}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${(train.amenities||[]).map(a => {
            const icons = { Pantry:'🍛', Charging:'🔌', Wifi:'📶', Blanket:'🛏', Meals:'🍱' };
            return `<span style="font-size:11px;background:rgba(255,255,255,.1);
                                 padding:2px 8px;border-radius:999px;color:rgba(255,255,255,.7)">
                      ${icons[a]||'•'} ${a}</span>`;
          }).join('')}
        </div>
      </div>`;
  });

  /* ── Override updateSeatSummary to fill fareBreak too ── */
  const _origUpdateSeatSummary = window.updateSeatSummary;
  window.updateSeatSummary = function() {
    if (typeof _origUpdateSeatSummary === 'function') _origUpdateSeatSummary();
    /* Extra: fill fare breakdown hint */
    const booking = typeof getCurrentBooking === 'function' ? getCurrentBooking() : null;
    const breakEl = document.getElementById('fareBreak');
    if (!breakEl || !booking) return;
    const price = booking.train?.price?.[booking.cls] || 0;
    const count = (typeof selectedSeats !== 'undefined' ? selectedSeats.length : 0);
    if (count > 0) {
      breakEl.textContent = `${count} × ₹${price}`;
    } else {
      breakEl.textContent = '';
    }
  };


   // Apply saved dark mode on page load

       document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('tn_dark') === 'true') {
        document.body.classList.add('dark');
    }

    const toggle = document.getElementById('darkToggle');

    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('tn_dark', document.body.classList.contains('dark'));
        });
    }
});
        
        
       const toggle = document.getElementById('darkToggle');
      if (toggle) {
        toggle.addEventListener('click', () => {
          document.body.classList.toggle('dark');
        });
      }
      

        const _origRender = renderTrainList;
    document.addEventListener('DOMContentLoaded', () => {
      // Short delay so skeleton shows briefly
      setTimeout(() => {
        initSearchPage();
        const countEl = document.getElementById('resultCount');
        const from = getParam('from'), to = getParam('to');
        const cls  = document.getElementById('filterClass')?.value || '';
        let trains = filterTrains(from, to);
        if (cls) trains = trains.filter(t => t.classes.includes(cls));
        if (countEl) countEl.textContent = `${trains.length} train(s) found`;
      }, 400);
    });

    // Update count on filter change
    ['filterClass','sortSelect'].forEach(id => {
      document.addEventListener('DOMContentLoaded', () => {
        document.getElementById(id)?.addEventListener('change', () => {
          const from = getParam('from'), to = getParam('to');
          const cls  = document.getElementById('filterClass')?.value || '';
          let trains = filterTrains(from, to);
          if (cls) trains = trains.filter(t => t.classes.includes(cls));
          const countEl = document.getElementById('resultCount');
          if (countEl) countEl.textContent = `${trains.length} train(s) found`;
        });
      });
    });

    