/* ============================================================
   JARBOES CONSTRUCTION — INTERACTIONS
   ============================================================ */

// --- NAV: solid on scroll -----------------------------------
const nav    = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');

const solidNav = () => {
  if (window.scrollY > 64) {
    nav.classList.add('nav--solid');
  } else {
    nav.classList.remove('nav--solid');
  }
};
window.addEventListener('scroll', solidNav, { passive: true });
solidNav();

// --- NAV: mobile toggle -------------------------------------
toggle.addEventListener('click', () => {
  const isOpen = links.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

links.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// --- REVEAL ON SCROLL (IntersectionObserver) ----------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- COUNTER ANIMATION --------------------------------------
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOutCubic(progress) * target);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// --- CONTACT FORM (mailto) -----------------------------------
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.querySelector('#name').value.trim();
    const phone   = form.querySelector('#phone').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const service = form.querySelector('#service').value;
    const message = form.querySelector('#message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      alert('Please fill out your name, email, and project details.');
      return;
    }

    const subject = encodeURIComponent(`New Estimate Request — ${service || 'General Inquiry'}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone || 'Not provided'}\nEmail: ${email}\nService: ${service || 'Not specified'}\n\nProject Details:\n${message}`
    );
    window.location.href = `mailto:Jarboesconstruction@gmail.com?subject=${subject}&body=${body}`;

    // Visual feedback
    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Opening Email Client…';
    btn.style.background = '#15803d';
    btn.style.boxShadow  = '0 8px 28px rgba(21,128,61,0.35)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.boxShadow  = '';
      btn.disabled = false;
    }, 4000);
  });
}

// --- SMOOTH ANCHOR SCROLLING (offset for fixed nav) ---------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH   = nav.offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// --- STAGGER children inside .reviews__grid -----------------
document.querySelectorAll('.services__grid, .reviews__grid, .process__steps').forEach(grid => {
  [...grid.children].forEach((child, i) => {
    if (child.classList.contains('reveal')) {
      child.style.setProperty('--delay', String(i * 90));
    }
  });
});
