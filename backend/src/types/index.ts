// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Move types
export interface Move {
  id: string;
  userId: string;
  startLocation: Location;
  endLocation: Location;
  moveDate: Date;
  status: MoveStatus;
  householdSize?: number;
  inventorySizeEstimate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type MoveStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateMoveRequest {
  startLocation: Location;
  endLocation: Location;
  moveDate: string;
  householdSize?: number;
  inventorySizeEstimate?: string;
}

// Task types
export interface Task {
  id: string;
  moveId: string;
  name: string;
  description?: string;
  dueDate?: Date;
  status: TaskStatus;
  category: string;
  priority: number;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateTaskRequest {
  name: string;
  description?: string;
  dueDate?: string;
  category: string;
  priority?: number;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
  category?: string;
  priority?: number;
  orderIndex?: number;
}

export interface ReorderTasksRequest {
  taskIds: string[];
}

export interface BulkTaskOperation {
  taskIds: string[];
  operation: 'complete' | 'cancel' | 'delete';
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: number;
  orderIndex: number;
  isDefault: boolean;
}

// Room types
export interface Room {
  id: string;
  move_id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRoomData {
  name: string;
  description?: string;
}

export interface UpdateRoomData {
  name?: string;
  description?: string;
}

// Item types
export interface Item {
  id: string;
  move_id: string;
  room_id?: string;
  box_id?: string;
  name: string;
  description?: string;
  photo_url?: string;
  estimated_value?: number;
  properties?: Record<string, any>;
  condition?: string;
  category?: string;
  is_fragile: boolean;
  requires_special_handling: boolean;
  created_at: Date;
  updated_at: Date;
  room_name?: string;
  box_label?: string;
}

export interface CreateItemData {
  name: string;
  description?: string;
  room_id?: string;
  box_id?: string;
  photo_url?: string;
  estimated_value?: number;
  properties?: Record<string, any>;
  condition?: string;
  category?: string;
  is_fragile?: boolean;
  requires_special_handling?: boolean;
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  room_id?: string;
  box_id?: string;
  photo_url?: string;
  estimated_value?: number;
  properties?: Record<string, any>;
  condition?: string;
  category?: string;
  is_fragile?: boolean;
  requires_special_handling?: boolean;
}

export interface ItemFilters {
  room_id?: string;
  box_id?: string;
  category?: string;
  condition?: string;
  is_fragile?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Box types
export interface Box {
  id: string;
  move_id: string;
  label: string;
  qr_code: string;
  destination_room_id?: string;
  box_type: string;
  notes?: string;
  is_packed: boolean;
  is_loaded: boolean;
  is_delivered: boolean;
  packed_at?: Date;
  loaded_at?: Date;
  delivered_at?: Date;
  created_at: Date;
  updated_at: Date;
  destination_room_name?: string;
}

export interface CreateBoxData {
  label: string;
  destination_room_id?: string;
  box_type?: string;
  notes?: string;
}

export interface UpdateBoxData {
  label?: string;
  destination_room_id?: string;
  box_type?: string;
  notes?: string;
  is_packed?: boolean;
  is_loaded?: boolean;
  is_delivered?: boolean;
}

export interface BoxFilters {
  box_type?: string;
  is_packed?: boolean;
  is_loaded?: boolean;
  is_delivered?: boolean;
  destination_room_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Expense types
export interface Expense {
  id: string;
  moveId: string;
  category: string;
  amount: number;
  description?: string;
  expenseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseRequest {
  category: string;
  amount: number;
  description?: string;
  expenseDate: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
