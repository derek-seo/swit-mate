import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  host: {
    style: 'display: block; width: 1420px; margin: 0 auto;',
  },
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.authService.loadSwitUserInfo().subscribe();
  }
}
