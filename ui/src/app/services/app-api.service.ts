import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from '../pages/login/job-management.model';
import { HttpClient } from '@angular/common/http';
import { APP_INFO } from '../env';

@Injectable({ providedIn: 'root' })
export class AppApiService {
  private readonly httpClient = inject(HttpClient);

  getJobs(): Observable<Job[]> {
    return this.httpClient.get<Job[]>(`${APP_INFO.appApiUrl}/job`);
  }

  getJob(id: string): Observable<Job> {
    return this.httpClient.get<Job>(`${APP_INFO.appApiUrl}/job/${id}`);
  }

  createJob(job: Job): Observable<Job> {
    return this.httpClient.post<Job>(`${APP_INFO.appApiUrl}/job`, job);
  }

  updateJob(job: {
    id: string;
    name: string;
    jiraVersion: string;
    milestoneNumber: number;
  }): Observable<Job> {
    return this.httpClient.post<Job>(
      `${APP_INFO.appApiUrl}/job/${job.id}`,
      job,
    );
  }
}
