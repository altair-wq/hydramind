import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHydrationStore } from '@/store/hydration';

const Home = () => {
  const navigate = useNavigate();
  const profile = useHydrationStore((s) => s.profile);

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Droplets className="w-7 h-7 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">HydraMind</span>
        </div>
        {profile && (
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-primary hover:text-hydra-blue-600 transition-colors"
          >
            Dashboard →
          </button>
        )}
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-hydra-blue-100 text-hydra-blue-600 text-xs font-medium mb-8">
              <Droplets className="w-3.5 h-3.5" />
              AI-Powered Hydration Intelligence
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4">
              Understand Your
              <span className="gradient-text block">Hydration</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
              A smart assistant that helps you understand why hydration matters,
              track your intake, and build lasting habits.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(profile ? '/dashboard' : '/analyzer')}
              className="gradient-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl text-base hydra-glow transition-all"
            >
              {profile ? 'Go to Dashboard' : 'Start Analysis'}
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-xs text-muted-foreground/70 italic max-w-sm mx-auto"
          >
            "Inspired by real-life observation that people ignore hydration
            despite its impact on energy and health."
          </motion.p>
        </div>
      </main>
    </div>
  );
};

export default Home;
