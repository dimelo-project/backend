import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10, {
    message: '닉네임은 10자 이하로 설정해주세요',
  })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  job: string;

  @IsNotEmpty()
  @IsString()
  career: string;
}
