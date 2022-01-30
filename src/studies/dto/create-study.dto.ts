import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStudyDto {
  @ApiProperty({
    example: '자바스크립트 같이 공부해요',
    description: '스터디 제목 (50자이내)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    example: '자바스크립트 딥다이브로 같이 공부해요',
    description: '스터디 내용',
    required: true,
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
    example: 2,
    description: '모집하는 참여자 수',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  participant: number | null;

  @ApiProperty({
    example: 'JavaScript',
    type: 'string',
    description:
      '스터디 할 기술 (복수 가능: 복수 데이터 보낼 때 ","로 나눠서 보냄)',
    required: true,
  })
  @Transform(({ value }) => value.split(','))
  @IsNotEmpty()
  @IsString()
  skills: string[];
}
