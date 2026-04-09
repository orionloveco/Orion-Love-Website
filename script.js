/* =========================================================
   Orion Love — unified shared script.js
   Single source of truth for shared UI behavior + forms + market stats
========================================================= */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  /* =========================
     Mobile Menu Toggle
  ========================= */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

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
    document.body.style.overflow = 'hidden';
  };

  if (mobileToggle && navMenu) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', 'nav-menu');
    navMenu.id = 'nav-menu';

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });
  }

  /* =========================
     Sticky Nav
  ========================= */
  const header = document.querySelector('.main-header');
  if (header) {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      header.classList.toggle('scrolled', y > 40 || header.classList.contains('solid'));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* =========================
     Smooth Scroll for Anchor Links
  ========================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 88;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMenu();
    });
  });

  /* =========================
     Scroll Reveal
  ========================= */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll(
    '.reveal, .usp-card, .step, .stat, .value-card, .detail-item, .promise-item, .promise-card, .faq-item'
  );

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => {
      el.classList.add('visible', 'is-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible', 'is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('visible', 'is-visible'));
  }

  /* =========================
     Hero Scroll Indicator
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
  ========================= */
  document.querySelectorAll('form').forEach((form) => {
    form.querySelectorAll('input[required], textarea[required], select[required]').forEach((field) => {
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
      field.addEventListener('change', () => {
        if (field.validity.valid) {
          field.classList.remove('error');
          field.removeAttribute('aria-invalid');
        }
      });
    });
  });

  /* =========================
     Lazy Loading Images
  ========================= */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
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

    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  /* =========================
     Active Nav Link Highlighting
  ========================= */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a:not(.btn-nav)').forEach((link) => {
    const linkPath = link.getAttribute('href')?.split('/').pop();
    if (linkPath && linkPath === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* =========================
     FAQ Accordion
  ========================= */
  ['buyers-accordion', 'sellers-accordion'].forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;
    container.querySelectorAll('details.faq-item').forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          container.querySelectorAll('details.faq-item[open]').forEach((openItem) => {
            if (openItem !== item) openItem.removeAttribute('open');
          });
        }
      });
    });
  });

  /* =========================
     FAQ Tab Switching
  ========================= */
  const faqTabs = document.querySelectorAll('.faq-tab');
  const faqPanels = document.querySelectorAll('.faq-panel');

  if (faqTabs.length) {
    faqTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.panel;

        faqTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        faqPanels.forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const panel = document.getElementById('panel-' + target);
        if (panel) {
          panel.classList.add('active');
          panel.querySelectorAll('.reveal:not(.visible)').forEach((el) => el.classList.add('visible'));
        }

        if (window.lucide) lucide.createIcons();
      });
    });
  }

  /* =========================
     FAQ Search
  ========================= */
  document.querySelectorAll('.faq-search').forEach((input) => {
    const targetId = input.dataset.target;
    const accordion = document.getElementById(targetId);
    const panelKey = targetId?.replace('-accordion', '');
    const noResults = document.getElementById('no-results-' + panelKey);

    if (!accordion) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      let visible = 0;

      accordion.querySelectorAll('details.faq-item').forEach((item) => {
        const match = !query || item.textContent.toLowerCase().includes(query);
        item.style.display = match ? '' : 'none';
        if (match) visible += 1;
        if (!match && item.open) item.removeAttribute('open');
      });

      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });
  });

  /* =========================
     Unified Follow Up Boss Form Handling
  ========================= */
  const FUB_WORKER_URL = 'https://fub-contact-proxy.orion-love-co.workers.dev';

  const commonFieldNames = new Set(['firstName', 'lastName', 'email', 'phone', 'inquiry', 'message']);

  function getFieldValue(form, name) {
    const field = form.elements.namedItem(name);
    if (!field) return '';
    if (field instanceof RadioNodeList) return field.value?.trim?.() || '';
    return field.value?.trim?.() || '';
  }

  function findLabelText(field) {
    if (!field) return '';
    const byFor = field.id ? field.form?.querySelector(`label[for="${field.id}"]`) : null;
    const label = byFor || field.closest('.form-group')?.querySelector('label');
    if (!label) return field.name || field.id || 'Field';
    return label.textContent.replace(/\*/g, '').trim();
  }

  function showFormMessage(form, text, type) {
    const message = form.parentElement?.querySelector('.form-message') || form.querySelector('.form-message');
    if (!message) return;
    message.textContent = text;
    message.className = `form-message ${type}`;
    message.style.display = 'block';
    message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function buildGenericMessage(form) {
    const extraLines = [];
    Array.from(form.elements).forEach((field) => {
      if (!field.name || commonFieldNames.has(field.name) || field.disabled) return;
      if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(field.tagName)) return;
      const value = (field.value || '').trim();
      if (!value) return;
      extraLines.push(`${findLabelText(field)}: ${value}`);
    });
    return extraLines.join('\n');
  }

  document.querySelectorAll('form[data-fub-form="true"]').forEach((form) => {
    const submitBtn = form.querySelector('.form-submit');
    const defaultButtonLabel =
      submitBtn?.dataset.submitLabel ||
      submitBtn?.textContent?.trim() ||
      'Submit';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach((field) => {
        const value = (field.value || '').trim();
        if (!value) {
          field.classList.add('error');
          field.setAttribute('aria-invalid', 'true');
          valid = false;
        }
      });

      if (!valid) {
        showFormMessage(form, 'Please fill in all required fields.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = submitBtn.dataset.submitLoading || 'Sending…';
      }

      const inquiry = form.dataset.inquiry || getFieldValue(form, 'inquiry') || 'Website Inquiry';
      const explicitMessage = getFieldValue(form, 'message');
      const payload = {
        firstName: getFieldValue(form, 'firstName'),
        lastName: getFieldValue(form, 'lastName'),
        email: getFieldValue(form, 'email'),
        phone: getFieldValue(form, 'phone'),
        inquiry,
        message: explicitMessage || buildGenericMessage(form),
      };

      try {
        const response = await fetch(FUB_WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        let result = {};
        try {
          result = await response.json();
        } catch (_) {
          result = {};
        }

        if (response.ok && result.success) {
          showFormMessage(
            form,
            form.dataset.successMessage || "Thank you. I'll be in touch within 24 hours.",
            'success'
          );
          form.reset();
        } else {
          throw new Error(result.error || `Server error ${response.status}`);
        }
      } catch (error) {
        console.error('Form submission error:', error.message);
        showFormMessage(
          form,
          'Something went wrong. Please call or email me directly at (970) 644-6781.',
          'error'
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultButtonLabel;
        }
      }
    });
  });

  /* =========================
     Unified live market stats loader
  ========================= */
  const marketArea = document.body.dataset.marketArea;
  const marketStatTargets = document.querySelectorAll('[data-market-stat]');

  const formatCurrency = (value) => {
    if (!Number.isFinite(value)) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCompactCurrency = (value) => {
    if (!Number.isFinite(value)) return '--';
    const rounded = Math.round(value);
    if (rounded >= 1000000) return `$${(rounded / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (rounded >= 1000) return `$${Math.round(rounded / 1000)}K`;
    return `$${rounded}`;
  };

  const formatCompactCurrencyHtml = (value) => {
    if (!Number.isFinite(value)) return '<span>$</span>--';
    const rounded = Math.round(value);
    if (rounded >= 1000000) {
      return `<span>$</span>${(rounded / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (rounded >= 1000) return `<span>$</span>${Math.round(rounded / 1000)}K`;
    return `<span>$</span>${rounded}`;
  };

  const formatNumber = (value) => (
    Number.isFinite(value)
      ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(value))
      : '--'
  );

  const formatDays = (value) => (
    Number.isFinite(value) ? `${Math.round(value)} days` : '-- days'
  );

  const formatMarketNote = (dateValue) => {
    const zip = document.body.dataset.marketZip;
    const label = document.body.dataset.marketLabel;
    if (!dateValue) {
      return 'Live market data temporarily unavailable';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return 'Live market data updated recently';
    }

    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (zip) return `Updated ${monthYear} · ZIP ${zip}`;
    if (label) return `Updated ${monthYear} · ${label}`;
    return `Updated ${monthYear}`;
  };

  async function loadMarketStats() {
    if (!marketArea || !marketStatTargets.length) return;

    const noteTargets = document.querySelectorAll('[data-market-note]');
    const endpoint = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';

    try {
      const response = await fetch(endpoint, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (!response.ok) throw new Error(`Market stats request failed: ${response.status}`);

      const payload = await response.json();
      const area = payload?.areas?.[marketArea];
      if (!area) throw new Error(`Area key not found: ${marketArea}`);

      marketStatTargets.forEach((el) => {
        const stat = el.dataset.marketStat;
        const value = area?.[stat];
        const format = el.dataset.marketFormat || 'number';

        if (format === 'currency') {
          el.textContent = formatCurrency(value);
        } else if (format === 'currency-compact') {
          el.textContent = formatCompactCurrency(value);
        } else if (format === 'currency-compact-html') {
          el.innerHTML = formatCompactCurrencyHtml(value);
        } else if (format === 'days') {
          el.textContent = formatDays(value);
        } else {
          el.textContent = formatNumber(value);
        }
      });

      const updated = area.lastUpdatedDate || payload.generatedAt;
      noteTargets.forEach((el) => {
        el.textContent = formatMarketNote(updated);
      });
    } catch (error) {
      console.error('Market stats error:', error.message);
      document.querySelectorAll('[data-market-note]').forEach((el) => {
        el.textContent = 'Live market data temporarily unavailable';
      });
    }
  }

  loadMarketStats();
});
