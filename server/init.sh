#!/bin/sh
set -e

echo "db: waiting for postgres..."

until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT"; do
  sleep 1
done

echo "db: postgres is ready"

python manage.py migrate --noinput
python manage.py seed_orgs

exec "$@"
