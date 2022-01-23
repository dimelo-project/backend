import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudyDto {
  @ApiProperty({
    example: '자바스크립트 같이 공부해요',
    description: '스터디 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
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
  duedate: Date | null;

  @ApiProperty({
    example: 2,
    description: '모집하는 참여자 수',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  participant: number | null;

  @ApiProperty({
    example: 'JavaScript',
    description:
      '스터디 할 기술 (복수 가능: 복수 데이터 보낼 때 ","로 나눠서 보냄)',
    required: true,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsNotEmpty()
  skills: string[];
}
