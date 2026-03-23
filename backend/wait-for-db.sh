#!/bin/sh
# wait-for-db.sh

set -e

host="$1"
shift
cmd="$@"

# Extract password, user, database name from DATABASE_URL
# Format: postgresql://user:password@host:port/dbname
DB_USER=$(echo $DATABASE_URL | sed -n 's|postgresql://\([^:]*\):.*|\1|p')
DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's|postgresql://[^:]*:\([^@]*\)@.*|\1|p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's|.*@.*:\([0-9]*\)/\(.*\)|\2|p')

echo "DB User: $DB_USER"
echo "DB Name: $DB_NAME"
# Avoid logging password

# Attempt to connect and run a simple query until success
# Use -qtA options for clean output on success
until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "$DB_USER" -d "$DB_NAME" -qtA -c 'SELECT 1;'; do
  >&2 echo "Postgres database '$DB_NAME' is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres database '$DB_NAME' is up - executing command"
exec $cmd 