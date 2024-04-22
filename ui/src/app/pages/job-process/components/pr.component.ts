import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GithubService, PAGE_SIZE } from '../../../services/github.service';
import { JiraService } from '../../../services/jira.service';

@Component({
  standalone: true,
  selector: 'pr-list',
  template: `
    @if (milestone() && pullRequests() && jiraIssues()) {
      <div class="info-box">
        <span class="title">
          {{ milestone()!.title }}
        </span>
      </div>
      <div>
        <div class="column-header">
          <div class="cell">PR Title</div>
          <div class="cell">Assignees</div>
          <div class="cell">Link</div>
        </div>
        @for (pr of pullRequests(); track pr.node_id) {
          <div class="pr-item">
            <div class="cell">{{ pr.title }}</div>
            @for (assignee of pr.assignees; track assignee.node_id) {
              <span class="cell">
                <span> {{ assignee.login }}</span>
                <img
                  style="width: 60px; height: 60px; border-radius: 50%"
                  [src]="assignee.avatar_url"
                  alt=""
              /></span>
            }
            <div class="cell">
              <a [href]="pr.html_url" target="_blank">
                <button type="button" class="button">열기</button>
              </a>
            </div>
          </div>
          @if (prWithJiraIssues()[pr.node_id]) {
            <div>
              {{ prWithJiraIssues()[pr.node_id].key }}
              {{ prWithJiraIssues()[pr.node_id].fields.summary }}
              {{ prWithJiraIssues()[pr.node_id].fields.assignee?.displayName }}
              {{ prWithJiraIssues()[pr.node_id].fields.issuetype?.name }}
              {{ prWithJiraIssues()[pr.node_id].fields.fixVersions?.[0].name }}
              {{ prWithJiraIssues()[pr.node_id].fields.components?.[0].name }}
              {{ prWithJiraIssues()[pr.node_id].fields.status?.name }}
            </div>
          } @else {}
        }
      </div>
    }
  `,
  styles: [
    `
      .info-box {
        display: flex;
        gap: 8px;
        padding: 8px;
        border-radius: 8px;
      }

      .column-header {
        display: grid;
        grid-template-columns: 3fr 1fr 1fr;
        grid-gap: 8px;
        padding: 8px;
        border: 1px solid #ccc;
        background-color: #eee;
      }

      .pr-item {
        display: grid;
        gap: 8px;
        border: 1px solid #ccc;
        border-radius: 8px;
        grid-template-columns: 3fr 1fr 1fr;
        grid-gap: 8px;
        padding: 8px;

        align-items: center;
      }

      .pr-item:not(:last-child) {
        margin-bottom: 16px;
      }

      .title {
        font-weight: bold;
        font-size: 24px;
      }

      .cell {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  host: {
    style: 'display: flex; flex-direction: column; gap: 36px',
  },
  imports: [ReactiveFormsModule],
})
export class PrComponent implements OnInit {
  private readonly githubService = inject(GithubService);
  private readonly jiraService = inject(JiraService);

  milestone = signal<
    | {
        node_id: string;
        title: string;
        state: 'open' | 'closed';
      }
    | undefined
  >(undefined);

  pullRequests = signal<
    | {
        node_id: string;
        title: string;
        html_url: string;
        draft: boolean;
        assignees: {
          login: string;
          id: number;
          node_id: string;
          avatar_url: string;
        }[];
      }[]
    | undefined
  >(undefined);
  pullRequestsPageNum = 1;

  jiraIssues = signal<
    | {
        key: string;
        id: string;
        fields: {
          summary: string;
          fixVersions: { id: string; self: string; name: string }[];
          assignee: { avatarUrls: { '48x48': string; displayName: string } };
          status: { name: string; iconUrl: string };
          components: { id: string; name: string }[];
          issuetype: { name: string; id: string };
        };
      }[]
    | undefined
  >(undefined);
  prWithJiraIssues: Signal<Record<string, any>> = computed(() => {
    const prs = this.pullRequests();
    const issues = this.jiraIssues();

    if (!prs || !issues) {
      return {};
    }

    return prs.reduce((acc, pr) => {
      const matchIssues = issues.find((issue) => {
        return pr.title.includes(issue.key);
      });
      return {
        ...acc,
        [pr.node_id]: matchIssues,
      };
    }, {});
  });

  @Input({ required: true }) milestoneName: string = '';
  @Input({ required: true }) milestoneNumber: number = 0;
  @Input({ required: true }) jiraVersion: string | undefined;

  async ngOnInit(): Promise<void> {
    await this.loadPullRequests();
    await this.loadJiraIssues(this.jiraVersion || this.milestoneName);
  }

  private async loadPullRequests() {
    let currentPullRequestCount = 0;
    const [pullRequests, milestone] = await Promise.all([
      this.githubService.getPullRequests(
        this.milestoneName,
        this.pullRequestsPageNum,
      ),
      this.githubService.getMilestone(this.milestoneNumber),
    ]);

    currentPullRequestCount = pullRequests.data.length;

    while (currentPullRequestCount === PAGE_SIZE) {
      this.pullRequestsPageNum += 1;
      const nextPullRequests = await this.githubService.getPullRequests(
        this.milestoneName,
        this.pullRequestsPageNum,
      );
      pullRequests.data = pullRequests.data.concat(nextPullRequests.data);
      currentPullRequestCount = nextPullRequests.data.length;
    }

    this.milestone.set(milestone.data);

    const milestonePRs = pullRequests.data.filter((item: any) => {
      return item.milestone?.node_id === milestone.data.node_id;
    });

    this.pullRequests.set(milestonePRs);
  }

  private loadJiraIssues(jiraVersion: string) {
    this.jiraService.getJiraIssues(jiraVersion).subscribe({
      next: (issues) => {
        this.jiraIssues.set(issues.issues);
      },
    });
  }
}
