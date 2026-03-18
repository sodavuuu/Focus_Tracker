'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Session } from '@/types';

export default function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions/list?days=7&completed=true');
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0m';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">Recent Sessions</h2>

      {loading ? (
        <p className="text-slate-400">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No sessions yet. Start focusing!</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/5"
            >
              <div className="flex-1">
                <p className="font-medium text-white">{session.name}</p>
                <p className="text-sm text-slate-400">
                  {formatDate(session.createdAt)} at {formatTime(session.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-400">{formatDuration(session.duration)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
