'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';
import SessionHistory from './SessionHistory';
import Statistics from './Statistics';
import SpotifyPlayer from './SpotifyPlayer';

export default function FocusTracker() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionName, setSessionName] = useState('Focus Session');

  const startSession = async () => {
    try {
      const response = await fetch('/api/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sessionName,
          type: 'pomodoro'
        })
      });
      
      const data = await response.json();
      setSessionId(data.sessionId);
      setIsRunning(true);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async (completed: boolean = true) => {
    try {
      if (sessionId) {
        await fetch('/api/sessions/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            completed
          })
        });
      }
      
      setIsRunning(false);
      setSessionId(null);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        if (newTime >= totalDuration) {
          setIsRunning(false);
          endSession(true);
          return totalDuration;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, totalDuration]);

  const remainingTime = totalDuration - elapsedTime;
  const progress = (elapsedTime / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Focus Tracker
          </h1>
          <p className="text-slate-400">Master your focus, track your progress</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              {!isRunning && (
                <motion.input
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="text"
                  placeholder="Session name..."
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full mb-6 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition"
                />
              )}

              <CountdownTimer 
                remainingTime={remainingTime} 
                progress={progress}
              />

              {!isRunning && (
                <div className="mt-8 flex gap-3 justify-center flex-wrap">
                  {[15, 25, 45, 90].map((minutes) => (
                    <motion.button
                      key={minutes}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTotalDuration(minutes * 60)}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        totalDuration === minutes * 60
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {minutes}m
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="mt-8 flex gap-4 justify-center flex-wrap">
                {!isRunning ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startSession}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition"
                  >
                    Start Focus
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsRunning(false)}
                      className="px-8 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg font-semibold text-yellow-300 hover:bg-yellow-500/30 transition"
                    >
                      Pause
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => endSession(true)}
                      className="px-8 py-3 bg-green-500/20 border border-green-500/50 rounded-lg font-semibold text-green-300 hover:bg-green-500/30 transition"
                    >
                      Complete
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => endSession(false)}
                      className="px-8 py-3 bg-red-500/20 border border-red-500/50 rounded-lg font-semibold text-red-300 hover:bg-red-500/30 transition"
                    >
                      Cancel
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Statistics />
            <SpotifyPlayer />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <SessionHistory />
        </motion.div>
      </div>
    </div>
  );
}
