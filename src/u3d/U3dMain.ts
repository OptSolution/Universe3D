/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-04 20:01:02
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-15 21:03:23
 */

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import THREE = require('three');
import { U3dUI } from './ui/u3dUI'
import { U3dModelMenu } from './ui/u3dModelMenu';

export class U3dMain {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  control: TrackballControls;
  box_min: THREE.Vector3;
  box_max: THREE.Vector3;
  gui: U3dUI;

  constructor() {
    this.gui = new U3dUI();
    this.init();
  }

  private init() {
    // add dom
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('webgl2', { alpha: false });
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // init scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene.add(this.camera);
    this.control = new TrackballControls(this.camera, this.renderer.domElement);
    this.gui.addScene(this.scene);

    // add light
    var light_a = new THREE.AmbientLight(0xFFFFFF, 0.2);
    this.scene.add(light_a);
    var light = new THREE.PointLight(0xFFFFFF, 0.5);
    this.camera.add(light);

    // init scene box
    this.box_min = new THREE.Vector3(Infinity, Infinity, Infinity);
    this.box_max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  }

  // event when window resize
  onresize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.control.update();
  }

  addMesh(mesh: THREE.Mesh, filename: string) {
    this.scene.add(mesh);
    this.gui.addModel(mesh, filename);
  }

  addOBJ(obj: THREE.Object3D, filename: string) {
    this.scene.add(obj);
    this.gui.addOBJ(obj, filename);
  }
}