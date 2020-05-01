// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var THREE = require('three');
var OrbitControls = require('three/examples/js/controls/OrbitControls');

// add dom
var canvas = document.createElement('canvas');
var context = canvas.getContext('webgl2', { alpha: false });
var renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// init scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// add light
var light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-1, 2, 4);
scene.add(light);

// add geometry
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// set camera
camera.position.z = 5;
controls.update();

window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.update();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();