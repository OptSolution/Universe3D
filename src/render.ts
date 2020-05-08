/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-03 16:48:41
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-08 17:19:23
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

window.ondragstart = (event: DragEvent) => {
  event.preventDefault();
}

window.ondragover = (event: DragEvent) => {
  event.preventDefault();
}

window.ondrop = (event: DragEvent) => {
  for (let index = 0; index < event.dataTransfer.files.length; index++) {
    const element = event.dataTransfer.files[index];
    let path = element.path;
    U3D.U3dLoader.load(path, u3dMain);
  }
}

// some function

function animate() {
  requestAnimationFrame(animate);
  u3dMain.control.update();
  u3dMain.renderer.render(u3dMain.scene, u3dMain.camera);
}

function loadFile() {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    filters: [
      { name: "Model Files", extensions: ['obj', 'ply'] },
      { name: 'All Files', extensions: ['*'] }],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      result.filePaths.forEach((path) => {
        U3D.U3dLoader.load(path.toString(), u3dMain);
      }
      )
    }
  }).catch(err => {
    console.log(err);
  });
}
