import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { CreateUserRequest, LoginRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const userData: CreateUserRequest = req.body;
      const user = await AuthService.createUser(userData);
      
      return res.status(201).json({
        success: true,
        data: user,
        message: 'User registered successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const loginData: LoginRequest = req.body;
      const result = await AuthService.loginUser(loginData);
      
      return res.json({
        success: true,
        data: result,
        message: 'Login successful'
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const user = await AuthService.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const updateData = req.body;
      const user = await AuthService.updateUser(userId, updateData);

      return res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed'
      });
    }
  }
}