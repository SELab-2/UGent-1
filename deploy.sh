#!/bin/bash

cd /home/selab2/hosting/UGent-1

set -a
source ./.env.prod
docker compose -f docker-compose.prod.yml --env-file .env.prod build
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --force-recreate --remove-orphans