import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskRequest, UpdateTaskRequest, ReorderTasksRequest, BulkTaskOperation } from '../types';
import db from '../config/database';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const taskData: CreateTaskRequest = req.body;

      // Verify the move belongs to the authenticated user
      const move = await db('moves')
        .where('id', moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Move not found'
        });
        return;
      }

      const task = await this.taskService.createTask(moveId, taskData);

      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task'
      });
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const { status, category, search } = req.query;

      // Verify the move belongs to the authenticated user
      const move = await db('moves')
        .where('id', moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Move not found'
        });
        return;
      }

      const filters = {
        status: status as string,
        category: category as string,
        search: search as string
      };

      const tasks = await this.taskService.getTasksByMoveId(moveId, filters);

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks'
      });
    }
  }

  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;

      const task = await this.taskService.getTaskById(taskId);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      // Verify the task belongs to a move owned by the authenticated user
      const move = await db('moves')
        .where('id', task.moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch task'
      });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const updateData: UpdateTaskRequest = req.body;

      // First verify the task exists and belongs to the user
      const task = await this.taskService.getTaskById(taskId);
      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      const move = await db('moves')
        .where('id', task.moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      const updatedTask = await this.taskService.updateTask(taskId, updateData);

      res.json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update task'
      });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;

      // First verify the task exists and belongs to the user
      const task = await this.taskService.getTaskById(taskId);
      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      const move = await db('moves')
        .where('id', task.moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      const deleted = await this.taskService.deleteTask(taskId);

      if (deleted) {
        res.json({
          success: true,
          message: 'Task deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete task'
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete task'
      });
    }
  }

  async reorderTasks(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const reorderData: ReorderTasksRequest = req.body;

      // Verify the move belongs to the authenticated user
      const move = await db('moves')
        .where('id', moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Move not found'
        });
        return;
      }

      const tasks = await this.taskService.reorderTasks(moveId, reorderData);

      res.json({
        success: true,
        data: tasks,
        message: 'Tasks reordered successfully'
      });
    } catch (error) {
      console.error('Error reordering tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reorder tasks'
      });
    }
  }

  async bulkTaskOperation(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const operation: BulkTaskOperation = req.body;

      // Verify the move belongs to the authenticated user
      const move = await db('moves')
        .where('id', moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Move not found'
        });
        return;
      }

      const result = await this.taskService.bulkTaskOperation(moveId, operation);

      res.json({
        success: true,
        data: result,
        message: `Bulk operation completed: ${result.success} successful, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error performing bulk task operation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to perform bulk task operation'
      });
    }
  }

  async getTaskTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await this.taskService.getTaskTemplates();

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Error fetching task templates:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch task templates'
      });
    }
  }

  async applyTaskTemplates(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const { templateIds } = req.body;

      // Verify the move belongs to the authenticated user
      const move = await db('moves')
        .where('id', moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Move not found'
        });
        return;
      }

      const tasks = await this.taskService.applyTaskTemplates(moveId, templateIds);

      res.status(201).json({
        success: true,
        data: tasks,
        message: 'Task templates applied successfully'
      });
    } catch (error) {
      console.error('Error applying task templates:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply task templates'
      });
    }
  }

  async getTaskStats(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;

      // Verify the move belongs to the authenticated user
      const move = await db('moves')
        .where('id', moveId)
        .where('user_id', req.user!.userId)
        .first();

      if (!move) {
        res.status(404).json({
          success: false,
          error: 'Move not found'
        });
        return;
      }

      const stats = await this.taskService.getTaskStats(moveId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching task stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch task stats'
      });
    }
  }
}