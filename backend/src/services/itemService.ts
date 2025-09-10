import db from '../config/database';
import { Item, CreateItemData, UpdateItemData, ItemFilters } from '../types';

export class ItemService {
  /**
   * Create a new item for a move
   */
  static async createItem(moveId: string, userId: string, itemData: CreateItemData): Promise<Item> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    // Verify room ownership if room_id is provided
    if (itemData.room_id) {
      const room = await db('rooms')
        .join('moves', 'rooms.move_id', 'moves.id')
        .where({ 'rooms.id': itemData.room_id, 'moves.user_id': userId })
        .first();
      
      if (!room) {
        throw new Error('Room not found or access denied');
      }
    }

    // Verify box ownership if box_id is provided
    if (itemData.box_id) {
      const box = await db('boxes')
        .join('moves', 'boxes.move_id', 'moves.id')
        .where({ 'boxes.id': itemData.box_id, 'moves.user_id': userId })
        .first();
      
      if (!box) {
        throw new Error('Box not found or access denied');
      }
    }

    const [item] = await db('items')
      .insert({
        move_id: moveId,
        room_id: itemData.room_id,
        box_id: itemData.box_id,
        name: itemData.name,
        description: itemData.description,
        photo_url: itemData.photo_url,
        estimated_value: itemData.estimated_value,
        properties: itemData.properties ? JSON.stringify(itemData.properties) : null,
        condition: itemData.condition,
        category: itemData.category,
        is_fragile: itemData.is_fragile || false,
        requires_special_handling: itemData.requires_special_handling || false,
      })
      .returning('*');

    // Parse properties JSON
    if (item.properties) {
      item.properties = JSON.parse(item.properties);
    }

