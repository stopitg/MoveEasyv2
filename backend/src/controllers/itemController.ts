import { Request, Response } from 'express';
import { ItemService } from '../services/itemService';
import { CreateItemData, UpdateItemData, ItemFilters } from '../types';

export class ItemController {
  /**
   * Create a new item
   */
  static async createItem(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const itemData: CreateItemData = req.body;
      const item = await ItemService.createItem(moveId, userId, itemData);

      res.status(201).json({
        success: true,
        data: item,
        message: 'Item created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create item'
      });
    }
  }

  /**
   * Get items for a move with optional filtering
   */
  static async getItemsByMove(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const filters: ItemFilters = {
        room_id: req.query.room_id as string,
        box_id: req.query.box_id as string,
        category: req.query.category as string,
        condition: req.query.condition as string,
        is_fragile: req.query.is_fragile === 'true' ? true : req.query.is_fragile === 'false' ? false : undefined,
        search: req.query.search as string,
        sort_by: req.query.sort_by as string,
        sort_order: req.query.sort_order as 'asc' | 'desc',
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof ItemFilters] === undefined) {
          delete filters[key as keyof ItemFilters];
        }
      });

      const items = await ItemService.getItemsByMove(moveId, userId, filters);

      res.status(200).json({
        success: true,
        data: items
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get items'
      });
    }
  }

  /**
   * Get a specific item
   */
  static async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const item = await ItemService.getItemById(itemId, userId);

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Item not found'
      });
    }
  }

  /**
   * Update an item
   */
  static async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const itemData: UpdateItemData = req.body;
      const item = await ItemService.updateItem(itemId, userId, itemData);

      res.status(200).json({
        success: true,
        data: item,
        message: 'Item updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update item'
      });
    }
  }

  /**
   * Delete an item
   */
  static async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      await ItemService.deleteItem(itemId, userId);

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete item'
      });
    }
  }

  /**
   * Move item to a box
   */
  static async moveItemToBox(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;
      const { boxId } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      if (!boxId) {
        res.status(400).json({ success: false, error: 'Box ID is required' });
        return;
      }

      const item = await ItemService.moveItemToBox(itemId, boxId, userId);

      res.status(200).json({
        success: true,
        data: item,
        message: 'Item moved to box successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to move item to box'
      });
    }
  }

  /**
   * Remove item from box
   */
  static async removeItemFromBox(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const item = await ItemService.removeItemFromBox(itemId, userId);

      res.status(200).json({
        success: true,
        data: item,
        message: 'Item removed from box successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove item from box'
      });
    }
  }

  /**
   * Get item statistics for a move
   */
  static async getItemStats(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const stats = await ItemService.getItemStats(moveId, userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get item statistics'
      });
    }
  }

  /**
   * Get items by category
   */
  static async getItemsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const categories = await ItemService.getItemsByCategory(moveId, userId);

      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get items by category'
      });
    }
  }
}
