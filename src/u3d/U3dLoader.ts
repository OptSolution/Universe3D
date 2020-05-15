/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-04 21:24:50
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-15 21:23:35
 */
import { U3dMain } from "./U3dMain";
import THREE = require("three");
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

class loadBar {
  File: string;
  Loading: number;
  constructor() {
    this.File = '';
    this.Loading = 0;
  }
}

export namespace U3dLoader {
  function resetCamera(u3d: U3dMain) {
    console.log("Scene box min : " + u3d.box_min.x + " , " + u3d.box_min.y + " , " + u3d.box_min.z);
    console.log("Scene box max : " + u3d.box_max.x + " , " + u3d.box_max.y + " , " + u3d.box_max.z);
    let scene_box = new THREE.Box3(u3d.box_min, u3d.box_max);
    let scene_center: THREE.Vector3, scene_size: THREE.Vector3;
    scene_center = scene_box.getCenter(scene_center);
    scene_size = scene_box.getSize(scene_size);
    let fov_y = scene_size.y;
    if (scene_size.x / scene_size.y > u3d.camera.aspect) {
      fov_y = scene_size.x / u3d.camera.aspect;
    }
    u3d.camera.position.x = scene_center.x;
    u3d.camera.position.y = scene_center.y;
    u3d.camera.position.z = u3d.box_max.z + fov_y;
    u3d.camera.updateProjectionMatrix();
    u3d.control.target = scene_center;
    u3d.control.update();
  }

  function filename(path: string): string {
    let file = path.replace(/(.*\/)*([^.]+).*/ig, "$2") + '.' + path.replace(/.+\./, "");
    return file;
  }

  function updateBOX(u3d: U3dMain, geometry: THREE.Geometry | THREE.BufferGeometry) {
    geometry.computeBoundingBox();
    // let helper = new THREE.Box3Helper(geometry.boundingBox, 0xffff00);
    // u3d.scene.add(helper);
    u3d.box_min.x = Math.min(geometry.boundingBox.min.x, u3d.box_min.x);
    u3d.box_min.y = Math.min(geometry.boundingBox.min.y, u3d.box_min.y);
    u3d.box_min.z = Math.min(geometry.boundingBox.min.z, u3d.box_min.z);
    u3d.box_max.x = Math.max(geometry.boundingBox.max.x, u3d.box_max.x);
    u3d.box_max.y = Math.max(geometry.boundingBox.max.y, u3d.box_max.y);
    u3d.box_max.z = Math.max(geometry.boundingBox.max.z, u3d.box_max.z);
  }

  export function load(path: string, u3d: U3dMain) {
    let index = path.lastIndexOf(".");
    let ext = path.substr(index + 1);
    if (ext === 'obj') {
      loadOBJ(path, u3d);
    } else if (ext === 'ply') {
      loadPLY(path, u3d);
    } else {
      alert('Cannot load ' + path);
    }
  }

  function loadOBJ(path: string, u3d: U3dMain) {
    // add geometry
    const objLoader = new OBJLoader2();
    objLoader.setUseIndices(true);
    let name = filename(path);

    // gui for loading
    let loadingFolder = u3d.gui.modelFolder.addFolder('Loading');
    let loadingMenu = new loadBar();
    loadingFolder.add(loadingMenu, 'File').domElement.innerHTML = name;
    loadingFolder.add(loadingMenu, 'Loading', 0, 100).listen();
    loadingFolder.open();

    objLoader.load(path, (root) => {
      console.log('loading...');
      console.log(root);
      root.traverse(function (child) {
        if (child.type === 'Mesh') {
          updateBOX(u3d, (<THREE.Mesh>child).geometry);
        }
      });

      loadingFolder.parent.removeFolder(loadingFolder);
      u3d.addOBJ(root, name);
      // set camera
      resetCamera(u3d);
    }, (xhr) => {
      let process = xhr.loaded / xhr.total * 100
      loadingMenu.Loading = process;
      console.log(process + '% loaded');
    }, (err) => {
      console.error(err.message);
    });
  }

  function loadPLY(path: string, u3d: U3dMain) {
    const plyloader = new PLYLoader();
    let name = filename(path);

    // gui for loading
    let loadingFolder = u3d.gui.modelFolder.addFolder('Loading');
    let loadingMenu = new loadBar();
    loadingFolder.add(loadingMenu, 'File').domElement.innerHTML = name;
    loadingFolder.add(loadingMenu, 'Loading', 0, 100).listen();
    loadingFolder.open();

    plyloader.load(path, (geometry) => {
      console.log('loading...');
      updateBOX(u3d, geometry);
      geometry.computeVertexNormals();
      let material = new THREE.MeshStandardMaterial({ color: 0xDCF1FF, vertexColors: true });
      let mesh = new THREE.Mesh(geometry, material);

      loadingFolder.parent.removeFolder(loadingFolder);
      u3d.addMesh(mesh, name);
      resetCamera(u3d);
    }, (xhr) => {
      let process = xhr.loaded / xhr.total * 100
      loadingMenu.Loading = process;
      console.log(process + '% loaded');
    }, (err) => {
      console.error(err.message);
    })
  }
}