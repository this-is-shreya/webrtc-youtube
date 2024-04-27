/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

"use strict";

const audioOutputSelect = document.querySelector("select#speaker");
const audioElement = document.querySelector("audio");

audioOutputSelect.disabled = !("sinkId" in HTMLMediaElement.prototype);

// Attach audio output device to audio element using device/sink ID.
const attachSinkId = (element, sinkId) => {
  if (typeof element.sinkId !== "undefined") {
    element
      .setSinkId(sinkId)
      .then(() => {
        console.log(`Success, audio output device attached: ${sinkId}`);
      })
      .catch((error) => {
        let errorMessage = error;
        if (error.name === "SecurityError") {
          errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
        }
        console.error(errorMessage);
        // Jump back to first output device in the list as it's the default.
        audioOutputSelect.selectedIndex = 0;
      });
  } else {
    console.warn("Browser does not support output device selection.");
  }
};

const changeAudioDestination = () => {
  const audioDestination = audioOutputSelect.value;
  attachSinkId(audioElement, audioDestination);
};

audioOutputSelect.addEventListener("change", changeAudioDestination);
