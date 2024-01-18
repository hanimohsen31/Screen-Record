import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-design1',
  standalone: true,
  imports: [NavbarComponent, HeaderComponent],
  templateUrl: './design1.component.html',
  styleUrl: './design1.component.scss',
})
export class Design1Component {}
