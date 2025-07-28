import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatsRepositorySymbol } from './chat.repository.interface';
import { ChatRepository } from './chat.repository';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [
    ChatService,
    {
      provide: ChatsRepositorySymbol,
      useClass: ChatRepository,
    },
    PrismaService,
  ],
  imports: [UsersModule],
  controllers: [ChatController],
})
export class ChatModule {}
