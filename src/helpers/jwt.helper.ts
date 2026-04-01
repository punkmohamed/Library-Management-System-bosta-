import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

interface TokenPayload {
  id: string;
  email: string;
}

export class JwtHelper {
  private static readonly secret: string = config.jwtSecret;
  private static readonly refreshSecret: string = config.jwtRefreshSecret;
  private static readonly expiresIn: string = config.jwtExpiresIn;
  private static readonly refreshExpiresIn: string = config.jwtRefreshExpiresIn;

  static generateAccessToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresIn,
      jwtid: uuidv4(),
    } as jwt.SignOptions;
    return jwt.sign(payload, this.secret, options);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: this.refreshExpiresIn,
      jwtid: uuidv4(),
    } as jwt.SignOptions;
    return jwt.sign(payload, this.refreshSecret, options);
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return decoded;
    } catch (error: any) {
      console.error('JWT Verification Error:', error.message);
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token has expired');
      }
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}
