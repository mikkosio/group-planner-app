import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import prisma from "../config/database";
// import { AppError } from '../middlewares/errorHandler';
// todo add custom error handling

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
      throw new Error("JWT_SECRET is not defined in environment variables");
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
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
      };
      return decoded;
    } catch (error) {
      //   throw new AppError('Invalid or expired token', 401);
      throw new Error("Invalid or expired token");
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
      // throw new AppError('User with this email already exists', 400);
      throw new Error("User with this email already exists");
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
}

export default new AuthService();
