import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Course, CourseService } from '../../services/course';

@Component({
  selector: 'app-course-planner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-planner.html',
  styleUrl: './course-planner.scss',
})
export class CoursePlannerComponent {
  private courseService = inject(CourseService);

  maxCredits = 18;
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // Signals retrieved from CourseService
  courses = this.courseService.courses;
  selectedCourses = this.courseService.enrolledCourses;

  get totalCredits(): number {
    return this.selectedCourses().reduce((sum, c) => sum + (c.credits || 0), 0);
  }

  isSelected(courseId: number): boolean {
    return this.selectedCourses().some((c) => c.id === courseId);
  }

  isConflicting(course: Course): boolean {
    if (this.isSelected(course.id) || !course.days || !course.startTime || !course.endTime) {
      return false;
    }

    return this.selectedCourses().some((selected) => {
      if (!selected.days || !selected.startTime || !selected.endTime) return false;

      const sharedDays = course.days?.some((day) => selected.days?.includes(day));
      if (!sharedDays) return false;

      return course.startTime! < selected.endTime! && selected.startTime! < course.endTime!;
    });
  }

  toggleCourse(course: Course): void {
    if (!this.isSelected(course.id)) {
      if (this.totalCredits + (course.credits || 0) > this.maxCredits) {
        alert(`Cannot exceed ${this.maxCredits} credits.`);
        return;
      }
    }

    this.courseService.toggleEnrollment(course.id).subscribe();
  }

  getCourseForSlot(day: string, time: string): Course | undefined {
    return this.selectedCourses().find(
      (c) =>
        c.days?.includes(day) &&
        c.startTime &&
        c.endTime &&
        c.startTime <= time &&
        c.endTime > time,
    );
  }

  // Generate distinct background & text colors per course ID
  getCourseTheme(courseId: number): { bg: string; text: string } {
    const themes = [
      { bg: '#4f46e5', text: '#ffffff' }, // Indigo
      { bg: '#059669', text: '#ffffff' }, // Emerald
      { bg: '#d97706', text: '#ffffff' }, // Amber
      { bg: '#9333ea', text: '#ffffff' }, // Purple
      { bg: '#0284c7', text: '#ffffff' }, // Sky
      { bg: '#e11d48', text: '#ffffff' }, // Rose
    ];
    return themes[courseId % themes.length];
  }
}
