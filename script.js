/**
 * STACKLY - Brand Strategy & Creative Studio
 * Interactive behaviors, 3D tilt, testimonial carousel, and scroll animations
 */

// ── PRELOADER ──────────────────────────────────────────────────────────────
(function() {
  const preloader = document.getElementById('stackly-preloader');
  if (!preloader) return;

  document.body.classList.add('preloader-active');

  const countVal = document.getElementById('preloaderCountVal');
  const ringProgress = document.getElementById('preloaderRingProgress');
  const lineFill = document.getElementById('preloaderLineFill');

  const circumference = 452.39; // 2 * PI * 72
  let currentVal = 0;
  let targetVal = 100;
  let isDone = false;
  const startTime = performance.now();
  const totalDuration = 1200; // Snappy & sleek 1.2s

  function updateDisplay(val) {
    const clamped = Math.min(100, Math.max(0, val));
    const rounded = Math.floor(clamped);
    if (countVal) {
      countVal.textContent = rounded < 10 ? '0' + rounded : rounded;
    }
    if (ringProgress) {
      const offset = circumference - (clamped / 100) * circumference;
      ringProgress.style.strokeDashoffset = offset;
    }
    if (lineFill) {
      lineFill.style.width = clamped + '%';
    }
  }

  function frame(now) {
    if (isDone) return;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / totalDuration);
    // Smooth cubic ease out
    const ease = 1 - Math.pow(1 - progress, 3);
    currentVal = ease * targetVal;
    updateDisplay(currentVal);

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      finishPreloader();
    }
  }

  requestAnimationFrame(frame);

  function finishPreloader() {
    if (isDone) return;
    isDone = true;
    updateDisplay(100);

    setTimeout(() => {
      preloader.classList.add('preloader-done');
      setTimeout(() => {
        document.body.classList.remove('preloader-active');
      }, 300);
    }, 180);
  }

  // Accelerate on window load if still running
  window.addEventListener('load', () => {
    const elapsed = performance.now() - startTime;
    if (elapsed > 600) {
      finishPreloader();
    }
  });

  // Safety fallback
  setTimeout(finishPreloader, 2600);
})();
// ──────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-drawer-link, .mobile-drawer .btn');

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close button (×) inside the drawer
    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeMobileDrawer);
    }

    // Close when any nav link or action button is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileDrawer);
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });

    // Close when clicking the dark backdrop area outside the content
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeMobileDrawer();
      }
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.fade-up-element');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px 40px 0px'
    });

    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    revealElements.forEach(el => el.classList.add('in-view'));
  }

  // 4. Interactive 3D Perspective Tilt on Hero Layer Stack
  const heroWrapper = document.querySelector('.hero-visual-wrapper');
  const heroContainer = document.querySelector('.hero-layers-container');

  if (heroWrapper && heroContainer) {
    heroWrapper.addEventListener('mousemove', (e) => {
      const rect = heroWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      const rotateX = 12 - (deltaY * 10);
      const rotateY = -14 + (deltaX * 12);
      
      heroContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(3deg)`;
    });

    heroWrapper.addEventListener('mouseleave', () => {
      heroContainer.style.transform = `rotateX(12deg) rotateY(-14deg) rotateZ(3deg)`;
    });
  }

  // 5. Testimonial Stack Switcher (3-Card Carousel)
  const testCards = document.querySelectorAll('.test-card');
  const prevBtn = document.querySelector('.test-btn-prev');
  const nextBtn = document.querySelector('.test-btn-next');
  const testDots = document.querySelectorAll('.test-dot');
  let currentCardIndex = 0;
  const totalCards = testCards.length;

  function updateTestimonialStack(index) {
    currentCardIndex = (index + totalCards) % totalCards;

    testCards.forEach((card, i) => {
      card.classList.remove('card-active', 'card-prev', 'card-next', 'card-hidden');

      if (i === currentCardIndex) {
        card.classList.add('card-active');
      } else if (i === (currentCardIndex - 1 + totalCards) % totalCards) {
        card.classList.add('card-prev');
      } else if (i === (currentCardIndex + 1) % totalCards) {
        card.classList.add('card-next');
      } else {
        card.classList.add('card-hidden');
      }
    });

    testDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentCardIndex);
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => updateTestimonialStack(currentCardIndex - 1));
    nextBtn.addEventListener('click', () => updateTestimonialStack(currentCardIndex + 1));
  }

  testDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      updateTestimonialStack(idx);
    });
  });

  testCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (index !== currentCardIndex) {
        updateTestimonialStack(index);
      }
    });
  });

  // 6. Contact Form Submission & Toast
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotice');

  function showToast(message) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-msg');
    if (msgEl && message) msgEl.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      setTimeout(() => {
        showToast("Message sent! Redirecting...");
        setTimeout(() => {
          window.location.href = '404.html';
        }, 1000);
      }, 900);
    });
  }

  // Contact page form (contact.html)
  const contactPageForm = document.getElementById('contactPageForm');
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactPageForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }
      setTimeout(() => {
        showToast("Message sent! Redirecting...");
        setTimeout(() => {
          window.location.href = '404.html';
        }, 1000);
      }, 900);
    });
  }

  // Blog newsletter form
  const blogNewsletterForm = document.getElementById('blogNewsletterForm');
  if (blogNewsletterForm) {
    blogNewsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = blogNewsletterForm.querySelector('input');
      if (input && input.value.trim() !== '') {
        showToast('Subscribed! Redirecting...');
        setTimeout(() => {
          window.location.href = '404.html';
        }, 1000);
      }
    });
  }

  // 7. Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim() !== '') {
        showToast(`Subscribed! Redirecting...`);
        setTimeout(() => {
          window.location.href = '404.html';
        }, 1000);
      }
    });
  }

  // 7b. All Footer Links -> 404
  document.querySelectorAll('.site-footer a, footer a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  // 8. Services Tabs Switcher (What's Actually Included)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  if (tabButtons.length > 0 && tabPanels.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // 9. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const body = item.querySelector('.faq-body');

      // Expand default active item
      if (item.classList.contains('active') && body) {
        body.style.maxHeight = body.scrollHeight + 'px';
      }

      if (trigger && body) {
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close all open items
          faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherBody = otherItem.querySelector('.faq-body');
            if (otherBody) otherBody.style.maxHeight = null;
          });

          // Toggle current
          if (!isActive) {
            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
          }
        });
      }
    });
  }

  // 10. Blog Category Filtering & Live Search
  const filterChips = document.querySelectorAll('.filter-chip');
  const blogCards = document.querySelectorAll('.blog-card');
  const blogSearchInput = document.getElementById('blogSearchInput');
  const blogNoResults = document.getElementById('blogNoResults');
  const resetFilterBtn = document.getElementById('resetFilterBtn');
  const featuredCard = document.querySelector('.featured-post-card');

  let currentCategory = 'all';
  let searchQuery = '';

  function applyBlogFilters() {
    let visibleCount = 0;

    blogCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
      const author = card.querySelector('.meta-author')?.textContent.toLowerCase() || '';

      const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
      const matchesSearch = searchQuery === '' ||
        title.includes(searchQuery) ||
        excerpt.includes(searchQuery) ||
        author.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Also toggle featured card if searching
    if (featuredCard) {
      if (searchQuery !== '') {
        const featTitle = featuredCard.querySelector('.featured-title')?.textContent.toLowerCase() || '';
        const featExcerpt = featuredCard.querySelector('.featured-excerpt')?.textContent.toLowerCase() || '';
        const featCategory = featuredCard.getAttribute('data-category');

        const featMatchesCat = currentCategory === 'all' || featCategory === currentCategory;
        const featMatchesSearch = featTitle.includes(searchQuery) || featExcerpt.includes(searchQuery);

        featuredCard.style.display = (featMatchesCat && featMatchesSearch) ? 'block' : 'none';
        if (featMatchesCat && featMatchesSearch) visibleCount++;
      } else {
        const featCategory = featuredCard.getAttribute('data-category');
        featuredCard.style.display = (currentCategory === 'all' || featCategory === currentCategory) ? 'block' : 'none';
      }
    }

    if (blogNoResults) {
      blogNoResults.style.display = (visibleCount === 0) ? 'flex' : 'none';
    }
  }

  if (filterChips.length > 0) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        currentCategory = chip.getAttribute('data-filter') || 'all';
        applyBlogFilters();
      });
    });
  }

  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyBlogFilters();
    });
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      if (blogSearchInput) blogSearchInput.value = '';
      searchQuery = '';
      currentCategory = 'all';
      filterChips.forEach(c => {
        const isAll = c.getAttribute('data-filter') === 'all';
        c.classList.toggle('active', isAll);
        c.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
      applyBlogFilters();
    });
  }

  // 12. Pagination Pills Feedback
  const pagePills = document.querySelectorAll('.page-pill:not(.page-arrow)');
  if (pagePills.length > 0) {
    pagePills.forEach(pill => {
      pill.addEventListener('click', () => {
        pagePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const gridSection = document.getElementById('blogArticles');
        if (gridSection) {
          gridSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});


