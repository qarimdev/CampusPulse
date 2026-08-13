import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  code: string;
  title: string;
  description?: string;
  instructor?: string;
  credits: number;
  is_enrolled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/courses';

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  toggleEnrollment(courseId: number): Observable<{ message: string; is_enrolled: boolean }> {
    return this.http.post<{ message: string; is_enrolled: boolean }>(
      `${this.apiUrl}/${courseId}/enroll`,
      {},
    );
  }
}
