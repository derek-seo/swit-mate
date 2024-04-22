export const APP_INFO = {
  appApiUrl: 'http://localhost:3000',
  fileApiUrl: 'https://files.swit.io',
  client_id: '', // todo swit client id (developer app id)
  jira_client_id: '',
  jira_client_secret: '',
  response_type: 'code',
  redirect_uri: 'http://localhost:4200/auth',
  scope: 'task:read+task:write+user:read',
};

export const CLIENT_SECRET = ''; // todo swit developer app secret key

export const AUTH_API = 'https://openapi.swit.io/oauth/authorize';
export const AUTH_TOKEN_API = 'https://openapi.swit.io/oauth/token';
