const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setPSVpositions: (psvPositions) => ipcRenderer.on('set-psv-positions', psvPositions)
  })