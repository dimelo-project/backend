import { ChangePasswordDto } from './change-password.dto';
import { PickType } from '@nestjs/swagger';
export class SetPasswordDto extends PickType(ChangePasswordDto, [
  'newPassword',
  'passwordConfirm',
]) {}
