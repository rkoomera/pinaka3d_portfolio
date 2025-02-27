#!/bin/bash

# Rebuild script for Pinaka3D Portfolio

echo "🧹 Cleaning up..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the application..."
npm run build

echo "🚀 Starting the development server..."
npm run dev 