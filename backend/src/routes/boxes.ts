import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { BoxController } from '../controllers/boxController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

// Create box
router.post(
  '/moves/:moveId/boxes',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
    body('label')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Box label must be between 1 and 100 characters'),
    body('destination_room_id')
      .optional()
      .isUUID()
      .withMessage('Invalid destination room ID'),
    body('box_type')
      .optional()
      .isIn(['standard', 'fragile', 'heavy', 'clothing', 'books', 'kitchen', 'bathroom', 'other'])
      .withMessage('Invalid box type'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters'),
  ],
  validate,
  BoxController.createBox
);

// Get boxes for a move with filtering
router.get(
  '/moves/:moveId/boxes',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
    query('box_type')
      .optional()
      .isIn(['standard', 'fragile', 'heavy', 'clothing', 'books', 'kitchen', 'bathroom', 'other'])
      .withMessage('Invalid box type filter'),
    query('is_packed')
      .optional()
      .isBoolean()
      .withMessage('Invalid is_packed filter'),
    query('is_loaded')
      .optional()
      .isBoolean()
      .withMessage('Invalid is_loaded filter'),
    query('is_delivered')
      .optional()
      .isBoolean()
      .withMessage('Invalid is_delivered filter'),
    query('destination_room_id')
      .optional()
      .isUUID()
      .withMessage('Invalid destination room ID filter'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Search term must be less than 255 characters'),
    query('sort_by')
      .optional()
      .isIn(['label', 'box_type', 'created_at', 'packed_at', 'loaded_at', 'delivered_at'])
      .withMessage('Invalid sort field'),
    query('sort_order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
  ],
  validate,
  BoxController.getBoxesByMove
);

// Get box statistics
router.get(
  '/moves/:moveId/boxes/stats',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
  ],
  validate,
  BoxController.getBoxStats
);

// Get boxes by type
router.get(
  '/moves/:moveId/boxes/types',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
  ],
  validate,
  BoxController.getBoxesByType
);

// Get specific box
router.get(
  '/boxes/:boxId',
  [
    param('boxId').isUUID().withMessage('Invalid box ID'),
  ],
  validate,
  BoxController.getBoxById
);

// Update box
router.put(
  '/boxes/:boxId',
  [
    param('boxId').isUUID().withMessage('Invalid box ID'),
    body('label')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Box label must be between 1 and 100 characters'),
    body('destination_room_id')
      .optional()
      .isUUID()
      .withMessage('Invalid destination room ID'),
    body('box_type')
      .optional()
      .isIn(['standard', 'fragile', 'heavy', 'clothing', 'books', 'kitchen', 'bathroom', 'other'])
      .withMessage('Invalid box type'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters'),
    body('is_packed')
      .optional()
      .isBoolean()
      .withMessage('is_packed must be a boolean'),
    body('is_loaded')
      .optional()
      .isBoolean()
      .withMessage('is_loaded must be a boolean'),
    body('is_delivered')
      .optional()
      .isBoolean()
      .withMessage('is_delivered must be a boolean'),
  ],
  validate,
  BoxController.updateBox
);

// Delete box
router.delete(
  '/boxes/:boxId',
  [
    param('boxId').isUUID().withMessage('Invalid box ID'),
  ],
  validate,
  BoxController.deleteBox
);

// Mark box as packed
router.post(
  '/boxes/:boxId/pack',
  [
    param('boxId').isUUID().withMessage('Invalid box ID'),
  ],
  validate,
  BoxController.markBoxAsPacked
);

// Mark box as loaded
router.post(
  '/boxes/:boxId/load',
  [
    param('boxId').isUUID().withMessage('Invalid box ID'),
  ],
  validate,
  BoxController.markBoxAsLoaded
);

// Mark box as delivered
router.post(
  '/boxes/:boxId/deliver',
  [
    param('boxId').isUUID().withMessage('Invalid box ID'),
  ],
  validate,
  BoxController.markBoxAsDelivered
);

// Get box contents
router.get(
  '/boxes/:boxId/contents',
  [
    param('boxId').isUUID().withMessage('Invalid box ID'),
  ],
  validate,
  BoxController.getBoxContents
);

// Generate QR code
router.post(
  '/boxes/:boxId/qr-code',
  [
    param('boxId').isUUID().withMessage('Invalid box ID'),
  ],
  validate,
  BoxController.generateQRCode
);

export default router;
