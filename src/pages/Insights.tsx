import { motion } from 'framer-motion';
import { Droplets, ArrowLeft, Brain, Heart, Zap, Sparkles, Leaf, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHydrationStore } from '@/store/hydration';

const insights = [
  {
    icon: Heart,
    title: 'Circulation Efficiency',
    body: 'Hydration supports blood volume and circulation, helping nutrients reach cells more effectively.',
    color: 'text-hydra-danger',
    bg: 'bg-hydra-danger/10',
  },
  {
    icon: Brain,
    title: 'Cognitive Performance',
    body: 'Mild dehydration (1–2%) may reduce focus, working memory, and increase perceived effort during tasks.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Sparkles,
    title: 'Skin Health',
    body: 'Water supports skin elasticity and barrier function. Consistent hydration may improve skin appearance over time.',
    color: 'text-hydra-cyan',
    bg: 'bg-hydra-cyan/10',
  },
  {
    icon: Zap,
    title: 'Energy & Fatigue',
    body: 'Dehydration can trigger fatigue, headaches, and reduced physical performance even before thirst signals appear.',
    color: 'text-hydra-warning',
    bg: 'bg-hydra-warning/10',
  },
  {
    icon: Leaf,
    title: 'Metabolism Support',
    body: 'Water is involved in metabolic processes. Some studies suggest adequate hydration supports calorie expenditure.',
    color: 'text-hydra-teal',
    bg: 'bg-hydra-teal/10',
  },
  {
    icon: Shield,
    title: 'Kidney Function',
    body: 'Proper fluid intake helps kidneys filter waste efficiently, reducing the risk of kidney stone formation.',
    color: 'text-hydra-blue-500',
    bg: 'bg-hydra-blue-100',
  },
];

const iconMap: Record<string, React.ElementType> = { Heart, Brain, Sparkles, Zap, Leaf, Shield };

const Insights = () => {
  const navigate = useNavigate();
  const profile = useHydrationStore((s) => s.profile);
  
  // Use AI insights if available, otherwise fallback to static
  const displayInsights = profile?.aiInsights?.length 
    ? profile.aiInsights.map((ai, i) => {
        const IconComponent = iconMap[ai.icon] || Droplets;
        const colorPairs = [
          { color: 'text-primary', bg: 'bg-primary/10' },
          { color: 'text-hydra-cyan', bg: 'bg-hydra-cyan/10' },
          { color: 'text-hydra-warning', bg: 'bg-hydra-warning/10' },
          { color: 'text-hydra-success', bg: 'bg-hydra-success/10' },
          { color: 'text-hydra-danger', bg: 'bg-hydra-danger/10' },
          { color: 'text-hydra-blue-500', bg: 'bg-hydra-blue-100' }
        ];
        const { color, bg } = colorPairs[i % colorPairs.length];
        return {
          icon: IconComponent,
          title: ai.title,
          body: ai.body,
          color,
          bg,
        };
      })
    : insights;

  return (
    <div className="min-h-screen gradient-hero pb-12">
      <nav className="flex items-center gap-3 px-6 py-4 max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Droplets className="w-6 h-6 text-primary" />
        <span className="font-display font-bold text-foreground">Bio Insights</span>
      </nav>

      <main className="px-6 max-w-lg mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-6 text-center"
        >
          Science-backed insights on how hydration affects your body.
        </motion.p>

        <div className="space-y-3">
          {displayInsights.map((item, i) => (
            <motion.div
              key={item.title + i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${item.bg} shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Insights;
