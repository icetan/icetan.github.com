var el = document.getElementById('icosphere');

if (!window.WebGLRenderingContext) {
  el.parentNode.removeChild(el);
  return;
}

var THREE = require('three'),
    createThing = require('./thing'),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    imageData;

canvas.width = canvas.height = 128;

function updateCanvas(min, span) {
  var shade, i;

  imageData = ctx.createImageData(canvas.width, canvas.height);
  for (i = imageData.data.length; (i-=4) >= 0;) {
    shade = ((Math.random() * span) | 0) + min;
    imageData.data[i] = shade;
    imageData.data[i+1] = shade;
    imageData.data[i+2] = shade;
    imageData.data[i+3] = 0xFF;
  }

  ctx.putImageData(imageData, 0, 0);
}

function main(el) {
  var thing = createThing(el),
      texture = new THREE.Texture(
        canvas,
        new THREE.SphericalRefractionMapping(),
        THREE.RepeatWrapping,
        THREE.RepeatWrapping
      ),
      material = new THREE.MeshBasicMaterial({
        map: texture,
        wireframe: true
      }),
      icosphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(24, 2),
        material
      );

  thing.scene.add(icosphere);
  thing.on('frame', function(frame, time) {
    if (!material.wireframe && frame % 6 === 0) {
      updateCanvas(0, 0xFF);
      texture.needsUpdate = true;
    }
    icosphere.rotation.z = icosphere.rotation.y = time/10000;
  });
  thing.start();

  el.parentNode.addEventListener('mouseover', function() {
    material.wireframe = false;
  });
  el.parentNode.addEventListener('mouseout', function() {
    material.wireframe = true;
  });
};

updateCanvas(0xF0, 0x8);
document.body.style.backgroundImage = 'url('+canvas.toDataURL()+')';

main(el);

[].slice.call(document.querySelectorAll('.tile')).forEach(function(el) {
  var interval;
  el.addEventListener('mouseover', function() {
    if (!interval) interval = setInterval(function() {
      updateCanvas(0, 0xFF);
      el.style.backgroundImage = 'url('+canvas.toDataURL()+')';
    }, 150);
  });
  el.addEventListener('mouseout', function() {
    clearInterval(interval);
    interval = null;
    el.style.backgroundImage = '';
  });
});
