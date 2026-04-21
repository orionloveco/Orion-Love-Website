/* ============================================================
   Orion Love | Keller Williams Colorado West Realty — Shared Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.classList.add('js');

  const BUSINESS_IDENTITY = {
    name: 'Orion Love',
    title: 'Real Estate Broker',
    brokerage: 'Keller Williams Colorado West Realty',
    attribution: 'Orion Love | Keller Williams Colorado West Realty',
    email: 'orion.love.co@gmail.com',
    phoneDisplay: '(970) 644-6781',
    phoneLink: '9706446781',
    addressLine1: '2474 Patterson Rd #100',
    cityStateZip: 'Grand Junction, CO 81505',
    serviceAreaPrimary: 'Mesa County, Colorado',
  };

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


  const AREA_NAV_GROUPS = [
    {
      label: 'Core Areas',
      items: [
        { href: 'areas.html', label: 'All Areas Index' },
        { href: 'grand-junction-home-value.html', label: 'Grand Junction' },
        { href: 'sell-clifton.html', label: 'Clifton' },
        { href: 'sell-fruita.html', label: 'Fruita' },
        { href: 'sell-palisade.html', label: 'Palisade' },
        { href: 'sell-loma-mack.html', label: 'Loma / Mack' },
      ],
    },
    {
      label: 'Grand Junction Neighborhoods',
      items: [
        { href: 'sell-downtown-grand-junction.html', label: 'Downtown Grand Junction' },
        { href: 'sell-north-grand-junction.html', label: 'North Grand Junction' },
        { href: 'sell-northeast-grand-junction.html', label: 'Northeast Grand Junction' },
        { href: 'sell-northwest-grand-junction.html', label: 'Northwest Grand Junction' },
        { href: 'sell-orchard-mesa.html', label: 'Orchard Mesa' },
        { href: 'sell-redlands.html', label: 'Redlands' },
      ],
    },
  ];

  const SHARED_NAV_ITEMS = [
    { href: 'index.html', label: 'Home' },
    { href: 'sell-with-orion.html', label: 'Sell' },
    { href: 'buy-with-orion.html', label: 'Buyers' },
    { href: 'grand-junction-home-value.html', label: 'Home Value' },
    { label: 'Areas', key: 'areas', children: AREA_NAV_GROUPS },
    { href: 'about.html', label: 'About' },
    { href: 'faq.html', label: 'FAQ' },
    { href: 'contact.html', label: 'Contact', isButton: true },
  ];

  const FEATURED_AREA_LINKS = [
    { href: 'areas.html', icon: 'map', label: 'All Areas Index' },
    { href: 'grand-junction-home-value.html', icon: 'building-2', label: 'Grand Junction' },
    { href: 'sell-fruita.html', icon: 'bike', label: 'Fruita' },
    { href: 'sell-palisade.html', icon: 'leaf', label: 'Palisade' },
    { href: 'sell-clifton.html', icon: 'house', label: 'Clifton' },
    { href: 'sell-loma-mack.html', icon: 'mountain', label: 'Loma / Mack' },
  ];

  function renderSharedHeader(currentPath) {
    const target = document.getElementById('siteHeader');
    if (!target) return;

    const navItems = SHARED_NAV_ITEMS.map((item) => {
      if (item.children?.length) {
        const childLinks = item.children
          .map((group) => {
            const links = group.items
              .map((child) => {
                const childIsActive = currentPath === child.href;
                const childActiveClass = childIsActive ? ' class="active"' : '';
                const childCurrent = childIsActive ? ' aria-current="page"' : '';
                return `<li><a${childActiveClass} href="${child.href}"${childCurrent}>${child.label}</a></li>`;
              })
              .join('');

            return `<div class="nav-dropdown-group"><p class="nav-dropdown-heading">${group.label}</p><ul>${links}</ul></div>`;
          })
          .join('');

        const groupIsActive = item.children.some((group) =>
          group.items.some((child) => child.href === currentPath)
        );
        const activeClass = groupIsActive ? ' active' : '';

        return `<li class="nav-dropdown${activeClass}">
          <button aria-controls="areasDropdownMenu" aria-expanded="false" aria-haspopup="true" class="nav-dropdown-toggle" type="button">${item.label}</button>
          <div class="nav-dropdown-menu" id="areasDropdownMenu">${childLinks}</div>
        </li>`;
      }

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
      <span class="logo-main">${BUSINESS_IDENTITY.attribution}</span>
    </a>
    <ul class="nav-menu" id="navMenu">${navItems}</ul>
    <button aria-label="Toggle menu" aria-expanded="false" aria-controls="mobileNavOverlay" class="mobile-toggle" id="mobileToggle">
      <span></span><span></span><span></span>
    </button>
  </nav>
</header>`;
  }

  function renderMobileNavMarkup(currentPath) {
    const rows = SHARED_NAV_ITEMS.map((item) => {
      if (item.children?.length) {
        const grouped = item.children
          .map((group) => {
            const links = group.items
              .map((child) => {
                const active = currentPath === child.href ? ' class="active"' : '';
                const current = currentPath === child.href ? ' aria-current="page"' : '';
                return `<li><a${active} href="${child.href}"${current}>${child.label}</a></li>`;
              })
              .join('');
            return `<div class="mobile-nav-group"><p>${group.label}</p><ul>${links}</ul></div>`;
          })
          .join('');

        return `<li class="mobile-nav-areas"><span class="mobile-nav-title">${item.label}</span>${grouped}</li>`;
      }

      const activeClass = currentPath === item.href ? ' class="active"' : '';
      const currentAttr = currentPath === item.href ? ' aria-current="page"' : '';
      const buttonClass = item.isButton ? ' class="btn-nav"' : activeClass;
      return `<li><a${buttonClass} href="${item.href}"${currentAttr}>${item.label}</a></li>`;
    }).join('');

    return `<ul class="mobile-nav-list">${rows}</ul>`;
  }

  function resolveFeaturedAreasMountMode(value) {
    if (value === 'inner' || value === 'disabled') return value;
    return 'full';
  }

  function renderFeaturedAreasMarkup(mode) {
    const mountMode = resolveFeaturedAreasMountMode(mode);

    if (mountMode === 'disabled') {
      return '';
    }

    const links = FEATURED_AREA_LINKS.map(
      (item) =>
        `<a class="link-card card-link" href="${item.href}"><span aria-hidden="true" class="link-card-icon"><i data-lucide="${item.icon}"></i></span><span>${item.label}</span></a>`
    ).join('');

    if (mountMode === 'inner') {
      return `<div class="link-grid">${links}</div>`;
    }

    return `
<section class="nearby-area-shell">
  <div class="container">
    <div class="nearby-area-links-shell">
      <div class="nearby-area-intro">
        <div class="nearby-area-label"><span>Area Links</span></div>
        <h2>Route to a Seller Area Page</h2>
        <p>Use the areas index for full routing by neighborhood tier.</p>
      </div>
      <div class="link-grid">${links}</div>
    </div>
  </div>
</section>`;
  }

  function renderFeaturedAreas() {
    const target = document.getElementById('featuredAreasLinks');
    if (!target) return;

    const mode = resolveFeaturedAreasMountMode(target.dataset.featuredAreasMount);
    if (mode === 'disabled') {
      target.innerHTML = '';
      return;
    }

    target.innerHTML = renderFeaturedAreasMarkup(mode);
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
        <p class="footer-brand-note">Serving ${BUSINESS_IDENTITY.serviceAreaPrimary}<br/>including Grand Junction, Fruita, Palisade, and Clifton</p>
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="sell-with-orion.html">Sellers</a></li>
          <li><a href="areas.html">Areas</a></li>
          <li><a href="buy-with-orion.html">Buyers</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:${BUSINESS_IDENTITY.email}">${BUSINESS_IDENTITY.email}</a></li>
          <li><a href="tel:${BUSINESS_IDENTITY.phoneLink}">${BUSINESS_IDENTITY.phoneDisplay}</a></li>
          <li>${BUSINESS_IDENTITY.addressLine1}<br/>${BUSINESS_IDENTITY.cityStateZip}</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} ${BUSINESS_IDENTITY.attribution}. All rights reserved.</p>
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
      overlay.innerHTML = renderMobileNavMarkup(path);
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

    const areaToggle = document.querySelector('.nav-dropdown-toggle');
    const areaDropdown = document.querySelector('.nav-dropdown');
    if (areaToggle && areaDropdown) {
      areaToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const willOpen = !areaDropdown.classList.contains('open');
        areaDropdown.classList.toggle('open', willOpen);
        areaToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });

      document.addEventListener('click', (e) => {
        if (!areaDropdown.contains(e.target)) {
          areaDropdown.classList.remove('open');
          areaToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

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
  function renderMarketAreaBlock(blockEl, areaData, generatedAt) {
    const useHtmlCurrency = blockEl.dataset.marketCurrency === 'html';

    blockEl.querySelectorAll('[data-market-stat]').forEach((statEl) => {
      const statKey = statEl.dataset.marketStat;

      if (statKey === 'medianPrice') {
        if (useHtmlCurrency) statEl.innerHTML = formatCurrencyHTML(areaData.medianPrice);
        else statEl.textContent = formatCurrency(areaData.medianPrice);
        return;
      }

      if (statKey === 'averageDaysOnMarket') {
        statEl.textContent = formatDays(areaData.averageDaysOnMarket);
        return;
      }

      if (statKey === 'newListings') {
        statEl.textContent = formatNumber(areaData.newListings);
        return;
      }

      if (statKey === 'totalListings') {
        statEl.textContent = formatNumber(areaData.totalListings);
      }
    });

    const noteEl = blockEl.querySelector('[data-market-note]');
    if (!noteEl) return;

    const areaLabel = blockEl.dataset.marketAreaLabel || '';
    const updated = areaData.lastUpdatedDate || generatedAt;
    noteEl.textContent = formatUpdatedDate(updated, areaLabel);
  }

  async function loadMarketStatsBlocks() {
    const marketBlocks = [...document.querySelectorAll('[data-market-area]')];
    if (!marketBlocks.length) return;

    try {
      const res = await fetch(MARKET_STATS_URL, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      marketBlocks.forEach((blockEl) => {
        const areaKey = blockEl.dataset.marketArea;
        const areaData = data?.areas?.[areaKey];

        if (!areaData) {
          console.error(`Market stats area not found: ${areaKey}`);
          const noteEl = blockEl.querySelector('[data-market-note]');
          if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
          return;
        }

        renderMarketAreaBlock(blockEl, areaData, data.generatedAt);
      });
    } catch (err) {
      console.error('Market stats load failed:', err);
      marketBlocks.forEach((blockEl) => {
        const noteEl = blockEl.querySelector('[data-market-note]');
        if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
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
    errorMessage = `Something went wrong. Please call ${BUSINESS_IDENTITY.phoneDisplay}.`,
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
        const validationError = validate ? validate(form) : '';
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
      if (!value) return;
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
      form.dataset.errorMessage || `Something went wrong. Please call ${BUSINESS_IDENTITY.phoneDisplay}.`;

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
    document.querySelectorAll('form[data-lead-form="seller"]:not([data-form-handler="contact"])').forEach((form) => {
      initSellerLeadForm(form);
    });
  };

  const initContactForm = () => {
    submitForm({
      formId: 'contactForm',
      submitBtnId: 'submitBtn',
      messageId: 'formMessage',
      validate: (form) => {
        if (!form.checkValidity()) {
          return 'Please fill in all required fields with valid information.';
        }
        return '';
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
  };

  const hasGrandJunctionCityStats = () => {
    return !!(
      document.getElementById('gjMedianListPrice') ||
      document.getElementById('gjAvgDom') ||
      document.getElementById('gjNewListings') ||
      document.getElementById('gjActiveListings')
    );
  };

  const runtimeFeatureInitializers = [
    {
      key: 'contact-form',
      when: () => !!document.getElementById('contactForm'),
      init: initContactForm,
    },
    {
      key: 'market-stats-blocks',
      when: () => document.querySelector('[data-market-area]'),
      init: loadMarketStatsBlocks,
    },
    {
      key: 'seller-lead-forms',
      when: () => document.querySelector('form[data-lead-form="seller"]'),
      init: initSellerLeadForms,
    },
    {
      key: 'grand-junction-city-stats',
      when: hasGrandJunctionCityStats,
      init: loadGrandJunctionCityStats,
    },
  ];

  runtimeFeatureInitializers.forEach((feature) => {
    if (feature.when()) {
      feature.init();
    }
  });

  /* ============================================================
     FAQ PAGE
     ============================================================ */
  if (document.body.classList.contains('page-faq') || document.querySelector('.faq-tab')) {
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
