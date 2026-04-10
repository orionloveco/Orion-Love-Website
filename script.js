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
  if (revealEls.length) {
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
      overlay.style.display = 'flex';
      mobileToggle.classList.add('active');
      document.body.classList.add('mobile-nav-open');
    };

    const closeMenu = () => {
      overlay.style.display = 'none';
      mobileToggle.classList.remove('active');
      document.body.classList.remove('mobile-nav-open');
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (overlay.style.display === 'flex') closeMenu();
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
     CONTACT PAGE
     ============================================================ */
  if (document.body.classList.contains('page-contact')) {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const inquiry = document.getElementById('inquiry');
        const message = document.getElementById('message');

        const requiredFields = [firstName, lastName, email, message];
        let valid = true;

        requiredFields.forEach((field) => {
          if (!field || !field.value.trim()) valid = false;
        });

        if (!valid) {
          showFormMsg(formMessage, 'Please fill in all required fields.', 'error');
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending…';
        }

        try {
          await submitToProxy({
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            phone: phone?.value.trim() || '',
            inquiry: inquiry?.value || 'General Inquiry',
            message: message.value.trim(),
          });

          showFormMsg(
            formMessage,
            "Thank you for reaching out. I'll be in touch within 24 hours.",
            'success'
          );
          contactForm.reset();
        } catch (err) {
          console.error(err);
          showFormMsg(
            formMessage,
            'Something went wrong. Please call or email me directly.',
            'error'
          );
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Start the Conversation';
          }
        }
      });
    }
  }

  /* ============================================================
     GRAND JUNCTION HOME VALUE PAGE
     ============================================================ */
  if (document.body.classList.contains('page-grand-junction-home-value')) {
    loadGrandJunctionCityStats();

    const valForm = document.getElementById('valForm');
    const valMsg = document.getElementById('valFormMsg');
    const valSubmit = document.getElementById('valSubmit');

    if (valForm) {
      valForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (valSubmit) {
          valSubmit.disabled = true;
          valSubmit.textContent = 'Sending…';
        }

        try {
          await submitToProxy({
            firstName: document.getElementById('firstName')?.value.trim() || '',
            lastName: document.getElementById('lastName')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            inquiry: 'Home Value Request — Grand Junction',
            message:
              'Address: ' + (document.getElementById('address')?.value.trim() || '') +
              '\nBedrooms: ' + (document.getElementById('bedrooms')?.value || '') +
              '\nTimeline: ' + (document.getElementById('timeline')?.value || ''),
          });

          showFormMsg(
            valMsg,
            "Thank you! I'll have your home value review ready within 24 hours.",
            'success'
          );
          valForm.reset();
        } catch (err) {
          console.error(err);
          showFormMsg(
            valMsg,
            'Something went wrong. Please call (970) 644-6781.',
            'error'
          );
        } finally {
          if (valSubmit) {
            valSubmit.disabled = false;
            valSubmit.textContent = 'Get My Free Home Value';
          }
        }
      });
    }
  }

  /* ============================================================
     ORCHARD MESA PAGE
     ============================================================ */
  if (document.body.classList.contains('page-orchard-mesa-homes')) {
    loadMarketStats('orchard_mesa', {
      htmlCurrency: true,
      areaLabel: 'Orchard Mesa',
    });

    const form = document.getElementById('omForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('formBtn');
        const msg = document.getElementById('formMsg');

        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Sending…';
        }

        try {
          await submitToProxy({
            firstName: document.getElementById('fn')?.value.trim() || '',
            lastName: document.getElementById('ln')?.value.trim() || '',
            email: document.getElementById('em')?.value.trim() || '',
            phone: document.getElementById('ph')?.value.trim() || '',
            inquiry: 'Home Value Request — Orchard Mesa',
            message:
              'Address: ' + (document.getElementById('addr')?.value.trim() || '') +
              '\nTimeline: ' + (document.getElementById('tl')?.value || '') +
              '\nRiver View: ' + (document.getElementById('rv')?.value || ''),
          });

          showFormMsg(msg, "Thank you! I'll have your Orchard Mesa home value ready within 24 hours.", 'success');
          form.reset();
        } catch (err) {
          console.error(err);
          showFormMsg(msg, 'Something went wrong. Please call (970) 644-6781.', 'error');
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Get My Orchard Mesa Home Value';
          }
        }
      });
    }
  }

  /* ============================================================
     REDLANDS PAGE
     ============================================================ */
  if (document.body.classList.contains('page-redlands-homes')) {
    loadMarketStats('redlands', {
      htmlCurrency: true,
      areaLabel: 'Redlands',
    });

    const form = document.getElementById('redlandsForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('formBtn');
        const msg = document.getElementById('formMsg');

        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Sending…';
        }

        try {
          await submitToProxy({
            firstName: document.getElementById('fn')?.value.trim() || '',
            lastName: document.getElementById('ln')?.value.trim() || '',
            email: document.getElementById('em')?.value.trim() || '',
            phone: document.getElementById('ph')?.value.trim() || '',
            inquiry: 'Home Value Request — Redlands',
            message:
              'Address: ' + (document.getElementById('addr')?.value.trim() || '') +
              '\nTimeline: ' + (document.getElementById('tl')?.value || '') +
              '\nMonument Views: ' + (document.getElementById('views')?.value || ''),
          });

          showFormMsg(msg, "Thank you! I'll have your Redlands home value ready within 24 hours.", 'success');
          form.reset();
        } catch (err) {
          console.error(err);
          showFormMsg(msg, 'Something went wrong. Please call (970) 644-6781.', 'error');
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Request My Home Value';
          }
        }
      });
    }
  }

  /* ============================================================
     FRUITA PAGE
     ============================================================ */
  if (document.body.classList.contains('page-selling-in-fruita')) {
    loadMarketStats('fruita', {
      areaLabel: 'Fruita',
    });

    const form = document.getElementById('fruitaForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('fruSubmit');
        const msg = document.getElementById('fruFormMsg');

        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Sending…';
        }

        try {
          await submitToProxy({
            firstName: document.getElementById('firstName')?.value.trim() || '',
            lastName: document.getElementById('lastName')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            inquiry: 'Home Value Request — Fruita',
            message:
              'Address: ' + (document.getElementById('address')?.value.trim() || '') +
              '\nTimeline: ' + (document.getElementById('timeline')?.value || '') +
              '\nBedrooms: ' + (document.getElementById('bedrooms')?.value || ''),
          });

          showFormMsg(msg, "Thank you! I'll have your Fruita home value ready within 24 hours.", 'success');
          form.reset();
        } catch (err) {
          console.error(err);
          showFormMsg(msg, 'Something went wrong. Please call (970) 644-6781.', 'error');
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Get My Fruita Home Value';
          }
        }
      });
    }
  }

  /* ============================================================
     PALISADE PAGE
     ============================================================ */
  if (document.body.classList.contains('page-selling-in-palisade')) {
    loadMarketStats('palisade', {
      htmlCurrency: true,
      areaLabel: 'Palisade',
    });

    const form = document.getElementById('palisadeForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('palSubmit');
        const msg = document.getElementById('palFormMsg');

        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Sending…';
        }

        try {
          await submitToProxy({
            firstName: document.getElementById('firstName')?.value.trim() || '',
            lastName: document.getElementById('lastName')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            inquiry: 'Home Value Request — Palisade',
            message:
              'Address: ' + (document.getElementById('address')?.value.trim() || '') +
              '\nNotable features: ' + (document.getElementById('features')?.value.trim() || '') +
              '\nTimeline: ' + (document.getElementById('timeline')?.value || '') +
              '\nBedrooms: ' + (document.getElementById('bedrooms')?.value || ''),
          });

          showFormMsg(msg, "Thank you! I'll have your Palisade home value ready within 24 hours.", 'success');
          form.reset();
        } catch (err) {
          console.error(err);
          showFormMsg(msg, 'Something went wrong. Please call (970) 644-6781.', 'error');
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Get My Palisade Home Value';
          }
        }
      });
    }
  }

  /* ============================================================
     Area pages: stats only
     ============================================================ */
  if (document.body.classList.contains('page-clifton-grand-junction')) {
    loadMarketStats('clifton', { areaLabel: 'ZIP 81520' });
  }

  if (document.body.classList.contains('page-downtown-grand-junction')) {
    loadMarketStats('downtown_grand_junction', { areaLabel: 'ZIP 81501' });
  }

  if (document.body.classList.contains('page-loma-mack-grand-junction')) {
    loadMarketStats('loma_mack', { areaLabel: 'Loma / Mack' });
  }

  if (document.body.classList.contains('page-north-grand-junction')) {
    loadMarketStats('north_grand_junction', { areaLabel: 'North Grand Junction' });
  }

  if (document.body.classList.contains('page-northeast-grand-junction')) {
    loadMarketStats('northeast_grand_junction', { areaLabel: 'Northeast Grand Junction' });
  }

  if (document.body.classList.contains('page-northwest-grand-junction')) {
    loadMarketStats('northwest_grand_junction', { areaLabel: 'Northwest Grand Junction' });
  }

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
/* Grand Junction home value area cards */
body.page-grand-junction-home-value .gj-areas-section {
  background: linear-gradient(180deg, var(--white) 0%, #fcfbf8 100%);
  border-top: 1px solid var(--sand);
  border-bottom: 1px solid var(--sand);
}

body.page-grand-junction-home-value .gj-areas-intro {
  max-width: 760px;
  margin: 0 auto 2rem;
  text-align: center;
}

body.page-grand-junction-home-value .gj-areas-intro .section-label {
  justify-content: center;
  margin-bottom: 1rem;
}

body.page-grand-junction-home-value .gj-areas-intro h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--navy);
}

