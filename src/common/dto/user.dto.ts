import { Users } from './../../entities/Users';
import { PickType } from '@nestjs/swagger';

export class UserDto extends PickType(Users, [
  'id',
  'email',
  'nickname',
] as const) {}
