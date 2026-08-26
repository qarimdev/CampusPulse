import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'campuspulse_theme';

  // State signals
  theme = signal<Theme>(this.getInitialTheme());
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Automatically apply changes whenever theme signal changes
    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem(this.STORAGE_KEY, currentTheme);
      this.applyTheme(currentTheme);
    });

    // Listen for OS system theme updates
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.theme() === 'system') {
        this.updateDarkState(e.matches);
      }
    });
  }

  setTheme(newTheme: Theme): void {
    this.theme.set(newTheme);
  }

  toggleDarkMode(): void {
    this.setTheme(this.isDarkMode() ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme): void {
    let shouldBeDark = false;

    if (theme === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      shouldBeDark = theme === 'dark';
    }

    this.updateDarkState(shouldBeDark);
  }

  private updateDarkState(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  private getInitialTheme(): Theme {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme;
    return saved ? saved : 'system';
  }
}
