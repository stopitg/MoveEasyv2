import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { TaskController } from '../controllers/taskController';
import { TaskService } from '../services/taskService';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import db from '../config/database';

const router = Router();
const taskService = new TaskService(db);
const taskController = new TaskController(taskService);

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Validation rules
const createTaskValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Task name is required and must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required and must be less than 50 characters'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be an integer between 0 and 10')
];

const updateTaskValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Task name must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be an integer between 0 and 10'),
  body('orderIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order index must be a non-negative integer')
];

const reorderTasksValidation = [
  body('taskIds')
    .isArray({ min: 1 })
    .withMessage('Task IDs must be an array with at least one item'),
  body('taskIds.*')
    .isUUID()
    .withMessage('Each task ID must be a valid UUID')
];

const bulkTaskOperationValidation = [
  body('taskIds')
    .isArray({ min: 1 })
    .withMessage('Task IDs must be an array with at least one item'),
  body('taskIds.*')
    .isUUID()
    .withMessage('Each task ID must be a valid UUID'),
  body('operation')
    .isIn(['complete', 'cancel', 'delete'])
    .withMessage('Operation must be one of: complete, cancel, delete')
];

const applyTemplatesValidation = [
  body('templateIds')
    .isArray({ min: 1 })
    .withMessage('Template IDs must be an array with at least one item'),
  body('templateIds.*')
    .isString()
    .withMessage('Each template ID must be a string')
];

const moveIdValidation = [
  param('moveId')
    .isUUID()
    .withMessage('Move ID must be a valid UUID')
];

const taskIdValidation = [
  param('taskId')
    .isUUID()
    .withMessage('Task ID must be a valid UUID')
];

const queryValidation = [
  query('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status filter must be one of: pending, in_progress, completed, cancelled'),
  query('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category filter must be less than 50 characters'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be less than 100 characters')
];

// Routes
router.post(
  '/:moveId/tasks',
  moveIdValidation,
  createTaskValidation,
  validate,
  taskController.createTask.bind(taskController)
);

router.get(
  '/:moveId/tasks',
  moveIdValidation,
  queryValidation,
  validate,
  taskController.getTasks.bind(taskController)
);

router.get(
  '/tasks/:taskId',
  taskIdValidation,
  validate,
  taskController.getTask.bind(taskController)
);

router.put(
  '/tasks/:taskId',
  taskIdValidation,
  updateTaskValidation,
  validate,
  taskController.updateTask.bind(taskController)
);

router.delete(
  '/tasks/:taskId',
  taskIdValidation,
  validate,
  taskController.deleteTask.bind(taskController)
);

router.put(
  '/:moveId/tasks/reorder',
  moveIdValidation,
  reorderTasksValidation,
  validate,
  taskController.reorderTasks.bind(taskController)
);

router.post(
  '/:moveId/tasks/bulk',
  moveIdValidation,
  bulkTaskOperationValidation,
  validate,
  taskController.bulkTaskOperation.bind(taskController)
);

router.get(
  '/templates',
  taskController.getTaskTemplates.bind(taskController)
);

router.post(
  '/:moveId/tasks/templates',
  moveIdValidation,
  applyTemplatesValidation,
  validate,
  taskController.applyTaskTemplates.bind(taskController)
);

router.get(
  '/:moveId/tasks/stats',
  moveIdValidation,
  validate,
  taskController.getTaskStats.bind(taskController)
);

export default router;