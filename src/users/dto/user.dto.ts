import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

export class UserDto extends PickType(Users, [
  'id',
  'email',
  'nickname',
] as const) {}