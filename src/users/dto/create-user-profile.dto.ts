import { CheckNicknameDto } from './check-nickname.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserProfileDto extends PickType(CheckNicknameDto, [
  'nickname',
] as const) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '백엔드 개발자',
    description: '사용자 직무',
    required: true,
  })
  job: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1년차 이하',
    description: '사용자 경력',
    required: true,
  })
  career: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: '프로필 사진을 올릴 때 file로 들어가는 key',
  })
  @IsOptional()
  image: any;
}
