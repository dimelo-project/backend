import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsEnum(['개발', '데이터 과학', '디자인'])
  @IsNotEmpty()
  categoryBig: '개발' | '데이터 과학' | '디자인';

  @IsArray()
  @IsNotEmpty()
  categories: string[];

  @IsString()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  siteUrl: string;

  @IsArray()
  @IsNotEmpty()
  skills: string[];

  @IsString()
  @IsNotEmpty()
  instructor: string;
}
