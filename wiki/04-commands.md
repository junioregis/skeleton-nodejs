# Development

> Build Images

```bash
bash scripts/dev.sh build
```

> Start Containers

```bash
bash scripts/dev.sh start
```

> Stop Containers

```bash
bash scripts/dev.sh stop
```

> Open Terminal

```bash
bash scripts/dev.sh terminal
```

## Database

> Migrate

```bash
bash scripts/dev.sh db-migrate
```

> Seed

```bash
bash scripts/dev.sh db-seed
```

> Reset

```bash
bash scripts/dev.sh db-reset
```

## Client Credentials

```bash
bash scripts/dev.sh db-clients
```

## Deploy

> Configure Git Repository

```bash
bash scripts/dev.sh deployer staging config
```

> Deploy

```bash
bash scripts/dev.sh deployer staging deploy
```

## Logs

```bash
bash scripts/dev.sh logs
```

# Production

> Client Credentials

```bash
bash scripts/prd.sh show-clients
```

> Logs

```bash
bash scripts/prd.sh logs
```
