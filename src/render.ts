/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-03 16:48:41
 * @LastAuthor: Chen Wang
 * @lastTime: 2020-05-26 19:26:42
 */

import { ipcRenderer, remote } from 'electron';
import U3D = require('./u3d/u3d');
import fs = require('fs');

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
    case 'savePNG':
      savePNG();
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
      { name: "Model Files", extensions: ['obj', 'ply', 'pcd'] },
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

function savePNG() {
  u3dMain.renderer.render(u3dMain.scene, u3dMain.camera);
  const url = u3dMain.renderer.domElement.toDataURL();
  // window.open(url, 'shot');
  // remove Base64 stuff from the Image
  const base64Data = url.replace(/^data:image\/png;base64,/, "");
  remote.dialog.showSaveDialog(remote.getCurrentWindow(),
    {
      filters: [
        { name: 'Images', extensions: ['png'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then(result => {
      if (!result.canceled) {
        fs.writeFile(result.filePath, base64Data, 'base64', function (err) {
          console.log(err);
        });
      }
    }).catch(err => {
      console.log(err)
    });
}
