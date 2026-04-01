import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from '../helpers';
import { UnauthorizedError } from '../helpers/error.helper';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      token = req.cookies?.access_token;
    }

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = JwtHelper.verifyAccessToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
