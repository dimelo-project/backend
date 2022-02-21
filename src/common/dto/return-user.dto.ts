import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnUserDto {
  @ApiProperty({
    example: 1,
    description: 'user id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'vltndus95@gmail.com',
    description: '사용자 이메일',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'Avery',
    description: '사용자 닉네임',
  })
  @Expose()
  nickname: string | null;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/77389332?v=4',
    description: '사용자 프로필 사진',
  })
  @Expose()
  imageUrl: string | null;

  @ApiProperty({
    example: '백엔드 개발자',
    description: '사용자 직무',
  })
  @Expose()
  job: string | null;

  @ApiProperty({
    example: '1년차 이하',
    description: '사용자 경력',
  })
  @Expose()
  career: string | null;
}
