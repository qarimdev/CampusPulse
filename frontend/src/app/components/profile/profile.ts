import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Course, CourseService } from '../../services/course';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);

  currentUser = this.authService.currentUser;

  // Direct reactive binding to global enrollment state
  enrolledCourses = this.courseService.enrolledCourses;
  isLoading = signal<boolean>(true);

  // Compute total credits enrolled with fallback safeguard
  totalCredits = computed(() =>
    this.enrolledCourses().reduce((sum, course) => sum + (course.credits || 0), 0),
  );

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load user courses', err);
        this.isLoading.set(false);
      },
    });
  }

  dropCourse(course: Course): void {
    this.courseService.toggleEnrollment(course.id).subscribe({
      error: (err) => console.error('Failed to drop course', err),
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }
}