body.page-grand-junction-home-value .gj-areas-intro p {
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.85;
  margin-top: 0.9rem;
}

body.page-grand-junction-home-value .gj-areas-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

body.page-grand-junction-home-value .gj-area-card {
  display: block;
  text-decoration: none;
  background: var(--white);
  border: 1px solid var(--sand);
  border-radius: 18px;
  padding: 1.25rem 1.2rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
  min-height: 132px;
}

body.page-grand-junction-home-value .gj-area-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(184,146,58,0.55);
  background: rgba(184,146,58,0.05);
}

body.page-grand-junction-home-value .gj-area-card .card-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

body.page-grand-junction-home-value .gj-area-card .card-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: rgba(184,146,58,0.10);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

body.page-grand-junction-home-value .gj-area-card .card-icon svg {
  width: 18px;
  height: 18px;
  stroke: var(--gold);
  stroke-width: 2;
}

body.page-grand-junction-home-value .gj-area-card h3 {
  font-size: 1.25rem;
  color: var(--navy);
  margin: 0;
}

body.page-grand-junction-home-value .gj-area-card p {
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 968px) {
  body.page-grand-junction-home-value .gj-areas-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  body.page-grand-junction-home-value .gj-areas-grid {
    grid-template-columns: 1fr;
  }

  body.page-grand-junction-home-value .gj-area-card {
    min-height: unset;
  }
}
