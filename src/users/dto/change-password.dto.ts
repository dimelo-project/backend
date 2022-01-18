import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  NotEquals,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Dimelo12345',
    description: '사용자 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Dimelo54321',
    description: '사용자 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: '비밀번호는 12자 이상 입력해주세요',
  })
  @Matches(/(?=.*[0-9])(?=.*[a-z])/, {
    message: '비밀번호는 영문, 숫자를 포함한 8자리 이상 입력해주세요',
  })
  newPassword: string;

  @ApiProperty({
    example: 'Dimelo54321',
    description: '사용자 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;
}
