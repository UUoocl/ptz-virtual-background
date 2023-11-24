/* Photo-Sphere-Virtual-Background
2023 by uuoocl🪵
MIT license
An App to connect the Insta360 Link PTZ camera to the Photo-Sphere-Viewer (PSV) js libary
*/

const { app, BrowserWindow , ipcMain} = require('electron')
const path = require('path')

let cameraPosWindow, psvWindow, cameraWindow, segmentationWindow, indexWindow;

var  winCamera;

//#region create main windows
async function createWindow () {
  indexWindow = new BrowserWindow({
    width: 400,
    height: 400,
    x: 100,
    y: 100,
    title:"PSV Virtual BG Main Window",
    autoHideMenuBar: true,
    webPreferences: {
        preload: path.join(__dirname, 'index-preload.js')
      }
  })

  indexWindow.loadFile('index.html');
  //indexWindow.setPosition(0,0);
}

// open PSV window
async function createPSVwindow () {
    psvWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      x: 200,
      y: 200,
      titleBarStyle: 'customButtonsOnHover',
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'psv-preload.js')
        }
      })

      psvWindow.loadFile('psv.html');    
      //psvWindow.setPosition(500,500);;    
}

app.whenReady().then(() => {
  createWindow(),
  createPSVwindow ()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


//#endregion

//#region Open-New-windows

// open camera window
ipcMain.on('open-camera-window', (event, cameraId) => {
    cameraWindow = new BrowserWindow({
      width: 1920,
      height: 1280,
      movable: true,
      titleBarStyle: 'customButtonsOnHover',
      webPreferences: {
        preload: path.join(__dirname, 'camera-preload.js')
        }
      })
      winCamera = cameraId;

      cameraWindow.loadFile('camera.html');
      indexWindow.focus();    
})

// open camera position window
ipcMain.on('open-position-window', (event, cameraId) => {
    cameraPosWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      movable: true,
      titleBarStyle: 'customButtonsOnHover',
      webPreferences: {
        preload: path.join(__dirname, 'cameraPosition-preload.js')
        }
      })
      winCamera = cameraId;

      cameraPosWindow.loadFile('cameraPosition.html');
      indexWindow.focus();    
})

// open segmentation window
ipcMain.on('open-segmentation-window', (event, cameraId) => {
    segmentationWindow = new BrowserWindow({
      width: 1920,
      height: 1280,
      x: 0,
      y: 0,
      frame: false,
      titleBarOverlay: false,
      backgroundThrottling: false,
      transparent: true,
      titleBarStyle: 'customButtonsOnHover',
      webPreferences: {
        preload: path.join(__dirname, 'segmentation-preload.js')
        }
      })

      segmentationWindow.loadFile('segmentation.html');
      indexWindow.focus();  
  })

//#endregion

//#region IPC APIs

//send camera ID to camera window
ipcMain.on('camera-ID', (event) => {
    console.log(`sending ${winCamera} camera ID to camera window`) 
    event.returnValue = winCamera;
})

//when the camera position changes set the PSV 
//Valuies from CameraPos Window
ipcMain.on('send-camera-positions', (event, positions) => {
    console.log("sending camera positions from the camera window") ;
    console.log(positions);
    //set PSV position
    psvWindow.webContents.send('set-psv-positions', positions);
    
    
    console.log("Sent message to PSV window!", positions) 
})

//arrange windows

cameraPosWindow, psvWindow, cameraWindow, segmentationWindow
ipcMain.on('move-windows-off-screen', (event) => {
    //cascade the windows off screen
    psvWindow.setPosition(-1900, 0);
    cameraPosWindow.setPosition(-1900, 100);
    cameraWindow.setPosition(-1900, 200);
    segmentationWindow.setPosition(-1900, 300);
    psvWindow.focus();
    cameraPosWindow.focus();
    cameraWindow.focus();
    segmentationWindow.focus();
    indexWindow.focus();
})

ipcMain.on('move-windows-to-primary-screen', (event) => {
    psvWindow.setPosition(0,0);
    cameraPosWindow.setPosition(-2,0);
    cameraWindow.setPosition(-4,0);
    segmentationWindow.setPosition(-3, 0);
    psvWindow.focus();
    cameraPosWindow.focus();
    segmentationWindow.focus();
    indexWindow.focus();
})




//#endregion