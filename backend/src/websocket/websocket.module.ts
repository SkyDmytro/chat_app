import { Module } from '@nestjs/common';
import { ChatGateway } from './websocket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';
import { MessagesModule } from 'src/messages/messages.module';
import { WebSocketService } from './websocket.service';

@Module({
  imports: [JwtModule, UsersModule, ChatModule, MessagesModule],
  providers: [ChatGateway, WebSocketService],
})
export class WebsocketModule {}
