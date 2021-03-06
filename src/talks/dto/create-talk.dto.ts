import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export class CreateTalkDto {
  @ApiProperty({
    example: '개발',
    description: '자유게시판 카테고리',
    required: true,
    type: 'string',
    enum: ['개발', '데이터', '디자인', '기타'],
  })
  @IsEnum(['개발', '데이터', '디자인', '기타'])
  @IsString()
  @IsNotEmpty()
  category: '개발' | '데이터' | '디자인' | '기타';

  @ApiProperty({
    example: '웹개발 로드맵 질문',
    description: '자유게시판 제목 (50자이내)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    example: '프론트엔드 개발 로드맵 짜주세요',
    description: '자유게시판 글 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '자유게시판 글 마크업을 포함한 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  markup: string;
}
