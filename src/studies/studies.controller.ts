import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('STUDY')
@Controller('api/studies')
export class StudiesController {
  @ApiOperation({ summary: '모든 스터디 받아오기' })
  @ApiQuery({
    name: 'skill',
    required: false,
    description: '필터링할 스킬',
  })
  @ApiQuery({
    name: 'ongoing',
    required: false,
    description: '모집중/모집완료',
  })
  @Get()
  getAllStudies(
    @Query('skill') skill: string,
    @Query('ongoing') ongoing: string,
  ) {}

  @ApiOperation({ summary: '해당 스터디 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'study id',
  })
  @Get('/:id')
  getStudy(@Param('id', ParseIntPipe) id: number) {}

  @ApiOperation({ summary: '스터디 글 작성하기' })
  @Post()
  createStudy() {}

  @ApiOperation({ summary: '해당 스터디 글 수정하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'study id',
  })
  @Patch('/:id')
  updateStudy(@Param('id', ParseIntPipe) id: number) {}

  @ApiOperation({ summary: '해당 스터디 글 삭제하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'study id',
  })
  @Delete('/:id')
  deleteStudy(@Param('id', ParseIntPipe) id: number) {}

  @ApiOperation({ summary: '해당 스터디 글의 모든 댓글 받아오기' })
  @ApiParam({
    name: 'study_id',
    required: true,
    description: 'study id',
  })
  @Get('/:study_id/comments')
  getAllCommentsOfStudy(@Param('study_id', ParseIntPipe) study_id: number) {}

  @ApiOperation({ summary: '해당 스터디 글에 댓글 작성하기' })
  @ApiParam({
    name: 'study_id',
    required: true,
    description: 'study id',
  })
  @Post('/:study_id/comments')
  createCommentOfStudy(@Param('study_id', ParseIntPipe) study_id: number) {}

  @ApiOperation({ summary: '해당 스터디 글의 댓글 수정하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'study id',
  })
  @ApiParam({
    name: 'study_id',
    required: true,
    description: 'study comment id',
  })
  @Patch('/:study_id/comments/:id')
  updateCommentOfStudy(
    @Param('study_id', ParseIntPipe) study_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @ApiOperation({ summary: '해당 스터디 글의 댓글 삭제하기' })
  @ApiParam({
    name: 'study_id',
    required: true,
    description: 'study id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'study comment id',
  })
  @Delete('/:study_id/comments/:id')
  deleteCommentOfStudy(
    @Param('study_id', ParseIntPipe) study_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}
}
