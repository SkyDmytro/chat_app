import { PrismaService } from 'src/database/prisma.service';
import { IUsersRepository } from './users.repository.interface';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(
    email: string,
    includePassword: boolean,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      omit: { password_hash: !includePassword },
    });
  }

  async create(
    email: string,
    passwordHash: string,
    username: string,
  ): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email,
        password_hash: passwordHash,
        username,
      },
    });
  }
}
