import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Announcement, AnnouncementService } from '../../services/announcement';
import { AuthService } from '../../services/auth';
import { Course, CourseService } from '../../services/course';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private announcementService = inject(AnnouncementService);

  currentUser = this.authService.currentUser;
  courses = signal<Course[]>([]);
  announcements = signal<Announcement[]>([]);

  isLoadingCourses = signal<boolean>(true);
  isLoadingAnnouncements = signal<boolean>(true);

  enrolledCoursesCount = computed(() => this.courses().filter((c) => c.is_enrolled).length);

  ngOnInit(): void {
    this.fetchCourses();
    this.fetchAnnouncements();
  }

  fetchCourses(): void {
    this.isLoadingCourses.set(true);
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoadingCourses.set(false); // Fix: Set isLoadingCourses instead of isLoading
      },
      error: (err) => {
        console.error('Failed to load courses', err);
        this.isLoadingCourses.set(false);
      },
    });
  }

  fetchAnnouncements(): void {
    this.isLoadingAnnouncements.set(true);
    this.announcementService.getAnnouncements().subscribe({
      next: (data) => {
        this.announcements.set(data);
        this.isLoadingAnnouncements.set(false);
      },
      error: (err) => {
        console.error('Failed to load announcements', err);
        this.isLoadingAnnouncements.set(false);
      },
    });
  }

  toggleEnroll(course: Course): void {
    // Optimistic UI Update: Toggle state immediately so user sees instant feedback
    const previousState = course.is_enrolled;
    this.courses.update((list) =>
      list.map((c) => (c.id === course.id ? { ...c, is_enrolled: !c.is_enrolled } : c)),
    );

    this.courseService.toggleEnrollment(course.id).subscribe({
      next: (res) => {
        // Sync exact backend state
        this.courses.update((list) =>
          list.map((c) => (c.id === course.id ? { ...c, is_enrolled: res.is_enrolled } : c)),
        );
      },
      error: (err) => {
        console.error('Failed to toggle enrollment', err);
        // Revert on error
        this.courses.update((list) =>
          list.map((c) => (c.id === course.id ? { ...c, is_enrolled: previousState } : c)),
        );
      },
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }
}
