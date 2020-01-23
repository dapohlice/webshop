#!/bin/bash
docker-compose -f compose/product_db.yml  -f compose/product.yml -f compose/product_mongo_express.yml --project-directory . up