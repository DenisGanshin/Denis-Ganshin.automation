// Gallery carousel (single image + thumbnails)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.gallery').forEach(function(gallery) {
    var items = Array.from(gallery.querySelectorAll('.gallery__item'));
    if (items.length === 0) return;

    // Wrap in card structure
    var section = gallery.parentNode;
    var card = document.createElement('div');
    card.className = 'gallery-card';

    var viewer = document.createElement('div');
    viewer.className = 'gallery-viewer';

    section.insertBefore(card, gallery);
    viewer.appendChild(gallery);
    card.appendChild(viewer);

    // Set first item active
    var current = 0;
    items[0].classList.add('active');

    // Create arrows
    var leftBtn = document.createElement('button');
    leftBtn.className = 'gallery__arrow gallery__arrow--left';
    leftBtn.setAttribute('aria-label', 'Назад');
    leftBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>';

    var rightBtn = document.createElement('button');
    rightBtn.className = 'gallery__arrow gallery__arrow--right';
    rightBtn.setAttribute('aria-label', 'Вперёд');
    rightBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>';

    viewer.appendChild(leftBtn);
    viewer.appendChild(rightBtn);

    // Create thumbnails
    var thumbsWrap = document.createElement('div');
    thumbsWrap.className = 'gallery__thumbs';

    items.forEach(function(item, i) {
      var img = item.querySelector('img');
      var thumb = document.createElement('button');
      thumb.className = 'gallery__thumb' + (i === 0 ? ' active' : '');
      thumb.setAttribute('aria-label', 'Фото ' + (i + 1));
      var thumbImg = document.createElement('img');
      thumbImg.src = img.src;
      thumbImg.alt = '';
      thumbImg.setAttribute('data-no-lightbox', '');
      thumb.appendChild(thumbImg);
      thumbsWrap.appendChild(thumb);

      thumb.addEventListener('click', function() {
        goTo(i);
      });
    });

    card.appendChild(thumbsWrap);

    function goTo(index) {
      items[current].classList.remove('active');
      thumbsWrap.children[current].classList.remove('active');
      current = index;
      items[current].classList.add('active');
      thumbsWrap.children[current].classList.add('active');
      updateArrows();
    }

    function updateArrows() {
      leftBtn.disabled = current === 0;
      rightBtn.disabled = current === items.length - 1;
    }

    leftBtn.addEventListener('click', function() {
      if (current > 0) goTo(current - 1);
    });

    rightBtn.addEventListener('click', function() {
      if (current < items.length - 1) goTo(current + 1);
    });

    updateArrows();
  });
});
