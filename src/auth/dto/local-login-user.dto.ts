import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LocalLoginUserDto {
  @ApiProperty({
    example: 'vltndus95@gmail.com',
    description: '사용자 이메일',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Dimelo12345',
    description: '사용자 비밀번호',
    required: true,
  })
  password: string;
}
