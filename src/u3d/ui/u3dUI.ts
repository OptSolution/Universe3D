/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-14 20:55:40
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-14 21:41:47
 */
import dat = require('dat.gui');
import THREE = require('three');

class U3dSceneMenu {
  background: string;
  constructor() {
    this.background = '#f0f0f0';
  }
}

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
  }
}