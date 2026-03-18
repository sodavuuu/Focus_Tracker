import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.NODE_ENV === 'production' 
  ? '/tmp/focus-tracker.db'
  : path.join(process.cwd(), '.data', 'focus-tracker.db');

let db: Database.Database | null = null;

function getDatabase() {
  if (!db) {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = getDatabase();
  
  database.exec(`
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

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_createdAt ON sessions(createdAt);
  `);
}

export default getDatabase;
