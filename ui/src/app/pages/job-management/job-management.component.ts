import { Component, inject, OnInit, signal } from '@angular/core';
import { Job } from '../login/job-management.model';
import { CreateJobComponent } from '../login/components/create-job.component';
import { JobListComponent } from '../login/components/job-list.component';
import { GithubService } from '../../services/github.service';
import { AppApiService } from '../../services/app-api.service';

@Component({
  standalone: true,
  selector: 'job-management',
  template: `
    <div class="layout">
      <div>
        <button type="button" class="button" (click)="onOpenCreateView()">
          Create job
        </button>
      </div>

      @if (isCreateJob()) {
        <create-job
          (cancel)="onCancel()"
          (create)="onCreate($event)"
        ></create-job>
      }
      <job-list [jobs]="jobs()"></job-list>
    </div>
  `,
  styles: [
    `
      .layout {
        display: flex;
        flex-direction: column;
        gap: 42px;
      }
    `,
  ],
  imports: [CreateJobComponent, JobListComponent],
  host: {
    style: 'display: block',
  },
})
export class JobManagementComponent implements OnInit {
  private readonly appApiService = inject(AppApiService);
  private readonly githubService = inject(GithubService);

  public isCreateJob = signal<boolean>(false);
  public jobs = signal<Job[]>([]);

  ngOnInit() {
    this.appApiService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
      },
    });
  }

  public onOpenCreateView(): void {
    this.toggleCreateView(true);
  }

  public onCancel(): void {
    this.toggleCreateView(false);
  }

  public async onCreate({
    name,
    jiraVersion,
    milestoneNumber,
  }: {
    name: string;
    milestoneNumber: string;
    jiraVersion: string | undefined;
  }) {
    try {
      const milestoneResponse = await this.githubService.getMilestone(
        Number(milestoneNumber),
      );
      const milestone = milestoneResponse.data;

      if (!milestone) {
        alert(`${milestoneNumber}번 마일스톤을 찾을 수 없습니다.}`);
        return;
      }

      this.toggleCreateView(false);

      const job: Job = {
        name,
        id: '',
        milestoneName: milestone.title,
        milestoneNumber: milestoneNumber,
        jiraIssueVersion: jiraVersion,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: '',
      };
      this.appApiService.createJob(job).subscribe({
        next: (job) => {
          this.jobs.update((jobs) => {
            return [...jobs, job];
          });
        },
      });
    } catch (e) {
      alert(`${milestoneNumber}번 마일스톤을 찾을 수 없습니다.}`);
      return;
    }
  }

  private toggleCreateView(isOpen: boolean): void {
    this.isCreateJob.set(isOpen);
  }
}
