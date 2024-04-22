import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { registerLocaleData } from '@angular/common';
import localeKo from '@angular/common/locales/ko';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => {
        registerLocaleData(localeKo);

        return authService.loadAuthInfo();
      },
      deps: [AuthService],
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'ko-KR',
    },
  ],
};
