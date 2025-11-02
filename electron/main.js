const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true, // 默认全屏
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

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