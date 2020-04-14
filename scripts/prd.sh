#!/bin/bash

APP="skeleton"
USER="ubuntu"
DOMAIN="domain.com"

WORKDIR="/home/${USER}/apps/${APP}/current"

CMD="ssh -tt ${USER}@${DOMAIN} cd ${WORKDIR} && make"

function show-clients {
  ${CMD} show-clients
}

function logs {
  ${CMD} logs
}

case "$1" in
  show-clients)
    show-clients
    ;;
  logs)
    logs
    ;;
  *)
    echo "Usage: bash dev.sh show-clients|logs"
    exit 1
  ;;
esac