import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

export interface Announcement {
  id: number;
  title: string;
  category: 'Academic' | 'Events' | 'Urgent';
  date: string;
  author: string;
  summary: string;
  content: string;
  unread: boolean;
}

@Component({
  selector: 'app-announcements-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcements-drawer.html',
  styleUrl: './announcements-drawer.scss',
})
export class AnnouncementsDrawerComponent {
  isOpen = signal(false);
  selectedCategory = signal<string>('All');
  activePost = signal<Announcement | null>(null);

  announcements = signal<Announcement[]>([
    {
      id: 1,
      title: 'Final Examination Schedule Released',
      category: 'Academic',
      date: 'Aug 22, 2026',
      author: 'Academic Affairs',
      summary:
        'The final timetable for the upcoming semester examinations is now available on the portal.',
      content:
        'Please verify your course codes and reporting times. If you observe any direct schedule conflicts, submit a conflict ticket to the registrar office before the deadline.',
      unread: true,
    },
    {
      id: 2,
      title: 'Annual Campus Sports Carnival 2026',
      category: 'Events',
      date: 'Aug 20, 2026',
      author: 'Student Council',
      summary: 'Register your team for football, badminton, and track events.',
      content:
        'The annual sports carnival will feature inter-faculty tournaments. Team registrations close this Friday. Food stalls and club booths will be open all day.',
      unread: true,
    },
    {
      id: 3,
      title: 'Scheduled System Maintenance: Student Portal',
      category: 'Urgent',
      date: 'Aug 18, 2026',
      author: 'IT Services',
      summary: 'Maintenance scheduled this Sunday from 2:00 AM to 6:00 AM.',
      content:
        'During this maintenance window, Course Planner and GPA Calculator services will be temporarily unavailable. Please save your work ahead of time.',
      unread: false,
    },
  ]);

  filteredAnnouncements = computed(() => {
    const cat = this.selectedCategory();
    const list = this.announcements();
    if (cat === 'All') return list;
    return list.filter((item) => item.category === cat);
  });

  unreadCount = computed(() => this.announcements().filter((a) => a.unread).length);

  toggleDrawer(): void {
    this.isOpen.update((v) => !v);
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  openPost(post: Announcement): void {
    this.activePost.set(post);
    if (post.unread) {
      this.announcements.update((items) =>
        items.map((i) => (i.id === post.id ? { ...i, unread: false } : i)),
      );
    }
  }

  backToList(): void {
    this.activePost.set(null);
  }
}
