import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      file?: Express.Multer.File;
      files?: {
        [fieldname: string]: Express.Multer.File[];
      } | Express.Multer.File[];
    }

    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination?: string;
        filename?: string;
        path?: string;
        buffer?: Buffer;
        key?: string;
        location?: string;
      }
    }
  }
}
