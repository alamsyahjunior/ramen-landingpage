/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import L from 'leaflet';

// Branch locations data

const BRANCHES = [
  {
    id: 'jkt-senopati',
    name: 'Joffi Ramen - Senopati',
    city: 'Jakarta Selatan',
    address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190',
    hours: '11:00 - 23:00 WIB',
    phone: '(021) 5296-1888',
    lat: -6.2307,
    lng: 106.8083,
    popularMenu: 'Ramen MALA & Truffle Shoyu',
  },
  {
    id: 'bdg-riau',
    name: 'Joffi Ramen - Riau Bandung',
    city: 'Bandung',
    address: 'Jl. L. L. R.E. Martadinata No. 85, Cihapit, Bandung 40114',
    hours: '10:30 - 22:30 WIB',
    phone: '(022) 420-7799',
    lat: -6.9085,
    lng: 107.6186,
    popularMenu: 'Tonkotsu Classic & Karaage',
  },
  {
    id: 'cjr-pusat',
    name: 'Joffi Ramen - Cianjur Heritage',
    city: 'Cianjur',
    address: 'Jl. Ir. H. Juanda No. 18, Pamoyanan, Cianjur 43211',
    hours: '11:00 - 22:00 WIB',
    phone: '(0263) 228-941',
    lat: -6.8219,
    lng: 107.1396,
    popularMenu: 'Tori Paitan & Gyoza Set',
  },
  {
    id: 'sby-barat',
    name: 'Joffi Ramen - Graha Famili',
    city: 'Surabaya',
    address: 'Ruko Plaza Graha Famili Blok D-05, Pradahkalikendal, Surabaya 60226',
    hours: '11:00 - 23:00 WIB',
    phone: '(031) 732-5501',
    lat: -7.2917,
    lng: 112.6841,
    popularMenu: 'Spicy Volcano Miso & Chashu Don',
  },
  {
    id: 'bali-canggu',
    name: 'Joffi Ramen - Canggu Coastal',
    city: 'Bali',
    address: 'Jl. Pantai Batu Bolong No. 68B, Canggu, Kuta Utara, Badung, Bali 80361',
    hours: '12:00 - 24:00 WITA',
    phone: '(0361) 906-8812',
    lat: -8.6539,
    lng: 115.1328,
    popularMenu: 'Kyoto Tori Ramen & Cold Sapporo',
  },
];

// Scroll animations with Intersection Observer

