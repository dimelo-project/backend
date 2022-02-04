import { ChangePasswordDto } from './change-password.dto';
import { PickType } from '@nestjs/swagger';
export class CheckPasswordDto extends PickType(ChangePasswordDto, [
  'password',
] as const) {}
