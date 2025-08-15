/**
 * Stone Technologies — Core Interactivity
 *
 * This script handles three main behaviours:
 * 1. Accessible mobile navigation (burger / drawer)
 * 2. A lightweight slideshow used on the homepage
 * 3. EmailJS integration for the contact page (disabled if
 *    EmailJS isn't available). It gracefully degrades
 *    by printing to console when unavailable.
 *
 * The code is wrapped in an IIFE to avoid polluting the
 * global scope. Helper functions simplify querying
 * elements and attaching listeners.
 */

(function () {
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupMobileNav();
    setupSlideshow();
    setupEmail();
  }

  // Mobile drawer navigation toggle
  function setupMobileNav() {
    const burger = qs('[data-burger]');
    const drawer = qs('[data-drawer]');
    if (!burger || !drawer) return;

    const toggle = () => {
      const open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      // prevent background scrolling when drawer open
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', toggle);
    drawer.addEventListener('click', (e) => {
      if (e.target.matches('[data-close], a')) toggle();
    });
    // close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) toggle();
    });
  }

  // Simple slideshow used on homepage
  function setupSlideshow() {
    const el = qs('.slideshow');
    if (!el) return;
    const slides = qsa('.slide', el);
    if (slides.length === 0) return;
    let i = 0;
    const show = (n) => {
      slides.forEach((s) => s.classList.remove('active'));
      slides[n].classList.add('active');
    };
    show(i);
    const next = () => {
      i = (i + 1) % slides.length;
      show(i);
    };
    let timer = setInterval(next, 6000);

    // assign controls
    qsa('[data-prev]', el).forEach((btn) =>
      btn.addEventListener('click', () => {
        clearInterval(timer);
        i = (i - 1 + slides.length) % slides.length;
        show(i);
        timer = setInterval(next, 6000);
      })
    );
    qsa('[data-next]', el).forEach((btn) =>
      btn.addEventListener('click', () => {
        clearInterval(timer);
        next();
        timer = setInterval(next, 6000);
      })
    );
    // pause on hover
    el.addEventListener('mouseenter', () => clearInterval(timer));
    el.addEventListener('mouseleave', () => (timer = setInterval(next, 6000)));
  }

  // EmailJS integration for contact form
  function setupEmail() {
    const form = qs('#contact-form');
    if (!form) return;
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS not available');
      return;
    }
    try {
      emailjs.init('Y_-7u3Nz63nnM59C2');
    } catch (e) {
      console.warn('EmailJS init failed', e);
    }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const data = {
        to_name: 'Jordan',
        from_name: form.name?.value || qs('#name')?.value || 'Website visitor',
        from_email: qs('#email')?.value || '',
        message: qs('#message')?.value || ''
      };
      btn.disabled = true;
      btn.textContent = 'Sending…';
      try {
        await emailjs.send('service_6btdcwd', 'template_ihddw7a', data);
        await emailjs.send('service_6btdcwd', 'template_xx44i53', {
          from_name: data.from_name,
          to_email: data.from_email
        });
        form.reset();
        toast('Thanks! Your message is on its way.');
      } catch (err) {
        console.error(err);
        toast('Hmm, something went wrong. Try again?');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send';
      }
    });
  }

  // Minimal toast notification
  function toast(msg) {
    let t = document.createElement('div');
    t.textContent = msg;
    t.setAttribute('role', 'status');
    Object.assign(t.style, {
      position: 'fixed',
      inset: 'auto auto 1rem 50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,.85)',
      color: '#fff',
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      zIndex: 2000,
      boxShadow: '0 8px 24px rgba(0,0,0,.35)'
    });
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transition = 'opacity .4s';
    }, 2200);
    setTimeout(() => t.remove(), 2700);
  }
})();