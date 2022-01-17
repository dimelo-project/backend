import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchCoursesDto {
  @IsString()
  @IsNotEmpty()
  @Transform((params) => params.value.trim())
  keyword: string;
}
