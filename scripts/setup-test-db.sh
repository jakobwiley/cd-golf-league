#!/bin/bash

# Load test environment variables
source .env.test

# Drop and recreate test database
PGPASSWORD=postgres psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS cd_golf_league_test"
PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE cd_golf_league_test"

# Run Prisma migrations on test database
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Run seed script on test database
npx prisma db seed --schema=./prisma/schema.prisma

echo "Test database setup complete!" 