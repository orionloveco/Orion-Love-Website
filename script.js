/* Auto-generated shared script: original per-page scripts wrapped by body class guards */

document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-about') || document.body.classList.contains('page-buyers') || document.body.classList.contains('page-index') || document.body.classList.contains('page-services'))) return;

if (window.lucide) lucide.createIcons();

  // Mobile menu — body-level overlay to avoid fixed header stacking context
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    // Build overlay element appended directly to body
    const overlay = document.createElement('div');
    overlay.id = 'mobileNavOverlay';
    overlay.innerHTML = navMenu.innerHTML;
    overlay.style.cssText = [
      'display:none',
      'position:fixed',
      'top:0','left:0','right:0','bottom:0',
      'width:100vw','height:100vh',
      'background:rgb(12,26,61)',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:2.5rem',
      'z-index:99999',
      'list-style:none',
      'margin:0','padding:0'
    ].join(';');

    // Style the links inside overlay
    const style = document.createElement('style');
    style.textContent = `
      #mobileNavOverlay a {
        font-size: 1.5rem;
        color: #ffffff;
        text-decoration: none;
        font-family: "Cormorant Garamond", serif;
        font-weight: 400;
        letter-spacing: 0.05em;
        opacity: 0.85;
        transition: opacity 0.2s, color 0.2s;
        display: block;
      }
      #mobileNavOverlay a:hover { opacity: 1; color: #d4aa5a; }
      #mobileNavOverlay li { list-style: none; text-align: center; }
      #mobileNavOverlay .btn-nav {
        border: 1px solid #b8923a;
        padding: 0.6rem 1.8rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-family: "Raleway", sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 600;
        color: #d4aa5a;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const openMenu = () => {
      overlay.style.display = 'flex';
      mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      overlay.style.display = 'none';
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.style.display === 'flex' ? closeMenu() : openMenu();
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => observer.observe(el));
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-clifton-grand-junction'))) return;

if(window.lucide) lucide.createIcons();

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) menu.classList.remove('active');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';
  const AREA_KEY = 'clifton';

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return '$--';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
    if (value >= 1000) return `$${Math.round(value / 1000)}K`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function formatDays(value) {
    if (!Number.isFinite(value)) return '-- days';
    return `${Math.round(value)} days`;
  }

  function formatUpdatedDate(value) {
    if (!value) return 'Live monthly ZIP-level market data for 81520';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Live monthly ZIP-level market data for 81520';
    return `Updated ${parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · ZIP 81520`;
  }

  async function loadMarketStats() {
    try {
      const response = await fetch(MARKET_STATS_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Market stats request failed: ${response.status}`);

      const payload = await response.json();
      const area = payload?.areas?.[AREA_KEY];
      if (!area) throw new Error(`Area key not found: ${AREA_KEY}`);

      const medianEl = document.querySelector('[data-market-stat="medianPrice"]');
      const domEl = document.querySelector('[data-market-stat="averageDaysOnMarket"]');
      const noteEl = document.getElementById('marketNote');

      if (medianEl) medianEl.textContent = formatCurrency(area.medianPrice);
      if (domEl) domEl.textContent = formatDays(area.averageDaysOnMarket);
      if (noteEl) noteEl.textContent = formatUpdatedDate(area.lastUpdatedDate || payload.generatedAt);
    } catch (error) {
      console.error('Unable to load market stats:', error);
      const noteEl = document.getElementById('marketNote');
      if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
    }
  }

  loadMarketStats();
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-contact'))) return;

