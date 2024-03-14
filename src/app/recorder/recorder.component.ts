import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoRecordingService } from '../services/video-recording.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-recorder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recorder.component.html',
  styleUrl: './recorder.component.scss',
})
export class RecorderComponent {
  constructor(private videoRecordingService: VideoRecordingService, private ref: ChangeDetectorRef, private sanitizer: DomSanitizer) {}

  @ViewChild('videoElement') videoElement: any;
  title = 'record-rtc-screen-demo';
  video: any;
  videoBlobUrl: any = null;
  buttonsStatus = this.videoRecordingService.buttonsStatus$;
  isMutedMicrophone = this.videoRecordingService.isMutedMicrophone$;

  ngOnInit() {
    this.videoRecordingService.buttonsStatusChange('NONE');
    this.videoRecordingService.getMediaStream$.subscribe((data: any) => {
      this.video.srcObject = data;
      this.ref.detectChanges();
    });
    this.videoRecordingService.getBlob$.subscribe((data: any) => {
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data);
      this.video.srcObject = null;
      this.ref.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.video = this.videoElement.nativeElement;
  }

  startRecording() {
    this.clearRecording();
    this.videoRecordingService.startRecording();
  }

  stopRecording() {
    this.videoRecordingService.stopRecording();
  }

  downloadRecording() {
    this.videoRecordingService.downloadRecording();
  }

  clearRecording() {
    this.videoRecordingService.clearRecording();
    this.video.srcObject = null;
    this.videoBlobUrl = null;
  }

  startNowButton() {
    let curruntStatus: any;
    this.buttonsStatus.subscribe({
      next: (res: any) => (curruntStatus = res),
    });
    curruntStatus.NONE ? this.startRecording() : curruntStatus.RECORDED ? this.startRecording() : null;
  }

  toggleMic() {
    let curruntStatus = this.videoRecordingService.isMutedMicrophone.getValue();
    this.videoRecordingService.isMutedMicrophone.next(!curruntStatus);
  }

  showResolutionOptions() {
    document.querySelector('.resolution-container')?.classList.toggle('resolution-options-height');
  }

  setResolution(res: number) {
    let resolution = +res * 1_000_000;
    let className;
    this.videoRecordingService.videoBitsPerSecond.next(resolution);
    document.querySelectorAll(`.res-button`)?.forEach((elm) => {
      elm.classList.remove('curunt-resolution');
    });
    res == 2.5 ? (className = '.v2\\.5') : (className = `.v${res}`);
    document?.querySelector(className)?.classList.add('curunt-resolution');
    this.showResolutionOptions();
  }
}
