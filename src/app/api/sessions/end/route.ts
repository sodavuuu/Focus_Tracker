import { NextRequest, NextResponse } from 'next/server';
import getDatabase from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const { sessionId, completed = true } = await request.json();
    
    const now = Date.now();
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as any;
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    const duration = Math.round((now - session.startTime) / 1000);
    const stmt = db.prepare(`
      UPDATE sessions 
      SET endTime = ?, duration = ?, completed = ?
      WHERE id = ?
    `);
    
    stmt.run(now, duration, completed ? 1 : 0, sessionId);
    
    return NextResponse.json({
      success: true,
      sessionId,
      duration
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    );
  }
}
