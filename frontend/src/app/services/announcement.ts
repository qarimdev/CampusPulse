import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  is_important: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/announcements';

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }
}
