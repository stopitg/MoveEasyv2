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
