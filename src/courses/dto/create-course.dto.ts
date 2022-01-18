import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: '스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술',
    description: '강의 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '인프런',
    description: '강의가 있는 플랫폼',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  platform: string;

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
    description:
      '강의 카테고리 (복수 가능: 복수 데이터 보낼때 ","로 나눠 보냄)',
    required: true,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsNotEmpty()
  categories: string[];

  @ApiProperty({
    example: 99000,
    description: '강의 가격',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example:
      'https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1',
    description: '강의 주소',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  siteUrl: string;

  @ApiProperty({
    example: 'Spring',
    description:
      '강의에서 가르치는 기술 (복수 가능: 복수 데이터 보낼 때 ","로 나눠서 보냄)',
    required: true,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsNotEmpty()
  skills: string[];

  @ApiProperty({
    example: '김영한',
    description: '강의를 가르치는 강사',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  instructor: string;
}
