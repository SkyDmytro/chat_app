import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { Logger } from 'nestjs-pino';
import { UserWithoutPassword } from './types/userWithoutPassword';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const isPasswordIncluded = true;
    const user = await this.usersService.findByEmail(email, isPasswordIncluded);
    if (!user) {
      return null;
    }
    const pass = this.hashingService.verify(password, user.password_hash);
    if (pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }
  login(user: UserWithoutPassword) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(registerUserDto: RegisterUserDto) {
    try {
      const { email, password, username } = registerUserDto;

      const existingUser = await this.usersService.findByEmail(email);

      if (existingUser)
        throw new ConflictException('User with such email already exists');

      const hashedPassword = this.hashingService.hash(password);

      const createdUser = await this.usersService.create(
        email,
        hashedPassword,
        username,
      );

      if (!createdUser)
        throw new BadRequestException('Error while creating user', {});

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userData } = createdUser;

      return userData;
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error while creating user' }, data: null };
    }
  }
}
