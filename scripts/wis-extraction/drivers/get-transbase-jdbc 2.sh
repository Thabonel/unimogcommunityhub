#!/bin/bash

# Download Transbase JDBC Driver
# This is the driver everyone in the Mercedes community uses

echo "Downloading Transbase JDBC driver..."

# Try multiple sources
URLS=(
  "https://github.com/mbtools/transbase-jdbc/releases/download/v2.0/transbase-jdbc-2.0.jar"
  "https://www.transaction.de/fileadmin/downloads/Transbase/transbase.jar"
  "http://www.transaction.de/downloads/transbase/jdbc/transbase-jdbc.jar"
)

for URL in "${URLS[@]}"; do
  echo "Trying: $URL"
  if curl -L -o transbase.jar "$URL" 2>/dev/null; then
    SIZE=$(ls -lh transbase.jar | awk '{print $5}')
    if [[ "$SIZE" != "0B" ]]; then
      echo "✅ Downloaded transbase.jar ($SIZE)"
      echo "Location: $(pwd)/transbase.jar"
      exit 0
    fi
  fi
done

echo "Manual download needed. Go to:"
echo "https://www.transaction.de/en/download.html"
echo "Download the JDBC driver and save as transbase.jar"