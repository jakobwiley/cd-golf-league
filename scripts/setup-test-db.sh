#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Function to wait for database to be ready
wait_for_db() {
  echo "Waiting for database to be ready..."
  for i in {1..30}; do
    if psql "$DATABASE_URL" -c '\q' >/dev/null 2>&1; then
      echo "Database is ready!"
      return 0
    fi
    echo "Attempt $i/30: Database not ready yet..."
    sleep 2
  done
  echo "Database connection timeout"
  return 1
}

# Wait for database to be ready
wait_for_db

# Reset Prisma migrations
echo "Resetting Prisma migrations..."
rm -rf prisma/migrations

# Initialize Prisma with fresh migration
echo "Initializing Prisma with fresh migration..."
npx prisma migrate dev --name init

# Run seed script
echo "Running seed script..."
npx prisma db seed

echo "Test database setup complete!" 