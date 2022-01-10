import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Users } from '../../entities/Users';

export class LoginUserDto extends PickType(Users, ['email'] as const) {
  @IsNotEmpty()
  password: string;
}
