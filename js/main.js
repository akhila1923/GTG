/**
 * GTG Perfumes - Main JavaScript
 * Interactive functionality for the perfume website
 */

// Initialize all components
function initializeAll() {
  initHamburgerMenu();
  initDropdownMenu();
  initSearchPopup();
  initImageGallery();
  initSubscriptionToggle();
  initDynamicCartUrl();
  initStatsCounter();
  initSmoothScroll();
  initCollectionAccordion();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeAll);

// Re-initialize on pageshow (handles back/forward navigation)
window.addEventListener('pageshow', function(event) {
  // If page was loaded from cache (back/forward), re-initialize
  if (event.persisted) {
    initializeAll();
  }
});

// ============================================
// 1. Hamburger Menu
// ============================================
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('overlay');
  const navClose = document.getElementById('nav-close');
  const body = document.body;
  
  function openMenu() {
    hamburger.classList.add('active');
    nav.classList.add('active');
    overlay.classList.add('active');
    body.classList.add('menu-open');
  }
  
  function closeMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('menu-open');
  }
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      if (nav.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  
  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }
  
  // Close menu on nav link click (except dropdown links)
  const navLinks = document.querySelectorAll('.header__nav-link');
  navLinks.forEach(link => {
    // Don't close menu if it's a dropdown link
    const isDropdownLink = link.closest('.header__nav-item--dropdown');
    if (!isDropdownLink) {
      link.addEventListener('click', closeMenu);
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ============================================
// 2. Dropdown Menu
// ============================================
function initDropdownMenu() {
  const dropdownItems = document.querySelectorAll('.header__nav-item--dropdown');
  
  if (dropdownItems.length === 0) return;
  
  dropdownItems.forEach(item => {
    const link = item.querySelector('.header__nav-link');
    const menu = item.querySelector('.header__dropdown-menu');
    
    if (!link || !menu) return;
    
    // Handle click on dropdown link (both mobile and desktop)
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = item.classList.contains('active');
      
      // Close all other dropdowns
      dropdownItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherMenu = otherItem.querySelector('.header__dropdown-menu');
          if (otherMenu) {
            otherMenu.classList.remove('active');
            otherItem.classList.remove('active');
          }
        }
      });
      
      // Toggle current dropdown
      if (isActive) {
        menu.classList.remove('active');
        item.classList.remove('active');
      } else {
        menu.classList.add('active');
        item.classList.add('active');
      }
    });
    
    // Handle clicks on dropdown menu items
    const dropdownLinks = menu.querySelectorAll('.header__dropdown-link');
    dropdownLinks.forEach(dropdownLink => {
      dropdownLink.addEventListener('click', function() {
        // Close mobile menu when a dropdown item is clicked
        const nav = document.getElementById('nav');
        if (nav && nav.classList.contains('active')) {
          const hamburger = document.getElementById('hamburger');
          const overlay = document.getElementById('overlay');
          const body = document.body;
          
          if (hamburger) hamburger.classList.remove('active');
          nav.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
          body.classList.remove('menu-open');
        }
        
        // Close the dropdown
        menu.classList.remove('active');
        item.classList.remove('active');
      });
    });
    
    // Prevent dropdown from closing when clicking inside the menu (but not on links)
    menu.addEventListener('click', function(e) {
      if (!e.target.closest('.header__dropdown-link')) {
        e.stopPropagation();
      }
    });
  });
  
  // Close dropdowns when clicking outside (works for both mobile and desktop)
  document.addEventListener('click', function(e) {
    dropdownItems.forEach(item => {
      if (!item.contains(e.target)) {
        const menu = item.querySelector('.header__dropdown-menu');
        if (menu) {
          menu.classList.remove('active');
          item.classList.remove('active');
        }
      }
    });
  });
  
  // Handle window resize - close all dropdowns
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      dropdownItems.forEach(item => {
        const menu = item.querySelector('.header__dropdown-menu');
        if (menu) {
          menu.classList.remove('active');
          item.classList.remove('active');
        }
      });
    }, 250);
  });
}

