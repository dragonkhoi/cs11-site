$("#aboutLink").click(function() {
    $('html, body').animate({
        scrollTop: $("#about").offset().top - 70
    }, 2000);
});

$("#assignmentsLink").click(function() {
    $('html, body').animate({
        scrollTop: $("#assignments").offset().top - 70
    }, 2000);
});

var threeCanvas = document.getElementById("threeCanvas");
var scene = new THREE.Scene();
//scene.background = new THREE.Color("#020005"); // new THREE.TextureLoader().load("img/purple-grad.jpg");
var camera = new THREE.PerspectiveCamera( 75,  threeCanvas.offsetWidth/threeCanvas.offsetHeight, 0.1, 1000 );

var particleCount = 40,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      size: 10,
      map: new THREE.TextureLoader().load("img/particle-white.png"),
      blending: THREE.AdditiveBlending,
      color: "#5f0089", //"#b144ff",
      transparent: true
    });

for ( var p = 0; p < particleCount; p++ )
{
    var pX = Math.random() * 780 - 390,
        pY = Math.random() * 780 - 390,
        pZ = Math.random() * 780 - 390,
        particle = new THREE.Vector3( pX, pY, pZ );

    particle.velocity = new THREE.Vector3( 0, -Math.random(), 0);

    particles.vertices.push( particle );
}

var particleSystem = new THREE.Points(
  particles,
  pMaterial
);

particleSystem.sortParticles = true;

scene.add(particleSystem);

var renderer = new THREE.WebGLRenderer( {alpha: true});
renderer.antialias = true;
renderer.autoclear = true;
renderer.setClearColor( 0xffffff, 0 );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( threeCanvas.offsetWidth, threeCanvas.offsetHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
threeCanvas.appendChild( renderer.domElement );

var renderScene = new THREE.RenderPass( scene, camera);

var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( threeCanvas.offsetWidth, threeCanvas.offsetHeight ), 1.5, 0.4, 0.85 );
bloomPass.renderToScreen = true;
bloomPass.threshold = 0.1;
bloomPass.strength = 1.4;
bloomPass.radius = 0.5;

composer = new THREE.EffectComposer( renderer );
composer.setSize( threeCanvas.offsetWidth, threeCanvas.offsetHeight );
composer.addPass( renderScene );
composer.addPass( bloomPass );

var loader = new THREE.FontLoader();
var pivot = new THREE.Group();
var desktopTitleString = "CS11: How to Make VR";
var phoneTitleString = "CS11:\nHow to\nMake VR";
var titleStringToShow = desktopTitleString;
var fontSize = 80;
var phoneFontSize = 60;
if (window.innerWidth < 600) {
  titleStringToShow = phoneTitleString;
  fontSize = phoneFontSize;
}

loader.load( 'font/Quicksand Light_Regular.json', function ( font ){
  var geometry = new THREE.TextGeometry( titleStringToShow,
  {
    font: font,
    size: fontSize,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 5,
    bevelSize: 3,
    bevelSegments: 10
  } );
  var textMaterial = new THREE.MeshNormalMaterial(); // new THREE.MeshLambertMaterial( { color: 0xffffff });
  textMaterial.depthWrite = false;
  var textMesh = new THREE.Mesh( geometry, textMaterial );
  var boundingBox = new THREE.Box3().setFromObject (textMesh);
  boundingBox.getCenter( textMesh.position );
  textMesh.position.multiplyScalar( -1 );
  scene.add( pivot );
  pivot.add( textMesh );
  particleSystem.position = pivot.position;
  animate();
});

// for(var i = 0; i < 10; i++){
//   var sphereGeo = new THREE.SphereGeometry(80, 32, 32);
//   var sphereMaterial = new THREE.MeshNormalMaterial();
//   var sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial);
//   sphereMesh.position.x = i * 80;
//   scene.add(sphereMesh);
// }

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );

var ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( ambientLight );

camera.position.z = 600;
camera.position.x = 10;
camera.position.y = -10;

window.onresize = function () {
  var width = threeCanvas.offsetWidth;
  var height = threeCanvas.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
  composer.setSize( width, height );
};

function animate() {
  var time = Date.now();
  var sinVal = Math.sin(time / 1500);
  pivot.position.y = sinVal * 20 * ((sinVal * 0.5) + 0.5);
  pivot.rotation.y = sinVal * 0.05;
  particleSystem.rotation.y += 0.003;

  var pCount = particleCount;
  while (pCount--) {
    var particle = particles.vertices[pCount];

    if (particle.y < -400)
    {
        particle.y = 400;
    }
    else if (particle.y > 400)
    {
      particle.y = -400;
    }
    if (particle.x < -400)
    {
      particle.x = 400;
    }
    else if (particle.x > 400)
    {
      particle.x = -400;
    }

    particle.velocity.y = Math.random() * 0.1 - 0.05;
    particle.velocity.x = Math.random() * 0.1 - 0.05;
    particle.add(particle.velocity);
  }

  particleSystem.geometry.verticesNeedUpdate = true;

  // renderer.render( scene, camera );

  composer.render();

  requestAnimationFrame( animate );
}
