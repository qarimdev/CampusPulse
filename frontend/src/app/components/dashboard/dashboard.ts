import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Announcement, AnnouncementService } from '../../services/announcement';
import { AuthService } from '../../services/auth';
import { Course, CourseService } from '../../services/course';

export type SortOption = 'title-asc' | 'title-desc' | 'credits-high' | 'credits-low';

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

  // Search, Filter & Sort Signals
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('all');
  selectedSort = signal<SortOption>('title-asc');

  // Mobile navigation state
  isMobileMenuOpen = signal<boolean>(false);

  // Computes active enrolled count
  enrolledCoursesCount = computed(() => this.courses().filter((c) => c.is_enrolled).length);

  // Dynamic unique list of categories extracted from courses
  availableCategories = computed(() => {
    const cats = this.courses()
      .map((c) => c.category)
      .filter((cat): cat is string => !!cat);
    return ['all', ...Array.from(new Set(cats))];
  });

  // Computes filtered and sorted course list
  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.selectedCategory();
    const sort = this.selectedSort();

    return this.courses()
      .filter((course) => {
        const matchesSearch =
          !term ||
          course.title.toLowerCase().includes(term) ||
          course.code.toLowerCase().includes(term) ||
          (course.instructor && course.instructor.toLowerCase().includes(term));

        const matchesCategory = cat === 'all' || course.category === cat;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sort) {
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'credits-high':
            return (b.credits || 0) - (a.credits || 0);
          case 'credits-low':
            return (a.credits || 0) - (b.credits || 0);
          default:
            return 0;
        }
      });
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

  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.selectedSort.set(value);
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
