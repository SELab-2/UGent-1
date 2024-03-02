#!/bin/bash

source /home/selab/hosting/.env.prod
docker compose -f docker-compose.prod.yml --env-file /home/selab2/hosting/.env.prod build
docker compose -f docker-compose.prod.yml --env-file /home/selab2/hosting/.env.prod up -d --force-recreate --remove-orphans