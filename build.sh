#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Installing Python Dependencies ==="
pip install --upgrade pip
pip install -r requirements.txt

echo "=== Building C++ TokenForge Core ==="
# Ensure clean build directory for Linux
rm -rf build
cmake -B build -S .
cmake --build build

# Ensure executable permissions on Linux
chmod +x build/tokenforge_api || true
chmod +x build/TokenForge || true

echo "=== Build Complete ==="
