import {
  Equals,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  NotEquals,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @NotEquals('password')
  @MinLength(12, {
    message: '비밀번호는 12자 이상 입력해주세요',
  })
  @Matches(/(?=.*[0-9])(?=.*[a-z])/, {
    message: '비밀번호는 영문, 숫자를 포함한 12자리 이상 입력해주세요',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Equals('newPassword')
  checkPassword: string;
}
