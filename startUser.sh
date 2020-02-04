#!/bin/bash
docker-compose -f compose/user_db.yml -f compose/user.yml --project-directory . up