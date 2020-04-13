#!/bin/bash

APP="skeleton"
SERVICES="app db selenium db_admin"
CMD="docker-compose --project-name=${APP} --file docker-compose.yml --file docker-compose.dev.yml"

# Set work dir
cd "$(dirname "$0")/../" || exit

function build {
  ${CMD} build ${SERVICES}
  ${CMD} pull ${SERVICES}
}

function start {
  ${CMD} up -d --remove-orphans ${SERVICES}
}

function stop {
  ${CMD} down
}

function terminal {
  ${CMD} exec app sh
}

function db-migrate {
  ${CMD} exec app npm run migrate
}

function db-seed {
  ${CMD} exec app npm run seed
}

function db-reset {
  ${CMD} exec db psql -U postgres -d db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
  
  db-migrate
  db-seed
  db-clients
}

function db-clients {
  ${CMD} exec db psql -U postgres -d db -c "SELECT * FROM clients;"
}

function deployer {
  STAGE=$1
  COMMAND=$2

  ${CMD} exec app bin/deployer.js ${STAGE} ${COMMAND}
}

function logs {
  LOG_SERVICES=${SERVICES//db_admin/}

  ${CMD} logs -f ${LOG_SERVICES}
}

case "$1" in
  build)
    build
    ;;
  start)
    start
    ;;
  stop)
    stop
    ;;
  terminal)
    terminal
    ;;
  db-migrate)
    db-migrate
    ;;
  db-seed)
    db-seed
    ;;
  db-reset)
    db-reset
    ;;
  db-clients)
    db-clients
    ;;
  deployer)
    deployer $2 $3
    ;;
  logs)
    logs
    ;;
  *)
    echo "Usage: bash dev.sh build|start|stop|terminal|db-migrate|db-seed|db-reset|db-clients|deployer|logs"
    exit 1
  ;;
esac