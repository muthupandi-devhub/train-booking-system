
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
