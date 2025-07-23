import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerModule } from 'nestjs-pino';
import { PrismaService } from 'src/database/prisma.service';
import { UsersRepository } from './users.repository';
import { UsersRepositorySymbol } from './users.repository.interface';

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
  ],
  exports: [UsersService],
})
export class UsersModule {}
