import { db } from '../config/database';
import { Task, CreateTaskRequest, UpdateTaskRequest, ReorderTasksRequest, BulkTaskOperation, TaskTemplate } from '../types';

export class TaskService {
  // Get all tasks for a specific move
  async getTasksByMoveId(moveId: string): Promise<Task[]> {
    try {
      const tasks = await db('tasks')
        .where('move_id', moveId)
        .orderBy('order_index', 'asc')
        .orderBy('created_at', 'asc');

      return tasks.map(this.mapDbTaskToTask);
    } catch (error) {
      throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get a specific task by ID
  async getTaskById(taskId: string, moveId: string): Promise<Task | null> {
    try {
      const task = await db('tasks')
        .where('id', taskId)
        .andWhere('move_id', moveId)
        .first();

      return task ? this.mapDbTaskToTask(task) : null;
    } catch (error) {
      throw new Error(`Failed to fetch task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create a new task
  async createTask(moveId: string, taskData: CreateTaskRequest): Promise<Task> {
    try {
      // Get the next order index for this move
      const maxOrderIndex = await db('tasks')
        .where('move_id', moveId)
        .max('order_index as max')
        .first();

      const nextOrderIndex = (maxOrderIndex?.max || 0) + 1;

      const [task] = await db('tasks')
        .insert({
          move_id: moveId,
          name: taskData.name,
          description: taskData.description,
          due_date: taskData.dueDate ? new Date(taskData.dueDate) : null,
          category: taskData.category,
          priority: taskData.priority || 0,
          order_index: nextOrderIndex,
        })
        .returning('*');

      return this.mapDbTaskToTask(task);
    } catch (error) {
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update an existing task
  async updateTask(taskId: string, moveId: string, taskData: UpdateTaskRequest): Promise<Task | null> {
    try {
      const updateData: any = {};
      
      if (taskData.name !== undefined) updateData.name = taskData.name;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate ? new Date(taskData.dueDate) : null;
      if (taskData.status !== undefined) updateData.status = taskData.status;
      if (taskData.category !== undefined) updateData.category = taskData.category;
      if (taskData.priority !== undefined) updateData.priority = taskData.priority;
      if (taskData.orderIndex !== undefined) updateData.order_index = taskData.orderIndex;

      const [task] = await db('tasks')
        .where('id', taskId)
        .andWhere('move_id', moveId)
        .update(updateData)
        .returning('*');

      return task ? this.mapDbTaskToTask(task) : null;
    } catch (error) {
      throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete a task
  async deleteTask(taskId: string, moveId: string): Promise<boolean> {
    try {
      const deletedCount = await db('tasks')
        .where('id', taskId)
        .andWhere('move_id', moveId)
        .del();

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Reorder tasks
  async reorderTasks(moveId: string, reorderData: ReorderTasksRequest): Promise<Task[]> {
    try {
      const { taskIds } = reorderData;

      // Update order indices for all tasks in the new order
      const updatePromises = taskIds.map((taskId, index) => 
        db('tasks')
          .where('id', taskId)
          .andWhere('move_id', moveId)
          .update({ order_index: index + 1 })
      );

      await Promise.all(updatePromises);

      // Return the updated tasks in their new order
      return this.getTasksByMoveId(moveId);
    } catch (error) {
      throw new Error(`Failed to reorder tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Bulk operations on tasks
  async bulkTaskOperation(moveId: string, operation: BulkTaskOperation): Promise<boolean> {
    try {
      const { taskIds, operation: op } = operation;

      let updateData: any = {};
      
      switch (op) {
        case 'complete':
          updateData = { status: 'completed' };
          break;
        case 'cancel':
          updateData = { status: 'cancelled' };
          break;
        case 'delete':
          // For delete, we'll use a different approach
          const deletedCount = await db('tasks')
            .whereIn('id', taskIds)
            .andWhere('move_id', moveId)
            .del();
          return deletedCount > 0;
      }

      if (Object.keys(updateData).length > 0) {
        const updatedCount = await db('tasks')
          .whereIn('id', taskIds)
          .andWhere('move_id', moveId)
          .update(updateData);

        return updatedCount > 0;
      }

      return false;
    } catch (error) {
      throw new Error(`Failed to perform bulk operation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get task templates (default tasks for new moves)
  async getTaskTemplates(): Promise<TaskTemplate[]> {
    // For now, return hardcoded templates. In the future, this could be stored in the database
    return [
      {
        id: '1',
        name: 'Change Address',
        description: 'Update your address with USPS, banks, and other important services',
        category: 'Administrative',
        priority: 1,
        orderIndex: 1,
        isDefault: true,
      },
      {
        id: '2',
        name: 'Book Moving Company',
        description: 'Research and book a reliable moving company',
        category: 'Moving Services',
        priority: 1,
        orderIndex: 2,
        isDefault: true,
      },
      {
        id: '3',
        name: 'Pack Kitchen',
        description: 'Pack all kitchen items, dishes, and appliances',
        category: 'Packing',
        priority: 2,
        orderIndex: 3,
        isDefault: true,
      },
      {
        id: '4',
        name: 'Pack Living Room',
        description: 'Pack living room furniture and decorations',
        category: 'Packing',
        priority: 2,
        orderIndex: 4,
        isDefault: true,
      },
      {
        id: '5',
        name: 'Pack Bedroom',
        description: 'Pack bedroom furniture, clothes, and personal items',
        category: 'Packing',
        priority: 2,
        orderIndex: 5,
        isDefault: true,
      },
      {
        id: '6',
        name: 'Update Utilities',
        description: 'Transfer or cancel utilities at old address, set up at new address',
        category: 'Administrative',
        priority: 1,
        orderIndex: 6,
        isDefault: true,
      },
      {
        id: '7',
        name: 'Update Insurance',
        description: 'Update home/renters insurance and auto insurance',
        category: 'Administrative',
        priority: 1,
        orderIndex: 7,
        isDefault: true,
      },
      {
        id: '8',
        name: 'Clean Old Home',
        description: 'Deep clean the old home before moving out',
        category: 'Cleaning',
        priority: 3,
        orderIndex: 8,
        isDefault: true,
      },
    ];
  }

  // Apply task templates to a move
  async applyTaskTemplates(moveId: string, templateIds: string[]): Promise<Task[]> {
    try {
      const templates = await this.getTaskTemplates();
      const selectedTemplates = templates.filter(template => templateIds.includes(template.id));

      const tasks = await Promise.all(
        selectedTemplates.map(template => 
          this.createTask(moveId, {
            name: template.name,
            description: template.description,
            category: template.category,
            priority: template.priority,
          })
        )
      );

      return tasks;
    } catch (error) {
      throw new Error(`Failed to apply task templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get task statistics for a move
  async getTaskStats(moveId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    cancelled: number;
    completionRate: number;
  }> {
    try {
      const tasks = await this.getTasksByMoveId(moveId);
      
      const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        cancelled: tasks.filter(t => t.status === 'cancelled').length,
        completionRate: 0,
      };

      stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

      return stats;
    } catch (error) {
      throw new Error(`Failed to get task statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper method to map database task to Task interface
  private mapDbTaskToTask(dbTask: any): Task {
    return {
      id: dbTask.id,
      moveId: dbTask.move_id,
      name: dbTask.name,
      description: dbTask.description,
      dueDate: dbTask.due_date ? new Date(dbTask.due_date) : undefined,
      status: dbTask.status,
      category: dbTask.category,
      priority: dbTask.priority,
      orderIndex: dbTask.order_index,
      createdAt: new Date(dbTask.created_at),
      updatedAt: new Date(dbTask.updated_at),
    };
  }
}
