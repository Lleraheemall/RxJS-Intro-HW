import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { Course, CoursesService } from './courses.service';

@Component({
  selector: 'app-courses-filter-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courses.page.html',
  styleUrl: './courses.page.css'
})
export class CoursesFilterPageComponent implements OnInit, OnDestroy {
  private readonly coursesService = inject(CoursesService);
  private readonly fb = inject(FormBuilder);

  courses$!: Observable<Course[]>;
  categories$!: Observable<string[]>;
  searchControl = this.fb.control('');
  categoryControl = this.fb.control('');

  addForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    duration: [1, [Validators.required, Validators.min(1)]]
  });

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    );

    const selectedCategory$ = this.categoryControl.valueChanges.pipe(startWith(''), distinctUntilChanged());

    this.categories$ = this.coursesService.courses$.pipe(
      map((courses) => Array.from(new Set(courses.map((course) => course.category))).sort())
    );

    this.courses$ = combineLatest([this.coursesService.courses$, search$, selectedCategory$]).pipe(
      map(([courses, term, category]) => {
        const q = (term ?? '').trim().toLowerCase();
        const selectedCategory = (category ?? '').trim().toLowerCase();

        return courses.filter((course) => {
          const matchesTitle = !q || course.title.toLowerCase().includes(q);
          const matchesCategory = !selectedCategory || course.category.toLowerCase() === selectedCategory;

          return matchesTitle && matchesCategory;
        });
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAdd(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    const { title, category, duration } = this.addForm.getRawValue();
    this.coursesService.addCourse({ title, category, duration });
    this.addForm.reset({ title: '', category: '', duration: 1 });
  }

  onRemove(id: number): void {
    this.coursesService.removeCourse(id);
  }
}
