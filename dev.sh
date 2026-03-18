#!/bin/bash
# Focus Tracker - Development Server Startup Script

echo "🚀 Focus Tracker - Starting Development Server"
echo "=================================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start dev server
echo ""
echo "✅ Starting Next.js Development Server..."
echo ""
echo "🌐 Local:   http://localhost:3000"
echo "🌐 Network: http://192.168.x.x:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
