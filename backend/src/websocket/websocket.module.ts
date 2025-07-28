import { Module } from '@nestjs/common';
import { ChatGateway } from './websocket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule, UsersModule],
  providers: [ChatGateway],
})
export class WebsocketModule {}
