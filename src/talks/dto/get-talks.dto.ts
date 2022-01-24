import {
  IsEnum,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetTalksDto {
  @ApiProperty({
    example: '개발',
    description: '자유게시판 카테고리',
    required: false,
    type: 'string',
    enum: ['개발', '데이터', '디자인', '기타'],
  })
  @IsEnum(['개발', '데이터', '디자인', '기타'])
  @IsString()
  @IsOptional()
  category?: '개발' | '데이터' | '디자인' | '기타';

  @ApiProperty({
    example: 10,
    description: '한 번에 가져오는 개수',
    required: true,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
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
  @Transform(({ value }) => parseInt(value))
  page: number;
}
