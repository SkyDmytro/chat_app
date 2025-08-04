import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatsRepositorySymbol } from './chat.repository.interface';
import { ChatRepository } from './chat.repository';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/database/prisma.service';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  providers: [
    ChatService,
    {
      provide: ChatsRepositorySymbol,
      useClass: ChatRepository,
    },
    PrismaService,
  ],
  imports: [UsersModule, MessagesModule],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
