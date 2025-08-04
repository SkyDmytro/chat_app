import { Request } from 'express';
import { UserWithoutPassword } from 'src/authentication/types/userWithoutPassword';

declare module 'express' {
  interface Request {
    user?: UserWithoutPassword;
  }
}
