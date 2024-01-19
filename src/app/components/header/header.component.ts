import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoRecordingService } from '../../services/video-recording.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private videoRecordingService: VideoRecordingService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  @ViewChild('videoElement') videoElement: any;
  title = 'record-rtc-screen-demo';
  videoBlobUrl: any = null;
  video: any;
  buttonsStatus = this.videoRecordingService.buttonsStatus$;

  ngOnInit() {
    this.videoRecordingService.getMediaStream().subscribe((data) => {
      this.video.srcObject = data;
      this.ref.detectChanges();
    });
    this.videoRecordingService.getBlob().subscribe((data) => {
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
    this.videoRecordingService.buttonsStatus.next({
      NONE: false,
      RECORDING: true,
      RECORDED: false,
    });
  }

  stopRecording() {
    this.videoRecordingService.stopRecording();
    this.videoRecordingService.buttonsStatus.next({
      NONE: false,
      RECORDING: false,
      RECORDED: true,
    });
  }

  downloadRecording() {
    this.videoRecordingService.downloadRecording();
  }

  clearRecording() {
    this.videoRecordingService.clearRecording();
    this.video.srcObject = null;
    this.videoBlobUrl = null;
    this.videoRecordingService.buttonsStatus.next({
      NONE: true,
      RECORDING: false,
      RECORDED: false,
    });
  }

  startNowButton() {
    let curruntStatus: any;
    this.buttonsStatus.subscribe({
      next: (res: any) => (curruntStatus = res),
    });
    curruntStatus.NONE
      ? this.startRecording()
      : curruntStatus.RECORDED
      ? this.startRecording()
      : null;
  }
}
