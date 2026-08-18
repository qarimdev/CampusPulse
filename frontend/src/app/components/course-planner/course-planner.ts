import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  days: string[];
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-course-planner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-planner.html',
  styleUrl: './course-planner.scss',
})
export class CoursePlannerComponent {
  maxCredits = 18;
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

  availableCourses: Course[] = [
    {
      id: 'CS101',
      code: 'CS 101',
      title: 'Intro to Computer Science',
      credits: 3,
      days: ['Mon', 'Wed'],
      startTime: '09:00',
      endTime: '10:30',
    },
    {
      id: 'CS201',
      code: 'CS 201',
      title: 'Data Structures & Algorithms',
      credits: 4,
      days: ['Mon', 'Wed'],
      startTime: '10:00',
      endTime: '11:30',
    },
    {
      id: 'MATH201',
      code: 'MATH 201',
      title: 'Calculus II',
      credits: 4,
      days: ['Tue', 'Thu'],
      startTime: '11:00',
      endTime: '12:30',
    },
    {
      id: 'ENG102',
      code: 'ENG 102',
      title: 'Academic Writing',
      credits: 3,
      days: ['Tue', 'Thu'],
      startTime: '11:30',
      endTime: '13:00',
    },
    {
      id: 'PHY105',
      code: 'PHY 105',
      title: 'General Physics I',
      credits: 4,
      days: ['Mon', 'Wed', 'Fri'],
      startTime: '13:00',
      endTime: '14:30',
    },
    {
      id: 'DES110',
      code: 'DES 110',
      title: 'UI/UX Fundamentals',
      credits: 3,
      days: ['Fri'],
      startTime: '09:00',
      endTime: '12:00',
    },
  ];

  selectedCourseIds: string[] = ['CS101', 'MATH201'];

  get selectedCourses(): Course[] {
    return this.availableCourses.filter((c) => this.selectedCourseIds.includes(c.id));
  }

  get totalCredits(): number {
    return this.selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  }

  isSelected(courseId: string): boolean {
    return this.selectedCourseIds.includes(courseId);
  }

  isConflicting(course: Course): boolean {
    if (this.isSelected(course.id)) return false;

    return this.selectedCourses.some((selected) => {
      const sharedDays = course.days.some((day) => selected.days.includes(day));
      if (!sharedDays) return false;
      return course.startTime < selected.endTime && selected.startTime < course.endTime;
    });
  }

  toggleCourse(course: Course): void {
    if (this.isSelected(course.id)) {
      this.selectedCourseIds = this.selectedCourseIds.filter((id) => id !== course.id);
    } else {
      if (this.totalCredits + course.credits > this.maxCredits) {
        alert(`Cannot exceed ${this.maxCredits} credits.`);
        return;
      }
      this.selectedCourseIds.push(course.id);
    }
  }

  getCourseForSlot(day: string, time: string): Course | undefined {
    return this.selectedCourses.find(
      (c) => c.days.includes(day) && c.startTime <= time && c.endTime > time,
    );
  }
}
