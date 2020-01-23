#!/bin/bash
./down.sh
docker volume rm webshop_order_db_data
docker-compose -f compose/order_db.yml --project-directory . up
