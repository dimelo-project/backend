import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateProjectDto {
  @ApiProperty({
    example: 'dimelo프로젝트 하실 개발자 구합니다',
    description: '프로젝트 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '프론트 뷰, 백엔드 노드 개발자 구합니다',
    description: '프로젝트 내용',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '모집중',
    description: '모집중/모집완료',
    required: true,
    type: 'string',
    enum: ['모집중', '모집완료'],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['모집중', '모집완료'])
  ongoing: '모집중' | '모집완료';

  @ApiProperty({
    example: '2022-01-01',
    description: '모집을 진행하는 날짜',
    required: false,
  })
  @IsDate()
  @IsOptional()
  duedate?: Date | null;

  @ApiProperty({
    example: 2,
    description: '모집하는 참여자 수',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 2,
    description: '모집하는 참여자 수',
    required: false,
  })
  participant?: number | null;

  @ApiProperty({
    example: '프론트엔드 개발자',
    description: '프로젝트 포지션',
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
    required: true,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsNotEmpty()
  @IsString({ each: true })
  @Type(() => String)
  skills: string[];
}
