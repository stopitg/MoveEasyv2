import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { ItemController } from '../controllers/itemController';
import { authenticateToken as auth } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

// Create item
router.post(
  '/moves/:moveId/items',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
    body('name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Item name must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('room_id')
      .optional()
      .isUUID()
      .withMessage('Invalid room ID'),
    body('box_id')
      .optional()
      .isUUID()
      .withMessage('Invalid box ID'),
    body('photo_url')
      .optional()
      .isURL()
      .withMessage('Invalid photo URL'),
    body('estimated_value')
      .optional()
      .isNumeric()
      .withMessage('Estimated value must be a number'),
    body('condition')
      .optional()
      .isIn(['new', 'good', 'fair', 'poor'])
      .withMessage('Condition must be one of: new, good, fair, poor'),
    body('category')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Category must be less than 100 characters'),
    body('is_fragile')
      .optional()
      .isBoolean()
      .withMessage('is_fragile must be a boolean'),
    body('requires_special_handling')
      .optional()
      .isBoolean()
      .withMessage('requires_special_handling must be a boolean'),
  ],
  validate,
  ItemController.createItem
);

// Get items for a move with filtering
router.get(
  '/moves/:moveId/items',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
    query('room_id')
      .optional()
      .isUUID()
      .withMessage('Invalid room ID filter'),
    query('box_id')
      .optional()
      .isUUID()
      .withMessage('Invalid box ID filter'),
    query('category')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Invalid category filter'),
    query('condition')
      .optional()
      .isIn(['new', 'good', 'fair', 'poor'])
      .withMessage('Invalid condition filter'),
    query('is_fragile')
      .optional()
      .isBoolean()
      .withMessage('Invalid is_fragile filter'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Search term must be less than 255 characters'),
    query('sort_by')
      .optional()
      .isIn(['name', 'category', 'estimated_value', 'created_at'])
      .withMessage('Invalid sort field'),
    query('sort_order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
  ],
  validate,
  ItemController.getItemsByMove
);

// Get item statistics
router.get(
  '/moves/:moveId/items/stats',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
  ],
  validate,
  ItemController.getItemStats
);

// Get items by category
router.get(
  '/moves/:moveId/items/categories',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
  ],
  validate,
  ItemController.getItemsByCategory
);

// Get specific item
router.get(
  '/items/:itemId',
  [
    param('itemId').isUUID().withMessage('Invalid item ID'),
  ],
  validate,
  ItemController.getItemById
);

// Update item
router.put(
  '/items/:itemId',
  [
    param('itemId').isUUID().withMessage('Invalid item ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Item name must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('room_id')
      .optional()
      .isUUID()
      .withMessage('Invalid room ID'),
    body('box_id')
      .optional()
      .isUUID()
      .withMessage('Invalid box ID'),
    body('photo_url')
      .optional()
      .isURL()
      .withMessage('Invalid photo URL'),
    body('estimated_value')
      .optional()
      .isNumeric()
      .withMessage('Estimated value must be a number'),
    body('condition')
      .optional()
      .isIn(['new', 'good', 'fair', 'poor'])
      .withMessage('Condition must be one of: new, good, fair, poor'),
    body('category')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Category must be less than 100 characters'),
    body('is_fragile')
      .optional()
      .isBoolean()
      .withMessage('is_fragile must be a boolean'),
    body('requires_special_handling')
      .optional()
      .isBoolean()
      .withMessage('requires_special_handling must be a boolean'),
  ],
  validate,
  ItemController.updateItem
);

// Delete item
router.delete(
  '/items/:itemId',
  [
    param('itemId').isUUID().withMessage('Invalid item ID'),
  ],
  validate,
  ItemController.deleteItem
);

// Move item to box
router.post(
  '/items/:itemId/move-to-box',
  [
    param('itemId').isUUID().withMessage('Invalid item ID'),
    body('boxId')
      .isUUID()
      .withMessage('Box ID is required and must be a valid UUID'),
  ],
  validate,
  ItemController.moveItemToBox
);

// Remove item from box
router.post(
  '/items/:itemId/remove-from-box',
  [
    param('itemId').isUUID().withMessage('Invalid item ID'),
  ],
  validate,
  ItemController.removeItemFromBox
);

export default router;
