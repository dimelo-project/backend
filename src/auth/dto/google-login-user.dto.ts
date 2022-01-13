import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Users } from '../../entities/Users';

export class GoogleLoginUserDto extends PickType(Users, ['email', 'imageUrl']) {
  @IsNotEmpty()
  googleId: number;
}
