import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnouncementsDrawerComponent } from './components/announcements-drawer/announcements-drawer';
import { NavHeaderComponent } from './components/nav-header/nav-header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavHeaderComponent, AnnouncementsDrawerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  title = 'frontend';
}
