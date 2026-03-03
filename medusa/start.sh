#!/bin/sh
set -e

echo "Running database migrations..."
medusa db:migrate

echo "Starting Medusa..."
exec medusa develop
