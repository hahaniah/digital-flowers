const picked = {};

const previewEl = document.getElementById('preview');
const emptyMsg = document.getElementById('empty-msg');

document.querySelectorAll('.flower-opt').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var flower = btn.dataset.flower;

    if (picked[flower]) {
      picked[flower]--;
      if (picked[flower] === 0) {
        delete picked[flower];
        btn.classList.remove('selected');
      }
    } else {
      picked[flower] = 1;
      btn.classList.add('selected');
    }

    updatePreview();
  });

  btn.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var flower = btn.dataset.flower;
    if (!picked[flower]) return;
    picked[flower]--;
    if (picked[flower] === 0) {
      delete picked[flower];
      btn.classList.remove('selected');
    }
    updatePreview();
  });
});

function updatePreview() {
  previewEl.querySelectorAll('.preview-flower').forEach(function(el) {
    el.remove();
  });

  var total = 0;
  for (var f in picked) total += picked[f];

  if (total === 0) {
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';

  for (var flower in picked) {
    for (var i = 0; i < picked[flower]; i++) {
      var img = document.createElement('img');
      img.className = 'preview-flower';
      img.src = './' + flower + '.png.png';
      img.alt = flower;
      previewEl.appendChild(img);
    }
  }
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
  var link = location.origin + '/view.html?' + params.toString();

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