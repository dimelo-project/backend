import { PositiveIntPipe } from '../common/pipes/positiveInt.pipe';
import { GetCountTalksDto } from './dto/get-count-talks.dto';
import { UpdateTalkCommentDto } from './dto/update-talk-comment.dto';
import { CreateTalkCommentDto } from './dto/create-talk-comment.dto';
import { SearchTalkDto } from './dto/search-talk.dto';
import { UpdateTalkDto } from './dto/update-talk.dto';
import { GetTalksDto } from './dto/get-talks.dto';
import { TalksService } from './talks.service';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { CreateTalkDto } from './dto/create-talk.dto';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@ApiTags('TALK')
@Controller('api/talks')
export class TalksController {
  constructor(private readonly talksService: TalksService) {}
  @ApiOkResponse({
    description: '댓글 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'talk id를 제대로 전달 하지 않은 경우',
  })
  @ApiOperation({ summary: '해당 게시글의 댓글 모두 받아오기' })
  @ApiParam({
    name: 'talk_id',
    required: true,
    description: 'talk id',
  })
  @Get('/:talk_id/comments')
  async getAllCommentsOfTalk(
    @Param('talk_id', ParseIntPipe, PositiveIntPipe) talk_id: number,
  ) {
    return this.talksService.getAllTalkComments(talk_id);
  }

  @ApiResponse({
    status: 201,
    description: '댓글 생성 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'talk id를 제대로 전달 하지 않은 경우',
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
    description: '해당 게시글을 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 게시글에 댓글 작성하기' })
  @ApiParam({
    name: 'talk_id',
    required: true,
    description: 'talk id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('/:talk_id/comments')
  async createCommentOfTalk(
    @Param('talk_id', ParseIntPipe, PositiveIntPipe) talk_id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: CreateTalkCommentDto,
  ) {
    return this.talksService.createTalkComment(talk_id, user.id, body);
  }

  @ApiResponse({
    status: 200,
    description: '댓글 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'talk id, comment id를 제대로 전달 하지 않은 경우',
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
    description: '해당 게시글이나 해당 댓글을 찾을 수 없는 경우',
  })
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
  @UseGuards(new LoggedInGuard())
  @Patch('/:talk_id/comments/:id')
  async updateCommentOfTalk(
    @Param('talk_id', ParseIntPipe, PositiveIntPipe) talk_id: number,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: UpdateTalkCommentDto,
  ) {
    return this.talksService.updateTalkComment(talk_id, id, user.id, body);
  }

  @ApiResponse({
    status: 200,
    description: '댓글 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'talk id, comment id를 제대로 전달 하지 않은 경우',
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
  async deleteCommentOfTalk(
    @Param('talk_id', ParseIntPipe, PositiveIntPipe) talk_id: number,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.talksService.deleteTalkComment(talk_id, id, user.id);
  }

  @ApiResponse({
    status: 201,
    description: '키워드에 맞는 게시글 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'keyword를 전달하지 않았을 경우',
  })
  @ApiOperation({ summary: '해당 키워드의 글 개수 받아오기' })
  @Post('/search/count')
  async getCountOfTalksBySearch(
    @Query() query: GetCountTalksDto,
    @Body() body: SearchTalkDto,
  ) {
    return this.talksService.getCountBySearch(query, body.keyword);
  }

  @ApiResponse({
    status: 201,
    description: '키워드에 맞는 게시글 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'keyword를 전달하지 않았을 경우',
  })
  @ApiResponse({
    status: 404,
    description: '키워드에 해당하는 게시글이 없을 경우',
  })
  @ApiOperation({ summary: '해당 키워드의 글 검색하기' })
  @Post('/search')
  async searchTalk(@Query() query: GetTalksDto, @Body() body: SearchTalkDto) {
    return this.talksService.searchTalk(query, body.keyword);
  }

  @ApiResponse({
    status: 200,
    description: '게시글 개수 받아오기 성공',
  })
  @ApiOperation({ summary: '자유게시판 글 개수 가져오기' })
  @Get('/count')
  async getCountOfTalks(@Query() query: GetCountTalksDto) {
    return this.talksService.getCount(query);
  }

  @ApiResponse({
    status: 200,
    description: '내가 작성한 게시글 개수 가져오기 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내가 작성한 자유게시판 게시글 개수 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/me/count')
  async getCountOfMyTalks(@CurrentUser() user: CurrentUserDto) {
    return this.talksService.getCountMyTalks(user.id);
  }

  @ApiResponse({
    status: 200,
    description: '내가 쓴 게시글 받아오기 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '자유게시판 내가 쓴 글 가져오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/me')
  async getAllMyTalks(@CurrentUser() user: CurrentUserDto) {
    return this.talksService.getAllMyTalks(user.id);
  }

  @ApiResponse({
    status: 200,
    description: '게시글 모두 받아오기 성공',
  })
  @ApiOperation({ summary: '자유게시판 모든 글 가져오기' })
  @Get()
  async getAllTalks(@Query() query: GetTalksDto) {
    return this.talksService.getAllTalks(query);
  }

  @ApiResponse({
    status: 200,
    description: '해당 게시글 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'talk id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 게시글을 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '자유게시판 해당 글 가져오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'talk id',
  })
  @Get('/:id')
  getTalk(@Param('id', ParseIntPipe, PositiveIntPipe) id: number) {
    return this.talksService.getTalk(id);
  }

  @ApiResponse({
    status: 201,
    description: '게시글 생성 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '프로필을 설정하지 않은 경우',
  })
  @ApiOperation({ summary: '자유게시판 글 작성하기' })
  @UseGuards(new LoggedInGuard())
  @Post()
  async createTalk(
    @Body() body: CreateTalkDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.talksService.createTalk(body, user.id);
  }

  @ApiResponse({
    status: 200,
    description: '게시글 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'talk id를 제대로 전달 하지 않은 경우',
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
  @ApiOperation({ summary: '자유게시판 해당 글 수정하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'talk id',
  })
  @UseGuards(new LoggedInGuard())
  @Patch('/:id')
  async updateTalk(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: UpdateTalkDto,
  ) {
    return this.talksService.updateTalk(id, user.id, body);
  }

  @ApiResponse({
    status: 200,
    description: '게시글 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'talk id를 제대로 전달 하지 않은 경우',
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
  @ApiOperation({ summary: '자유게시판 해당 글 삭제하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'talk id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/:id')
  async deleteTalk(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.talksService.deleteTalk(id, user.id);
  }
}
