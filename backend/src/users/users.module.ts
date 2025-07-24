import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerModule } from 'nestjs-pino';
import { PrismaService } from 'src/database/prisma.service';
import { UsersRepository } from './users.repository';
import { UsersRepositorySymbol } from './users.repository.interface';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';

@Module({
  imports: [LoggerModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: UsersRepositorySymbol,
      useClass: UsersRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
