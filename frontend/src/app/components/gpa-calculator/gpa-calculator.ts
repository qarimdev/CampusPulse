import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { CourseService } from '../../services/course';

export interface GradeOption {
  label: string;
  points: number;
}

@Component({
  selector: 'app-gpa-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gpa-calculator.html',
  styleUrl: './gpa-calculator.scss',
})
export class GpaCalculatorComponent {
  private courseService = inject(CourseService);

  gradeOptions: GradeOption[] = [
    { label: 'A', points: 4.0 },
    { label: 'A-', points: 3.7 },
    { label: 'B+', points: 3.3 },
    { label: 'B', points: 3.0 },
    { label: 'B-', points: 2.7 },
    { label: 'C+', points: 2.3 },
    { label: 'C', points: 2.0 },
    { label: 'C-', points: 1.7 },
    { label: 'D+', points: 1.3 },
    { label: 'D', points: 1.0 },
    { label: 'F', points: 0.0 },
  ];

  selectedGrades = signal<Record<number, number>>({});

  enrolledCourses = this.courseService.enrolledCourses;

  totalCredits = computed(() =>
    this.enrolledCourses().reduce((sum, c) => sum + (c.credits || 0), 0),
  );

  totalQualityPoints = computed(() => {
    const grades = this.selectedGrades();
    return this.enrolledCourses().reduce((sum, course) => {
      const pts = grades[course.id] ?? 4.0;
      return sum + (course.credits || 0) * pts;
    }, 0);
  });

  calculatedGpa = computed(() => {
    const credits = this.totalCredits();
    if (credits === 0) return '0.00';
    return (this.totalQualityPoints() / credits).toFixed(2);
  });

  onGradeChange(courseId: number, event: Event): void {
    const value = parseFloat((event.target as HTMLSelectElement).value);
    this.selectedGrades.update((prev) => ({
      ...prev,
      [courseId]: value,
    }));
  }

  getGradeForCourse(courseId: number): number {
    return this.selectedGrades()[courseId] ?? 4.0;
  }
}
