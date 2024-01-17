import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import RecordRTC from 'recordrtc';

type RecordingState = 'NONE' | 'RECORDING' | 'RECORDED';

@Component({
  selector: 'app-recording4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recording4.component.html',
  providers: [],
})
export class Recording4Component {
  @ViewChild('videoElement') videoElement: any;
  title = 'record-rtc-screen-demo';
  videoBlobUrl: any = null;
  video: any;
  state: RecordingState = 'NONE';
  mediaStream: any;
  recorder: any;
  blob: any;
  mediaStream$ = new Subject<any>();
  blob$ = new Subject<any>();

  constructor(
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {

    this.mediaStream$.asObservable().subscribe((data) => {
      this.video.srcObject = data;
      this.ref.detectChanges();
    });

    this.blob$.asObservable().subscribe((data) => {
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data);
      this.video.srcObject = null;
      this.ref.detectChanges();
    });

  }

  ngAfterViewInit(): void {
    this.video = this.videoElement.nativeElement;
  }

  async startRecording() {

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
    this.recorder.startRecording();
    this.state = 'RECORDING';
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
    this.state = 'RECORDED';
  }

  downloadRecording() {
    RecordRTC.invokeSaveAsDialog(this.blob, `${Date.now()}.webm`);
  }

  clearRecording() {
    this.blob = null;
    this.recorder = null;
    this.mediaStream = null;
    this.video.srcObject = null;
    this.videoBlobUrl = null;
    this.state = 'NONE';
  }
}
