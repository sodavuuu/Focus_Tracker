import { NextRequest, NextResponse } from 'next/server';
import getDatabase from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');
    const completed = searchParams.get('completed');
    
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
    
    let query = 'SELECT * FROM sessions WHERE createdAt >= ?';
    const params: any[] = [startTime];
    
    if (completed !== null) {
      query += ' AND completed = ?';
      params.push(completed === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY createdAt DESC';
    
    const stmt = db.prepare(query);
    const sessions = stmt.all(...params);
    
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
