#!/bin/bash
docker-compose -f compose/user_db.yml -f compose/user.yml -f compose/user_mongo_express.yml --project-directory . up