/*
 * @Description: 
 * @Author: Chen Wang
 * @Email: mr_cwang@foxmail.com
 * @Date: 2020-05-03 16:45:29
 * @LastEditors: Chen Wang
 * @LastEditTime: 2020-05-06 21:05:57
 */
// Modules to control application life and create native browser window
import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import * as path from "path";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Add mune
  const mainMenuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Universe3D",
      submenu: [
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Q",
          role: "quit"
        }
      ]
    },
    {
      label: "File",
      submenu: [
        {
          label: "Open ...",
          click() {
            mainWindow.webContents.send('action', 'openFile');
          }
        }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: 'Devtool',
          accelerator: 'CmdOrCtrl+D',
          click() {
            mainWindow.webContents.openDevTools();
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.