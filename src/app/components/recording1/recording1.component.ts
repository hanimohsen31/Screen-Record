import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-recording1',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './recording1.component.html',
})
export class Recording1Component {
  data: any[] = [];
  video: any;
  output: any;
  start: any;
  stop: any;
  anc: any;
  recorder: any;
  disable: any = true;
  count = 0;
  recordedChunks: any[] = [];
  vidOptions = {
    audioBitsPerSecond: 441000,
    videoBitsPerSecond: 2500000,
    mimeType: 'video/webm',
  };

  constructor() {}
  ngOnInit() {}

  getElements() {
    this.video = document.querySelector('.recording');
    this.output = document.querySelector('.output');
    this.start = document.querySelector('.start-btn');
    this.stop = document.querySelector('.stop-btn');
    this.anc = document.querySelector('.download-anc');
  }

  minRec() {
    this.disable = true;
    let time = 2000; // millisec
    setTimeout(() => {
      this.disable = false;
    }, time);
  }

  startRecording() {
    // In order record the screen with system audio
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
      })
      .then(async (e: any) => {
        // For recording the mic audio
        let audio = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        // this.minRec();
        this.getElements();
        // Assign the recorded mediastream to the src object
        this.video.srcObject = e;
        // Combine both video/audio stream with MediaStream object
        let combine = new MediaStream([...e.getTracks(), ...audio.getTracks()]);
        /* Record the captured mediastream with MediaRecorder constructor */
        let recorder = new MediaRecorder(combine);
        console.log(recorder);

        this.start.addEventListener('click', (e: any) => {
          // Starts the recording when clicked
          recorder.start(1000);
          alert('recording started');
          // For a fresh start
          this.data = [];
        });

        this.stop.addEventListener('click', (e: any) => {
          // Stops the recording
          recorder.stop();
          alert('recording stopped');
        });

        /* Push the recorded data to data array when data available */
        recorder.ondataavailable = (e) => {
          console.log('data available triggered ' + this.count++);
          if (e.data.size > 0) {
            this.data.push(e.data);
          }
          this.data.push(e.data);
        };

        recorder.onstop = () => {
          /* Convert the recorded audio to blob type mp4 media */
          let blobData = new Blob(this.data, { type: 'video/mp4' });
          // Convert the blob data to a url
          let url = URL.createObjectURL(blobData);
          // Assign the url to the output video tag and anchor
          console.log(url);
          this.output.src = url;
          this.anc.href = url;

          console.log('Stop called.');
        };
      })
      .catch((error) => {
        console.error('Error initializing recording:', error);
      });
  }
}
