import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { TaskController } from '../controllers/taskController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const taskController = new TaskController();

// Apply authentication to all task routes
router.use(authenticateToken);

// Validation rules
const createTaskValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Task name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Task name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be an integer between 0 and 10'),
];

const updateTaskValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Task name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be an integer between 0 and 10'),
  body('orderIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order index must be a non-negative integer'),
];

const reorderTasksValidation = [
  body('taskIds')
    .isArray({ min: 1 })
    .withMessage('taskIds must be a non-empty array'),
  body('taskIds.*')
    .isUUID()
    .withMessage('Each task ID must be a valid UUID'),
];

const bulkOperationValidation = [
  body('taskIds')
    .isArray({ min: 1 })
    .withMessage('taskIds must be a non-empty array'),
  body('taskIds.*')
    .isUUID()
    .withMessage('Each task ID must be a valid UUID'),
  body('operation')
    .isIn(['complete', 'cancel', 'delete'])
    .withMessage('Operation must be one of: complete, cancel, delete'),
];

const applyTemplatesValidation = [
  body('templateIds')
    .isArray({ min: 1 })
    .withMessage('templateIds must be a non-empty array'),
  body('templateIds.*')
    .isString()
    .withMessage('Each template ID must be a string'),
];

const moveIdValidation = [
  param('moveId')
    .isUUID()
    .withMessage('Move ID must be a valid UUID'),
];

const taskIdValidation = [
  param('taskId')
    .isUUID()
    .withMessage('Task ID must be a valid UUID'),
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
    .withMessage('Category filter must be between 1 and 50 characters'),
  query('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority filter must be an integer between 0 and 10'),
];

// Routes
router.get(
  '/:moveId/tasks',
  [...moveIdValidation, ...queryValidation, validateRequest],
  taskController.getTasks.bind(taskController)
);

router.get(
  '/:moveId/tasks/:taskId',
  [...moveIdValidation, ...taskIdValidation, validateRequest],
  taskController.getTask.bind(taskController)
);

router.post(
  '/:moveId/tasks',
  [...moveIdValidation, ...createTaskValidation, validateRequest],
  taskController.createTask.bind(taskController)
);

router.put(
  '/:moveId/tasks/:taskId',
  [...moveIdValidation, ...taskIdValidation, ...updateTaskValidation, validateRequest],
  taskController.updateTask.bind(taskController)
);

router.delete(
  '/:moveId/tasks/:taskId',
  [...moveIdValidation, ...taskIdValidation, validateRequest],
  taskController.deleteTask.bind(taskController)
);

router.put(
  '/:moveId/tasks/reorder',
  [...moveIdValidation, ...reorderTasksValidation, validateRequest],
  taskController.reorderTasks.bind(taskController)
);

router.post(
  '/:moveId/tasks/bulk',
  [...moveIdValidation, ...bulkOperationValidation, validateRequest],
  taskController.bulkTaskOperation.bind(taskController)
);

router.get(
  '/templates',
  taskController.getTaskTemplates.bind(taskController)
);

router.post(
  '/:moveId/tasks/apply-templates',
  [...moveIdValidation, ...applyTemplatesValidation, validateRequest],
  taskController.applyTaskTemplates.bind(taskController)
);

router.get(
  '/:moveId/tasks/stats',
  [...moveIdValidation, validateRequest],
  taskController.getTaskStats.bind(taskController)
);

export default router;
