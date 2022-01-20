import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTalkDto {
  @ApiProperty({
    example: '개발',
    description: '자유게시판 카테고리',
    required: true,
  })
  @IsEnum(['개발', '데이터', '디자인', '기타'])
  @IsString()
  @IsNotEmpty()
  category: '개발' | '데이터' | '디자인' | '기타';

  @ApiProperty({
    example: '웹개발 로드맵 질문',
    description: '자유게시판 제목',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '프론트엔드 개발 로드맵 짜주세요',
    description: '자유게시판 글 내용',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
