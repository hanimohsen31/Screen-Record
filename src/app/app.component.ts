import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CounterService } from './services/counter.service';
import { RecorderComponent } from './recorder/recorder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, RecorderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'screen-recorder';

  constructor(private CounterService: CounterService) {}

  ngOnInit() {
    this.CounterService.handleCounter();
  }
}
