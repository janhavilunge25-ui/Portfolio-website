/* ==========================================
   PARTICLES BACKGROUND
   ------------------------------------------
   Creates the animated connected particles on the
   background canvas using 2D canvas and requestAnimationFrame
========================================== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '168,85,247' : '232,121,249';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // connect close particles with faint lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168,85,247,${0.07 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();

/* ==========================================
   CUSTOM POINTER
   ------------------------------------------
   Mimics a custom cursor with hover effects for
   clickable items
========================================== */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = `${mx}px`;
  cursor.style.top = `${my}px`;

  setTimeout(() => {
    trail.style.left = `${mx}px`;
    trail.style.top = `${my}px`;
  }, 80);
});

/* mutable hover style for interactive elements */
const hoverables = document.querySelectorAll('a,button,.btn,.skill-card,.project-card,.contact-card');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursor.style.background = 'rgba(168,85,247,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--p1)';
  });
});

/* ==========================================
   NAVBAR SCROLL AND ACTIVE LINK
   ------------------------------------------
   Makes nav sticky, adds style on scroll, and
   highlights current section
========================================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

/* ==========================================
   MOBILE MENU
========================================== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* ==========================================
   REVEAL ANIMATION
========================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

/* ==========================================
   SKILL BAR FILL ANIMATION
========================================== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = `${bar.dataset.width}%`;
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(c => barObserver.observe(c));

/* ==========================================
   SMOOTH SCROLL (for any anchor links)
========================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ==========================================
   CONTACT FORM SUBMISSION
========================================== */
const form = document.getElementById('contact-form');
const fMsg = document.getElementById('form-message');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.f-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      await emailjs.sendForm('service_72z2iqc', 'template_us0rhrn', form);
      fMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
      fMsg.style.color = 'var(--teal)';
      form.reset();
    } catch {
      fMsg.textContent = '✗ Failed to send. Please try again.';
      fMsg.style.color = 'var(--rose)';
    }
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    setTimeout(() => fMsg.textContent = '', 5000);
  });
}