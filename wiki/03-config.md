# 3.1. Mailer

## 3.1.1. Google

Without Two-step Verification:

`https://myaccount.google.com/lesssecureapps > ENABLE`

With Two-step verification:

`GMail > My Account -> Sign-in & security -> Signing in to Google -> App passwords`

# 3.2. Configure Social Providers

## 3.2.1. Google

Scopes:

```
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/user.birthday.read
```

## 3.2.2. Facebook

Scopes:

```
email
user_gender
user_birthday
```

# 3.3. Configure Deploy

The configuration file is located in `deploy/config.js`.

```js
{
  deployTo: STRING, // Directory to be deploy
  user: STRING, // Username to connect with SSH
  port: INTEGER, // Port of SSH
  repository: STRING, // Repository URL
  keepReleases: INTEGER, // How many releases to be keeped
  key: STRING, // SSH key
  ignore: [STRING], // Files and folders to be ignored when copy from workspace to release folder
  paths: {
    current: STRING, // Directory path for current release
    workspace: STRING, // Directory path for workspace
    releases: STRING, // Directory path for releases
    shared: STRING, // Directory path for shared
    releaseFile: STRING, // File path for release control
    lockFile: STRING, // File path for lock control
  },
  shared: {
    dirs: [
      {
        source: STRING, // Source path
        name: STRING, // Name of target folder in shared folder
      },
    ],
  },
  stages: {
    staging: {
      host: STRING, // Host server
      branch: STRING, // Branch name
    },
    production: {
      host: STRING, // Host server
      branch: STRING, // Branch name
    },
  },
}
```
