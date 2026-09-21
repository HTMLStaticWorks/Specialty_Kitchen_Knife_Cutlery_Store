/**
 * STEEL & GRAIN - Specialty Kitchen Cutlery
 * Main Interactive Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initRTLSystem();
  initStickyHeader();
  initMobileNavigation();
  highlightActiveNavLinks();
  initProductFiltering();
  initProductGallery();
  initLightbox();
  initAccordions();
  initEnquiryForm();
  initBackToTop();
  initAnimations();
});

/* ==========================================================================
   1. THEME SYSTEM (LIGHT / DARK)
   ========================================================================== */
function initThemeSystem() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('sg_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('sg_theme', newTheme);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun';
          btn.setAttribute('aria-label', 'Switch to Light Theme');
        } else {
          icon.className = 'bi bi-moon-stars';
          btn.setAttribute('aria-label', 'Switch to Dark Theme');
        }
      }
    });
  }
}

/* ==========================================================================
   1B. RTL DIRECTION SYSTEM
   ========================================================================== */
function initRTLSystem() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('sg_dir');

  // Set initial direction from storage or default ltr
  const initialDir = storedDir === 'rtl' ? 'rtl' : 'ltr';
  applyDirection(initialDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('sg_dir', newDir);
    });
  });

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    rtlToggleBtns.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
      if (dir === 'rtl') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   2. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isActive = drawer.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isActive ? 'bi bi-x-lg' : 'bi bi-list';
    }
    document.body.style.overflow = isActive ? 'hidden' : '';
    document.documentElement.style.overflow = isActive ? 'hidden' : '';
  });

  // Mobile sub-dropdown accordions
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSubnav = toggle.nextElementSibling;
      const icon = toggle.querySelector('.bi-chevron-down');
      
      if (targetSubnav && targetSubnav.classList.contains('mobile-subnav')) {
        const isShown = targetSubnav.classList.toggle('show');
        if (icon) {
          icon.style.transform = isShown ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    });
  });

  // Close drawer on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-list';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  });
}

/* ==========================================================================
   3B. ACTIVE NAVIGATION HIGHLIGHTING
   ========================================================================== */
function highlightActiveNavLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Desktop Navigation Links
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link-custom, .desktop-nav .dropdown-link');
  desktopLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const page = href.split('?')[0].split('#')[0];

    if (page === currentPath || (currentPath === '' && page === 'index.html')) {
      link.classList.add('active');
      const parentNavItem = link.closest('.nav-item');
      if (parentNavItem) {
        const topNavLink = parentNavItem.querySelector('.nav-link-custom');
        if (topNavLink) topNavLink.classList.add('active');
      }
    }
  });

  // Mobile Drawer Navigation Links
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-subnav-link');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const page = href.split('?')[0].split('#')[0];

    let isMatch = (page === currentPath) || (currentPath === '' && page === 'index.html');
    if (currentPath === 'product-details.html' && page === 'products.html') isMatch = true;
    if (currentPath === 'collection-details.html' && page === 'collections.html') isMatch = true;
    if (currentPath === 'care-details.html' && page === 'care-guide.html') isMatch = true;

    if (isMatch) {
      link.classList.add('active');
      if (link.classList.contains('mobile-subnav-link')) {
        const parentSubnav = link.closest('.mobile-subnav');
        if (parentSubnav) {
          parentSubnav.classList.add('show');
          const toggleLink = parentSubnav.previousElementSibling;
          if (toggleLink && toggleLink.classList.contains('mobile-nav-link')) {
            toggleLink.classList.add('active');
            const icon = toggleLink.querySelector('.bi-chevron-down');
            if (icon) icon.style.transform = 'rotate(180deg)';
          }
        }
      }
    }
  });
}

/* ==========================================================================
   4. PRODUCT FILTERING & SORTING (products.html)
   ========================================================================== */
