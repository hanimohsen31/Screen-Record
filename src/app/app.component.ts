import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Recording1Component } from './components/recording1/recording1.component';
import { Recording2Component } from './components/recording2/recording2.component';
import { Recording4Component } from './components/recording4/recording4.component';
// import { Recording3Component } from './components/recording3/recording3.component';
// import { ScreenRecorderModule } from './components/screen-recorder/screen-recorder.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet ,
    Recording1Component,
    Recording2Component,
    Recording4Component,
    // Recording3Component,
    // ScreenRecorderModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'screen-recorder';
}
