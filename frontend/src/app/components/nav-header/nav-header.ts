import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-header.html',
  styleUrl: './nav-header.scss',
})
export class NavHeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuOpen = signal(false);
  dropdownOpen = signal(false);

  navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Course Planner', path: '/planner', icon: '📅' },
    { label: 'GPA Calculator', path: '/gpa-calculator', icon: '🧮' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ];

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
