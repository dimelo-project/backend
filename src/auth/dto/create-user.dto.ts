import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'vltndus95@gmail.com',
    description: '사용자 이메일',
    required: true,
  })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEmail()
  @Matches(
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
    {
      message: '이메일 형식이 올바르지 않습니다',
    },
  )
  email: string;

  @ApiProperty({
    example: 'Dimelo12345',
    description: '사용자 비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @MinLength(8, {
    message: '비밀번호는 8자 이상 입력해주세요',
  })
  @Matches(/(?=.*[0-9])(?=.*[a-z])/, {
    message: '비밀번호는 영문, 숫자를 포함한 8자리 이상 입력해주세요',
  })
  password: string;

  @ApiProperty({
    example: 'Dimelo54321',
    description: '사용자 비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  passwordConfirm: string;
}
