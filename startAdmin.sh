#!/bin/bash
docker-compose -f compose/admin.yml -f compose/order.yml -f compose/order_db.yml --project-directory . up