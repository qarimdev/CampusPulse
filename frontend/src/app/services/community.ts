// frontend/src/app/services/community.ts

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, Post } from '../components/community-discussion/community-discussion';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  createPost(data: { title: string; content: string; category: string }): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, data);
  }

  toggleLike(postId: number | string): Observable<{ likes: number }> {
    return this.http.post<{ likes: number }>(`${this.apiUrl}/posts/${postId}/like`, {});
  }

  addComment(postId: number | string, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/posts/${postId}/comments`, { content });
  }
}
