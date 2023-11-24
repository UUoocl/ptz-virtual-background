const { contextBridge, ipcRenderer } = require('electron')

const cameraID =  ipcRenderer.sendSync('camera-ID');
console.log(cameraID)
window.addEventListener('DOMContentLoaded', () => {
    const dataElement = document.createElement(`data`);
    dataElement.setAttribute("id", "cameraID");
    dataElement.setAttribute("data-camera-Id", cameraID);
    
    window.document.body.insertBefore(dataElement, window.document.body.firstChild);
})
