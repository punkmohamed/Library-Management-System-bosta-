import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ResponseHelper, ValidationHelper } from '../helpers';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = ValidationHelper.formatErrors(errors.array());
    ResponseHelper.error(res, 'Validation failed', formattedErrors, 400);
    return;
  }
  next();
};


export const cleanEmptyFields = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    const cleanedBody: any = {};
    
    for (const [key, value] of Object.entries(req.body)) {

      if (value === '' || (typeof value === 'string' && value.trim() === '')) {
        continue;
      }

      cleanedBody[key] = value;
    }
    
    req.body = cleanedBody;
  }
  next();
};
