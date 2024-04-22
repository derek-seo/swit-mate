import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Job } from '../ui/src/app/pages/login/job-management.model';
import { jobs } from './db';
import axios from 'axios';

@Controller()
export class AppController {
  @Get('/job')
  getJobs(): Job[] {
    return jobs;
  }

  @Post('/job')
  saveJob(@Body() body: Job): Job {
    body.id = createUUID();
    jobs.push(body);
    return body;
  }

  @Get('/job/:id')
  getJob(@Param() params: any): Job {
    return jobs.find((job) => job.id === params.id);
  }

  @Post('/job/:id')
  updateJob(
    @Param() params: any,
    @Body()
    body: { name: string; jiraVersion: string; milestoneNumber: string },
  ): Job {
    const index = jobs.findIndex((job) => job.id === params.id);
    jobs[index] = { ...jobs[index], ...body };
    return jobs[index];
  }

  @Get('/jira_issue')
  async getJiraIssue(@Query() params: any) {
    try {
      const jiraVersion = params['jiraVersion'];
      const bodyData = `{"jql":"project = PIF AND fixVersion = '${jiraVersion}' ORDER BY assignee ASC, created DESC","maxResults": 1000,"startAt": 0}`;

      const res = await axios(
        'https://swit-tech.atlassian.net/rest/api/3/search',
        {
          method: 'POST',
          // todo Buffer.from(<지라 api 키>)
          headers: {
            Authorization: `Basic ${Buffer.from('').toString('base64')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          data: bodyData,
        },
      );

      return res.data;
    } catch (e) {
      console.log(e);
    }
  }
}

function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line no-mixed-operators
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
