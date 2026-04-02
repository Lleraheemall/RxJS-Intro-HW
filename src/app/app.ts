import { Component, signal } from '@angular/core';
import { CoursesManagerPageComponent } from './courses.page';

@Component({
  selector: 'app-root',
  imports: [CoursesManagerPageComponent],
  template: '<app-courses-manager-page></app-courses-manager-page>',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-courses-app');
}
