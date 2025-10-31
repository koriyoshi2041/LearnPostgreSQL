import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Database } from 'lucide-react';
import type { ExecutionResult, SubmissionResult } from '../types';

interface ResultPanelProps {
  result: ExecutionResult | SubmissionResult | null;
  isSubmission?: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ result, isSubmission = false }) => {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Results will appear here</p>
          <p className="text-sm mt-1">Run or submit your SQL to see the output</p>
        </div>
      </div>
    );
  }

  const submissionResult = result as SubmissionResult;

  return (
    <div className="h-full overflow-auto p-4 space-y-4">
      {/* Status header */}
      <div className="card">
        <div className="flex items-start gap-3">
          {isSubmission ? (
            submissionResult.isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            )
          ) : result.success ? (
            <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              {isSubmission
                ? submissionResult.isCorrect
                  ? '🎉 Correct!'
                  : '❌ Not quite right'
                : result.success
                ? 'Query executed successfully'
                : 'Query failed'}
            </h3>
            
            {isSubmission && submissionResult.message && (
              <p className="text-gray-300 mb-2">{submissionResult.message}</p>
            )}

            {result.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-2">
                <p className="text-red-300 text-sm font-mono whitespace-pre-wrap">
                  {result.error}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              {result.rowCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Database className="w-4 h-4" />
                  {result.rowCount} row{result.rowCount !== 1 ? 's' : ''}
                </span>
              )}
              {result.executionTime !== undefined && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {result.executionTime}ms
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data table */}
      {result.success && result.data && result.data.length > 0 && (
        <div className="card overflow-x-auto">
          <h4 className="font-semibold mb-3">Query Results</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-600">
                  {Object.keys(result.data[0]).map((key) => (
                    <th
                      key={key}
                      className="text-left py-2 px-3 font-semibold text-primary-400"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors"
                  >
                    {Object.values(row).map((value, cellIdx) => (
                      <td key={cellIdx} className="py-2 px-3 text-gray-300">
                        {value === null ? (
                          <span className="text-gray-500 italic">null</span>
                        ) : typeof value === 'object' ? (
                          <pre className="text-xs text-green-400">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          String(value)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expected vs Actual (for failed submissions) */}
      {isSubmission && !submissionResult.isCorrect && (submissionResult.expected || submissionResult.actual) && (
        <div className="card">
          <h4 className="font-semibold mb-3">Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissionResult.expected && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Expected:</p>
                <pre className="bg-dark-900 p-3 rounded text-xs text-green-400 overflow-auto">
                  {JSON.stringify(submissionResult.expected, null, 2)}
                </pre>
              </div>
            )}
            {submissionResult.actual && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Your result:</p>
                <pre className="bg-dark-900 p-3 rounded text-xs text-yellow-400 overflow-auto">
                  {JSON.stringify(submissionResult.actual, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

