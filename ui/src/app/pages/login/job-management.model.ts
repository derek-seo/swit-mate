export type Job = {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failure';
  createdAt: string;
  updatedAt: string;
  milestoneNumber: string;
  milestoneName: string;
  jiraIssueVersion?: string;
};
