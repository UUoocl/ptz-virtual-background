const { contextBridge, ipcRenderer } = require('electron');

const cameraID =  ipcRenderer.sendSync('camera-ID');
window.addEventListener('DOMContentLoaded', async () => {

//console.log("cameraID ", cameraID )

const dataElement = document.createElement(`data`);
dataElement.setAttribute("id", "cameraID");
dataElement.setAttribute("data-camera-Id", cameraID);

window.document.body.insertBefore(dataElement, window.document.body.firstChild);
//window.document.body.append(dataElem);

const video = document.querySelector("video");
console.log("cameraID ", cameraID )

  await PTZset();
})

async function PTZset() {
    const constraints = {
        audio: false,
        video: {
          deviceId: `${cameraID}`,
          aspectRatio: 1.7777777778, 
        },
      };
    PTZstream = await navigator.mediaDevices.getUserMedia(constraints);
    let [videoTrack] = PTZstream.getVideoTracks();
    let settings = videoTrack.getSettings();
    video.srcObject = PTZstream;
    video.play(); 
}