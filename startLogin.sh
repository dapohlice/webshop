#!/bin/bash
docker-compose -f compose/login.yml -f compose/user_db.yml -f compose/user.yml --project-directory . up
