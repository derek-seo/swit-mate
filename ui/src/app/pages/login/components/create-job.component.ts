import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'create-job',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="formGroup" class="form">
      <div>
        <label class="label" for="name">Name</label>
        <input
          class="input"
          id="name"
          type="text"
          formControlName="name"
          placeholder="Deploy 2021-01-01"
        />
      </div>
      <div>
        <label class="label" for="milestoneNumber">Milestone Number</label>
        <input
          class="input"
          id="milestoneNumber"
          type="number"
          formControlName="milestoneNumber"
          placeholder="100"
        />
      </div>
      <div>
        <label class="label" for="jira-version">Jira Version</label>
        <input
          class="input"
          id="jira-version"
          type="text"
          formControlName="jiraVersion"
          placeholder="v12.0.4"
        />
      </div>
      <div class="button-group">
        <button type="button" class="button" (click)="onCancel()">
          cancel
        </button>
        <button
          type="button"
          class="button"
          [disabled]="formGroup.invalid"
          (click)="onCreate()"
        >
          create
        </button>
      </div>
    </form>
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
    `,
  ],
  host: {
    style: 'display: block',
  },
})
export class CreateJobComponent implements OnInit {
  @Output() public cancel = new EventEmitter<void>();
  @Output() public create = new EventEmitter<{
    name: string;
    milestoneNumber: string;
    jiraVersion: string | undefined;
  }>();

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    milestoneNumber: new FormControl('', [Validators.required]),
    jiraVersion: new FormControl(''),
  });

  ngOnInit() {
    this.setDefaultJobName();
  }

  private setDefaultJobName() {
    const currentDate = this.getCurrentDate();
    this.formGroup.get('name')!.setValue(`Deploy ${currentDate}`);
  }

  private getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return `${year}-${month}-${day}`;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onCreate(): void {
    const { name, milestoneNumber, jiraVersion } = this.formGroup.getRawValue();

    this.create.emit({
      name: name!.trim(),
      milestoneNumber: milestoneNumber!,
      jiraVersion: jiraVersion?.trim() || undefined,
    });
  }
}
