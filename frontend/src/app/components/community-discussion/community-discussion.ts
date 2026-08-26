import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommunityService } from '../../services/community';

export interface Comment {
  id: number | string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: number | string;
  authorName: string;
  authorRole: string;
  category: 'General' | 'CourseHelp' | 'Clubs' | 'CasualSports' | 'Tech';
  title: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  comments: Comment[];
}

@Component({
  selector: 'app-community-discussion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-discussion.html',
  styleUrl: './community-discussion.scss',
})
export class CommunityDiscussionComponent implements OnInit {
  private communityService = inject(CommunityService);

  // Category Filtering
  selectedCategory = signal<string>('All');
  categories = ['All', 'General', 'CourseHelp', 'Clubs', 'CasualSports', 'Tech'];

  // Form State
  newPostTitle = signal<string>('');
  newPostContent = signal<string>('');
  newPostCategory = signal<Post['category']>('General');
  activeReplyPostId = signal<number | string | null>(null);
  replyContent = signal<string>('');

  // Posts Feed Signal
  posts = signal<Post[]>([]);

  // Computed Filtered Feed
  filteredPosts = computed(() => {
    const category = this.selectedCategory();
    if (category === 'All') return this.posts();
    return this.posts().filter((p) => p.category === category);
  });

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.communityService.getPosts().subscribe({
      next: (data) => this.posts.set(data),
      error: (err) => console.error('Failed to load posts', err),
    });
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  createPost(): void {
    if (!this.newPostTitle().trim() || !this.newPostContent().trim()) return;

    this.communityService
      .createPost({
        title: this.newPostTitle().trim(),
        content: this.newPostContent().trim(),
        category: this.newPostCategory(),
      })
      .subscribe({
        next: (createdPost) => {
          this.posts.update((list) => [createdPost, ...list]);
          this.newPostTitle.set('');
          this.newPostContent.set('');
        },
        error: (err) => console.error('Failed to create post', err),
      });
  }

  toggleLike(postId: number | string): void {
    this.communityService.toggleLike(postId).subscribe({
      next: (res) => {
        this.posts.update((list) =>
          list.map((post) =>
            post.id === postId ? { ...post, likes: res.likes, isLiked: !post.isLiked } : post,
          ),
        );
      },
      error: (err) => console.error('Failed to like post', err),
    });
  }

  toggleReplyBox(postId: number | string): void {
    this.activeReplyPostId.update((curr) => (curr === postId ? null : postId));
    this.replyContent.set('');
  }

  addComment(postId: number | string): void {
    if (!this.replyContent().trim()) return;

    this.communityService.addComment(postId, this.replyContent().trim()).subscribe({
      next: (newComment) => {
        this.posts.update((list) =>
          list.map((post) =>
            post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post,
          ),
        );
        this.replyContent.set('');
        this.activeReplyPostId.set(null);
      },
      error: (err) => console.error('Failed to add comment', err),
    });
  }
}
