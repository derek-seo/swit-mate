import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { JobManagementComponent } from "../job-management/job-management.component";
import { LoginComponent } from "../login/login.component";
import { RouterOutlet } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";
import { SwitFileApiDomainPipe } from "./pipes/swit-absolute-api.pipe";

@Component({
  standalone: true,
  selector: "home-component",
  template: ` @if (!isLogin()) {
      <login></login>
  } @else {
      @if (userInfo()) {
          <div class="layout">
              <div class="top-nav">
                  <span class="top-nav__title">Automate</span>
                  <div class="top-nav-user-box">
                      <img
                              class="top-nav__avatar"
                              alt="user image"
                              [src]="userInfo()!.photo | switFileApiDomain"
                      />
                      <button type="button" class="button" (click)="logout()">
                          Logout
                      </button>
                  </div>
              </div>
              <div class="main">
                  <router-outlet></router-outlet>
              </div>
          </div>
      }
  }`,
  host: {
    style: "display: block; position: relative; margin: 42px 0;"
  },
  styles: [
    `
      .layout {
        display: flex;
        flex-direction: column;
        gap: 42px;
      }

      .top-nav {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 42px;
      }

      .top-nav__title {
        font-size: 24px;
        font-weight: bold;
        cursor: default;
      }

      .top-nav-user-box {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .top-nav__avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
      }

      .main {
        display: flex;
        flex-direction: column;
      }
    `
  ],
  imports: [
    JobManagementComponent,
    LoginComponent,
    RouterOutlet,
    NgOptimizedImage,
    SwitFileApiDomainPipe
  ]
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  public isLogin = this.authService.isLogin;
  public userInfo = this.authService.userInfo;

  ngOnInit() {
  }

  public logout(): void {
    this.authService.switUserLogout();
  }

  public onJiraLogin(): void {
    window.location.href =
      "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LfuEFzSqZBhxylS7DcdhYt50Vj2f7e7n&scope=read%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fjira_auth&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";
  }
}
