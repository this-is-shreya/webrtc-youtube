const getDevices = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const mics = devices.filter(
      (d) => d.kind === "audioinput" && !["", "default"].includes(d.deviceId)
    );
    const cameras = devices.filter(
      (d) => d.kind === "videoinput" && !["", "default"].includes(d.deviceId)
    );
    const speakers = devices.filter(
      (d) => d.kind === "audiooutput" && !["", "default"].includes(d.deviceId)
    );
    return { mics, cameras, speakers };
  } catch (e) {
    return { mics: [], cameras: [], speakers: [] };
  }
};
