import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Users } from 'src/entities/Users';

export class CreateUserProfileDto extends PickType(Users, [
  'nickname',
  'job',
  'career',
]) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: '프로필 사진을 올릴 때 file로 들어가는 key',
  })
  @IsOptional()
  image: any;
}
