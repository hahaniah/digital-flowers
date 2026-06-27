const picked = {};
var positions= {};
var MAX_FLOWERS= 8;

function totalFlowers() {
  var total =0;
  for (var f in picked) total += picked[f];
  return total;
}

const previewEl =document.getElementById('preview');

document.querySelectorAll('.flower-opt').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var flower = btn.dataset.flower;

    if (totalFlowers() >= MAX_FLOWERS) {
      alert('you can only add up to ' + MAX_FLOWERS + ' flowers in one bouquet ');
      return;
    }
    if (picked[flower]) {
      if (picked[flower] >= 4) {
        alert('max 4 of the same flower!');
        return;
      }
      picked[flower]++;
    } else {
      picked[flower] = 1;
      btn.classList.add('selected');
      var card = btn.closest('.flower-card');
      card.querySelector('.flower-controls').hidden = false;
    }

    btn.closest('.flower-card').querySelector('.flower-count').textContent = picked[flower];
    updatePreview();
  });
});

document.querySelectorAll('.minus-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var flower = btn.dataset.flower;
    if (!picked[flower]) return;
    picked[flower]--;
    var card = btn.closest('.flower-card');
    if (picked[flower] === 0) {
      delete picked[flower];
      card.querySelector('.flower-opt').classList.remove('selected');
      card.querySelector('.flower-controls').hidden = true;
    } else {
      card.querySelector('.flower-count').textContent = picked[flower];
    }
    updatePreview();
  });
});

function makeDraggable(el) {
  var startX, startY, startLeft, startTop;

  el.addEventListener('mousedown', function(e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(el.style.left) || 0;
    startTop = parseInt(el.style.top) || 0;
    el.style.cursor = 'grabbing';
    el.style.zIndex = 999;

    function onMove(e) {
      var newLeft = startLeft + (e.clientX - startX);
      var newTop = startTop + (e.clientY - startY);
      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
      positions[el.dataset.key] = { left: newLeft, top: newTop };
    }

    function onUp() {
      el.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  el.addEventListener('touchstart', function(e) {
    var touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startLeft = parseInt(el.style.left) || 0;
    startTop = parseInt(el.style.top) || 0;

    function onMove(e) {
      var t = e.touches[0];
      var newLeft = startLeft + (t.clientX - startX);
      var newTop = startTop + (t.clientY - startY);
      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
      positions[el.dataset.key] = { left: newLeft, top: newTop };
    }

    function onEnd() {
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    }

    el.addEventListener('touchmove', onMove);
    el.addEventListener('touchend', onEnd);
  });
}

function updatePreview() {
  var layer = document.getElementById('flowers-layer');
  if (layer) layer.remove();

  var total = 0;
  for (var f in picked) total += picked[f];
  if (total === 0) return;

  var container = document.createElement('div');
  container.className = 'flowers-layer';
  container.id = 'flowers-layer';

  var allFlowers = [];
  for (var flower in picked) {
    for (var i = 0; i < picked[flower]; i++) {
      allFlowers.push(flower);
    }
  }

  var defaultSpots = [
    { left: 88,  top: 25 },
    { left: 118, top: 20 },
    { left: 73,  top: 42 },
    { left: 133, top: 42 },
    { left: 101, top: 8  },
    { left: 58,  top: 70 },
    { left: 145, top: 70 },
    { left: 83,  top: 58 }
  ];

  for (var j = 0; j < allFlowers.length; j++) {
    var flower = allFlowers[j];
    var key = flower + '-' + j;
    var pos = positions[key] || defaultSpots[j % defaultSpots.length];

    var img = document.createElement('img');
    img.className = 'preview-flower draggable';
    img.src = './' + flower + '.png.png';
    img.alt = flower;
    img.dataset.key = key;
    img.style.left = pos.left + 'px';
    img.style.top = pos.top + 'px';
    img.style.zIndex = j;
    img.style.cursor = 'grab';

    makeDraggable(img);
    container.appendChild(img);
  }

  previewEl.appendChild(container);
}

document.getElementById('generate-btn').addEventListener('click', function() {
  var to = document.getElementById('to').value.trim();
  var from = document.getElementById('from').value.trim();
  var msg = document.getElementById('msg').value.trim();

  var flowerParts = [];
  for (var f in picked) {
    flowerParts.push(f + 'x' + picked[f]);
  }
  var flowers = flowerParts.join(',');

  if (!flowers) {
    alert('pick at least one flower first 🌸');
    return;
  }

  var posStr = JSON.stringify(positions);
  var params = new URLSearchParams({ to: to, from: from, msg: msg, flowers: flowers, pos: posStr });
  var link = location.origin + '/digital-flowers/view.html?' + params.toString();

  var linkBox = document.getElementById('link-box');
  var linkOutput = document.getElementById('link-output');

  linkOutput.value = link;
  linkBox.hidden = false;
  linkBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.getElementById('copy-btn').addEventListener('click', function() {
  var linkOutput = document.getElementById('link-output');
  navigator.clipboard.writeText(linkOutput.value).then(function() {
    var msg = document.getElementById('copied-msg');
    msg.classList.add('visible');
    setTimeout(function() { msg.classList.remove('visible'); }, 2000);
  });
});