// ============================================
// 3. Search Popup
// ============================================
function initSearchPopup() {
  const searchButton = document.querySelector('.header__search');
  const searchPopup = document.getElementById('search-popup');
  const searchInput = document.querySelector('.header__search-input');
  
  if (!searchButton || !searchPopup) return;
  
  // Toggle search popup on button click
  searchButton.addEventListener('click', function(e) {
    e.stopPropagation();
    const isActive = searchPopup.classList.contains('active');
    
    if (isActive) {
      closeSearchPopup();
    } else {
      openSearchPopup();
    }
  });
  
  // Close popup when clicking outside (on the overlay/background)
  searchPopup.addEventListener('click', function(e) {
    // If clicking directly on the popup background (not the content), close it
    if (e.target === searchPopup) {
      closeSearchPopup();
    }
  });
  
  // Close popup when clicking outside the popup element
  document.addEventListener('click', function(e) {
    if (searchPopup.classList.contains('active')) {
      // Check if click is outside both the popup and the search button
      const clickedInsidePopup = searchPopup.contains(e.target);
      const clickedOnSearchButton = searchButton.contains(e.target);
      
      if (!clickedInsidePopup && !clickedOnSearchButton) {
        closeSearchPopup();
      }
    }
  });
  
  // Close popup on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchPopup.classList.contains('active')) {
      closeSearchPopup();
    }
  });
  
  // Prevent popup content from closing when clicking inside the content area
  const searchPopupContent = searchPopup.querySelector('.header__search-popup-content');
  if (searchPopupContent) {
    searchPopupContent.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  function openSearchPopup() {
    searchPopup.classList.add('active');
    searchButton.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on input after animation
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }
  
  function closeSearchPopup() {
    searchPopup.classList.remove('active');
    searchButton.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear input
    if (searchInput) {
      searchInput.value = '';
      searchInput.blur();
    }
  }
}

