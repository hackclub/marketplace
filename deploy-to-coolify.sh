#!/bin/bash

# Exit immediately on error
set -e

# Assign arguments
# COOLIFY_UUID="$1"
# API_TOKEN="$2"

# Use default Coolify URL unless overridden
COOLIFY_URL="${COOLIFY_URL:-https://coolify.io}"

# Redeploy endpoint
REDEPLOY_ENDPOINT="${COOLIFY_URL}/api/v1/deployments/${COOLIFY_UUID}/redeploy"

echo "Triggering redeployment for UUID ${COOLIFY_UUID} at ${COOLIFY_URL}..."
curl -X POST "${REDEPLOY_ENDPOINT}" \
     -H "Authorization: Bearer ${API_TOKEN}" \
     -H "Content-Type: application/json" \
     --fail

echo "Redeployment triggered successfully."
sleep 3

# Logs endpoint
LOGS_ENDPOINT="${COOLIFY_URL}/api/v1/deployments/${COOLIFY_UUID}/logs?follow=1"

echo "Streaming logs... (Press CTRL+C to stop)"
curl -N "${LOGS_ENDPOINT}" \
     -H "Authorization: Bearer ${API_TOKEN}" || {
         echo "Failed to stream logs."
         exit 1
     }
