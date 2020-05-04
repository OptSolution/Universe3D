/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-03 16:48:41
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-04 22:03:47
 */

import U3D = require('./u3d/u3d');

var u3dMain: U3D.U3dMain = new U3D.U3dMain();
animate();
U3D.U3dLoader.loadOBJ(u3dMain);

window.onresize = function () {
  u3dMain.renderer.setSize(window.innerWidth, window.innerHeight);
  u3dMain.camera.aspect = window.innerWidth / window.innerHeight;
  u3dMain.camera.updateProjectionMatrix();
  u3dMain.control.update();
}

function animate() {
  requestAnimationFrame(animate);
  u3dMain.control.update();
  u3dMain.renderer.render(u3dMain.scene, u3dMain.camera);
}
