import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class GetReviewByCourseSortDto {
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

  @ApiProperty({
    example: 'avg',
    description: '필터링하는 조건 (help: 추천순, avg: 평점순)',
    required: true,
  })
  @IsEnum(['help', 'avg'])
  @IsString()
  sort: 'help' | 'avg';

  @ApiProperty({
    example: 'DESC',
    description: '데이터 정렬순서 (ASC: 오름차순, DESC: 내림차순)',
    required: true,
  })
  @IsEnum(['ASC', 'DESC'])
  @IsString()
  order: 'ASC' | 'DESC';
}
