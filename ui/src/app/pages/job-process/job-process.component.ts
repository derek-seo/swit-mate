import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Job } from '../login/job-management.model';
import { PrComponent } from './components/pr.component';
import { JsonPipe } from '@angular/common';
import { AppApiService } from '../../services/app-api.service';
import { switchMap } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'job-process',
  template: `
    @if (job()) {
      <form class="form">
        <form [formGroup]="formGroup" class="form">
          <div>
            <label class="label" for="name">Name</label>
            <input class="input" id="name" type="text" formControlName="name" />
          </div>
          <div>
            <label class="label" for="milestoneNumber">Milestone Number</label>
            <input
              class="input"
              id="milestoneNumber"
              type="number"
              formControlName="milestoneNumber"
            />
          </div>
          <div>
            <label class="label" for="jira-version">Jira Version</label>
            <input
              class="input"
              id="jira-version"
              type="text"
              formControlName="jiraVersion"
            />
          </div>
          <div class="button-group">
            @if (!isEdit) {
              <button type="button" class="button" (click)="onModeChange()">
                수정모드로 변경
              </button>
            } @else {
              <button type="button" class="button" (click)="onCancel()">
                cancel
              </button>
              <button
                type="button"
                class="button"
                [disabled]="formGroup.invalid"
                (click)="onUpdate()"
              >
                수정
              </button>
            }
          </div>
        </form>
      </form>
      <div class="layout">
        <pr-list
          [milestoneName]="job()!.milestoneName"
          [milestoneNumber]="Number(job()!.milestoneNumber)"
          [jiraVersion]="job()!.jiraIssueVersion"
        ></pr-list>
      </div>
    }
  `,
  styles: [
    `
      .form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .layout {
        display: flex;
        flex-direction: column;
        gap: 42px;
      }
    `,
  ],
  host: {
    style: 'display: flex; flex-direction: column; gap: 96px',
  },
  imports: [PrComponent, JsonPipe, FormsModule, ReactiveFormsModule],
})
export class JobProcessComponent implements OnInit {
  protected readonly Number = Number;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly appApiService = inject(AppApiService);

  public isEdit = false;
  formGroup = new FormGroup<{
    name: FormControl<string | null>;
    milestoneNumber: FormControl<number | null>;
    jiraVersion: FormControl<string | null>;
  }>({
    name: new FormControl('', [Validators.required]),
    milestoneNumber: new FormControl(0, [Validators.required]),
    jiraVersion: new FormControl(''),
  });

  public job = signal<Job | undefined>(undefined);

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((params: Params) => {
          const jobId = params['id'];
          return this.appApiService.getJob(jobId);
        }),
      )
      .subscribe({
        next: (job: Job) => {
          this.job.set(job);
          this.formGroup.setValue({
            name: job.name,
            milestoneNumber: Number(job.milestoneNumber),
            jiraVersion: job.jiraIssueVersion || null,
          });
          this.formGroup.disable();
        },
      });
  }

  onModeChange() {
    this.isEdit = true;
    this.formGroup.enable();
  }

  onUpdate() {
    const { name, milestoneNumber, jiraVersion } = this.formGroup.getRawValue();

    this.appApiService
      .updateJob({
        id: this.job()!.id,
        name: name!.trim(),
        milestoneNumber: milestoneNumber!,
        jiraVersion: jiraVersion?.trim() || '',
      })
      .subscribe({
        next: () => {
          this.formGroup.disable();
          this.isEdit = false;
        },
      });
  }

  onCancel() {
    this.formGroup.setValue({
      name: this.job()!.name,
      milestoneNumber: Number(this.job()!.milestoneNumber),
      jiraVersion: this.job()!.jiraIssueVersion || null,
    });
    this.isEdit = false;
    this.formGroup.disable();
  }
}
