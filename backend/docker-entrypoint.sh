#!/usr/bin/env bash
set -e

# Wait for Postgres to be available
host="${DB_HOST:-postgres}"
port="${DB_PORT:-5432}"

echo "Waiting for postgres at $host:$port..."

until python - <<PY
import sys
import psycopg2
from time import sleep
try:
    dsn = "dbname='{db}' user='{user}' password='{pw}' host='{host}' port='{port}'".format(
        db='turnoverdb', user='admin', pw='password123', host='$host', port='$port'
    )
    conn = psycopg2.connect(dsn)
    conn.close()
    print('Postgres is available')
except Exception as e:
    print('Postgres not ready, retrying...')
    sys.exit(1)
PY

sleep 1

# Start Uvicorn (dev-friendly with reload)
if [ "$ENV" = "production" ]; then
  exec uvicorn app.main:app --host 0.0.0.0 --port 8001
else
  exec uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
fi
