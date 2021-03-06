import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import sanitizeHtml from 'sanitize-html';

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
    description: '스터디 글 마크업을 포함한 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  markup: string;

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
  @IsString({ each: true })
  skills: string[];
}
