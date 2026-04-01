import { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers/error.helper';
import { Logger } from '../helpers/logger.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { config } from '../config';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    Logger.error(`AppError: ${err.message}`, { statusCode: err.statusCode });
    ResponseHelper.error(res, err.message, undefined, err.statusCode);
    return;
  }

  if (err.name === 'SequelizeValidationError') {
    const validationErrors: Record<string, string[]> = {};
    (err as any).errors.forEach((error: any) => {
      if (!validationErrors[error.path]) {
        validationErrors[error.path] = [];
      }
      validationErrors[error.path].push(error.message);
    });
    Logger.error('Validation Error', validationErrors);
    ResponseHelper.error(res, 'Validation failed', validationErrors, 400);
    return;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    Logger.error('Unique Constraint Error', err.message);
    ResponseHelper.error(res, 'Resource already exists', undefined, 409);
    return;
  }

  if (
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError' ||
    err.message === 'Invalid access token' ||
    err.message === 'Access token has expired'
  ) {
    Logger.error('JWT Error', err.message);

    ResponseHelper.error(res, 'Please login again', undefined, 401);
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    Logger.error('JSON Parse Error', err.message);
    ResponseHelper.error(res, 'Invalid JSON format. Please check your request body.', undefined, 400);
    return;
  }

  if (err.message && err.message.includes('CORS')) {
    Logger.error('CORS Error', err.message);
    ResponseHelper.error(
      res,
      'CORS policy violation',
      req.headers.origin ? [req.headers.origin] : [],
      403
    );
    return;
  }

  // Stripe API errors (invalid params, etc.) - return 400 with Stripe's message
  const stripeErr = err as { type?: string; code?: string; param?: string; message?: string };
  if (stripeErr.type === 'StripeInvalidRequestError') {
    Logger.error('Stripe API Error', { message: stripeErr.message, param: stripeErr.param });
    ResponseHelper.error(res, stripeErr.message || 'Stripe request failed', undefined, 400);
    return;
  }

  // Sequelize database errors (missing table, connection, etc.) - log full details
  const seqErr = err as { name?: string; parent?: { code?: string }; message?: string };
  if (
    seqErr.name === 'SequelizeDatabaseError' ||
    seqErr.name === 'SequelizeConnectionError'
  ) {
    Logger.error('Database Error', {
      message: err.message,
      code: seqErr.parent?.code,
      stack: err.stack,
    });
    const debugMessage =
      process.env.ERROR_DEBUG === 'true' || config.nodeEnv === 'development'
        ? `Database Error: ${err.message}`
        : 'Internal server error';
    ResponseHelper.serverError(res, debugMessage);
    return;
  }

  // Log full error details for debugging (check Render logs)
  Logger.error('Unhandled Error', {
    message: err.message,
    name: err.name,
    stack: err.stack,
    path: (req as any).originalUrl || req.path,
    method: req.method,
  });

  // Optional: expose error in response when ERROR_DEBUG=true (for production debugging)
  const debugMessage =
    process.env.ERROR_DEBUG === 'true' || config.nodeEnv === 'development'
      ? `${err.name}: ${err.message}`
      : 'Internal server error';
  ResponseHelper.serverError(res, debugMessage);
};
