// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const shell = require('electron').shell
const ipc = require('electron').ipcMain

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')
  mainWindow.webContents.openDevTools()
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  var menu = Menu.buildFromTemplate([
      {
          label: 'Menu',
          submenu: [
              {label:'Adjust Notification Value'},
              {
                label:'Yandex',
                click() { 
                  shell.openExternal('http://ya.ru')
                },
                accelerator: 'CmdOrCtrl+Shift+Y'
              },
              {type:'separator'},
              {
                label:'Exit',
                click() { 
                    app.quit() 
                }
              }
          ]
      },
      {
          label: 'Info'
      }
  ])
  Menu.setApplicationMenu(menu); 

  ipc.on('update-notify-value', function (event, arg) {
    mainWindow.webContents.send('targetPriceVal', arg)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

