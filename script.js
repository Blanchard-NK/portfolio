/* ============================================================
   BLANCHARD NKOGHE — Portfolio JavaScript (Version FR Améliorée)
   Fonctionnalités :
   - Loader de page animé
   - Curseur personnalisé
   - Particules canvas
   - Barre de lecture scroll
   - Navbar responsive + active link
   - Typewriter hero
   - Compteurs animés
   - Barres de compétences animées
   - Radar chart canvas
   - Filtres de projets
   - Mode clair/sombre
   - Révélation au scroll (IntersectionObserver)
   - Retour en haut
   - Formulaire de contact avec validation
   ============================================================ */

'use strict';

/* ══════════════════════ LOADER ══════════════════════ */
(function initLoader() {
  const loader   = document.getElementById('pageLoader');
  const fill     = document.getElementById('loaderFill');
  const txt      = document.getElementById('loaderText');
  const messages = ['Initialisation…', 'Chargement des ressources…', 'Préparation du portfolio…', 'Presque prêt…'];
  let progress   = 0;
  let msgIdx     = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress > 100) progress = 100;
    fill.style.width = progress + '%';

    if (progress > 30 && msgIdx === 0) { txt.textContent = messages[1]; msgIdx = 1; }
    if (progress > 60 && msgIdx === 1) { txt.textContent = messages[2]; msgIdx = 2; }
    if (progress > 85 && msgIdx === 2) { txt.textContent = messages[3]; msgIdx = 3; }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        // Déclencher les animations hero après le loader
        document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), 200 + i * 160);
        });
      }, 400);
    }
  }, 120);
})();


/* ══════════════════════ CURSEUR PERSONNALISÉ ══════════════════════ */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Agrandir sur les éléments interactifs
document.querySelectorAll('a, button, input, textarea, .activity-card, .project-card, .tw-card, .tool-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});


/* ══════════════════════ PARTICULES CANVAS ══════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.5 + 0.3;
    this.dx   = (Math.random() - 0.5) * 0.3;
    this.dy   = (Math.random() - 0.5) * 0.3;
    this.alpha= Math.random() * 0.6 + 0.1;
    // Couleur aléatoire parmi la palette
    const colors = ['79,163,232', '155,114,248', '56,217,245', '76,222,138'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  // Créer 90 particules
  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(79,163,232,${(1 - dist / 120) * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ══════════════════════ BARRE DE LECTURE ══════════════════════ */
const readingBar = document.getElementById('readingBar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  readingBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });


/* ══════════════════════ NAVBAR ══════════════════════ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navLinkEls= document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
  toggleBackToTop();
}, { passive: true });

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

function updateActiveLink() {
  const scrollPos = window.scrollY + 130;
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    const id  = sec.getAttribute('id');
    if (scrollPos >= top && scrollPos < bot) {
      navLinkEls.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href') === '#' + id) l.classList.add('active');
      });
    }
  });
}


/* ══════════════════════ MODE CLAIR / SOMBRE ══════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
let lightMode = localStorage.getItem('lightMode') === 'true';

function applyTheme() {
  document.body.classList.toggle('light-mode', lightMode);
  themeIcon.className = lightMode ? 'ph ph-moon' : 'ph ph-sun';
}
applyTheme();

themeToggle.addEventListener('click', () => {
  lightMode = !lightMode;
  localStorage.setItem('lightMode', lightMode);
  applyTheme();
});


/* ══════════════════════ TYPEWRITER HERO ══════════════════════ */
(function initTypewriter() {
  const el     = document.getElementById('typedText');
  if (!el) return;
  const phrases = [
    'développement web full-stack.',
    'des interfaces utilisateur modernes.',
    'des applications PHP & MySQL.',
    'la veille technologique IA.',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 75);
  }
  setTimeout(type, 1800);
})();


/* ══════════════════════ SCROLL REVEAL ══════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));


/* ══════════════════════ COMPTEURS ANIMÉS ══════════════════════ */
let countersStarted = false;
const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('.counter-num').forEach(el => {
      const target  = parseInt(el.getAttribute('data-target'), 10);
      const duration= 1800;
      const step    = 16;
      const steps   = duration / step;
      const inc     = target / steps;
      let current   = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current);
      }, step);
    });
  }
}, { threshold: 0.5 });

