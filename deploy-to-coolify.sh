#!/bin/bash

# Exit immediately on error
set -e

# Usage:
# ./deploy-to-coolify.sh <UUID> <API_TOKEN>
# Or use env vars: COOLIFY_UUID and COOLIFY_API_TOKEN

UUID="${1:-$COOLIFY_UUID}"
TOKEN="${2:-$COOLIFY_API_TOKEN}"
BASE_URL="${COOLIFY_URL:-https://app.coolify.io}"

if [[ -z "$UUID" || -z "$TOKEN" ]]; then
  echo "❌ Error: UUID and API token must be provided."
  echo "Usage: $0 <UUID> <TOKEN>"
  echo "Or set env vars: COOLIFY_UUID and COOLIFY_API_TOKEN"
  exit 1
fi

DEPLOY_URL="${BASE_URL}/api/v1/deploy?uuid=${UUID}&force=false"
LOGS_URL="${BASE_URL}/api/v1/applications/${UUID}/logs"

echo "🚀 Triggering Coolify deployment for UUID: $UUID"
curl -sS -X POST "$DEPLOY_URL" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json"

echo "✅ Deployment triggered. Waiting for logs..."
sleep 3

echo "📜 Streaming logs from: $LOGS_URL (CTRL+C to stop)"
curl -sN "$LOGS_URL" \
     -H "Authorization: Bearer $TOKEN" | jq .logs
