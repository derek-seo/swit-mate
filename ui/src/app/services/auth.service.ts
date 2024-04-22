import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { APP_INFO, AUTH_API, AUTH_TOKEN_API, CLIENT_SECRET } from '../env';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private _accessToken: WritableSignal<string> = signal('');
  private _jiraAccessToken: WritableSignal<string> = signal('');
  private _userInfo: WritableSignal<{ photo: string } | undefined> =
    signal(undefined);
  private _isLogin: Signal<boolean> = computed(() => !!this.accessToken());

  constructor() {
    effect(() => {
      localStorage.setItem('am_access_token', this._accessToken());
    });

    effect(() => {
      localStorage.setItem('jira_access_token', this._jiraAccessToken());
    });
  }

  public get accessToken(): Signal<string> {
    return this._accessToken.asReadonly();
  }

  public get jiraAccessToken(): Signal<string> {
    return this._jiraAccessToken.asReadonly();
  }

  public get userInfo(): Signal<{ photo: string } | undefined> {
    return this._userInfo.asReadonly();
  }

  public get isLogin(): Signal<boolean> {
    return this._isLogin;
  }

  public loadAuthInfo(): void {
    const accessToken = localStorage.getItem('am_access_token');
    const jiraAccessToken = localStorage.getItem('jira_access_token');
    if (accessToken) {
      this._accessToken.set(accessToken);
    }
    if (jiraAccessToken) {
      this._jiraAccessToken.set(jiraAccessToken);
    }
  }

  public switUserLogin(): void {
    const queryParams = Object.entries(APP_INFO)
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join('&');

    window.location.href = `${AUTH_API}?${queryParams}`;
  }

  public loadJiraAccessToken(code: string) {
    const queryParams = {
      grant_type: 'authorization_code',
      client_id: APP_INFO.jira_client_id,
      client_secret: APP_INFO.jira_client_secret,
      redirect_uri: 'http://localhost:4200/jira_auth',
      code,
    };

    return this.httpClient
      .post(`https://auth.atlassian.com/oauth/token`, queryParams)
      .pipe(
        tap((response: any) => {
          this._jiraAccessToken.set(response.access_token);
        }),
      );
  }

  public loadSwitUserAccessToken(code: string) {
    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('client_id', APP_INFO.client_id);
    data.append('client_secret', CLIENT_SECRET);
    data.append('redirect_uri', 'http://localhost:4200/auth');
    data.append('code', code);

    return this.httpClient
      .post<{ access_token: string }>(AUTH_TOKEN_API, data.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        tap((response) => {
          this._accessToken.set(response.access_token);
        }),
      );
  }

  public switUserLogout(): void {
    this._accessToken.set('');
  }

  public loadSwitUserInfo() {
    return this.httpClient
      .get<{ data: { user: { photo: string } } }>(
        'https://openapi.swit.io/v1/api/user.info',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken()}`,
          },
        },
      )
      .pipe(
        tap(
          ({
            data: {
              user: { photo },
            },
          }: {
            data: { user: { photo: string } };
          }) => {
            this._userInfo.set({ photo });
          },
        ),
      );
  }
}
