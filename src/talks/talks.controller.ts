import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('TALK')
@Controller('api/talks')
export class TalksController {
  @ApiOperation({ summary: '자유게시판 모든 글 자겨오기' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '카테고리 (개발, 데이터, 디자인, 기타)',
  })
  @Get()
  getAllTalks(@Query('category') category: string) {}

  @ApiOperation({ summary: '자유게시판 해당 글 가져오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'talk id',
  })
  @Get('/:id')
  getTalk(@Param('id', ParseIntPipe) id: number) {}

  @ApiOperation({ summary: '자유게시판 글 작성하기' })
  @Post()
  createTalk() {}

  @ApiOperation({ summary: '자유게시판 해당 글 수정하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'talk id',
  })
  @Patch('/:id')
  updateTalk(@Param('id', ParseIntPipe) id: number) {}

  @ApiOperation({ summary: '자유게시판 해당 글 삭제하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'talk id',
  })
  @Delete('/:id')
  deleteTalk(@Param('id', ParseIntPipe) id: number) {}

  @ApiOperation({ summary: '자유게시판 글 검색하기' })
  @ApiQuery({
    name: 'keyword',
    required: true,
    description: '제목 검색할 키워드',
  })
  @Get('/search')
  searchTalk(@Query('keyword') keyword: string) {}

  @ApiOperation({ summary: '해당 게시글의 댓글 모두 받아오기' })
  @ApiParam({
    name: 'talk_id',
    required: true,
    description: 'talk id',
  })
  @Get('/:talk_id/comments')
  getAllCommentsOfTalk(@Param('talk_id', ParseIntPipe) talk_id: number) {}

  @ApiOperation({ summary: '해당 게시글에 댓글 작성하기' })
  @ApiParam({
    name: 'talk_id',
    required: true,
    description: 'talk id',
  })
  @Post('/:talk_id/comments')
  createCommentOfTalk(@Param('talk_id', ParseIntPipe) talk_id: number) {}

  @ApiOperation({ summary: '해당 게시글의 해당 댓글 수정하기' })
  @ApiParam({
    name: 'talk_id',
    required: true,
    description: 'talk id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'talk comment id',
  })
  @Patch('/:talk_id/comments/:id')
  updateCommentOfTalk(
    @Param('talk_id', ParseIntPipe) talk_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @ApiOperation({ summary: '해당 게시글의 해당 댓글 삭제하기' })
  @ApiParam({
    name: 'talk_id',
    required: true,
    description: 'talk id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'talk comment id',
  })
  @Delete('/:talk_id/comments/:id')
  deleteCommentOfTalk(
    @Param('talk_id', ParseIntPipe) talk_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}
}
