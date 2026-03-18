import path from 'path';
import fs from 'fs';

// In-memory database for production (Render doesn't support better-sqlite3)
// For local development, uses file-based SQLite
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

interface Session {
  id: number;
  startTime: number;
  endTime: number | null;
  duration: number | null;
  completed: boolean;
  name: string;
  type: string;
  createdAt: number;
}

let sessions: Map<number, Session> = new Map();
let nextId = 1;

// Try to use SQLite in development, fallback to in-memory
let db: any = null;

try {
  if (!IS_PRODUCTION) {
    const Database = require('better-sqlite3');
    const DB_PATH = path.join(process.cwd(), '.data', 'focus-tracker.db');
    const dbDir = path.dirname(DB_PATH);
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
} catch (e) {
  console.log('Using in-memory database (better-sqlite3 not available)');
}

function initializeDatabase() {
  if (db) {
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

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_sessions_createdAt ON sessions(createdAt);
    `);
  }
}

export function addSession(session: Omit<Session, 'id'>): number {
  if (db) {
    const result = db.prepare(`
      INSERT INTO sessions (startTime, endTime, duration, completed, name, type, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(session.startTime, session.endTime, session.duration, session.completed, session.name, session.type, session.createdAt);
    return result.lastInsertRowid;
  } else {
    const id = nextId++;
    sessions.set(id, { ...session, id });
    return id;
  }
}

export function updateSession(id: number, updates: Partial<Session>): void {
  if (db) {
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    db.prepare(`UPDATE sessions SET ${fields} WHERE id = ?`).run(...values, id);
  } else {
    const session = sessions.get(id);
    if (session) {
      sessions.set(id, { ...session, ...updates });
    }
  }
}

export function getSessions(): Session[] {
  if (db) {
    return db.prepare('SELECT * FROM sessions ORDER BY createdAt DESC').all();
  } else {
    return Array.from(sessions.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
}

export function getSession(id: number): Session | undefined {
  if (db) {
    return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
  } else {
    return sessions.get(id);
  }
}

export default function getDatabase() {
  initializeDatabase();
  return {
    addSession,
    updateSession,
    getSessions,
    getSession
  };
}
