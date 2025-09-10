import { db } from '../config/database';
import { Move, CreateMoveRequest, Location } from '../types';

export class MoveService {
  static async createMove(userId: string, moveData: CreateMoveRequest): Promise<Move> {
    const [move] = await db('moves')
      .insert({
        user_id: userId,
        start_location: JSON.stringify(moveData.startLocation),
        end_location: JSON.stringify(moveData.endLocation),
        move_date: moveData.moveDate,
        household_size: moveData.householdSize,
        inventory_size_estimate: moveData.inventorySizeEstimate
      })
      .returning('*');

    return {
      id: move.id,
      userId: move.user_id,
      startLocation: move.start_location as Location,
      endLocation: move.end_location as Location,
      moveDate: move.move_date,
      status: move.status,
      householdSize: move.household_size,
      inventorySizeEstimate: move.inventory_size_estimate,
      createdAt: move.created_at,
      updatedAt: move.updated_at
    };
  }

  static async getMovesByUserId(userId: string): Promise<Move[]> {
    const moves = await db('moves')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');

    return moves.map(move => ({
      id: move.id,
      userId: move.user_id,
      startLocation: move.start_location as Location,
      endLocation: move.end_location as Location,
      moveDate: move.move_date,
      status: move.status,
      householdSize: move.household_size,
      inventorySizeEstimate: move.inventory_size_estimate,
      createdAt: move.created_at,
      updatedAt: move.updated_at
    }));
  }

  static async getMoveById(moveId: string, userId: string): Promise<Move | null> {
    const move = await db('moves')
      .where('id', moveId)
      .andWhere('user_id', userId)
      .first();

    if (!move) {
      return null;
    }

    return {
      id: move.id,
      userId: move.user_id,
      startLocation: move.start_location as Location,
      endLocation: move.end_location as Location,
      moveDate: move.move_date,
      status: move.status,
      householdSize: move.household_size,
      inventorySizeEstimate: move.inventory_size_estimate,
      createdAt: move.created_at,
      updatedAt: move.updated_at
    };
  }

  static async updateMove(moveId: string, userId: string, updateData: Partial<CreateMoveRequest>): Promise<Move | null> {
    const updateFields: any = {};
    
    if (updateData.startLocation) updateFields.start_location = JSON.stringify(updateData.startLocation);
    if (updateData.endLocation) updateFields.end_location = JSON.stringify(updateData.endLocation);
    if (updateData.moveDate) updateFields.move_date = updateData.moveDate;
    if (updateData.householdSize !== undefined) updateFields.household_size = updateData.householdSize;
    if (updateData.inventorySizeEstimate) updateFields.inventory_size_estimate = updateData.inventorySizeEstimate;

    const [move] = await db('moves')
      .where('id', moveId)
      .andWhere('user_id', userId)
      .update(updateFields)
      .returning('*');

    if (!move) {
      return null;
    }

    return {
      id: move.id,
      userId: move.user_id,
      startLocation: move.start_location as Location,
      endLocation: move.end_location as Location,
      moveDate: move.move_date,
      status: move.status,
      householdSize: move.household_size,
      inventorySizeEstimate: move.inventory_size_estimate,
      createdAt: move.created_at,
      updatedAt: move.updated_at
    };
  }

  static async deleteMove(moveId: string, userId: string): Promise<boolean> {
    const deletedRows = await db('moves')
      .where('id', moveId)
      .andWhere('user_id', userId)
      .del();

    return deletedRows > 0;
  }

  static async updateMoveStatus(moveId: string, userId: string, status: string): Promise<Move | null> {
    const [move] = await db('moves')
      .where('id', moveId)
      .andWhere('user_id', userId)
      .update({ status })
      .returning('*');

    if (!move) {
      return null;
    }

    return {
      id: move.id,
      userId: move.user_id,
      startLocation: move.start_location as Location,
      endLocation: move.end_location as Location,
      moveDate: move.move_date,
      status: move.status,
      householdSize: move.household_size,
      inventorySizeEstimate: move.inventory_size_estimate,
      createdAt: move.created_at,
      updatedAt: move.updated_at
    };
  }
}
