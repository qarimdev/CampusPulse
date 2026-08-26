import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { Course } from '../../services/course';

@Component({
  selector: 'app-next-class',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-class.component.html',
  styleUrl: './next-class.component.scss',
})
export class NextClassComponent implements OnInit, OnDestroy {
  @Input() courses: Course[] = [];

  private timer: any;
  now = signal<Date>(new Date());

  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  nextCourseInfo = computed(() => {
    const current = this.now();
    const todayIndex = current.getDay();
    const todayName = this.dayNames[todayIndex];
    const currentMinutes = current.getHours() * 60 + current.getMinutes();

    let upcoming: { course: Course; startMinutes: number } | null = null;

    for (const course of this.courses) {
      if (!course.days || !course.startTime) continue;

      const matchesToday = course.days.some(
        (d) =>
          todayName.toLowerCase().startsWith(d.toLowerCase()) ||
          d.toLowerCase().startsWith(todayName.toLowerCase().slice(0, 3)),
      );

      if (!matchesToday) continue;

      const [hourStr, minStr] = course.startTime.split(':');
      const startMin = parseInt(hourStr, 10) * 60 + parseInt(minStr || '0', 10);

      if (startMin > currentMinutes) {
        if (!upcoming || startMin < upcoming.startMinutes) {
          upcoming = { course, startMinutes: startMin };
        }
      }
    }

    if (!upcoming) return null;

    const diffMinutes = upcoming.startMinutes - currentMinutes;
    const hoursLeft = Math.floor(diffMinutes / 60);
    const minsLeft = diffMinutes % 60;

    let countdownText = '';
    if (hoursLeft > 0) {
      countdownText = `${hoursLeft}h ${minsLeft}m`;
    } else {
      countdownText = `${minsLeft} mins`;
    }

    return {
      course: upcoming.course,
      countdownText,
    };
  });

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.now.set(new Date());
    }, 30000); // update every 30s
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
