import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, User, Move, CreateUserRequest, LoginRequest, CreateMoveRequest } from '../types';

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
}

export const apiService = new ApiService();
