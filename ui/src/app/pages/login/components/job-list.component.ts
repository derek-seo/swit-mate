import { Component, inject, Input } from '@angular/core';
import { Job } from '../job-management.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'job-list',
  template: `
    @if (jobs) {
      <div class="column-header">
        <div class="cell">Name</div>
        <div class="cell">Status</div>
        <div class="cell">Milestone title</div>
        <div class="cell">Milestone number</div>
        <div class="cell">Jira Issue Version</div>
        <div class="cell">Created At</div>
        <div class="cell">Updated At</div>
        <div class="cell">Action</div>
      </div>
      @for (job of jobs; track job.id) {
        <div class="job">
          <div class="cell">{{ job.name }}</div>
          <div class="cell">{{ job.status }}</div>
          <div class="cell">{{ job.milestoneName }}</div>
          <div class="cell">{{ job.milestoneNumber }}</div>
          <div class="cell">{{ job.jiraIssueVersion }}</div>
          <div class="cell">{{ job.createdAt | date: 'short' }}</div>
          <div class="cell">{{ job.updatedAt | date: 'short' }}</div>
          <div class="cell">
            <button class="button" type="button" (click)="moveToJobPage(job)">
              이동
            </button>
          </div>
        </div>
      }
    }
  `,
  styles: [
    `
      .column-header {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-gap: 8px;
        padding: 8px;
        border: 1px solid #ccc;
        background-color: #eee;
      }

      .job {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-gap: 8px;
        padding: 8px;
        border: 1px solid #ccc;
      }

      .cell {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  imports: [DatePipe],
})
export class JobListComponent {
  private readonly router = inject(Router);

  @Input({ required: true }) jobs: Job[] | undefined;

  public moveToJobPage(job: Job): void {
    this.router
      .navigate([`job`], {
        queryParams: {
          id: job.id,
        },
      })
      .then();
  }
}
