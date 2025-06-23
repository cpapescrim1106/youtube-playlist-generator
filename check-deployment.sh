#!/bin/bash

echo "Checking YouTube Playlist Generator deployment..."
echo ""

# Check if the app is accessible
URL="https://youtube-playlist-creater.srv835477.hstgr.cloud"

echo "Testing main page..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$HTTP_STATUS" == "200" ]; then
    echo "✅ Main page is accessible (HTTP $HTTP_STATUS)"
else
    echo "❌ Main page returned HTTP $HTTP_STATUS"
fi

echo ""
echo "Testing API health..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/v1/stats")
if [ "$API_STATUS" == "200" ]; then
    echo "✅ API is responding (HTTP $API_STATUS)"
else
    echo "❌ API returned HTTP $API_STATUS"
fi

echo ""
echo "Testing API docs..."
DOCS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/docs")
if [ "$DOCS_STATUS" == "200" ]; then
    echo "✅ API docs are accessible (HTTP $DOCS_STATUS)"
else
    echo "❌ API docs returned HTTP $DOCS_STATUS"
fi

echo ""
echo "Deployment check complete!"