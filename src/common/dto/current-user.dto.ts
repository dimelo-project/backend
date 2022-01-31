import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Users } from '../../entities/Users';

export class CurrentUserDto {
  @ApiProperty({
    example: 1,
    description: 'user id',
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'vltndus95@gmail.com',
    description: '사용자 이메일',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Avery',
    description: '사용자 닉네임',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/77389332?v=4',
    description: '사용자 프로필 사진',
  })
  @IsString()
  imageUrl: string;
}
