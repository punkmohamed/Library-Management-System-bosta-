import { Request, Response, NextFunction } from 'express';
import { User, Session, sequelize } from '../models';
import { JwtHelper, ResponseHelper, PasswordHelper, Logger } from '../helpers';
import { AppError } from '../helpers/error.helper';

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();
    try {
      const { email, full_name, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Hash password
      const hashedPassword = await PasswordHelper.hash(password);

      // Create user
      const user = await User.create(
        {
          email,
          full_name,
          password: hashedPassword,
        },
        { transaction }
      );

      await transaction.commit();

      return ResponseHelper.success(
        res,
        {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
        'User registered successfully',
        201
      );
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * Login user and generate tokens
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user || !user.password) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check password
      const isPasswordValid = await PasswordHelper.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Generate tokens
      const payload = { id: user.id, email: user.email };
      const accessToken = JwtHelper.generateAccessToken(payload);
      const refreshToken = JwtHelper.generateRefreshToken(payload);

      // Store session
      await Session.create({
        user_id: user.id,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      });

      return ResponseHelper.success(
        res,
        {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        'Login successful'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        throw new AppError('Refresh token is required', 400);
      }

      // Verify refresh token
      const payload = JwtHelper.verifyRefreshToken(refresh_token);
      
      // Check session in DB
      const session = await Session.findOne({
        where: {
          user_id: payload.id,
          refresh_token,
        }
      });

      if (!session) {
        throw new AppError('Invalid refresh token session', 401);
      }

      // Check expiration
      if (session.expires_at && session.expires_at < new Date()) {
        await session.destroy();
        throw new AppError('Refresh token expired', 401);
      }

      // Generate new tokens
      const newPayload = { id: payload.id, email: payload.email };
      const newAccessToken = JwtHelper.generateAccessToken(newPayload);
      const newRefreshToken = JwtHelper.generateRefreshToken(newPayload);

      // Update session with new refresh token
      session.refresh_token = newRefreshToken;
      await session.save();

      return ResponseHelper.success(
        res,
        {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        },
        'Token refreshed successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all borrowers (users)
   */
  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'email', 'full_name', 'created_at'],
      });
      if(users.length === 0) {
        throw new AppError('No users found', 404);
      }
      return ResponseHelper.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user details
   */
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { email, full_name } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
          throw new AppError('Email already in use', 409);
        }
      }

      await user.update({ email, full_name });

      return ResponseHelper.success(
        res,
        {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
        'User details updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a user
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();
    try {
      const id = req.params.id as string;
      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await user.destroy({ transaction });
      await Session.destroy({ where: { user_id: id }, transaction })

      await transaction.commit();

      return ResponseHelper.success(res, null, 'User deleted successfully');
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}
