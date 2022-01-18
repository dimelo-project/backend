import { CreateUserProfileDto } from './create-user-profile.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PickType(CreateUserProfileDto, [
  'nickname',
  'job',
  'career',
] as const) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '안녕하세요!',
    description: '자기소개',
    required: false,
  })
  introduction: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'https://dimelo-project.s3.ap-northeast-2.amazonaws.com/1642083598538-psy%20%281%29.png',
    description: '사용자 프로필 사진 / 사진을 지울 떄는 값이 null로 들어감',
    required: false,
  })
  imageUrl: string | null;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: '프로필 사진을 올릴 때 file로 들어가는 key',
  })
  @IsOptional()
  image: any;
}
