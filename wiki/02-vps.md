# 2.1. Connect

```bash
ssh ubuntu@domain.com
```

# 2.2. Configure User

```bash
sudo sh -c "echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers"
```

# 2.3. Configure SSH (local)

## 2.3.1. Optional: Create Key

```bash
ssh-keygen
```

## 2.3.2. Copy Key to Server

```bash
ssh-copy-id ubuntu@domain.com
```

# 2.4. Setup OS

```bash
ssh ubuntu@domain.com 'bash -s' < scripts/vps/install-system.sh
```

`Wait for system reboot`

# 2.5. Setup Proxy

Copy Files:

```bash
ssh ubuntu@domain.com "mkdir -p ~/proxy"

scp scripts/vps/proxy/docker-compose.yml \
    scripts/vps/proxy/nginx.tmpl \
    scripts/vps/proxy/Makefile \
    ubuntu@domain.com:~/proxy
```

Install:

```bash
ssh ubuntu@domain.com 'bash -s' < scripts/vps/proxy/install-proxy.sh
```

# 2.5. Setup Git

```bash
bash scripts/dev.sh deploy config
```
