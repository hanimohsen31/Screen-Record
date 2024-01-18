import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  // Design1Component,
  // Recording1Component,
  // Recording2Component,
  // Recording3Component,
  Recording4Component,
  // Recording5Component,
} from './index';

export const modules = [
  // Design1Component,
  // Recording1Component,
  // Recording2Component,
  // Recording3Component,
  Recording4Component,
  // Recording5Component,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...modules],
  // exports: [...modules],
})
export class SharedModule {
  static modules: any;
}
