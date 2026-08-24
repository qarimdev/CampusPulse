import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Course } from '../../services/course';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
})
export class TimetableComponent {
  @Input() courses: Course[] = [];

  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  getCoursesForSlot(day: string, slotTime: string): Course[] {
    const slotHour = parseInt(slotTime.split(':')[0], 10);

    return this.courses.filter((course) => {
      if (!course.days || !course.startTime) return false;

      const matchesDay = course.days.some((d) => d.toLowerCase().startsWith(day.toLowerCase()));
      if (!matchesDay) return false;

      const startHour = parseInt(course.startTime.split(':')[0], 10);
      return startHour === slotHour;
    });
  }
}
