import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';

export class CheckEmailDto extends PickType(CreateUserDto, [
  'email',
] as const) {}
