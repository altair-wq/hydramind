import { motion } from 'framer-motion';
import { Droplets, Flame, Zap, Plus, Bell, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHydrationStore } from '@/store/hydration';
import { useEffect } from 'react';

const statusConfig = {
  hydrated: { label: 'Hydrated', color: 'text-hydra-success', bg: 'bg-hydra-success/10' },
  mild: { label: 'Mild Dehydration', color: 'text-hydra-warning', bg: 'bg-hydra-warning/10' },
  dehydrated: { label: 'Dehydrated', color: 'text-hydra-danger', bg: 'bg-hydra-danger/10' },
};

const feedbackMessages = [
  'Hydration improved',
  'Energy support increased',
  'Focus levels sustained',
  'Circulation efficiency boosted',
];

const reminders = [
  { time: 'Morning', message: 'Your body likely needs hydration after sleep', icon: '☀️' },
  { time: 'After Meal', message: 'Water aids digestion — hydrate now', icon: '🍽️' },
  { time: 'Post Activity', message: 'Replenish fluids after movement', icon: '🏃' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, currentIntake, streak, logs, addWater, getHydrationPercent, getHydrationScore, getHydrationStatus } =
    useHydrationStore();

  useEffect(() => {
    if (!profile) navigate('/analyzer');
  }, [profile, navigate]);

  if (!profile) return null;

  const percent = getHydrationPercent();
  const score = getHydrationScore();
  const status = getHydrationStatus();
  const cfg = statusConfig[status];

  const progressColor =
    percent >= 70 ? 'bg-hydra-success' : percent >= 40 ? 'bg-hydra-warning' : 'bg-hydra-danger';

  return (
    <div className="min-h-screen gradient-hero pb-8">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Droplets className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-foreground">Dashboard</span>
        </div>
        <button
          onClick={() => navigate('/insights')}
          className="text-sm font-medium text-primary hover:text-hydra-blue-600 transition-colors"
        >
          Insights →
        </button>
      </nav>

      <main className="px-6 max-w-lg mx-auto space-y-4">
        {/* Status badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${cfg.bg} ${cfg.color}`}>
            <Droplets className="w-3.5 h-3.5" />
            {cfg.label}
          </div>
        </motion.div>

        {/* Main progress card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-elevated p-6 text-center"
        >
          <div className="text-5xl font-bold text-foreground mb-1">{currentIntake}<span className="text-lg text-muted-foreground font-normal"> ml</span></div>
          <p className="text-sm text-muted-foreground mb-4">of {profile.dailyTarget} ml target</p>

          {/* Progress bar */}
          <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${progressColor}`}
            />
          </div>
          <p className="text-sm font-semibold text-foreground">{percent}% completed</p>
        </motion.div>

        {/* Score + Streak + Logs row */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 text-center">
            <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{score}</div>
            <p className="text-xs text-muted-foreground">Score</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 text-center">
            <Droplets className="w-5 h-5 text-hydra-cyan mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{logs.length}</div>
            <p className="text-xs text-muted-foreground">Drinks</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 text-center">
            <Flame className="w-5 h-5 text-hydra-warning mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{streak}</div>
            <p className="text-xs text-muted-foreground">Streak</p>
          </motion.div>
        </div>

        {/* Quick add */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Quick Add
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[100, 200, 300].map((ml) => (
              <motion.button
                key={ml}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addWater(ml)}
                className="bg-secondary hover:bg-hydra-blue-100 text-secondary-foreground font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                +{ml}ml
              </motion.button>
            ))}
          </div>
          {currentIntake > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-hydra-success mt-3 text-center font-medium"
            >
              ✓ {feedbackMessages[Math.min(Math.floor(percent / 25), feedbackMessages.length - 1)]}
            </motion.p>
          )}
        </motion.div>

        {/* Today's Logs */}
        {logs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 px-1">
              <Droplets className="w-4 h-4 text-primary" /> Today's Logs
            </p>
            <div className="space-y-2">
              {[...logs].reverse().map((log) => (
                <div key={log.id} className="glass-card px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">+{log.amount} ml</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reminders */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 px-1">
            <Bell className="w-4 h-4 text-primary" /> Smart Reminders
          </p>
          <div className="space-y-2">
            {reminders.map((r) => (
              <div key={r.time} className="glass-card px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{r.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">{r.time}</p>
                  <p className="text-xs text-muted-foreground">{r.message}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recalculate */}
        <button
          onClick={() => navigate('/analyzer')}
          className="w-full text-xs text-muted-foreground hover:text-primary transition-colors py-2 flex items-center justify-center gap-1"
        >
          <TrendingUp className="w-3 h-3" /> Recalculate target
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
