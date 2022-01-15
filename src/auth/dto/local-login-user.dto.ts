import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Users } from '../../entities/Users';

export class LocalLoginUserDto extends PickType(Users, ['email'] as const) {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Dimelo12345',
    description: '사용자 비밀번호',
  })
  password: string;
}
