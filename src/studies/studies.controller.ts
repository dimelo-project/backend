import { UpdateStudyCommentDto } from './dto/update-study-comment.dto';
import { CreateStudyComment } from './dto/create-study-comment.dto';
import { GetStudiesDto } from './dto/get-studies.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { StudiesService } from './studies.service';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import { CreateStudyDto } from './dto/create-study.dto';
import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('STUDY')
@Controller('api/studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}
  @ApiOperation({ summary: '모든 스터디 받아오기' })
  @Get()
  getAllStudies(@Query() query: GetStudiesDto) {
    return this.studiesService.getAllStudies(query);
  }

  @ApiOperation({ summary: '해당 스터디 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'study id',
  })
  @Get('/:id')
  getStudy(@Param('id', ParseIntPipe) id: number) {
    return this.studiesService.getStudy(id);
  }

  @ApiOperation({ summary: '스터디 글 작성하기' })
  @UseGuards(new LoggedInGuard())
  @Post()
  createStudy(
    @Body() body: CreateStudyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.studiesService.createStudy(body, user.id);
  }

  @ApiOperation({ summary: '해당 스터디 글 수정하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'study id',
  })
  @UseGuards(new LoggedInGuard())
  @Patch('/:id')
  updateStudy(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: UpdateStudyDto,
  ) {
    return this.studiesService.updateStudy(id, user.id, body);
  }

  @ApiOperation({ summary: '해당 스터디 글 삭제하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'study id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/:id')
  deleteStudy(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.studiesService.deleteStudy(id, user.id);
  }

  @ApiOperation({ summary: '해당 스터디 글의 모든 댓글 받아오기' })
  @ApiParam({
    name: 'study_id',
    required: true,
    description: 'study id',
  })
  @Get('/:study_id/comments')
  getAllCommentsOfStudy(@Param('study_id', ParseIntPipe) study_id: number) {
    return this.studiesService.getAllStudyComments(study_id);
  }

  @ApiOperation({ summary: '해당 스터디 글에 댓글 작성하기' })
  @ApiParam({
    name: 'study_id',
    required: true,
    description: 'study id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('/:study_id/comments')
  createCommentOfStudy(
    @Param('study_id', ParseIntPipe) study_id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: CreateStudyComment,
  ) {
    return this.studiesService.createStudyComment(
      study_id,
      user.id,
      body.commentText,
    );
  }

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
  @UseGuards(new LoggedInGuard())
  @Patch('/:study_id/comments/:id')
  updateCommentOfStudy(
    @Param('study_id', ParseIntPipe) study_id: number,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: UpdateStudyCommentDto,
  ) {
    return this.studiesService.updateStudyComment(
      study_id,
      id,
      user.id,
      body.commentText,
    );
  }

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
  @UseGuards(new LoggedInGuard())
  @Delete('/:study_id/comments/:id')
  deleteCommentOfStudy(
    @Param('study_id', ParseIntPipe) study_id: number,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.studiesService.deleteStudyComment(study_id, id, user.id);
  }
}
