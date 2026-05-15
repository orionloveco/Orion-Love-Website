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
      label: 'Grand Junction',
      items: [
        { href: '/sell-redlands', label: 'Redlands' },
        { href: '/sell-orchard-mesa', label: 'Orchard Mesa' },
        { href: '/sell-downtown-grand-junction', label: 'Central GJ' },
        { href: '/sell-north-grand-junction', label: 'North GJ' },
        { href: '/sell-northeast-grand-junction', label: 'Northeast GJ' },
        { href: '/sell-northwest-grand-junction', label: 'Northwest GJ' },
      ],
    },
    {
      label: 'Surrounding Areas',
      items: [
        { href: '/sell-fruita', label: 'Fruita' },
        { href: '/sell-palisade', label: 'Palisade' },
        { href: '/sell-clifton', label: 'Clifton' },
        { href: '/sell-loma-mack', label: 'Loma / Mack' },
      ],
    },
  ];

  syncSharedNavState(path);

  function syncSharedNavState(currentPath) {
    const normalizedCurrent = normalizePath(currentPath);
    const areaLinks = AREA_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.href));
    const topLevelNavActive = [...document.querySelectorAll('#navMenu > li > a')]
      .some((link) => normalizePath(link.getAttribute('href')) === normalizedCurrent);

    document.querySelectorAll('#navMenu a, #mobileNavOverlay a').forEach((link) => {
      const isActive = normalizePath(link.getAttribute('href')) === normalizedCurrent;
      const isAreaSubnavLink = !!link.closest('.nav-dropdown-menu') || (!!link.closest('.mobile-nav-areas') && !link.classList.contains('mobile-nav-title'));
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
    const pageHeroSelector = [
      '.eh-cover',
      '.seller-hero',
      '.profile-hero',
      '.contact-composition',
      '.home-value-hero',
      '.li-cover',
      '.area-hero',
      '.buyer-hero',
      '.support-cover',
      '.faq-hero',
    ].join(',');
    const hasHero = !!document.querySelector(pageHeroSelector);

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

  function isTrustedZeroMarketStat(statKey, sourceKey) {
    return sourceKey === statKey || statKey !== 'newListings';
  }

  function getMarketStatValue(areaData, statKey) {
    const sourceKeys = MARKET_STAT_SOURCE_KEYS[statKey] || [statKey];

    for (const sourceKey of sourceKeys) {
      if (!Object.prototype.hasOwnProperty.call(areaData, sourceKey)) continue;

      const numericValue = parseMarketStatValue(areaData[sourceKey]);
      if (numericValue === null) continue;
      if (numericValue === 0 && !isTrustedZeroMarketStat(statKey, sourceKey)) continue;
      return numericValue;
    }

    return null;
  }

  function setMarketFallbackState(blockEl) {
    if (!blockEl) return;

    const noteEl = blockEl.querySelector('[data-market-note]');
    if (noteEl) {
      const areaLabel = blockEl.dataset.marketAreaLabel || 'this neighborhood';
      noteEl.textContent = `Market stats update monthly. Request a current seller consultation for the latest ${areaLabel} numbers.`;
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
    el.classList.remove('success', 'error');
    if (type) el.classList.add(type);
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

      // Prefer neutral data hooks; keep legacy class/id fallbacks during the form primitive migration.
      const btn =
        form.querySelector('[data-submit-button]') ||
        document.getElementById(submitBtnId) ||
        form.querySelector('.form-submit, button[type="submit"]');
      const msg =
        form.querySelector('[data-form-message]') ||
        (messageId ? document.querySelector(`[data-form-message][id="${messageId}"]`) : null) ||
        document.getElementById(messageId) ||
        form.querySelector('.form-message');

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

    // Prefer neutral data hooks; keep legacy class fallbacks until the broad CSS cleanup pass.
    const submitBtn = form.querySelector('[data-submit-button], .form-submit, button[type="submit"]');
    const msgEl = form.querySelector('[data-form-message], .form-message');
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
  ];

  runtimeFeatureInitializers.forEach((feature) => {
    if (feature.when()) {
      feature.init();
    }
  });

});
