import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request } from 'express';
import { UserWithoutPassword } from './types/userWithoutPassword';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user! as UserWithoutPassword;
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }
}
