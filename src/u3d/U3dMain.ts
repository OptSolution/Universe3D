/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-04 20:01:02
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-16 12:54:08
 */

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import THREE = require('three');
import { U3dUI } from './ui/u3dUI'
import { U3dLightMenu, U3dAddLightMenu } from './ui/u3dLightMenu';

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
    this.addLightMenu();
    // init ambient light
    {
      let light_ambient_config = new U3dLightMenu();
      light_ambient_config.Intensity = 0.2;
      this.newLightByConfig(light_ambient_config);
    }

    // init point light
    {
      let light_point_config = new U3dLightMenu();
      light_point_config.Type = 'PointLight';
      light_point_config.Intensity = 0.5;
      light_point_config.Bind = 'Camera';
      this.newLightByConfig(light_point_config);
    }
  }

  private addLightMenu() {
    let addLightButton = new U3dAddLightMenu();
    let lightConfig = new U3dLightMenu();
    let addLightFolder: dat.GUI;

    // controll
    let type_controll: dat.GUIController;
    let bind_controll: dat.GUIController;
    let cancel_controll: dat.GUIController;
    let next_controll: dat.GUIController;

    // add button
    addLightButton.Cancel = () => {
      lightConfig = new U3dLightMenu();
      addLightFolder.parent.removeFolder(addLightFolder);
    }
    addLightButton.Save = () => {
      addLightFolder.parent.removeFolder(addLightFolder);
      this.newLightByConfig(lightConfig);
      lightConfig = new U3dLightMenu();
    }
    addLightButton.Next = () => {
      addLightFolder.remove(type_controll);
      addLightFolder.remove(bind_controll);
      addLightFolder.remove(cancel_controll);
      addLightFolder.remove(next_controll);

      // only can bind on scene
      if (lightConfig.Type === 'AmbientLight') {
        lightConfig.Bind = 'Scene';
      }

      // common
      addLightFolder.addColor(lightConfig, 'Color');
      addLightFolder.add(lightConfig, 'Intensity');

      // each
      switch (lightConfig.Type) {
        case 'PointLight':
          addLightFolder.add(lightConfig, 'Distance');
          addLightFolder.add(lightConfig, 'Decay');
          if (lightConfig.Bind === 'Scene') {
            addLightFolder.add(lightConfig, 'Position_x');
            addLightFolder.add(lightConfig, 'Position_y');
            addLightFolder.add(lightConfig, 'Position_z');
          }
          break;

        default:
          break;
      }

      // button
      addLightFolder.add(addLightButton, 'Cancel');
      addLightFolder.add(addLightButton, 'Save');
    }

    // add button in lights
    addLightButton.AddLight = () => {
      addLightFolder = this.gui.lightsFolder.addFolder('Adding Light');
      type_controll = addLightFolder.add(lightConfig, 'Type', ['AmbientLight', 'PointLight']);
      bind_controll = addLightFolder.add(lightConfig, 'Bind', ['Scene', 'Camera']);
      cancel_controll = addLightFolder.add(addLightButton, 'Cancel');
      next_controll = addLightFolder.add(addLightButton, 'Next');

      addLightFolder.open();
    }
    this.gui.lightsFolder.add(addLightButton, 'AddLight');
  }

  private newLightByConfig(lightConfig: U3dLightMenu) {
    let light: THREE.Light;

    let color = parseInt(lightConfig.Color.replace('#', '0x'), 16);

    switch (lightConfig.Type) {
      case 'AmbientLight':
        light = new THREE.AmbientLight(color, lightConfig.Intensity);
        this.scene.add(light);
        break;
      case 'PointLight':
        light = new THREE.PointLight(color, lightConfig.Intensity, lightConfig.Distance, lightConfig.Decay);
        if (lightConfig.Bind === 'Camera') {
          this.camera.add(light);
        } else {
          light.position.set(lightConfig.Position_x, lightConfig.Position_y, lightConfig.Position_z);
          this.scene.add(light);
        }

      default:
        break;
    }

    this.gui.addLight(lightConfig, light);
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