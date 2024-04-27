// const micSelect = document.querySelector("select#mic");
// const speakerSelect = document.querySelector("select#speaker");
// const cameraSelect = document.querySelector("select#camera");

const showDevices = async () => {
  const { mics, cameras, speakers } = await getDevices();
  const micSelect = document.getElementById("mic");
  const cameraSelect = document.getElementById("camera");
  const speakerSelect = document.getElementById("speaker");

  micSelect.innerHTML = "";
  cameraSelect.innerHTML = "";
  speakerSelect.innerHTML = "";

  mics.length > 0
    ? mics.forEach((m) => {
        micSelect.innerHTML += `<option value=${m.deviceId}>${m.label}</option>`;
      })
    : (micSelect.innerHTML += `<option>Choose microphone</option>`);

  cameras.length > 0
    ? cameras.forEach((c) => {
        cameraSelect.innerHTML += `<option value=${c.deviceId}>${c.label}</option>`;
      })
    : (cameraSelect.innerHTML += `<option>Choose camera</option>`);

  if (speakers.length > 0) {
    speakers.forEach((s) => {
      speakerSelect.innerHTML += `<option value=${s.deviceId}>${s.label}</option>`;
    });
  } else {
    speakerSelect.innerHTML += `<option>Choose speaker</option>`;
    audioElement.style.display = "none";
  }
};

const showAVPreview = () => {
  document.getElementById("start").style.display = "none";
  testCamera();
  testMicrophone();
};

showDevices();

navigator.mediaDevices.addEventListener("devicechange", async () => {
  await showDevices();
  showAVPreview();
});
