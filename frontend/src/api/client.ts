import axios from 'axios';
import type { Module, Task, Hint, ExecutionResult, SubmissionResult, SandboxStatus } from '../types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Modules
  getModules: async (): Promise<Module[]> => {
    const response = await apiClient.get('/modules');
    return response.data;
  },

  getModule: async (id: number): Promise<Module> => {
    const response = await apiClient.get(`/modules/${id}`);
    return response.data;
  },

  getTask: async (moduleId: number, taskId: string): Promise<Task> => {
    const response = await apiClient.get(`/modules/${moduleId}/tasks/${taskId}`);
    return response.data;
  },

  getHint: async (moduleId: number, taskId: string, level: 1 | 2 | 3): Promise<Hint> => {
    const response = await apiClient.get(`/modules/${moduleId}/tasks/${taskId}/hints/${level}`);
    return response.data;
  },

  // Sandbox
  executeSQL: async (userId: string, sql: string): Promise<ExecutionResult> => {
    const response = await apiClient.post('/sandbox/execute', { userId, sql });
    return response.data;
  },

  submitSQL: async (userId: string, taskId: string, sql: string): Promise<SubmissionResult> => {
    const response = await apiClient.post('/sandbox/submit', { userId, taskId, sql });
    return response.data;
  },

  resetSandbox: async (userId: string): Promise<void> => {
    await apiClient.post('/sandbox/reset', { userId });
  },

  getSandboxStatus: async (userId: string): Promise<SandboxStatus> => {
    const response = await apiClient.get(`/sandbox/status/${userId}`);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

