import { Users } from '../../entities/Users';
import { PickType } from '@nestjs/swagger';

export class ReturnUserDto extends PickType(Users, [
  'id',
  'email',
  'nickname',
] as const) {}
