import { CreateUserProfileDto } from './create-user-profile.dto';
import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PickType(CreateUserProfileDto, [
  'nickname',
  'job',
  'career',
] as const) {
  @IsString()
  imageUrl: string | null;

  @IsString()
  introduction: string;
}
