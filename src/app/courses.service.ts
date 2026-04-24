import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Course {
  id: number;
  title: string;
  category: string;
  duration: number;
}

const INITIAL_COURSES: Course[] = [
  { id: 1, title: 'Angular Basics', category: 'Frontend', duration: 40 },
  { id: 2, title: 'RxJS Mastery', category: 'Frontend', duration: 35 },
  { id: 3, title: 'TypeScript Fundamentals', category: 'Programming', duration: 30 },
  { id: 4, title: 'Node.js API Development', category: 'Backend', duration: 45 },
  { id: 5, title: 'SQL for Developers', category: 'Database', duration: 28 },
  { id: 6, title: 'System Design Essentials', category: 'Architecture', duration: 32 }
];

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private readonly coursesSubject = new BehaviorSubject<Course[]>(INITIAL_COURSES);

  /** Поточний список курсів як Observable */
  readonly courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  addCourse(data: Omit<Course, 'id'>): void {
    const current = this.coursesSubject.getValue();
    const nextId = current.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    this.coursesSubject.next([...current, { ...data, id: nextId }]);
  }

  removeCourse(id: number): void {
    const current = this.coursesSubject.getValue();
    this.coursesSubject.next(current.filter((c) => c.id !== id));
  }
}
