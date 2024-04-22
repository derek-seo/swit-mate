import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';

export const PAGE_SIZE = 1000;

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly octokit = new Octokit({
    auth: '', // todo github api 키 추가
  });

  public async getPullRequests(baseBranch: string, pageNum: number) {
    return await this.octokit.request(
      'GET /repos/{owner}/{repo}/pulls{?state,base,sort}',
      {
        owner: 'swit-fe',
        repo: 'app',
        state: 'all',
        sort: 'created',
        base: baseBranch,
        direction: 'desc',
        per_page: PAGE_SIZE,
        page: pageNum,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  }

  public async getMilestoneList() {
    return await this.octokit.request('GET /repos/{owner}/{repo}/milestones', {
      owner: 'swit-fe',
      repo: 'app',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }

  public async getMilestone(milestoneNumber: number) {
    return await this.octokit.request(
      'GET /repos/{owner}/{repo}/milestones/{milestone_number}',
      {
        owner: 'swit-fe',
        repo: 'app',
        milestone_number: milestoneNumber,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  }
}
