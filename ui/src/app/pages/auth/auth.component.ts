import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'auth-component',
  template: ` Loggin in... `,
  host: {
    style: 'display: flex; justify-content: center; align-items: center;',
  },
})
export class AuthComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((queryParams: any) =>
          this.authService.loadSwitUserAccessToken(queryParams.code),
        ),
        switchMap(() => this.authService.loadSwitUserInfo()),
      )
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/');
        },
      });
  }
}
