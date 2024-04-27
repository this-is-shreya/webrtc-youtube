const instantMeter = document.querySelector("meter");
const audioInputSelect = document.querySelector("select#mic");
const videoInputSelect = document.querySelector("select#camera");

function SoundMeter(context) {
  this.context = context;
  this.instant = 0.0;

  this.script = context.createScriptProcessor(2048, 1, 1);
  const that = this;
  this.script.onaudioprocess = function (event) {
    const input = event.inputBuffer.getChannelData(0);
    let i;
    let sum = 0.0;
    for (i = 0; i < input.length; ++i) {
      sum += input[i] * input[i];
    }
    that.instant = Math.sqrt(sum / input.length);
  };
}
SoundMeter.prototype.connectToSource = function (stream, callback) {
  console.log("SoundMeter connecting");
  try {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    // necessary to make sample run, but should not be.
    this.script.connect(this.context.destination);
    if (typeof callback !== "undefined") {
      callback(null);
    }
  } catch (e) {
    console.error(e);
    if (typeof callback !== "undefined") {
      callback(e);
    }
  }
};
let meterRefresh = null;
function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  instantMeter.style.display = "block";
  window.stream = stream;
  const soundMeter = (window.soundMeter = new SoundMeter(window.audioContext));
  soundMeter.connectToSource(stream, function (e) {
    if (e) {
      alert(e);
      return;
    }
    meterRefresh = setInterval(() => {
      instantMeter.value = soundMeter.instant.toFixed(2);
    }, 200);
  });
}

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

const testMicrophone = async () => {
  try {
    console.log("audiocontext", window.audioContext);

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioContext = new AudioContext();
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const { mics } = await getDevices();
    if (mics.length > 0) {
      const audioSource = audioInputSelect?.value
        ? audioInputSelect.value
        : mics[0].deviceId;

      console.log(
        "audioSource",
        audioInputSelect.options[audioInputSelect.selectedIndex].value,
        audioSource,
        audioInputSelect.selectedIndex
      );
      const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError);
    }
  } catch (e) {
    console.error(e);
  }
};
const testCamera = async () => {
  try {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const { cameras } = await getDevices();
    if (cameras.length > 0) {
      const videoSource = videoInputSelect?.value
        ? videoInputSelect.value
        : cameras[0].deviceId;
      console.log(
        "videoSource",
        videoInputSelect.options[videoInputSelect.selectedIndex].value,
        videoSource,
        videoInputSelect.selectedIndex
      );
      const constraints = {
        video: {
          deviceId: videoSource ? { exact: videoSource } : undefined,
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          const video = document.getElementById("video");
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } catch (e) {
    console.error(e);
  }
};
audioInputSelect.addEventListener("change", testMicrophone);
videoInputSelect.addEventListener("change", testCamera);
