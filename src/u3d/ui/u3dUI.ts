/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-14 20:55:40
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-14 23:37:01
 */
import dat = require('dat.gui');
import THREE = require('three');
import { U3dSceneMenu } from './u3dSceneMenu'

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

    this.sceneMenu = new U3dSceneMenu();
  }

  addScene(scene: THREE.Scene) {
    // background
    this.sceneFolder.addColor(this.sceneMenu, 'background').onChange((colorValue) => {
      colorValue = parseInt(colorValue.replace('#', '0x'), 16);
      scene.background = new THREE.Color(colorValue);
    });

    // axis
    let axesHelper = new THREE.AxesHelper(this.sceneMenu.axisLength);
    axesHelper.visible = this.sceneMenu.showAxis;
    scene.add(axesHelper);
    let axisFolder = this.sceneFolder.addFolder('Axis');
    axisFolder.add(this.sceneMenu, 'showAxis').onChange((show) => {
      axesHelper.visible = show;
    });
    axisFolder.add(this.sceneMenu, 'axisLength').onChange((length) => {
      axesHelper.scale.x = length;
      axesHelper.scale.y = length;
      axesHelper.scale.z = length;
    });

    // grid
    let gridHelper = new THREE.GridHelper(this.sceneMenu.gridSize, this.sceneMenu.gridDivisions);
    gridHelper.visible = this.sceneMenu.showGrid;
    scene.add(gridHelper);
    let gridFolder = this.sceneFolder.addFolder('Grid');
    gridFolder.add(this.sceneMenu, 'showGrid').onChange((show) => {
      gridHelper.visible = show;
    });
  }
}