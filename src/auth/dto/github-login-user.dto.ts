import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Users } from '../../entities/Users';

export class GithubLoginUserDto extends PickType(Users, ['email', 'imageUrl']) {
  @IsNotEmpty()
  githubId: number;
}
