const picked = {};

var MAX_FLOWERS = 8; 
function totalFlowers() {
  var total = 0;
  for (var f in picked) total += picked[f];
  return total;
}
const previewEl = document.getElementById('preview');
const emptyMsg = document.getElementById('empty-msg');



document.querySelectorAll('.flower-opt').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var flower = btn.dataset.flower;

    if (totalFlowers() >= MAX_FLOWERS) {
      alert('you can only add up to ' + MAX_FLOWERS + ' flowers in one bouquet 🌸');
      return;
    }
    if (picked[flower]) {
      if (picked[flower] >= 8) {
        alert('max 8 of the same flower, try a different one!');
        return;
      }
      picked[flower]++;
    } else {
      picked[flower]=1;
      btn.classList.add('selected');
      var card = btn.closest('.flower-card');
      card.querySelector('.flower-controls').hidden =false;
    }

    btn.closest('.flower-card').querySelector('.flower-count').textContent = picked[flower];
    updatePreview();
  });
});
function shuffle(arr) {
  for (var i =arr.length - 1; i> 0; i--) {
    var r = Math.floor(Math.random() * (i+1));
    var temp= arr[i];
    arr[i]=arr[r];
    arr[r]=temp;
  }
  return arr;
}

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

function updatePreview() {
  var layer = document.getElementById('flowers-layer');
  if (layer) layer.remove();

  var total = 0;
  for (var f in picked) total += picked[f];

  if (total === 0) {
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';

  var container = document.createElement('div');
  container.className = 'flowers-layer';
  container.id = 'flowers-layer';

  var allFlowers = [];
  for (var flower in picked) {
    for (var i = 0; i < picked[flower]; i++) {
      allFlowers.push(flower);
    }
  }

  // spots arranged like a bunch, not a line
  var spots = [
    { left: 88,  top: 25, rot: -6  },
    { left: 118, top: 20, rot: 5   },
    { left: 73,  top: 42, rot: -12 },
    { left: 133, top: 42, rot: 10  },
    { left: 101, top: 8,  rot: 2   },
    { left: 58,  top: 70, rot: -16 },
    { left: 145, top: 70, rot: 14  },
    { left: 83,  top: 58, rot: -8  }
  ];
  // god i hate js sooo fkin mucx
  allFlowers = shuffle(allFlowers);
  var count = allFlowers.length;
  for (var j = 0; j < count; j++) {
    var img = document.createElement('img');
    img.className = 'preview-flower';
    img.src = './' + allFlowers[j] + '.png.png';
    img.alt = allFlowers[j];

    var spot = spots[j % spots.length];
    var extra = Math.floor(j / spots.length) * 8;

    img.style.left = (spot.left + extra) + 'px';
    img.style.top = (spot.top - extra) + 'px';
    img.style.transform = 'rotate(' + spot.rot + 'deg)';
    img.style.zIndex = j;

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

  var params = new URLSearchParams({ to: to, from: from, msg: msg, flowers: flowers });
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