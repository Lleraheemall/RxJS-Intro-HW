import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Course {
  id: number;
  title: string;
  category: string;
  duration: number; // в годинах
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private courses: Course[] = [
    {
      id: 1,
      title: 'Angular Basics',
      category: 'Frontend',
      duration: 40
    },
    {
      id: 2,
      title: 'RxJS Mastery',
      category: 'Advanced',
      duration: 35
    },
    {
      id: 3,
      title: 'TypeScript Fundamentals',
      category: 'Programming',
      duration: 30
    },
    {
      id: 4,
      title: 'Web API Development',
      category: 'Backend',
      duration: 45
    },
    {
      id: 5,
      title: 'Angular Advanced Patterns',
      category: 'Frontend',
      duration: 50
    },
    {
      id: 6,
      title: 'Reactive Programming',
      category: 'Advanced',
      duration: 40
    }
  ];

  constructor() { }

  /**
   * Отримати всі курси
   */
  getAllCourses(): Observable<Course[]> {
    return of(this.courses);
  }

  /**
   * Фільтрувати курси за назвою
   * @param searchTerm - пошуковий запит
   */
  searchCourses(searchTerm: string): Observable<Course[]> {
    if (!searchTerm.trim()) {
      return of(this.courses);
    }

    const filtered = this.courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return of(filtered);
  }
}
