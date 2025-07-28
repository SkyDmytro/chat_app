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
import { Chat } from '@prisma/client';
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
  createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.create(createChatDto);
  }

  @Get('users')
  findByUsersId(@Req() req: Request): Promise<Chat[] | null> {
    const user = req.user;

    if (!user) throw new NotFoundException('User not found');

    try {
      return this.chatService.findByUserId(user.id);
    } catch (error) {
      console.error('Error finding chats for user:', error);
      throw new NotFoundException('Chats not found for user');
    }
  }
  @Get(':id')
  findById(@Param('id') id: number): Promise<Chat | null> {
    return this.chatService.findById(id);
  }
}
