#!/bin/bash
./down.sh
docker volume rm webshop_product_db_data
docker-compose -f compose/product_db.yml --project-directory . up
