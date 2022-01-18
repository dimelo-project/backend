import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetCoursesDto {
  @ApiProperty({
    example: '개발',
    description: '강의 큰 카테고리: 개발, 데이터 과학, 디자인 중 하나',
    required: true,
  })
  @IsEnum(['개발', '데이터 과학', '디자인'])
  @IsNotEmpty()
  categoryBig: '개발' | '데이터 과학' | '디자인';

  @ApiProperty({
    example: '웹개발',
    description: '강의 카테고리',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'Vue.js',
    description: '강의에서 가르치는 기술',
    required: false,
  })
  @IsOptional()
  @IsString()
  skill: string;

  @ApiProperty({
    example: 10,
    description: '한 번에 가져오는 개수',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  perPage: number;

  @ApiProperty({
    example: 1,
    description: '페이지',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number;
}
