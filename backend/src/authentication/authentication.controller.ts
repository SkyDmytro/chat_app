import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request } from 'express';
import { UserWithoutPassword } from './types/userWithoutPassword';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    description: 'User successfully logged in',
    example: {
      accessToken: 'access-token',
    },
  })
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user! as UserWithoutPassword;
    return this.authService.login(user);
  }
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: UserResponseDto,
    example: {
      id: '12345',
      email: 'email@email.com',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }
}