// ============================================
// 4. Image Gallery
// ============================================
function initImageGallery() {
  const mainImage = document.getElementById('main-product-image');
  const thumbnails = document.querySelectorAll('.product__thumbnail');
  const dots = document.querySelectorAll('.product__dot');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  
  if (!mainImage || thumbnails.length === 0) return;
  
  // Get image sources from thumbnails
  const images = Array.from(thumbnails).map(thumb => {
    const img = thumb.querySelector('img');
    return img ? img.src : '';
  }).filter(src => src !== '');
  
  if (images.length === 0) return;
  
  let currentIndex = 0;
  const totalImages = images.length;
  
  // Set initial main image
  if (images[0]) {
    mainImage.src = images[0];
  }
  
  function updateGallery(index) {
    // Handle wrapping
    if (index >= totalImages) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalImages - 1;
    } else {
      currentIndex = index;
    }
    
    // Update main image with fade effect
    mainImage.style.opacity = '0';
    mainImage.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      if (images[currentIndex]) {
        mainImage.src = images[currentIndex];
        mainImage.style.opacity = '1';
      }
    }, 150);
    
    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
      if (thumb) {
        thumb.classList.toggle('active', i === currentIndex);
      }
    });
    
    // Update active dot (4 dots for 8 images - each dot represents 2 images)
    if (dots.length > 0) {
      // Each dot represents a group of images (8 images / 4 dots = 2 images per dot)
      const imagesPerDot = Math.ceil(totalImages / dots.length);
      const dotIndex = Math.floor(currentIndex / imagesPerDot);
      dots.forEach((dot, i) => {
        if (dot) {
          dot.classList.toggle('active', i === dotIndex);
        }
      });
    }
  }
  
  // Thumbnail click handlers
  thumbnails.forEach((thumbnail, index) => {
    if (thumbnail) {
      thumbnail.addEventListener('click', function(e) {
        e.preventDefault();
        updateGallery(index);
      });
    }
  });
  
  // Dot click handlers
  dots.forEach((dot, index) => {
    if (dot) {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        // Calculate which image group this dot represents
        // Each dot represents 2 images (8 images / 4 dots = 2 images per dot)
        const imagesPerDot = Math.ceil(totalImages / dots.length);
        const imageIndex = index * imagesPerDot;
        updateGallery(imageIndex);
      });
    }
  });
  
  // Arrow navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      updateGallery(currentIndex - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      updateGallery(currentIndex + 1);
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    const galleryInView = isElementInViewport(mainImage);
    if (galleryInView) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateGallery(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateGallery(currentIndex + 1);
      }
    }
  });
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ============================================
// 5. Subscription Toggle
// ============================================
function initSubscriptionToggle() {
  const subscriptionInputs = document.querySelectorAll('input[name="subscription"]');
  const subscriptionOptions = document.querySelectorAll('.product__subscription-option');
  
  if (subscriptionInputs.length === 0) return;
  
  // Function to update collapsed class and content visibility based on checked state
  function updateCollapsedClass() {
    subscriptionOptions.forEach(option => {
      const label = option.querySelector('.product__subscription-label');
      const input = label ? label.querySelector('input[name="subscription"]') : null;
      const content = option.querySelector('.product__subscription-content');
      
      if (input && content) {
        if (input.checked) {
          // Checked: add collapsed class and show content
          option.classList.add('collapsed');
          content.style.visibility = 'visible';
          content.style.opacity = '1';
          content.style.height = 'auto';
        } else {
          // Unchecked: remove collapsed class and hide content
          option.classList.remove('collapsed');
          content.style.visibility = 'hidden';
          content.style.opacity = '0';
          content.style.height = '0';
        }
      }
    });
  }
  
  // Initialize on page load
  updateCollapsedClass();
  
  // Also run after a short delay to handle browser back/forward cache and ensure state
  setTimeout(function() {
    updateCollapsedClass();
  }, 50);
  
  // Run again after a longer delay to catch any late state restoration
  setTimeout(function() {
    updateCollapsedClass();
  }, 200);
  
  // Update on change
  subscriptionInputs.forEach(input => {
    input.addEventListener('change', function() {
      updateCollapsedClass();
      // Update cart URL when subscription changes
      updateCartUrl();
    });
  });
  
  // Handle all radio button changes for visual updates and cart URL
  const allRadioInputs = document.querySelectorAll('input[type="radio"]');
  allRadioInputs.forEach(input => {
    input.addEventListener('change', function() {
      // Update cart URL when any radio changes
      updateCartUrl();
    });
  });
}

// ============================================
// 6. Dynamic Cart URL
// ============================================
function initDynamicCartUrl() {
  const subscriptionInputs = document.querySelectorAll('input[name="subscription"]');
  const fragranceInputs = document.querySelectorAll('input[name="fragrance"]');
  const fragranceDouble1Inputs = document.querySelectorAll('input[name="fragrance-double1"]');
  const fragranceDouble2Inputs = document.querySelectorAll('input[name="fragrance-double2"]');
  
  // Add change listeners to all inputs
  const allInputs = [
    ...subscriptionInputs,
    ...fragranceInputs,
    ...fragranceDouble1Inputs,
    ...fragranceDouble2Inputs
  ];
  
  allInputs.forEach(input => {
    if (input) {
      input.addEventListener('change', updateCartUrl);
    }
  });
  
  // Initialize on load
  updateCartUrl();
}

