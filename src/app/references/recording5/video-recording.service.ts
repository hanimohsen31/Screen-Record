import { Injectable } from '@angular/core';
import RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoRecordingService {
  mediaStream: any;
  recorder: any;
  blob: any;
  mediaStream$ = new Subject<any>();
  blob$ = new Subject<any>();

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
    this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    this.mediaStream$.next(this.mediaStream);
    this.recorder = new RecordRTC(this.mediaStream, { type: 'video' });
    this.recorder.startRecording();
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
    RecordRTC.invokeSaveAsDialog(this.blob, `${Date.now()}.webm`);
  }

  clearRecording() {
    this.blob = null;
    this.recorder = null;
    this.mediaStream = null;
  }
}
