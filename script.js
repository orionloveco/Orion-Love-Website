/* =========================================================
   Orion Love — script.js
   Reconciled + upgraded to match the redesigned site system
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     Lucide Icons
     Initialize on every page that loads this script.
  ========================= */
  if (window.lucide) lucide.createIcons();


  /* =========================
     Mobile Menu Toggle
  ========================= */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu      = document.querySelector('.nav-menu');

  const closeMenu = () => {
    navMenu?.classList.remove('active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileToggle?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navMenu?.classList.add('active');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    mobileToggle?.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent bg scroll
  };

  if (mobileToggle && navMenu) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', 'nav-menu');
    navMenu.id = 'nav-menu';

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });
  }


  /* =========================
     Sticky Nav — scroll state
     Adds .scrolled for frosted-navy effect defined in CSS.
     Also handles the transparent-over-hero pattern.
  ========================= */
  const header = document.querySelector('.main-header');

  if (header) {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      header.classList.toggle('scrolled', y > 40);
    };

    onScroll(); // run once on load
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* =========================
     Smooth Scroll for Anchor Links
     Accounts for the 72px fixed header.
  ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 88; // nav height + breathing room
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top, behavior: 'smooth' });
      closeMenu();
    });
  });


  /* =========================
     Scroll Reveal
     Handles both .reveal (new pages) and legacy
     selector targets (usp-card, step, etc.).
     Supports: transition-delay on individual elements.
  ========================= */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Skip all animation — just make everything visible immediately
    document.querySelectorAll('.reveal, .usp-card, .step, .stat, .value-card, .detail-item, .promise-item, .promise-card, .faq-item')
      .forEach(el => {
        el.classList.add('is-visible', 'visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  } else {
    // New .reveal system (used by all redesigned pages)
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible', 'is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

      document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

      // Legacy targets (old pages that don't use .reveal)
      const legacyTargets = document.querySelectorAll(
        '.usp-card:not(.reveal), .step:not(.reveal), .stat:not(.reveal), .value-card:not(.reveal), .detail-item:not(.reveal), .promise-item:not(.reveal)'
      );
      const legacyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

      legacyTargets.forEach(el => legacyObserver.observe(el));

    } else {
      // Fallback for no IntersectionObserver support
      document.querySelectorAll('.reveal, .usp-card, .step, .stat')
        .forEach(el => {
          el.classList.add('visible', 'is-visible');
        });
    }
  }


  /* =========================
     Hero Scroll Indicator
     Fades out as user scrolls down.
  ========================= */
  const scrollIndicator = document.querySelector('.hero-scroll');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      const opacity = Math.max(0, 1 - window.scrollY / 200);
      scrollIndicator.style.opacity = opacity;
    }, { passive: true });
  }


  /* =========================
     Form Validation
     Adds .error class on invalid fields,
     removes on correction. Works with any form on the page.
  ========================= */
  document.querySelectorAll('form').forEach(form => {
    form.querySelectorAll('input[required], textarea[required], select[required]')
      .forEach(field => {
        field.addEventListener('invalid', (e) => {
          e.preventDefault();
          field.classList.add('error');
          field.setAttribute('aria-invalid', 'true');
        });

        field.addEventListener('input', () => {
          if (field.validity.valid) {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
          }
        });
      });
  });


  /* =========================
     Lazy Loading Images
     Swaps data-src → src when near viewport.
  ========================= */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        }
        observer.unobserve(img);
      });
    }, { rootMargin: '300px 0px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }


  /* =========================
     Active Nav Link Highlighting
     Marks the current page's nav link as active
     based on the current URL path.
  ========================= */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a:not(.btn-nav)').forEach(link => {
    const linkPath = link.getAttribute('href')?.split('/').pop();
    if (linkPath && linkPath === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });


  /* =========================
     FAQ Accordion (shared logic)
     Used by faq.html but safe to run on every page.
     One-open-at-a-time within each accordion group.
  ========================= */
  ['buyers-accordion', 'sellers-accordion'].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;

    container.querySelectorAll('details.faq-item').forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          container.querySelectorAll('details.faq-item[open]').forEach(open => {
            if (open !== item) open.removeAttribute('open');
          });
        }
      });
    });
  });


  /* =========================
     FAQ Tab Switching (faq.html)
  ========================= */
  const faqTabs  = document.querySelectorAll('.faq-tab');
  const faqPanels = document.querySelectorAll('.faq-panel');

  if (faqTabs.length) {
    faqTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.panel;

        faqTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        faqPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const panel = document.getElementById('panel-' + target);
        if (panel) {
          panel.classList.add('active');
          // Re-run reveal observer for newly visible items
          panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
          });
        }

        if (window.lucide) lucide.createIcons();
      });
    });
  }


  /* =========================
     FAQ Live Search
  ========================= */
  document.querySelectorAll('.faq-search').forEach(input => {
    const targetId  = input.dataset.target;
    const accordion = document.getElementById(targetId);
    const panelKey  = targetId?.replace('-accordion', '');
    const noResults = document.getElementById('no-results-' + panelKey);

    if (!accordion) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      let visible = 0;

      accordion.querySelectorAll('details.faq-item').forEach(item => {
        const match = !query || item.textContent.toLowerCase().includes(query);
        item.style.display = match ? '' : 'none';
        if (match) visible++;
        if (!match && item.open) item.removeAttribute('open');
      });

      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });
  });


  /* =========================
     Contact Form (Cloudflare Worker → FollowUpBoss)
     Only activates when #contactForm is present.
  ========================= */
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Client-side required field check
      const requiredIds = ['firstName', 'lastName', 'email', 'message'];
      let valid = true;
      requiredIds.forEach(id => {
        const field = document.getElementById(id);
        if (!field?.value.trim()) {
          field?.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const formData = {
        firstName: document.getElementById('firstName')?.value.trim(),
        lastName:  document.getElementById('lastName')?.value.trim(),
        email:     document.getElementById('email')?.value.trim(),
        phone:     document.getElementById('phone')?.value.trim() || '',
        inquiry:   document.getElementById('inquiry')?.value || '',
        message:   document.getElementById('message')?.value.trim(),
      };

      try {
        const WORKER_URL = 'https://fub-contact-proxy.orion-love-co.workers.dev';

        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        let result = {};
        try { result = await response.json(); } catch (_) {}

        if (response.ok && result.success) {
          showFormMessage("Thank you for reaching out. I'll be in touch within 24 hours.", 'success');
          contactForm.reset();
        } else {
          throw new Error(result.error || `Server error ${response.status}`);
        }

      } catch (err) {
        console.error('Form error:', err.message);
        showFormMessage(
          'Something went wrong. Please call or email me directly at (970) 644-6781.',
          'error'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  function showFormMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

}); // end DOMContentLoaded
