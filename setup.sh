#!/bin/bash

set -e

echo "Installing dependencies..."
npm install

echo "Building extension..."
npm run build

echo ""
echo "Opening Chrome extensions page and dist/ folder..."
open dist/
open -a "Google Chrome" "chrome://extensions/"

echo ""
echo "Done! In Chrome:"
echo "  1. Enable Developer mode (top-right toggle)"
echo "  2. Click 'Load unpacked' and select the 'dist/' folder that just opened in Finder"
