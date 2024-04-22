import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'login',
  template: `
    <button type="button" class="button" (click)="login()">Login</button>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  public login(): void {
    this.authService.switUserLogin();
  }
}
