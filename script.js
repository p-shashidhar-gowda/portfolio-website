/* ============================================================
   PORTFOLIO – Shashidhar Gowda P
   script.js — Interactions, Canvas, Animations
   ============================================================ */

'use strict';

/* ---- Canvas Grid / Particle Background ---- */
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

  const CELL = 50;
  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width  / CELL) + 1;
    const rows = Math.ceil(canvas.height / CELL) + 1;

    // Draw grid dots
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * CELL;
        const y = r * CELL;
        const wave = Math.sin(c * 0.3 + t) * Math.cos(r * 0.3 + t * 0.7);
        const alpha = 0.08 + 0.06 * wave;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${Math.max(0.02, alpha)})`;
        ctx.fill();
      }
    }

    // Faint horizontal scan line animation
    const scanY = ((t * 60) % (canvas.height + 80)) - 40;
    const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.04)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 30, canvas.width, 60);

    t += 0.006;
    requestAnimationFrame(draw);
  }

  draw();
})();


/* ---- Navbar: Scroll shrink + active section + scroll-cue hide ---- */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');
  const scrollCue = document.getElementById('scroll-cue');

  function updateNav() {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);

    // Hide scroll cue once user scrolls
    if (scrollCue) {
      scrollCue.classList.toggle('hidden', window.scrollY > 80);
    }

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
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

  // Close on link click
  navlist.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navlist.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Close on outside click
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
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger cards within the same container
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

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

  certCards.forEach((card, i) => {
    card.addEventListener('click', () => openLightbox(i));
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click',  () => navigate(-1));
  lbNext?.addEventListener('click',  () => navigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();


/* ---- Smooth hover glow on skill pills ---- */
(function initPillGlow() {
  document.querySelectorAll('.domain-card').forEach(card => {
    const icon = card.querySelector('.domain-icon');
    if (!icon) return;
    const color = getComputedStyle(icon).color;
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 10px 40px ${color.replace('rgb', 'rgba').replace(')', ', 0.08)')}`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();


/* ---- Counter animation for stat numbers ---- */
(function initCounters() {
  const statCards = document.querySelectorAll('.stat-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-num');
        if (!numEl || numEl.dataset.counted) return;
        numEl.dataset.counted = '1';

        const raw = numEl.textContent.trim();
        const num = parseFloat(raw);
        const suffix = raw.replace(/[\d.]/g, '');
        if (isNaN(num)) return;

        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(start + (num - start) * ease * 10) / 10;
          numEl.textContent = (current % 1 === 0 ? Math.round(current) : current) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => obs.observe(card));
})();
