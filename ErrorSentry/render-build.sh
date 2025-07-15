#!/bin/bash

echo "=== Render Build Script ==="
echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

# Navigate to project root if needed
if [ ! -f "package.json" ]; then
    echo "package.json not found, checking parent directories..."
    cd ..
    if [ ! -f "package.json" ]; then
        echo "Still no package.json, trying one more level up..."
        cd ..
        if [ ! -f "package.json" ]; then
            echo "ERROR: Cannot find package.json"
            exit 1
        fi
    fi
fi

echo "Found package.json in: $(pwd)"
echo "Installing dependencies..."

# Use npm install instead of npm ci to avoid lock file issues
npm install

echo "Building application..."
npm run build

echo "Build complete!"