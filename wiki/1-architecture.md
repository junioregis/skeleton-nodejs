# Arquitecture

## Third-Party Libraries

Main:

- [body-parser](https://www.npmjs.com/package/body-parser)
- [crypto-js](https://www.npmjs.com/package/crypto-js)
- [express](https://www.npmjs.com/package/express)

Middlewares:

- [compression](https://www.npmjs.com/package/compression)
- [cors](https://www.npmjs.com/package/cors)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [helmet](https://www.npmjs.com/package/helmet)
- [multer](https://www.npmjs.com/package/multer)

Database:

- [pg](https://www.npmjs.com/package/pg)
- [pg-hstore](https://www.npmjs.com/package/pg-hstore)
- [redis](https://www.npmjs.com/package/redis)
- [sequelize](https://www.npmjs.com/package/sequelize)
- [sequelize-cli](https://www.npmjs.com/package/sequelize-cli)

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

- [faker](https://www.npmjs.com/package/faker) (dev only)
- [geoip-lite](https://www.npmjs.com/package/node-geoip)
- [moment](https://www.npmjs.com/package/moment)
- [nodemon](https://www.npmjs.com/package/nodemon) (dev only)
- [uuid](https://www.npmjs.com/package/uuid)
- [yauzl](https://www.npmjs.com/package/yauzl) (dev only)

## Docker Images

- [node](https://hub.docker.com/_/node)
- [postgres](https://hub.docker.com/_/postgres)
- [redis](https://hub.docker.com/_/redis)
- [dpage/pgadmin4](https://hub.docker.com/r/dpage/pgadmin4)
- [selenium/standalone-chrome](https://hub.docker.com/r/selenium/standalone-chrome)

## Config

There are 3 configuration files, one for each environment: `development.config.js` , `staging.config.js` e `production.config.js` located in the folder `config`.

## Controllers, Routes and Validations

Controllers are separated by folder named by the version number of the API.

Each controller has a corresponding validation and route:

| Controller                             | Validation                                         | Route                        |
| -------------------------------------- | -------------------------------------------------- | ---------------------------- |
| `controllers/v1/auth.controller.js`    | `controllers/v1/validations/auth.validation.js`    | `routes/v1/auth.route.js`    |
| `controllers/v1/profile.controller.js` | `controllers/v1/validations/profile.validation.js` | `routes/v1/profile.route.js` |
| `controllers/v1/user.controller.js`    | `controllers/v1/validations/user.validation.js`    | `routes/v1/user.route.js`    |

## Repositories

The repository files are located in the folder `repositories`.

## Middlewares

Order:

`Helmet > Rate Limit > Compression > Cors > Assets > Api Version > Client > Geo > Auth > Body Parser > Cache (Optional)`

> Helmet

It is responsible for help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.

> Rate Limit

It is responsible for limit the number of requests for a certain period of time for each `client`.

> Compression

It is responsible for compress responses.

> Cors

It is responsible for CORS (Cross-Origin Resource Sharing).

> Assets

It is responsible for handling requests to public archives.

> Api Version

It is responsible for checking the version of the API to be called. Builds `req.apiVersion (INTEGER)`.

> Client

It is responsible for verifying the client's credentials ( `client-id` e `client-secret` ). Builds `req.client` :

```js
{
    "id": UUID,
    "name": STRING,
}
```

> Geo

It is responsible for checking the client's location. Builds `req.geo` :

Reverse geocoding through the latitude and longitude sent by the client on the request headers.

If the client has not sent location, reversing geocoding is calculated using the request IP.

```js
{
    "city": STRING,
    "country": STRING,
    "latitude": FLOAT,
    "longitude": FLOAT,
    "lang": STRING, // (en|pt-BR)
    "unit": STRING, // (miles|km)
    "ip": STRING
}
```

> Auth

It is responsible for checking the authorization of the current user. Builds `req.currentUser` :

```js
{
    "id": UUID,
    "email": STRING,
    "enabled": BOOLEAN,
    "preference": {
        "locale": STRING, // (en|pt-BR)
        "unit": STRING // (miles|km)
    }
}
```

> Body Parser

It is responsible for for parse incoming request bodies in a middleware before your handlers.

> Cache (Optional)

It is responsible for controlling caches for routes.

## Geocoding

> CLI

Update locations. Will update file `/app/src/geo/geo.db` :

```bash
make geo-update
```

> Distance

```js
const geo = require("./geo");

const distance = geo.distance(
  {
    latitude: FLOAT,
    longitude: FLOAT,
  },
  {
    latitude: FLOAT,
    longitude: FLOAT,
  },
  "m" // (m|km|miles)
);

console.log(distance);
```

> Reverse

```js
const geo = require("./geo");

const location = geo.reverse(latitude, longitude);

console.log(location);
```

> Random

```js
const geo = require("./geo");

const location = geo.random(latitude, longitude, radius, unit);

console.log(location);
```

> From IP

```js
const geo = require("./geo");

const location = geo.lookup(ip);

console.log(location);
```

## Database

### Config

The configuration file is located at `db/pg/config.js`. Do not change this file.

### Migrations

The migration files are located in the folder `db/pg/migrations` :

### Models

The models are located in the folder `db/pg/models` :

Example of how to use a model with a transaction:

```js
const { pg } = require("./db");

await pg.transaction(async (transaction) => {
  try {
    const user = await pg.models.users.findOne({
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

The seed files are located in the folder `db/pg/seed`. The seed files for `development` are located in the folder `db/pg/seed/dev`.

If you want to seed `development` with fake data:

```bash
make db-seed
```

## Internationalization

The translation files are located in the folder `i18n/locales` :

- `en.json`
- `pt-BR.json`

Example of how to translate a string:

```js
const i18n = require("./i18n");

i18n.t("pt-BR", "server.words.hello");
```

## Services

Services are located in the folder `services`.

> Cache

`Manage cache for routes.`

Inside route:

```js
const express = require("express");

const cache = require("./middlewares/cache.middleware.js");
const controller = require("./controllers/v1/example.controller.js");

const router = express.Router();

router.route("/foo").get(cache("foo-key"), controller.foo);
```

Inside controller:

```js
await cache.set(req, "key", body, -1); // Expiration limit: Infinity
await cache.set(req, "key", body, 25); // Expiration limit: 25s

await cache.del(req, "key"); // Deletes cache for given key
```

Geo's Middleware uses method `get` to control responses:

```js
await cache.get(req, "key", body, exp);
```

> Scheduler

- `cron.service.js`

```js
const { cron } = require("./services");

cron.start(name, "* * * * *", () => {
  console.log("[scheduler]", "Message sent at:", new Date());
});
```

> Providers

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

If the Google User has set the read permission for the attribute `gender` with `PRIVATE` , the response field `gender` return `null`.

> Scraping

- `scrapper.service.js`
- `scrap/google.scrap.service.js`

Example:

```js
const { selenium } = require("./services");

selenium.nav("https://www.google.com", async (driver) => {
  const html = await driver.getPageSource();

  console.log(html);
});
```

> Mailer

All email templates are named as `[name].template.[locale].html` and located in the folder `services/mailer/templates`.

> Logging

```js
const { log } = require("./services");

const text = "Hello World!";

logger.i(text); // Info
logger.w(text); // Warning
logger.e(text, false); // Error. Don't send message to Slack
```

> Util

The utility files are located in the folder `util` :

## Uploads

User uploaded files will be stored in the folder `app/uploads`. This folder will be mapped as container `volume`. Do not create or place files on it.

## Assets

Static public files are located in the folder `public`.
