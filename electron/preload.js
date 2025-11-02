const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  quitApp: () => ipcRenderer.send('quit-app'),
  toggleFullscreen: (isFullscreen) => ipcRenderer.send('toggle-fullscreen', isFullscreen)
})