#!/bin/bash

ID="$1"
KEY="$2"
VALUE="$3"

JSON=$(printf '{"ID": "%s", "%s": "%s"}' "$ID" "$KEY" "$VALUE")

curl -X PUT "https://u8m0btl997.execute-api.us-east-1.amazonaws.com/update/s3Music" \
  -H "Content-Type: application/json" \
  -d "$JSON"
