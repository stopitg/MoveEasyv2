import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';
import { CreateRoomData, UpdateRoomData } from '../types';

export class RoomController {
  /**
   * Create a new room
   */
  static async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const roomData: CreateRoomData = req.body;
      const room = await RoomService.createRoom(moveId, userId, roomData);

      res.status(201).json({
        success: true,
        data: room,
        message: 'Room created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create room'
      });
    }
  }

  /**
   * Get all rooms for a move
   */
  static async getRoomsByMove(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const rooms = await RoomService.getRoomsByMove(moveId, userId);

      res.status(200).json({
        success: true,
        data: rooms
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get rooms'
      });
    }
  }

  /**
   * Get a specific room
   */
  static async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const room = await RoomService.getRoomById(roomId, userId);

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Room not found'
      });
    }
  }

  /**
   * Update a room
   */
  static async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const roomData: UpdateRoomData = req.body;
      const room = await RoomService.updateRoom(roomId, userId, roomData);

      res.status(200).json({
        success: true,
        data: room,
        message: 'Room updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update room'
      });
    }
  }

  /**
   * Delete a room
   */
  static async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      await RoomService.deleteRoom(roomId, userId);

      res.status(200).json({
        success: true,
        message: 'Room deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete room'
      });
    }
  }

  /**
   * Get room statistics
   */
  static async getRoomStats(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const stats = await RoomService.getRoomStats(moveId, userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get room statistics'
      });
    }
  }
}
