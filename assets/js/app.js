/* ================================================
   jiritsuLABO - Main JavaScript
   Animation ref: Osaka Geidai Musicology
   - Width-clip text reveal (setMotionText/startTextMotion)
   - GSAP + ScrollTrigger
   - Parallax via translate3d
   - Easing: power3.out (= cubic-bezier .165,.84,.44,1)
   ================================================ */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
  // Small delay for font loading
  setTimeout(function() {
    initMotionText();
    initMotionFade();
    initHeader();
    initHamburger();
    initFaq();
    initSmoothScroll();
    initParallax();
    initHeroSequence();
  }, 100);
});

/* ========================================
   MOTION TEXT - Width-clip reveal
   (Osaka Geidai technique)
   Container overflow:hidden, width:0 -> clientWidth
   Child starts at translate3d(100px,0,0) -> (0,0,0)
   ======================================== */

function initMotionText() {
  var targets = document.querySelectorAll('.motion-text');
  targets.forEach(function(target) {
    // Store references
    var items = target.querySelectorAll('.item');
    if (items.length === 0) return; // skip if no .item children
    var itemChilds = [];
    items.forEach(function(item) {
      var child = item.querySelector('div') || item.querySelector('span.inner');
      if (child) itemChilds.push(child);
    });

    target.dataset.showed = 'false';

    ScrollTrigger.create({
      trigger: target,
      start: 'top bottom-=200',
      onEnter: function() {
        if (target.dataset.showed === 'true') return;
        target.dataset.showed = 'true';
        startTextMotion(items, itemChilds);
      },
      once: true
    });
  });
}

function startTextMotion(items, itemChilds) {
  for (var i = 0; i < items.length; i++) {
    (function(index) {
      var item = items[index];
      var child = itemChilds[index];
      if (!child) return;

      // Delay each item
      setTimeout(function() {
        var w = child.clientWidth || child.scrollWidth;
        item.classList.add('show');
        item.style.width = w + 'px';
      }, index * 150);
    })(i);
  }
}

/* ========================================
   MOTION FADE - Simple opacity+translate3d
   For elements without .item children
   ======================================== */

function initMotionFade() {
  var elements = document.querySelectorAll('.motion-fade');
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
          ease: 'power3.out',
          onComplete: function() { el.classList.add('show'); }
        });
      },
      once: true
    });
  });
}

/* ========================================
   HEADER (scroll glass effect)
   ======================================== */

