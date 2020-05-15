/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-04 20:01:02
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-16 01:13:12
 */

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import THREE = require('three');
import { U3dUI } from './ui/u3dUI'
import { U3dLightMenu } from './ui/u3dLightMenu';

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
    this.initLight();

    // init scene box
    this.box_min = new THREE.Vector3(Infinity, Infinity, Infinity);
    this.box_max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  }

  private initLight() {
    // init ambient light
    {
      let light_ambient_config = new U3dLightMenu();
      light_ambient_config.Intensity = 0.2;
      let color = parseInt(light_ambient_config.Color.replace('#', '0x'), 16);
      let light_ambient = new THREE.AmbientLight(color, light_ambient_config.Intensity);
      this.scene.add(light_ambient);
      this.gui.addLight(light_ambient_config, light_ambient);
    }

    // init point light
    {
      let light_point_config = new U3dLightMenu();
      light_point_config.Type = 'PointLight';
      light_point_config.Intensity = 0.5;
      light_point_config.Bind = 'Camera';
      let color = parseInt(light_point_config.Color.replace('#', '0x'), 16);
      let light_point = new THREE.PointLight(color, light_point_config.Intensity);
      this.camera.add(light_point);
      this.gui.addLight(light_point_config, light_point);
    }
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