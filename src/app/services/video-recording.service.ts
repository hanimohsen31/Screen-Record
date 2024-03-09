import { Injectable, EventEmitter } from '@angular/core';
import RecordRTC from 'recordrtc';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoRecordingService {
  recorder: any;

  mediaStream: any;
  mediaStream$ = new Subject<any>();
  getMediaStream = this.mediaStream$.asObservable();

  audioStream: any;
  audioStream$ = new Subject<any>();

  isMutedMicrophone = new BehaviorSubject<any>(true);
  isMutedMicrophone$ = this.isMutedMicrophone.asObservable();

  blob: any;
  blob$ = new Subject<any>();
  getBlob = this.blob$.asObservable();

  buttonsStatus = new BehaviorSubject<any>({});
  buttonsStatus$ = this.buttonsStatus.asObservable();
  buttonsStatusChange(prop: string) {
    let status = {
      NONE: false,
      RECORDING: false,
      RECORDED: false,
      CHOOSE: false,
    };
    if (prop == 'NONE') {
      status.NONE = true;
    }
    if (prop == 'RECORDING') {
      status.RECORDING = true;
    }
    if (prop == 'RECORDED') {
      status.RECORDED = true;
    }
    if (prop == 'CHOOSE') {
      status.CHOOSE = true;
    }
    this.buttonsStatus.next(status);
  }

  audioConstraints = {
    echoCancellation: false,
    noiseSuppression: false,
    audio: true,
  };

  videoConstraints = {
    frameRate: 30,
    video: true,
  };

  async startRecording() {
    try {
      // Capture microphone audio
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: this.audioConstraints,
        video: false,
      });
      // Capture screen
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: this.audioConstraints,
        video: this.videoConstraints,
      });
      // Create an audio context to ecco mic as device sound
      const audioContext = new window.AudioContext();
      const source = audioContext.createMediaStreamSource(this.audioStream);
      this.isMutedMicrophone$.subscribe({
        next: (res: any) =>
          !res ? source.connect(audioContext.destination) : source.disconnect(),
      });
      // push to subject
      this.mediaStream$.next(this.mediaStream);
      this.recorder = new RecordRTC(this.mediaStream, { type: 'video' });
      let record = this.recorder;
      const originalFunction = record.stopRecording;
      record.stopRecording = function () {
        originalFunction.apply(this, arguments);
      };
      const videoTrack = this.mediaStream.getVideoTracks()[0];
      videoTrack.addEventListener('ended', () => {
        source.disconnect();
        this.stopRecording();
        this.buttonsStatusChange('RECORDED');
      });
      // start recording
      this.buttonsStatusChange('RECORDING');
      this.recorder.startRecording();
    } catch (error) {
      this.buttonsStatusChange('NONE');
    }
  }

  stopRecording() {
    if (!this.recorder) {
      return;
    }
    this.recorder.stopRecording(() => {
      this.blob = this.recorder.getBlob();
      console.log(this.blob);
      this.blob$.next(URL.createObjectURL(this.blob));
      this.mediaStream.stop();
      this.recorder.destroy();
      this.mediaStream = null;
      this.recorder = null;
    });
    this.buttonsStatusChange('RECORDED');
  }

  downloadRecording() {
    RecordRTC.invokeSaveAsDialog(this.blob, 'Recorded.webm');
  }

  clearRecording() {
    this.blob = null;
    this.recorder = null;
    this.mediaStream = null;
    this.buttonsStatusChange('NONE');
  }
}
