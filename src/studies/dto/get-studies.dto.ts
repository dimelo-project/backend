import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class GetStudiesDto {
  @ApiProperty({
    example: 'JavaScript',
    type: 'string',
    description:
      '필터링 할 기술 (복수 가능: 복수 데이터 보낼 때 ","로 나눠서 보냄)',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  skills?: string;

  @ApiProperty({
    example: '모집중',
    description: '모집중/모집완료',
    required: false,
    type: 'string',
    enum: ['모집중', '모집완료'],
  })
  @IsOptional()
  @IsString()
  @IsEnum(['모집중', '모집완료'])
  ongoing?: '모집중' | '모집완료';

  @ApiProperty({
    example: 10,
    description: '한 번에 가져오는 개수',
    required: true,
    type: 'number',
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
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  page: number;
}
