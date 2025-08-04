import { User } from '@prisma/client';

export interface IUsersService {
  findByEmail(email: string, includePassword?: boolean): Promise<User | null>;
  create(email, password: string, username: string): Promise<User>;
  findAll(includePassword?: boolean): Promise<User[] | null>;
}
