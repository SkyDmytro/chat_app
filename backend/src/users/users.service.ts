import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './users.service.interface';
import {
  IUsersRepository,
  UsersRepositorySymbol,
} from './users.repository.interface';
import { User } from '@prisma/client';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(UsersRepositorySymbol)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async findById(userId: number): Promise<User | null> {
    return this.usersRepository.findById(userId);
  }

  async findByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<User | null> {
    return this.usersRepository.findByEmail(email, includePassword);
  }

  async create(
    email: string,
    passwordHash: string,
    username: string,
  ): Promise<User> {
    return this.usersRepository.create(email, passwordHash, username);
  }

  findAll(): Promise<User[] | null> {
    return this.usersRepository.findAll();
  }
}
