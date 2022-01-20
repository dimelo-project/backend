import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTalkCommentDto {
  @ApiProperty({
    example: '이거 추천합니다',
    description: '자유게시판 글 댓글',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  commentText: string;
}
