/**
 * AeroVista Tour & Travel — Master Interactive Engine
 * Responsive UI, Hero Carousel, Filters & Motion Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initHeroCarousel();
  initSearchWidget();
  initPackageFilters();
  initDayAccordion();
  initItineraryCalculator();
  initScrollAnimations();
});

/* 1. Header Scroll Shadow */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. Mobile Navigation Drawer */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close drawer on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* 3. Hero Carousel */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;
  const intervalTime = 5000;

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentIndex = index;

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(nextSlide, intervalTime);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  const card = document.querySelector('.hero-slider-card');
  if (card) {
    card.addEventListener('mouseenter', stopAutoPlay);
    card.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* 4. Search Widget Filter Interaction */
function initSearchWidget() {
  const tabBtns = document.querySelectorAll('.search-tab-btn');
  const searchForm = document.querySelector('#quickSearchForm');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-type');
      const selectCategory = document.querySelector('#searchCategory');
      if (selectCategory && category) {
        selectCategory.value = category;
      }
    });
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.querySelector('#searchDest')?.value || '';
      const cat = document.querySelector('#searchCategory')?.value || '';
      // Redirect to catalog with hash or query
      window.location.href = `paket.html?dest=${encodeURIComponent(dest)}&cat=${encodeURIComponent(cat)}`;
    });
  }
}

/* 5. Package Catalog Filters (in paket.html) */
function initPackageFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const packageCards = document.querySelectorAll('.package-filter-item');
  if (!filterBtns.length || !packageCards.length) return;

  // Check URL params for pre-selected category
  const urlParams = new URLSearchParams(window.location.search);
  const requestedCat = urlParams.get('cat');

  if (requestedCat) {
    const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === requestedCat);
    if (targetBtn) {
      filterBtns.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');
      applyFilter(requestedCat);
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      applyFilter(filter);
    });
  });

  function applyFilter(filter) {
    packageCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter || (filter === 'domestik' && category.includes('domestik')) || (filter === 'internasional' && category.includes('internasional'))) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

/* 6. Day-by-Day Accordion (in Itinerary pages) */
function initDayAccordion() {
  const dayCards = document.querySelectorAll('.day-card');
  if (!dayCards.length) return;

  dayCards.forEach(card => {
    const header = card.querySelector('.day-header');
    if (!header) return;

    header.addEventListener('click', () => {
      // Toggle current card
      const isActive = card.classList.contains('active');
      card.classList.toggle('active', !isActive);
    });
  });
}

/* 7. Itinerary Price & WhatsApp Calculator */
function initItineraryCalculator() {
  const paxSelect = document.querySelector('#bookingPax');
  const dateInput = document.querySelector('#bookingDate');
  const priceDisplay = document.querySelector('#calculatedTotalPrice');
  const waDirectBtn = document.querySelector('#itineraryWaBtn');
  const basePriceEl = document.querySelector('#basePriceValue');

  if (!paxSelect || !priceDisplay || !basePriceEl) return;

  const basePrice = parseInt(basePriceEl.getAttribute('data-price') || '0', 10);
  const tourName = document.querySelector('.itinerary-title')?.textContent.trim() || 'Paket Wisata';

  function updatePriceAndLink() {
    const pax = parseInt(paxSelect.value, 10) || 1;
    const total = basePrice * pax;
    priceDisplay.textContent = 'Rp ' + total.toLocaleString('id-ID');

    if (waDirectBtn) {
      const travelDate = dateInput?.value || 'Segera didiskusikan';
      const text = `Halo AeroVista Travel, saya tertarik booking *${tourName}*:\n` +
                   `• Jumlah Peserta: ${pax} Orang\n` +
                   `• Estimasi Tanggal: ${travelDate}\n` +
                   `• Total Perkiraan: Rp ${total.toLocaleString('id-ID')}\n\n` +
                   `Mohon info ketersediaan seat & jadwal detailnya. Terima kasih!`;
      
      const waNumber = '6281234567890';
      waDirectBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    }
  }

  paxSelect.addEventListener('change', updatePriceAndLink);
  if (dateInput) dateInput.addEventListener('change', updatePriceAndLink);
  updatePriceAndLink();
}

/* 8. IntersectionObserver Scroll Animations */
function initScrollAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Stagger reveal for cards
  const revealElements = document.querySelectorAll('.reveal-init');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // Draw-in-underline for section headers
  const underlines = document.querySelectorAll('.draw-in-underline');
  if (underlines.length && 'IntersectionObserver' in window) {
    const lineObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    underlines.forEach(el => lineObserver.observe(el));
  }
}
