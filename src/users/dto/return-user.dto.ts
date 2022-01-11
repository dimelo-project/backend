import { Expose } from 'class-transformer';

export class ReturnUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  imageUrl: string;

  @Expose()
  job: string;

  @Expose()
  career: string;

  @Expose()
  introduction: string;
}
