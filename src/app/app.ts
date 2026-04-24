import { Component } from '@angular/core';
import { CoursesFilterPageComponent } from './courses.page';

@Component({
  selector: 'app-root',
  imports: [CoursesFilterPageComponent],
  template: '<app-courses-filter-page></app-courses-filter-page>',
  styleUrl: './app.css'
})
export class App {
}