function updateCartUrl() {
  const addToCartBtn = document.getElementById('add-to-cart');
  if (!addToCartBtn) return;
  
  // Get selected subscription (purchase type)
  const selectedSubscription = document.querySelector('input[name="subscription"]:checked');
  const subscriptionValue = selectedSubscription ? selectedSubscription.value : 'single';
  
  // Get selected fragrance based on subscription type
  let fragranceValue = 'original';
  
  if (subscriptionValue === 'single') {
    // Single subscription: use fragrance from single subscription
    const selectedFragrance = document.querySelector('input[name="fragrance"]:checked');
    fragranceValue = selectedFragrance ? selectedFragrance.value : 'original';
  } else if (subscriptionValue === 'double') {
    // Double subscription: use first fragrance selection (fragrance-double1)
    const selectedFragrance = document.querySelector('input[name="fragrance-double1"]:checked');
    fragranceValue = selectedFragrance ? selectedFragrance.value : 'original';
  }
  
  // Cart URL mapping - 9 variations (3 purchase types x 3 fragrances)
  // Currently supporting 2 purchase types, but structure allows for 3rd
  const cartUrls = {
    // Single subscription (3 fragrances)
    'single-original': 'https://example.com/cart/single-original',
    'single-lily': 'https://example.com/cart/single-lily',
    'single-rose': 'https://example.com/cart/single-rose',
    // Double subscription (3 fragrances)
    'double-original': 'https://example.com/cart/double-original',
    'double-lily': 'https://example.com/cart/double-lily',
    'double-rose': 'https://example.com/cart/double-rose',
    // Placeholder for potential 3rd purchase type (3 fragrances)
    'triple-original': 'https://example.com/cart/triple-original',
    'triple-lily': 'https://example.com/cart/triple-lily',
    'triple-rose': 'https://example.com/cart/triple-rose'
  };
  
  // Create the key for URL lookup
  const urlKey = `${subscriptionValue}-${fragranceValue}`;
  
  // Update the href
  const newUrl = cartUrls[urlKey] || cartUrls['single-original'];
  addToCartBtn.href = newUrl;
  
  // Log for debugging (can be removed in production)
  console.log(`Cart URL updated: ${urlKey} -> ${newUrl}`);
}

// ============================================
// 7. Stats Counter Animation
// ============================================
function initStatsCounter() {
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stats__number[data-target]');
  
  if (!statsSection || statNumbers.length === 0) return;
  
  let hasAnimated = false;
  
  function animateCounter(element, target, duration = 2000) {
    // Fallback for browsers without performance.now()
    const startTime = (window.performance && window.performance.now) ? window.performance.now() : Date.now();
    const startValue = 0;
    
    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.round(startValue + (target - startValue) * easedProgress);
      
      element.textContent = currentValue + '%';
      
      if (progress < 1) {
        // Fallback for browsers without requestAnimationFrame
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(updateCounter);
        } else {
          setTimeout(function() {
            const currentTime = (window.performance && window.performance.now) ? window.performance.now() : Date.now();
            updateCounter(currentTime);
          }, 16);
        }
      }
    }
    
    // Fallback for browsers without requestAnimationFrame
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(updateCounter);
    } else {
      setTimeout(function() {
        const currentTime = (window.performance && window.performance.now) ? window.performance.now() : Date.now();
        updateCounter(currentTime);
      }, 16);
    }
  }
  
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        
        statNumbers.forEach(statNumber => {
          const target = parseInt(statNumber.dataset.target);
          if (!isNaN(target)) {
            animateCounter(statNumber, target);
          }
        });
      }
    });
  }
  
  // Create Intersection Observer with fallback
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(statsSection);
  } else {
    // Fallback for browsers without IntersectionObserver support
    // Animate immediately on page load
    statNumbers.forEach(statNumber => {
      const target = parseInt(statNumber.dataset.target);
      if (!isNaN(target)) {
        animateCounter(statNumber, target);
      }
    });
  }
}

// ============================================
// 8. Smooth Scroll for Anchor Links
// ============================================
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header').offsetHeight || 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// 9. Collection Accordion
// ============================================
function initCollectionAccordion() {
  const accordionItems = document.querySelectorAll('.collection__accordion-item');
  
  if (accordionItems.length === 0) return;
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.collection__accordion-header');
    
    if (header) {
      header.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        // Close all items
        accordionItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.collection__accordion-header');
          if (otherHeader) {
            otherHeader.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

// ============================================
// 8. Header Scroll Effect
// ============================================
(function() {
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
})();

// ============================================
// Utility: Add CSS keyframes for animations
// ============================================
(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
})();
