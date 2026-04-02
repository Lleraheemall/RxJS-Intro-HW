import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { Course, CoursesService } from './courses.service';

@Component({
  selector: 'app-courses-manager-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courses.page.html',
  styleUrl: './courses.page.css'
})
export class CoursesManagerPageComponent implements OnInit, OnDestroy {
  private readonly coursesService = inject(CoursesService);
  private readonly fb = inject(FormBuilder);

  courses$!: Observable<Course[]>;
  searchControl = this.fb.control('');

  addForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    duration: [1, [Validators.required, Validators.min(1)]]
  });

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.courses$ = combineLatest([
      this.coursesService.courses$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([courses, term]) => {
        const q = (term ?? '').trim().toLowerCase();
        if (!q) return courses;
        return courses.filter((c) => c.title.toLowerCase().includes(q));
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
