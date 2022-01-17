import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetCoursesDto {
  @IsEnum(['개발', '데이터 과학', '디자인'])
  @IsNotEmpty()
  categoryBig: '개발' | '데이터 과학' | '디자인';

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  skills: string[];

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  perPage: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number;
}
