import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse, AuthResponse, User, Move, CreateUserRequest, LoginRequest, CreateMoveRequest, Task, CreateTaskRequest, UpdateTaskRequest, ReorderTasksRequest, BulkTaskOperation, TaskTemplate, TaskStats, Room, CreateRoomRequest, UpdateRoomRequest, Item, CreateItemRequest, UpdateItemRequest, ItemFilters, Box, CreateBoxRequest, UpdateBoxRequest, BoxFilters, ItemStats, BoxStats, RoomStats } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async login(loginData: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/login', loginData);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/me');
    return response.data;
  }

  async updateProfile(userData: Partial<CreateUserRequest>): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put('/auth/profile', userData);
    return response.data;
  }

  // Move endpoints
  async getMoves(): Promise<ApiResponse<Move[]>> {
    const response: AxiosResponse<ApiResponse<Move[]>> = await this.api.get('/moves');
    return response.data;
  }

  async getMove(id: string): Promise<ApiResponse<Move>> {
    const response: AxiosResponse<ApiResponse<Move>> = await this.api.get(`/moves/${id}`);
    return response.data;
  }

  async createMove(moveData: CreateMoveRequest): Promise<ApiResponse<Move>> {
    const response: AxiosResponse<ApiResponse<Move>> = await this.api.post('/moves', moveData);
    return response.data;
  }

  async updateMove(id: string, moveData: Partial<CreateMoveRequest>): Promise<ApiResponse<Move>> {
    const response: AxiosResponse<ApiResponse<Move>> = await this.api.put(`/moves/${id}`, moveData);
    return response.data;
  }

  async deleteMove(id: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/moves/${id}`);
    return response.data;
  }

  async updateMoveStatus(id: string, status: string): Promise<ApiResponse<Move>> {
    const response: AxiosResponse<ApiResponse<Move>> = await this.api.patch(`/moves/${id}/status`, { status });
    return response.data;
  }

  // Task endpoints
  async getTasks(moveId: string, filters?: { status?: string; category?: string; priority?: number }): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority !== undefined) params.append('priority', filters.priority.toString());
    
    const queryString = params.toString();
    const url = `/moves/${moveId}/tasks${queryString ? `?${queryString}` : ''}`;
    const response: AxiosResponse<ApiResponse<Task[]>> = await this.api.get(url);
    return response.data;
  }

  async getTask(moveId: string, taskId: string): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.api.get(`/moves/${moveId}/tasks/${taskId}`);
    return response.data;
  }

  async createTask(moveId: string, taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.api.post(`/moves/${moveId}/tasks`, taskData);
    return response.data;
  }

  async updateTask(moveId: string, taskId: string, taskData: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.api.put(`/moves/${moveId}/tasks/${taskId}`, taskData);
    return response.data;
  }

  async deleteTask(moveId: string, taskId: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/moves/${moveId}/tasks/${taskId}`);
    return response.data;
  }

  async reorderTasks(moveId: string, reorderData: ReorderTasksRequest): Promise<ApiResponse<Task[]>> {
    const response: AxiosResponse<ApiResponse<Task[]>> = await this.api.put(`/moves/${moveId}/tasks/reorder`, reorderData);
    return response.data;
  }

  async bulkTaskOperation(moveId: string, operation: BulkTaskOperation): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.post(`/moves/${moveId}/tasks/bulk`, operation);
    return response.data;
  }

  async getTaskTemplates(): Promise<ApiResponse<TaskTemplate[]>> {
    const response: AxiosResponse<ApiResponse<TaskTemplate[]>> = await this.api.get('/moves/templates');
    return response.data;
  }

  async applyTaskTemplates(moveId: string, templateIds: string[]): Promise<ApiResponse<Task[]>> {
    const response: AxiosResponse<ApiResponse<Task[]>> = await this.api.post(`/moves/${moveId}/tasks/templates`, { templateIds });
    return response.data;
  }

  async getTaskStats(moveId: string): Promise<ApiResponse<TaskStats>> {
    const response: AxiosResponse<ApiResponse<TaskStats>> = await this.api.get(`/moves/${moveId}/tasks/stats`);
    return response.data;
  }

  // Room endpoints
  async getRooms(moveId: string): Promise<ApiResponse<Room[]>> {
    const response: AxiosResponse<ApiResponse<Room[]>> = await this.api.get(`/moves/${moveId}/rooms`);
    return response.data;
  }

  async getRoom(roomId: string): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.api.get(`/rooms/${roomId}`);
    return response.data;
  }

  async createRoom(moveId: string, roomData: CreateRoomRequest): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.api.post(`/moves/${moveId}/rooms`, roomData);
    return response.data;
  }

  async updateRoom(roomId: string, roomData: UpdateRoomRequest): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.api.put(`/rooms/${roomId}`, roomData);
    return response.data;
  }

  async deleteRoom(roomId: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/rooms/${roomId}`);
    return response.data;
  }

  async getRoomStats(moveId: string): Promise<ApiResponse<RoomStats[]>> {
    const response: AxiosResponse<ApiResponse<RoomStats[]>> = await this.api.get(`/moves/${moveId}/rooms/stats`);
    return response.data;
  }

  // Item endpoints
  async getItems(moveId: string, filters?: ItemFilters): Promise<ApiResponse<Item[]>> {
    const params = new URLSearchParams();
    if (filters?.room_id) params.append('room_id', filters.room_id);
    if (filters?.box_id) params.append('box_id', filters.box_id);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.is_fragile !== undefined) params.append('is_fragile', filters.is_fragile.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    
    const queryString = params.toString();
    const url = `/moves/${moveId}/items${queryString ? `?${queryString}` : ''}`;
    const response: AxiosResponse<ApiResponse<Item[]>> = await this.api.get(url);
    return response.data;
  }

  async getItem(itemId: string): Promise<ApiResponse<Item>> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.get(`/items/${itemId}`);
    return response.data;
  }

  async createItem(moveId: string, itemData: CreateItemRequest): Promise<ApiResponse<Item>> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.post(`/moves/${moveId}/items`, itemData);
    return response.data;
  }

  async updateItem(itemId: string, itemData: UpdateItemRequest): Promise<ApiResponse<Item>> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.put(`/items/${itemId}`, itemData);
    return response.data;
  }

  async deleteItem(itemId: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/items/${itemId}`);
    return response.data;
  }

  async moveItemToBox(itemId: string, boxId: string): Promise<ApiResponse<Item>> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.post(`/items/${itemId}/move-to-box`, { boxId });
    return response.data;
  }

  async removeItemFromBox(itemId: string): Promise<ApiResponse<Item>> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.post(`/items/${itemId}/remove-from-box`);
    return response.data;
  }

  async getItemStats(moveId: string): Promise<ApiResponse<ItemStats>> {
    const response: AxiosResponse<ApiResponse<ItemStats>> = await this.api.get(`/moves/${moveId}/items/stats`);
    return response.data;
  }

  async getItemsByCategory(moveId: string): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get(`/moves/${moveId}/items/categories`);
    return response.data;
  }

  // Box endpoints
  async getBoxes(moveId: string, filters?: BoxFilters): Promise<ApiResponse<Box[]>> {
    const params = new URLSearchParams();
    if (filters?.box_type) params.append('box_type', filters.box_type);
    if (filters?.is_packed !== undefined) params.append('is_packed', filters.is_packed.toString());
    if (filters?.is_loaded !== undefined) params.append('is_loaded', filters.is_loaded.toString());
    if (filters?.is_delivered !== undefined) params.append('is_delivered', filters.is_delivered.toString());
    if (filters?.destination_room_id) params.append('destination_room_id', filters.destination_room_id);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    
    const queryString = params.toString();
    const url = `/moves/${moveId}/boxes${queryString ? `?${queryString}` : ''}`;
    const response: AxiosResponse<ApiResponse<Box[]>> = await this.api.get(url);
    return response.data;
  }

  async getBox(boxId: string): Promise<ApiResponse<Box>> {
    const response: AxiosResponse<ApiResponse<Box>> = await this.api.get(`/boxes/${boxId}`);
    return response.data;
  }

  async createBox(moveId: string, boxData: CreateBoxRequest): Promise<ApiResponse<Box>> {
    const response: AxiosResponse<ApiResponse<Box>> = await this.api.post(`/moves/${moveId}/boxes`, boxData);
    return response.data;
  }

  async updateBox(boxId: string, boxData: UpdateBoxRequest): Promise<ApiResponse<Box>> {
    const response: AxiosResponse<ApiResponse<Box>> = await this.api.put(`/boxes/${boxId}`, boxData);
    return response.data;
  }

  async deleteBox(boxId: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/boxes/${boxId}`);
    return response.data;
  }

  async markBoxAsPacked(boxId: string): Promise<ApiResponse<Box>> {
    const response: AxiosResponse<ApiResponse<Box>> = await this.api.post(`/boxes/${boxId}/pack`);
    return response.data;
  }

  async markBoxAsLoaded(boxId: string): Promise<ApiResponse<Box>> {
    const response: AxiosResponse<ApiResponse<Box>> = await this.api.post(`/boxes/${boxId}/load`);
    return response.data;
  }

  async markBoxAsDelivered(boxId: string): Promise<ApiResponse<Box>> {
    const response: AxiosResponse<ApiResponse<Box>> = await this.api.post(`/boxes/${boxId}/deliver`);
    return response.data;
  }

  async getBoxContents(boxId: string): Promise<ApiResponse<Item[]>> {
    const response: AxiosResponse<ApiResponse<Item[]>> = await this.api.get(`/boxes/${boxId}/contents`);
    return response.data;
  }

  async generateQRCode(boxId: string): Promise<ApiResponse<{ qr_code: string }>> {
    const response: AxiosResponse<ApiResponse<{ qr_code: string }>> = await this.api.post(`/boxes/${boxId}/qr-code`);
    return response.data;
  }

  async getBoxStats(moveId: string): Promise<ApiResponse<BoxStats>> {
    const response: AxiosResponse<ApiResponse<BoxStats>> = await this.api.get(`/moves/${moveId}/boxes/stats`);
    return response.data;
  }

  async getBoxesByType(moveId: string): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get(`/moves/${moveId}/boxes/types`);
    return response.data;
  }
}

export const apiService = new ApiService();
