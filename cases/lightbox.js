(function(){
  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = '<button class="lightbox__close" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button><img alt="">';
  document.body.appendChild(overlay);

  var lbImg = overlay.querySelector('img');
  var closeBtn = overlay.querySelector('.lightbox__close');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function(e) {
    var img = e.target.closest('main img:not([data-no-lightbox])');
    if (img) { e.preventDefault(); open(img.src, img.alt); return; }
    if (e.target === overlay || e.target === closeBtn || e.target.closest('.lightbox__close')) { close(); }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') close();
  });
})();
