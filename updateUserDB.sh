#!/bin/bash
./down.sh
docker volume rm webshop_user_db_data
docker-compose -f compose/user_db.yml --project-directory . up
