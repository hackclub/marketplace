#!/bin/bash

# Exit immediately on error
set -e

# Usage:
# ./deploy-to-coolify.sh <UUID> <API_TOKEN> <SLACK_TOKEN> <SLACK_CHANNEL>
# Or use env vars: COOLIFY_UUID, COOLIFY_API_TOKEN, SLACK_TOKEN, SLACK_CHANNEL

UUID="${1:-$COOLIFY_UUID}"
TOKEN="${2:-$COOLIFY_API_TOKEN}"
SLACK_TOKEN="${3:-$SLACK_TOKEN}"
SLACK_CHANNEL="${4:-$SLACK_CHANNEL}"
BASE_URL="${COOLIFY_URL:-https://app.coolify.io}"

if [[ -z "$UUID" || -z "$TOKEN" || -z "$SLACK_TOKEN" || -z "$SLACK_CHANNEL" ]]; then
  echo "❌ Error: UUID, API token, Slack token, and Slack channel must be provided."
  echo "Usage: $0 <UUID> <TOKEN> <SLACK_TOKEN> <SLACK_CHANNEL>"
  echo "Or set env vars: COOLIFY_UUID, COOLIFY_API_TOKEN, SLACK_TOKEN, SLACK_CHANNEL"
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

echo "📜 Streaming logs to Slack channel: $SLACK_CHANNEL (CTRL+C to stop)"

# Function to send a message to Slack using the Slack token
post_to_slack() {
  local message="$1"
  jq -n --arg channel "$SLACK_CHANNEL" --arg text "$message" \
    '{channel: $channel, text: $text}' | \
  curl -sS -X POST "https://slack.com/api/chat.postMessage" \
    -H "Authorization: Bearer $SLACK_TOKEN" \
    -H 'Content-type: application/json' \
    -d @- > /dev/null
}

post_to_slack "🚀 Deployment started for UUID: $UUID"
sleep 1
# curl  "$LOGS_URL" -H "Authorization: Bearer $TOKEN" 
# Fetch logs once
response=$(curl -s "$LOGS_URL" -H "Authorization: Bearer $TOKEN")
logs=$(echo "$response" | jq -r '.logs' 2>/dev/null || true)

if [[ -n "$logs" ]]; then
  # Truncate if longer than 3000 characters (Slack limit is ~4000, being safe)
  if (( ${#logs} > 3500 )); then
    logs="${logs:0:3500}...\n(Logs truncated)"
  fi
  post_to_slack "📦 Coolify Logs:\n\`\`\`\n$logs\n\`\`\`"
else
  post_to_slack "⚠️ No logs found for UUID: $UUID"
fi
