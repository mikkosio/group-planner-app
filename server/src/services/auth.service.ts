import bcrypt from "bcrypt";
import jwt, {Secret} from "jsonwebtoken";
import prisma from "../config/database";
import {AppError} from '../middlewares/errorHandler';

const SALT_ROUNDS = 10;

export class AuthService {
  /**
   * Hash a plain text password
   * @param password Plain text password
   * @return Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare plain text password with hashed password (Login)
   * @param password Plain text password
   * @param hashedPassword Hashed password
   * @return True if passwords match, false otherwise
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate JWT token
   * @param userId User ID to include in the token payload
   * @return JWT token string
   */
  generateToken(userId: string): string {
    const secret: Secret = process.env.JWT_SECRET as Secret;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    if (!secret) {
      throw new AppError('JWT_SECRET is not defined in environment variables', 500);
    }

    // todo use the expiresIn variable, jwt.sign gives error when used
    return jwt.sign({ userId }, secret, {
      expiresIn: "7d",
    });
  }

  /**
   * Verify JWT token
   * @param token JWT token string
   * @return Decoded token payload
   */
  verifyToken(token: string): { userId: string } {
    if (!process.env.JWT_SECRET) {
        throw new AppError('JWT_SECRET is not defined in environment variables', 500);
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET) as {
          userId: string;
      };
    } catch (error) {
        throw new AppError('Invalid or expired token', 401);
    }
  }

  /**
   * Register a new user
   * @param email User's email
   * @param password User's password
   * @param name User's name (optional)
   * @return Created user and JWT token
   */
  async register(email: string, password: string, name?: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        // Don't return password
      },
    });

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user,
      token,
    };
  }

    /**
     * Login an existing user
     */
    async login(email: string, password: string) {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Compare password
        const isPasswordValid = await this.comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate token
        const token = this.generateToken(user.id);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token,
        };
    }

    /**
     * Update user profile
     * @params userId ID of the user to update
     * @params data Object containing fields to update (name and/or avatar)
     *
     * @returns Updated user object without password
     */
    async updateProfile(
        userId: string,
        data: { name?: string; avatar?: string }
    ) {
        // Update user and return updated user without password
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.avatar !== undefined && { avatar: data.avatar }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return updatedUser;
    }
}

export default new AuthService();
