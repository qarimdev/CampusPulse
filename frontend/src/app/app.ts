import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html', // or ./app.component.html
  styleUrl: './app.scss', // or ./app.component.scss
})
export class AppComponent {
  // <-- Ensure this class name is 'AppComponent'
  title = 'frontend';
}
