import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
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
  isLoading = signal<boolean>(true);
  announcements = signal<Announcement[]>([]);
  isLoadingCourses = signal<boolean>(true);
  isLoadingAnnouncements = signal<boolean>(true);

  ngOnInit(): void {
    this.fetchCourses();
    this.fetchAnnouncements();
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load courses', err);
        this.isLoading.set(false);
      },
    });
  }

  fetchAnnouncements(): void {
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

  onLogout(): void {
    this.authService.logout().subscribe();
  }
}
