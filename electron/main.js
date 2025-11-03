const { app, BrowserWindow, ipcMain, desktopCapturer, session } = require('electron')
const path = require('node:path')

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true, // 默认全屏
    webPreferences: {
      preload: path.join(__dirname, './electron/preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      // Grant access to the first screen found.
      callback({ video: sources[0], audio: 'loopback' })
    })
    // If true, use the system picker if available.
    // Note: this is currently experimental. If the system picker
    // is available, it will be used and the media request handler
    // will not be invoked.
  }, { useSystemPicker: true })

  mainWindow.loadURL('http://localhost:3000')
}

// IPC处理
ipcMain.on('quit-app', () => {
  app.quit()
})

ipcMain.on('toggle-fullscreen', (event, isFullscreen) => {
  if (mainWindow) {
    mainWindow.setFullScreen(isFullscreen)
  }
})

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})