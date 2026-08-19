import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface Course {
  id: number;
  code: string;
  title: string;
  description?: string;
  instructor?: string;
  credits: number;
  is_enrolled?: boolean;
  category: string;
  days?: string[];
  startTime?: string;
  endTime?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/courses';

  // Centralized Signal state for courses
  private coursesSignal = signal<Course[]>([]);

  // Exposed read-only signals for components
  readonly courses = this.coursesSignal.asReadonly();

  readonly enrolledCourses = computed(() =>
    this.coursesSignal().filter((course) => course.is_enrolled),
  );

  readonly enrolledCount = computed(() => this.enrolledCourses().length);

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(tap((data) => this.coursesSignal.set(data)));
  }

  toggleEnrollment(courseId: number): Observable<{ message: string; is_enrolled: boolean }> {
    const previousCourses = this.coursesSignal();

    // Optimistic UI update across all subscribers
    this.coursesSignal.update((courses) =>
      courses.map((c) => (c.id === courseId ? { ...c, is_enrolled: !c.is_enrolled } : c)),
    );

    return this.http
      .post<{ message: string; is_enrolled: boolean }>(`${this.apiUrl}/${courseId}/enroll`, {})
      .pipe(
        tap({
          next: (res) => {
            this.coursesSignal.update((courses) =>
              courses.map((c) => (c.id === courseId ? { ...c, is_enrolled: res.is_enrolled } : c)),
            );
          },
          error: (err) => {
            console.error('Failed to toggle enrollment', err);
            // Rollback on error
            this.coursesSignal.set(previousCourses);
          },
        }),
      );
  }
}
