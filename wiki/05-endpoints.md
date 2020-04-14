# POST /auth

Headers:

```js
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER
}
```

Body:

```js
{
  "grant_type": "provider",
  "provider": "facebook|google",
  "access_token": ""
}
```

Result:

```js
{
  "access_token": STRING,
  "issue_date": INTEGER,
  "expiration_date": INTEGER,
  "type": STRING,
  "scopes": [STRING],
  "refresh_token": STRING
}
```

# POST /auth/refresh

Headers:

```js
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Body:

```js
{
  "refresh_token": STRING
}
```

Result:

```js
{
  "access_token": STRING,
  "issue_date": INTEGER,
  "expiration_date": INTEGER,
  "type": STRING,
  "scopes": [STRING],
  "refresh_token": STRING
}
```

# POST /auth/revoke

Headers:

```js
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Body:

```js
{
  "access_token": STRING
}
```

# GET /profile/me

Headers:

```js
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Result:

```js
{
  "result": {
    "birthday": INTEGER,
    "name": STRING,
    "gender": STRING, // (male|female)
    "photo": STRING
  }
}
```

# PUT /profile/me

Headers:

```js
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Body:

```js
{
  "name": STRING,
  "birthday": INTEGER,
  "gender": STRING,
  "photo": STRING // Base64
}
```

Result:

```js
{
  "meta": {
    "message": STRING
  }
}
```

# GET /img/profiles/:user_id

Headers:

```js
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Result:

```js
IMAGE BYTES
```
