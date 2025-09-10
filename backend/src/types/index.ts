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

// Item types
export interface Item {
  id: string;
  moveId: string;
  roomId?: string;
  boxId?: string;
  name: string;
  description?: string;
  photoUrl?: string;
  estimatedValue?: number;
  properties?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  roomId?: string;
  estimatedValue?: number;
  properties?: Record<string, any>;
}

// Room types
export interface Room {
  id: string;
  moveId: string;
  name: string;
  createdAt: Date;
}

export interface CreateRoomRequest {
  name: string;
}

// Box types
export interface Box {
  id: string;
  moveId: string;
  label: string;
  qrCode: string;
  destinationRoomId?: string;
  createdAt: Date;
}

export interface CreateBoxRequest {
  label: string;
  destinationRoomId?: string;
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
