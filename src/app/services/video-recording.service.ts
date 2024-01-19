import { Injectable, EventEmitter } from '@angular/core';
import RecordRTC from 'recordrtc';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoRecordingService {
  mediaStream: any;
  recorder: any;
  blob: any;
  mediaStream$ = new Subject<any>();
  blob$ = new Subject<any>();
  myFunctionEvent: EventEmitter<void> = new EventEmitter<void>();
  buttonsStatus = new BehaviorSubject({
    NONE: true,
    RECORDING: false,
    RECORDED: false,
  });
  buttonsStatus$ = this.buttonsStatus.asObservable();

  getMediaStream() {
    return this.mediaStream$.asObservable();
  }

  getBlob() {
    return this.blob$.asObservable();
  }

  startRecording() {
    this.handleRecording();
  }

  async handleRecording() {
    try {
      const audioConstraints = {
        echoCancellation: false,
        noiseSuppression: false,
        // sampleRate: 44100, // Adjust this based on your requirements
        sampleRate: 128000,
        desiredSampRate: 128000,
        // bufferSize: 360000,
        bitrate: 128000,
        // bitsPerSecond: 128000,
      };

      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: audioConstraints,
        video: true,
      });

      this.mediaStream$.next(this.mediaStream);
      this.recorder = new RecordRTC(this.mediaStream, { type: 'video' });

      let myObject = this.recorder;
      const originalFunction = myObject.stopRecording;
      myObject.stopRecording = function () {
        originalFunction.apply(this, arguments);
      };

      const videoTrack = this.mediaStream.getVideoTracks()[0];

      videoTrack.addEventListener('ended', () => {
        this.stopRecording();
        this.buttonsStatus.next({
          NONE: false,
          RECORDING: false,
          RECORDED: true,
        });
      });

      this.recorder.startRecording();
    } catch (error) {
      console.error(error);
      this.buttonsStatus.next({
        NONE: true,
        RECORDING: false,
        RECORDED: false,
      });
    }
  }

  stopRecording() {
    if (!this.recorder) {
      return;
    }
    this.recorder.stopRecording(() => {
      this.blob = this.recorder.getBlob();
      this.blob$.next(URL.createObjectURL(this.blob));
      this.mediaStream.stop();
      this.recorder.destroy();
      this.mediaStream = null;
      this.recorder = null;
    });
  }

  downloadRecording() {
    RecordRTC.invokeSaveAsDialog(this.blob, 'Recorded.webm');
  }

  clearRecording() {
    this.blob = null;
    this.recorder = null;
    this.mediaStream = null;
  }
}
