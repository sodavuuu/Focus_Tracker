#!/usr/bin/env node

/**
 * Initialize Focus Tracker Database
 * Run this script once to set up the database structure
 * 
 * Usage: node scripts/init-db.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', '.data', 'focus-tracker.db');

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`✓ Created database directory: ${dbDir}`);
}

// Open database
const db = new Database(DB_PATH);

// Set WAL mode for better concurrency
db.pragma('journal_mode = WAL');
console.log('✓ Enabled WAL mode');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startTime INTEGER NOT NULL,
    endTime INTEGER,
    duration INTEGER,
    completed BOOLEAN DEFAULT 0,
    name TEXT DEFAULT 'Focus Session',
    type TEXT DEFAULT 'pomodoro',
    createdAt INTEGER NOT NULL
  );
`);
console.log('✓ Created sessions table');

// Create indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_sessions_createdAt ON sessions(createdAt);
  CREATE INDEX IF NOT EXISTS idx_sessions_completed ON sessions(completed);
`);
console.log('✓ Created indexes');

// Insert sample data (optional)
const insertSample = process.argv.includes('--sample');
if (insertSample) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  const stmt = db.prepare(`
    INSERT INTO sessions (startTime, endTime, duration, completed, name, type, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Add sample sessions for the last 7 days
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < Math.floor(Math.random() * 4) + 1; j++) {
      const startTime = now - (i * day) - (Math.random() * day);
      const duration = [15, 25, 45, 90][Math.floor(Math.random() * 4)] * 60;
      const endTime = startTime + (duration * 1000);
      
      stmt.run(
        startTime,
        endTime,
        duration,
        1,
        ['Deep Work', 'Code Review', 'Documentation', 'Testing'][Math.floor(Math.random() * 4)],
        'pomodoro',
        startTime
      );
    }
  }
  console.log('✓ Inserted sample sessions');
}

db.close();
console.log(`\n✅ Database initialized successfully!`);
console.log(`📍 Location: ${DB_PATH}`);
console.log(`\nNext steps:`);
console.log(`1. Run: npm run dev`);
console.log(`2. Open: http://localhost:3000`);
console.log(`3. Start tracking your focus sessions!\n`);
