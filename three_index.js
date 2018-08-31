var threeCanvas = document.getElementById("threeCanvas");
var scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load("img/purple-grad.jpg");
var camera = new THREE.PerspectiveCamera( 75,  threeCanvas.offsetWidth/threeCanvas.offsetHeight, 0.1, 1000 );

var particleCount = 80,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      size: 20,
      map: new THREE.TextureLoader().load("img/particle-white.png"),
      blending: THREE.AdditiveBlending,
      color: 0xFF0000,
      transparent: true
    });

for ( var p = 0; p < particleCount; p++ )
{
    var pX = Math.random() * 500 - 250,
        pY = Math.random() * 500 - 250,
        pZ = Math.random() * 500 - 250,
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

var renderer = new THREE.WebGLRenderer();
renderer.antialias = true;
renderer.setSize( threeCanvas.offsetWidth, threeCanvas.offsetHeight );
threeCanvas.appendChild( renderer.domElement );

var loader = new THREE.FontLoader();
var geometry, textMesh, textMaterial;
loader.load( 'font/Tw Cen MT_Regular.json', function ( font ){
  geometry = new THREE.TextGeometry( "CS11",
  {
    font: font,
    size: 80,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 5,
    bevelSize: 3,
    bevelSegments: 5
  } );
  textMaterial = new THREE.MeshNormalMaterial(); // new THREE.MeshLambertMaterial( { color: 0x00ff00 });
  textMesh = new THREE.Mesh( geometry, textMaterial );
  scene.add( textMesh );
  animate();
});

for(var i = 0; i < 10; i++){
  var sphereGeo = new THREE.SphereGeometry(80, 32, 32);
  var sphereMaterial = new THREE.MeshNormalMaterial();
  var sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial);
  sphereMesh.position.x = i * 80;
  scene.add(sphereMesh);
}

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
scene.add( ambientLight );

camera.position.z = 300;
camera.position.x = 100;
camera.position.y = 30;

function animate() {
  textMesh.rotation.x += 0.01;
  textMesh.rotation.y += 0.01

  particleSystem.rotation.y += 0.01;

  var pCount = particleCount;
  while (pCount--) {
    var particle = particles.vertices[pCount];

    if (particle.y < -200)
    {
        particle.y = 200;
        particle.velocity.y = 0;
    }

    particle.velocity.y -= Math.random() * 0.01;
    particle.velocity.x -= Math.random() * 0.01;
    particle.add(particle.velocity);
  }

  particleSystem.geometry.verticesNeedUpdate = true;

  renderer.render( scene, camera );

  requestAnimationFrame( animate );
}
