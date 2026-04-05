/* ================================================
   じりつLABO - Main JavaScript
   GSAP + ScrollTrigger + Custom Scroll System
   Easing: cubic-bezier(.165, .84, .44, 1)
   ================================================ */

gsap.registerPlugin(ScrollTrigger);

// === INIT ===
document.addEventListener('DOMContentLoaded', function() {
  initMotionText();
  initHeader();
  initHamburger();
  initFaq();
  initSmoothScroll();
  initParallax();
  initHeroAnimations();
});

// === MOTION TEXT (scroll reveal) ===
function initMotionText() {
  var elements = document.querySelectorAll('.motion-text');
  elements.forEach(function(el) {
    var delay = parseFloat(el.dataset.delay || 0) * 0.15;
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom-=100',
      onEnter: function() {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: delay,
          ease: 'power3.out'
        });
        el.classList.add('show');
      },
      once: true
    });
  });
}

// === HEADER (scroll state) ===
function initHeader() {
  var header = document.getElementById('header');
  var lastScroll = 0;

  window.addEventListener('scroll', function() {
    var currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// === HAMBURGER MENU ===
function initHamburger() {
  var btn = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function() {
    btn.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      btn.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// === FAQ ACCORDION ===
function initFaq() {
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function(item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function() {
      var isActive = item.classList.contains('active');
      // Close all
      items.forEach(function(i) { i.classList.remove('active'); });
      // Open clicked (if wasn't active)
      if (!isActive) item.classList.add('active');
    });
  });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80; // header height
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

// === PARALLAX ===
function initParallax() {
  // Hero circles
  gsap.to('.circle-1', {
    y: -80,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });
  gsap.to('.circle-2', {
    y: -50,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    }
  });

  // Pillar cards stagger
  gsap.utils.toArray('.pillar').forEach(function(el, i) {
    gsap.from(el, {
      y: 60 + i * 20,
      opacity: 0,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=80',
        toggleActions: 'play none none none'
      },
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power3.out'
    });
  });

  // Score axes stagger
  gsap.utils.toArray('.score-axis').forEach(function(el, i) {
    gsap.from(el, {
      scale: 0.8,
      opacity: 0,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=60',
        toggleActions: 'play none none none'
      },
      duration: 0.5,
      delay: i * 0.1,
      ease: 'back.out(1.2)'
    });
  });

  // Result cards slide in
  gsap.utils.toArray('.result-card').forEach(function(el, i) {
    gsap.from(el, {
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=80',
        toggleActions: 'play none none none'
      },
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out'
    });
  });

  // Plan cards rise up
  gsap.utils.toArray('.plan-card').forEach(function(el, i) {
    gsap.from(el, {
      y: 80,
      opacity: 0,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=60',
        toggleActions: 'play none none none'
      },
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power3.out'
    });
  });

  // CTA box scale in
  gsap.from('.cta-box', {
    scale: 0.9,
    opacity: 0,
    scrollTrigger: {
      trigger: '.section-cta',
      start: 'top bottom-=100',
      toggleActions: 'play none none none'
    },
    duration: 0.8,
    ease: 'power3.out'
  });
}

// === HERO ANIMATIONS ===
function initHeroAnimations() {
  var tl = gsap.timeline({ delay: 0.3 });

  tl.from('.hero_badge span', {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out'
  })
  .from('.hero_title .line', {
    y: 60,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.3')
  .from('.hero_sub', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.4')
  .from('.hero_cta', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.3')
  .from('.hero_circle', {
    scale: 0,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero_mark', {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.5)'
  }, '-=0.6');
}
