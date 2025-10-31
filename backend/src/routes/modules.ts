import { Router } from 'express';
import { modules, getModuleById, getTaskById } from '../data/modules';

const router = Router();

// Get all modules
router.get('/', (req, res) => {
  const simplifiedModules = modules.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    order: m.order,
    taskCount: m.tasks.length
  }));
  
  res.json(simplifiedModules);
});

// Get a specific module with all tasks
router.get('/:id', (req, res) => {
  const moduleId = parseInt(req.params.id);
  const module = getModuleById(moduleId);
  
  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }
  
  res.json(module);
});

// Get a specific task
router.get('/:moduleId/tasks/:taskId', (req, res) => {
  const task = getTaskById(req.params.taskId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

// Get hint for a task
router.get('/:moduleId/tasks/:taskId/hints/:level', (req, res) => {
  const task = getTaskById(req.params.taskId);
  const level = parseInt(req.params.level) as 1 | 2 | 3;
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const hint = task.hints.find(h => h.level === level);
  
  if (!hint) {
    return res.status(404).json({ error: 'Hint not found' });
  }
  
  res.json(hint);
});

export default router;

