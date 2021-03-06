import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetReviewsByCourseDto {
  @ApiProperty({
    example: 10,
    description: '한 번에 가져오는 개수',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  perPage: number;

  @ApiProperty({
    example: 1,
    description: '페이지',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @ApiProperty({
    example: 'avg',
    description: '필터링하는 조건 (help: 추천순, date: 최신순, avg: 평점순)',
    required: true,
    type: 'string',
    enum: ['help', 'avg', 'date'],
  })
  @IsEnum(['help', 'avg', 'date'])
  @IsString()
  sort: 'help' | 'avg' | 'date';

  @ApiProperty({
    example: 'DESC',
    description: '데이터 정렬순서 (ASC: 오름차순, DESC: 내림차순)',
    required: true,
    type: 'string',
    enum: ['ASC', 'DESC'],
  })
  @IsEnum(['ASC', 'DESC'])
  @IsString()
  order: 'ASC' | 'DESC';
}
