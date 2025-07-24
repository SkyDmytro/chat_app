import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/User.entity';

export class UserResponseDto extends OmitType(UserEntity, ['password_hash']) {}
