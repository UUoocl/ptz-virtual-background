const { contextBridge, ipcRenderer } = require('electron')
var windowId;

const cameraID =  ipcRenderer.sendSync('camera-ID');

contextBridge.exposeInMainWorld('electronAPI', {
  cameraWindow: (CameraID) => ipcRenderer.send('open-camera-window', CameraID),
  cameraPosWindow: (CameraID) => ipcRenderer.send('open-position-window', CameraID),
  getCameraId: () => ipcRenderer.send('get-cameras'),
  segmentationWindow: (CameraID) => ipcRenderer.send('open-segmentation-window', CameraID),
  moveWindowsOffScreen: () => ipcRenderer.send('move-windows-off-screen'),
  moveWindowsToPrimaryScreen: () => ipcRenderer.send('move-windows-to-primary-screen')
})

ipcRenderer.on('SET_CAMERA_SOURCE', async (event, deviceName, deviceID) => { 
  console.log(deviceID)
  var x = document.getElementById("cameras");
  var option = document.createElement("option");
  option.text = deviceName;
  option.id = deviceID;
  x.add(option);
  window.document.body.insertBefore(windowId, window.document.body.firstChild);
})