import { GetCountStudiesFromCategoryDto } from './dto/get-count-studies-from-category.dto';
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
import {
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('STUDY')
@Controller('api/studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @ApiOkResponse({
    description: '댓글 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'study id를 제대로 전달 하지 않은 경우',
  })
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

  @ApiResponse({
    status: 201,
    description: '댓글 생성 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'study id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '프로필을 작성하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 스터디를 찾을 수 없는 경우',
  })
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

  @ApiResponse({
    status: 200,
    description: '댓글 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'study id, comment id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '수정 권한이 없는 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 스터디나 해당 댓글을 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 스터디 글의 댓글 수정하기' })
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

  @ApiResponse({
    status: 200,
    description: '댓글 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'study id, comment id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '삭제 권한이 없는 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 스터디나 해당 댓글을 찾을 수 없는 경우',
  })
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

  @ApiResponse({
    status: 200,
    description: '스터디 개수 받아오기 성공',
  })
  @ApiOperation({ summary: '스터디 개수 받아오기' })
  @Get('/count')
  getCountOfStudies(@Query() query: GetCountStudiesFromCategoryDto) {
    return this.studiesService.getCount(query);
  }

  @ApiResponse({
    status: 200,
    description: '스터디 모두 받아오기 성공',
  })
  @ApiOperation({ summary: '모든 스터디 받아오기' })
  @Get()
  getAllStudies(@Query() query: GetStudiesDto) {
    return this.studiesService.getAllStudies(query);
  }

  @ApiResponse({
    status: 200,
    description: '해당 스터디 글 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'study id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 스터디글을 찾을 수 없는 경우',
  })
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

  @ApiResponse({
    status: 201,
    description: '스터디 모집 글 생성 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '프로필을 설정하지 않은 경우',
  })
  @ApiOperation({ summary: '스터디 글 작성하기' })
  @UseGuards(new LoggedInGuard())
  @Post()
  createStudy(
    @Body() body: CreateStudyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.studiesService.createStudy(body, user.id);
  }

  @ApiResponse({
    status: 200,
    description: '스터디 모집 글 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'study id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '수정권한이 없을 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 게시글을 찾을 수 없는 경우',
  })
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

  @ApiResponse({
    status: 200,
    description: '게시글 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'study id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '삭제권한이 없을 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 게시글을 찾을 수 없는 경우',
  })
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
}
