import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Users } from '../../entities/Users';

export class CreateUserDto extends PickType(Users, ['email'] as const) {
  @IsNotEmpty()
  @MinLength(12, {
    message: '비밀번호는 12자 이상 입력해주세요'
  })
  @Matches(/(?=.*[0-9])(?=.*[a-z])/, {
    message: '비밀번호는 영문, 숫자를 포함한 12자리 이상 입력해주세요',
  })
  password: string;
}
