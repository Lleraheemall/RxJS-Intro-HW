import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Course, CoursesService } from './courses.service';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courses.page.html',
  styleUrl: './courses.page.css'
})
export class CoursesPageComponent implements OnInit, OnDestroy {
  courses$!: Observable<Course[]>;
  searchControl = new FormControl('');

  private destroy$ = new Subject<void>();

  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    // Інітіалізуємо потік для реактивного пошуку
    this.courses$ = this.searchControl.valueChanges.pipe(
      // Затримка перед виконанням пошуку (300мс)
      debounceTime(300),
      // Пропускаємо повторні однакові значення
      distinctUntilChanged(),
      // Переключаємось на новий потік пошуку при введенні нового значення
      switchMap(searchTerm => 
        this.coursesService.searchCourses(searchTerm || '')
      ),
      // Відписуємось при знищенні компонента
      takeUntil(this.destroy$)
    );

    // Завантажуємо всі курси при першому завантаженні
    this.searchControl.setValue('');
  }

  ngOnDestroy(): void {
    // Очищуємо підписки
    this.destroy$.next();
    this.destroy$.complete();
  }
}
