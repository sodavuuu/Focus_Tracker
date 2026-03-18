import { NextRequest, NextResponse } from 'next/server';
import getDatabase from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const { name = 'Focus Session', type = 'pomodoro' } = await request.json();
    
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO sessions (startTime, name, type, createdAt)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(now, name, type, now);
    
    return NextResponse.json({
      success: true,
      sessionId: result.lastInsertRowid,
      startTime: now
    });
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json(
      { error: 'Failed to start session' },
      { status: 500 }
    );
  }
}
