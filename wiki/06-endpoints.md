# POST /auth

Headers:

```json
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER
}
```

Body:

```json
{
  "grant_type": "provider",
  "provider": "facebook|google",
  "access_token": ""
}
```

Result:

```json
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

```json
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Body:

```json
{
  "refresh_token": STRING
}
```

Result:

```json
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

```json
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Body:

```json
{
  "access_token": STRING
}
```

# GET /profile/me

Headers:

```json
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Result:

```json
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

```json
{
  "client_id": STRING,
  "client_secret": STRING,
  "api_version": INTEGER,
  "authorization": STRING
}
```

Body:

```json
{
  "name": STRING,
  "birthday": INTEGER,
  "gender": STRING,
  "photo": STRING // Base64
}
```

Result:

```json
{
  "meta": {
    "message": STRING
  }
}
```

# GET /img/profiles/:user_id

Headers:

```json
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
