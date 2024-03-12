import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CounterService } from './services/counter.service';
import { RecorderComponent } from './recorder/recorder.component';
import { catchError } from 'rxjs';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    RecorderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'screen-recorder';

  constructor(private CounterService: CounterService) {}

  ngOnInit() {
    this.CounterService.handleCounter$
      .pipe(
        catchError((error) => {
          throw new Error('Get Counter Error', error);
        })
      )
      // .subscribe();
  }
}
