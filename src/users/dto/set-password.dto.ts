import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SetPasswordDto {
  @ApiProperty({
    example: 'Dimelo54321',
    description: '사용자 비밀번호',
  })
  @IsString()
  @Transform((params) => params.value.trim())
  @IsNotEmpty()
  @MinLength(8, {
    message: '비밀번호는 8자 이상 입력해주세요',
  })
  @Matches(/(?=.*[0-9])(?=.*[a-z])/, {
    message: '비밀번호는 영문, 숫자를 포함한 8자리 이상 입력해주세요',
  })
  newPassword: string;

  @ApiProperty({
    example: 'Dimelo54321',
    description: '사용자 비밀번호',
  })
  @IsString()
  @Transform((params) => params.value.trim())
  @IsNotEmpty()
  passwordConfirm: string;
}
