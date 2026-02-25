document.addEventListener('DOMContentLoaded', () => {
  /* =========================
     Mobile Menu Toggle
  ========================= */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  const closeMenu = () => {
    navMenu?.classList.remove('active');
    mobileToggle?.classList.remove('active');
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* =========================
     Smooth Scroll for Anchor Links
  ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' ) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 80;
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      closeMenu();
    });
  });

  /* =========================
     Header Shadow on Scroll
  ========================= */
  const header = document.querySelector('.main-header');
  if (header) {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      header.style.boxShadow = (y > 100)
        ? '0 4px 15px rgba(0,0,0,0.1)'
        : '0 2px 10px rgba(0,0,0,0.05)';
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* =========================
     Form Validation Enhancement
  ========================= */
  document.querySelectorAll('form').forEach(form => {
    const required = form.querySelectorAll('input[required], textarea[required], select[required]');

    required.forEach(field => {
      field.addEventListener('invalid', (e) => {
        e.preventDefault();
        field.classList.add('error');
      });

      field.addEventListener('input', () => {
        field.classList.remove('error');
      });
    });
  });

  /* =========================
     Lazy Loading Images (data-src)
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
        }
        observer.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /* =========================
     Reveal Animations (CSS controls visibility)
  ========================= */
  const revealTargets = document.querySelectorAll(
    '.usp-card, .listing-card, .step, .value-card, .detail-item, .promise-item, .stat'
  );

  if (revealTargets.length && 'IntersectionObserver' in window) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If user prefers reduced motion, just mark as visible immediately
    if (prefersReducedMotion) {
      revealTargets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: no IntersectionObserver support
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // Optional: remove these once you're done debugging
  // console.log('Website loaded');
});
