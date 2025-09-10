import { Request, Response } from 'express';
import { MoveService } from '../services/moveService';
import { CreateMoveRequest } from '../types';

export class MoveController {
  static async createMove(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const moveData: CreateMoveRequest = req.body;
      const move = await MoveService.createMove(userId, moveData);

      return res.status(201).json({
        success: true,
        data: move,
        message: 'Move created successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create move'
      });
    }
  }

  static async getMoves(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const moves = await MoveService.getMovesByUserId(userId);

      return res.json({
        success: true,
        data: moves
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch moves'
      });
    }
  }

  static async getMove(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const { id } = req.params;
      const move = await MoveService.getMoveById(id, userId);

      if (!move) {
        return res.status(404).json({
          success: false,
          error: 'Move not found'
        });
      }

      return res.json({
        success: true,
        data: move
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch move'
      });
    }
  }

  static async updateMove(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const { id } = req.params;
      const updateData = req.body;
      const move = await MoveService.updateMove(id, userId, updateData);

      if (!move) {
        return res.status(404).json({
          success: false,
          error: 'Move not found'
        });
      }

      return res.json({
        success: true,
        data: move,
        message: 'Move updated successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update move'
      });
    }
  }

  static async deleteMove(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const { id } = req.params;
      const deleted = await MoveService.deleteMove(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Move not found'
        });
      }

      return res.json({
        success: true,
        message: 'Move deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete move'
      });
    }
  }

  static async updateMoveStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required'
        });
      }

      const move = await MoveService.updateMoveStatus(id, userId, status);

      if (!move) {
        return res.status(404).json({
          success: false,
          error: 'Move not found'
        });
      }

      return res.json({
        success: true,
        data: move,
        message: 'Move status updated successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update move status'
      });
    }
  }
}