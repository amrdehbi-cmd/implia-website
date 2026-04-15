/* ============================================================
   ImplIA — script.js
   Features:
   - Bilingual toggle (FR / EN) — data-fr / data-en attributes
   - Sticky navbar with scrolled state
   - Mobile hamburger menu
   - Reveal-on-scroll animations (IntersectionObserver)
   - Active nav link tracking
   - Smooth anchor scroll with offset
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   1. LANGUAGE SYSTEM
   All translatable elements carry:
     data-fr="French text"
     data-en="English text"
   The toggle switches between the two.
────────────────────────────────────────────── */
const LANG_KEY = 'implia_lang';

let currentLang = localStorage.getItem(LANG_KEY) || 'fr';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update page title
  document.title = lang === 'fr'
    ? 'ImplIA — Automatisation IA pour entreprises'
    : 'ImplIA — AI Automation for Businesses';

  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', lang === 'fr'
      ? 'ImplIA implémente des solutions d\'intelligence artificielle sur mesure pour automatiser les processus des PME et augmenter leur productivité.'
      : 'ImplIA implements custom artificial intelligence solutions to automate SMB processes and increase productivity.'
    );
  }

  // Translate all elements with data-fr / data-en
  document.querySelectorAll('[data-fr][data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      // Handle input placeholders differently
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // Update toggle UI
  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
}

function initLanguage() {
  const toggle = document.getElementById('lang-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const next = currentLang === 'fr' ? 'en' : 'fr';
    applyLanguage(next);
  });

  // Apply on load (restores from localStorage or defaults to FR)
  applyLanguage(currentLang);
}


/* ──────────────────────────────────────────────
   2. STICKY HEADER
────────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ──────────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
────────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const nav  = document.getElementById('main-nav');
  if (!btn || !nav) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    nav.classList.add('nav-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen = false;
    nav.classList.remove('nav-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => isOpen ? close() : open());

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (isOpen && !nav.contains(e.target) && !btn.contains(e.target)) close();
  });

  // Close on resize past breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && isOpen) close();
  });
}


/* ──────────────────────────────────────────────
   4. REVEAL ON SCROLL
   Elements with class .reveal animate in
   when they enter the viewport.
────────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Stagger sibling .reveal elements in the same parent
  const parents = new Set();
  els.forEach(el => parents.add(el.parentElement));
  parents.forEach(parent => {
    const children = parent.querySelectorAll(':scope > .reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  els.forEach(el => io.observe(el));
}


/* ──────────────────────────────────────────────
   5. ACTIVE NAV LINK
   Highlights the nav link matching the
   visible section.
────────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(s => io.observe(s));
}


/* ──────────────────────────────────────────────
   6. SMOOTH SCROLL WITH NAV OFFSET
────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header = document.getElementById('site-header');
      const offset = header ? header.offsetHeight + 12 : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ──────────────────────────────────────────────
   7. METRIC CARDS — subtle entrance stagger
   (hero section metrics)
────────────────────────────────────────────── */
function initMetricCards() {
  const cards = document.querySelectorAll('.metric-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    card.style.transition = `opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)`;
    card.style.transitionDelay = `${400 + i * 100}ms`;
    // Trigger after a tick so the initial state is painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  });
}


/* ──────────────────────────────────────────────
   8. HERO TEXT — line-by-line entrance
────────────────────────────────────────────── */
function initHeroEntrance() {
  const elements = document.querySelectorAll('.eyebrow, .hero-heading .line, .hero-body, .hero-actions');
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 600ms cubic-bezier(0.22,1,0.36,1)`;
    el.style.transitionDelay = `${i * 90}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}


/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initHeader();
  initMobileMenu();
  initReveal();
  initActiveNav();
  initSmoothScroll();
  initMetricCards();
  initHeroEntrance();
});
