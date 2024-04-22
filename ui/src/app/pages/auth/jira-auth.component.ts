import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'jira-auth',
  template: ``,
})
export class JiraAuthComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (params) => {
          const code = params['code'];
          if (!code) {
            return;
          }

          this.authService.loadJiraAccessToken(code).subscribe({
            next: () => this.router.navigate(['/']),
          });
        },
      });
  }
}
