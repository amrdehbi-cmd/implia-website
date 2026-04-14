/* =============================================
   ImplIA — script.js
   Fonctionnalités : navbar scroll, hamburger menu,
   animations fade-in, smooth scroll
   ============================================= */

/* ── 1. Navbar : effet scroll ── */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // état initial


/* ── 2. Hamburger menu mobile ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Fermer le menu si on clique sur un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Fermer le menu si on clique en dehors
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }
});


/* ── 3. Animations Fade-in au scroll (Intersection Observer) ── */
const fadeEls = document.querySelectorAll('.fade-in');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px', // déclenche 80px avant le bas de fenêtre
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Petit délai en cascade pour les éléments groupés
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target); // animer une seule fois
    }
  });
}, observerOptions);

// Ajouter un délai en cascade aux cartes dans les grilles
document.querySelectorAll('.problem-grid .fade-in, .solutions-grid .fade-in, .benefits-grid .fade-in').forEach((el, i) => {
  el.dataset.delay = i * 120; // 120ms entre chaque carte
});

fadeEls.forEach(el => observer.observe(el));


/* ── 4. Smooth scroll pour les ancres ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

    window.scrollTo({
      top: targetPos,
      behavior: 'smooth'
    });
  });
});


/* ── 5. Animation du compteur pour les stats hero ── */
function animateCounter(el, end, duration = 1200) {
  const start = 0;
  const increment = end / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, 16);
}

// Observer dédié pour les stats
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animer les métriques des cas d'usage uniquement
      entry.target.querySelectorAll('.result-num').forEach(num => {
        const value = parseInt(num.textContent);
        if (!isNaN(value) && value > 0) {
          animateCounter(num, value);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const usecaseResults = document.querySelector('.usecase-results');
if (usecaseResults) {
  statsObserver.observe(usecaseResults);
}


/* ── 6. Active nav link au scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function setActiveLink() {
  const scrollY = window.scrollY + navbar.offsetHeight + 80;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();


/* ── 7. Console log sympa pour les devs ── */
console.log('%c ImplIA 🤖 ', 'background:#6366f1;color:#fff;font-size:14px;font-weight:bold;padding:6px 12px;border-radius:6px;');
console.log('%c Site développé pour ImplIA — Montréal, Québec', 'color:#9898b0;font-size:11px;');
