import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskRequest, UpdateTaskRequest, ReorderTasksRequest, BulkTaskOperation } from '../types';

const taskService = new TaskService();

export class TaskController {
  // Get all tasks for a move
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const { status, category, priority } = req.query;

      let tasks = await taskService.getTasksByMoveId(moveId);

      // Apply filters
      if (status) {
        tasks = tasks.filter(task => task.status === status);
      }
      if (category) {
        tasks = tasks.filter(task => task.category === category);
      }
      if (priority) {
        tasks = tasks.filter(task => task.priority === parseInt(priority as string));
      }

      res.json({
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve tasks',
      });
    }
  }

  // Get a specific task
  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const { moveId, taskId } = req.params;

      const task = await taskService.getTaskById(taskId, moveId);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found',
        });
        return;
      }

      res.json({
        success: true,
        data: task,
        message: 'Task retrieved successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve task',
      });
    }
  }

  // Create a new task
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const taskData: CreateTaskRequest = req.body;

      // Validate required fields
      if (!taskData.name || !taskData.category) {
        res.status(400).json({
          success: false,
          error: 'Name and category are required',
        });
        return;
      }

      const task = await taskService.createTask(moveId, taskData);

      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create task',
      });
    }
  }

  // Update a task
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { moveId, taskId } = req.params;
      const taskData: UpdateTaskRequest = req.body;

      const task = await taskService.updateTask(taskId, moveId, taskData);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found',
        });
        return;
      }

      res.json({
        success: true,
        data: task,
        message: 'Task updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update task',
      });
    }
  }

  // Delete a task
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { moveId, taskId } = req.params;

      const deleted = await taskService.deleteTask(taskId, moveId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Task not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete task',
      });
    }
  }

  // Reorder tasks
  async reorderTasks(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const reorderData: ReorderTasksRequest = req.body;

      if (!reorderData.taskIds || !Array.isArray(reorderData.taskIds)) {
        res.status(400).json({
          success: false,
          error: 'taskIds array is required',
        });
        return;
      }

      const tasks = await taskService.reorderTasks(moveId, reorderData);

      res.json({
        success: true,
        data: tasks,
        message: 'Tasks reordered successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reorder tasks',
      });
    }
  }

  // Bulk task operations
  async bulkTaskOperation(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const operation: BulkTaskOperation = req.body;

      if (!operation.taskIds || !Array.isArray(operation.taskIds) || !operation.operation) {
        res.status(400).json({
          success: false,
          error: 'taskIds array and operation are required',
        });
        return;
      }

      const success = await taskService.bulkTaskOperation(moveId, operation);

      if (!success) {
        res.status(400).json({
          success: false,
          error: 'No tasks were affected by the operation',
        });
        return;
      }

      res.json({
        success: true,
        message: `Tasks ${operation.operation}d successfully`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to perform bulk operation',
      });
    }
  }

  // Get task templates
  async getTaskTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await taskService.getTaskTemplates();

      res.json({
        success: true,
        data: templates,
        message: 'Task templates retrieved successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve task templates',
      });
    }
  }

  // Apply task templates to a move
  async applyTaskTemplates(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;
      const { templateIds } = req.body;

      if (!templateIds || !Array.isArray(templateIds)) {
        res.status(400).json({
          success: false,
          error: 'templateIds array is required',
        });
        return;
      }

      const tasks = await taskService.applyTaskTemplates(moveId, templateIds);

      res.status(201).json({
        success: true,
        data: tasks,
        message: 'Task templates applied successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to apply task templates',
      });
    }
  }

  // Get task statistics
  async getTaskStats(req: Request, res: Response): Promise<void> {
    try {
      const { moveId } = req.params;

      const stats = await taskService.getTaskStats(moveId);

      res.json({
        success: true,
        data: stats,
        message: 'Task statistics retrieved successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve task statistics',
      });
    }
  }
}
