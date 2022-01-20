import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTalksByCategoryDto {
  @ApiProperty({
    example: '개발',
    description: '자유게시판 카테고리',
    required: false,
  })
  @IsEnum(['개발', '데이터', '디자인', '기타'])
  @IsString()
  @IsOptional()
  category: '개발' | '데이터' | '디자인' | '기타';
}
