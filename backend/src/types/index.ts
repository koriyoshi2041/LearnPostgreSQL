export interface User {
  id: string;
  username: string;
  email: string;
  created_at: Date;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  tasks: Task[];
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

export interface Progress {
  id: number;
  user_id: string;
  module_id: number;
  status: 'locked' | 'in_progress' | 'completed';
  completed_at?: Date;
  attempts: number;
}

export interface Submission {
  id: number;
  user_id: string;
  module_id: number;
  sql_code: string;
  is_correct: boolean;
  error_message?: string;
  submitted_at: Date;
}

export interface ExecutionResult {
  success: boolean;
  data?: any[];
  error?: string;
  rowCount?: number;
  executionTime?: number;
}

export interface ValidationResult {
  isCorrect: boolean;
  message: string;
  expected?: any;
  actual?: any;
}

