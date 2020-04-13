#!/bin/bash

TIMEZONE=America/Sao_Paulo

# Timezone

sudo ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime
sudo sh -c "echo ${TIMEZONE} > /etc/timezone"

# Essentials

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y \
  build-essential \
  curl \
  git \
  nano \
  ufw \
  unzip \
  zip

# Firewall

sudo ufw --force reset
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw default deny
sudo ufw --force enable

# Python PIP

sudo apt install -y libffi-dev libssl-dev
sudo apt install -y python3 python3-dev python3-pip

sudo pip3 install docker-compose

# Docker

curl -sSL https://get.docker.com | sh
sudo usermod -aG docker ${USER}
sudo systemctl enable docker

# Docker Compose

sudo apt install -y libffi-dev libssl-dev python3 python3-dev python3-pip
sudo pip3 install docker-compose

# Create Folders

mkdir ~/proxy
mkdir ~/apps

# Swap Memory

SIZE="1024"

if [ -f /etc/dphys-swapfile ]; then
  sudo sed -i 's/^CONF_SWAPSIZE=[0-9]*$/CONF_SWAPSIZE=${SIZE}/' /etc/dphys-swapfile
fi

# SSH

sudo -u ${USER} bash -c "ssh-keygen -f ~/.ssh/id_rsa -b 2048 -t rsa -q -N ''"

# Git

ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null

# Clean System

sudo apt autoremove
sudo apt clean

# Reboot System

sudo reboot