import { PositiveIntPipe } from '../common/pipes/positiveInt.pipe';
import { GetCountProjectsDto } from './dto/get-count-projects.dto';
import { GetProjectsDto } from './dto/get-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  Controller,
  Get,
  Query,
  Param,
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
  ApiParam,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProjectCommentDto } from './dto/create-project-comment.dto';

@ApiTags('PROJECT')
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOkResponse({
    description: '댓글 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'project id를 제대로 전달 하지 않은 경우',
  })
  @ApiOperation({ summary: '해당 프로젝트의 모든 댓글 받아오기' })
  @ApiParam({
    name: 'project_id',
    required: true,
    description: 'project id',
  })
  @Get('/:project_id/comments')
  async getAllCommentsOfProject(
    @Param('project_id', ParseIntPipe, PositiveIntPipe) project_id: number,
  ) {
    return this.projectsService.getAllProjectComments(project_id);
  }

  @ApiResponse({
    status: 201,
    description: '댓글 생성 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'project id를 제대로 전달 하지 않은 경우',
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
    description: '해당 프로젝트를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 프로젝트에 댓글 작성하기' })
  @ApiParam({
    name: 'project_id',
    required: true,
    description: 'project id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('/:project_id/comments')
  async createCommentOfProject(
    @Param('project_id', ParseIntPipe, PositiveIntPipe) project_id: number,
    @Body() body: CreateProjectCommentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.createProjectComment(
      project_id,
      body.commentText,
      user.id,
    );
  }

  @ApiResponse({
    status: 200,
    description: '댓글 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'project id, comment id를 제대로 전달 하지 않은 경우',
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
    description: '해당 프로젝트나 해당 댓글을 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 프로젝트의 해당 댓글 수정하기' })
  @ApiParam({
    name: 'project_id',
    required: true,
    description: 'project id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project comment id',
  })
  @UseGuards(new LoggedInGuard())
  @Patch('/:project_id/comments/:id')
  async updateCommentOfProject(
    @Param('project_id', ParseIntPipe, PositiveIntPipe) project_id: number,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() body: CreateProjectCommentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.updateProjectComment(
      project_id,
      id,
      body.commentText,
      user.id,
    );
  }

  @ApiResponse({
    status: 200,
    description: '댓글 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'project id, comment id를 제대로 전달 하지 않은 경우',
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
    description: '해당 프로젝트나 해당 댓글을 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 프로젝트의 해당 댓글 삭제하기' })
  @ApiParam({
    name: 'project_id',
    required: true,
    description: 'project id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project comment id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/:project_id/comments/:id')
  async deleteCommentOfProject(
    @Param('project_id', ParseIntPipe, PositiveIntPipe) project_id: number,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.deleteProjectComment(project_id, id, user.id);
  }

  @ApiResponse({
    status: 200,
    description: '프로젝트 개수 받아오기 성공',
  })
  @ApiOperation({ summary: '모든 프로젝트 개수 받아오기' })
  @Get('/count')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project id',
  })
  async getCountOfProjects(@Query() query: GetCountProjectsDto) {
    return this.projectsService.getCount(query);
  }

  @ApiResponse({
    status: 200,
    description: '내가 작성한 프로젝트 개수 가져오기 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내가 작성한 프로젝트 개수 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/me/count')
  async getCountOfMyProjects(@CurrentUser() user: CurrentUserDto) {
    return this.projectsService.getCountMyProjects(user.id);
  }

  @ApiResponse({
    status: 200,
    description: '내가 작성한 프로젝트 모두 받아오기 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내가 작성한 프로젝트 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/me')
  async getAllMyProjects(@CurrentUser() user: CurrentUserDto) {
    return this.projectsService.getAllMyProjects(user.id);
  }

  @ApiResponse({
    status: 200,
    description: '최신 모집중 프로젝트 2개 받아오기',
  })
  @ApiOperation({ summary: '메인페이지 최신 프로젝트 받아오기' })
  @Get('/main')
  async getProjectsFromMain() {
    return this.projectsService.getProjectsFromMain();
  }

  @ApiResponse({
    status: 200,
    description: '프로젝트 모두 받아오기 성공',
  })
  @ApiOperation({ summary: '모든 프로젝트 받아오기' })
  @Get()
  async getAllProjects(@Query() query: GetProjectsDto) {
    return this.projectsService.getAllProjects(query);
  }

  @ApiResponse({
    status: 200,
    description: '해당 프로젝트 글 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'project id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 프로젝트글을 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 프로젝트 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project id',
  })
  @Get('/:id')
  async getProject(@Param('id', ParseIntPipe, PositiveIntPipe) id: number) {
    return this.projectsService.getProject(id);
  }

  @ApiResponse({
    status: 201,
    description: '프로젝트 모집 글 생성 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '프로필을 설정하지 않은 경우',
  })
  @ApiOperation({ summary: '프로젝트 글 작성하기' })
  @UseGuards(new LoggedInGuard())
  @Post()
  async createProject(
    @Body() body: CreateProjectDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.createProject(body, user.id);
  }

  @ApiResponse({
    status: 200,
    description: '프로젝트 모집 글 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'project id를 제대로 전달 하지 않은 경우',
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
  @ApiOperation({ summary: '해당 프로젝트 글 수정하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project id',
  })
  @UseGuards(new LoggedInGuard())
  @Patch('/:id')
  async updateProject(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() body: UpdateProjectDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.updateProject(id, body, user.id);
  }

  @ApiResponse({
    status: 200,
    description: '게시글 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'project id를 제대로 전달 하지 않은 경우',
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
  @ApiOperation({ summary: '해당 프로젝트 글 삭제하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/:id')
  async deleteProject(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.deleteProject(id, user.id);
  }
}
