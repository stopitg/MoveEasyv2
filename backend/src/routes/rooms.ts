import { Router } from 'express';
import { body, param } from 'express-validator';
import { RoomController } from '../controllers/roomController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

// Create room
router.post(
  '/moves/:moveId/rooms',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Room name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
  ],
  validate,
  RoomController.createRoom
);

// Get all rooms for a move
router.get(
  '/moves/:moveId/rooms',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
  ],
  validate,
  RoomController.getRoomsByMove
);

// Get room statistics
router.get(
  '/moves/:moveId/rooms/stats',
  [
    param('moveId').isUUID().withMessage('Invalid move ID'),
  ],
  validate,
  RoomController.getRoomStats
);

// Get specific room
router.get(
  '/rooms/:roomId',
  [
    param('roomId').isUUID().withMessage('Invalid room ID'),
  ],
  validate,
  RoomController.getRoomById
);

// Update room
router.put(
  '/rooms/:roomId',
  [
    param('roomId').isUUID().withMessage('Invalid room ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Room name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
  ],
  validate,
  RoomController.updateRoom
);

// Delete room
router.delete(
  '/rooms/:roomId',
  [
    param('roomId').isUUID().withMessage('Invalid room ID'),
  ],
  validate,
  RoomController.deleteRoom
);

export default router;
