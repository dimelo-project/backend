import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

export class CreateUserDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