const countersSection = document.querySelector('.counters-section');
if (countersSection) counterObserver.observe(countersSection);


/* ══════════════════════ BARRES DE COMPÉTENCES ══════════════════════ */
let skillsAnimated = false;
const skillObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !skillsAnimated) {
    skillsAnimated = true;
    document.querySelectorAll('.skill-fill').forEach((fill, i) => {
      setTimeout(() => {
        fill.style.width = fill.getAttribute('data-width') + '%';
        fill.classList.add('animated');
      }, i * 130);
    });
  }
}, { threshold: 0.25 });

const skillsSection = document.querySelector('#competences');
if (skillsSection) skillObserver.observe(skillsSection);


/* ══════════════════════ RADAR CHART CANVAS ══════════════════════ */
(function drawRadar() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R  = (Math.min(W, H) / 2) - 28;

  const labels = ['HTML', 'CSS', 'JS', 'PHP', 'Java', 'Python'];
  const values = [0.90, 0.80, 0.60, 0.65, 0.50, 0.50];
  const N      = labels.length;
  const angle0 = -Math.PI / 2;

  function pt(i, ratio) {
    const a = angle0 + (2 * Math.PI * i) / N;
    return { x: cx + Math.cos(a) * R * ratio, y: cy + Math.sin(a) * R * ratio };
  }

  function drawGrid() {
    for (let lvl = 1; lvl <= 5; lvl++) {
      const r = lvl / 5;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const p = pt(i, r);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(79,163,232,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (let i = 0; i < N; i++) {
      const p = pt(i, 1);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = 'rgba(79,163,232,0.12)';
      ctx.stroke();
    }
  }

  function drawData(ratio) {
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const p = pt(i, values[i] * ratio);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0, 'rgba(79,163,232,0.35)');
    grad.addColorStop(1, 'rgba(155,114,248,0.15)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(79,163,232,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points
    for (let i = 0; i < N; i++) {
      const p = pt(i, values[i] * ratio);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38d9f5';
      ctx.fill();
    }
  }

  function drawLabels() {
    ctx.font = '600 11px DM Sans, sans-serif';
    ctx.fillStyle = 'rgba(240,244,255,0.7)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < N; i++) {
      const p = pt(i, 1.2);
      ctx.fillText(labels[i], p.x, p.y);
    }
  }

  // Animation d'entrée
  let progress = 0;
  const radarObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      radarObs.disconnect();
      (function anim() {
        progress += 0.04;
        if (progress > 1) progress = 1;
        ctx.clearRect(0, 0, W, H);
        drawGrid();
        drawData(progress);
        drawLabels();
        if (progress < 1) requestAnimationFrame(anim);
      })();
    }
  }, { threshold: 0.3 });
  radarObs.observe(canvas);
})();


/* ══════════════════════ FILTRES PROJETS ══════════════════════ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.project-card').forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      const show = filter === 'all' || cats.includes(filter);
      card.style.display = show ? '' : 'none';
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      }
    });
  });
});


/* ══════════════════════ RETOUR EN HAUT ══════════════════════ */
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ══════════════════════ DÉFILEMENT FLUIDE ══════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 10;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});


/* ══════════════════════ FORMULAIRE CONTACT ══════════════════════ */
const sendBtn  = document.getElementById('sendBtn');
const formNote = document.getElementById('formNote');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const nom     = document.getElementById('nom')?.value.trim()     || '';
    const email   = document.getElementById('email')?.value.trim()   || '';
    const sujet   = document.getElementById('sujet')?.value.trim()   || '';
    const message = document.getElementById('message')?.value.trim() || '';

    if (!nom || !email || !message) {
      showNote('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showNote('Veuillez entrer une adresse email valide.', 'error');
      return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="ph ph-circle-notch"></i> Envoi en cours…';

    // Simuler l'envoi (remplacez par un vrai fetch/POST en production)
    setTimeout(() => {
      showNote('✓ Message envoyé ! Je vous répondrai rapidement.', 'success');
      ['nom','email','sujet','message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Envoyer le message';
    }, 1600);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function showNote(text, type) {
  formNote.textContent = text;
  formNote.className   = 'form-note ' + type;
  setTimeout(() => { formNote.textContent = ''; formNote.className = 'form-note'; }, 5500);
}


/* ══════════════════════ ANNÉE DU FOOTER ══════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
