/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-03 16:48:41
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-03 17:48:52
 */

import * as THREE from 'three';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

// add dom
var canvas = document.createElement('canvas');
var context = canvas.getContext('webgl2', { alpha: false });
var renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// init scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera);
var controls = new TrackballControls(camera, renderer.domElement);

// add light
var light_a = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(light_a);
var light = new THREE.PointLight(0xFFFFFF, 0.5);
camera.add(light);

var box_min = new THREE.Vector3(Infinity, Infinity, Infinity);
var box_max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

// add geometry
const objLoader = new OBJLoader2();
objLoader.load('data/bunny.obj', (root) => {
  console.log('loading...');
  root.traverse(function (child) {
    if (child.type === 'Mesh') {
      (<THREE.Mesh>child).geometry.computeBoundingBox();
      // let helper = new THREE.Box3Helper(child.geometry.boundingBox, 0xffff00);
      // scene.add(helper);
      box_min.x = Math.min((<THREE.Mesh>child).geometry.boundingBox.min.x, box_min.x);
      box_min.y = Math.min((<THREE.Mesh>child).geometry.boundingBox.min.y, box_min.y);
      box_min.z = Math.min((<THREE.Mesh>child).geometry.boundingBox.min.z, box_min.z);
      box_max.x = Math.max((<THREE.Mesh>child).geometry.boundingBox.max.x, box_max.x);
      box_max.y = Math.max((<THREE.Mesh>child).geometry.boundingBox.max.y, box_max.y);
      box_max.z = Math.max((<THREE.Mesh>child).geometry.boundingBox.max.z, box_max.z);
    }
  });
  scene.add(root);

  // set camera
  reset_camera();
});

function reset_camera() {
  console.log("Scene box min : " + box_min.x + " , " + box_min.y + " , " + box_min.z);
  console.log("Scene box max : " + box_max.x + " , " + box_max.y + " , " + box_max.z);
  let scene_box = new THREE.Box3(box_min, box_max);
  let scene_center: THREE.Vector3, scene_size: THREE.Vector3;
  scene_center = scene_box.getCenter(scene_center);
  scene_size = scene_box.getSize(scene_size);
  let fov_y = scene_size.y;
  if (scene_size.x / scene_size.y > camera.aspect) {
    fov_y = scene_size.x / camera.aspect;
  }
  camera.position.x = scene_center.x;
  camera.position.y = scene_center.y;
  camera.position.z = box_max.z + fov_y;
  camera.updateProjectionMatrix();
  controls.target = scene_center;
  controls.update();
}

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