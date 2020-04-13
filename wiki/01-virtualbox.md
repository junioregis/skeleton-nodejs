# 1.1. Create Host Network Adapter

`File > Host Network Manager > Create`

| IPv4 Address | IPv4 Network Mask | DHCP Server |
| ------------ | ----------------- | ----------- |
| 192.168.56.1 | 255.255.255.0     | DISABLED    |

# 1.2. Create Virtual Machine

| CPU    | RAM     | HD    |
| ------ | ------- | ----- |
| 1 Core | 1024 MB | 20 GB |

# 1.3. Configure Network Adapters

Adapter 1:

`Virtual Machine -> Settings -> Network -> Adapter 1 > Attached to > NAT`

Adapter 2:

`Virtual Machine -> Settings -> Network -> Adapter 2 > Attached to > Host-only Adapter`

# 1.4. Download Ubuntu Server Image

_Ubuntu 18.04 - 64bit_

[https://ubuntu.com/download/server](https://ubuntu.com/download/server)

# 1.5. Install SSH

```bash
sudo apt update
sudo apt install -y openssh-server
```

# 1.6. Edit Network Interfaces

Edit Networks:

```bash
sudo nano /etc/netplan/50-cloud-init.yaml
```

```
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: true
    enp0s8:
      dhcp4: false
      addresses: [192.168.56.10/24]
      gateway4: 192.168.56.0
```

Apply changes:

```bash
sudo netplan apply
```

# 1.7. Configure Your Hosts (host)

```
192.168.56.10 domain.com
192.168.56.10 staging.domain.com
192.168.56.10 production.domain.com
192.168.56.10 portainer.domain.com
```

# 1.8. SSH Access (host)

```bash
ssh ubuntu@domain.com
```
