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

Setup `app/config/development.config.js`:

```js
{
  pg: {
    host: STRING,
    port: INTEGER,
    database: STRING,
    username: STRING,
    password: STRING,
  },
  redis: {
    host: STRING,
    port: INTEGER,
  },
  selenium: {
    host: STRING,
    port: INTEGER,
  },
  slack: {
    webHook: STRING,
  },
  mailer: {
    host: STRING,
    port: INTEGER,
    user: STRING,
    pass: STRING,
    from: STRING,
  },
}
```

## 1.2. Mailer

Without Two-step Verification:

`https://myaccount.google.com/lesssecureapps > ENABLE`

With Two-step verification:

`GMail > My Account -> Sign-in & security -> Signing in to Google -> App passwords`

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

You can see [here](https://github.com/junioregis/skeleton-nodejs/wiki/1-Architecture).
