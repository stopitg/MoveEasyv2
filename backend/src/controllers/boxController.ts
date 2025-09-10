import { Request, Response } from 'express';
import { BoxService } from '../services/boxService';
import { CreateBoxData, UpdateBoxData, BoxFilters } from '../types';

export class BoxController {
  /**
   * Create a new box
   */
  static async createBox(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const boxData: CreateBoxData = req.body;
      const box = await BoxService.createBox(moveId, userId, boxData);

      res.status(201).json({
        success: true,
        data: box,
        message: 'Box created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create box'
      });
    }
  }

  /**
   * Get all boxes for a move with optional filtering
   */
  static async getBoxesByMove(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const filters: BoxFilters = {
        box_type: req.query.box_type as string,
        is_packed: req.query.is_packed === 'true' ? true : req.query.is_packed === 'false' ? false : undefined,
        is_loaded: req.query.is_loaded === 'true' ? true : req.query.is_loaded === 'false' ? false : undefined,
        is_delivered: req.query.is_delivered === 'true' ? true : req.query.is_delivered === 'false' ? false : undefined,
        destination_room_id: req.query.destination_room_id as string,
        search: req.query.search as string,
        sort_by: req.query.sort_by as string,
        sort_order: req.query.sort_order as 'asc' | 'desc',
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof BoxFilters] === undefined) {
          delete filters[key as keyof BoxFilters];
        }
      });

      const boxes = await BoxService.getBoxesByMove(moveId, userId, filters);

      res.status(200).json({
        success: true,
        data: boxes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get boxes'
      });
    }
  }

  /**
   * Get a specific box
   */
  static async getBoxById(req: Request, res: Response): Promise<void> {
    try {
      const { boxId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const box = await BoxService.getBoxById(boxId, userId);

      res.status(200).json({
        success: true,
        data: box
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Box not found'
      });
    }
  }

  /**
   * Update a box
   */
  static async updateBox(req: Request, res: Response): Promise<void> {
    try {
      const { boxId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const boxData: UpdateBoxData = req.body;
      const box = await BoxService.updateBox(boxId, userId, boxData);

      res.status(200).json({
        success: true,
        data: box,
        message: 'Box updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update box'
      });
    }
  }

  /**
   * Delete a box
   */
  static async deleteBox(req: Request, res: Response): Promise<void> {
    try {
      const { boxId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      await BoxService.deleteBox(boxId, userId);

      res.status(200).json({
        success: true,
        message: 'Box deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete box'
      });
    }
  }

  /**
   * Mark box as packed
   */
  static async markBoxAsPacked(req: Request, res: Response): Promise<void> {
    try {
      const { boxId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const box = await BoxService.markBoxAsPacked(boxId, userId);

      res.status(200).json({
        success: true,
        data: box,
        message: 'Box marked as packed'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark box as packed'
      });
    }
  }

  /**
   * Mark box as loaded
   */
  static async markBoxAsLoaded(req: Request, res: Response): Promise<void> {
    try {
      const { boxId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const box = await BoxService.markBoxAsLoaded(boxId, userId);

      res.status(200).json({
        success: true,
        data: box,
        message: 'Box marked as loaded'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark box as loaded'
      });
    }
  }

  /**
   * Mark box as delivered
   */
  static async markBoxAsDelivered(req: Request, res: Response): Promise<void> {
    try {
      const { boxId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const box = await BoxService.markBoxAsDelivered(boxId, userId);

      res.status(200).json({
        success: true,
        data: box,
        message: 'Box marked as delivered'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark box as delivered'
      });
    }
  }

  /**
   * Get box contents (items in the box)
   */
  static async getBoxContents(req: Request, res: Response): Promise<void> {
    try {
      const { boxId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const contents = await BoxService.getBoxContents(boxId, userId);

      res.status(200).json({
        success: true,
        data: contents
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get box contents'
      });
    }
  }

  /**
   * Get box statistics for a move
   */
  static async getBoxStats(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const stats = await BoxService.getBoxStats(moveId, userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get box statistics'
      });
    }
  }

  /**
   * Get boxes by type
   */
  static async getBoxesByType(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const types = await BoxService.getBoxesByType(moveId, userId);

      res.status(200).json({
        success: true,
        data: types
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get boxes by type'
      });
    }
  }

  /**
   * Generate QR code for a box
   */
  static async generateQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { boxId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const qrCode = await BoxService.generateQRCode(boxId, userId);

      res.status(200).json({
        success: true,
        data: { qr_code: qrCode },
        message: 'QR code generated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate QR code'
      });
    }
  }
}