    return item;
  }

  /**
   * Get items for a move with optional filtering
   */
  static async getItemsByMove(moveId: string, userId: string, filters: ItemFilters = {}): Promise<Item[]> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    let query = db('items')
      .leftJoin('rooms', 'items.room_id', 'rooms.id')
      .leftJoin('boxes', 'items.box_id', 'boxes.id')
      .where('items.move_id', moveId)
      .select(
        'items.*',
        'rooms.name as room_name',
        'boxes.label as box_label'
      );

    // Apply filters
    if (filters.room_id) {
      query = query.where('items.room_id', filters.room_id);
    }

    if (filters.box_id) {
      query = query.where('items.box_id', filters.box_id);
    }

    if (filters.category) {
      query = query.where('items.category', filters.category);
    }

    if (filters.condition) {
      query = query.where('items.condition', filters.condition);
    }

    if (filters.is_fragile !== undefined) {
      query = query.where('items.is_fragile', filters.is_fragile);
    }

    if (filters.search) {
      query = query.where(function() {
        this.where('items.name', 'ilike', `%${filters.search}%`)
            .orWhere('items.description', 'ilike', `%${filters.search}%`);
      });
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'name';
    const sortOrder = filters.sort_order || 'asc';
    query = query.orderBy(`items.${sortBy}`, sortOrder);

    const items = await query;

    // Parse properties JSON for each item
    return items.map(item => ({
      ...item,
      properties: item.properties ? JSON.parse(item.properties) : null
    }));
  }

  /**
   * Get a specific item
   */
  static async getItemById(itemId: string, userId: string): Promise<Item> {
    const item = await db('items')
      .join('moves', 'items.move_id', 'moves.id')
      .leftJoin('rooms', 'items.room_id', 'rooms.id')
      .leftJoin('boxes', 'items.box_id', 'boxes.id')
      .where({ 'items.id': itemId, 'moves.user_id': userId })
      .select(
        'items.*',
        'rooms.name as room_name',
        'boxes.label as box_label'
      )
      .first();

    if (!item) {
      throw new Error('Item not found or access denied');
    }

    // Parse properties JSON
    if (item.properties) {
      item.properties = JSON.parse(item.properties);
    }

    return item;
  }

  /**
   * Update an item
   */
  static async updateItem(itemId: string, userId: string, itemData: UpdateItemData): Promise<Item> {
    // Verify item ownership
    await this.getItemById(itemId, userId);

    // Verify room ownership if room_id is being updated
    if (itemData.room_id) {
      const room = await db('rooms')
        .join('moves', 'rooms.move_id', 'moves.id')
        .where({ 'rooms.id': itemData.room_id, 'moves.user_id': userId })
        .first();
      
      if (!room) {
        throw new Error('Room not found or access denied');
      }
    }

    // Verify box ownership if box_id is being updated
    if (itemData.box_id) {
      const box = await db('boxes')
        .join('moves', 'boxes.move_id', 'moves.id')
        .where({ 'boxes.id': itemData.box_id, 'moves.user_id': userId })
        .first();
      
      if (!box) {
        throw new Error('Box not found or access denied');
      }
    }

    const updateData: any = {
      ...itemData,
      updated_at: db.fn.now(),
    };

    // Stringify properties if provided
    if (itemData.properties) {
      updateData.properties = JSON.stringify(itemData.properties);
    }

    const [updatedItem] = await db('items')
      .where({ id: itemId })
      .update(updateData)
      .returning('*');

    // Parse properties JSON
    if (updatedItem.properties) {
      updatedItem.properties = JSON.parse(updatedItem.properties);
    }

    return updatedItem;
  }

  /**
   * Delete an item
   */
  static async deleteItem(itemId: string, userId: string): Promise<void> {
    // Verify item ownership
    await this.getItemById(itemId, userId);

    await db('items')
      .where({ id: itemId })
      .del();
  }

  /**
   * Move item to a box
   */
  static async moveItemToBox(itemId: string, boxId: string, userId: string): Promise<Item> {
    // Verify item ownership
    const item = await this.getItemById(itemId, userId);

    // Verify box ownership
    const box = await db('boxes')
      .join('moves', 'boxes.move_id', 'moves.id')
      .where({ 'boxes.id': boxId, 'moves.user_id': userId })
      .first();
    
    if (!box) {
      throw new Error('Box not found or access denied');
    }

    // Verify box belongs to same move
    if (box.move_id !== item.move_id) {
      throw new Error('Box and item must belong to the same move');
    }

    const [updatedItem] = await db('items')
      .where({ id: itemId })
      .update({
        box_id: boxId,
        updated_at: db.fn.now(),
      })
      .returning('*');

    // Parse properties JSON
    if (updatedItem.properties) {
      updatedItem.properties = JSON.parse(updatedItem.properties);
    }

    return updatedItem;
  }

  /**
   * Remove item from box
   */
  static async removeItemFromBox(itemId: string, userId: string): Promise<Item> {
    // Verify item ownership
    await this.getItemById(itemId, userId);

    const [updatedItem] = await db('items')
      .where({ id: itemId })
      .update({
        box_id: null,
        updated_at: db.fn.now(),
      })
      .returning('*');

    // Parse properties JSON
    if (updatedItem.properties) {
      updatedItem.properties = JSON.parse(updatedItem.properties);
    }

    return updatedItem;
  }

  /**
   * Get item statistics for a move
   */
  static async getItemStats(moveId: string, userId: string): Promise<any> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    const stats = await db('items')
      .where('move_id', moveId)
      .select(
        db.raw('COUNT(*) as total_items'),
        db.raw('COUNT(CASE WHEN box_id IS NOT NULL THEN 1 END) as packed_items'),
        db.raw('COUNT(CASE WHEN is_fragile = true THEN 1 END) as fragile_items'),
        db.raw('COUNT(CASE WHEN requires_special_handling = true THEN 1 END) as special_handling_items'),
        db.raw('COALESCE(SUM(estimated_value), 0) as total_value'),
        db.raw('COALESCE(AVG(estimated_value), 0) as average_value')
      )
      .first();

    return stats;
  }

  /**
   * Get items by category
   */
  static async getItemsByCategory(moveId: string, userId: string): Promise<any[]> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    const categories = await db('items')
      .where('move_id', moveId)
      .groupBy('category')
      .select(
        'category',
        db.raw('COUNT(*) as item_count'),
        db.raw('COALESCE(SUM(estimated_value), 0) as total_value')
      )
      .orderBy('category');

    return categories;
  }
}
