var params=new URLSearchParams(window.location.search);
var to= params.get('to');
var from=params.get('from');
var msg= params.get('msg');
var flowersParam = params.get('flowers');
var posParam = params.get('pos');
var savedPositions = {};
if (posParam) {
  try { savedPositions = JSON.parse(posParam); } catch(e) {}
}

var toEl=document.getElementById('view-to');
var msgEl= document.getElementById('view-msg');
var fromEl=document.getElementById('view-from');
toEl.textContent = to ? 'for ' + to : 'for you';
msgEl.textContent = msg || '';
fromEl.textContent = from ? '— ' + from : '';

var picked = {};
if (flowersParam) {
    var parts= flowersParam.split(',');
    //thas a cayoot face
    for (var i=0; i < parts.length; i++) {
        var match =parts[i].match(/^(.+)x(\d+)$/);
        if (match) {
            picked[match[1]] = parseInt(match[2], 10);
    }
}
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[r];
    arr[r] = temp;
  }
  return arr;

    }

    var spots = [
  { left: 88,  top: 25, rot: -6  },
  { left: 118, top: 20, rot: 5   },
  { left: 73,  top: 42, rot: -12 },
  { left: 133, top: 42, rot: 10  },
  { left: 101, top: 8,  rot: 2   },
  { left: 58,  top: 90, rot: -16 },
  { left: 145, top: 90, rot: 14  },
  { left: 83,  top: 58, rot: -8  }
];

var allFlowers = [];
for (var flower in picked) {
  for (var i = 0; i < picked[flower]; i++) {
    allFlowers.push(flower);
}
}
allFlowers=shuffle(allFlowers);

var previewEl=document.getElementById('preview');
var container= document.createElement('div');
container.className='flowers-layer';

for (var j = 0; j< allFlowers.length; j++) {
    var img =document.createElement('img');
    img.className = 'preview-flower';
    img.src= './' + allFlowers[j] + '.png.png';
    img.alt= allFlowers[j];
    var key = allFlowers[j] + '-' + j;
  var saved = savedPositions[key];
  var spot = spots[j % spots.length];

  img.style.left = (saved ? saved.left : spot.left) + 'px';
  img.style.top = (saved ? saved.top : spot.top) + 'px';
    img.style.transform= 'rotate(' + spot.rot +'deg)';
    img.style.zIndex = j;

    container.appendChild(img);
}
previewEl.appendChild(container);