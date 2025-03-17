#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Function to wait for database to be ready
wait_for_db() {
  echo "Waiting for database to be ready..."
  for i in {1..30}; do
    if PGPASSWORD=$DATABASE_PASSWORD psql -h $DATABASE_HOST -U $DATABASE_USER -d postgres -c '\q' >/dev/null 2>&1; then
      echo "Database is ready!"
      return 0
    fi
    echo "Attempt $i/30: Database not ready yet..."
    sleep 2
  done
  echo "Database connection timeout"
  return 1
}

# Drop and recreate test database
echo "Dropping test database if it exists..."
PGPASSWORD=$DATABASE_PASSWORD psql -h $DATABASE_HOST -U $DATABASE_USER -d postgres -c "DROP DATABASE IF EXISTS neondb_test;"

echo "Creating test database..."
PGPASSWORD=$DATABASE_PASSWORD psql -h $DATABASE_HOST -U $DATABASE_USER -d postgres -c "CREATE DATABASE neondb_test;"

# Wait for database to be ready
wait_for_db

# Reset Prisma migrations
echo "Resetting Prisma migrations..."
rm -rf prisma/migrations

# Initialize Prisma with fresh migration
echo "Initializing Prisma with fresh migration..."
npx prisma migrate reset --force --schema=./prisma/schema.prisma

# Run seed script on test database
echo "Running seed script..."
DATABASE_URL=$TEST_DATABASE_URL npx prisma db seed

echo "Test database setup complete!" 