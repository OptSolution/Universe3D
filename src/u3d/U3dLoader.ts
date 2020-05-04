/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-04 21:24:50
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-04 21:30:48
 */
import { U3dMain } from "./U3dMain";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import THREE = require("three");

export namespace U3dLoader {
  export function resetCamera(u3d: U3dMain) {
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

  export function loadOBJ(u3d: U3dMain) {
    // add geometry
    const objLoader = new OBJLoader2();
    objLoader.load('data/bunny.obj', (root) => {
      console.log('loading...');
      root.traverse(function (child) {
        if (child.type === 'Mesh') {
          (<THREE.Mesh>child).geometry.computeBoundingBox();
          // let helper = new THREE.Box3Helper(child.geometry.boundingBox, 0xffff00);
          // scene.add(helper);
          u3d.box_min.x = Math.min((<THREE.Mesh>child).geometry.boundingBox.min.x, u3d.box_min.x);
          u3d.box_min.y = Math.min((<THREE.Mesh>child).geometry.boundingBox.min.y, u3d.box_min.y);
          u3d.box_min.z = Math.min((<THREE.Mesh>child).geometry.boundingBox.min.z, u3d.box_min.z);
          u3d.box_max.x = Math.max((<THREE.Mesh>child).geometry.boundingBox.max.x, u3d.box_max.x);
          u3d.box_max.y = Math.max((<THREE.Mesh>child).geometry.boundingBox.max.y, u3d.box_max.y);
          u3d.box_max.z = Math.max((<THREE.Mesh>child).geometry.boundingBox.max.z, u3d.box_max.z);
        }
      });
      u3d.scene.add(root);

      // set camera
      resetCamera(u3d);
    });
  }
}