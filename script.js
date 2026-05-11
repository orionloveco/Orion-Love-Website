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
  const path = window.location.pathname === '/' ? '/' : window.location.pathname;


  const normalizePath = (value) => {
    if (!value || value === '/') return '/';
    return value
      .replace(/^https?:\/\/[^/]+/i, '')
      .replace(/\/$/, '')
      .replace(/\.html$/i, '');
  };

  const pageSlug = path
    .replace(/^\//, '')
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
        { href: '/areas', label: 'All Areas Index' },
        { href: '/grand-junction-home-value', label: 'Grand Junction' },
        { href: '/sell-clifton', label: 'Clifton' },
        { href: '/sell-fruita', label: 'Fruita' },
        { href: '/sell-palisade', label: 'Palisade' },
        { href: '/sell-loma-mack', label: 'Loma / Mack' },
      ],
    },
    {
      label: 'Grand Junction Neighborhoods',
      items: [
        { href: '/sell-downtown-grand-junction', label: 'Downtown Grand Junction' },
        { href: '/sell-north-grand-junction', label: 'North Grand Junction' },
        { href: '/sell-northeast-grand-junction', label: 'Northeast Grand Junction' },
        { href: '/sell-northwest-grand-junction', label: 'Northwest Grand Junction' },
        { href: '/sell-orchard-mesa', label: 'Orchard Mesa' },
        { href: '/sell-redlands', label: 'Redlands' },
      ],
    },
  ];

  const SHARED_CONVERSATION_CTA = {
    href: '/contact',
    label: 'Start the Conversation',
  };

  function resolveFeaturedAreasMountMode(value) {
    if (value === 'inner' || value === 'disabled') return value;
    return 'full';
  }

  function renderFeaturedAreasMarkup(mode) {
    const mountMode = resolveFeaturedAreasMountMode(mode);

    if (mountMode === 'disabled') {
      return '';
    }

    if (mountMode === 'inner') {
      return `<div class="cta-center"><a class="btn btn-primary" href="${SHARED_CONVERSATION_CTA.href}">${SHARED_CONVERSATION_CTA.label}</a></div>`;
    }

    return `
<section class="nearby-area-shell">
  <div class="container">
    <div class="nearby-area-links-shell">
      <div class="nearby-area-intro">
        <div class="nearby-area-label"><span>Next Step</span></div>
        <h2>Have Questions About Selling?</h2>
        <p>Get direct guidance for your home, your timeline, and your Mesa County market.</p>
      </div>
      <div class="cta-center"><a class="btn btn-primary" href="${SHARED_CONVERSATION_CTA.href}">${SHARED_CONVERSATION_CTA.label}</a></div>
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

  renderFeaturedAreas();
  syncSharedNavState(path);

  function syncSharedNavState(currentPath) {
    const normalizedCurrent = normalizePath(currentPath);
    const areaLinks = AREA_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.href));
    const topLevelNavActive = [...document.querySelectorAll('#navMenu > li > a')]
      .some((link) => normalizePath(link.getAttribute('href')) === normalizedCurrent);

    document.querySelectorAll('#navMenu a, #mobileNavOverlay a').forEach((link) => {
      const isActive = normalizePath(link.getAttribute('href')) === normalizedCurrent;
      const isAreaSubnavLink = !!link.closest('.nav-dropdown-menu, .mobile-nav-areas');
      const shouldShowActive = isActive && !link.classList.contains('btn-nav') && !(topLevelNavActive && isAreaSubnavLink);
      link.classList.toggle('active', shouldShowActive);
      if (shouldShowActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const areaDropdown = document.querySelector('.nav-dropdown');
    if (areaDropdown) {
      const groupActive = !topLevelNavActive && areaLinks.some((href) => normalizePath(href) === normalizedCurrent);
      areaDropdown.classList.toggle('active', groupActive);
    }
  }

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
    const hasHero = !!document.querySelector('.hero');

    const updateHeader = () => {
      const isScrolled = window.scrollY > 40;
      header.classList.toggle('scrolled', isScrolled);
      header.classList.toggle('solid', !hasHero || isScrolled);
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
    const overlay = document.getElementById('mobileNavOverlay');
    if (!overlay) return;

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

    const mobileClose = overlay.querySelector('.mobile-nav-close');
    if (mobileClose) {
      mobileClose.addEventListener('click', closeMenu);
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMenu();
    });

    const areaToggle = document.querySelector('.nav-dropdown-toggle');
    const areaDropdown = document.querySelector('.nav-dropdown');
    if (areaToggle && areaDropdown) {
      const syncAreaAria = (isOpen) => {
        areaDropdown.classList.toggle('open', isOpen);
        areaToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      };

      areaToggle.addEventListener('click', (e) => {
        e.preventDefault();
        syncAreaAria(!areaDropdown.classList.contains('open'));
      });

      areaDropdown.addEventListener('mouseenter', () => syncAreaAria(true));
      areaDropdown.addEventListener('mouseleave', () => syncAreaAria(false));

      areaDropdown.addEventListener('focusin', () => syncAreaAria(true));
      areaDropdown.addEventListener('focusout', () => {
        requestAnimationFrame(() => {
          if (!areaDropdown.contains(document.activeElement)) {
            syncAreaAria(false);
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (!areaDropdown.contains(e.target)) {
          syncAreaAria(false);
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 968) closeMenu();
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
    return Number.isFinite(value) ? `${Math.round(value)} days` : 'Stats update monthly';
  }

  function formatNumber(value) {
    return Number.isFinite(value) ? Math.round(value).toLocaleString() : 'Monthly snapshot';
  }

  const MARKET_STAT_SOURCE_KEYS = {
    medianPrice: ['medianPrice', 'medianSalePrice', 'medianListPrice'],
    averageDaysOnMarket: ['averageDaysOnMarket', 'avgDaysOnMarket', 'averageDom'],
    newListings: ['newListings', 'newListings30d', 'newListings30Days'],
    totalListings: ['totalListings', 'activeListings'],
  };

  function parseMarketStatValue(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string' || value.trim() === '') return null;

    const numericValue = Number(value.replace(/[$,]/g, '').replace(/\s*days?$/i, '').trim());
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  function getMarketStatValue(areaData, statKey) {
    const sourceKeys = MARKET_STAT_SOURCE_KEYS[statKey] || [statKey];

    for (const sourceKey of sourceKeys) {
      if (!Object.prototype.hasOwnProperty.call(areaData, sourceKey)) continue;

      const numericValue = parseMarketStatValue(areaData[sourceKey]);
      if (numericValue !== null) return numericValue;
    }

    return null;
  }

  function setMarketFallbackState(blockEl) {
    if (!blockEl) return;

    const noteEl = blockEl.querySelector('[data-market-note]');
    if (noteEl) {
      const areaLabel = blockEl.dataset.marketAreaLabel || 'this neighborhood';
      noteEl.textContent = `Market stats update monthly. Request a current seller briefing for the latest ${areaLabel} numbers.`;
    }
  }

  function formatUpdatedDate(value) {
    if (!value) return 'Source: RentCast market data.';

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Source: RentCast market data.';

    return `Source: RentCast market data. Last updated: ${parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}.`;
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
      const statValue = getMarketStatValue(areaData, statKey);

      if (statValue === null) return;

      if (statKey === 'medianPrice') {
        if (useHtmlCurrency) statEl.innerHTML = formatCurrencyHTML(statValue);
        else statEl.textContent = formatCurrency(statValue);
        return;
      }

      if (statKey === 'averageDaysOnMarket') {
        statEl.textContent = formatDays(statValue);
        return;
      }

      if (statKey === 'newListings' || statKey === 'totalListings') {
        statEl.textContent = formatNumber(statValue);
      }
    });

    const noteEl = blockEl.querySelector('[data-market-note]');
    if (!noteEl) return;

    const updated = areaData.lastUpdatedDate || generatedAt;
    noteEl.textContent = formatUpdatedDate(updated);
  }

  async function loadMarketStatsBlocks() {
    const marketBlocks = [...document.querySelectorAll('[data-market-area]')];
    if (!marketBlocks.length) return;

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 5000);

      const res = await fetch(MARKET_STATS_URL, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      marketBlocks.forEach((blockEl) => {
        const areaKey = blockEl.dataset.marketArea;
        const areaData = data?.areas?.[areaKey];

        if (!areaData) {
          console.error(`Market stats area not found: ${areaKey}`);
          setMarketFallbackState(blockEl);
          return;
        }

        renderMarketAreaBlock(blockEl, areaData, data.generatedAt);
      });
    } catch (err) {
      console.error('Market stats load failed:', err);
      marketBlocks.forEach((blockEl) => {
        setMarketFallbackState(blockEl);
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

  const getStructuredProperty = (form) => {
    const property = {};

    form.querySelectorAll('[data-property-field]').forEach((field) => {
      const key = field.getAttribute('data-property-field');
      const value = field.value.trim();
      if (!key || !value) return;
      property[key] = key === 'state' ? value.toUpperCase() : value;
    });

    return Object.keys(property).length ? property : null;
  };

  const formatStructuredPropertyAddress = (property) => {
    if (!property) return '';

    const street = property.street || '';
    const city = property.city || '';
    const stateZip = [property.state, property.code].filter(Boolean).join(' ');

    return [street, city, stateZip].filter(Boolean).join(', ');
  };

  const buildSellerLeadMessage = (form) => {
    const lines = [];
    const propertyAddress = formatStructuredPropertyAddress(getStructuredProperty(form));

    if (propertyAddress) {
      lines.push(`Property Address: ${propertyAddress}`);
    }

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
      form.dataset.successMessage || "Thank you! I'll be in touch within one business day.";
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
        const payload = {
          firstName: getLeadFieldValue(form, 'firstName'),
          lastName: getLeadFieldValue(form, 'lastName'),
          email: getLeadFieldValue(form, 'email'),
          phone: getLeadFieldValue(form, 'phone'),
          inquiry,
          message: buildSellerLeadMessage(form),
        };
        const eventType = form.dataset.fubEventType;
        const property = getStructuredProperty(form);

        if (eventType) payload.type = eventType;
        if (property) payload.property = property;

        await submitToProxy(payload);

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
      successMessage: "Thank you for reaching out. I'll be in touch within one business day.",
      submitButtonDefaultText: 'Send Message',
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

      const hasActiveFaqFilter = () => {
        const filterSelectors = [
          'input[type="checkbox"][data-faq-filter]:checked',
          'input[type="radio"][data-faq-filter]:checked:not([value="all"])',
          'select[data-faq-filter]',
        ];

        return filterSelectors.some((selector) => {
          const filters = accordion.closest('.faq-panel')?.querySelectorAll(selector) || [];
          return Array.from(filters).some((filterEl) => {
            if (filterEl.tagName === 'SELECT') {
              return String(filterEl.value || '').trim().toLowerCase() !== 'all' && String(filterEl.value || '').trim() !== '';
            }

            return true;
          });
        });
      };

      const applyFaqSearch = ({ markInteracted = false } = {}) => {
        const query = input.value.toLowerCase().trim();
        const hasQuery = query.length > 0;
        const hasFilter = hasActiveFaqFilter();
        let visibleCount = 0;

        accordion.querySelectorAll('details.faq-item').forEach((item) => {
          const match = !query || item.textContent.toLowerCase().includes(query);
          item.style.display = match ? '' : 'none';
          if (!match && item.open) item.removeAttribute('open');
          if (match) visibleCount++;
        });

        if (noResults) {
          const hasInteraction = markInteracted || input.dataset.hasInteracted === 'true';
          noResults.style.display = hasInteraction && (hasQuery || hasFilter) && visibleCount === 0 ? 'block' : 'none';
        }
      };

      input.dataset.hasInteracted = 'false';
      if (noResults) noResults.style.display = 'none';
      accordion.querySelectorAll('details.faq-item').forEach((item) => {
        item.style.display = '';
      });

      input.addEventListener('input', () => {
        input.dataset.hasInteracted = 'true';
        applyFaqSearch({ markInteracted: true });
      });

      applyFaqSearch();
    });
  }
});
