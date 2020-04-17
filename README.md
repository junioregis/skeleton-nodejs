# Resume

This is a complete guide to create Dockerized NodeJS Api.

# Features

> VPS

- Docker configurator
- Nginx for reverse proxy configurator
- Letsencrypt ready
- Portainer for container management
- VirtualBox configuration (for test)

> API

- API versioning
- Rate Limiter
- OAuth2 implementation
- Social login with Facebook and Google
- Slack integration for logging
- Scheduler for running background tasks
- Mailer helper
- Internationalization helper
- Web scraper
- Uploads ready
- Postman file (for test)
- CLI for deploy to VPS
- Database admin (development only)

# Arquitecture

## Config

There are 3 configuration files, one for each environment: `development.config.js`,`staging.config.js` e `production.config.js` located in the folder `config`.

```js
{
  "slack": {
    "webHook": STRING
  },
  "mailer": {
    "host": STRING,
    "port": INTEGER,
    "user": STRING,
    "pass": STRING,
    "from": STRING
  }
}
```

## Security

The security files are located in the folder `security`:

> Token Manager

Manages users' tokens.

## Controllers, Routes and Validations

Controllers are separated by folder named by the version number of the API.

Each controller has a corresponding validation and route:

| Controller                             | Validation                                         | Route                        |
| -------------------------------------- | -------------------------------------------------- | ---------------------------- |
| `controllers/v1/auth.controller.js`    | `controllers/v1/validations/auth.validation.js`    | `routes/v1/auth.route.js`    |
| `controllers/v1/profile.controller.js` | `controllers/v1/validations/profile.validation.js` | `routes/v1/profile.route.js` |

## Repositories

The repository files are located in the folder `repositories`.

- `auth.repository.js`
- `profile.repository.js`

## Middlewares

Order:

`Rate Limit > Api Version > Client > Geo > Auth`

> Rate Limit

It is responsible for limit the number of requests for a certain period of time for each `client`.

> Api Version

It is responsible for checking the version of the API to be called. Builds `req.apiVersion (INTEGER)`.

> Client

It is responsible for verifying the client's credentials (`client_id` e `client_secret`). Builds `req.client`:

```js
{
  "id": UUID,
  "name": STRING,
}
```

> Geo

It is responsible for checking the client's location. Builds `req.geo`:

```js
{
  "ip": STRING,
  "ll": [FLOAT, FLOAT],
  "country": STRING,
  "lang": STRING, // (en|pt-BR)
  "unit": STRING // (miles|km)
}
```

> Auth

It is responsible for checking the authorization of the current user. Builds `req.currentUser`:

```js
{
  "id": UUID,
  "email": STRING,
  "enabled": BOOLEAN,
  "profile": {
    "name": STRING,
    "birthday": DATE,
    "gender": STRING // (null|male|female)
  },
  "preference": {
    "locale": STRING, // (en|pt-BR)
    "unit": STRING // (miles|km)
  }
}
```

## Database

### Config

The configuration file is located at `db/config.json`. Do not change this file.

### Migrations

The migration files are located in the folder `db/migrations`:

- `1-clients.migration.js`
- `2-users.migration.js`
- `3-tokens.migration.js`
- `4-providers.migration.js`
- `5-profiles.migration.js`
- `6-preferences.migration.js`

### Models

The models are located in the folder `db/models`:

- `client.model.js`
- `preference.model.js`
- `profile.model.js`
- `provider.model.js`
- `token.model.js`
- `user.model.js`

Example of how to use a model with a transaction:

```js
const db = require("./db");

await db.sequelize.transaction(async (transaction) => {
  try {
    const user = await db.users.findOne({
      where: {
        email: "rick.sanches@domain.com",
      },
    });
  } catch (e) {
    transaction.rollback();
  }
});
```

### Seeders

The seed files are located in the folder `db/seed`:

- `1-client.seed.js`

## Internationalization

The translation files are located in the folder `i18n/locales`:

- `en.json`
- `pt-BR.json`

