import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { Logger } from 'nestjs-pino';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @Get('me')
  @ApiOkResponse({
    description: 'Get the authenticated user',
    type: UserResponseDto,
    example: {
      id: '12345',
      email: 'email@email.com',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  findOne(@Req() req: Request) {
    const user = req.user;

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Get('')
  @ApiOkResponse({
    description: 'Get the authenticated user',
    type: UserResponseDto,
    example: [
      {
        id: '12345',

        email: 'email@email.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '12',
        email: 'email2@email.com',
        username: 'testuser2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })
  findAll() {
    return this.usersService.findAll();
  }
}
