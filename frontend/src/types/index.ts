// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
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
  user: User;
  token: string;
}

// Move types
export interface Move {
  id: string;
  userId: string;
  startLocation: Location;
  endLocation: Location;
  moveDate: string;
  status: MoveStatus;
  householdSize?: number;
  inventorySizeEstimate?: string;
  createdAt: string;
  updatedAt: string;
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
  dueDate?: string;
  status: TaskStatus;
  category: string;
  priority: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
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

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  completionRate: number;
}

// Room types
export interface Room {
  id: string;
  move_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
}

export interface UpdateRoomRequest {
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
  created_at: string;
  updated_at: string;
  room_name?: string;
  box_label?: string;
}

export interface CreateItemRequest {
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

export interface UpdateItemRequest {
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
  packed_at?: string;
  loaded_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  destination_room_name?: string;
}

export interface CreateBoxRequest {
  label: string;
  destination_room_id?: string;
  box_type?: string;
  notes?: string;
}

export interface UpdateBoxRequest {
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

// Inventory Statistics
export interface ItemStats {
  total_items: number;
  packed_items: number;
  fragile_items: number;
  special_handling_items: number;
  total_value: number;
  average_value: number;
}

export interface BoxStats {
  total_boxes: number;
  packed_boxes: number;
  loaded_boxes: number;
  delivered_boxes: number;
}

export interface RoomStats {
  id: string;
  name: string;
  item_count: number;
  packed_items: number;
  total_value: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: CreateUserRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
