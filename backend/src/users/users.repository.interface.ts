import { User } from '@prisma/client';

export const UsersRepositorySymbol = Symbol('USERS_REPOSITORY');

export interface IUsersRepository {
  findByEmail(email: string, includePassword?: boolean): Promise<User | null>;
  findById(userId: number, includePassword?: boolean): Promise<User | null>;
  findAll(): Promise<User[] | null>;
  create(email: string, password: string, username: string): Promise<User>;
}
