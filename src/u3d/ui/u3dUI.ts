/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-14 20:55:40
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-15 14:39:04
 */
import dat = require('dat.gui');
import THREE = require('three');
import { U3dSceneMenu } from './u3dSceneMenu'
import { U3dModelMenu } from "./u3dModelMenu";

export class U3dUI {
  gui: dat.GUI;
  modelFolder: dat.GUI;
  sceneFolder: dat.GUI;
  lightsFolder: dat.GUI;

  private sceneMenu: U3dSceneMenu;

  constructor() {
    this.gui = new dat.GUI();
    this.modelFolder = this.gui.addFolder('Models');
    this.sceneFolder = this.gui.addFolder('Scene');
    this.lightsFolder = this.gui.addFolder('Lights');

    this.modelFolder.open();

    this.sceneMenu = new U3dSceneMenu();
  }

  addScene(scene: THREE.Scene) {
    // background
    this.sceneFolder.addColor(this.sceneMenu, 'Background').onChange((colorValue) => {
      colorValue = parseInt(colorValue.replace('#', '0x'), 16);
      scene.background = new THREE.Color(colorValue);
    });

    // axis
    let axesHelper = new THREE.AxesHelper(this.sceneMenu.AxisLength);
    axesHelper.visible = this.sceneMenu.ShowAxis;
    scene.add(axesHelper);
    let axisFolder = this.sceneFolder.addFolder('Axis');
    axisFolder.add(this.sceneMenu, 'ShowAxis').onChange((show) => {
      axesHelper.visible = show;
    });
    axisFolder.add(this.sceneMenu, 'AxisLength').onChange((length) => {
      axesHelper.scale.x = length;
      axesHelper.scale.y = length;
      axesHelper.scale.z = length;
    });

    // grid
    let gridHelper = new THREE.GridHelper(this.sceneMenu.gridSize, this.sceneMenu.gridDivisions);
    gridHelper.visible = this.sceneMenu.ShowGrid;
    scene.add(gridHelper);
    let gridFolder = this.sceneFolder.addFolder('Grid');
    gridFolder.add(this.sceneMenu, 'ShowGrid').onChange((show) => {
      gridHelper.visible = show;
    });
  }

  addModel(mesh: THREE.Mesh, filename: string) {
    let this_folder = this.modelFolder.addFolder(filename);
    let this_model = new U3dModelMenu();

    let vMenu = this_folder.add(this_model, 'Vertices');
    let fMenu = this_folder.add(this_model, 'Faces');
    if (mesh.geometry.type === 'Geometry') {
      vMenu.domElement.innerHTML = String((<THREE.Geometry>mesh.geometry).vertices.length);
      fMenu.domElement.innerHTML = String((<THREE.Geometry>mesh.geometry).faces.length);
    } else if (mesh.geometry.type === 'BufferGeometry') {
      vMenu.domElement.innerHTML = String((<THREE.BufferGeometry>mesh.geometry).getAttribute('position').count);
      fMenu.domElement.innerHTML = String((<THREE.BufferGeometry>mesh.geometry).index.count / 3);
    }

    this_folder.add(this_model, 'Visible').onChange((v) => {
      mesh.visible = v;
    })
  }
}