import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Send } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SQLEditorProps {
  onExecute: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const SQLEditor: React.FC<SQLEditorProps> = ({ onExecute, onSubmit, onReset }) => {
  const { sqlCode, setSqlCode, isExecuting } = useStore();
  const editorRef = useRef<any>(null);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute();
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-dark-800 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-300">SQL Editor</span>
          <span className="text-xs text-gray-500">
            Press Ctrl+Enter to run
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="btn-secondary flex items-center gap-2 text-sm py-1.5 px-3"
            title="Reset editor"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={onExecute}
            disabled={isExecuting || !sqlCode.trim()}
            className="btn-secondary flex items-center gap-2 text-sm py-1.5 px-3"
            title="Run SQL (Ctrl+Enter)"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
          <button
            onClick={onSubmit}
            disabled={isExecuting || !sqlCode.trim()}
            className="btn-primary flex items-center gap-2 text-sm py-1.5 px-3"
            title="Submit for validation"
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={sqlCode}
          onChange={(value) => setSqlCode(value || '')}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
};

