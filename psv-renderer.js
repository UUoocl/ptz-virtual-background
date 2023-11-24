window.electronAPI.setPSVpositions((event, value) => {
    console.log("IPC recieved!", value)

    const dataElement = document.getElementById("cameraPosition");
    dataElement.setAttribute("data-pos-p", value.p.toFixed(1));
    dataElement.setAttribute("data-pos-t", value.t.toFixed(1));
    dataElement.setAttribute("data-pos-z", value.z.toFixed(1));
})