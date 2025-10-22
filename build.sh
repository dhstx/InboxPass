#!/bin/bash
set -e

echo "Building InboxPass for production..."

# Install dependencies
pnpm install --frozen-lockfile

# Build TypeScript server
pnpm exec tsc --project tsconfig.json

# Build client with Vite
pnpm exec vite build

echo "Build complete!"
