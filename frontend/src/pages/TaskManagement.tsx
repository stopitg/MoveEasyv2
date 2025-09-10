import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskTemplate, TaskStats, TaskStatus } from '../types';
import { apiService } from '../services/api';

const TaskManagement: React.FC = () => {
  const { moveId } = useParams<{ moveId: string }>();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<{ status?: string; category?: string; priority?: number }>({});

  // Form state
  const [formData, setFormData] = useState<CreateTaskRequest>({
    name: '',
    description: '',
    category: '',
    priority: 0,
  });

  useEffect(() => {
    if (moveId) {
      loadTasks();
      loadTemplates();
      loadStats();
    }
  }, [moveId, filters]);

  const loadTasks = async () => {
    if (!moveId) return;
    
    try {
      setLoading(true);
      const response = await apiService.getTasks(moveId, filters);
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await apiService.getTaskTemplates();
      if (response.success && response.data) {
        setTemplates(response.data);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

  const loadStats = async () => {
    if (!moveId) return;
    
    try {
      const response = await apiService.getTaskStats(moveId);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveId) return;

    try {
      const response = await apiService.createTask(moveId, formData);
      if (response.success) {
        setShowCreateForm(false);
        setFormData({ name: '', description: '', category: '', priority: 0 });
        loadTasks();
        loadStats();
      } else {
        setError(response.error || 'Failed to create task');
      }
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: UpdateTaskRequest) => {
    if (!moveId) return;

    try {
      const response = await apiService.updateTask(moveId, taskId, updates);
      if (response.success) {
        setEditingTask(null);
        loadTasks();
        loadStats();
      } else {
        setError(response.error || 'Failed to update task');
      }
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!moveId) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await apiService.deleteTask(moveId, taskId);
        if (response.success) {
          loadTasks();
          loadStats();
        } else {
          setError(response.error || 'Failed to delete task');
        }
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleBulkOperation = async (taskIds: string[], operation: 'complete' | 'cancel' | 'delete') => {
    if (!moveId) return;

    try {
      const response = await apiService.bulkTaskOperation(moveId, { taskIds, operation });
      if (response.success) {
        loadTasks();
        loadStats();
      } else {
        setError(response.error || `Failed to ${operation} tasks`);
      }
    } catch (err) {
      setError(`Failed to ${operation} tasks`);
    }
  };

  const handleApplyTemplates = async (templateIds: string[]) => {
    if (!moveId) return;

    try {
      const response = await apiService.applyTaskTemplates(moveId, templateIds);
      if (response.success) {
        setShowTemplates(false);
        loadTasks();
        loadStats();
      } else {
        setError(response.error || 'Failed to apply templates');
      }
    } catch (err) {
      setError('Failed to apply templates');
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600';
    if (priority >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
              <p className="mt-2 text-gray-600">Organize and track your moving tasks</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Apply Templates
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.completionRate)}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="Administrative">Administrative</option>
              <option value="Packing">Packing</option>
              <option value="Moving Services">Moving Services</option>
              <option value="Cleaning">Cleaning</option>
            </select>
            <button
              onClick={() => setFilters({})}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first task or applying a template.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={(e) => handleUpdateTask(task.id, { 
                            status: e.target.checked ? 'completed' : 'pending' 
                          })}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                          {task.description && (
                            <p className="text-gray-600 mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-gray-500">{task.category}</span>
                            <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                              Priority: {task.priority}
                            </span>
                            {task.dueDate && (
                              <span className="text-sm text-gray-500">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Task Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Packing">Packing</option>
                      <option value="Moving Services">Moving Services</option>
                      <option value="Cleaning">Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority (0-10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Templates Modal */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Apply Task Templates</h2>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      id={`template-${template.id}`}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <label htmlFor={`template-${template.id}`} className="font-medium text-gray-900 cursor-pointer">
                        {template.name}
                      </label>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{template.category}</span>
                        <span className="text-xs text-gray-500">Priority: {template.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const selectedTemplates = templates.filter((_, index) => {
                      const checkbox = document.getElementById(`template-${templates[index].id}`) as HTMLInputElement;
                      return checkbox?.checked;
                    });
                    if (selectedTemplates.length > 0) {
                      handleApplyTemplates(selectedTemplates.map(t => t.id));
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
