#!/bin/bash

# TypeTee.app - Initial Setup Script
# This script helps you set up your development environment

echo "🎨 TypeTee.app - Initial Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm version: $(npm --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
else
    echo "✓ Dependencies already installed"
    echo ""
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✓ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your API keys:"
    echo "   - Stripe keys"
    echo "   - Printify credentials"
    echo ""
else
    echo "✓ .env.local already exists"
    echo ""
fi

# Check if sound effects directory exists
if [ ! -d "public/sounds" ]; then
    mkdir -p public/sounds
    echo "✓ Created public/sounds directory"
fi

echo "================================"
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Edit .env.local with your API keys:"
echo "   - Get Stripe keys from: https://stripe.com"
echo "   - Get Printify keys from: https://printify.com"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "4. (Optional) Add sound effects to public/sounds/click.mp3"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - README.md"
echo "   - QUICKSTART.md"
echo "   - PROJECT_SUMMARY.md"
echo ""
echo "🚀 Ready to build amazing retro t-shirts!"