function initScrollAnimations() {
  const sections = document.querySelectorAll('#hero-section, #about-section, #menu, #locations');
  
  // Store the initial transform class for all animated elements
  document.querySelectorAll('.animate-on-view').forEach((el) => {
    if (el.classList.contains('translate-y-6')) {
      el.setAttribute('data-initial-transform', 'translate-y-6');
    } else if (el.classList.contains('translate-y-24')) {
      el.setAttribute('data-initial-transform', 'translate-y-24');
    } else if (el.classList.contains('scale-95')) {
      el.setAttribute('data-initial-transform', 'scale-95');
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '100px 0px 100px 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      const animatedElements = section.querySelectorAll('.animate-on-view');
      
      if (entry.isIntersecting) {
        animatedElements.forEach((el) => {
          el.classList.remove('opacity-0', 'translate-y-6', 'translate-y-24', 'scale-95');
          el.classList.add('opacity-100', 'translate-y-0', 'scale-100');
        });
      } else {
        animatedElements.forEach((el) => {
          el.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
          el.classList.add('opacity-0');
          const initialTransform = el.getAttribute('data-initial-transform');
          if (initialTransform) {
            el.classList.add(initialTransform);
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Play/pause background video based on Active Navbar Section
function initHeroVideoControl() {
  window.setHeroVideoPlaying = function (isPlaying) {
    const video = document.querySelector('video');
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };
}

// Smooth scroll helper

function smoothSlideTo(target, offset = 0) {
  let targetY = 0;

  if (typeof target === 'number') {
    targetY = target;
  } else if (typeof target === 'string') {
    const el = document.getElementById(target.replace(/^#/, ''));
    if (!el) return;
    targetY = el.getBoundingClientRect().top + window.scrollY - offset;
  } else if (target instanceof HTMLElement) {
    targetY = target.getBoundingClientRect().top + window.scrollY - offset;
  }

  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  targetY = Math.max(0, Math.min(targetY, maxScroll));

  window.scrollTo({
    top: targetY,
    behavior: 'smooth',
  });
}

// Navigation and mobile menu handlers

function initNavbar() {
  const header = document.querySelector('header');
  const logo = document.querySelector('#brand-logo img');
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenuContainer = document.getElementById('mobile-menu-container');

  const navItems = [
    { name: 'Home', targetId: 'hero-section' },
    { name: 'About', targetId: 'about-section' },
    { name: 'Menu', targetId: 'menu' },
    { name: 'Locations', targetId: 'locations' },
    { name: 'Contact', targetId: 'footer-section' },
  ];

  let activeSection = 'hero-section';
  let isScrollingProgrammatically = false;
  let scrollTimeout = null;
  let lastScrollY = window.scrollY;

  // Function to update active link styling
  function updateActiveLink(targetId) {
    activeSection = targetId;
    navItems.forEach((item) => {
      const desktopBtn = document.getElementById(`nav-link-${item.name.toLowerCase()}`);
      const mobileBtn = document.getElementById(`mobile-nav-link-${item.name.toLowerCase()}`);

      const isActive = item.targetId === targetId;

      if (desktopBtn) {
        if (isActive) {
          desktopBtn.className = 'relative px-2.5 md:px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-[11px] md:text-xs lg:text-[13px] font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer whitespace-nowrap text-white bg-[#DE9547] shadow-[0_2px_12px_rgba(222,149,71,0.45)]';
        } else {
          desktopBtn.className = 'relative px-2.5 md:px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-[11px] md:text-xs lg:text-[13px] font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer whitespace-nowrap text-[#D8D8D8] hover:text-white hover:bg-white/10';
        }
      }

      if (mobileBtn) {
        if (isActive) {
          mobileBtn.className = 'flex items-center justify-between w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer bg-[#DE9547] text-white shadow-[0_2px_12px_rgba(222,149,71,0.4)]';
          let pulseDot = mobileBtn.querySelector('.animate-pulse');
          if (!pulseDot) {
            pulseDot = document.createElement('span');
            pulseDot.className = 'w-1.5 h-1.5 rounded-full bg-white animate-pulse';
            mobileBtn.appendChild(pulseDot);
          }
        } else {
          mobileBtn.className = 'flex items-center justify-between w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-[#D8D8D8] hover:bg-white/10 active:bg-white/15 hover:text-white';
          const pulseDot = mobileBtn.querySelector('.animate-pulse');
          if (pulseDot) pulseDot.remove();
        }
      }
    });

    // Control background video based on active section
    if (typeof window.setHeroVideoPlaying === 'function') {
      window.setHeroVideoPlaying(targetId === 'hero-section');
    }
  }

  // Handle Scroll Depth & Navbar Appearance
  function handleScroll() {
    const scrollY = window.scrollY;

    // Transition navbar background
    const isScrolled = scrollY > 30;
    if (header) {
      if (isScrolled) {
        header.className = 'fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-2 sm:py-2.5 bg-black/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)]';
      } else {
        header.className = 'fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-2.5 sm:py-4 bg-transparent shadow-none';
      }
    }

    if (logo) {
      if (isScrolled) {
        logo.className = 'w-auto object-contain hover:opacity-90 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] h-7.5 xs:h-8 md:h-9';
      } else {
        logo.className = 'w-auto object-contain hover:opacity-90 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] h-8 xs:h-8.5 md:h-10 lg:h-11';
      }
    }

    // Auto close mobile menu on scroll
    if (Math.abs(scrollY - lastScrollY) > 20) {
      closeMobileMenu();
      lastScrollY = scrollY;
    }

    if (isScrollingProgrammatically) return;

    // Active Section Highlights
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollY + windowHeight >= documentHeight - 120) {
      updateActiveLink('footer-section');
      return;
    }

    const navbarOffset = window.innerWidth < 640 ? 55 : 80;
    for (let i = navItems.length - 1; i >= 0; i--) {
      const item = navItems[i];
      if (item.targetId === 'hero-section') continue;
      const el = document.getElementById(item.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= navbarOffset + 30) {
          updateActiveLink(item.targetId);
          return;
        }
      }
    }
    updateActiveLink('hero-section');
  }

  // Smooth scroll handler
  function navigateToSection(targetId) {
    updateActiveLink(targetId);
    isScrollingProgrammatically = true;
    if (scrollTimeout) clearTimeout(scrollTimeout);

    if (targetId === 'hero-section') {
      smoothSlideTo(0, 0);
    } else {
      let navbarOffset = 70;
      if (targetId === 'menu') {
        navbarOffset = 85;
      } else if (targetId === 'locations') {
        navbarOffset = 25;
      } else if (targetId === 'footer-section') {
        navbarOffset = 40;
      }
      smoothSlideTo(targetId, navbarOffset);
    }

    scrollTimeout = setTimeout(() => {
      isScrollingProgrammatically = false;
    }, 850);
  }

  // Mobile Menu state toggle
  let isMobileOpen = false;

  function toggleMobileMenu() {
    isMobileOpen = !isMobileOpen;
    if (isMobileOpen) {
      mobileToggleBtn.className = 'md:hidden flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 cursor-pointer select-none active:scale-95 bg-[#DE9547] border-[#DE9547] text-white shadow-[0_2px_12px_rgba(222,149,71,0.45)]';
      mobileToggleBtn.innerHTML = `<svg class="w-4 h-4 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      
      mobileMenuContainer.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none', 'scale-98');
      mobileMenuContainer.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto', 'scale-100');
    } else {
      closeMobileMenu();
    }
  }

  function closeMobileMenu() {
    if (!isMobileOpen) return;
    isMobileOpen = false;
    
    const isScrolled = window.scrollY > 30;
    if (isScrolled) {
      mobileToggleBtn.className = 'md:hidden flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 cursor-pointer select-none active:scale-95 bg-neutral-900/80 border-white/20 text-white hover:bg-neutral-800';
    } else {
      mobileToggleBtn.className = 'md:hidden flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 cursor-pointer select-none active:scale-95 bg-black/60 border-white/15 text-white hover:bg-black/80';
    }
    mobileToggleBtn.innerHTML = `<svg class="w-4 h-4 text-[#DE9547] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    
    mobileMenuContainer.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none', 'scale-98');
    mobileMenuContainer.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto', 'scale-100');
  }

  // Click outside listener for mobile menu
  document.addEventListener('click', (e) => {
    if (!isMobileOpen) return;
    const target = e.target;
    if (!target.closest('#mobile-menu-container') && !target.closest('#mobile-menu-toggle')) {
      closeMobileMenu();
    }
  });

  document.addEventListener('touchstart', (e) => {
    if (!isMobileOpen) return;
    const target = e.target;
    if (!target.closest('#mobile-menu-container') && !target.closest('#mobile-menu-toggle')) {
      closeMobileMenu();
    }
  }, { passive: true });

  // Attach navbar triggers
  window.addEventListener('scroll', handleScroll, { passive: true });
  mobileToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Attach scroll triggers to buttons
  navItems.forEach((item) => {
    const desktopBtn = document.getElementById(`nav-link-${item.name.toLowerCase()}`);
    if (desktopBtn) {
      desktopBtn.addEventListener('click', () => navigateToSection(item.targetId));
    }

    const mobileBtn = document.getElementById(`mobile-nav-link-${item.name.toLowerCase()}`);
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        closeMobileMenu();
        navigateToSection(item.targetId);
      });
    }
  });

  const logoBtn = document.getElementById('brand-logo');
  if (logoBtn) {
    logoBtn.addEventListener('click', () => navigateToSection('hero-section'));
  }

  const orderNowBtn = document.getElementById('nav-order-button');
  if (orderNowBtn) {
    orderNowBtn.addEventListener('click', () => navigateToSection('locations'));
  }

  // CTAs in page
  const heroCta = document.getElementById('hero-cta-menu');
  if (heroCta) {
    heroCta.addEventListener('click', () => navigateToSection('menu'));
  }

  const aboutCta = document.getElementById('about-cta-explore-menu');
  if (aboutCta) {
    aboutCta.addEventListener('click', () => navigateToSection('menu'));
  }

  // Initial call
  handleScroll();
}

// Menu carousel and category tabs handler

function initMenuCarousel() {
  const tabs = ['RAMEN', 'SIDES', 'RICE'];
  let activeTab = 'RAMEN';

  const prevBtn = document.getElementById('menu-prev-button');
  const nextBtn = document.getElementById('menu-next-button');

  function updateCarouselArrowsState(container) {
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Dynamically show or hide the slider arrows based on actual content overflow/scrollability
    const isScrollable = scrollWidth > clientWidth;
    if (isScrollable) {
      if (prevBtn) prevBtn.classList.remove('hidden');
      if (nextBtn) nextBtn.classList.remove('hidden');
    } else {
      if (prevBtn) prevBtn.classList.add('hidden');
      if (nextBtn) nextBtn.classList.add('hidden');
    }

    const canScrollLeft = scrollLeft > 4;
    const canScrollRight = scrollLeft + clientWidth < scrollWidth - 4;

    if (prevBtn) {
      if (canScrollLeft) {
        prevBtn.classList.remove('opacity-25', 'pointer-events-none');
        prevBtn.classList.add('opacity-90', 'hover:opacity-100', 'hover:scale-105');
      } else {
        prevBtn.classList.add('opacity-25', 'pointer-events-none');
        prevBtn.classList.remove('opacity-90', 'hover:opacity-100', 'hover:scale-105');
      }
    }

    if (nextBtn) {
      if (canScrollRight) {
        nextBtn.classList.remove('opacity-25', 'pointer-events-none');
        nextBtn.classList.add('opacity-90', 'hover:opacity-100', 'hover:scale-105');
      } else {
        nextBtn.classList.add('opacity-25', 'pointer-events-none');
        nextBtn.classList.remove('opacity-90', 'hover:opacity-100', 'hover:scale-105');
      }
    }
  }

  function handleSwitchTab(tabName) {
    activeTab = tabName;

    // Update active state on tab buttons
    tabs.forEach((t) => {
      const btn = document.getElementById(`menu-btn-${t.toLowerCase()}`);
      const carousel = document.getElementById(`menu-carousel-${t.toLowerCase()}`);
      const isSelected = t === tabName;

      if (btn) {
        if (isSelected) {
          btn.className = 'px-3.5 xs:px-5 sm:px-10 py-1.5 sm:py-3.5 rounded-full text-[10px] xs:text-xs sm:text-sm tracking-[0.14em] sm:tracking-[0.2em] font-bold uppercase transition-all duration-300 cursor-pointer bg-[#DE9547] text-[#1A1A1A] shadow-[0_4px_20px_rgba(222,149,71,0.4)] scale-[1.03]';
        } else {
          btn.className = 'px-3.5 xs:px-5 sm:px-10 py-1.5 sm:py-3.5 rounded-full text-[10px] xs:text-xs sm:text-sm tracking-[0.14em] sm:tracking-[0.2em] font-bold uppercase transition-all duration-300 cursor-pointer bg-[#6E1214]/80 hover:bg-[#6E1214] text-[#F8EDDA]/85 hover:text-[#F8EDDA] border border-[#F8EDDA]/20 hover:border-[#DE9547]/50';
        }
      }

      if (carousel) {
        if (isSelected) {
          carousel.classList.remove('hidden');
          carousel.classList.add('flex');
          // Reset scroll
          carousel.scrollLeft = 0;
          updateCarouselArrowsState(carousel);
        } else {
          carousel.classList.add('hidden');
          carousel.classList.remove('flex');
        }
      }
    });
  }

  function scrollCarousel(direction) {
    const activeCarousel = document.getElementById(`menu-carousel-${activeTab.toLowerCase()}`);
    if (!activeCarousel) return;

    const firstCard = activeCarousel.firstElementChild;
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const style = window.getComputedStyle(activeCarousel);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    const step = cardWidth + gap;

    const currentScroll = activeCarousel.scrollLeft;
    const targetScroll = direction === 'left' ? currentScroll - step : currentScroll + step;

    activeCarousel.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }

  // Attach event listeners
  tabs.forEach((t) => {
    const btn = document.getElementById(`menu-btn-${t.toLowerCase()}`);
    if (btn) {
      btn.addEventListener('click', () => handleSwitchTab(t));
    }

    const carousel = document.getElementById(`menu-carousel-${t.toLowerCase()}`);
    if (carousel) {
      carousel.addEventListener('scroll', () => updateCarouselArrowsState(carousel), { passive: true });
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollCarousel('left'));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollCarousel('right'));
  }

  window.addEventListener('resize', () => {
    const activeCarousel = document.getElementById(`menu-carousel-${activeTab.toLowerCase()}`);
    if (activeCarousel) updateCarouselArrowsState(activeCarousel);
  });

  // Initial active category update
  handleSwitchTab('RAMEN');
}

// Leaflet-powered store locator map

function initStoreLocator() {
  const mapContainer = document.getElementById('leaflet-map-container');
  if (!mapContainer) return;

  let selectedBranchId = 'jkt-senopati';
  let mapReady = false;
  let mapInstance = null;
  const markers = {};
  let lastFlownBranchId = '';

  const searchInput = document.getElementById('branch-search-input');
  const clearSearchBtn = searchInput ? searchInput.nextElementSibling : null;

  // Custom icon generation matching Leaflet badge markers
  function createCustomIcon(isActive) {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="marker-badge ${isActive ? 'active' : 'inactive'}">
          <span>🍜</span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }

  // Dynamic visual style updater directly on marker elements
  function updateMarkerStyles(activeId) {
    Object.entries(markers).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const badge = el.querySelector('.marker-badge');
      if (badge) {
        if (id === activeId) {
          badge.classList.add('active');
          badge.classList.remove('inactive');
        } else {
          badge.classList.remove('active');
          badge.classList.add('inactive');
        }
      }
    });
  }

  // Fly mapping to coordinate and trigger popup
  function flyToBranch(branchId) {
    if (!mapInstance || !mapReady) return;
    if (branchId === lastFlownBranchId) return;

    const branch = BRANCHES.find((b) => b.id === branchId);
    if (!branch) return;

    try {
      lastFlownBranchId = branch.id;

      // Smoothly update marker CSS classes
      updateMarkerStyles(branch.id);

      // Stop previous map flies
      mapInstance.stop();

      // Fly with smooth ease
      mapInstance.flyTo([branch.lat, branch.lng], 15, {
        duration: 1.2,
        easeLinearity: 0.25,
      });

      // Open Popup
      const marker = markers[branch.id];
      if (marker) {
        marker.openPopup();
      }
    } catch (err) {
      console.error('[LocationSection] Error during map flyTo:', err);
    }
  }

  // Filter sidebar branches based on query and render
  function filterAndRenderSidebar(query) {
    const q = query.toLowerCase().trim();
    let hasMatches = false;

    BRANCHES.forEach((branch) => {
      const card = document.getElementById(`branch-card-${branch.id}`);
      if (!card) return;

      const isMatch = !q ||
        branch.name.toLowerCase().includes(q) ||
        branch.city.toLowerCase().includes(q) ||
        branch.address.toLowerCase().includes(q);

      if (isMatch) {
        card.classList.remove('hidden');
        hasMatches = true;
      } else {
        card.classList.add('hidden');
      }
    });

    const noResults = document.querySelector('.md\\:flex.flex-col > .border-dashed');
    if (!hasMatches) {
      if (noResults) noResults.classList.remove('hidden');
    } else {
      if (noResults) noResults.classList.add('hidden');
    }

    // Auto focus first match on search queries
    if (q) {
      const firstMatch = BRANCHES.find((branch) => {
        return branch.name.toLowerCase().includes(q) ||
          branch.city.toLowerCase().includes(q) ||
          branch.address.toLowerCase().includes(q);
      });
      if (firstMatch && firstMatch.id !== selectedBranchId) {
        setSelectedBranch(firstMatch.id);
      }
    }
  }

  // Update visual card highlight in the sidebar
  function setSelectedBranch(branchId) {
    selectedBranchId = branchId;

    BRANCHES.forEach((branch) => {
      const card = document.getElementById(`branch-card-${branch.id}`);
      if (!card) return;

      const isSelected = branch.id === branchId;
      const h3 = card.querySelector('h3');
      const iconSpan = card.querySelector('.branch-card-icon');

      if (isSelected) {
        card.className = 'branch-card px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all duration-300 w-full bg-[#1e1414] border-[#DE9547] shadow-[0_4px_16px_rgba(222,149,71,0.2)] translate-x-0.5';
        if (h3) {
          h3.classList.remove('text-[#F8EDDA]');
          h3.classList.add('text-[#DE9547]');
        }
        if (iconSpan) {
          iconSpan.classList.remove('bg-neutral-800', 'text-[#DE9547]');
          iconSpan.classList.add('bg-[#DE9547]', 'text-black');
        }
      } else {
        card.className = 'branch-card px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all duration-300 w-full bg-[#161616] hover:bg-[#1a1a1a] border-neutral-800/80 hover:border-neutral-700';
        if (h3) {
          h3.classList.add('text-[#F8EDDA]');
          h3.classList.remove('text-[#DE9547]');
        }
        if (iconSpan) {
          iconSpan.classList.add('bg-neutral-800', 'text-[#DE9547]');
          iconSpan.classList.remove('bg-[#DE9547]', 'text-black');
        }
      }
    });

    flyToBranch(branchId);
  }

  // Initialize Map
  const initialBranch = BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];
  const defaultLat = initialBranch ? initialBranch.lat : -6.8219;
  const defaultLng = initialBranch ? initialBranch.lng : 107.1396;
  const defaultZoom = initialBranch ? 15 : 7;

  const map = L.map(mapContainer, {
    center: [defaultLat, defaultLng],
    zoom: defaultZoom,
    zoomControl: true,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add Markers for all branches
  BRANCHES.forEach((branch) => {
    const marker = L.marker([branch.lat, branch.lng], {
      icon: createCustomIcon(branch.id === selectedBranchId),
    }).addTo(map);

    const popupContent = `
      <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 2px 0;">
        <div style="padding-right: 14px; margin-bottom: 4px;">
          <h4 style="font-weight: 800; font-size: 12.5px; margin: 0; color: #DE9547; letter-spacing: -0.01em; line-height: 1.25;">
            ${branch.name}
          </h4>
        </div>
        <p style="font-size: 11px; margin: 0 0 6px 0; color: #a1a1aa; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${branch.address}
        </p>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 10px; color: #e4e4e7; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 5px;">
          <span style="color: #a1a1aa;">🕒 ${branch.hours}</span>
          <span style="color: #DE9547; font-weight: 700; white-space: nowrap;">⭐ ${branch.popularMenu}</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 240,
      minWidth: 160,
      offset: [0, -14],
      autoPanPadding: [15, 15],
      closeButton: true,
    });

    marker.on('click', () => {
      setSelectedBranch(branch.id);
    });

    markers[branch.id] = marker;
  });

  mapInstance = map;

  map.whenReady(() => {
    mapReady = true;
    lastFlownBranchId = selectedBranchId;
    setTimeout(() => {
      const marker = markers[selectedBranchId];
      if (marker && mapInstance) {
        marker.openPopup();
      }
    }, 350);
  });

  // Re-fit maps on container resize
  setTimeout(() => {
    if (mapInstance) mapInstance.invalidateSize();
  }, 250);

  window.addEventListener('resize', () => {
    if (mapInstance) mapInstance.invalidateSize();
  });

  // Attach search input listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      filterAndRenderSidebar(val);
      if (clearSearchBtn) {
        if (val) clearSearchBtn.classList.remove('hidden');
        else clearSearchBtn.classList.add('hidden');
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        filterAndRenderSidebar('');
      }
      clearSearchBtn.classList.add('hidden');
    });
  }

  // Attach card selection triggers
  BRANCHES.forEach((branch) => {
    const card = document.getElementById(`branch-card-${branch.id}`);
    if (card) {
      card.addEventListener('click', () => {
        setSelectedBranch(branch.id);
      });
    }
  });

  // Initial highlight
  setSelectedBranch('jkt-senopati');
}

// Application entry point

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeroVideoControl();
  initNavbar();
  initMenuCarousel();
  initStoreLocator();
});
