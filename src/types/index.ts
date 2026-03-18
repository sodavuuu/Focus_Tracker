export interface Session {
  id: number;
  startTime: number;
  endTime: number | null;
  duration: number | null;
  completed: boolean;
  name: string;
  type: 'pomodoro' | 'break' | 'custom';
  createdAt: number;
}

export interface DailyStats {
  date: string;
  sessions: number;
  totalDuration: number;
  avgDuration: number;
}

export interface SessionStats {
  totalSessions: number;
  totalDuration: number;
  avgDuration: number;
  longestSession: number;
  weeklyData: DailyStats[];
}
