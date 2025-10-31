import React from 'react';
import { ChefHat, Trophy, Menu, X, CheckCircle, Circle, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Module } from '../types';

interface SidebarProps {
  onSelectModule: (module: Module) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectModule }) => {
  const { modules, currentModule, progress, isSidebarOpen, toggleSidebar, achievements } = useStore();

  const getModuleStatus = (moduleId: number) => {
    const moduleProgress = progress.get(moduleId);
    if (!moduleProgress) return 'locked';
    return moduleProgress.status;
  };

  const getModuleIcon = (moduleId: number) => {
    const status = getModuleStatus(moduleId);
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'in_progress') return <Circle className="w-5 h-5 text-yellow-400" />;
    return <Lock className="w-5 h-5 text-gray-500" />;
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 btn-secondary"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-dark-800 border-r border-dark-700 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center gap-3 mb-4">
              <ChefHat className="w-8 h-8 text-primary-500" />
              <div>
                <h1 className="text-xl font-bold text-white">Golden Whisk Pro</h1>
                <p className="text-xs text-gray-400">Learn PostgreSQL by Cooking</p>
              </div>
            </div>
            
            {/* Progress summary */}
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-primary-500" />
              <span className="text-gray-300">
                {unlockedCount}/{achievements.length} Achievements
              </span>
            </div>
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Learning Modules
            </h2>
            <div className="space-y-2">
              {modules.map((module) => {
                const status = getModuleStatus(module.id);
                const isActive = currentModule?.id === module.id;
                const isLocked = status === 'locked' && module.id > 1;

                return (
                  <button
                    key={module.id}
                    onClick={() => !isLocked && onSelectModule(module)}
                    disabled={isLocked}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-lg'
                        : isLocked
                        ? 'bg-dark-900/50 text-gray-600 cursor-not-allowed'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getModuleIcon(module.id)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold">Module {module.id}</span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1 truncate">
                          {module.title}
                        </h3>
                        <p className="text-xs opacity-80 line-clamp-2">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-dark-700">
            <div className="text-xs text-gray-500 text-center">
              Made with ❤️ for PostgreSQL learners
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

