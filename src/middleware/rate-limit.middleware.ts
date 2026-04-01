import rateLimit from 'express-rate-limit';
import { ResponseHelper } from '../helpers/response.helper';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  handler: (req, res) => {
    return ResponseHelper.error(
      res,
      'Too many login attempts. Please try again after 15 minutes.',
      undefined,
      429
    );
  },
});


export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ResponseHelper.error(
      res,
      'Too many registration attempts from this IP. Please try again after an hour.',
      undefined,
      429
    );
  },
});


export const checkoutRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 checkout requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ResponseHelper.error(
      res,
      'Too many checkout attempts. Please wait before borrowing more books.',
      undefined,
      429
    );
  },
});

