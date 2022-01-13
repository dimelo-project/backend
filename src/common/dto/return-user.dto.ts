import { Expose } from 'class-transformer';

export class ReturnUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  nickname: string | null;

  @Expose()
  imageUrl: string | null;

  @Expose()
  job: string | null;

  @Expose()
  career: string | null;

  @Expose()
  introduction: string | null;
}
