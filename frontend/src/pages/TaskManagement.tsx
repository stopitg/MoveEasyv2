import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskTemplate } from '../types';
import { apiService as api } from '../services/api';

interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  completionRate: number;
}

const TaskManagement: React.FC = () => {
  const { moveId } = useParams<{ moveId: string }>();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and search
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<CreateTaskRequest>({
    name: '',
    description: '',
    category: '',
    priority: 0
  });

  useEffect(() => {
    if (moveId) {
      loadTasks();
      loadStats();
      loadTemplates();
    }
  }, [moveId, filters]);

  const loadTasks = async () => {
    if (!moveId) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.getTasks(moveId, filters);
      setTasks(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!moveId) return;
    
    try {
      const response = await api.getTaskStats(moveId);
      setStats(response.data || null);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await api.getTaskTemplates();
      setTemplates(response.data || []);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveId) return;
    
    try {
      const response = await api.createTask(moveId, formData);
      setTasks([...tasks, response.data!]);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', category: '', priority: 0 });
      loadStats();
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !moveId) return;
    
    try {
      const updateData: UpdateTaskRequest = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      };
      
      const response = await api.updateTask(moveId, editingTask.id, updateData);
      setTasks(tasks.map(task => task.id === editingTask.id ? response.data! : task));
      setEditingTask(null);
      setFormData({ name: '', description: '', category: '', priority: 0 });
      loadStats();
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    if (!moveId) return;
    
    try {
      const response = await api.updateTask(moveId, taskId, { status: status as any });
      setTasks(tasks.map(task => task.id === taskId ? response.data! : task));
      loadStats();
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?') || !moveId) return;
    
    try {
      await api.deleteTask(moveId, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      loadStats();
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleApplyTemplates = async (templateIds: string[]) => {
    if (!moveId) return;
    
    try {
      const response = await api.applyTaskTemplates(moveId, templateIds);
      setTasks([...tasks, ...response.data!]);
      setShowTemplates(false);
      loadStats();
    } catch (err) {
      setError('Failed to apply templates');
      console.error('Error applying templates:', err);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      description: task.description || '',
      category: task.category,
      priority: task.priority
    });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setFormData({ name: '', description: '', category: '', priority: 0 });
  };

  const getStatusColor = (status: string) => {
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
    return 'text-gray-600';
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
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Administrative">Administrative</option>
                <option value="Logistics">Logistics</option>
                <option value="Packing">Packing</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Unpacking">Unpacking</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search tasks..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first task or applying templates.</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Task
                </button>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Apply Templates
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          Priority: {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-gray-600 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Category: {task.category}</span>
                        {task.dueDate && (
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => startEdit(task)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
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

        {/* Create/Edit Task Modal */}
        {(showCreateForm || editingTask) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Packing">Packing</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Unpacking">Unpacking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={editingTask ? cancelEdit : () => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Templates Modal */}
        {showTemplates && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Apply Task Templates</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      id={`template-${template.id}`}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={`template-${template.id}`} className="block">
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Category: {template.category} | Priority: {template.priority}
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const selectedTemplates = templates
                      .filter((_, index) => {
                        const checkbox = document.getElementById(`template-${templates[index].id}`) as HTMLInputElement;
                        return checkbox?.checked;
                      })
                      .map(t => t.id);
                    handleApplyTemplates(selectedTemplates);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Selected Templates
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