document.addEventListener('DOMContentLoaded', () => {


  // ===== Header scroll effect =====
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Intersection Observer animations =====
  const elements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
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

});
