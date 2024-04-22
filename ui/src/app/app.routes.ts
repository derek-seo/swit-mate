import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { JobProcessComponent } from './pages/job-process/job-process.component';
import { JobManagementComponent } from './pages/job-management/job-management.component';
import { JiraAuthComponent } from './pages/auth/jira-auth.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: JobManagementComponent,
      },
      {
        path: 'job',
        component: JobProcessComponent,
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'jira_auth',
    component: JiraAuthComponent,
  },
];
