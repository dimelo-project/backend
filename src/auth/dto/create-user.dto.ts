import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Users } from '../../entities/Users';

export class CreateUserDto extends PickType(Users, ['email'] as const) {
  @ApiProperty({
    example: 'Dimelo12345',
    description: '사용자 비밀번호',
  })
  @IsNotEmpty()
  @MinLength(8, {
    message: '비밀번호는 8자 이상 입력해주세요',
  })
  @Matches(/(?=.*[0-9])(?=.*[a-z])/, {
    message: '비밀번호는 영문, 숫자를 포함한 8자리 이상 입력해주세요',
  })
  password: string;
}
