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
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @Get('me')
  findOne(@Req() req: Request) {
    const user = req.user;

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
