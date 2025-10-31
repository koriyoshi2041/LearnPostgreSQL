import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Task, Hint } from '../types';
import { api } from '../api/client';

interface TaskPanelProps {
  task: Task;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({ task }) => {
  const [showHints, setShowHints] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<Map<number, Hint>>(new Map());
  const [loadingHint, setLoadingHint] = useState<number | null>(null);

  const unlockHint = async (level: 1 | 2 | 3) => {
    if (unlockedHints.has(level)) return;

    setLoadingHint(level);
    try {
      const hint = await api.getHint(task.module_id, task.id, level);
      setUnlockedHints(new Map(unlockedHints).set(level, hint));
    } catch (error) {
      console.error('Failed to load hint:', error);
    } finally {
      setLoadingHint(null);
    }
  };

  const getHintButtonLabel = (level: 1 | 2 | 3) => {
    if (level === 1) return '💡 Hint: Concept';
    if (level === 2) return '💡💡 Hint: Example';
    return '💯 Full Answer';
  };

  const getHintButtonColor = (level: 1 | 2 | 3) => {
    if (level === 1) return 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30';
    if (level === 2) return 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border-yellow-500/30';
    return 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30';
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Task header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Module {task.module_id}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{task.title}</h2>
        </div>

        {/* Task description */}
        <div className="card prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code: ({ node, inline, ...props }) => (
                inline ? (
                  <code className="bg-primary-500/20 text-primary-300 px-1.5 py-0.5 rounded text-sm" {...props} />
                ) : (
                  <code className="block bg-dark-900 p-3 rounded text-sm overflow-x-auto" {...props} />
                )
              ),
              p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-3" {...props} />,
              strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 space-y-1 mb-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 space-y-1 mb-3" {...props} />,
            }}
          >
            {task.description}
          </ReactMarkdown>
        </div>

        {/* Hints section */}
        <div className="card">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-white">Need Help?</span>
            </div>
            {showHints ? (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            )}
          </button>

          {showHints && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-400">
                Stuck? Use hints to guide you. Each level reveals more information.
              </p>

              {[1, 2, 3].map((level) => {
                const hint = unlockedHints.get(level as 1 | 2 | 3);
                const isLoading = loadingHint === level;

                return (
                  <div key={level} className="space-y-2">
                    <button
                      onClick={() => unlockHint(level as 1 | 2 | 3)}
                      disabled={isLoading || hint !== undefined}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        hint
                          ? 'bg-dark-700 border-dark-600 cursor-default'
                          : getHintButtonColor(level as 1 | 2 | 3)
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {getHintButtonLabel(level as 1 | 2 | 3)}
                        </span>
                        {isLoading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        )}
                      </div>
                    </button>

                    {hint && (
                      <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-600 animate-slide-in">
                        <ReactMarkdown
                          components={{
                            code: ({ node, inline, ...props }) => (
                              inline ? (
                                <code className="bg-primary-500/20 text-primary-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                              ) : (
                                <code className="block bg-dark-800 p-3 rounded text-sm overflow-x-auto font-mono text-green-400" {...props} />
                              )
                            ),
                            p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-2 last:mb-0" {...props} />,
                          }}
                        >
                          {hint.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expected output */}
        {task.expected_output && (
          <div className="card">
            <h3 className="font-semibold text-white mb-2">Expected Outcome</h3>
            <p className="text-gray-400 text-sm">{task.expected_output}</p>
          </div>
        )}
      </div>
    </div>
  );
};

