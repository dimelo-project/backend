import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';
import { Users } from '../../entities/Users';

export class UpdateUserDto extends PickType(Users, [
  'nickname',
  'job',
  'career',
  'imageUrl',
  'introduction',
] as const) {}