if (window.lucide) lucide.createIcons();

  // Mobile menu — body-level overlay to avoid fixed header stacking context
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    // Build overlay element appended directly to body
    const overlay = document.createElement('div');
    overlay.id = 'mobileNavOverlay';
    overlay.innerHTML = navMenu.innerHTML;
    overlay.style.cssText = [
      'display:none',
      'position:fixed',
      'top:0','left:0','right:0','bottom:0',
      'width:100vw','height:100vh',
      'background:rgb(12,26,61)',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:2.5rem',
      'z-index:99999',
      'list-style:none',
      'margin:0','padding:0'
    ].join(';');

    // Style the links inside overlay
    const style = document.createElement('style');
    style.textContent = `
      #mobileNavOverlay a {
        font-size: 1.5rem;
        color: #ffffff;
        text-decoration: none;
        font-family: "Cormorant Garamond", serif;
        font-weight: 400;
        letter-spacing: 0.05em;
        opacity: 0.85;
        transition: opacity 0.2s, color 0.2s;
        display: block;
      }
      #mobileNavOverlay a:hover { opacity: 1; color: #d4aa5a; }
      #mobileNavOverlay li { list-style: none; text-align: center; }
      #mobileNavOverlay .btn-nav {
        border: 1px solid #b8923a;
        padding: 0.6rem 1.8rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-family: "Raleway", sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 600;
        color: #d4aa5a;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const openMenu = () => {
      overlay.style.display = 'flex';
      mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      overlay.style.display = 'none';
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.style.display === 'flex' ? closeMenu() : openMenu();
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => observer.observe(el));

  // Contact form
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const requiredIds = ['firstName', 'lastName', 'email', 'message'];
      let valid = true;
      requiredIds.forEach(id => {
        const field = document.getElementById(id);
        if (!field?.value.trim()) { field?.classList.add('error'); valid = false; }
      });
      if (!valid) { showMessage('Please fill in all required fields.', 'error'); return; }

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
          showMessage("Thank you for reaching out. I'll be in touch within 24 hours.", 'success');
          contactForm.reset();
        } else {
          throw new Error(result.error || 'Server error');
        }
      } catch (err) {
        console.error('Form error:', err.message);
        showMessage('Something went wrong. Please call or email me directly at (970) 644-6781.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Start the Conversation';
      }
    });
  }

  function showMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-downtown-grand-junction'))) return;

if(window.lucide) lucide.createIcons();

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) menu.classList.remove('active');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';
  const AREA_KEY = 'downtown_grand_junction';

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return '$--';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
    if (value >= 1000) return `$${Math.round(value / 1000)}K`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function formatDays(value) {
    if (!Number.isFinite(value)) return '-- days';
    return `${Math.round(value)} days`;
  }

  function formatUpdatedDate(value) {
    if (!value) return 'Live monthly ZIP-level market data for 81501';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Live monthly ZIP-level market data for 81501';
    return `Updated ${parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · ZIP 81501`;
  }

  async function loadMarketStats() {
    try {
      const response = await fetch(MARKET_STATS_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Market stats request failed: ${response.status}`);

      const payload = await response.json();
      const area = payload?.areas?.[AREA_KEY];
      if (!area) throw new Error(`Area key not found: ${AREA_KEY}`);

      const medianEl = document.querySelector('[data-market-stat="medianPrice"]');
      const domEl = document.querySelector('[data-market-stat="averageDaysOnMarket"]');
      const noteEl = document.getElementById('marketNote');

      if (medianEl) medianEl.textContent = formatCurrency(area.medianPrice);
      if (domEl) domEl.textContent = formatDays(area.averageDaysOnMarket);
      if (noteEl) noteEl.textContent = formatUpdatedDate(area.lastUpdatedDate || payload.generatedAt);
    } catch (error) {
      console.error('Unable to load market stats:', error);
      const noteEl = document.getElementById('marketNote');
      if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
    }
  }

  loadMarketStats();
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-faq'))) return;

