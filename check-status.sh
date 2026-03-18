#!/usr/bin/env bash
# Focus Tracker Setup & Status Check

echo "=================================================="
echo "🎯 Focus Tracker - Setup Status"
echo "=================================================="
echo ""

# Check project directory
if [ -d "src" ] && [ -f "package.json" ]; then
    echo "✅ Project directory: OK"
else
    echo "❌ Project directory: MISSING"
    exit 1
fi

# Check dependencies
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed: YES"
else
    echo "⚠️  Dependencies: NOT installed (run: npm install)"
fi

# Check documentation
docs=("README.md" "GETTING_STARTED.md" "QUICKSTART.md" "DEVELOPMENT.md" "PROJECT_SUMMARY.md" "CHANGELOG.md" "DOCUMENTATION_INDEX.md" "BUILD_COMPLETE.md")
echo ""
echo "📚 Documentation:"
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ❌ $doc"
    fi
done

# Check core files
echo ""
echo "📁 Core files:"
files=("src/app/page.tsx" "src/components/FocusTracker.tsx" "src/lib/db.ts" "src/types/index.ts")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file"
    fi
done

# Check configuration
echo ""
echo "⚙️  Configuration:"
configs=("next.config.ts" "tailwind.config.ts" "tsconfig.json" "package.json")
for config in "${configs[@]}"; do
    if [ -f "$config" ]; then
        echo "  ✅ $config"
    else
        echo "  ❌ $config"
    fi
done

echo ""
echo "=================================================="
echo "🚀 Getting Started:"
echo "=================================================="
echo ""
echo "1. Start dev server:  npm run dev"
echo "2. Open in browser:   http://localhost:3000"
echo "3. Read guide:        GETTING_STARTED.md"
echo ""
echo "=================================================="
echo "📚 Documentation:"
echo "=================================================="
echo ""
echo "Quick Overview:       BUILD_COMPLETE.md"
echo "Getting Started:      GETTING_STARTED.md"
echo "Quick Start (5min):   QUICKSTART.md"
echo "Full Docs:            README.md"
echo "Technical Details:    DEVELOPMENT.md"
echo "Project Overview:     PROJECT_SUMMARY.md"
echo "Feature List:         CHANGELOG.md"
echo "Doc Navigation:       DOCUMENTATION_INDEX.md"
echo ""
echo "=================================================="
echo ""
