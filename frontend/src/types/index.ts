export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  taskCount?: number;
  tasks?: Task[];
}

export interface Task {
  id: string;
  module_id: number;
  title: string;
  description: string;
  expected_output: string;
  hints: Hint[];
  validation: ValidationRule;
}

export interface Hint {
  level: 1 | 2 | 3;
  content: string;
}

export interface ValidationRule {
  type: 'database_exists' | 'extension_enabled' | 'table_exists' | 'query_result' | 'custom';
  params: any;
}

export interface ExecutionResult {
  success: boolean;
  data?: any[];
  error?: string;
  rowCount?: number;
  executionTime?: number;
}

export interface SubmissionResult extends ExecutionResult {
  isCorrect?: boolean;
  message?: string;
  expected?: any;
  actual?: any;
}

export interface SandboxStatus {
  tables: string[];
  types: string[];
  extensions: string[];
}

export interface ModuleProgress {
  moduleId: number;
  status: 'locked' | 'in_progress' | 'completed';
  completedTasks: string[];
  attempts: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

