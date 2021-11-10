#!/bin/bash
/bin/bash /Savior/docker/wait-for-it.sh -t 0 mysql:3306
export PYTHONPATH=/Savior/
python3 /Savior/manage.py makemigrations api
python3 /Savior/manage.py migrate
python3 /Savior/manage.py init_admin
supervisord -n