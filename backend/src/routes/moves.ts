import { Router } from 'express';
import { body } from 'express-validator';
import { MoveController } from '../controllers/moveController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Validation rules
const createMoveValidation = [
  body('startLocation').isObject().withMessage('Start location is required'),
  body('startLocation.address').notEmpty().withMessage('Start address is required'),
  body('startLocation.city').notEmpty().withMessage('Start city is required'),
  body('startLocation.state').notEmpty().withMessage('Start state is required'),
  body('startLocation.zipCode').notEmpty().withMessage('Start zip code is required'),
  body('startLocation.country').notEmpty().withMessage('Start country is required'),
  body('endLocation').isObject().withMessage('End location is required'),
  body('endLocation.address').notEmpty().withMessage('End address is required'),
  body('endLocation.city').notEmpty().withMessage('End city is required'),
  body('endLocation.state').notEmpty().withMessage('End state is required'),
  body('endLocation.zipCode').notEmpty().withMessage('End zip code is required'),
  body('endLocation.country').notEmpty().withMessage('End country is required'),
  body('moveDate').isISO8601().withMessage('Valid move date is required'),
  body('householdSize').optional().isInt({ min: 1 }).withMessage('Household size must be a positive integer'),
  body('inventorySizeEstimate').optional().isIn(['small', 'medium', 'large', 'extra_large']).withMessage('Invalid inventory size estimate')
];

const updateMoveValidation = [
  body('startLocation').optional().isObject().withMessage('Start location must be an object'),
  body('endLocation').optional().isObject().withMessage('End location must be an object'),
  body('moveDate').optional().isISO8601().withMessage('Valid move date is required'),
  body('householdSize').optional().isInt({ min: 1 }).withMessage('Household size must be a positive integer'),
  body('inventorySizeEstimate').optional().isIn(['small', 'medium', 'large', 'extra_large']).withMessage('Invalid inventory size estimate')
];

const updateStatusValidation = [
  body('status').isIn(['planning', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.post('/', validate(createMoveValidation), MoveController.createMove);
router.get('/', MoveController.getMoves);
router.get('/:id', MoveController.getMove);
router.put('/:id', validate(updateMoveValidation), MoveController.updateMove);
router.delete('/:id', MoveController.deleteMove);
router.patch('/:id/status', validate(updateStatusValidation), MoveController.updateMoveStatus);

export default router;
