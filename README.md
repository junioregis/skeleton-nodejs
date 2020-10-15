# Resume

NodeJS REST API skeleton.

# Features

- API versioning
- Rate Limiter
- OAuth2 implementation
- Cache implementation with Redis
- Social login with Google and Facebook
- Slack integration for logging
- Scheduler for running background tasks
- Mailer helper
- Internationalization helper
- Web scraper
- Uploads ready
- Geocoding implementation
- Database admin
- Postman file

## 1. Setup Project

## 1.1. Config

The project settings are located in the file `app/config.js`. The environment variables below MUST be assigned:

```
NODE_ENV: STRING
PG_HOST: STRING
PG_PORT: INTEGER
PG_DB_NAME: STRING
PG_USER: STRING
PG_PASS: STRING
REDIS_HOST: STRING
REDIS_PORT: INTEGER
SELENIUM_HOST: STRING
SELENIUM_PORT: INTEGER
SLACK_WEBHOOK: STRING
MAILER_HOST: STRING
MAILER_PORT: INTEGER
MAILER_USER: STRING
MAILER_PASS: STRING
MAILER_FROM: STRING
```

## 1.2. Mailer

### 1.2.1. Google

Enable 2-Step Verification:

`https://myaccount.google.com > Security > Signing in to Google > 2-Step Verification`

Create App Password:

`https://myaccount.google.com > Security > Signing in to Google > App passwords`

> If you are using a Google Workspaces account, follow these steps before: `Google Workspaces Admin > Dashboard > Security Settings > 2-Step Verification > Allow users to turn on 2-Step Verification`

## 1.3. Social Providers

### 1.3.1. Google

Scopes:

```
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/user.birthday.read
```

### 1.3.2. Facebook

Scopes:

```
email
user_gender
user_birthday
```

## 1.4. Slack

Get Webhook:

`https://api.slack.com/apps > Select App > Incoming Webhooks > Webhook URL`

# 2. Build and Run

Get Api Credentials:

```bash
make api-clients
```

Execute:

```bash
make build
make start
```

# Architecture

You can see [here](https://github.com/junioregis/skeleton-nodejs/wiki).
