import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { User, CreateUserRequest, LoginRequest, AuthResponse, JwtPayload } from '../types';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const [user] = await db('users')
      .insert({
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName
      })
      .returning(['id', 'email', 'first_name', 'last_name', 'created_at', 'updated_at']);

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  static async loginUser(loginData: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user
    const user = await db('users').where('email', email).first();
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      token
    };
  }

  static async getUserById(userId: string): Promise<User | null> {
    const user = await db('users')
      .select(['id', 'email', 'first_name', 'last_name', 'created_at', 'updated_at'])
      .where('id', userId)
      .first();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  static async updateUser(userId: string, updateData: Partial<CreateUserRequest>): Promise<User> {
    const updateFields: any = {};
    
    if (updateData.firstName) updateFields.first_name = updateData.firstName;
    if (updateData.lastName) updateFields.last_name = updateData.lastName;
    if (updateData.email) updateFields.email = updateData.email;
    
    if (updateData.password) {
      updateFields.password = await this.hashPassword(updateData.password);
    }

    const [user] = await db('users')
      .where('id', userId)
      .update(updateFields)
      .returning(['id', 'email', 'first_name', 'last_name', 'created_at', 'updated_at']);

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}
