// screen-recording.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenRecordingService {
  initializeRecording(
    video: HTMLVideoElement,
    output: HTMLVideoElement,
    startBtn: HTMLButtonElement,
    stopBtn: HTMLButtonElement,
    downloadAnc: HTMLAnchorElement,
    data: Blob[]
  ) {
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
      })
      .then(async (screenStream) => {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        video.srcObject = screenStream;

        const combinedStream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);

        const recorder = new MediaRecorder(combinedStream);

        startBtn.addEventListener('click', () => {
          recorder.start();
          alert('Recording started');
          data.length = 0; // Clear the data array for a fresh start
        });

        stopBtn.addEventListener('click', () => {
          recorder.stop();
          alert('Recording stopped');
        });

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            data.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blobData = new Blob(data, { type: 'video/mp4' });
          const url = URL.createObjectURL(blobData);

          output.src = url;
          downloadAnc.href = url;
        };
      })
      .catch((error) => {
        console.error('Error initializing recording:', error);
      });
  }
}
