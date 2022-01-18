import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';
import { Transform } from 'class-transformer';

export class CheckNicknameDto {
  @ApiProperty({
    example: 'Avery',
    description: '사용자 닉네임',
    required: true,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(10, {
    message: '닉네임은 10자 이하로 설정해주세요',
  })
  nickname: string;
}
