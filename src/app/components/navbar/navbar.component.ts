import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  redirectToWebsite(website: string) {
    website == 'linkedin' ? window.open('https://www.linkedin.com/in/haniomhsen3810/') :
    website == 'github' ? window.open('https://github.com/hanimohsen31') :
    website == 'behance' ? window.open('https://www.behance.net/hanimohsen3810') :
    null
  }
}
