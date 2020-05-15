/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-14 20:55:40
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-16 01:12:49
 */
import dat = require('dat.gui');
import THREE = require('three');
import { U3dSceneMenu } from './u3dSceneMenu'
import { U3dModelMenu } from "./u3dModelMenu";
import { U3dLightMenu } from "./u3dLightMenu";

export class U3dUI {
  mainGui: dat.GUI;
  modelFolder: dat.GUI;
  sceneFolder: dat.GUI;
  lightsFolder: dat.GUI;

  private sceneMenu: U3dSceneMenu;

  constructor() {
    this.mainGui = new dat.GUI();
    this.modelFolder = this.mainGui.addFolder('Models');
    this.sceneFolder = this.mainGui.addFolder('Scene');
    this.lightsFolder = this.mainGui.addFolder('Lights');

    this.modelFolder.open();

    this.sceneMenu = new U3dSceneMenu();
  }

  // ====================================================== //
  // ===================== Scene ========================== //
  // ====================================================== //

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

  // ====================================================== //
  // ====================== Model ========================= //
  // ====================================================== //

  private addMeshCommon(folder: dat.GUI, guiData: U3dModelMenu, mesh: THREE.Mesh) {
    // geometry
    let vMenu = folder.add(guiData, 'Vertices');
    let fMenu = folder.add(guiData, 'Faces');
    if (mesh.geometry.type === 'Geometry') {
      vMenu.domElement.innerHTML = String((<THREE.Geometry>mesh.geometry).vertices.length);
      fMenu.domElement.innerHTML = String((<THREE.Geometry>mesh.geometry).faces.length);
    } else if (mesh.geometry.type === 'BufferGeometry') {
      vMenu.domElement.innerHTML = String((<THREE.BufferGeometry>mesh.geometry).getAttribute('position').count);
      fMenu.domElement.innerHTML = String((<THREE.BufferGeometry>mesh.geometry).index.count / 3);
    }

    // visible
    folder.add(guiData, 'Visible').onChange((v) => {
      mesh.visible = v;
    })
  }

  addModel(mesh: THREE.Mesh, filename: string) {
    let this_folder = this.modelFolder.addFolder((filename + ' - ' + mesh.uuid).substr(0, 30));
    let this_model = new U3dModelMenu();

    this.addMeshCommon(this_folder, this_model, mesh);

    // remove
    this_model.Remove = () => {
      mesh.parent.remove(mesh);
      this_folder.parent.removeFolder(this_folder);
    }
    this_folder.add(this_model, 'Remove');
  }

  addOBJ(obj: THREE.Object3D, filename: string) {
    let obj_folder = this.modelFolder.addFolder((filename + ' - ' + obj.uuid).substr(0, 30));
    let obj_model = new U3dModelMenu();
    let childrenNum = obj.children.length;

    if (childrenNum === 1) {
      // only one child and it's mesh
      this.addMeshCommon(obj_folder, obj_model, <THREE.Mesh>obj.children[0]);
    } else {
      obj.traverse((child) => {
        // add each mesh
        if (child.type === 'Mesh') {
          let this_folder = obj_folder.addFolder((child.uuid).substr(0, 30));
          let this_model = new U3dModelMenu();
          this.addMeshCommon(this_folder, this_model, <THREE.Mesh>child);
          // remove mesh
          this_model.Remove = () => {
            (<THREE.Mesh>child).parent.remove(<THREE.Mesh>child);
            this_folder.parent.removeFolder(this_folder);
          }
          this_folder.add(this_model, 'Remove');
        }
      })
    }

    // remove obj
    obj_model.Remove = () => {
      obj.parent.remove(obj);
      obj_folder.parent.removeFolder(obj_folder);
    }
    obj_folder.add(obj_model, 'Remove');
  }

  // ====================================================== //
  // ====================== Light ========================= //
  // ====================================================== //
  addLight(lightConfig: U3dLightMenu, light: THREE.Light) {
    // new folder
    let lightsFolder = this.lightsFolder.addFolder((lightConfig.Type + ' - ' + light.uuid).substr(0, 30));

    // add controller
    lightsFolder.add(lightConfig, 'Bind').domElement.innerHTML = lightConfig.Bind;
    lightsFolder.addColor(lightConfig, 'Color').onChange((colorValue) => {
      colorValue = parseInt(colorValue.replace('#', '0x'), 16);
      light.color = new THREE.Color(colorValue);
    });
    lightsFolder.add(lightConfig, 'Intensity').onChange((intensity) => {
      light.intensity = intensity;
    });

    switch (light.type) {
      case 'PointLight':
        lightsFolder.add(lightConfig, 'Distance').onChange((distance) => {
          (<THREE.PointLight>light).distance = distance;
        });
        lightsFolder.add(lightConfig, 'Decay').onChange((decay) => {
          (<THREE.PointLight>light).decay = decay;
        });
        if (lightConfig.Bind === 'Scene') {
          lightsFolder.add(lightConfig, 'Position_x').onChange((x) => {
            light.position.x = x;
          });
          lightsFolder.add(lightConfig, 'Position_y').onChange((y) => {
            light.position.y = y;
          });
          lightsFolder.add(lightConfig, 'Position_z').onChange((z) => {
            light.position.z = z;
          });
        }
        break;

      default:
        break;
    }

    // remove
    lightConfig.Remove = () => {
      light.parent.remove(light);
      lightsFolder.parent.removeFolder(lightsFolder);
    }
    lightsFolder.add(lightConfig, 'Remove');
  }
}
