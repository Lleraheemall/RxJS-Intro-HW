import { Component, signal } from '@angular/core';
import { CoursesPageComponent } from './courses.page';

@Component({
  selector: 'app-root',
  imports: [CoursesPageComponent],
  template: '<app-courses-page></app-courses-page>',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-courses-app');
}
