import { ChangePasswordDto } from './change-password.dto';
import { PickType } from '@nestjs/swagger';

export class DeleteUserDto extends PickType(ChangePasswordDto, [
  'password',
] as const) {}
