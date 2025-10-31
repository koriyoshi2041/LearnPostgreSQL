import { Router } from 'express';
import { SandboxManager } from '../services/sandboxManager';
import { SQLExecutor } from '../services/sqlExecutor';
import { Validator } from '../services/validator';
import { getTaskById } from '../data/modules';

const router = Router();
const sandboxManager = new SandboxManager();

// Execute SQL in sandbox
router.post('/execute', async (req, res) => {
  try {
    const { userId, sql } = req.body;
    
    if (!userId || !sql) {
      return res.status(400).json({ error: 'userId and sql are required' });
    }

    const pool = await sandboxManager.getOrCreateSandbox(userId);
    const executor = new SQLExecutor(pool);
    
    const result = await executor.execute(sql);
    
    res.json(result);
  } catch (error: any) {
    console.error('Execute error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit SQL for validation
router.post('/submit', async (req, res) => {
  try {
    const { userId, taskId, sql } = req.body;
    
    if (!userId || !taskId || !sql) {
      return res.status(400).json({ error: 'userId, taskId, and sql are required' });
    }

    const task = getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const pool = await sandboxManager.getOrCreateSandbox(userId);
    const executor = new SQLExecutor(pool);
    
    // First execute the user's SQL
    const execResult = await executor.execute(sql);
    
    if (!execResult.success) {
      return res.json({
        success: false,
        error: execResult.error,
        isCorrect: false
      });
    }

    // Then validate against task requirements
    const validator = new Validator(executor);
    const validationResult = await validator.validate(task.validation, sql);
    
    res.json({
      success: true,
      ...validationResult,
      executionTime: execResult.executionTime
    });
  } catch (error: any) {
    console.error('Submit error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reset sandbox
router.post('/reset', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await sandboxManager.resetSandbox(userId);
    
    res.json({ success: true, message: 'Sandbox reset successfully' });
  } catch (error: any) {
    console.error('Reset error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get sandbox status
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const pool = await sandboxManager.getOrCreateSandbox(userId);
    const executor = new SQLExecutor(pool);
    
    // Get list of tables
    const tablesResult = await executor.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    // Get list of custom types
    const typesResult = await executor.execute(`
      SELECT typname 
      FROM pg_type 
      WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      ORDER BY typname;
    `);

    // Get list of extensions
    const extensionsResult = await executor.execute(`
      SELECT extname 
      FROM pg_extension 
      WHERE extname != 'plpgsql'
      ORDER BY extname;
    `);
    
    res.json({
      tables: tablesResult.data?.map(r => r.table_name) || [],
      types: typesResult.data?.map(r => r.typname) || [],
      extensions: extensionsResult.data?.map(r => r.extname) || []
    });
  } catch (error: any) {
    console.error('Status error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

