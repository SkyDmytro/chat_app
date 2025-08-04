import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [],
  providers: [MessagesService, MessagesRepository, PrismaService],
  exports: [MessagesService],
})
export class MessagesModule {}
