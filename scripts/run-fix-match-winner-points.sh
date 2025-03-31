#!/bin/bash

# Script to run fix-match-winner-points.js with production credentials
echo "Running match winner points fix script for production..."

# Check if credentials are provided as arguments
if [ "$#" -eq 2 ]; then
  PROD_URL=$1
  PROD_KEY=$2
else
  # Prompt for production credentials if not provided
  echo "Please enter production Supabase URL and key when running this script:"
  echo "Usage: ./scripts/run-fix-match-winner-points.sh <PROD_URL> <PROD_KEY>"
  exit 1
fi

# Run the script with the provided credentials
NEXT_PUBLIC_SUPABASE_URL=$PROD_URL SUPABASE_SERVICE_ROLE_KEY=$PROD_KEY node scripts/fix-match-winner-points.js
