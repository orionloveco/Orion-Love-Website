/* ============================================================
   Orion Love Real Estate — Shared Script
   All pages load this file. Logic is organized by:
   1. Shared utilities (run everywhere)
   2. Page-specific blocks (guarded by body class)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  document.documentElement.classList.add('js');

  // ── Page identity fallback ─────────────────────────────────
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const pageSlug = path.replace(/\.html?$/i, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
  if (pageSlug) document.body.classList.add('page-' + pageSlug);


  // ── Lucide icons ─────────────────────────────────────────
  if (window.lucide) lucide.createIcons();

  // ── Scroll reveal ─────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Scroll header ─────────────────────────────────────────
  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Mobile nav overlay (all pages) ───────────────────────
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
      overlay.style.display === 'flex' ? closeMenu() : openMenu();
    });
    overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }


  // ── Market stats shared loader ─────────────────────────────
  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return '$--';
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    if (value >= 1000) return '$' + Math.round(value / 1000) + 'K';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function formatCurrencyHTML(value) {
    if (!Number.isFinite(value)) return '--';
    const rounded = Math.round(value);
    if (rounded >= 1000000) return '<span>$</span>' + (rounded / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (rounded >= 1000) return '<span>$</span>' + Math.round(rounded / 1000) + 'K';
    return '<span>$</span>' + rounded;
  }

  function formatDays(value) {
    return Number.isFinite(value) ? Math.round(value) + ' days' : '-- days';
  }

  function formatNumber(value) {
    return Number.isFinite(value) ? Math.round(value).toLocaleString() : '--';
  }

  function formatUpdatedDate(value, areaLabel) {
    const label = areaLabel ? ' · ' + areaLabel : '';
    if (!value) return 'Live market data' + label;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Live market data' + label;
    return 'Updated ' + parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + label;
  }

  async function loadMarketStats(areaKey, opts) {
    opts = opts || {};
    try {
      const res = await fetch(MARKET_STATS_URL, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const area = data?.areas?.[areaKey];
      if (!area) throw new Error('Area not found: ' + areaKey);

      const medianEls = document.querySelectorAll('[data-market-stat="medianPrice"], #marketMedianPrice, #omMedianPrice, #redlandsMedianPrice, #palMedianPrice, #fruitaMedianSalePrice');
      const domEls    = document.querySelectorAll('[data-market-stat="averageDaysOnMarket"], #marketDaysOnMarket, #omDaysOnMarket, #redlandsDaysOnMarket, #palAvgDom, #fruitaDaysOnMarket');
      const newEls    = document.querySelectorAll('#omNewListings, #redlandsNewListings, #palNewListings, #fruitaNewListings');
      const totalEls  = document.querySelectorAll('#omTotalListings, #redlandsTotalListings, #palTotalListings, #fruitaTotalListings');
      const noteEls   = document.querySelectorAll('#marketNote, #marketUpdatedNote, #omStatsUpdated, #redlandsStatsNote, #palisadeMarketUpdated, #fruitaMarketNote');

      medianEls.forEach(el => {
        if (opts.htmlCurrency) el.innerHTML = formatCurrencyHTML(area.medianPrice);
        else el.textContent = formatCurrency(area.medianPrice);
      });
      domEls.forEach(el   => el.textContent = formatDays(area.averageDaysOnMarket));
      newEls.forEach(el   => el.textContent = formatNumber(area.newListings));
      totalEls.forEach(el => el.textContent = formatNumber(area.totalListings));

      const updated = area.lastUpdatedDate || data.generatedAt;
      noteEls.forEach(el  => el.textContent = formatUpdatedDate(updated, opts.areaLabel));

    } catch (err) {
      console.error('Market stats load failed:', err);
      const noteEls = document.querySelectorAll('#marketNote, #marketUpdatedNote, #omStatsUpdated, #redlandsStatsNote, #palisadeMarketUpdated, #fruitaMarketNote');
      noteEls.forEach(el => el.textContent = 'Live market data temporarily unavailable');
    }
  }


  // ── Shared form proxy submit ───────────────────────────────
  const PROXY_URL = 'https://fub-contact-proxy.orion-love-co.workers.dev';

  async function submitToProxy(formData) {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(data.error || 'Server error');
    return data;
  }

  function showFormMsg(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = type;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }


  // ── PAGE: contact ─────────────────────────────────────────
  if (document.body.classList.contains('page-contact')) {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn   = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let valid = true;
        ['firstName', 'lastName', 'email', 'message'].forEach(id => {
          const field = document.getElementById(id);
          if (!field?.value.trim()) { field?.classList.add('error'); valid = false; }
        });
        if (!valid) { showFormMsg(formMessage, 'Please fill in all required fields.', 'form-message error'); return; }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        try {
          await submitToProxy({
            firstName: document.getElementById('firstName')?.value.trim(),
            lastName:  document.getElementById('lastName')?.value.trim(),
            email:     document.getElementById('email')?.value.trim(),
            phone:     document.getElementById('phone')?.value.trim() || '',
            inquiry:   document.getElementById('inquiry')?.value || '',
            message:   document.getElementById('message')?.value.trim(),
          });
          showFormMsg(formMessage, "Thank you for reaching out. I'll be in touch within 24 hours.", 'form-message success');
          contactForm.reset();
        } catch {
          showFormMsg(formMessage, 'Something went wrong. Please call or email me directly at (970) 644-6781.', 'form-message error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Start the Conversation';
        }
      });
    }
  }


  // ── PAGE: grand-junction-home-value ──────────────────────
if (document.body.classList.contains('page-grand-junction-home-value')) {

  // Load Grand Junction market stats
  (async function loadGrandJunctionStats() {
    try {
      const res = await fetch(MARKET_STATS_URL, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      // Try a few possible area keys in case your worker uses a slightly different name
      const area =
        data?.areas?.grand_junction ||
        data?.areas?.grandJunction ||
        data?.areas?.grand_junction_home_value ||
        data?.areas?.grand_junction_city;

      if (!area) throw new Error('Grand Junction area not found in API response');

      const medianEl = document.getElementById('gjMedianListPrice');
      const domEl = document.getElementById('gjAvgDom');
      const newEl = document.getElementById('gjNewListings');
      const activeEl = document.getElementById('gjActiveListings');
      const metaEl = document.getElementById('gjStatsMeta');

      if (medianEl) medianEl.innerHTML = formatCurrencyHTML(area.medianPrice ?? area.medianListPrice);
      if (domEl) domEl.textContent = formatNumber(area.averageDaysOnMarket ?? area.avgDaysOnMarket ?? area.daysOnMarket);
      if (newEl) newEl.textContent = formatNumber(area.newListings);
      if (activeEl) activeEl.textContent = formatNumber(area.totalListings ?? area.activeListings);

      const updated = area.lastUpdatedDate || data.generatedAt;
      if (metaEl) metaEl.textContent = formatUpdatedDate(updated, 'Grand Junction');
    } catch (err) {
      console.error('Grand Junction stats load failed:', err);
      const metaEl = document.getElementById('gjStatsMeta');
      if (metaEl) metaEl.textContent = 'Monthly snapshot temporarily unavailable';
    }
  })();

  const valForm   = document.getElementById('valForm');
  const valMsg    = document.getElementById('valFormMsg');
  const valSubmit = document.getElementById('valSubmit');

  valForm?.addEventListener('submit', async e => {
    e.preventDefault();
    valSubmit.disabled = true;
    valSubmit.textContent = 'Sending…';
    try {
      await submitToProxy({
        firstName: document.getElementById('firstName').value.trim(),
        lastName:  document.getElementById('lastName').value.trim(),
        email:     document.getElementById('email').value.trim(),
        phone:     document.getElementById('phone').value.trim(),
        inquiry:   'Home Value Request — Grand Junction',
        message:   'Address: ' + document.getElementById('address').value.trim()
                 + '\nBedrooms: ' + document.getElementById('bedrooms').value
                 + '\nTimeline: ' + document.getElementById('timeline').value,
      });
      showFormMsg(valMsg, "Thank you! I'll have your home value review ready within 24 hours.", 'success');
      valForm.reset();
    } catch {
      showFormMsg(valMsg, 'Something went wrong. Please call (970) 644-6781.', 'error');
    } finally {
      valSubmit.disabled = false;
      valSubmit.textContent = 'Get My Free Home Value';
    }
  });
}
   
  if (document.body.classList.contains('page-grand-junction-home-value')) {
    const valForm   = document.getElementById('valForm');
    const valMsg    = document.getElementById('valFormMsg');
    const valSubmit = document.getElementById('valSubmit');

    valForm?.addEventListener('submit', async e => {
      e.preventDefault();
      valSubmit.disabled = true; valSubmit.textContent = 'Sending…';
      try {
        await submitToProxy({
          firstName: document.getElementById('firstName').value.trim(),
          lastName:  document.getElementById('lastName').value.trim(),
          email:     document.getElementById('email').value.trim(),
          phone:     document.getElementById('phone').value.trim(),
          inquiry:   'Home Value Request — Grand Junction',
          message:   'Address: ' + document.getElementById('address').value.trim()
                   + '\nBedrooms: ' + document.getElementById('bedrooms').value
                   + '\nTimeline: ' + document.getElementById('timeline').value,
        });
        showFormMsg(valMsg, "Thank you! I'll have your home value review ready within 24 hours.", 'success');
        valForm.reset();
      } catch {
        showFormMsg(valMsg, 'Something went wrong. Please call (970) 644-6781.', 'error');
      } finally {
        valSubmit.disabled = false; valSubmit.textContent = 'Get My Free Home Value';
      }
    });
  }


  // ── PAGE: faq ────────────────────────────────────────────
  if (document.body.classList.contains('page-faq')) {
    const faqTabs   = document.querySelectorAll('.faq-tab');
    const faqPanels = document.querySelectorAll('.faq-panel');

    faqTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.panel;
        faqTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        faqPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panel = document.getElementById('panel-' + target);
        if (panel) {
          panel.classList.add('active');
          panel.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
        }
        if (window.lucide) lucide.createIcons();
      });
    });

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

    document.querySelectorAll('.faq-search').forEach(input => {
      const accordion = document.getElementById(input.dataset.target);
      const panelKey  = input.dataset.target?.replace('-accordion', '');
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
  }


  // ── PAGE: orchard-mesa-homes ─────────────────────────────
  if (document.body.classList.contains('page-orchard-mesa-homes')) {
    loadMarketStats('orchard_mesa', { htmlCurrency: true, areaLabel: 'Orchard Mesa' });
    document.getElementById('omForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('formBtn'), msg = document.getElementById('formMsg');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        await submitToProxy({
          firstName: document.getElementById('fn').value.trim(),
          lastName:  document.getElementById('ln').value.trim(),
          email:     document.getElementById('em').value.trim(),
          phone:     document.getElementById('ph').value.trim(),
          inquiry:   'Home Value Request — Orchard Mesa',
          message:   'Address: ' + document.getElementById('addr').value.trim()
                   + '\nTimeline: ' + document.getElementById('tl').value
                   + '\nRiver View: ' + document.getElementById('rv').value,
        });
        showFormMsg(msg, "Thank you! I'll have your Orchard Mesa home value ready within 24 hours.", 'success');
        e.target.reset();
      } catch { showFormMsg(msg, 'Something went wrong. Please call (970) 644-6781.', 'error'); }
      finally { btn.disabled = false; btn.textContent = 'Get My Orchard Mesa Home Value'; }
    });
  }


  // ── PAGE: redlands-homes ─────────────────────────────────
  if (document.body.classList.contains('page-redlands-homes')) {
    loadMarketStats('redlands', { htmlCurrency: true, areaLabel: 'Redlands' });
    document.getElementById('redlandsForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('formBtn'), msg = document.getElementById('formMsg');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        await submitToProxy({
          firstName: document.getElementById('fn').value.trim(),
          lastName:  document.getElementById('ln').value.trim(),
          email:     document.getElementById('em').value.trim(),
          phone:     document.getElementById('ph').value.trim(),
          inquiry:   'Home Value Request — Redlands',
          message:   'Address: ' + document.getElementById('addr').value.trim()
                   + '\nTimeline: ' + document.getElementById('tl').value
                   + '\nMonument Views: ' + document.getElementById('views').value,
        });
        showFormMsg(msg, "Thank you! I'll have your Redlands home value ready within 24 hours.", 'success');
        e.target.reset();
      } catch { showFormMsg(msg, 'Something went wrong. Please call (970) 644-6781.', 'error'); }
      finally { btn.disabled = false; btn.textContent = 'Request My Home Value'; }
    });
  }


  // ── PAGE: selling-in-fruita ──────────────────────────────
  if (document.body.classList.contains('page-selling-in-fruita')) {
    loadMarketStats('fruita', { areaLabel: 'Fruita' });
    document.getElementById('fruitaForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('fruSubmit'), msg = document.getElementById('fruFormMsg');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        await submitToProxy({
          firstName: document.getElementById('firstName').value.trim(),
          lastName:  document.getElementById('lastName').value.trim(),
          email:     document.getElementById('email').value.trim(),
          phone:     document.getElementById('phone').value.trim(),
          inquiry:   'Home Value Request — Fruita',
          message:   'Address: ' + document.getElementById('address').value.trim()
                   + '\nTimeline: ' + document.getElementById('timeline').value
                   + '\nBedrooms: ' + document.getElementById('bedrooms').value,
        });
        showFormMsg(msg, "Thank you! I'll have your Fruita home value ready within 24 hours.", 'success');
        e.target.reset();
      } catch { showFormMsg(msg, 'Something went wrong. Please call (970) 644-6781.', 'error'); }
      finally { btn.disabled = false; btn.textContent = 'Get My Fruita Home Value'; }
    });
  }


  // ── PAGE: selling-in-palisade ─────────────────────────────
  if (document.body.classList.contains('page-selling-in-palisade')) {
    loadMarketStats('palisade', { htmlCurrency: true, areaLabel: 'Palisade' });
    document.getElementById('palisadeForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('palSubmit'), msg = document.getElementById('palFormMsg');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        await submitToProxy({
          firstName: document.getElementById('firstName').value.trim(),
          lastName:  document.getElementById('lastName').value.trim(),
          email:     document.getElementById('email').value.trim(),
          phone:     document.getElementById('phone').value.trim(),
          inquiry:   'Home Value Request — Palisade',
          message:   'Address: ' + document.getElementById('address').value.trim()
                   + '\nNotable features: ' + document.getElementById('features').value.trim()
                   + '\nTimeline: ' + document.getElementById('timeline').value
                   + '\nBedrooms: ' + document.getElementById('bedrooms').value,
        });
        showFormMsg(msg, "Thank you! I'll have your Palisade home value ready within 24 hours.", 'success');
        e.target.reset();
      } catch { showFormMsg(msg, 'Something went wrong. Please call (970) 644-6781.', 'error'); }
      finally { btn.disabled = false; btn.textContent = 'Get My Palisade Home Value'; }
    });
  }


  // ── Area pages: market stats only ────────────────────────
  if (document.body.classList.contains('page-clifton-grand-junction'))
    loadMarketStats('clifton', { areaLabel: 'ZIP 81520' });

  if (document.body.classList.contains('page-downtown-grand-junction'))
    loadMarketStats('downtown_grand_junction', { areaLabel: 'ZIP 81501' });

  if (document.body.classList.contains('page-loma-mack-grand-junction'))
    loadMarketStats('loma_mack', { areaLabel: 'Loma / Mack' });

  if (document.body.classList.contains('page-north-grand-junction'))
    loadMarketStats('north_grand_junction', { areaLabel: 'North Grand Junction' });

  if (document.body.classList.contains('page-northeast-grand-junction'))
    loadMarketStats('northeast_grand_junction', { areaLabel: 'Northeast Grand Junction' });

  if (document.body.classList.contains('page-northwest-grand-junction'))
    loadMarketStats('northwest_grand_junction', { areaLabel: 'Northwest Grand Junction' });

});
