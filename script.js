/* ============================================================
   Orion Love Real Estate — Shared Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.classList.add('js');

  /* ============================================================
     Page identity fallback
     Adds body class from filename if missing
     example: about.html -> page-about
     ============================================================ */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const pageSlug = path
    .replace(/\.html?$/i, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  if (pageSlug && document.body) {
    document.body.classList.add(`page-${pageSlug}`);
  }


  const SHARED_NAV_ITEMS = [
    { href: 'index.html', label: 'Home' },
    { href: 'services.html', label: 'Sellers' },
    { href: 'buyers.html', label: 'Buyers' },
    { href: 'about.html', label: 'About' },
    { href: 'faq.html', label: 'FAQ' },
    { href: 'contact.html', label: 'Contact', isButton: true },
  ];

  const FEATURED_AREA_LINKS = [
    { href: 'grand-junction-home-value.html', icon: 'building-2', label: 'Grand Junction' },
    { href: 'selling-in-fruita.html', icon: 'bike', label: 'Fruita' },
    { href: 'selling-in-palisade.html', icon: 'leaf', label: 'Palisade' },
    { href: 'clifton-grand-junction.html', icon: 'house', label: 'Clifton' },
    { href: 'loma-mack-grand-junction.html', icon: 'mountain', label: 'Loma / Mack' },
  ];

  function renderSharedHeader(currentPath) {
    const target = document.getElementById('siteHeader');
    if (!target) return;

    const navItems = SHARED_NAV_ITEMS.map((item) => {
      const isActive = currentPath === item.href;
      const activeClass = isActive ? ' class="active"' : '';
      const currentAttr = isActive ? ' aria-current="page"' : '';
      const btnClass = item.isButton ? ' class="btn-nav"' : activeClass;
      const classAttr = item.isButton ? btnClass : activeClass;

      return `<li><a${classAttr} href="${item.href}"${currentAttr}>${item.label}</a></li>`;
    }).join('');

    target.innerHTML = `
<header class="main-header" id="mainHeader">
  <nav>
    <a class="logo" href="index.html">
      <span class="logo-main">Orion Love | Colorado Realtor®</span>
    </a>
    <ul class="nav-menu" id="navMenu">${navItems}</ul>
    <button aria-label="Toggle menu" aria-expanded="false" aria-controls="mobileNavOverlay" class="mobile-toggle" id="mobileToggle">
      <span></span><span></span><span></span>
    </button>
  </nav>
</header>`;
  }

  function renderFeaturedAreas() {
    const target = document.getElementById('featuredAreasLinks');
    if (!target) return;

    const links = FEATURED_AREA_LINKS.map(
      (item) =>
        `<a class="link-card" href="${item.href}"><span aria-hidden="true" class="link-card-icon"><i data-lucide="${item.icon}"></i></span><span>${item.label}</span></a>`
    ).join('');

    target.innerHTML = `
<section class="bottom-city-links">
  <div class="container">
    <div class="bottom-city-links-shell">
      <div class="bottom-city-links-intro">
        <div class="bottom-city-links-label"><span>Featured Areas</span></div>
        <h2>Explore Key Markets Around Mesa County</h2>
        <p>A few of the places buyers and sellers ask about most across the Grand Valley.</p>
      </div>
      <div class="link-grid">${links}</div>
    </div>
  </div>
</section>`;
  }

  function renderSharedFooter() {
    const target = document.getElementById('siteFooter');
    if (!target) return;

    target.innerHTML = `
<footer class="main-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <h3 class="logo-footer">Orion Love</h3>
        <p>Helping Grand Junction homeowners buy and sell<br/>with clarity, confidence, and honest communication.</p>
        <p class="footer-brand-note">Serving Grand Junction, Fruita, Palisade,<br/>and Western Colorado</p>
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html">Sellers</a></li>
          <li><a href="buyers.html">Buyers</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:orion@orionlove.com">orion@orionlove.com</a></li>
          <li><a href="tel:9706446781">(970) 644-6781</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} Orion Love Real Estate. All rights reserved.</p>
      <a href="privacy.html">Privacy Policy</a>
    </div>
  </div>
</footer>`;
  }

  renderSharedHeader(path);
  renderFeaturedAreas();
  renderSharedFooter();

  /* ============================================================
     Icons
     ============================================================ */
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ============================================================
     Scroll reveal
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (revealEls.length) {
    if (prefersReducedMotion) {
      revealEls.forEach((el) => el.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );

      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ============================================================
     Header scroll state
     ============================================================ */
  const header = document.getElementById('mainHeader');
  if (header) {
    const updateHeader = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* ============================================================
     Mobile nav overlay
     ============================================================ */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    let overlay = document.getElementById('mobileNavOverlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mobileNavOverlay';
      overlay.innerHTML = navMenu.innerHTML;
      document.body.appendChild(overlay);
    }

    const openMenu = () => {
      overlay.classList.add('open');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-open');
    };

    const closeMenu = () => {
      overlay.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-open');
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (overlay.classList.contains('open')) closeMenu();
      else openMenu();
    });

    overlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ============================================================
     Shared helpers
     ============================================================ */
  const MARKET_STATS_URL =
    'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';

  const GJ_CITY_STATS_URL =
    'https://grand-junction-city-stats.orion-love-co.workers.dev/api/grand-junction-stats';

  const PROXY_URL =
    'https://fub-contact-proxy.orion-love-co.workers.dev';

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return '$--';
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    }
    if (value >= 1000) {
      return '$' + Math.round(value / 1000) + 'K';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatCurrencyHTML(value) {
    if (!Number.isFinite(value)) return '<span>$</span>--';
    const rounded = Math.round(value);

    if (rounded >= 1000000) {
      return '<span>$</span>' + (rounded / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (rounded >= 1000) {
      return '<span>$</span>' + Math.round(rounded / 1000) + 'K';
    }
    return '<span>$</span>' + rounded.toLocaleString();
  }

  function formatDays(value) {
    return Number.isFinite(value) ? `${Math.round(value)} days` : '-- days';
  }

  function formatNumber(value) {
    return Number.isFinite(value) ? Math.round(value).toLocaleString() : '--';
  }

  function formatUpdatedDate(value, areaLabel) {
    const suffix = areaLabel ? ` · ${areaLabel}` : '';
    if (!value) return `Live market data${suffix}`;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return `Live market data${suffix}`;

    return `Updated ${parsed.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })}${suffix}`;
  }

  function showFormMsg(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-message ${type}`;
    el.style.display = 'block';
  }

  async function submitToProxy(formData) {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Server error');
    }

    return data;
  }

  /* ============================================================
     Shared neighborhood stats loader
     ============================================================ */
  async function loadMarketStats(areaKey, opts = {}) {
    try {
      const res = await fetch(MARKET_STATS_URL, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const area = data?.areas?.[areaKey];

      if (!area) throw new Error(`Area not found: ${areaKey}`);

      const medianEls = document.querySelectorAll(
        '[data-market-stat="medianPrice"], #marketMedianPrice, #omMedianPrice, #redlandsMedianPrice, #palMedianPrice, #fruitaMedianSalePrice'
      );
      const domEls = document.querySelectorAll(
        '[data-market-stat="averageDaysOnMarket"], #marketDaysOnMarket, #omDaysOnMarket, #redlandsDaysOnMarket, #palAvgDom, #fruitaDaysOnMarket'
      );
      const newEls = document.querySelectorAll(
        '#omNewListings, #redlandsNewListings, #palNewListings, #fruitaNewListings'
      );
      const totalEls = document.querySelectorAll(
        '#omTotalListings, #redlandsTotalListings, #palTotalListings, #fruitaTotalListings'
      );
      const noteEls = document.querySelectorAll(
        '#marketNote, #marketUpdatedNote, #omStatsUpdated, #redlandsStatsNote, #palisadeMarketUpdated, #fruitaMarketNote'
      );

      medianEls.forEach((el) => {
        if (opts.htmlCurrency) el.innerHTML = formatCurrencyHTML(area.medianPrice);
        else el.textContent = formatCurrency(area.medianPrice);
      });

      domEls.forEach((el) => {
        el.textContent = formatDays(area.averageDaysOnMarket);
      });

      newEls.forEach((el) => {
        el.textContent = formatNumber(area.newListings);
      });

      totalEls.forEach((el) => {
        el.textContent = formatNumber(area.totalListings);
      });

      const updated = area.lastUpdatedDate || data.generatedAt;
      noteEls.forEach((el) => {
        el.textContent = formatUpdatedDate(updated, opts.areaLabel);
      });
    } catch (err) {
      console.error('Market stats load failed:', err);
      const noteEls = document.querySelectorAll(
        '#marketNote, #marketUpdatedNote, #omStatsUpdated, #redlandsStatsNote, #palisadeMarketUpdated, #fruitaMarketNote'
      );
      noteEls.forEach((el) => {
        el.textContent = 'Live market data temporarily unavailable';
      });
    }
  }

  /* ============================================================
     Grand Junction city stats loader
     Uses separate worker for grand-junction-home-value page
     ============================================================ */
  async function loadGrandJunctionCityStats() {
    try {
      const res = await fetch(GJ_CITY_STATS_URL, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const stats = data?.stats || {};

      const medianEl = document.getElementById('gjMedianListPrice');
      const domEl = document.getElementById('gjAvgDom');
      const newEl = document.getElementById('gjNewListings');
      const activeEl = document.getElementById('gjActiveListings');
      const metaEl = document.getElementById('gjStatsMeta');

      if (medianEl) medianEl.innerHTML = formatCurrencyHTML(stats.medianListPrice);
      if (domEl) domEl.textContent = formatDays(stats.averageDaysOnMarket);
      if (newEl) newEl.textContent = formatNumber(stats.newListings30d);
      if (activeEl) activeEl.textContent = formatNumber(stats.activeListings);
      if (metaEl) metaEl.textContent = formatUpdatedDate(data.generatedAt, 'Grand Junction');
    } catch (err) {
      console.error('Grand Junction city stats load failed:', err);
      const metaEl = document.getElementById('gjStatsMeta');
      if (metaEl) metaEl.textContent = 'Monthly snapshot temporarily unavailable';
    }
  }

  /* ============================================================
     Page initializers
     ============================================================ */
  const getTrimmedValue = (id) => document.getElementById(id)?.value.trim() || '';

  const submitForm = ({
    formId,
    submitBtnId,
    messageId,
    payloadBuilder,
    successMessage,
    submitButtonDefaultText,
    errorMessage = 'Something went wrong. Please call (970) 644-6781.',
    validate,
  }) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.getElementById(submitBtnId);
      const msg = document.getElementById(messageId);

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }

      try {
        const validationError = validate ? validate() : '';
        if (validationError) {
          showFormMsg(msg, validationError, 'error');
          return;
        }

        await submitToProxy(payloadBuilder());
        showFormMsg(msg, successMessage, 'success');
        form.reset();
      } catch (err) {
        console.error(err);
        showFormMsg(msg, errorMessage, 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = submitButtonDefaultText;
        }
      }
    });
  };

  const getLeadFieldValue = (form, fieldKey) => {
    const field = form.querySelector(`[data-lead-field="${fieldKey}"]`);
    return field ? field.value.trim() : '';
  };

  const buildSellerLeadMessage = (form) => {
    const lines = [];
    form.querySelectorAll('[data-message-line]').forEach((field) => {
      const label = field.getAttribute('data-message-line');
      const value = field.value.trim();
      lines.push(`${label}: ${value}`);
    });
    return lines.join('\n');
  };

  const initSellerLeadForm = (form) => {
    if (!form || form.dataset.initialized === 'true') return;

    const submitBtn = form.querySelector('[data-submit-button], button[type="submit"]');
    const msgEl = form.querySelector('.form-message');
    const successMessage =
      form.dataset.successMessage || "Thank you! I'll be in touch within 24 hours.";
    const inquiry = form.dataset.inquiry || 'Home Value Request';
    const submitDefaultText = submitBtn ? submitBtn.textContent.trim() : 'Submit';
    const errorMessage =
      form.dataset.errorMessage || 'Something went wrong. Please call (970) 644-6781.';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        showFormMsg(msgEl, 'Please fill in all required fields.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        await submitToProxy({
          firstName: getLeadFieldValue(form, 'firstName'),
          lastName: getLeadFieldValue(form, 'lastName'),
          email: getLeadFieldValue(form, 'email'),
          phone: getLeadFieldValue(form, 'phone'),
          inquiry,
          message: buildSellerLeadMessage(form),
        });

        showFormMsg(msgEl, successMessage, 'success');
        form.reset();
      } catch (err) {
        console.error(err);
        showFormMsg(msgEl, errorMessage, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitDefaultText;
        }
      }
    });

    form.dataset.initialized = 'true';
  };

  const initSellerLeadForms = () => {
    document.querySelectorAll('form[data-lead-form="seller"]').forEach((form) => {
      initSellerLeadForm(form);
    });
  };

  const pageInitializers = {
    'page-contact': () => {
      submitForm({
        formId: 'contactForm',
        submitBtnId: 'submitBtn',
        messageId: 'formMessage',
        validate: () => {
          const requiredIds = ['contactFirstName', 'contactLastName', 'contactEmail', 'contactMessage'];
          const hasAllValues = requiredIds.every((id) => getTrimmedValue(id));
          return hasAllValues ? '' : 'Please fill in all required fields.';
        },
        payloadBuilder: () => ({
          firstName: getTrimmedValue('contactFirstName'),
          lastName: getTrimmedValue('contactLastName'),
          email: getTrimmedValue('contactEmail'),
          phone: getTrimmedValue('contactPhone'),
          inquiry: document.getElementById('contactInquiry')?.value || 'General Inquiry',
          message: getTrimmedValue('contactMessage'),
        }),
        successMessage: "Thank you for reaching out. I'll be in touch within 24 hours.",
        submitButtonDefaultText: 'Start the Conversation',
        errorMessage: 'Something went wrong. Please call or email me directly.',
      });
    },
    'page-grand-junction-home-value': () => {
      loadGrandJunctionCityStats();
      initSellerLeadForms();
    },
    'page-orchard-mesa-homes': () => {
      loadMarketStats('orchard_mesa', {
        htmlCurrency: true,
        areaLabel: 'Orchard Mesa',
      });
      initSellerLeadForms();
    },
    'page-redlands-homes': () => {
      loadMarketStats('redlands', {
        htmlCurrency: true,
        areaLabel: 'Redlands',
      });
      initSellerLeadForms();
    },
    'page-selling-in-fruita': () => {
      loadMarketStats('fruita', {
        areaLabel: 'Fruita',
      });
      initSellerLeadForms();
    },
    'page-selling-in-palisade': () => {
      loadMarketStats('palisade', {
        htmlCurrency: true,
        areaLabel: 'Palisade',
      });
      initSellerLeadForms();
    },
    'page-clifton-grand-junction': () => {
      loadMarketStats('clifton', { areaLabel: 'ZIP 81520' });
    },
    'page-downtown-grand-junction': () => {
      loadMarketStats('downtown_grand_junction', { areaLabel: 'ZIP 81501' });
    },
    'page-loma-mack-grand-junction': () => {
      loadMarketStats('loma_mack', { areaLabel: 'Loma / Mack' });
    },
    'page-north-grand-junction': () => {
      loadMarketStats('north_grand_junction', { areaLabel: 'North Grand Junction' });
    },
    'page-northeast-grand-junction': () => {
      loadMarketStats('northeast_grand_junction', { areaLabel: 'Northeast Grand Junction' });
    },
    'page-northwest-grand-junction': () => {
      loadMarketStats('northwest_grand_junction', { areaLabel: 'Northwest Grand Junction' });
    },
  };

  Object.entries(pageInitializers).forEach(([pageClass, init]) => {
    if (document.body.classList.contains(pageClass)) init();
  });

  /* ============================================================
     FAQ PAGE
     ============================================================ */
  if (document.body.classList.contains('page-faq')) {
    const faqTabs = document.querySelectorAll('.faq-tab');
    const faqPanels = document.querySelectorAll('.faq-panel');

    faqTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.panel;

        faqTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });

        faqPanels.forEach((panel) => {
          panel.classList.remove('active');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const targetPanel = document.getElementById(`panel-${target}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
            el.classList.add('visible');
          });
        }

        if (window.lucide) lucide.createIcons();
      });
    });

    ['buyers-accordion', 'sellers-accordion'].forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;

      container.querySelectorAll('details.faq-item').forEach((item) => {
        item.addEventListener('toggle', () => {
          if (!item.open) return;

          container.querySelectorAll('details.faq-item[open]').forEach((openItem) => {
            if (openItem !== item) openItem.removeAttribute('open');
          });
        });
      });
    });

    document.querySelectorAll('.faq-search').forEach((input) => {
      const accordion = document.getElementById(input.dataset.target);
      const panelKey = input.dataset.target?.replace('-accordion', '');
      const noResults = document.getElementById(`no-results-${panelKey}`);

      if (!accordion) return;

      input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        let visibleCount = 0;

        accordion.querySelectorAll('details.faq-item').forEach((item) => {
          const match = !query || item.textContent.toLowerCase().includes(query);
          item.style.display = match ? '' : 'none';
          if (!match && item.open) item.removeAttribute('open');
          if (match) visibleCount++;
        });

        if (noResults) {
          noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    });
  }
});
