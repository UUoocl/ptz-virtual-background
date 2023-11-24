const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendCameraPositions: (CameraPositions) => ipcRenderer.send('send-camera-positions', CameraPositions)
  })

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
  await setInterval(PTZloop, 1000);
})

async function PTZset() {
    const constraints = {
        audio: false,
        video: {
          deviceId: `${cameraID}`,
          aspectRatio: 1.3333333333, 
        },
      };
    PTZstream = await navigator.mediaDevices.getUserMedia(constraints);
    let [videoTrack] = PTZstream.getVideoTracks();
    let settings = videoTrack.getSettings();
    video.srcObject = PTZstream;
    video.play(); 
}

async function PTZloop() {
    const constraints = {
        audio: false,
        video: {
          deviceId: `${cameraID}`,
          aspectRatio: 1.3333333333, 
        },
      };
    PTZstream = await navigator.mediaDevices.getUserMedia(constraints);
    let [videoTrack] = PTZstream.getVideoTracks();
    let settings = videoTrack.getSettings();
    console.log(`{"p":${settings.pan}, "t":${settings.tilt}, "z":${settings.zoom}}`);
    let logText = {"p":settings.pan, "t":settings.tilt, "z":settings.zoom};
    log(logText);
    logText = JSON.parse(`{"p":${settings.pan}, "t":${settings.tilt}, "z":${settings.zoom}}`)
    ipcRenderer.send('send-camera-positions',logText);
}

/* utils */

function log(text) {
    logs.scrollTop = 0;
    let textString = `{"p":${text.p},"t":${text.t},"z":${text.z}}`
    if (logs.firstChild && textString == logs.firstChild.textContent) {
      /* logs.firstChild.classList.toggle("again", true); */
      return;
    }
    const pre = document.createElement("pre");
    pre.textContent = `${textString}`;
    logs.insertBefore(pre, logs.firstChild);
  }