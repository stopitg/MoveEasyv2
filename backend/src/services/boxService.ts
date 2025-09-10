import db from '../config/database';
import { Box, CreateBoxData, UpdateBoxData, BoxFilters } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class BoxService {
  /**
   * Create a new box for a move
   */
  static async createBox(moveId: string, userId: string, boxData: CreateBoxData): Promise<Box> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    // Verify destination room ownership if provided
    if (boxData.destination_room_id) {
      const room = await db('rooms')
        .join('moves', 'rooms.move_id', 'moves.id')
        .where({ 'rooms.id': boxData.destination_room_id, 'moves.user_id': userId })
        .first();
      
      if (!room) {
        throw new Error('Destination room not found or access denied');
      }
    }

    // Generate QR code
    const qrCode = `BOX-${uuidv4()}`;

    const [box] = await db('boxes')
      .insert({
        move_id: moveId,
        label: boxData.label,
        qr_code: qrCode,
        destination_room_id: boxData.destination_room_id,
        box_type: boxData.box_type || 'standard',
        notes: boxData.notes,
      })
      .returning('*');

    return box;
  }

  /**
   * Get all boxes for a move with optional filtering
   */
  static async getBoxesByMove(moveId: string, userId: string, filters: BoxFilters = {}): Promise<Box[]> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    let query = db('boxes')
      .leftJoin('rooms', 'boxes.destination_room_id', 'rooms.id')
      .where('boxes.move_id', moveId)
      .select(
        'boxes.*',
        'rooms.name as destination_room_name'
      );

    // Apply filters
    if (filters.box_type) {
      query = query.where('boxes.box_type', filters.box_type);
    }

    if (filters.is_packed !== undefined) {
      query = query.where('boxes.is_packed', filters.is_packed);
    }

    if (filters.is_loaded !== undefined) {
      query = query.where('boxes.is_loaded', filters.is_loaded);
    }

    if (filters.is_delivered !== undefined) {
      query = query.where('boxes.is_delivered', filters.is_delivered);
    }

    if (filters.destination_room_id) {
      query = query.where('boxes.destination_room_id', filters.destination_room_id);
    }

    if (filters.search) {
      query = query.where(function() {
        this.where('boxes.label', 'ilike', `%${filters.search}%`)
            .orWhere('boxes.notes', 'ilike', `%${filters.search}%`);
      });
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'label';
    const sortOrder = filters.sort_order || 'asc';
    query = query.orderBy(`boxes.${sortBy}`, sortOrder);

    return await query;
  }

  /**
   * Get a specific box
   */
  static async getBoxById(boxId: string, userId: string): Promise<Box> {
    const box = await db('boxes')
      .join('moves', 'boxes.move_id', 'moves.id')
      .leftJoin('rooms', 'boxes.destination_room_id', 'rooms.id')
      .where({ 'boxes.id': boxId, 'moves.user_id': userId })
      .select(
        'boxes.*',
        'rooms.name as destination_room_name'
      )
      .first();

    if (!box) {
      throw new Error('Box not found or access denied');
    }

    return box;
  }

  /**
   * Update a box
   */
  static async updateBox(boxId: string, userId: string, boxData: UpdateBoxData): Promise<Box> {
    // Verify box ownership
    await this.getBoxById(boxId, userId);

    // Verify destination room ownership if being updated
    if (boxData.destination_room_id) {
      const room = await db('rooms')
        .join('moves', 'rooms.move_id', 'moves.id')
        .where({ 'rooms.id': boxData.destination_room_id, 'moves.user_id': userId })
        .first();
      
      if (!room) {
        throw new Error('Destination room not found or access denied');
      }
    }

    const [updatedBox] = await db('boxes')
      .where({ id: boxId })
      .update({
        ...boxData,
        updated_at: db.fn.now(),
      })
      .returning('*');

    return updatedBox;
  }

  /**
   * Delete a box
   */
  static async deleteBox(boxId: string, userId: string): Promise<void> {
    // Verify box ownership
    await this.getBoxById(boxId, userId);

    await db('boxes')
      .where({ id: boxId })
      .del();
  }

  /**
   * Mark box as packed
   */
  static async markBoxAsPacked(boxId: string, userId: string): Promise<Box> {
    // Verify box ownership
    await this.getBoxById(boxId, userId);

    const [updatedBox] = await db('boxes')
      .where({ id: boxId })
      .update({
        is_packed: true,
        packed_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');

    return updatedBox;
  }

  /**
   * Mark box as loaded
   */
  static async markBoxAsLoaded(boxId: string, userId: string): Promise<Box> {
    // Verify box ownership
    await this.getBoxById(boxId, userId);

    const [updatedBox] = await db('boxes')
      .where({ id: boxId })
      .update({
        is_loaded: true,
        loaded_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');

    return updatedBox;
  }

  /**
   * Mark box as delivered
   */
  static async markBoxAsDelivered(boxId: string, userId: string): Promise<Box> {
    // Verify box ownership
    await this.getBoxById(boxId, userId);

    const [updatedBox] = await db('boxes')
      .where({ id: boxId })
      .update({
        is_delivered: true,
        delivered_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');

    return updatedBox;
  }

  /**
   * Get box contents (items in the box)
   */
  static async getBoxContents(boxId: string, userId: string): Promise<any[]> {
    // Verify box ownership
    await this.getBoxById(boxId, userId);

    const contents = await db('items')
      .leftJoin('rooms', 'items.room_id', 'rooms.id')
      .where('items.box_id', boxId)
      .select(
        'items.*',
        'rooms.name as room_name'
      )
      .orderBy('items.name');

    // Parse properties JSON for each item
    return contents.map(item => ({
      ...item,
      properties: item.properties ? JSON.parse(item.properties) : null
    }));
  }

  /**
   * Get box statistics for a move
   */
  static async getBoxStats(moveId: string, userId: string): Promise<any> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    const stats = await db('boxes')
      .where('move_id', moveId)
      .select(
        db.raw('COUNT(*) as total_boxes'),
        db.raw('COUNT(CASE WHEN is_packed = true THEN 1 END) as packed_boxes'),
        db.raw('COUNT(CASE WHEN is_loaded = true THEN 1 END) as loaded_boxes'),
        db.raw('COUNT(CASE WHEN is_delivered = true THEN 1 END) as delivered_boxes')
      )
      .first();

    return stats;
  }

  /**
   * Get boxes by type
   */
  static async getBoxesByType(moveId: string, userId: string): Promise<any[]> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    const types = await db('boxes')
      .where('move_id', moveId)
      .groupBy('box_type')
      .select(
        'box_type',
        db.raw('COUNT(*) as box_count')
      )
      .orderBy('box_type');

    return types;
  }

  /**
   * Generate QR code for a box
   */
  static async generateQRCode(boxId: string, userId: string): Promise<string> {
    // Verify box ownership
    const box = await this.getBoxById(boxId, userId);

    // Generate new QR code if needed
    if (!box.qr_code) {
      const qrCode = `BOX-${uuidv4()}`;
      await db('boxes')
        .where({ id: boxId })
        .update({ qr_code: qrCode });
      return qrCode;
    }

    return box.qr_code;
  }
}
