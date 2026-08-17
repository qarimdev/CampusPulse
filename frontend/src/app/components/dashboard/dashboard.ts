import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Announcement, AnnouncementService } from '../../services/announcement';
import { AuthService } from '../../services/auth';
import { Course, CourseService } from '../../services/course';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

  // Search filter signal
  searchTerm = signal<string>('');

  // Mobile navigation state
  isMobileMenuOpen = signal<boolean>(false);

  // Computes active enrolled count
  enrolledCoursesCount = computed(() => this.courses().filter((c) => c.is_enrolled).length);

  // Computes filtered course list based on search term (title or code)
  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.courses();

    return this.courses().filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        (course.instructor && course.instructor.toLowerCase().includes(term)),
    );
  });

  ngOnInit(): void {
    this.fetchCourses();
    this.fetchAnnouncements();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  fetchCourses(): void {
    this.isLoadingCourses.set(true);
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoadingCourses.set(false);
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
    const previousState = course.is_enrolled;
    this.courses.update((list) =>
      list.map((c) => (c.id === course.id ? { ...c, is_enrolled: !c.is_enrolled } : c)),
    );

    this.courseService.toggleEnrollment(course.id).subscribe({
      next: (res) => {
        this.courses.update((list) =>
          list.map((c) => (c.id === course.id ? { ...c, is_enrolled: res.is_enrolled } : c)),
        );
      },
      error: (err) => {
        console.error('Failed to toggle enrollment', err);
        this.courses.update((list) =>
          list.map((c) => (c.id === course.id ? { ...c, is_enrolled: previousState } : c)),
        );
      },
    });
  }

  // Selected course signal for modal
  selectedCourse = signal<Course | null>(null);

  openCourseDetails(course: Course): void {
    this.selectedCourse.set(course);
  }

  closeCourseDetails(): void {
    this.selectedCourse.set(null);
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }
}
