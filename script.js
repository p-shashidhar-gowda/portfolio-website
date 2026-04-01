/* ============================================================
   PORTFOLIO – Shashidhar Gowda P
   script.js — Interactions & Animations
   ============================================================ */

'use strict';

/* ---- Canvas: very subtle dot grid (light theme) ---- */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CELL = 55;
  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cols = Math.ceil(canvas.width  / CELL) + 1;
    const rows = Math.ceil(canvas.height / CELL) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * CELL;
        const y = r * CELL;
        const wave = Math.sin(c * 0.25 + t) * Math.cos(r * 0.25 + t * 0.6);
        const alpha = 0.06 + 0.04 * wave;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.02, alpha)})`;
        ctx.fill();
      }
    }
    t += 0.004;
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ---- Navbar: Scroll shrink + active section + scroll-cue hide ---- */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const links     = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const scrollCue = document.getElementById('scroll-cue');

  function updateNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    if (scrollCue) {
      scrollCue.classList.toggle('hidden', window.scrollY > 80);
    }

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();


/* ---- Mobile Menu ---- */
(function initMobileMenu() {
  const toggle  = document.getElementById('menu-toggle');
  const navlist = document.getElementById('navlist');
  const navbar  = document.getElementById('navbar');
  if (!toggle || !navlist) return;

  toggle.addEventListener('click', () => {
    const open = navlist.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  navlist.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navlist.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (navbar && !navbar.contains(e.target)) {
      navlist.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
})();


/* ---- Role Typewriter ---- */
(function initTypewriter() {
  const el = document.getElementById('role-dynamic');
  if (!el) return;

  const roles = [
    'Cloud Engineer',
    'Azure Specialist',
    'DevOps Engineer',
    'Infrastructure Engineer',
    'Security Enthusiast',
    'Kubernetes Operator'
  ];

  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    if (deleting) {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 55);
    } else {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) {
        setTimeout(() => { deleting = true; tick(); }, 1800);
        return;
      }
      setTimeout(tick, 90);
    }
  }
  tick();
})();


/* ---- Scroll Reveal ---- */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => obs.observe(item));
})();


/* ---- Certification Lightbox ---- */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbCap    = document.getElementById('lb-caption');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  if (!lightbox) return;

  const certCards = [...document.querySelectorAll('.cert-card')];
  let currentIndex = 0;

  function openLightbox(index) {
    const card = certCards[index];
    const img  = card.querySelector('img');
    if (!img) return;
    currentIndex = index;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = card.querySelector('h4')?.textContent || img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + certCards.length) % certCards.length;
    openLightbox(currentIndex);
  }

  certCards.forEach((card, i) => card.addEventListener('click', () => openLightbox(i)));
  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click',  () => navigate(-1));
  lbNext?.addEventListener('click',  () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();


/* ---- Resume Popup ---- */
(function initResumePopup() {
  const fab  = document.getElementById('resume-fab');
  const card = document.getElementById('resume-card');
  if (!fab || !card) return;

  let open = false;

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    open = !open;
    card.classList.toggle('open', open);
    fab.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-file';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#resume-popup')) {
      open = false;
      card.classList.remove('open');
      fab.querySelector('i').className = 'bx bx-file';
    }
  });
})();


/* ---- Counter animation for stat numbers ---- */
(function initCounters() {
  const els = document.querySelectorAll('.stat-num, .hero-stat-num');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target;
        if (numEl.dataset.counted) return;
        numEl.dataset.counted = '1';
        const raw    = numEl.textContent.trim();
        const num    = parseFloat(raw);
        const suffix = raw.replace(/[\d.]/g, '');
        if (isNaN(num)) return;

        const duration  = 1000;
        const startTime = performance.now();
        function update(now) {
          const p = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const current = Math.round(num * ease * 10) / 10;
          numEl.textContent = (current % 1 === 0 ? Math.round(current) : current) + suffix;
          if (p < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        obs.unobserve(numEl);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => obs.observe(el));
})();
