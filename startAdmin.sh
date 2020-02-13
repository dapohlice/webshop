#!/bin/bash
docker-compose -f compose/admin.yml -f compose/order.yml -f compose/order_db.yml -f compose/user_db.yml -f compose/user.yml --project-directory . up