function initProductFiltering() {
  const productCards = document.querySelectorAll('.product-item-col');
  const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
  const sortSelect = document.getElementById('productSortSelect');
  const resultsCount = document.getElementById('resultsCount');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const gridContainer = document.getElementById('productsGridContainer');

  if (!productCards.length || !gridContainer) return;

  function applyFilters() {
    // Collect active filters
    const selectedTypes = Array.from(document.querySelectorAll('.filter-type:checked')).map(cb => cb.value);
    const selectedSteels = Array.from(document.querySelectorAll('.filter-steel:checked')).map(cb => cb.value);
    const selectedHandles = Array.from(document.querySelectorAll('.filter-handle:checked')).map(cb => cb.value);
    const selectedPrice = document.querySelector('input[name="price-range"]:checked')?.value || 'all';

    let visibleCount = 0;

    productCards.forEach(card => {
      const type = card.getAttribute('data-type') || '';
      const steel = card.getAttribute('data-steel') || '';
      const handle = card.getAttribute('data-handle') || '';
      const price = parseFloat(card.getAttribute('data-price') || '0');

      let matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
      let matchesSteel = selectedSteels.length === 0 || selectedSteels.includes(steel);
      let matchesHandle = selectedHandles.length === 0 || selectedHandles.includes(handle);
      let matchesPrice = true;

      if (selectedPrice === 'under-150') matchesPrice = price < 150;
      else if (selectedPrice === '150-250') matchesPrice = price >= 150 && price <= 250;
      else if (selectedPrice === '250-400') matchesPrice = price > 250 && price <= 400;
      else if (selectedPrice === 'over-400') matchesPrice = price > 400;

      if (matchesType && matchesSteel && matchesHandle && matchesPrice) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} of ${productCards.length} knives`;
    }

    applySorting();
  }

  function applySorting() {
    if (!sortSelect) return;
    const sortVal = sortSelect.value;
    const cardsArray = Array.from(productCards);

    cardsArray.sort((a, b) => {
      const priceA = parseFloat(a.getAttribute('data-price') || '0');
      const priceB = parseFloat(b.getAttribute('data-price') || '0');
      const dateA = parseInt(a.getAttribute('data-date') || '0');
      const dateB = parseInt(b.getAttribute('data-date') || '0');

      if (sortVal === 'price-low') return priceA - priceB;
      if (sortVal === 'price-high') return priceB - priceA;
      if (sortVal === 'newest') return dateB - dateA;
      return 0; // featured
    });

    cardsArray.forEach(card => gridContainer.appendChild(card));
  }

  filterCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  if (sortSelect) sortSelect.addEventListener('change', applySorting);
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      filterCheckboxes.forEach(cb => cb.checked = false);
      const defaultPrice = document.querySelector('input[name="price-range"][value="all"]');
      if (defaultPrice) defaultPrice.checked = true;
      applyFilters();
    });
  }

  // URL query param filter support (e.g., ?type=chef)
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  if (typeParam) {
    const targetCheckbox = document.querySelector(`.filter-type[value="${typeParam}"]`);
    if (targetCheckbox) {
      targetCheckbox.checked = true;
      applyFilters();
    }
  }
}

/* ==========================================================================
   5. PRODUCT GALLERY & THUMBNAIL SWITCHER (product-details.html)
   ========================================================================== */
function initProductGallery() {
  const mainImg = document.getElementById('mainGalleryImg');
  const thumbs = document.querySelectorAll('.gallery-thumb');

  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const fullSrc = thumb.getAttribute('data-full');
      if (fullSrc) {
        mainImg.style.opacity = '0.4';
        setTimeout(() => {
          mainImg.src = fullSrc;
          mainImg.style.opacity = '1';
        }, 150);
      }
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

/* ==========================================================================
   6. IMAGE LIGHTBOX MODAL
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('lightboxClose');
  const zoomTriggers = document.querySelectorAll('[data-lightbox-trigger]');

  if (!lightbox || !lightboxImg) return;

  zoomTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-lightbox-src') || (trigger.tagName === 'IMG' ? trigger.src : '');
      if (src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   7. ACCORDIONS (FAQ & Care Questions)
   ========================================================================== */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header-custom');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isExpanded = header.classList.contains('active');

      // Close siblings if in standard accordion
      const parent = header.closest('.accordion-custom');
      if (parent) {
        parent.querySelectorAll('.accordion-header-custom').forEach(h => {
          h.classList.remove('active');
          if (h.nextElementSibling) h.nextElementSibling.classList.remove('show');
        });
      }

      if (!isExpanded && body) {
        header.classList.add('active');
        body.classList.add('show');
      }
    });
  });
}

/* ==========================================================================
   8. CONTACT & ENQUIRY FORM VALIDATION
   ========================================================================== */
function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  const toast = document.getElementById('enquiryToast');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const fields = [
      { id: 'enquiryName', req: true },
      { id: 'enquiryEmail', req: true, email: true },
      { id: 'enquiryType', req: true },
      { id: 'enquirySubject', req: true },
      { id: 'enquiryMessage', req: true }
    ];

    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el) return;
      el.classList.remove('is-invalid');

      if (f.req && !el.value.trim()) {
        el.classList.add('is-invalid');
        isValid = false;
      } else if (f.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(el.value.trim())) {
          el.classList.add('is-invalid');
          isValid = false;
        }
      }
    });

    if (isValid) {
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 6000);
      }
      form.reset();
    }
  });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   10. GSAP ANIMATIONS & ENTRANCE REVEALS
   ========================================================================== */
function initAnimations() {
  if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero elements stagger
  const heroElements = document.querySelectorAll('.hero-fade');
  if (heroElements.length) {
    gsap.fromTo(heroElements, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
    );
  }

  // Scroll triggers on section headers and cards
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.scroll-reveal').forEach(elem => {
      gsap.fromTo(elem,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  } else {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
}
