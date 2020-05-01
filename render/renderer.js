// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var THREE = require('three');
var TrackballControls = require('three/examples/js/controls/TrackballControls');
var OBJLoader = require('three/examples/js/loaders/OBJLoader');

// add dom
var canvas = document.createElement('canvas');
var context = canvas.getContext('webgl2', { alpha: false });
var renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// init scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var controls = new THREE.TrackballControls(camera, renderer.domElement);

// add light
var light = new THREE.DirectionalLight(0xFFFFFF, 0.3);
light.position.set(-1, 2, 4);
scene.add(light);
var light_a = new THREE.AmbientLight(0xFFFFFF, 0.3);
scene.add(light_a);

// add geometry
const objLoader = new THREE.OBJLoader();
objLoader.load('data/bunny.obj', (root) => {
    var this_material = new THREE.MeshNormalMaterial();
    root.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = this_material;
        }
    });
    scene.add(root);
});

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