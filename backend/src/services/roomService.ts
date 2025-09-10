import db from '../config/database';
import { Room, CreateRoomData, UpdateRoomData } from '../types';

export class RoomService {
  /**
   * Create a new room for a move
   */
  static async createRoom(moveId: string, userId: string, roomData: CreateRoomData): Promise<Room> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    const [room] = await db('rooms')
      .insert({
        move_id: moveId,
        name: roomData.name,
        description: roomData.description,
      })
      .returning('*');

    return room;
  }

  /**
   * Get all rooms for a move
   */
  static async getRoomsByMove(moveId: string, userId: string): Promise<Room[]> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    const rooms = await db('rooms')
      .where({ move_id: moveId })
      .orderBy('name');

    return rooms;
  }

  /**
   * Get a specific room
   */
  static async getRoomById(roomId: string, userId: string): Promise<Room> {
    const room = await db('rooms')
      .join('moves', 'rooms.move_id', 'moves.id')
      .where({ 'rooms.id': roomId, 'moves.user_id': userId })
      .select('rooms.*')
      .first();

    if (!room) {
      throw new Error('Room not found or access denied');
    }

    return room;
  }

  /**
   * Update a room
   */
  static async updateRoom(roomId: string, userId: string, roomData: UpdateRoomData): Promise<Room> {
    // Verify room ownership
    const room = await this.getRoomById(roomId, userId);

    const [updatedRoom] = await db('rooms')
      .where({ id: roomId })
      .update({
        name: roomData.name,
        description: roomData.description,
        updated_at: db.fn.now(),
      })
      .returning('*');

    return updatedRoom;
  }

  /**
   * Delete a room
   */
  static async deleteRoom(roomId: string, userId: string): Promise<void> {
    // Verify room ownership
    await this.getRoomById(roomId, userId);

    await db('rooms')
      .where({ id: roomId })
      .del();
  }

  /**
   * Get room statistics
   */
  static async getRoomStats(moveId: string, userId: string): Promise<any> {
    // Verify move ownership
    const move = await db('moves')
      .where({ id: moveId, user_id: userId })
      .first();
    
    if (!move) {
      throw new Error('Move not found or access denied');
    }

    const stats = await db('rooms')
      .leftJoin('items', 'rooms.id', 'items.room_id')
      .where('rooms.move_id', moveId)
      .groupBy('rooms.id', 'rooms.name')
      .select(
        'rooms.id',
        'rooms.name',
        db.raw('COUNT(items.id) as item_count'),
        db.raw('COUNT(CASE WHEN items.box_id IS NOT NULL THEN 1 END) as packed_items'),
        db.raw('COALESCE(SUM(items.estimated_value), 0) as total_value')
      );

    return stats;
  }
}
