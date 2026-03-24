import { create } from 'zustand';

export interface WaterLog {
  id: string;
  amount: number;
  timestamp: string;
}

export interface UserProfile {
  weight: number;
  activityLevel: 'low' | 'medium' | 'high';
  city: string;
  goal: 'skin' | 'energy' | 'fitness' | 'health';
  dailyTarget: number;
  aiRationale?: string;
  aiInsights?: Array<{ title: string; body: string; icon: string }>;
}

interface HydrationState {
  profile: UserProfile | null;
  currentIntake: number;
  logs: WaterLog[];
  streak: number;
  lastLogDate: string | null;
  
  setProfile: (profile: UserProfile) => void;
  addWater: (ml: number) => void;
  resetDay: () => void;
  getHydrationPercent: () => number;
  getHydrationScore: () => number;
  getHydrationStatus: () => 'dehydrated' | 'mild' | 'hydrated';
}

const today = () => new Date().toISOString().split('T')[0];

export const useHydrationStore = create<HydrationState>((set, get) => ({
  profile: JSON.parse(localStorage.getItem('hydra-profile') || 'null'),
  currentIntake: (() => {
    const saved = localStorage.getItem('hydra-intake-date');
    if (saved === today()) {
      return parseInt(localStorage.getItem('hydra-intake') || '0', 10);
    }
    return 0;
  })(),
  logs: (() => {
    const saved = localStorage.getItem('hydra-intake-date');
    if (saved === today()) {
      const arrayStr = localStorage.getItem('hydra-logs-array');
      if (arrayStr) return JSON.parse(arrayStr) as WaterLog[];
      // Backwards compatibility with the old number
      const numLogs = parseInt(localStorage.getItem('hydra-logs') || '0', 10);
      if (numLogs > 0) {
        return Array.from({ length: numLogs }).map((_, i) => ({
          id: `legacy-${i}`,
          amount: 0,
          timestamp: new Date().toISOString(),
        }));
      }
    }
    return [] as WaterLog[];
  })(),
  streak: parseInt(localStorage.getItem('hydra-streak') || '0', 10),
  lastLogDate: localStorage.getItem('hydra-last-log'),

  setProfile: (profile) => {
    localStorage.setItem('hydra-profile', JSON.stringify(profile));
    set({ profile });
  },

  addWater: (ml) => {
    const state = get();
    const newIntake = state.currentIntake + ml;
    const todayStr = today();
    
    let newStreak = state.streak;
    let newLogs = [...state.logs];
    
    if (state.lastLogDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      newStreak = state.lastLogDate === yesterdayStr ? state.streak + 1 : 1;
      newLogs = [];
    }
    
    newLogs.push({
      id: Date.now().toString(),
      amount: ml,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem('hydra-intake', String(newIntake));
    localStorage.setItem('hydra-logs-array', JSON.stringify(newLogs));
    localStorage.setItem('hydra-intake-date', todayStr);
    localStorage.setItem('hydra-streak', String(newStreak));
    localStorage.setItem('hydra-last-log', todayStr);

    set({ currentIntake: newIntake, streak: newStreak, lastLogDate: todayStr, logs: newLogs });
  },

  resetDay: () => {
    localStorage.setItem('hydra-intake', '0');
    localStorage.setItem('hydra-logs-array', '[]');
    localStorage.setItem('hydra-intake-date', today());
    set({ currentIntake: 0, logs: [] });
  },

  getHydrationPercent: () => {
    const { profile, currentIntake } = get();
    if (!profile) return 0;
    return Math.min(Math.round((currentIntake / profile.dailyTarget) * 100), 100);
  },

  getHydrationScore: () => {
    const { profile, currentIntake } = get();
    if (!profile) return 0;
    const ratio = currentIntake / profile.dailyTarget;
    if (ratio >= 1) return 100;
    if (ratio >= 0.8) return 80 + (ratio - 0.8) * 100;
    return Math.round(ratio * 80);
  },

  getHydrationStatus: () => {
    const percent = get().getHydrationPercent();
    if (percent >= 70) return 'hydrated';
    if (percent >= 40) return 'mild';
    return 'dehydrated';
  },
}));

export function calculateDailyTarget(weight: number, activity: string, city: string): number {
  let base = weight * 33; // ml per kg base
  if (activity === 'medium') base *= 1.2;
  if (activity === 'high') base *= 1.5;
  // A moderate backup modifier if API is unavailable
  base *= 1.1;
  return Math.round(base / 100) * 100; // round to nearest 100ml
}
