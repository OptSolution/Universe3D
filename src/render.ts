/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-03 16:48:41
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-04 22:21:39
 */

import U3D = require('./u3d/u3d');

var u3dMain: U3D.U3dMain = new U3D.U3dMain();
animate();
window.onresize = function () {
  u3dMain.onresize();
}

// TODO : update Loader
U3D.U3dLoader.loadOBJ(u3dMain);

// some function

function animate() {
  requestAnimationFrame(animate);
  u3dMain.control.update();
  u3dMain.renderer.render(u3dMain.scene, u3dMain.camera);
}
