import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_INFO } from '../env';

@Injectable({ providedIn: 'root' })
export class JiraService {
  private readonly httpClient = inject(HttpClient);

  public getJiraIssues(jiraVersion: string) {
    return this.httpClient.get<{
      issues: {
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
      }[];
    }>(`${APP_INFO.appApiUrl}/jira_issue`, {
      params: {
        jiraVersion,
      },
    });
  }
}