function initHeader() {
  var header = document.getElementById('header');
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ========================================
   HAMBURGER (TweenMax-style span rotation)
   ======================================== */

function initHamburger() {
  var btn = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function() {
    btn.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      btn.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ========================================
   FAQ ACCORDION
   ======================================== */

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(function(item) {
    item.querySelector('.faq-q').addEventListener('click', function() {
      var active = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('active'); });
      if (!active) item.classList.add('active');
    });
  });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

/* ========================================
   PARALLAX & SCROLL ANIMATIONS
   (GSAP ScrollTrigger scrub)
   ======================================== */

function initParallax() {
  // Hero circles float
  gsap.to('.circle-1', {
    y: -100, x: 30,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });
  gsap.to('.circle-2', {
    y: -60, x: -20,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
  });

  // Problem cards stagger
  gsap.utils.toArray('.problem-card').forEach(function(el, i) {
    gsap.from(el, {
      y: 50, opacity: 0, scale: 0.95,
      scrollTrigger: { trigger: el, start: 'top bottom-=80', toggleActions: 'play none none none' },
      duration: 0.6, delay: i * 0.08, ease: 'power3.out'
    });
  });

  // Pillar cards with 3D tilt
  gsap.utils.toArray('.pillar').forEach(function(el, i) {
    gsap.from(el, {
      y: 80, opacity: 0, rotateX: 8,
      scrollTrigger: { trigger: el, start: 'top bottom-=80', toggleActions: 'play none none none' },
      duration: 0.8, delay: i * 0.15, ease: 'power3.out'
    });
  });

  // Score axes pop in
  gsap.utils.toArray('.score-axis').forEach(function(el, i) {
    gsap.from(el, {
      scale: 0.7, opacity: 0, y: 30,
      scrollTrigger: { trigger: el, start: 'top bottom-=60', toggleActions: 'play none none none' },
      duration: 0.5, delay: i * 0.08, ease: 'back.out(1.4)'
    });
  });

  // App mockup slide in
  gsap.from('.app-mockup', {
    x: -60, opacity: 0,
    scrollTrigger: { trigger: '.score-app', start: 'top bottom-=100', toggleActions: 'play none none none' },
    duration: 0.8, ease: 'power3.out'
  });
  gsap.from('.app-features', {
    x: 60, opacity: 0,
    scrollTrigger: { trigger: '.score-app', start: 'top bottom-=100', toggleActions: 'play none none none' },
    duration: 0.8, delay: 0.2, ease: 'power3.out'
  });

  // Result cards alternate slide
  gsap.utils.toArray('.result-card').forEach(function(el, i) {
    gsap.from(el, {
      x: i % 2 === 0 ? -80 : 80, opacity: 0, rotateY: i % 2 === 0 ? 5 : -5,
      scrollTrigger: { trigger: el, start: 'top bottom-=80', toggleActions: 'play none none none' },
      duration: 0.8, delay: i * 0.12, ease: 'power3.out'
    });
  });

  // Plan cards rise with scale
  gsap.utils.toArray('.plan-card').forEach(function(el, i) {
    gsap.from(el, {
      y: 100, opacity: 0, scale: 0.92,
      scrollTrigger: { trigger: el, start: 'top bottom-=60', toggleActions: 'play none none none' },
      duration: 0.7, delay: i * 0.12, ease: 'power3.out'
    });
  });

  // CTA box dramatic entrance
  gsap.from('.cta-box', {
    scale: 0.85, opacity: 0, y: 40,
    scrollTrigger: { trigger: '.section-cta', start: 'top bottom-=100', toggleActions: 'play none none none' },
    duration: 1, ease: 'power3.out'
  });

  // FAQ items stagger
  gsap.utils.toArray('.faq-item').forEach(function(el, i) {
    gsap.from(el, {
      x: -30, opacity: 0,
      scrollTrigger: { trigger: el, start: 'top bottom-=60', toggleActions: 'play none none none' },
      duration: 0.5, delay: i * 0.08, ease: 'power3.out'
    });
  });
}

/* ========================================
   HERO SEQUENCE (delayed cascade)
   Like Osaka Geidai: hero → badges → title → sub → CTA → marks
   ======================================== */

function initHeroSequence() {
  var tl = gsap.timeline({ delay: 0.4 });

  // Badge spans cascade
  tl.from('.hero_badge span', {
    y: 40, opacity: 0, scale: 0.9,
    stagger: 0.12,
    duration: 0.6,
    ease: 'power3.out'
  })
  // Title lines with skew entrance
  .from('.hero_title .line', {
    y: 80, opacity: 0, skewY: 4,
    stagger: 0.18,
    duration: 0.9,
    ease: 'power3.out'
  }, '-=0.3')
  // Sub text
  .from('.hero_sub', {
    y: 30, opacity: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.4')
  // CTA button
  .from('.hero_cta', {
    y: 30, opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.3')
  // Decorative circles scale in
  .from('.hero_circle', {
    scale: 0, opacity: 0,
    stagger: 0.2,
    duration: 1.2,
    ease: 'power3.out'
  }, '-=0.6')
  // Rotating mark pop
  .from('.hero_mark', {
    scale: 0, opacity: 0, rotation: -180,
    duration: 0.8,
    ease: 'back.out(1.7)'
  }, '-=0.8');
}
