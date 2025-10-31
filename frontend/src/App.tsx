import React, { useEffect, useState } from 'react';
import { Trophy, Database, RefreshCw } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TaskPanel } from './components/TaskPanel';
import { SQLEditor } from './components/SQLEditor';
import { ResultPanel } from './components/ResultPanel';
import { AchievementsModal } from './components/AchievementsModal';
import { useStore } from './store/useStore';
import { api } from './api/client';
import type { Module, ExecutionResult, SubmissionResult } from './types';

function App() {
  const {
    userId,
    modules,
    currentModule,
    currentTask,
    setModules,
    setCurrentModule,
    setCurrentTask,
    completeTask,
    unlockAchievement,
    setSqlCode,
    updateProgress,
  } = useStore();

  const [result, setResult] = useState<ExecutionResult | SubmissionResult | null>(null);
  const [isSubmission, setIsSubmission] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Load modules on mount
  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const loadedModules = await api.getModules();
      setModules(loadedModules);
      
      // Auto-select first module
      if (loadedModules.length > 0) {
        await selectModule(loadedModules[0]);
      }
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const selectModule = async (module: Module) => {
    try {
      const fullModule = await api.getModule(module.id);
      setCurrentModule(fullModule);
      
      // Set first task as current
      if (fullModule.tasks && fullModule.tasks.length > 0) {
        setCurrentTask(fullModule.tasks[0]);
      }

      // Initialize progress
      updateProgress(module.id, {
        moduleId: module.id,
        status: 'in_progress',
        completedTasks: [],
        attempts: 0,
      });
    } catch (error) {
      console.error('Failed to load module:', error);
    }
  };

  const handleExecute = async () => {
    const code = useStore.getState().sqlCode;
    if (!code.trim()) return;

    setIsSubmission(false);
    try {
      const execResult = await api.executeSQL(userId, code);
      setResult(execResult);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Failed to execute SQL',
      });
    }
  };

  const handleSubmit = async () => {
    if (!currentTask) return;
    
    const code = useStore.getState().sqlCode;
    if (!code.trim()) return;

    setIsSubmission(true);
    try {
      const submitResult = await api.submitSQL(userId, currentTask.id, code);
      setResult(submitResult);

      if (submitResult.isCorrect) {
        // Mark task as complete
        completeTask(currentTask.module_id, currentTask.id);

        // Check for achievement unlocks
        checkAchievements(currentTask);

        // Show success animation
        setTimeout(() => {
          if (currentModule && currentModule.tasks) {
            const currentIndex = currentModule.tasks.findIndex(t => t.id === currentTask.id);
            if (currentIndex < currentModule.tasks.length - 1) {
              // Move to next task
              setCurrentTask(currentModule.tasks[currentIndex + 1]);
              setSqlCode('');
              setResult(null);
            }
          }
        }, 3000);
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Failed to submit SQL',
        isCorrect: false,
      });
    }
  };

  const checkAchievements = (task: any) => {
    // Check which achievements to unlock based on task
    if (task.id === 'task-2-1') {
      unlockAchievement('first-table');
    } else if (task.id === 'task-6-1') {
      unlockAchievement('relationship-architect');
    } else if (task.id.includes('json')) {
      unlockAchievement('json-wizard');
    } else if (task.id.includes('transaction')) {
      unlockAchievement('transaction-pro');
    }

    // Check if all modules completed
    const progress = useStore.getState().progress;
    if (progress.size === modules.length) {
      const allCompleted = Array.from(progress.values()).every(p => p.status === 'completed');
      if (allCompleted) {
        unlockAchievement('grand-chef');
      }
    }
  };

  const handleReset = () => {
    setSqlCode('');
    setResult(null);
  };

  const handleResetSandbox = async () => {
    if (!confirm('This will delete all your tables and data. Are you sure?')) return;

    setIsResetting(true);
    try {
      await api.resetSandbox(userId);
      setSqlCode('');
      setResult(null);
      alert('Sandbox reset successfully!');
    } catch (error) {
      alert('Failed to reset sandbox');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar onSelectModule={selectModule} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {currentModule && (
                <h1 className="text-xl font-bold text-white mb-1">
                  {currentModule.title}
                </h1>
              )}
              {currentTask && (
                <p className="text-sm text-gray-400">{currentTask.title}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetSandbox}
                disabled={isResetting}
                className="btn-secondary flex items-center gap-2 text-sm"
                title="Reset your practice database"
              >
                <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                Reset Database
              </button>
              <button
                onClick={() => setShowAchievements(true)}
                className="btn-outline flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Achievements
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Task description */}
          <div className="w-2/5 border-r border-dark-700 bg-dark-900 overflow-hidden">
            {currentTask ? (
              <TaskPanel task={currentTask} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a module to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Editor and results */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* SQL Editor */}
            <div className="h-1/2 border-b border-dark-700">
              <SQLEditor
                onExecute={handleExecute}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </div>

            {/* Results */}
            <div className="h-1/2 bg-dark-900">
              <ResultPanel result={result} isSubmission={isSubmission} />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements modal */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </div>
  );
}

export default App;

