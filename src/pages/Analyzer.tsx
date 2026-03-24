import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, ArrowLeft, Activity, Thermometer, Target, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHydrationStore, calculateDailyTarget, type UserProfile } from '@/store/hydration';
import { analyzeHydrationProfile } from '@/lib/gemini';

const Analyzer = () => {
  const navigate = useNavigate();
  const setProfile = useHydrationStore((s) => s.setProfile);
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [result, setResult] = useState<UserProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [climate, setClimate] = useState<'cold' | 'moderate' | 'hot'>('moderate');
  const [goal, setGoal] = useState<'skin' | 'energy' | 'fitness' | 'health'>('health');

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      const { dailyTarget, rationale, insights } = await analyzeHydrationProfile({
        weight,
        activityLevel: activity,
        climate,
        goal,
      });
      const profile: UserProfile = { 
        weight, 
        activityLevel: activity, 
        climate, 
        goal, 
        dailyTarget,
        aiRationale: rationale,
        aiInsights: insights
      };
      setResult(profile);
      setStep('result');
    } catch (e) {
      console.error(e);
      // Fallback if no API key or error
      const target = calculateDailyTarget(weight, activity, climate);
      const profile: UserProfile = { 
        weight, 
        activityLevel: activity, 
        climate, 
        goal, 
        dailyTarget: target,
        aiRationale: 'Standard calculation used. Add your Gemini API key for personalized insights.'
      };
      setResult(profile);
      setStep('result');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (result) {
      setProfile(result);
      navigate('/dashboard');
    }
  };

  const optionBtn = (selected: boolean) =>
    `px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      selected
        ? 'gradient-primary text-primary-foreground hydra-glow'
        : 'bg-secondary text-secondary-foreground hover:bg-hydra-blue-100'
    }`;

  return (
    <div className="min-h-screen gradient-hero">
      <nav className="flex items-center gap-3 px-6 py-4 max-w-2xl mx-auto">
        <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Droplets className="w-6 h-6 text-primary" />
        <span className="font-display font-bold text-foreground">Hydration Analyzer</span>
      </nav>

      <main className="px-6 pb-12 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Weight */}
              <div className="glass-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Target className="w-4 h-4 text-primary" /> Weight (kg)
                </label>
                <input
                  type="range"
                  min={40}
                  max={150}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="text-center text-2xl font-bold text-foreground mt-2">{weight} kg</div>
              </div>

              {/* Activity */}
              <div className="glass-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Activity className="w-4 h-4 text-primary" /> Activity Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((l) => (
                    <button key={l} onClick={() => setActivity(l)} className={optionBtn(activity === l)}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Climate */}
              <div className="glass-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Thermometer className="w-4 h-4 text-primary" /> Climate
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['cold', 'moderate', 'hot'] as const).map((c) => (
                    <button key={c} onClick={() => setClimate(c)} className={optionBtn(climate === c)}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="glass-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Droplets className="w-4 h-4 text-primary" /> Primary Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['skin', 'energy', 'fitness', 'health'] as const).map((g) => (
                    <button key={g} onClick={() => setGoal(g)} className={optionBtn(goal === g)}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl hydra-glow disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  'Analyze My Hydration'
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-elevated p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5">
                <Droplets className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">Your Daily Target</h2>
              <div className="text-5xl font-bold gradient-text mb-1">{result?.dailyTarget}</div>
              <p className="text-muted-foreground text-sm mb-6">milliliters per day</p>

              {result?.aiRationale && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-foreground/90 italic">"{result.aiRationale}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-semibold text-foreground">{result?.weight} kg</p>
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Activity</p>
                  <p className="font-semibold text-foreground capitalize">{result?.activityLevel}</p>
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Climate</p>
                  <p className="font-semibold text-foreground capitalize">{result?.climate}</p>
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Goal</p>
                  <p className="font-semibold text-foreground capitalize">{result?.goal}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl hydra-glow"
              >
                Start Tracking →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Analyzer;
