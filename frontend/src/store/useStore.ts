import { create } from 'zustand';
import type { Module, Task, ModuleProgress, Achievement } from '../types';

interface AppState {
  // User
  userId: string;
  
  // Modules
  modules: Module[];
  currentModule: Module | null;
  currentTask: Task | null;
  
  // Progress
  progress: Map<number, ModuleProgress>;
  
  // Achievements
  achievements: Achievement[];
  
  // UI State
  isSidebarOpen: boolean;
  sqlCode: string;
  isExecuting: boolean;
  
  // Actions
  setUserId: (userId: string) => void;
  setModules: (modules: Module[]) => void;
  setCurrentModule: (module: Module | null) => void;
  setCurrentTask: (task: Task | null) => void;
  updateProgress: (moduleId: number, progress: ModuleProgress) => void;
  completeTask: (moduleId: number, taskId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  toggleSidebar: () => void;
  setSqlCode: (code: string) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  resetSandbox: () => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-table',
    title: 'First Table Master',
    description: 'Create your first database table',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'relationship-architect',
    title: 'Relationship Architect',
    description: 'Successfully create a foreign key relationship',
    icon: '🔗',
    unlocked: false,
  },
  {
    id: 'json-wizard',
    title: 'JSON Wizard',
    description: 'Complete a JSONB query challenge',
    icon: '🧙‍♂️',
    unlocked: false,
  },
  {
    id: 'transaction-pro',
    title: 'Transaction Pro',
    description: 'Successfully complete a transaction',
    icon: '💼',
    unlocked: false,
  },
  {
    id: 'performance-guru',
    title: 'Performance Guru',
    description: 'Create an index to optimize a query',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'grand-chef',
    title: 'Grand Chef',
    description: 'Complete all modules',
    icon: '👨‍🍳',
    unlocked: false,
  },
];

export const useStore = create<AppState>((set) => ({
  // Initial state
  userId: 'demo-user',
  modules: [],
  currentModule: null,
  currentTask: null,
  progress: new Map(),
  achievements: DEFAULT_ACHIEVEMENTS,
  isSidebarOpen: true,
  sqlCode: '',
  isExecuting: false,

  // Actions
  setUserId: (userId) => set({ userId }),
  
  setModules: (modules) => set({ modules }),
  
  setCurrentModule: (module) => set({ currentModule: module }),
  
  setCurrentTask: (task) => set({ currentTask: task }),
  
  updateProgress: (moduleId, progress) =>
    set((state) => {
      const newProgress = new Map(state.progress);
      newProgress.set(moduleId, progress);
      return { progress: newProgress };
    }),
  
  completeTask: (moduleId, taskId) =>
    set((state) => {
      const newProgress = new Map(state.progress);
      const moduleProgress = newProgress.get(moduleId) || {
        moduleId,
        status: 'in_progress' as const,
        completedTasks: [],
        attempts: 0,
      };
      
      if (!moduleProgress.completedTasks.includes(taskId)) {
        moduleProgress.completedTasks.push(taskId);
      }
      
      // Check if module is complete
      const module = state.modules.find((m) => m.id === moduleId);
      if (module && module.tasks && moduleProgress.completedTasks.length === module.tasks.length) {
        moduleProgress.status = 'completed';
      }
      
      newProgress.set(moduleId, moduleProgress);
      return { progress: newProgress };
    }),
  
  unlockAchievement: (achievementId) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === achievementId
          ? { ...a, unlocked: true, unlockedAt: new Date() }
          : a
      ),
    })),
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setSqlCode: (code) => set({ sqlCode: code }),
  
  setIsExecuting: (isExecuting) => set({ isExecuting }),
  
  resetSandbox: () => set({ sqlCode: '', progress: new Map() }),
}));

