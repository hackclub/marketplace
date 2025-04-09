#!/bin/bash

# Coolify deployment trigger script with auth

URL="https://app.coolify.io/api/v1/deploy?uuid=z8cwk8cgo8og08kggcow0cko&force=false"
#TOKEN="your_api_token_here"  # <- Replace this with your actual token

curl -X POST "$URL" \
     -H "Authorization: Bearer $TOKEN"
