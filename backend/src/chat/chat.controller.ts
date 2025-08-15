import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat, Message } from '@prisma/client';
import { CreateChatDto } from './dto/createChat.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  createChat(
    @Req() req: Request,
    @Body() createChatDto: CreateChatDto,
  ): Promise<Chat> {
    const user = req.user;

    if (!user) throw new NotFoundException('User not found');
    return this.chatService.create(createChatDto);
  }

  @Get('users')
  findByUsersId(@Req() req: Request): Promise<Chat[] | null> {
    const user = req.user;

    if (!user) throw new NotFoundException('User not found');

    return this.chatService.findByUserId(user.id);
  }

  @Get('messages/:chatId')
  getMessagesByChatId(
    @Param('chatId') id: number,
    @Req() req: Request,
  ): Promise<Message[]> {
    const user = req.user;
    return this.chatService.getMessagesByChatId(id, user);
  }

  @Get(':id')
  findById(@Param('id') id: number, @Req() req: Request): Promise<Chat | null> {
    const user = req.user;

    return this.chatService.findById(id, user.id);
  }

  @Post(':id/mark-all-as-read')
  markAllMessagesAsRead(
    @Param('id') chatId: number,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user;

    return this.chatService.readAllMessages(chatId, user.id);
  }
}