if (window.lucide) lucide.createIcons();

  // Mobile menu — body-level overlay to avoid fixed header stacking context
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    // Build overlay element appended directly to body
    const overlay = document.createElement('div');
    overlay.id = 'mobileNavOverlay';
    overlay.innerHTML = navMenu.innerHTML;
    overlay.style.cssText = [
      'display:none',
      'position:fixed',
      'top:0','left:0','right:0','bottom:0',
      'width:100vw','height:100vh',
      'background:rgb(12,26,61)',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:2.5rem',
      'z-index:99999',
      'list-style:none',
      'margin:0','padding:0'
    ].join(';');

    // Style the links inside overlay
    const style = document.createElement('style');
    style.textContent = `
      #mobileNavOverlay a {
        font-size: 1.5rem;
        color: #ffffff;
        text-decoration: none;
        font-family: "Cormorant Garamond", serif;
        font-weight: 400;
        letter-spacing: 0.05em;
        opacity: 0.85;
        transition: opacity 0.2s, color 0.2s;
        display: block;
      }
      #mobileNavOverlay a:hover { opacity: 1; color: #d4aa5a; }
      #mobileNavOverlay li { list-style: none; text-align: center; }
      #mobileNavOverlay .btn-nav {
        border: 1px solid #b8923a;
        padding: 0.6rem 1.8rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-family: "Raleway", sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 600;
        color: #d4aa5a;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const openMenu = () => {
      overlay.style.display = 'flex';
      mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      overlay.style.display = 'none';
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.style.display === 'flex' ? closeMenu() : openMenu();
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // Tab switching
  const faqTabs = document.querySelectorAll('.faq-tab');
  const faqPanels = document.querySelectorAll('.faq-panel');
  if (faqTabs.length) {
    faqTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.panel;
        faqTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        faqPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        const panel = document.getElementById('panel-' + target);
        if (panel) {
          panel.classList.add('active');
          panel.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
        }
        if (window.lucide) lucide.createIcons();

  // Mobile menu — body-level overlay to avoid fixed header stacking context
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    // Build overlay element appended directly to body
    const overlay = document.createElement('div');
    overlay.id = 'mobileNavOverlay';
    overlay.innerHTML = navMenu.innerHTML;
    overlay.style.cssText = [
      'display:none',
      'position:fixed',
      'top:0','left:0','right:0','bottom:0',
      'width:100vw','height:100vh',
      'background:rgb(12,26,61)',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:2.5rem',
      'z-index:99999',
      'list-style:none',
      'margin:0','padding:0'
    ].join(';');

    // Style the links inside overlay
    const style = document.createElement('style');
    style.textContent = `
      #mobileNavOverlay a {
        font-size: 1.5rem;
        color: #ffffff;
        text-decoration: none;
        font-family: "Cormorant Garamond", serif;
        font-weight: 400;
        letter-spacing: 0.05em;
        opacity: 0.85;
        transition: opacity 0.2s, color 0.2s;
        display: block;
      }
      #mobileNavOverlay a:hover { opacity: 1; color: #d4aa5a; }
      #mobileNavOverlay li { list-style: none; text-align: center; }
      #mobileNavOverlay .btn-nav {
        border: 1px solid #b8923a;
        padding: 0.6rem 1.8rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-family: "Raleway", sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 600;
        color: #d4aa5a;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const openMenu = () => {
      overlay.style.display = 'flex';
      mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      overlay.style.display = 'none';
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.style.display === 'flex' ? closeMenu() : openMenu();
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }
      });
    });
  }

  // One-open accordion
  ['buyers-accordion','sellers-accordion'].forEach(id => {
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

  // Live search
  document.querySelectorAll('.faq-search').forEach(input => {
    const targetId = input.dataset.target;
    const accordion = document.getElementById(targetId);
    const panelKey = targetId?.replace('-accordion','');
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
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-grand-junction-home-value'))) return;

if (window.lucide) lucide.createIcons();

  // Nav scroll
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu
  const toggle = document.getElementById('mobileToggle');
  const menu   = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) menu.classList.remove('active');
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => obs.observe(el));

  // Valuation form
  const valForm   = document.getElementById('valForm');
  const valMsg    = document.getElementById('valFormMsg');
  const valSubmit = document.getElementById('valSubmit');

  valForm?.addEventListener('submit', async e => {
    e.preventDefault();
    valSubmit.disabled = true;
    valSubmit.textContent = 'Sending…';

    const formData = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName:  document.getElementById('lastName').value.trim(),
      email:     document.getElementById('email').value.trim(),
      phone:     document.getElementById('phone').value.trim(),
      inquiry:   'Home Value Request — Grand Junction',
      message: [
        `Address: ${document.getElementById('address').value.trim()}`,
        `Bedrooms: ${document.getElementById('bedrooms').value}`,
        `Timeline: ${document.getElementById('timeline').value}`,
      ].join('\n'),
    };

    try {
      const res = await fetch('https://fub-contact-proxy.orion-love-co.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        valMsg.textContent = "Thank you! I'll have your home value review ready within 24 hours.";
        valMsg.className = 'success';
        valMsg.style.display = 'block';
        valForm.reset();
      } else throw new Error();
    } catch {
      valMsg.textContent = 'Something went wrong. Please call (970) 644-6781.';
      valMsg.className = 'error';
      valMsg.style.display = 'block';
    } finally {
      valSubmit.disabled = false;
      valSubmit.textContent = 'Get My Free Home Value';
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-loma-mack-grand-junction'))) return;

if (window.lucide) lucide.createIcons();

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) menu.classList.remove('active');
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';
  const AREA_KEY = 'loma_mack';

  const formatCurrency = value => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'Unavailable';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDays = value => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'Unavailable';
    return `${Math.round(value)} days`;
  };

  const formatUpdated = value => {
    if (!value) return 'Live market data temporarily unavailable';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Live market data updated recently';
    return `Updated from live market data · ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  async function loadMarketStats() {
    const medianEl = document.getElementById('marketMedianPrice');
    const domEl = document.getElementById('marketDaysOnMarket');
    const noteEl = document.getElementById('marketUpdatedNote');

    try {
      const response = await fetch(MARKET_STATS_URL, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const area = data?.areas?.[AREA_KEY];
      if (!area) throw new Error('Missing area data');

      if (medianEl) medianEl.textContent = formatCurrency(area.medianPrice);
      if (domEl) domEl.textContent = formatDays(area.averageDaysOnMarket);
      if (noteEl) noteEl.textContent = formatUpdated(area.lastUpdatedDate || data.generatedAt);
    } catch (error) {
      if (medianEl) medianEl.textContent = 'Unavailable';
      if (domEl) domEl.textContent = 'Unavailable';
      if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
      console.error('Failed to load market stats:', error);
    }
  }

  loadMarketStats();
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-north-grand-junction'))) return;

if(window.lucide) lucide.createIcons();

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) menu.classList.remove('active');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';
  const AREA_KEY = 'north_grand_junction';

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return '$--';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
    if (value >= 1000) return `$${Math.round(value / 1000)}K`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function formatDays(value) {
    if (!Number.isFinite(value)) return '-- days';
    return `${Math.round(value)} days`;
  }

  function formatUpdatedDate(value) {
    if (!value) return 'Live monthly market data · North Grand Junction';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Live monthly market data · North Grand Junction';
    return `Updated ${parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · North Grand Junction`;
  }

  async function loadMarketStats() {
    try {
      const response = await fetch(MARKET_STATS_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Market stats request failed: ${response.status}`);

      const payload = await response.json();
      const area = payload?.areas?.[AREA_KEY];
      if (!area) throw new Error(`Area key not found: ${AREA_KEY}`);

      const medianEl = document.querySelector('[data-market-stat="medianPrice"]');
      const domEl = document.querySelector('[data-market-stat="averageDaysOnMarket"]');
      const noteEl = document.getElementById('marketNote');

      if (medianEl) medianEl.textContent = formatCurrency(area.medianPrice);
      if (domEl) domEl.textContent = formatDays(area.averageDaysOnMarket);
      if (noteEl) noteEl.textContent = formatUpdatedDate(area.lastUpdatedDate || payload.generatedAt);
    } catch (error) {
      console.error('Unable to load market stats:', error);
      const noteEl = document.getElementById('marketNote');
      if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
    }
  }

  loadMarketStats();
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-northeast-grand-junction'))) return;

if(window.lucide) lucide.createIcons();

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) menu.classList.remove('active');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';
  const AREA_KEY = 'northeast_grand_junction';

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return '$--';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
    if (value >= 1000) return `$${Math.round(value / 1000)}K`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function formatDays(value) {
    if (!Number.isFinite(value)) return '-- days';
    return `${Math.round(value)} days`;
  }

  function formatUpdatedDate(value) {
    if (!value) return 'Live monthly market data · Northeast Grand Junction';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Live monthly market data · Northeast Grand Junction';
    return `Updated ${parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · Northeast Grand Junction`;
  }

  async function loadMarketStats() {
    try {
      const response = await fetch(MARKET_STATS_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Market stats request failed: ${response.status}`);

      const payload = await response.json();
      const area = payload?.areas?.[AREA_KEY];
      if (!area) throw new Error(`Area key not found: ${AREA_KEY}`);

      const medianEl = document.querySelector('[data-market-stat="medianPrice"]');
      const domEl = document.querySelector('[data-market-stat="averageDaysOnMarket"]');
      const noteEl = document.getElementById('marketNote');

      if (medianEl) medianEl.textContent = formatCurrency(area.medianPrice);
      if (domEl) domEl.textContent = formatDays(area.averageDaysOnMarket);
      if (noteEl) noteEl.textContent = formatUpdatedDate(area.lastUpdatedDate || payload.generatedAt);
    } catch (error) {
      console.error('Unable to load market stats:', error);
      const noteEl = document.getElementById('marketNote');
      if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
    }
  }

  loadMarketStats();
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-northwest-grand-junction'))) return;

if(window.lucide) lucide.createIcons();

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) menu.classList.remove('active');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';
  const AREA_KEY = 'northwest_grand_junction';

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return '$--';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
    if (value >= 1000) return `$${Math.round(value / 1000)}K`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function formatDays(value) {
    if (!Number.isFinite(value)) return '-- days';
    return `${Math.round(value)} days`;
  }

  function formatUpdatedDate(value) {
    if (!value) return 'Live monthly market data · Northwest Grand Junction';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Live monthly market data · Northwest Grand Junction';
    return `Updated ${parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · Northwest Grand Junction`;
  }

  async function loadMarketStats() {
    try {
      const response = await fetch(MARKET_STATS_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Market stats request failed: ${response.status}`);

      const payload = await response.json();
      const area = payload?.areas?.[AREA_KEY];
      if (!area) throw new Error(`Area key not found: ${AREA_KEY}`);

      const medianEl = document.querySelector('[data-market-stat="medianPrice"]');
      const domEl = document.querySelector('[data-market-stat="averageDaysOnMarket"]');
      const noteEl = document.getElementById('marketNote');

      if (medianEl) medianEl.textContent = formatCurrency(area.medianPrice);
      if (domEl) domEl.textContent = formatDays(area.averageDaysOnMarket);
      if (noteEl) noteEl.textContent = formatUpdatedDate(area.lastUpdatedDate || payload.generatedAt);
    } catch (error) {
      console.error('Unable to load market stats:', error);
      const noteEl = document.getElementById('marketNote');
      if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
    }
  }

  loadMarketStats();
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-orchard-mesa-homes'))) return;

if(window.lucide)lucide.createIcons();
  const header=document.getElementById('mainHeader');
  window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>40),{passive:true});
  const toggle=document.getElementById('mobileToggle'),menu=document.getElementById('navMenu');
  toggle?.addEventListener('click',()=>menu.classList.toggle('active'));
  document.addEventListener('click',e=>{if(!header.contains(e.target))menu.classList.remove('active');});
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}}),{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';
  const ORCHARD_MESA_AREA_KEY = 'orchard_mesa';

  const formatCompactCurrency = value => {
    if (!Number.isFinite(value)) return '--';
    const rounded = Math.round(value);
    if (rounded >= 1000000) return `<span>$</span>${(rounded / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (rounded >= 1000) return `<span>$</span>${Math.round(rounded / 1000)}K`;
    return `<span>$</span>${rounded}`;
  };

  const formatNumber = value => Number.isFinite(value) ? Math.round(value).toLocaleString() : '--';

  (async () => {
    try {
      const res = await fetch(MARKET_STATS_URL, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`Stats request failed: ${res.status}`);
      const data = await res.json();
      const area = data?.areas?.[ORCHARD_MESA_AREA_KEY];
      if (!area) throw new Error('Orchard Mesa area data missing');

      const medianPriceEl = document.getElementById('omMedianPrice');
      const daysOnMarketEl = document.getElementById('omDaysOnMarket');
      const newListingsEl = document.getElementById('omNewListings');
      const totalListingsEl = document.getElementById('omTotalListings');
      const updatedEl = document.getElementById('omStatsUpdated');

      if (medianPriceEl) medianPriceEl.innerHTML = formatCompactCurrency(area.medianPrice);
      if (daysOnMarketEl) daysOnMarketEl.textContent = formatNumber(area.averageDaysOnMarket);
      if (newListingsEl) newListingsEl.textContent = formatNumber(area.newListings);
      if (totalListingsEl) totalListingsEl.textContent = formatNumber(area.totalListings);

      if (updatedEl) {
        const lastUpdated = area.lastUpdatedDate || data.generatedAt;
        const formattedDate = lastUpdated
          ? new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : null;
        updatedEl.textContent = formattedDate
          ? `Live Orchard Mesa market data · Updated ${formattedDate}`
          : 'Live Orchard Mesa market data';
      }
    } catch (error) {
      console.error('Failed to load Orchard Mesa market stats:', error);
      const updatedEl = document.getElementById('omStatsUpdated');
      if (updatedEl) updatedEl.textContent = 'Live market data temporarily unavailable';
    }
  })();
  document.getElementById('omForm')?.addEventListener('submit',async e=>{
    e.preventDefault();const btn=document.getElementById('formBtn'),msg=document.getElementById('formMsg');
    btn.disabled=true;btn.textContent='Sending…';
    try{const res=await fetch('https://fub-contact-proxy.orion-love-co.workers.dev',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({firstName:document.getElementById('fn').value.trim(),lastName:document.getElementById('ln').value.trim(),email:document.getElementById('em').value.trim(),phone:document.getElementById('ph').value.trim(),inquiry:'Home Value Request — Orchard Mesa',message:`Address: ${document.getElementById('addr').value.trim()}\nTimeline: ${document.getElementById('tl').value}\nRiver View: ${document.getElementById('rv').value}`})});
    const data=await res.json().catch(()=>({}));
    if(res.ok&&data.success){msg.textContent="Thank you! I'll have your Orchard Mesa home value ready within 24 hours.";msg.className='success';msg.style.display='block';e.target.reset();}else throw new Error();
  } catch {
    msg.textContent = "Something went wrong. Please call (970) 644-6781.";
    msg.className = 'error';
    msg.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Get My Orchard Mesa Home Value';
  }
});
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-redlands-homes'))) return;

if (window.lucide) lucide.createIcons();
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
  const toggle = document.getElementById('mobileToggle'), menu = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', e => { if (!header.contains(e.target)) menu.classList.remove('active'); });
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }), { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  async function loadRedlandsMarketStats() {
    const endpoint = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';
    const noteEl = document.getElementById('redlandsStatsNote');

    const formatCurrency = value => {
      if (!Number.isFinite(value)) return '—';
      const rounded = Math.round(value);
      if (rounded >= 1000) return `<span>$</span>${(rounded / 1000).toFixed(0)}K`;
      return `<span>$</span>${rounded}`;
    };

    const formatNumber = value => Number.isFinite(value) ? Math.round(value).toLocaleString() : '—';

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch market stats');

      const data = await res.json();
      const stats = data?.areas?.redlands;
      if (!stats) throw new Error('Redlands stats not found');

      const medianEl = document.getElementById('redlandsMedianPrice');
      const domEl = document.getElementById('redlandsDaysOnMarket');
      const newListingsEl = document.getElementById('redlandsNewListings');
      const totalListingsEl = document.getElementById('redlandsTotalListings');

      if (medianEl) medianEl.innerHTML = formatCurrency(stats.medianPrice);
      if (domEl) domEl.textContent = formatNumber(stats.averageDaysOnMarket);
      if (newListingsEl) newListingsEl.textContent = formatNumber(stats.newListings);
      if (totalListingsEl) totalListingsEl.textContent = formatNumber(stats.totalListings);

      if (noteEl) {
        const updated = stats.lastUpdatedDate || data.generatedAt;
        const formatted = updated ? new Date(updated).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'recently';
        noteEl.textContent = `Live Redlands market data updated ${formatted}`;
      }
    } catch (error) {
      if (noteEl) noteEl.textContent = 'Live market data temporarily unavailable';
    }
  }

  loadRedlandsMarketStats();

  document.getElementById('redlandsForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('formBtn'), msg = document.getElementById('formMsg');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://fub-contact-proxy.orion-love-co.workers.dev', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: document.getElementById('fn').value.trim(), lastName: document.getElementById('ln').value.trim(), email: document.getElementById('em').value.trim(), phone: document.getElementById('ph').value.trim(), inquiry: 'Home Value Request — Redlands', message: `Address: ${document.getElementById('addr').value.trim()}\nTimeline: ${document.getElementById('tl').value}\nMonument Views: ${document.getElementById('views').value}` })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) { msg.textContent = "Thank you! I'll have your Redlands home value ready within 24 hours."; msg.className = 'success'; msg.style.display = 'block'; e.target.reset(); }
      else throw new Error();
    } catch {
      msg.textContent = "Something went wrong. Please call (970) 644-6781.";
      msg.className = 'error';
      msg.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Request My Home Value';
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-selling-in-fruita'))) return;

if (window.lucide) lucide.createIcons();

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

  const toggle = document.getElementById('mobileToggle');
  const menu   = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', e => { if (!header.contains(e.target)) menu.classList.remove('active'); });

  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => obs.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';

  const formatCurrency = value => {
    if (!Number.isFinite(value)) return '--';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const formatNumber = value => Number.isFinite(value) ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value) : '--';

  async function loadFruitaMarketStats() {
    const medianEl = document.getElementById('fruitaMedianSalePrice');
    const domEl = document.getElementById('fruitaDaysOnMarket');
    const newEl = document.getElementById('fruitaNewListings');
    const totalEl = document.getElementById('fruitaTotalListings');
    const noteEl = document.getElementById('fruitaMarketNote');

    try {
      const res = await fetch(MARKET_STATS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load market data');
      const data = await res.json();
      const area = data?.areas?.fruita;
      if (!area) throw new Error('Fruita market data not found');

      medianEl.textContent = formatCurrency(area.medianPrice);
      domEl.textContent = formatNumber(area.averageDaysOnMarket);
      newEl.textContent = formatNumber(area.newListings);
      totalEl.textContent = formatNumber(area.totalListings);

      const updated = area.lastUpdatedDate || data.generatedAt;
      if (updated) {
        const date = new Date(updated);
        noteEl.textContent = `Live market data · updated ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
      } else {
        noteEl.textContent = 'Live market data';
      }
    } catch (error) {
      medianEl.textContent = '--';
      domEl.textContent = '--';
      newEl.textContent = '--';
      totalEl.textContent = '--';
      noteEl.textContent = 'Live market data temporarily unavailable';
    }
  }

  loadFruitaMarketStats();

  // Form
  const fruitaForm = document.getElementById('fruitaForm');
  const fruMsg     = document.getElementById('fruFormMsg');
  const fruSubmit  = document.getElementById('fruSubmit');

  fruitaForm?.addEventListener('submit', async e => {
    e.preventDefault();
    fruSubmit.disabled = true;
    fruSubmit.textContent = 'Sending…';

    const formData = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName:  document.getElementById('lastName').value.trim(),
      email:     document.getElementById('email').value.trim(),
      phone:     document.getElementById('phone').value.trim(),
      inquiry:   'Home Value Request — Fruita',
      message: [
        `Address: ${document.getElementById('address').value.trim()}`,
        `Timeline: ${document.getElementById('timeline').value}`,
        `Bedrooms: ${document.getElementById('bedrooms').value}`,
      ].join('\n'),
    };

    try {
      const res  = await fetch('https://fub-contact-proxy.orion-love-co.workers.dev', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        fruMsg.textContent = "Thank you! I'll have your Fruita home value ready within 24 hours.";
        fruMsg.className = 'success'; fruMsg.style.display = 'block';
        fruitaForm.reset();
      } else throw new Error();
    } catch {
      fruMsg.textContent = 'Something went wrong. Please call (970) 644-6781.';
        fruMsg.className = 'error'; fruMsg.style.display = 'block';
    } finally {
      fruSubmit.disabled = false;
      fruSubmit.textContent = 'Get My Fruita Home Value';
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  if (!document.body) return;
  if (!(document.body.classList.contains('page-selling-in-palisade'))) return;

if (window.lucide) lucide.createIcons();

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

  const toggle = document.getElementById('mobileToggle');
  const menu   = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));
  document.addEventListener('click', e => { if (!header.contains(e.target)) menu.classList.remove('active'); });

  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => obs.observe(el));

  const MARKET_STATS_URL = 'https://orion-market-stats.orion-love-co.workers.dev/api/market-stats';

  const formatCurrencyCompact = value => {
    if (!Number.isFinite(value)) return '--';
    const rounded = Math.round(value);
    if (rounded >= 1000000) return `<span>$</span>${(rounded / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    return `<span>$</span>${Math.round(rounded / 1000)}K`;
  };

  const formatNumber = value => Number.isFinite(value) ? String(Math.round(value)) : '--';

  (async () => {
    const updatedEl = document.getElementById('palisadeMarketUpdated');
    try {
      const res = await fetch(MARKET_STATS_URL, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('Feed request failed');
      const data = await res.json();
      const area = data?.areas?.palisade;
      if (!area) throw new Error('Palisade data missing');

      const medianEl = document.getElementById('palMedianPrice');
      const domEl = document.getElementById('palAvgDom');
      const newListingsEl = document.getElementById('palNewListings');
      const totalListingsEl = document.getElementById('palTotalListings');

      if (medianEl) medianEl.innerHTML = formatCurrencyCompact(area.medianPrice);
      if (domEl) domEl.textContent = formatNumber(area.averageDaysOnMarket);
      if (newListingsEl) newListingsEl.textContent = formatNumber(area.newListings);
      if (totalListingsEl) totalListingsEl.textContent = formatNumber(area.totalListings);

      if (updatedEl) {
        const updatedDate = area.lastUpdatedDate || data.generatedAt;
        const prettyDate = updatedDate
          ? new Date(updatedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'latest refresh';
        updatedEl.textContent = `Live market data updated ${prettyDate}`;
      }
    } catch (error) {
      if (updatedEl) updatedEl.textContent = 'Live market data temporarily unavailable';
    }
  })();

  const palisadeForm = document.getElementById('palisadeForm');
  const palMsg       = document.getElementById('palFormMsg');
  const palSubmit    = document.getElementById('palSubmit');

  palisadeForm?.addEventListener('submit', async e => {
    e.preventDefault();
    palSubmit.disabled = true;
    palSubmit.textContent = 'Sending…';

    const formData = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName:  document.getElementById('lastName').value.trim(),
      email:     document.getElementById('email').value.trim(),
      phone:     document.getElementById('phone').value.trim(),
      inquiry:   'Home Value Request — Palisade',
      message: [
        `Address: ${document.getElementById('address').value.trim()}`,
        `Notable features: ${document.getElementById('features').value.trim()}`,
        `Timeline: ${document.getElementById('timeline').value}`,
        `Bedrooms: ${document.getElementById('bedrooms').value}`,
      ].join('\n'),
    };

    try {
      const res  = await fetch('https://fub-contact-proxy.orion-love-co.workers.dev', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        palMsg.textContent = "Thank you! I'll have your Palisade home value ready within 24 hours.";
        palMsg.className = 'success'; palMsg.style.display = 'block';
        palisadeForm.reset();
      } else throw new Error();
    } catch {
      palMsg.textContent = 'Something went wrong. Please call (970) 644-6781.';
        palMsg.className = 'error'; palMsg.style.display = 'block';
    } finally {
      palSubmit.disabled = false;
      palSubmit.textContent = 'Get My Palisade Home Value';
    }
  });
});
