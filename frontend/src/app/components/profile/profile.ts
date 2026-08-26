import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Course, CourseService } from '../../services/course';
import { GpaCalculatorComponent } from '../gpa-calculator/gpa-calculator';
import { GradeTargetCalcComponent } from '../grade-target-calc/grade-target-calc';
import { NextClassComponent } from '../next-class/next-class';
import { TaskChecklistComponent } from '../task-checklist/task-checklist';
import { TimetableComponent } from '../timetable/timetable';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    GpaCalculatorComponent,
    TimetableComponent,
    NextClassComponent,
    TaskChecklistComponent,
    GradeTargetCalcComponent,
  ],
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

  // Toggle state for GPA calculator display
  showGpaCalculator = signal<boolean>(false);

  // Student Academic Performance Signals
  currentGpa = signal<number>(3.62);
  targetGpa = signal<number>(3.8);
  cgpa = signal<number>(3.58);
  completedCredits = signal<number>(42);

  // Profile Edit State
  isEditing = signal<boolean>(false);
  studentMajor = signal<string>('Computer Science (Software Engineering)');
  studentId = signal<string>('CS-2024-8891');

  totalCredits = computed(() =>
    this.enrolledCourses().reduce((sum, course) => sum + (course.credits || 0), 0),
  );

  gpaProgressPercentage = computed(() => {
    const current = this.currentGpa();
    const target = this.targetGpa();
    if (target <= 0) return 0;
    const pct = (current / target) * 100;
    return Math.min(Math.round(pct), 100);
  });

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe({
      next: () => this.isLoading.set(false),
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

  toggleGpaCalculator(): void {
    this.showGpaCalculator.update((val) => !val);
  }

  toggleEditProfile(): void {
    this.isEditing.update((val) => !val);
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }
}
