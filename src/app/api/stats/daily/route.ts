import { NextRequest, NextResponse } from 'next/server';
import getDatabase from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');
    
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
    
    const sessions = db.prepare(`
      SELECT * FROM sessions 
      WHERE createdAt >= ? AND completed = 1
      ORDER BY createdAt
    `).all(startTime) as any[];
    
    const stats: Record<string, any> = {};
    
    sessions.forEach((session) => {
      const date = new Date(session.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!stats[dateKey]) {
        stats[dateKey] = {
          date: dateKey,
          sessions: 0,
          totalDuration: 0,
          avgDuration: 0
        };
      }
      
      stats[dateKey].sessions += 1;
      stats[dateKey].totalDuration += session.duration || 0;
    });
    
    Object.keys(stats).forEach(key => {
      stats[key].avgDuration = stats[key].sessions > 0 
        ? Math.round(stats[key].totalDuration / stats[key].sessions)
        : 0;
    });
    
    const data = Object.values(stats).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
