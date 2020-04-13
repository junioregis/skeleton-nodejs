#!/bin/bash

WORKDIR="/home/${USER}/proxy"

cd ${WORKDIR}

docker network create proxy

make start