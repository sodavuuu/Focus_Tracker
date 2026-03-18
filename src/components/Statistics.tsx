'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyStats } from '@/types';

export default function Statistics() {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/daily?days=7');
      const data = await response.json();
      const statsData = data.data || [];
      setStats(statsData);

      let total = 0;
      let duration = 0;
      statsData.forEach((stat: DailyStats) => {
        total += stat.sessions;
        duration += stat.totalDuration;
      });
      setTotalSessions(total);
      setTotalDuration(duration);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const statItems = [
    {
      label: 'Total Sessions',
      value: totalSessions,
      unit: '',
      icon: '🎯',
      color: 'from-blue-400 to-blue-600'
    },
    {
      label: 'Total Focus Time',
      value: formatDuration(totalDuration),
      unit: '',
      icon: '⏱️',
      color: 'from-purple-400 to-purple-600'
    },
    {
      label: 'Avg Duration',
      value: formatDuration(totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0),
      unit: '',
      icon: '📊',
      color: 'from-green-400 to-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {statItems.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition bg-gradient-to-br ${item.color}/5`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">{item.label}</p>
              <p className="text-3xl font-bold text-white">{item.value}</p>
            </div>
            <div className="text-4xl opacity-30">{item.icon}</div>
          </div>
        </motion.div>
      ))}

      {!loading && stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
                tickFormatter={(date: string) => new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ fill: '#60a5fa', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
