import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: 'email@email.com',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 8,
    type: String,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The username of the user',
    example: 'testuser',
    type: String,
  })
  username: string;
}
