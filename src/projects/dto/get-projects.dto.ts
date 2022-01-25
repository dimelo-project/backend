import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class GetProjectsDto {
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
  ongoing: '모집중' | '모집완료';

  @ApiProperty({
    example: '프론트엔드',
    description:
      '프로젝트 포지션 (복수 가능: 복수 데이터 보낼 때 ","로 나눠서 보냄)',
    required: false,
  })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsString({ each: true })
  @Type(() => String)
  @IsArray()
  @IsOptional()
  positions?: string[] | null;

  @ApiProperty({
    example: 'JavaScript,CSS',
    type: 'string',
    description:
      '프로젝트에 필요한 기술 (복수 가능: 복수 데이터 보낼 때 ","로 나눠서 보냄)',
    required: false,
  })
  @IsArray()
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  skills: string[] | null;

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