Example of how to translate a string:

```js
const i18n = require("./i18n");

i18n.t("pt-BR", "server.words.hello");
```

## Services

The services are located in the folder `services`.

> Scheduler

- `cron.service.js`

```js
const { cron } = require("./services");

cron.start(name, "* * * * *", () => {
  console.log("[scheduler]", "Message sent at:", new Date());
});
```

> Providers

- `social/facebook.service.js`
- `social/google.service.js`

Exemple:

```js
const { social } = require("./services");

const facebook = social.facebook;
const google = social.google;

const facebookUser = await facebook.getUser(facebookAccessToken);
const googleUser = await google.getUser(googleAccessToken);

console.log(facebookUser);
console.log(googleUser);
```

Result:

```js
{
  "provider": STRING, // (facebook|google)
  "provider_id": STRING,
  "email": STRING,
  "name": STRING,
  "gender": STRING, // (null|male|female)
  "birthday": DATE,
  "photo": STRING
}
```

Attention:

If the Google User has set the read permission for the attribute `gender` with `PRIVATE`, the response field `gender` return `null`.

> Scraping

- `scrapper.service.js`
- `scrap/google.scrap.service.js`

Example:

```js
const { scrapper } = require("./services");

scraper.nav("https://www.google.com", async (driver) => {
  const html = await driver.getPageSource();

  console.log(html);
});
```

> Mailer

All email templates are named as `[name].template.[locale].html` and located in the folder `services/mailer/templates`.

- `signup.template.en.html`
- `signup.template.pt-BR.html`

> Logging

- `log.service.js`
- `slack.service.js`

Example:

```js
const { log } = require("./services");

const text = "Hello World!";

log.i(text);
log.e(text, false); // Don't send message to Slack
```

> Util

The utility files are located in the folder `util`:

- `date.util.js`
- `file.util.js`
- `net.util.js`
- `string.util.js`

## Uploads

User uploaded files will be stored in the folder `uploads`. This folder will be mapped as container `volume`. Do not create or place files on it. It is already in `.gitignore`.

## Public

Static public files are located in the folder `public`.

# Third-Party Libraries

Main:

- [body-parser](https://www.npmjs.com/package/body-parser)
- [crypto-js](https://www.npmjs.com/package/crypto-js)
- [express](https://www.npmjs.com/package/express)

Middlewares:

- [compression](https://www.npmjs.com/package/compression)
- [cors](https://www.npmjs.com/package/cors)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [express-validator](https://www.npmjs.com/package/express-validator)

Database:

- [pg](https://www.npmjs.com/package/pg)
- [pg-hstore](https://www.npmjs.com/package/pg-hstore)
- [sequelize](https://www.npmjs.com/package/sequelize)

Scheduler:

- [node-cron](https://www.npmjs.com/package/node-cron)

Image Processor:

- [sharp](https://www.npmjs.com/package/sharp)

Mailer:

- [ejs](https://www.npmjs.com/package/ejs)
- [nodemailer](https://www.npmjs.com/package/nodemailer)

Scraping:

- [selenium-webdriver](https://www.npmjs.com/package/selenium)

Logging:

- [colors](https://www.npmjs.com/package/colors.js)
- [@slack/webhook](https://www.npmjs.com/package/@slack/webhook)

Util:

- [geoip-lite](https://www.npmjs.com/package/node-geoip)
- [moment](https://www.npmjs.com/package/moment)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [ssh2](https://www.npmjs.com/package/ssh2)
- [uuid](https://www.npmjs.com/package/uuid)

# Docker Images

- [node](https://hub.docker.com/_/node)
- [postgres](https://hub.docker.com/_/postgres)
- [dpage/pgadmin4](https://hub.docker.com/r/dpage/pgadmin4)
- [selenium/standalone-chrome](https://hub.docker.com/r/selenium/standalone-chrome)

# Wiki

You can see [wiki here](https://github.com/junioregis/skeleton-nodejs/wiki).
