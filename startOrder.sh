#!/bin/bash
docker-compose -f compose/order_db.yml -f compose/order.yml --project-directory . up