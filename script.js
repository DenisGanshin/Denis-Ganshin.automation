document.addEventListener('DOMContentLoaded', () => {


  // ===== Magnetic Button =====
  (() => {
    const btn = document.getElementById('heroCta');
    if (!btn) return;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  })();

  // ===== 3D Photo Tilt + Card Flip =====
  (() => {
    const wrapper = document.querySelector('.hero__photo-wrapper');
    const card    = document.querySelector('.hero__card');
    const visual  = document.querySelector('.hero__visual');
    if (!wrapper || !card || !visual) return;

    let flipped  = false;
    let dragging = false;
    let startX   = 0;

    const THRESHOLD = 55;

    const snapCard = () => {
      card.style.transition = 'transform 0.65s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform  = `rotateY(${flipped ? 180 : 0}deg)`;
      setTimeout(() => { card.style.transition = ''; }, 650);
    };

    // Tilt (disabled only while dragging)
    visual.addEventListener('mousemove', e => {
      if (dragging) return;
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      const rx = flipped ? -x : x;
      wrapper.style.transform = `perspective(900px) rotateY(${rx * 9}deg) rotateX(${-y * 6}deg)`;
    });
    visual.addEventListener('mouseleave', () => {
      if (dragging) return;
      wrapper.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
      wrapper.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
      setTimeout(() => { wrapper.style.transition = ''; }, 700);
    });

    // Drag to flip
    const dragStart = (x) => {
      dragging = true;
      startX   = x;
      card.style.transition    = 'none';
      wrapper.style.transition = 'none';
      wrapper.style.transform  = 'perspective(900px)';
    };
    const dragMove = (x) => {
      if (!dragging) return;
      const delta   = x - startX;
      const base    = flipped ? 180 : 0;
      const raw     = base + delta * 0.55;
      const clamped = flipped
        ? Math.max(80,  Math.min(200, raw))
        : Math.max(-20, Math.min(180, raw));
      card.style.transform = `rotateY(${clamped}deg)`;
    };
    const dragEnd = (x) => {
      if (!dragging) return;
      dragging = false;
      const delta = x - startX;
      if (!flipped && delta > THRESHOLD)      flipped = true;
      else if (flipped && delta < -THRESHOLD) flipped = false;
      snapCard();
    };

    wrapper.addEventListener('mousedown',  e => { e.preventDefault(); dragStart(e.clientX); });
    window.addEventListener('mousemove',   e => dragMove(e.clientX));
    window.addEventListener('mouseup',     e => dragEnd(e.clientX));
    wrapper.addEventListener('touchstart', e => dragStart(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove',   e => { if (dragging) dragMove(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend',    e => dragEnd(e.changedTouches[0].clientX));
  })();

  // ===== Header scroll effect =====
  const header = document.getElementById('header');
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('header--scrolled', y > 10);
    lastScroll = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Burger menu =====
  const burger = document.getElementById('burger');
  const navLinks = document.querySelectorAll('.header__nav a');

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';

  navLinks.forEach(link => overlay.appendChild(link.cloneNode(true)));

  const headerCta = document.querySelector('.header__cta');
  if (headerCta) {
    const ctaClone = headerCta.cloneNode(true);
    ctaClone.style.marginTop = '16px';
    ctaClone.style.alignSelf = 'flex-start';
    ctaClone.classList.remove('btn--small');
    overlay.appendChild(ctaClone);
  }

  document.body.appendChild(overlay);

  burger.addEventListener('click', () => {
    const isActive = burger.classList.toggle('active');
    overlay.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== Smooth scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== Typewriter hero title =====
  (() => {
    const el = document.querySelector('.hero__title');
    if (!el) return;
    const fullText = el.textContent;
    el.innerHTML = '<span class="tw-text"></span><span class="tw-cursor"></span>';
    const textSpan = el.querySelector('.tw-text');
    const cursorSpan = el.querySelector('.tw-cursor');
    let i = 0;
    const type = () => {
      textSpan.textContent = fullText.slice(0, i++);
      if (i <= fullText.length) setTimeout(type, 28);
      else setTimeout(() => { cursorSpan.style.transition = 'opacity 0.5s'; cursorSpan.style.opacity = '0'; }, 1800);
    };
    setTimeout(type, 700);
  })();

  // parallax replaced by 3D tilt above

  // ===== Counter animation for about banner =====
  (() => {
    const banner = document.querySelector('.about__banner');
    if (!banner) return;
    const animateNum = (el) => {
      const text = el.textContent.trim();
      const match = text.match(/[-−]?\d[\d\s]*/);
      if (!match) return;
      const target = parseInt(match[0].replace(/−/g, '-').replace(/\s/g, ''));
      const prefix = text.slice(0, match.index);
      const suffix = text.slice(match.index + match[0].length);
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const val = Math.round((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = prefix + (target >= 1000 ? val.toLocaleString('ru-RU') : val) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        banner.querySelectorAll('.about__banner-num').forEach(animateNum);
        obs.disconnect();
      });
    }, { threshold: 0.5 });
    obs.observe(banner);
  })();

  // ===== Intersection Observer animations =====
  const elements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          // Stagger among siblings
          const parent = entry.target.parentElement;
          const siblings = [...parent.querySelectorAll(':scope > .fade-up')];
          const idx = siblings.filter(s => !s.classList.contains('visible')).indexOf(entry.target);

          entry.target.style.transitionDelay = `${Math.max(0, idx) * 70}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('visible'));
  }

  // ===== Carousel drag/swipe =====
  const carousel = document.querySelector('.carousel');
  const track = document.querySelector('.carousel__track');
  if (carousel && track) {
    const DURATION = 55;
    let dragging = false, moved = false, startX = 0, baseX = 0;

    const getX = () => new DOMMatrix(getComputedStyle(track).transform).m41;

    const wrap = (x) => {
      const half = track.scrollWidth / 2;
      if (!half) return x;
      return -(((-x % half) + half) % half);
    };

    const freeze = () => {
      const x = getX();
      track.style.animation = 'none';
      track.style.transform = `translateX(${x}px)`;
      return x;
    };

    const resume = (fromX) => {
      const half = track.scrollWidth / 2;
      if (!half) { track.style.animation = ''; track.style.transform = ''; return; }
      const x = wrap(fromX);
      const delay = -(Math.abs(x) / half * DURATION);
      track.style.animation = 'none';
      track.style.transform = `translateX(${x}px)`;
      track.offsetHeight; // force reflow so browser commits the above
      track.style.animation = `carousel-scroll ${DURATION}s linear ${delay}s infinite`;
      track.style.transform = '';
    };

    const onDown = (x) => {
      dragging = true; moved = false;
      baseX = freeze();
      startX = x;
      carousel.style.cursor = 'grabbing';
    };

    const onMove = (x) => {
      if (!dragging) return;
      moved = true;
      track.style.transform = `translateX(${wrap(baseX + x - startX)}px)`;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      carousel.style.cursor = '';
      resume(getX());
    };

    carousel.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(e.pageX); });
    carousel.addEventListener('mouseleave', onUp);
    carousel.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', (e) => onMove(e.pageX));
    carousel.addEventListener('touchstart', (e) => onDown(e.touches[0].pageX), { passive: true });
    carousel.addEventListener('touchend', onUp);
    carousel.addEventListener('touchmove', (e) => onMove(e.touches[0].pageX), { passive: true });
    carousel.addEventListener('click', (e) => { if (moved) e.preventDefault(); });
  }

});
