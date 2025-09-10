import { Knex } from 'knex';
import { Task, CreateTaskRequest, UpdateTaskRequest, ReorderTasksRequest, BulkTaskOperation, TaskTemplate } from '../types';

export class TaskService {
  constructor(private db: Knex) {}

  async createTask(moveId: string, taskData: CreateTaskRequest): Promise<Task> {
    const [task] = await this.db('tasks')
      .insert({
        move_id: moveId,
        name: taskData.name,
        description: taskData.description,
        due_date: taskData.dueDate,
        category: taskData.category,
        priority: taskData.priority || 0,
        order_index: await this.getNextOrderIndex(moveId),
        status: 'pending'
      })
      .returning('*');

    return this.mapTaskFromDb(task);
  }

  async getTasksByMoveId(moveId: string, filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<Task[]> {
    let query = this.db('tasks')
      .where('move_id', moveId)
      .orderBy('order_index', 'asc')
      .orderBy('priority', 'desc')
      .orderBy('created_at', 'asc');

    if (filters?.status) {
      query = query.where('status', filters.status);
    }

    if (filters?.category) {
      query = query.where('category', filters.category);
    }

    if (filters?.search) {
      query = query.where(function() {
        this.where('name', 'ilike', `%${filters.search}%`)
            .orWhere('description', 'ilike', `%${filters.search}%`);
      });
    }

    const tasks = await query;
    return tasks.map(task => this.mapTaskFromDb(task));
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    const [task] = await this.db('tasks')
      .where('id', taskId)
      .select('*');

    return task ? this.mapTaskFromDb(task) : null;
  }

  async updateTask(taskId: string, updateData: UpdateTaskRequest): Promise<Task | null> {
    const updateFields: any = {
      updated_at: this.db.fn.now()
    };

    if (updateData.name !== undefined) updateFields.name = updateData.name;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.dueDate !== undefined) updateFields.due_date = updateData.dueDate;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.category !== undefined) updateFields.category = updateData.category;
    if (updateData.priority !== undefined) updateFields.priority = updateData.priority;
    if (updateData.orderIndex !== undefined) updateFields.order_index = updateData.orderIndex;

    const [updatedTask] = await this.db('tasks')
      .where('id', taskId)
      .update(updateFields)
      .returning('*');

    return updatedTask ? this.mapTaskFromDb(updatedTask) : null;
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const deletedCount = await this.db('tasks')
      .where('id', taskId)
      .del();

    return deletedCount > 0;
  }

  async reorderTasks(moveId: string, reorderData: ReorderTasksRequest): Promise<Task[]> {
    const { taskIds } = reorderData;
    
    // Update order_index for each task
    const updates = taskIds.map((taskId, index) => 
      this.db('tasks')
        .where('id', taskId)
        .where('move_id', moveId)
        .update({ order_index: index, updated_at: this.db.fn.now() })
    );

    await Promise.all(updates);

    // Return updated tasks
    return this.getTasksByMoveId(moveId);
  }

  async bulkTaskOperation(moveId: string, operation: BulkTaskOperation): Promise<{ success: number; failed: number }> {
    const { taskIds, operation: op } = operation;
    let success = 0;
    let failed = 0;

    for (const taskId of taskIds) {
      try {
        if (op === 'delete') {
          const deleted = await this.deleteTask(taskId);
          if (deleted) success++;
          else failed++;
        } else if (op === 'complete') {
          const updated = await this.updateTask(taskId, { status: 'completed' });
          if (updated) success++;
          else failed++;
        } else if (op === 'cancel') {
          const updated = await this.updateTask(taskId, { status: 'cancelled' });
          if (updated) success++;
          else failed++;
        }
      } catch (error) {
        failed++;
      }
    }

    return { success, failed };
  }

  async getTaskTemplates(): Promise<TaskTemplate[]> {
    // Default task templates for different move categories
    const templates: TaskTemplate[] = [
      {
        id: '1',
        name: 'Change Address',
        description: 'Update your address with all relevant services and organizations',
        category: 'Administrative',
        priority: 5,
        orderIndex: 1,
        isDefault: true
      },
      {
        id: '2',
        name: 'Book Moving Company',
        description: 'Research and book a reliable moving company',
        category: 'Logistics',
        priority: 5,
        orderIndex: 2,
        isDefault: true
      },
      {
        id: '3',
        name: 'Pack Kitchen',
        description: 'Pack all kitchen items and appliances',
        category: 'Packing',
        priority: 3,
        orderIndex: 3,
        isDefault: true
      },
      {
        id: '4',
        name: 'Pack Living Room',
        description: 'Pack living room furniture and decorations',
        category: 'Packing',
        priority: 3,
        orderIndex: 4,
        isDefault: true
      },
      {
        id: '5',
        name: 'Pack Bedroom',
        description: 'Pack bedroom furniture and personal items',
        category: 'Packing',
        priority: 3,
        orderIndex: 5,
        isDefault: true
      },
      {
        id: '6',
        name: 'Transfer Utilities',
        description: 'Set up utilities at new location and cancel old ones',
        category: 'Administrative',
        priority: 4,
        orderIndex: 6,
        isDefault: true
      },
      {
        id: '7',
        name: 'Update Insurance',
        description: 'Update home and auto insurance policies',
        category: 'Administrative',
        priority: 4,
        orderIndex: 7,
        isDefault: true
      },
      {
        id: '8',
        name: 'Clean Old Home',
        description: 'Deep clean the old home before moving out',
        category: 'Cleaning',
        priority: 2,
        orderIndex: 8,
        isDefault: true
      },
      {
        id: '9',
        name: 'Unpack Essentials',
        description: 'Unpack essential items first in the new home',
        category: 'Unpacking',
        priority: 4,
        orderIndex: 9,
        isDefault: true
      },
      {
        id: '10',
        name: 'Set Up New Home',
        description: 'Arrange furniture and set up the new home',
        category: 'Unpacking',
        priority: 3,
        orderIndex: 10,
        isDefault: true
      }
    ];

    return templates;
  }

  async applyTaskTemplates(moveId: string, templateIds: string[]): Promise<Task[]> {
    const templates = await this.getTaskTemplates();
    const selectedTemplates = templates.filter(template => templateIds.includes(template.id));
    
    const tasks: Task[] = [];
    
    for (const template of selectedTemplates) {
      const task = await this.createTask(moveId, {
        name: template.name,
        description: template.description,
        category: template.category,
        priority: template.priority
      });
      tasks.push(task);
    }

    return tasks;
  }

  async getTaskStats(moveId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    completionRate: number;
  }> {
    const tasks = await this.getTasksByMoveId(moveId);
    
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      completionRate: 0
    };

    if (stats.total > 0) {
      stats.completionRate = Math.round((stats.completed / stats.total) * 100);
    }

    return stats;
  }

  private async getNextOrderIndex(moveId: string): Promise<number> {
    const result = await this.db('tasks')
      .where('move_id', moveId)
      .max('order_index as maxOrder')
      .first();

    return (result?.maxOrder || 0) + 1;
  }

  private mapTaskFromDb(task: any): Task {
    return {
      id: task.id,
      moveId: task.move_id,
      name: task.name,
      description: task.description,
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      status: task.status,
      category: task.category,
      priority: task.priority,
      orderIndex: task.order_index,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at)
    };
  }
}