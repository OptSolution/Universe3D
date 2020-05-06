/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-03 16:48:41
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-06 21:13:55
 */

import { ipcRenderer, remote } from 'electron';
import U3D = require('./u3d/u3d');

var u3dMain: U3D.U3dMain = new U3D.U3dMain();
animate();
window.onresize = function () {
  u3dMain.onresize();
}

ipcRenderer.on('action', (event, arg) => {
  switch (arg) {
    case 'openFile':
      loadFile();
      break;
  }
});

// some function

function animate() {
  requestAnimationFrame(animate);
  u3dMain.control.update();
  u3dMain.renderer.render(u3dMain.scene, u3dMain.camera);
}

function loadFile() {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    filters: [
      { name: "Model Files", extensions: ['obj'] },
      { name: 'All Files', extensions: ['*'] }],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      U3D.U3dLoader.load(result.filePaths[0].toString(), u3dMain);
    }
  }).catch(err => {
    console.log(err);
  });
}